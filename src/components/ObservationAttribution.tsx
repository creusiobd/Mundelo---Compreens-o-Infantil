import React from 'react';
import type {Caregiver, Observation} from '../types';
import {observationAttribution} from '../presentation/observationAttribution';

export function ObservationAttribution({observation,caregivers}: {observation:Observation;caregivers:Caregiver[]}) {
  return <div role="group" aria-label="Autoria e proveniência do registro" className="text-xs text-[#265358] bg-[#F8F5EF] p-3 rounded-xl">
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {observationAttribution(observation,caregivers).map(({label,value})=><div key={label}>
        <dt className="font-semibold text-[#133E43]">{label}:</dt>
        <dd>{value}</dd>
      </div>)}
    </dl>
  </div>;
}
