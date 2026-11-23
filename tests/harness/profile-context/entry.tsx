// Test-only Vite development entry. Not referenced by the production application.
import React, {useLayoutEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {AppProvider, useApp} from '../../../src/context/AppContext';
import {MOCK_CAREGIVERS} from '../../../src/data/mockData';
import {MyWorldScreen} from '../../../src/screens/MyWorldScreen';
import {OnboardingScreen} from '../../../src/screens/OnboardingScreen';

// Synthetic fixture setup before mounting the real provider; no policy mocks.
MOCK_CAREGIVERS.push(
  {id:'test-guardian-unlinked',displayName:'Guardião fictício sem vínculo',role:'LEGAL_GUARDIAN',status:'ACTIVE',linkedChildIds:[]},
  {id:'test-guardian-suspended',displayName:'Guardião fictício suspenso',role:'LEGAL_GUARDIAN',status:'SUSPENDED',linkedChildIds:['tomas']},
  {id:'test-guardian-invited',displayName:'Guardião fictício convidado',role:'LEGAL_GUARDIAN',status:'INVITED',linkedChildIds:['tomas']},
);

function Probe() {
  const app = useApp();
  const current = useRef(app);
  useLayoutEffect(() => {
    current.current = app;
    (window as any).__profileContext = app;
    (window as any).__invokeProfileCommand = (name: string, args: unknown[], captured = false) => {
      let result: unknown;
      const source = captured ? (window as any).__capturedProfileContext : current.current;
      flushSync(() => { result = (source as any)[name](...args); });
      return result;
    };
  });
  return <>
    <label>Harness cuidador<select aria-label="Harness cuidador" value={app.activeCaregiver.id} onChange={e=>app.switchCaregiver(e.target.value)}>
      {app.caregivers.map(c=><option key={c.id} value={c.id}>{c.displayName}</option>)}
    </select></label>
    <label>Harness criança<select aria-label="Harness criança" value={app.activeProfile.id} onChange={e=>app.switchProfile(e.target.value)}>
      {app.availableProfiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
    </select></label>
    <output data-testid="state">{JSON.stringify({profiles:app.availableProfiles,observations:app.allObservations})}</output>
    <section data-testid="world"><MyWorldScreen/></section>
    <section data-testid="onboarding"><OnboardingScreen/></section>
  </>;
}
createRoot(document.getElementById('root')!).render(<AppProvider><Probe/></AppProvider>);
