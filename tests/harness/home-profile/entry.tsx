// Development-only UI fixture setup exercising the real provider and Home.
import React from 'react';
import {createRoot} from 'react-dom/client';
import {AppProvider, useApp} from '../../../src/context/AppContext';
import {HomeScreen} from '../../../src/screens/HomeScreen';
import '../../../src/index.css';

function Fixture() {
  const app = useApp();
  return <>
    <button onClick={()=>app.updateProfile({interests:[],communicationModes:[],supportStrategies:[]})}>Limpar campos sintéticos do resumo</button>
    <main id="main-content"><HomeScreen onOpenNewObservation={()=>{}} onSelectObservation={()=>{}}/></main>
  </>;
}
createRoot(document.getElementById('root')!).render(<AppProvider><Fixture/></AppProvider>);
