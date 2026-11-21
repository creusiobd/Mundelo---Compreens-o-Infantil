import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {encryptVault, decryptVault, base64ToUint8Array, uint8ArrayToBase64} from '../src/crypto/vault';
import {VaultPayload} from '../src/crypto/types';

const legacy = JSON.parse(readFileSync(new URL('./fixtures/vault-v1-synthetic.json', import.meta.url), 'utf8'));
const password = 'Legacy-Synthetic-2026';

describe('QA-F03: envelope v2 mínimo e compatibilidade v1', () => {
  it('importa fixture v1 gerada antes da alteração e reexporta somente em v2', async () => {
    const payload = await decryptVault(legacy, password);
    assert.equal(payload.childProfile.id, 'tomas');
    const envelope = await encryptVault(payload, password, 100000);
    assert.equal(envelope.formatVersion, 2);
    assert.deepEqual(Object.keys(envelope).sort(), ['ciphertext', 'crypto', 'format', 'formatVersion']);
    const header = JSON.stringify({...envelope, ciphertext: undefined});
    assert.equal(header.includes(payload.childProfile.name), false);
    assert.equal(header.includes(payload.childProfile.id), false);
    assert.equal(new TextDecoder().decode(base64ToUint8Array(envelope.crypto.aad)), 'MUNDELO_VAULT:2');
    assert.deepEqual(await decryptVault(envelope, password), payload);
  });

  for (const key of ['childName', 'childId', 'recordCount']) {
    it(`rejeita adulteração do cabeçalho legado: ${key}`, async () => {
      const forged = {...legacy, [key]: key === 'recordCount' ? 999 : key === 'exportedAt' ? '2026-11-22T00:00:00.000Z' : 'other'};
      await assert.rejects(() => decryptVault(forged, password), /AAD|integridade|isolamento/);
    });
  }

  it('rejeita campos pessoais e extensões não previstas no envelope v2', async () => {
    const payload = await decryptVault(legacy, password);
    const envelope = await encryptVault(payload, password, 100000);
    for (const extra of [{childName:'Tomás'}, {childId:'tomas'}, {recordCount:7}, {exportedAt:payload.exportedAt}, {crypto:{...envelope.crypto, childId:'tomas'}}]) {
      await assert.rejects(() => decryptVault({...envelope,...extra}, password), /Unrecognized key/);
    }
  });

  it('rejeita troca de versão e adulteração de AAD v2', async () => {
    const envelope = await encryptVault(await decryptVault(legacy, password), password, 100000);
    await assert.rejects(() => decryptVault({...envelope, formatVersion:1}, password));
    await assert.rejects(() => decryptVault({...envelope, crypto:{...envelope.crypto, aad:uint8ArrayToBase64(new TextEncoder().encode('MUNDELO_VAULT:1:lia'))}}, password), /AAD/);
  });

  it('rejeita observação entre crianças em payload cifrado autenticado', async () => {
    const payload: VaultPayload = await decryptVault(legacy, password);
    const forgedPayload = {...payload, observations:[{...payload.observations[0], childId:'lia'}]};
    const envelope = await encryptVault(forgedPayload, password, 100000);
    await assert.rejects(() => decryptVault(envelope, password), /Vazamento detectado/);
  });

  it('preserva limites criptográficos ao importar v1', async () => {
    await assert.rejects(() => decryptVault({...legacy, crypto:{...legacy.crypto, kdfIterations:1000001}}, password), /excessivas/);
    await assert.rejects(() => decryptVault(legacy, 'incorrect-password'), /senha incorreta/);
    const bytes = base64ToUint8Array(legacy.ciphertext); bytes[0] ^= 1;
    await assert.rejects(() => decryptVault({...legacy, ciphertext:uint8ArrayToBase64(bytes)}, password), /adulterado/);
  });
});
