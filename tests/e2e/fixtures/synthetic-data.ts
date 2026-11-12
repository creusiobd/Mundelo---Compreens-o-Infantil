/**
 * Dados sintéticos determinísticos e metadados das 6 telas internas do MUNDELO
 * descobertas diretamente em src/App.tsx e src/components/Header.tsx.
 * Nenhum dado real ou segredo é incluído.
 */

export type InternalScreenId =
  | 'journal'
  | 'world'
  | 'discoveries'
  | 'understand'
  | 'report'
  | 'privacy';

export interface InternalScreenDescriptor {
  id: InternalScreenId;
  navLabel: string;
  inBottomNav: boolean;
  expectedHeadingRegex: RegExp;
}

export const INTERNAL_SCREENS: readonly InternalScreenDescriptor[] = [
  {
    id: 'journal',
    navLabel: 'Diário',
    inBottomNav: true,
    expectedHeadingRegex: /Diário de Observações:\s*(Tomás|Lia)/i,
  },
  {
    id: 'world',
    navLabel: 'Meu Mundo',
    inBottomNav: true,
    expectedHeadingRegex: /Meu Mundo:\s*(Tomás|Lia)/i,
  },
  {
    id: 'discoveries',
    navLabel: 'Descobertas',
    inBottomNav: true,
    expectedHeadingRegex: /Descobertas Sem Tela para\s*(Tomás|Lia)/i,
  },
  {
    id: 'understand',
    navLabel: 'Compreender',
    inBottomNav: true,
    expectedHeadingRegex: /Compreender\s*(Tomás|Lia):\s*Padrões & Hipóteses/i,
  },
  {
    id: 'report',
    navLabel: 'Relatório',
    inBottomNav: false,
    expectedHeadingRegex: /Síntese de Observações para Diálogo/i,
  },
  {
    id: 'privacy',
    navLabel: 'Privacidade',
    inBottomNav: false,
    expectedHeadingRegex: /Proteção de Dados & Limites Éticos/i,
  },
] as const;

export const REQUIRED_VIEWPORTS = [
  { name: '360x800-mobile-small', width: 360, height: 800, scenario: 'Mobile pequeno' },
  { name: '390x844-mobile-medium', width: 390, height: 844, scenario: 'Mobile médio' },
  { name: '768x1024-tablet-portrait', width: 768, height: 1024, scenario: 'Tablet retrato' },
  { name: '1024x768-tablet-landscape', width: 1024, height: 768, scenario: 'Tablet paisagem' },
  { name: '1280x800-desktop', width: 1280, height: 800, scenario: 'Desktop' },
  { name: '1536x864-desktop-wide', width: 1536, height: 864, scenario: 'Desktop amplo' },
  { name: '320x640-extreme-reflow', width: 320, height: 640, scenario: 'Reflow extremo' },
] as const;

export const SYNTHETIC_PROFILES = {
  tomas: {
    id: 'tomas',
    name: 'Tomás',
    ageLabel: '2 anos e 8 meses',
    initialObservationsCount: 5,
    initialStrategiesCount: 3,
  },
  lia: {
    id: 'lia',
    name: 'Lia',
    ageLabel: '4 anos e 1 mês',
    initialObservationsCount: 3,
    initialStrategiesCount: 2,
  },
} as const;

export const SYNTHETIC_CAREGIVERS = {
  helenaGuardian: {
    id: 'cg-helena',
    displayName: 'Helena',
    role: 'LEGAL_GUARDIAN',
    linkedToTomas: true,
    linkedToLia: true,
    status: 'ACTIVE',
  },
  marinaEducator: {
    id: 'cg-marina',
    displayName: 'Prof. Marina',
    role: 'EDUCATOR',
    linkedToTomas: true,
    linkedToLia: false,
    status: 'ACTIVE',
  },
  leonardoProfessional: {
    id: 'cg-leonardo',
    displayName: 'Dr. Leonardo',
    role: 'PROFESSIONAL',
    linkedToTomas: false,
    linkedToLia: true,
    status: 'ACTIVE',
  },
  anaUnlinked: {
    id: 'cg-ana-unlinked',
    displayName: 'Ana (Sem Vínculo)',
    role: 'FAMILY_CAREGIVER',
    linkedToTomas: false,
    linkedToLia: false,
    status: 'ACTIVE',
  },
  pedroSuspended: {
    id: 'cg-pedro-suspended',
    displayName: 'Pedro (Suspenso)',
    role: 'FAMILY_CAREGIVER',
    linkedToTomas: true,
    linkedToLia: false,
    status: 'SUSPENDED',
  },
} as const;
