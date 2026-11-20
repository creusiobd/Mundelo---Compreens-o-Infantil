import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DomainConcurrencyManager } from '../src/security/domainLock';

test('validateCommit rejeita trava expirada sem depender de consulta prévia a isLocked', () => {
  const originalNow = Date.now;
  let now = 1000;
  Date.now = () => now;
  try {
    const manager = new DomainConcurrencyManager(100);
    const lock = manager.acquireLock('VAULT_EXPORT', 'synthetic-child', 'synthetic-actor');
    now += 101;
    assert.equal(manager.validateCommit(lock.snapshot!.operationId, 'synthetic-child', 'synthetic-actor', 'ACTIVE', true).canCommit, false);
    assert.equal(manager.isLocked(), false);
  } finally { Date.now = originalNow; }
});
test('operação expirada não confirma nem libera uma trava posterior', () => {
  const originalNow = Date.now;
  let now = 1000;
  Date.now = () => now;
  try {
    const manager = new DomainConcurrencyManager(100);
    const old = manager.acquireLock('VAULT_EXPORT', 'synthetic-child', 'synthetic-actor');
    now += 101;
    const next = manager.acquireLock('VAULT_EXPORT', 'synthetic-child', 'synthetic-actor');
    assert.equal(next.acquired, true);
    assert.equal(manager.validateCommit(old.snapshot!.operationId, 'synthetic-child', 'synthetic-actor', 'ACTIVE', true).canCommit, false);
    assert.equal(manager.releaseLock(old.snapshot!.operationId), false);
    assert.equal(manager.validateCommit(next.snapshot!.operationId, 'synthetic-child', 'synthetic-actor', 'ACTIVE', true).canCommit, true);
  } finally { Date.now = originalNow; }
});
