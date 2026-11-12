/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  MOCK_CAREGIVERS,
  MOCK_OBSERVATIONS,
} from '../src/data/mockData';
import {
  validateCaregiver,
  validateObservation,
  safeValidateObservation,
} from '../src/validation/schemas';
import {
  canReadObservation,
  canCreateObservation,
  canEditObservation,
  canDeleteObservation,
  canIncludeInReport,
} from '../src/security/authorization';
import {
  migrateObservationV2ToV3,
  migrateObservationBatch,
} from '../src/validation/migration';
import { Observation } from '../src/types';

describe('Suite de Testes Automatizados — MUNDELO Foundation v0.3', () => {
  const helena = MOCK_CAREGIVERS.find((c) => c.id === 'cg-helena')!; // LEGAL_GUARDIAN [tomas, lia]
  const carlos = MOCK_CAREGIVERS.find((c) => c.id === 'cg-carlos')!; // LEGAL_GUARDIAN [tomas, lia]
  const clara = MOCK_CAREGIVERS.find((c) => c.id === 'cg-clara')!; // FAMILY_CAREGIVER [tomas]
  const marina = MOCK_CAREGIVERS.find((c) => c.id === 'cg-marina')!; // EDUCATOR [tomas]
  const leonardo = MOCK_CAREGIVERS.find((c) => c.id === 'cg-leonardo')!; // PROFESSIONAL [lia]
  const anaUnlinked = MOCK_CAREGIVERS.find((c) => c.id === 'cg-ana-unlinked')!; // FAMILY_CAREGIVER []
  const pedroSuspended = MOCK_CAREGIVERS.find((c) => c.id === 'cg-pedro-suspended')!; // FAMILY_CAREGIVER [tomas] SUSPENDED

  // 1. Integridade Referencial do Modelo de Cuidadores
  describe('1. Modelo Canônico de Cuidadores e Integridade Referencial', () => {
    it('deve validar todos os cuidadores simulados com papéis e status válidos', () => {
      assert.ok(MOCK_CAREGIVERS.length >= 7, 'Deve haver ao menos 7 cuidadores simulados');
      for (const cg of MOCK_CAREGIVERS) {
        const validated = validateCaregiver(cg);
        assert.ok(validated.id);
        assert.ok(validated.displayName);
        assert.ok(['LEGAL_GUARDIAN', 'FAMILY_CAREGIVER', 'EDUCATOR', 'PROFESSIONAL'].includes(validated.role));
        assert.ok(['ACTIVE', 'INVITED', 'SUSPENDED'].includes(validated.status));
      }
    });

    it('deve assegurar que todas as observações apontam para um cuidador existente', () => {
      const caregiverIds = new Set(MOCK_CAREGIVERS.map((c) => c.id));
      for (const obs of MOCK_OBSERVATIONS) {
        assert.ok(
          caregiverIds.has(obs.recordedByCaregiverId),
          `Observação ${obs.id} tem cuidador registrador inexistente: ${obs.recordedByCaregiverId}`
        );
      }
    });

    it('deve confirmar que os vínculos com crianças são explícitos', () => {
      assert.deepEqual(helena.linkedChildIds, ['tomas', 'lia']);
      assert.deepEqual(carlos.linkedChildIds, ['tomas', 'lia']);
      assert.deepEqual(clara.linkedChildIds, ['tomas']);
      assert.deepEqual(marina.linkedChildIds, ['tomas']);
      assert.deepEqual(leonardo.linkedChildIds, ['lia']);
      assert.deepEqual(anaUnlinked.linkedChildIds, []);
      assert.equal(pedroSuspended.status, 'SUSPENDED');
    });
  });

  // 2. Políticas Demonstrativas de Autorização (Least Privilege & Default Deny)
  describe('2. Políticas Demonstrativas de Autorização (Deny-by-Default)', () => {
    const tomasObsByHelena = MOCK_OBSERVATIONS.find(
      (o) => o.childId === 'tomas' && o.recordedByCaregiverId === 'cg-helena'
    )!;
    const tomasObsByClara = MOCK_OBSERVATIONS.find(
      (o) => o.childId === 'tomas' && o.recordedByCaregiverId === 'cg-clara'
    )!;
    const tomasObsByMarina = MOCK_OBSERVATIONS.find(
      (o) => o.childId === 'tomas' && o.recordedByCaregiverId === 'cg-marina'
    )!;
    const liaObsByLeonardo = MOCK_OBSERVATIONS.find(
      (o) => o.childId === 'lia' && o.recordedByCaregiverId === 'cg-leonardo'
    )!;

    it('canReadObservation: deve permitir leitura apenas a cuidadores ativos com vínculo à criança', () => {
      // Helena tem vínculo com Tomás e Lia
      assert.equal(canReadObservation(helena, tomasObsByHelena), true);
      assert.equal(canReadObservation(helena, liaObsByLeonardo), true);

      // Clara só tem vínculo com Tomás
      assert.equal(canReadObservation(clara, tomasObsByHelena), true);
      assert.equal(canReadObservation(clara, liaObsByLeonardo), false, 'Clara não pode ler observações de Lia');

      // Leonardo só tem vínculo com Lia
      assert.equal(canReadObservation(leonardo, liaObsByLeonardo), true);
      assert.equal(canReadObservation(leonardo, tomasObsByHelena), false, 'Leonardo não pode ler de Tomás');

      // Ana não tem vínculo com nenhuma criança
      assert.equal(canReadObservation(anaUnlinked, tomasObsByHelena), false);

      // Pedro está suspenso
      assert.equal(canReadObservation(pedroSuspended, tomasObsByHelena), false);
    });

    it('canCreateObservation: deve autorizar criação apenas para cuidador ativo e vinculado', () => {
      assert.equal(canCreateObservation(helena, 'tomas'), true);
      assert.equal(canCreateObservation(clara, 'tomas'), true);
      assert.equal(canCreateObservation(clara, 'lia'), false, 'Clara não pode criar para Lia');
      assert.equal(canCreateObservation(leonardo, 'lia'), true);
      assert.equal(canCreateObservation(leonardo, 'tomas'), false, 'Leonardo não pode criar para Tomás');
      assert.equal(canCreateObservation(anaUnlinked, 'tomas'), false);
      assert.equal(canCreateObservation(pedroSuspended, 'tomas'), false);
    });

    it('canEditObservation: guardião legal edita tudo da criança vinculada; outros apenas suas próprias', () => {
      // Helena (LEGAL_GUARDIAN vinculada a Tomás) pode editar observação de Clara
      assert.equal(canEditObservation(helena, tomasObsByClara), true);

      // Clara (FAMILY_CAREGIVER) pode editar sua própria observação
      assert.equal(canEditObservation(clara, tomasObsByClara), true);

      // Clara NÃO pode editar observação criada por Helena
      assert.equal(
        canEditObservation(clara, tomasObsByHelena),
        false,
        'Cuidador familiar não pode editar observação criada por outro cuidador'
      );

      // Clara NÃO pode editar observação criada por Marina
      assert.equal(canEditObservation(clara, tomasObsByMarina), false);

      // Leonardo (vinculado a Lia) não edita nada de Tomás
      assert.equal(canEditObservation(leonardo, tomasObsByClara), false);

      // Cuidador sem vínculo ou suspenso não edita nada
      assert.equal(canEditObservation(anaUnlinked, tomasObsByClara), false);
      assert.equal(canEditObservation(pedroSuspended, tomasObsByClara), false);
    });

    it('canDeleteObservation: apenas guardião legal ou o próprio autor podem excluir', () => {
      // Helena (guarda legal vinculada) pode excluir qualquer registro de Tomás
      assert.equal(canDeleteObservation(helena, tomasObsByClara), true);
      assert.equal(canDeleteObservation(helena, tomasObsByHelena), true);

      // Clara (autora) pode excluir sua própria observação
      assert.equal(canDeleteObservation(clara, tomasObsByClara), true);

      // Clara NÃO pode excluir observação de Helena
      assert.equal(canDeleteObservation(clara, tomasObsByHelena), false);

      // Clara NÃO pode excluir observação de Marina
      assert.equal(canDeleteObservation(clara, tomasObsByMarina), false);

      // Suspenso não pode excluir mesmo que seja guardião legal
      assert.equal(canDeleteObservation(pedroSuspended, tomasObsByClara), false);
    });

    it('canIncludeInReport: deve permitir inclusão apenas a cuidadores ativos vinculados à criança', () => {
      assert.equal(canIncludeInReport(helena, tomasObsByHelena), true);
      assert.equal(canIncludeInReport(clara, tomasObsByClara), true);
      assert.equal(canIncludeInReport(leonardo, tomasObsByHelena), false, 'Leonardo não tem vínculo com Tomás');
      assert.equal(canIncludeInReport(anaUnlinked, tomasObsByHelena), false);
      assert.equal(canIncludeInReport(pedroSuspended, tomasObsByHelena), false);
    });
  });

  // 3. Proveniência e Separação de Autoria
  describe('3. Proveniência Canônica e Atribuição de Autoria', () => {
    it('deve aceitar proveniência DIRECT com observedByCaregiverId opcional', () => {
      const directObs: Observation = validateObservation({
        id: 'obs-prov-direct',
        childId: 'tomas',
        recordedByCaregiverId: 'cg-helena',
        observedByCaregiverId: 'cg-helena',
        provenance: 'DIRECT',
        occurredAt: '2026-11-12T10:00',
        recordedAt: '2026-11-12T10:05:00.000Z',
        environment: 'casa',
        observerRole: 'mae',
        eventType: 'conquista',
        description: 'Tomás compartilhou o brinquedo com a mãe.',
      });

      assert.equal(directObs.provenance, 'DIRECT');
      assert.equal(directObs.recordedByCaregiverId, 'cg-helena');
      assert.equal(directObs.observedByCaregiverId, 'cg-helena');
    });

    it('deve aceitar proveniência REPORTED_BY_OTHER com reportedByLabel não autenticado', () => {
      const reportedObs: Observation = validateObservation({
        id: 'obs-prov-reported',
        childId: 'tomas',
        recordedByCaregiverId: 'cg-helena',
        provenance: 'REPORTED_BY_OTHER',
        reportedByLabel: 'Professora Mariana (Creche Cantinho)',
        occurredAt: '2026-11-12T14:30',
        recordedAt: '2026-11-12T18:00:00.000Z',
        environment: 'escola',
        observerRole: 'educador',
        eventType: 'rotina',
        description: 'Tomás descansou 40 minutos após o almoço ouvindo canção de ninar.',
      });

      assert.equal(reportedObs.provenance, 'REPORTED_BY_OTHER');
      assert.equal(reportedObs.reportedByLabel, 'Professora Mariana (Creche Cantinho)');
      assert.equal(reportedObs.recordedByCaregiverId, 'cg-helena');
    });
  });

  // 4. Rastreabilidade de Revisões e Imutabilidade
  describe('4. Rastreabilidade de Alterações e Controle de Revisões', () => {
    it('deve rejeitar revisão menor que 1 ou não inteira', () => {
      const candidateInvalid = {
        id: 'obs-rev-invalid',
        childId: 'tomas',
        recordedByCaregiverId: 'cg-helena',
        revision: 0, // Invalido: deve ser >= 1
        occurredAt: '2026-11-12T10:00',
        recordedAt: '2026-11-12T10:05:00.000Z',
        environment: 'casa',
        observerRole: 'mae',
        eventType: 'conquista',
        description: 'Descrição de teste.',
      };

      const result = safeValidateObservation(candidateInvalid);
      assert.equal(result.success, false);
    });

    it('deve incrementar revision em +1 e preservar childId, recordedAt e recordedByCaregiverId na edição', () => {
      const baseObs: Observation = validateObservation({
        id: 'obs-rev-1',
        childId: 'tomas',
        recordedByCaregiverId: 'cg-helena',
        revision: 1,
        occurredAt: '2026-11-12T10:00',
        recordedAt: '2026-11-12T10:05:00.000Z',
        environment: 'casa',
        observerRole: 'mae',
        eventType: 'conquista',
        description: 'Primeira versão do relato.',
      });

      // Simulação da lógica de atualização do AppContext
      const updatedObs: Observation = validateObservation({
        ...baseObs,
        description: 'Versão aprimorada com detalhes do contexto sensorial.',
        revision: (baseObs.revision || 1) + 1,
        updatedAt: '2026-11-12T11:00:00.000Z',
        // Garantias de imutabilidade
        childId: baseObs.childId,
        recordedAt: baseObs.recordedAt,
        recordedByCaregiverId: baseObs.recordedByCaregiverId,
      });

      assert.equal(updatedObs.revision, 2);
      assert.equal(updatedObs.childId, 'tomas');
      assert.equal(updatedObs.recordedAt, baseObs.recordedAt);
      assert.equal(updatedObs.recordedByCaregiverId, 'cg-helena');
      assert.equal(updatedObs.updatedAt, '2026-11-12T11:00:00.000Z');
      assert.equal(updatedObs.description, 'Versão aprimorada com detalhes do contexto sensorial.');
    });
  });

  // 5. Migração de Registros da Foundation v0.2 para Foundation v0.3
  describe('5. Migração Canônica e Compatibilidade Reversa (v0.2 -> v0.3)', () => {
    it('deve migrar registro v0.2 sem campos v0.3 atribuindo valores canônicos seguros', () => {
      const legacyV2Record = {
        id: 'legacy-obs-01',
        childId: 'tomas',
        occurredAt: '2026-11-10T09:30',
        recordedAt: '2026-11-10T10:00:00.000Z',
        provenance: 'DIRECT',
        environment: 'casa',
        observerRole: 'mae',
        eventType: 'conquista',
        description: 'Registro originalmente criado na versão v0.2.',
        antecedents: 'Manhã ensolarada.',
        communicationSignals: 'Apontou com dedinho.',
        supportOffered: 'Observação atenta.',
        observedOutcome: 'Contentamento tranquilo.',
        positiveAspects: 'Foco e iniciativa.',
        notes: 'Hipótese: rotina matinal estruturada traz calma.',
      };

      const migrated = migrateObservationV2ToV3(legacyV2Record, 'cg-helena');

      assert.equal(migrated.id, 'legacy-obs-01');
      assert.equal(migrated.childId, 'tomas');
      assert.equal(migrated.recordedByCaregiverId, 'cg-helena');
      assert.equal(migrated.revision, 1);
      assert.equal(migrated.provenance, 'DIRECT');
      assert.equal(migrated.description, 'Registro originalmente criado na versão v0.2.');
      assert.equal(migrated.notes, 'Hipótese: rotina matinal estruturada traz calma.');
    });

    it('deve migrar registro v0.2 REPORTED_BY_OTHER com label padrão seguro', () => {
      const legacyReported = {
        id: 'legacy-obs-02',
        childId: 'lia',
        occurredAt: '2026-11-10T15:00',
        recordedAt: '2026-11-10T16:00:00.000Z',
        provenance: 'REPORTED_BY_OTHER',
        environment: 'escola',
        observerRole: 'educador',
        eventType: 'rotina',
        description: 'Lia brincou na mesa de tintas.',
      };

      const migrated = migrateObservationV2ToV3(legacyReported, 'cg-marina');

      assert.equal(migrated.provenance, 'REPORTED_BY_OTHER');
      assert.equal(migrated.reportedByLabel, 'Relatado por terceiro');
      assert.equal(migrated.recordedByCaregiverId, 'cg-marina');
      assert.equal(migrated.revision, 1);
    });

    it('deve migrar lote de observações legadas mantendo integridade e contagem', () => {
      const legacyBatch = [
        {
          id: 'batch-1',
          childId: 'tomas',
          occurredAt: '2026-11-11T10:00',
          environment: 'casa',
          observerRole: 'pai',
          eventType: 'descoberta',
          description: 'Descobriu como abrir a caixa de blocos.',
        },
        {
          id: 'batch-2',
          childId: 'lia',
          occurredAt: '2026-11-11T11:00',
          environment: 'parque',
          observerRole: 'terapeuta',
          eventType: 'conquista',
          description: 'Equilibrou-se no tronco baixo do jardim sensorial.',
        },
      ];

      const migratedBatch = migrateObservationBatch(legacyBatch);
      assert.equal(migratedBatch.length, 2);
      assert.equal(migratedBatch[0].id, 'batch-1');
      assert.equal(migratedBatch[0].revision, 1);
      assert.equal(migratedBatch[1].id, 'batch-2');
      assert.equal(migratedBatch[1].revision, 1);
    });
  });
});
