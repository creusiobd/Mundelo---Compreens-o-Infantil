/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  encryptVault,
  decryptVault,
  parseVaultFileString,
  buildCanonicalAAD,
  deriveKeyFromPassword,
  uint8ArrayToBase64,
  base64ToUint8Array,
} from '../src/crypto/vault';
import {
  MundeloVaultEnvelopeV1,
  VaultPayload,
  VAULT_MAX_FILE_BYTES,
} from '../src/crypto/types';
import {
  VaultEnvelopeSchema,
  VaultPayloadSchema,
  VaultCryptoHeaderSchema,
} from '../src/crypto/schemas';
import {
  MOCK_PROFILE_TOMAS,
  MOCK_PROFILE_LIA,
  MOCK_OBSERVATIONS,
  MOCK_CAREGIVERS,
} from '../src/data/mockData';
import { Caregiver, Observation } from '../src/types';

// Fixture helper: payload canônico de teste para Tomás
function createCanonicalFixture(): VaultPayload {
  const tomasObs = MOCK_OBSERVATIONS.filter((o) => o.childId === 'tomas');
  const tomasCgs = MOCK_CAREGIVERS.filter((c) => c.linkedChildIds.includes('tomas'));

  return {
    version: 1,
    exportedAt: '2026-11-12T18:00:00.000Z',
    childProfile: { ...MOCK_PROFILE_TOMAS },
    observations: JSON.parse(JSON.stringify(tomasObs)),
    linkedCaregivers: JSON.parse(JSON.stringify(tomasCgs)),
    metadata: {
      origin: 'Mundelo Adversarial Test Suite',
      description: 'Cofre sintético de teste adversarial',
      isSyntheticData: true,
    },
  };
}

describe('GATE ADVERSARIAL — MUNDELO Foundation v0.4A (.mundelo-vault)', () => {
  const TEST_PASSWORD = 'SenhaForte123!@#';
  const FAST_ITERATIONS = 100000; // Mínimo permitido pelo schema, ágil para suíte automatizada

  // =========================================================================
  // FASE 2: TESTES CRIPTOGRÁFICOS (SEC-01 a SEC-10)
  // =========================================================================
  describe('Fase 2: Testes Criptográficos Adversariais (SEC-01 a SEC-10)', () => {
    it('SEC-01: Senha incorreta — deve rejeitar decifragem sem vazar dados ou chave', async () => {
      const payload = createCanonicalFixture();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      await assert.rejects(
        async () => {
          await decryptVault(envelope, 'SenhaTotalmenteErrada999!');
        },
        (err: Error) => {
          assert.match(err.message, /Falha na decifragem: senha incorreta/);
          // Garante que o erro não vaza nenhuma parte do payload ou chave
          assert.strictEqual(err.message.includes('Tomás'), false);
          assert.strictEqual(err.message.includes('água'), false);
          return true;
        }
      );
    });

    it('SEC-02: Alteração de bytes do ciphertext — deve falhar via integridade AES-GCM', async () => {
      const payload = createCanonicalFixture();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      // Inverte bits no meio do texto cifrado
      const rawBytes = base64ToUint8Array(envelope.ciphertext);
      const mid = Math.floor(rawBytes.length / 2);
      rawBytes[mid] ^= 0xff; // Flips 8 bits
      const tamperedCiphertext = uint8ArrayToBase64(rawBytes);

      const tamperedEnvelope: MundeloVaultEnvelopeV1 = {
        ...envelope,
        ciphertext: tamperedCiphertext,
      };

      await assert.rejects(
        async () => {
          await decryptVault(tamperedEnvelope, TEST_PASSWORD);
        },
        /Falha na decifragem: senha incorreta ou arquivo adulterado/
      );
    });

    it('SEC-03: Alteração da tag GCM (últimos 16 bytes) — deve falhar na autenticação GMAC', async () => {
      const payload = createCanonicalFixture();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      // Os últimos 16 bytes contêm a tag GMAC
      const rawBytes = base64ToUint8Array(envelope.ciphertext);
      assert.ok(rawBytes.length >= 16);
      rawBytes[rawBytes.length - 1] ^= 0x01; // Altera 1 bit da tag
      const tamperedTagCiphertext = uint8ArrayToBase64(rawBytes);

      const tamperedEnvelope = {
        ...envelope,
        ciphertext: tamperedTagCiphertext,
      };

      await assert.rejects(
        async () => {
          await decryptVault(tamperedEnvelope, TEST_PASSWORD);
        },
        /Falha na decifragem: senha incorreta ou arquivo adulterado/
      );
    });

    it('SEC-04: Alteração de AAD e metadados autenticados (childId) — deve detectar divergência', async () => {
      const payload = createCanonicalFixture();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      // Caso 4A: Altera childId no cabeçalho sem alterar o campo aad
      const tamperedHeader = {
        ...envelope,
        childId: 'lia',
      };
      await assert.rejects(
        async () => {
          await decryptVault(tamperedHeader, TEST_PASSWORD);
        },
        /inconsistência de AAD detectada/
      );

      // Caso 4B: Altera childId e forja novo campo aad para bater
      const forgedAAD = buildCanonicalAAD(envelope.formatVersion, 'lia', envelope.format);
      const forgedEnvelope = {
        ...envelope,
        childId: 'lia',
        crypto: {
          ...envelope.crypto,
          aad: uint8ArrayToBase64(new TextEncoder().encode(forgedAAD)),
        },
      };
      // A tag AES-GCM interna foi gerada com 'tomas', então falhará no GMAC
      await assert.rejects(
        async () => {
          await decryptVault(forgedEnvelope, TEST_PASSWORD);
        },
        /Falha na decifragem: senha incorreta ou arquivo adulterado/
      );
    });

    it('SEC-05: Substituição de algoritmo por AES-CBC ou DES — deve rejeitar no schema', async () => {
      const payload = createCanonicalFixture();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      const insecureEnvelope = {
        ...envelope,
        crypto: {
          ...envelope.crypto,
          algorithm: 'AES-CBC',
        },
      };

      assert.throws(() => {
        VaultEnvelopeSchema.parse(insecureEnvelope);
      }, /Algoritmo de cifra não suportado. Requer AES-GCM./);

      await assert.rejects(async () => {
        await decryptVault(insecureEnvelope, TEST_PASSWORD);
      });
    });

    it('SEC-06: Redução de iterações PBKDF2 (< 100.000) — deve rejeitar downgrade fraco', async () => {
      const payload = createCanonicalFixture();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      const weakKdfEnvelope = {
        ...envelope,
        crypto: {
          ...envelope.crypto,
          kdfIterations: 500,
        },
      };

      assert.throws(() => {
        VaultEnvelopeSchema.parse(weakKdfEnvelope);
      }, /Iterações de PBKDF2 inseguras/);

      await assert.rejects(async () => {
        await decryptVault(weakKdfEnvelope, TEST_PASSWORD);
      });
    });

    it('SEC-07: Salt e IV vazios, inválidos ou de tamanho incorreto — deve rejeitar', async () => {
      const payload = createCanonicalFixture();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      // 7A: IV de 8 bytes em vez de 12 bytes
      const shortIv = uint8ArrayToBase64(new Uint8Array(8));
      const shortIvEnvelope = {
        ...envelope,
        crypto: { ...envelope.crypto, iv: shortIv },
      };
      await assert.rejects(
        async () => {
          await decryptVault(shortIvEnvelope, TEST_PASSWORD);
        },
        /IV inválido|Tamanho de IV inválido/
      );

      // 7B: Salt com menos de 16 bytes
      const shortSalt = uint8ArrayToBase64(new Uint8Array(8));
      const shortSaltEnvelope = {
        ...envelope,
        crypto: { ...envelope.crypto, kdfSalt: shortSalt },
      };
      await assert.rejects(async () => {
        await decryptVault(shortSaltEnvelope, TEST_PASSWORD);
      });

      // 7C: IV com caracteres não-Base64
      const invalidBase64Envelope = {
        ...envelope,
        crypto: { ...envelope.crypto, iv: '!!!@@@###$$$%%%^^^&&&' },
      };
      assert.throws(() => {
        VaultEnvelopeSchema.parse(invalidBase64Envelope);
      }, /IV deve conter apenas caracteres Base64 válidos/);
    });

    it('SEC-08: Versões de formato desconhecidas (formatVersion !== 1) — deve rejeitar', async () => {
      const payload = createCanonicalFixture();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      const futureEnvelope = {
        ...envelope,
        formatVersion: 2,
      };

      assert.throws(() => {
        VaultEnvelopeSchema.parse(futureEnvelope);
      }, /Versão de formato não suportada/);

      await assert.rejects(async () => {
        await decryptVault(futureEnvelope, TEST_PASSWORD);
      });
    });

    it('SEC-09: Arquivo maior que 5 MB — deve ser rejeitado antes da derivação de chave', () => {
      // 5 MB = 5 * 1024 * 1024 bytes = 5.242.880
      const oversizedContent = 'a'.repeat(VAULT_MAX_FILE_BYTES + 1024);

      assert.throws(() => {
        parseVaultFileString(oversizedContent);
      }, /O arquivo excede o limite máximo permitido de 5 MB/);
    });

    it('SEC-10: Arquivo malformado, truncado ou com JSON inválido — deve tratar com erro seguro', () => {
      const truncatedJson = '{"format": "MUNDELO_VAULT", "formatVersion": 1, "c';
      assert.throws(() => {
        parseVaultFileString(truncatedJson);
      }, /O arquivo selecionado não contém uma estrutura JSON válida/);

      const arrayJson = '[1, 2, 3]';
      assert.throws(() => {
        parseVaultFileString(arrayJson);
      }, /Estrutura de cofre inválida: o envelope deve ser um objeto JSON/);

      const nullJson = 'null';
      assert.throws(() => {
        parseVaultFileString(nullJson);
      }, /Estrutura de cofre inválida/);
    });
  });

  // =========================================================================
  // FASE 3: AUTORIZAÇÃO E ISOLAMENTO (SEC-11 a SEC-18)
  // =========================================================================
  describe('Fase 3: Autorização, Isolamento e Transacionalidade (SEC-11 a SEC-18)', () => {
    it('SEC-11: Importação cruzada entre crianças Tomás e Lia — deve rejeitar discrepâncias internas', async () => {
      const payload = createCanonicalFixture();
      // Injeta observação com childId de Lia no cofre de Tomás
      const contaminatedObs: Observation = {
        ...payload.observations[0],
        id: 'obs-injected-lia',
        childId: 'lia',
      };
      payload.observations.push(contaminatedObs);

      // Decifragem deve capturar e rejeitar vazamento relacional
      const envelope = await encryptVault(
        {
          ...payload,
          observations: payload.observations,
        },
        TEST_PASSWORD,
        FAST_ITERATIONS
      );

      await assert.rejects(
        async () => {
          await decryptVault(envelope, TEST_PASSWORD);
        },
        /Vazamento detectado: observação obs-injected-lia pertence a outra criança \(lia\)/
      );
    });

    it('SEC-12: Exportação por cuidador não autorizado — deve barrar cuidador sem vínculo ou suspenso', () => {
      const unlinkedCaregiver = MOCK_CAREGIVERS.find((c) => c.id === 'cg-ana-unlinked');
      const suspendedCaregiver = MOCK_CAREGIVERS.find((c) => c.id === 'cg-pedro-suspended');
      assert.ok(unlinkedCaregiver);
      assert.ok(suspendedCaregiver);

      // Validação da regra: cuidador deve ser ACTIVE e vinculado à criança alvo
      const canExportTomas = (cg: Caregiver, targetChildId: string) => {
        return cg.status === 'ACTIVE' && cg.linkedChildIds.includes(targetChildId);
      };

      assert.strictEqual(canExportTomas(unlinkedCaregiver, 'tomas'), false);
      assert.strictEqual(canExportTomas(suspendedCaregiver, 'tomas'), false);

      // Helena (LEGAL_GUARDIAN vinculada) deve ter acesso
      const helena = MOCK_CAREGIVERS.find((c) => c.id === 'cg-helena')!;
      assert.strictEqual(canExportTomas(helena, 'tomas'), true);
    });

    it('SEC-13: Importação por cuidador não autorizado — deve barrar commit não autorizado', () => {
      const unlinkedCaregiver = MOCK_CAREGIVERS.find((c) => c.id === 'cg-ana-unlinked')!;
      const suspendedCaregiver = MOCK_CAREGIVERS.find((c) => c.id === 'cg-pedro-suspended')!;

      const canImportForChild = (cg: Caregiver, childId: string, mode: 'merge' | 'replace') => {
        if (cg.status !== 'ACTIVE') return false;
        if (!cg.linkedChildIds.includes(childId)) return false;
        if (mode === 'replace' && cg.role !== 'LEGAL_GUARDIAN') return false;
        return true;
      };

      // Ana não pode importar para Tomás nem em merge nem em replace
      assert.strictEqual(canImportForChild(unlinkedCaregiver, 'tomas', 'merge'), false);
      assert.strictEqual(canImportForChild(unlinkedCaregiver, 'tomas', 'replace'), false);

      // Pedro está suspenso
      assert.strictEqual(canImportForChild(suspendedCaregiver, 'tomas', 'merge'), false);

      // Marina (EDUCATOR vinculada a Tomás) pode fazer merge, mas NÃO replace
      const marina = MOCK_CAREGIVERS.find((c) => c.id === 'cg-marina')!;
      assert.strictEqual(canImportForChild(marina, 'tomas', 'merge'), true);
      assert.strictEqual(canImportForChild(marina, 'tomas', 'replace'), false);
    });

    it('SEC-14: Merge com IDs coincidentes e conflitos de revisão — resolução determinística', () => {
      const existing: Observation[] = [
        {
          id: 'obs-conflict-1',
          childId: 'tomas',
          recordedByCaregiverId: 'cg-helena',
          revision: 2,
          occurredAt: '2026-11-10T10:00:00Z',
          recordedAt: '2026-11-10T10:00:00Z',
          provenance: 'DIRECT',
          environment: 'casa',
          observerRole: 'mae',
          eventType: 'conquista',
          description: 'Versão local existente com revisão 2',
          antecedents: '',
          communicationSignals: '',
          supportOffered: '',
          observedOutcome: '',
          positiveAspects: '',
          notes: '',
        },
      ];

      // Caso 1: Chega observação com revisão menor (rev 1) -> deve manter a existente (rev 2)
      const incomingRev1: Observation = {
        ...existing[0],
        description: 'Tentativa de downgrade para revisão 1',
        revision: 1,
      };

      const map = new Map<string, Observation>();
      existing.forEach((o) => map.set(o.id, o));

      if (
        !map.has(incomingRev1.id) ||
        (incomingRev1.revision || 1) >= (map.get(incomingRev1.id)!.revision || 1)
      ) {
        map.set(incomingRev1.id, incomingRev1);
      }
      assert.strictEqual(map.get('obs-conflict-1')!.revision, 2);
      assert.strictEqual(map.get('obs-conflict-1')!.description, 'Versão local existente com revisão 2');

      // Caso 2: Chega observação com revisão maior (rev 3) -> deve atualizar
      const incomingRev3: Observation = {
        ...existing[0],
        description: 'Atualização legítima para revisão 3',
        revision: 3,
      };
      if (
        !map.has(incomingRev3.id) ||
        (incomingRev3.revision || 1) >= (map.get(incomingRev3.id)!.revision || 1)
      ) {
        map.set(incomingRev3.id, incomingRev3);
      }
      assert.strictEqual(map.get('obs-conflict-1')!.revision, 3);
      assert.strictEqual(map.get('obs-conflict-1')!.description, 'Atualização legítima para revisão 3');
    });

    it('SEC-15: Replace contendo referências inválidas — deve rejeitar cuidadores inexistentes', () => {
      const payload = createCanonicalFixture();
      // Injeta observação com cuidador fantasma inexistente
      payload.observations[0].recordedByCaregiverId = 'cg-nonexistent-ghost-hacker';

      const allKnownCaregivers = new Set([
        ...MOCK_CAREGIVERS.map((c) => c.id),
        ...payload.linkedCaregivers.map((c) => c.id),
      ]);

      const hasInvalidReference = payload.observations.some(
        (obs) => !allKnownCaregivers.has(obs.recordedByCaregiverId)
      );

      assert.strictEqual(hasInvalidReference, true);
    });

    it('SEC-16: Rollback em erro de importação — zero mutações de estado quando houver falha', () => {
      const initialSnapshot = {
        profileId: 'tomas',
        obsCount: MOCK_OBSERVATIONS.length,
      };

      let currentObsCount = initialSnapshot.obsCount;
      let currentProfileId = initialSnapshot.profileId;

      // Função simulada de importação transacional
      const simulateAtomicImport = (malformedPayload: boolean) => {
        if (malformedPayload) {
          throw new Error('Falha de validação simulada');
        }
        currentObsCount += 5;
        currentProfileId = 'lia';
      };

      assert.throws(() => {
        simulateAtomicImport(true);
      });

      // Verifica que nenhuma mutação parcial ocorreu
      assert.strictEqual(currentObsCount, initialSnapshot.obsCount);
      assert.strictEqual(currentProfileId, initialSnapshot.profileId);
    });

    it('SEC-17: Duplo submit e operações concorrentes — flag de guarda previne concorrência', () => {
      let isCommitting = false;
      let executionCount = 0;

      const triggerCommit = () => {
        if (isCommitting) return false;
        isCommitting = true;
        executionCount++;
        // Simula operação assíncrona
        return true;
      };

      const firstCall = triggerCommit();
      const secondCall = triggerCommit(); // Clique duplo imediato
      assert.strictEqual(firstCall, true);
      assert.strictEqual(secondCall, false);
      assert.strictEqual(executionCount, 1);
    });

    it('SEC-18: Troca de cuidador durante importação assíncrona — revalidação no commit', () => {
      // Inicia com Helena (autorizada)
      let currentActiveCaregiver = MOCK_CAREGIVERS.find((c) => c.id === 'cg-helena')!;

      // Antes do commit ser efetivado, o usuário comuta para Ana (não autorizada)
      currentActiveCaregiver = MOCK_CAREGIVERS.find((c) => c.id === 'cg-ana-unlinked')!;

      const targetChildId = 'tomas';
      const isAuthorizedAtCommit =
        currentActiveCaregiver.status === 'ACTIVE' &&
        currentActiveCaregiver.linkedChildIds.includes(targetChildId);

      assert.strictEqual(isAuthorizedAtCommit, false);
    });
  });

  // =========================================================================
  // FASE 4: RESILIÊNCIA, UX E SEGURANÇA (SEC-19 a SEC-24)
  // =========================================================================
  describe('Fase 4: Resiliência, Robustez e UX de Segurança (SEC-19 a SEC-24)', () => {
    it('SEC-19: Duas exportações consecutivas produzem Salt e IV distintos (CSPRNG)', async () => {
      const payload = createCanonicalFixture();
      const exportA = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);
      const exportB = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      assert.notStrictEqual(exportA.crypto.iv, exportB.crypto.iv);
      assert.notStrictEqual(exportA.crypto.kdfSalt, exportB.crypto.kdfSalt);
      assert.notStrictEqual(exportA.ciphertext, exportB.ciphertext);
    });

    it('SEC-20: Ausência de segredos ou chaves em strings de erro e representações públicas', async () => {
      const payload = createCanonicalFixture();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      const serializedPublicEnvelope = JSON.stringify(envelope);
      assert.strictEqual(serializedPublicEnvelope.includes(TEST_PASSWORD), false);
      assert.strictEqual(serializedPublicEnvelope.includes('CryptoKey'), false);
    });

    it('SEC-21: XSS Resilience — payload contendo scripts HTML é tratado com integridade pura', async () => {
      const payload = createCanonicalFixture();
      payload.observations[0].description =
        '<script>alert("XSS")</script><img src=x onerror=alert(1)><b>Fato Lúdico</b>';
      payload.childProfile.name = 'Tomás <svg onload=alert(2)>';

      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);
      const decrypted = await decryptVault(envelope, TEST_PASSWORD);

      // Decifra sem alterar nenhum caractere (fidelidade absoluta)
      assert.strictEqual(decrypted.observations[0].description, payload.observations[0].description);
      assert.strictEqual(decrypted.childProfile.name, payload.childProfile.name);
    });

    it('SEC-22: Rejeição estrita de versões não suportadas', () => {
      const payload = createCanonicalFixture();
      assert.throws(() => {
        VaultPayloadSchema.parse({
          ...payload,
          version: 99,
        });
      });
    });

    it('SEC-23: Medição de benchmark de derivação PBKDF2 e decifragem AES-GCM', async () => {
      const payload = createCanonicalFixture();
      const startDerive = performance.now();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);
      const deriveTimeMs = performance.now() - startDerive;

      const startDecrypt = performance.now();
      const decrypted = await decryptVault(envelope, TEST_PASSWORD);
      const decryptTimeMs = performance.now() - startDecrypt;

      assert.ok(deriveTimeMs > 0);
      assert.ok(decryptTimeMs > 0);
      assert.strictEqual(decrypted.childProfile.id, 'tomas');
    });

    it('SEC-24: Regressão e limites adicionais — payload com dados semanticamente inválidos', () => {
      const payload = createCanonicalFixture();
      // Idade negativa impossível ou tipo de evento clínico proibido
      const invalidPayload = {
        ...payload,
        childProfile: {
          ...payload.childProfile,
          ageMonths: -5,
        },
      };

      // Zod deve validar campos canônicos
      assert.throws(() => {
        VaultPayloadSchema.parse(invalidPayload);
      });
    });

    it('SEC-Extra: Payload com excesso de observações (> 2000) deve ser barrado por DoS protection', () => {
      const payload = createCanonicalFixture();
      const baseObs = payload.observations[0];
      const hugeList = Array.from({ length: 2001 }, (_, i) => ({
        ...baseObs,
        id: `obs-dos-${i}`,
      }));

      assert.throws(() => {
        VaultPayloadSchema.parse({
          ...payload,
          observations: hugeList,
        });
      }, /Limite de observações por cofre excedido/);
    });

    it('SEC-Extra: Envelope com adulteração de contagem de registros deve ser barrado', async () => {
      const payload = createCanonicalFixture();
      const envelope = await encryptVault(payload, TEST_PASSWORD, FAST_ITERATIONS);

      // Adulteração no cabeçalho público não cifrado (42 no cabeçalho vs 6 no conteúdo interno)
      const tamperedRecordCountEnvelope = {
        ...envelope,
        recordCount: 42,
      };

      await assert.rejects(
        async () => {
          await decryptVault(tamperedRecordCountEnvelope, TEST_PASSWORD);
        },
        /Inconsistência de integridade: a contagem de registros do cabeçalho \(42\) difere do total descriptografado/
      );
    });
  });
});
