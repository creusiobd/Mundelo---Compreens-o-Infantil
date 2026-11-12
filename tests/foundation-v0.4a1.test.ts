/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  resolveObservationConflict,
  resolveObservationBatch,
  compareObservationContent,
} from '../src/security/conflictResolver';
import { DomainConcurrencyManager } from '../src/security/domainLock';
import {
  computeStatistics,
  generateSyntheticScenarioPayload,
  runScenarioBenchmark,
} from '../src/crypto/benchmark';
import { MOCK_OBSERVATIONS, MOCK_CAREGIVERS } from '../src/data/mockData';
import { Observation } from '../src/types';

describe('MUNDELO — Foundation v0.4A.1 (Fechamento de Riscos Residuais SEC-14, SEC-17, SEC-18, SEC-23)', () => {
  const baseObs: Observation = structuredClone(
    MOCK_OBSERVATIONS.find((o) => o.childId === 'tomas')!
  );

  // =========================================================================
  // FASE 2 — SEC-14: Política Determinística de Merge e Resolução de Conflitos
  // =========================================================================
  describe('SEC-14: Resolução Determinística de Conflitos (resolveObservationConflict & resolveObservationBatch)', () => {
    it('1. Registro ausente localmente deve retornar INSERT', () => {
      const incoming: Observation = {
        ...structuredClone(baseObs),
        id: 'obs-new-sec14',
      };
      const res = resolveObservationConflict(undefined, incoming, 'tomas');
      assert.equal(res.action, 'INSERT');
      assert.equal(res.observation?.id, 'obs-new-sec14');
    });

    it('2. Revisão recebida menor que a local deve retornar KEEP e preservar registro local', () => {
      const existing: Observation = {
        ...structuredClone(baseObs),
        revision: 3,
        description: 'Versão Local Mais Recente (Rev 3)',
      };
      const incoming: Observation = {
        ...structuredClone(baseObs),
        revision: 1,
        description: 'Versão Antiga do Cofre (Rev 1)',
      };

      const res = resolveObservationConflict(existing, incoming, 'tomas');
      assert.equal(res.action, 'KEEP');
      assert.equal(res.observation?.revision, 3);
      assert.equal(res.observation?.description, 'Versão Local Mais Recente (Rev 3)');
    });

    it('3. Revisão igual e conteúdo canônico idêntico (mesmo com chaves em ordem distinta) deve retornar NOOP', () => {
      const existing: Observation = structuredClone(baseObs);
      // Construir objeto com chaves na ordem inversa para provar independência de JSON.stringify
      const incomingReversedKeys: Observation = {
        notes: existing.notes,
        positiveAspects: existing.positiveAspects,
        observedOutcome: existing.observedOutcome,
        supportOffered: existing.supportOffered,
        communicationSignals: existing.communicationSignals,
        antecedents: existing.antecedents,
        description: existing.description,
        eventType: existing.eventType,
        observerRole: existing.observerRole,
        environment: existing.environment,
        occurredAt: existing.occurredAt,
        revision: existing.revision,
        recordedAt: existing.recordedAt,
        provenance: existing.provenance,
        observedByCaregiverId: existing.observedByCaregiverId,
        recordedByCaregiverId: existing.recordedByCaregiverId,
        childId: existing.childId,
        id: existing.id,
        contextDetails: existing.contextDetails
          ? {
              peoplePresent: existing.contextDetails.peoplePresent
                ? [...existing.contextDetails.peoplePresent]
                : undefined,
              antecedents: existing.contextDetails.antecedents,
              locationDetail: existing.contextDetails.locationDetail,
              environment: existing.contextDetails.environment,
            }
          : undefined,
        evidenceDetails: existing.evidenceDetails
          ? {
              positiveAspects: existing.evidenceDetails.positiveAspects,
              observedOutcome: existing.evidenceDetails.observedOutcome,
              supportOffered: existing.evidenceDetails.supportOffered,
              communicationSignals: existing.evidenceDetails.communicationSignals,
            }
          : undefined,
      };

      const diff = compareObservationContent(existing, incomingReversedKeys);
      assert.equal(diff.isIdentical, true);

      const res = resolveObservationConflict(existing, incomingReversedKeys, 'tomas');
      assert.equal(res.action, 'NOOP');
    });

    it('4. Revisão igual e conteúdo divergente deve retornar CONFLICT (proibido last-write-wins)', () => {
      const existing: Observation = structuredClone(baseObs);
      const incomingDivergent: Observation = {
        ...structuredClone(baseObs),
        description: 'Descrição conflitante na mesma revisão 1 sem incremento de revisão.',
        supportOffered: 'Outra estratégia conflitante.',
      };

      const res = resolveObservationConflict(existing, incomingDivergent, 'tomas');
      assert.equal(res.action, 'CONFLICT');
      assert.ok(res.divergentFields?.includes('description'));
      assert.ok(res.divergentFields?.includes('supportOffered'));
      assert.match(res.reason, /mesma revisão.*os dados divergem/i);
    });

    it('5. Revisão maior com mudanças válidas e campos imutáveis preservados deve retornar UPDATE', () => {
      const existing: Observation = structuredClone(baseObs);
      const incomingHigherRev: Observation = {
        ...structuredClone(baseObs),
        revision: existing.revision + 1,
        description: 'Descrição atualizada legitimamente na revisão 2',
        updatedAt: '2025-05-15T12:00:00.000Z',
      };

      const res = resolveObservationConflict(existing, incomingHigherRev, 'tomas');
      assert.equal(res.action, 'UPDATE');
      assert.equal(res.observation?.revision, existing.revision + 1);
      assert.equal(res.observation?.description, 'Descrição atualizada legitimamente na revisão 2');
    });

    it('6. Revisão maior tentando adulterar campos imutáveis (recordedByCaregiverId ou recordedAt) deve retornar CONFLICT', () => {
      const existing: Observation = structuredClone(baseObs);
      const incomingTamperedAuthor: Observation = {
        ...structuredClone(baseObs),
        revision: existing.revision + 1,
        recordedByCaregiverId: 'cg-celso', // Adulteração de autor original
      };

      const resAuthor = resolveObservationConflict(existing, incomingTamperedAuthor, 'tomas');
      assert.equal(resAuthor.action, 'CONFLICT');
      assert.ok(resAuthor.divergentFields?.includes('recordedByCaregiverId'));
      assert.match(resAuthor.reason, /campos imutáveis/i);

      const incomingTamperedTimestamp: Observation = {
        ...structuredClone(baseObs),
        revision: existing.revision + 1,
        recordedAt: '2020-01-01T00:00:00.000Z', // Adulteração de timestamp original
      };

      const resTimestamp = resolveObservationConflict(existing, incomingTamperedTimestamp, 'tomas');
      assert.equal(resTimestamp.action, 'CONFLICT');
      assert.ok(resTimestamp.divergentFields?.includes('recordedAt'));
    });

    it('7. ID conflitante pertencente a outra criança deve retornar CONFLICT', () => {
      const existingLiaObs = structuredClone(
        MOCK_OBSERVATIONS.find((o) => o.childId === 'lia')!
      );
      // Tentativa de importar registro com ID da Lia mas apontando para Tomás
      const incomingCrossChild: Observation = {
        ...structuredClone(existingLiaObs),
        childId: 'tomas',
      };

      const res = resolveObservationConflict(existingLiaObs, incomingCrossChild, 'tomas');
      assert.equal(res.action, 'CONFLICT');
      assert.ok(res.divergentFields?.includes('childId'));
      assert.match(res.reason, /Colisão de identificador/i);
    });

    it('8. Lote de merge com 1 conflito após registros válidos deve abortar o lote inteiro (atomicidade transacional)', () => {
      const tomasExisting = MOCK_OBSERVATIONS.filter((o) => o.childId === 'tomas');
      const snapshotBefore = structuredClone(MOCK_OBSERVATIONS);

      const validInsert: Observation = {
        ...structuredClone(baseObs),
        id: 'obs-batch-valid-new',
        description: 'Novo registro válido no lote',
      };
      const validUpdate: Observation = {
        ...structuredClone(tomasExisting[0]),
        revision: tomasExisting[0].revision + 1,
        description: 'Atualização válida no lote',
      };
      const conflictingSameRev: Observation = {
        ...structuredClone(tomasExisting[1]),
        // Mesma revisão, mas descrição alterada -> CONFLICT
        description: 'Adulteração silenciosa na mesma revisão',
      };

      const batchResult = resolveObservationBatch(
        MOCK_OBSERVATIONS,
        [validInsert, validUpdate, conflictingSameRev],
        'tomas'
      );

      assert.equal(batchResult.success, false);
      assert.equal(batchResult.actionCounts.CONFLICT, 1);
      assert.equal(batchResult.conflicts[0].incomingId, tomasExisting[1].id);
      // Estado retornado deve ser idêntico ao snapshot original (nenhuma mutação parcial aplicada)
      assert.deepEqual(batchResult.resolvedObservations, snapshotBefore);
    });

    it('9. Importação repetida do mesmo cofre deve ser 100% idempotente (todos NOOP)', () => {
      const tomasExisting = structuredClone(
        MOCK_OBSERVATIONS.filter((o) => o.childId === 'tomas')
      );

      const firstBatch = resolveObservationBatch(MOCK_OBSERVATIONS, tomasExisting, 'tomas');
      assert.equal(firstBatch.success, true);
      assert.equal(firstBatch.actionCounts.NOOP, tomasExisting.length);
      assert.equal(firstBatch.actionCounts.INSERT, 0);
      assert.equal(firstBatch.actionCounts.UPDATE, 0);
      assert.equal(firstBatch.actionCounts.CONFLICT, 0);
    });
  });

  // =========================================================================
  // FASE 3 — SEC-17 / SEC-18: Concorrência no Domínio e Cancelamento Lógico
  // =========================================================================
  describe('SEC-17 & SEC-18: DomainConcurrencyManager (Operações Concorrentes e Mudança de Contexto)', () => {
    let manager: DomainConcurrencyManager;

    beforeEach(() => {
      manager = new DomainConcurrencyManager();
    });

    it('10. Duas operações concorrentes reais com Promises/barreiras devem rejeitar a segunda e preservar o lock da primeira', async () => {
      const firstAcquire = manager.acquireLock('VAULT_EXPORT', 'tomas', 'cg-helena');
      assert.equal(firstAcquire.acquired, true);
      assert.equal(manager.isLocked(), true);

      // Simular operação concorrente tentando iniciar enquanto a primeira aguarda PBKDF2
      const secondAcquirePromise = Promise.resolve().then(() =>
        manager.acquireLock('VAULT_IMPORT', 'tomas', 'cg-helena')
      );

      const secondAcquire = await secondAcquirePromise;
      assert.equal(secondAcquire.acquired, false);
      assert.match(secondAcquire.error || '', /Operação concorrente bloqueada/i);

      // Primeira operação ainda pode validar commit normalmente
      if (firstAcquire.acquired && firstAcquire.snapshot) {
        const helena = MOCK_CAREGIVERS.find((c) => c.id === 'cg-helena')!;
        const validation = manager.validateCommit(
          firstAcquire.snapshot.operationId,
          'tomas',
          helena.id,
          helena.status,
          helena.linkedChildIds.includes('tomas')
        );
        assert.equal(validation.canCommit, true);
        manager.releaseLock(firstAcquire.snapshot.operationId);
      }
      assert.equal(manager.isLocked(), false);
    });

    it('11. Troca de criança durante operação assíncrona deve cancelar logicamente o commit (SEC-18)', async () => {
      const lock = manager.acquireLock('VAULT_IMPORT', 'tomas', 'cg-helena');
      assert.equal(lock.acquired, true);
      if (!lock.snapshot) return;

      // Simular usuário trocando o perfil ativo para 'lia' enquanto PBKDF2/preview está aberto
      manager.incrementGeneration();

      const helena = MOCK_CAREGIVERS.find((c) => c.id === 'cg-helena')!;
      const commitValidation = manager.validateCommit(
        lock.snapshot.operationId,
        'lia',
        helena.id,
        helena.status,
        helena.linkedChildIds.includes('lia')
      );

      assert.equal(commitValidation.canCommit, false);
      assert.match(commitValidation.reason || '', /Cancelamento lógico|criança ativa foi alterada/i);

      manager.releaseLock(lock.snapshot.operationId);
      assert.equal(manager.isLocked(), false);
    });

    it('12. Troca de cuidador durante pré-visualização deve rejeitar o commit (SEC-18)', () => {
      const lock = manager.acquireLock('VAULT_IMPORT', 'tomas', 'cg-helena');
      assert.equal(lock.acquired, true);
      if (!lock.snapshot) return;

      // Cuidador mudou de Helena para outro cuidador antes do commit
      const otherCaregiver = MOCK_CAREGIVERS.find((c) => c.id !== 'cg-helena')!;
      const commitValidation = manager.validateCommit(
        lock.snapshot.operationId,
        'tomas',
        otherCaregiver.id,
        otherCaregiver.status,
        otherCaregiver.linkedChildIds.includes('tomas')
      );

      assert.equal(commitValidation.canCommit, false);
      assert.match(commitValidation.reason || '', /cuidador ativo foi alterado/i);

      manager.releaseLock(lock.snapshot.operationId);
    });

    it('13. Revogação simulada de vínculo ou suspensão do cuidador antes do commit deve rejeitar a operação', () => {
      const lock = manager.acquireLock('VAULT_IMPORT', 'tomas', 'cg-helena');
      assert.equal(lock.acquired, true);
      if (!lock.snapshot) return;

      const validationSuspended = manager.validateCommit(
        lock.snapshot.operationId,
        'tomas',
        'cg-helena',
        'SUSPENDED',
        true
      );
      assert.equal(validationSuspended.canCommit, false);
      assert.match(validationSuspended.reason || '', /não possui status ACTIVE/i);

      const validationUnlinked = manager.validateCommit(
        lock.snapshot.operationId,
        'tomas',
        'cg-helena',
        'ACTIVE',
        false
      );
      assert.equal(validationUnlinked.canCommit, false);
      assert.match(validationUnlinked.reason || '', /foi revogado antes do commit/i);

      manager.releaseLock(lock.snapshot.operationId);
    });
  });

  // =========================================================================
  // FASE 4 — SEC-23: Motor de Benchmark e Sanitização de Relatório
  // =========================================================================
  describe('SEC-23: Motor de Benchmark Criptográfico e Sanitização de Relatórios', () => {
    it('14. computeStatistics deve calcular corretamente Min, Mediana, Média, P90, P95 e Max', () => {
      const values = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
      const stats = computeStatistics(120, values);

      assert.equal(stats.warmupMs, 120);
      assert.equal(stats.minMs, 100);
      assert.equal(stats.medianMs, 550);
      assert.equal(stats.meanMs, 550);
      assert.equal(stats.p90Ms, 900);
      assert.equal(stats.p95Ms, 1000);
      assert.equal(stats.maxMs, 1000);
    });

    it('15. generateSyntheticScenarioPayload para NEAR_5MB_LIMIT deve respeitar o limite de observações e aproximar-se de 5 MB no envelope', () => {
      const payload = generateSyntheticScenarioPayload('NEAR_5MB_LIMIT');
      assert.equal(payload.observations.length, 1500);
      const serializedBytes = new TextEncoder().encode(JSON.stringify(payload)).byteLength;
      // ~3.2 MB em JSON puro -> ~4.4 MB em Base64 envelope (abaixo de 5 MB)
      assert.ok(serializedBytes > 2_500_000, `Esperado > 2.5MB, obtido ${serializedBytes}`);
      assert.ok(serializedBytes < 4_000_000, `Esperado < 4.0MB, obtido ${serializedBytes}`);
    });

    it('16. runScenarioBenchmark (SMALL) deve executar warm-up + amostras medidas e não vazar senhas ou textos das observações', async () => {
      const result = await runScenarioBenchmark('SMALL', 2, 100_000);
      assert.equal(result.measuredSamples.length, 2);
      assert.equal(result.warmupSample.isWarmup, true);
      assert.ok(result.stats.totalRoundtrip.minMs > 0);

      const serializedReport = JSON.stringify(result);
      assert.equal(serializedReport.includes('Bench-Synthetic-Key-'), false);
      assert.equal(serializedReport.includes('Observação sintética de benchmark'), false);
    });

    it('17. Security Lab deve estar estritamente protegido por import.meta.env.DEV e ausente do bundle de produção (dist/)', () => {
      const appSource = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf-8');
      assert.ok(appSource.includes('import.meta.env.DEV'));
      assert.ok(appSource.includes("import('./screens/SecurityLabScreen')"));

      const distAssetsDir = path.resolve(process.cwd(), 'dist/assets');
      if (fs.existsSync(distAssetsDir)) {
        const files = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith('.js'));
        assert.ok(files.length > 0, 'Deve existir ao menos um arquivo JS no bundle de produção');
        for (const file of files) {
          const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf-8');
          assert.equal(
            content.includes('MUNDELO_SEC23_BENCHMARK_V1'),
            false,
            `String de benchmark encontrada no bundle de produção: ${file}`
          );
          assert.equal(
            content.includes('Laboratório de Benchmark Criptográfico'),
            false,
            `Título do Security Lab encontrado no bundle de produção: ${file}`
          );
        }
      }
    });
  });
});
