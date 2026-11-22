import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ObservationSchema, SupportStrategySchema} from '../src/validation/schemas';
import {migrateObservationV2ToV3, migrateObservationBatch} from '../src/validation/migration';
import {VaultPayloadSchema} from '../src/crypto/schemas';
import {MOCK_PROFILE_TOMAS, MOCK_CAREGIVERS, MOCK_OBSERVATIONS} from '../src/data/mockData';

const complete = {...MOCK_OBSERVATIONS[0]};
for (const field of ['recordedByCaregiverId', 'provenance', 'occurredAt', 'recordedAt', 'environment', 'observerRole', 'eventType', 'childId', 'id'] as const) {
  test('PG06-52: entrada e migração rejeitam metadado ausente: ' + field, () => {
    const input: Record<string, unknown> = {...complete};
    delete input[field];
    assert.equal(ObservationSchema.safeParse(input).success, false);
    assert.throws(() => migrateObservationV2ToV3(input));
    assert.throws(() => migrateObservationBatch([complete, input]));
  });
}
test('PG06-52: campos opcionais ausentes não se tornam experiência ou interpretação', () => {
  const input: Record<string, unknown> = {...complete};
  const fields = ['antecedents','communicationSignals','supportOffered','observedOutcome','positiveAspects','notes'] as const;
  for (const f of fields) delete input[f];
  delete input.observedByCaregiverId;
  const parsed = ObservationSchema.parse(input);
  for (const f of fields) assert.equal(parsed[f], '');
  assert.equal(parsed.observedByCaregiverId, undefined);
  const explicit = ObservationSchema.parse({...input, supportOffered:'Sem intervenção, conforme relatado', observedOutcome:'Não observado'});
  assert.equal(explicit.supportOffered, 'Sem intervenção, conforme relatado');
  assert.equal(explicit.observedOutcome, 'Não observado');
});
test('PG06-52: estratégia incompleta conserva lacunas sem calma ou contexto presumidos', () => {
  const parsed = SupportStrategySchema.parse({id:'synthetic', strategy:'Proposta ainda sem relato'});
  assert.equal(parsed.context, '');
  assert.equal(parsed.observedResponse, '');
});
test('PG06-52: cofre incompleto não obtém Helena ou DIRECT ao validar', () => {
  const payload = {version:1, exportedAt:'2026-11-21T10:00:00.000Z', childProfile:MOCK_PROFILE_TOMAS, observations:[complete], linkedCaregivers:MOCK_CAREGIVERS, metadata:{origin:'test',description:'synthetic',isSyntheticData:true}};
  assert.equal(VaultPayloadSchema.safeParse(payload).success, true);
  for (const field of ['recordedByCaregiverId','provenance']) {
    const input = structuredClone(payload);
    delete (input.observations[0] as any)[field];
    const result = VaultPayloadSchema.safeParse(input);
    assert.equal(result.success, false);
    if (!result.success) assert.ok(result.error.issues.some(e => e.path.join('.') === 'observations.0.' + field));
  }
});
test('PG06-52: migração preserva registro completo e não infere observador a partir do registrador', () => {
  const migrated = migrateObservationV2ToV3(complete);
  for (const [key, value] of Object.entries(complete)) assert.deepEqual((migrated as any)[key], value);
  const {observedByCaregiverId: _observer, ...input} = complete;
  assert.equal(migrateObservationV2ToV3(input).observedByCaregiverId, undefined);
});
