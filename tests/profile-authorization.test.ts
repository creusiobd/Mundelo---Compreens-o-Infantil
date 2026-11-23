import {test} from 'node:test';
import assert from 'node:assert/strict';
import {canReadChildProfile, canManageChildProfile, canCreateObservation} from '../src/security/authorization';
import type {Caregiver} from '../src/types';

for (const role of ['LEGAL_GUARDIAN','FAMILY_CAREGIVER','EDUCATOR','PROFESSIONAL'] as const) {
  for (const status of ['ACTIVE','INVITED','SUSPENDED'] as const) {
    for (const linked of [false,true]) {
      test('PG06-53: perfil '+[role,status,linked?'vinculado':'sem vínculo'].join('/'), () => {
        const actor: Caregiver = {id:'synthetic', displayName:'Synthetic', role,status,linkedChildIds:linked?['tomas']:['lia']};
        const read = status==='ACTIVE' && linked;
        assert.equal(canReadChildProfile(actor,'tomas'),read);
        assert.equal(canManageChildProfile(actor,'tomas'),read && role==='LEGAL_GUARDIAN');
        // Independent observation policy stays available to active linked caregivers.
        assert.equal(canCreateObservation(actor,'tomas'),read);
      });
    }
  }
}
for (const actor of [null,undefined]) {
  test('PG06-53: identidade ausente '+String(actor), () => {
    assert.equal(canReadChildProfile(actor,'tomas'),false);
    assert.equal(canManageChildProfile(actor,'tomas'),false);
  });
}
test('PG06-53: criança ausente ou papel não reconhecido não concede gestão', () => {
  const actor: Caregiver = {id:'synthetic',displayName:'Synthetic',role:'LEGAL_GUARDIAN',status:'ACTIVE',linkedChildIds:['tomas']};
  assert.equal(canManageChildProfile(actor,''),false);
  assert.equal(canReadChildProfile(actor,''),false);
  assert.equal(canManageChildProfile({...actor,role:'UNKNOWN' as any},'tomas'),false);
});
