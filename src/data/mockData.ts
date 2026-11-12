/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChildProfile, Observation, OfflineDiscovery, Caregiver } from '../types';

export const MOCK_CAREGIVERS: Caregiver[] = [
  {
    id: 'cg-helena',
    displayName: 'Helena',
    role: 'LEGAL_GUARDIAN',
    linkedChildIds: ['tomas', 'lia'],
    status: 'ACTIVE',
    relationshipLabel: 'Mãe (Responsável Legal)',
  },
  {
    id: 'cg-carlos',
    displayName: 'Carlos',
    role: 'LEGAL_GUARDIAN',
    linkedChildIds: ['tomas', 'lia'],
    status: 'ACTIVE',
    relationshipLabel: 'Pai (Responsável Legal)',
  },
  {
    id: 'cg-clara',
    displayName: 'Dona Clara',
    role: 'FAMILY_CAREGIVER',
    linkedChildIds: ['tomas'],
    status: 'ACTIVE',
    relationshipLabel: 'Avó materna (Cuidadora Familiar)',
  },
  {
    id: 'cg-marina',
    displayName: 'Prof. Marina',
    role: 'EDUCATOR',
    linkedChildIds: ['tomas'],
    status: 'ACTIVE',
    relationshipLabel: 'Educadora da Creche',
  },
  {
    id: 'cg-leonardo',
    displayName: 'Dr. Leonardo',
    role: 'PROFESSIONAL',
    linkedChildIds: ['lia'],
    status: 'ACTIVE',
    relationshipLabel: 'Profissional de Saúde',
  },
  {
    id: 'cg-ana-unlinked',
    displayName: 'Ana (Sem Vínculo)',
    role: 'FAMILY_CAREGIVER',
    linkedChildIds: [], // Sem vínculo com Tomás ou Lia
    status: 'ACTIVE',
    relationshipLabel: 'Familiar Sem Vínculo Ativo',
  },
  {
    id: 'cg-pedro-suspended',
    displayName: 'Pedro (Suspenso)',
    role: 'FAMILY_CAREGIVER',
    linkedChildIds: ['tomas'],
    status: 'SUSPENDED', // Status suspenso
    relationshipLabel: 'Acesso Temporariamente Suspenso',
  },
];

export const MOCK_PROFILE_TOMAS: ChildProfile = {
  id: 'tomas',
  name: 'Tomás',
  ageLabel: '2 anos e 8 meses',
  ageMonths: 32,
  preferredPronoun: 'ele',
  interests: [
    'Movimento de rodas e veículos de madeira',
    'Coletar e ordenar folhas secas no parque',
    'Brincar com água em potes de tamanhos diferentes',
    'Livros ilustrados de bichos da floresta',
    'Empilhar blocos e ver o equilíbrio',
  ],
  comfortAnchors: [
    'Naninha de malha macia azul claro',
    'Sentar no chão encostado nas costas do cuidador',
    'Cantarolar suave em tom baixo (música das águas)',
    'Ambiente com luz indireta amarelada',
  ],
  sensitivities: [
    'Ruídos mecânicos repentinos (liquidificador, aspirador)',
    'Mudanças bruscas de atividade sem transição prévia',
    'Etiquetas ásperas na gola das camisetas',
    'Ambientes fechados com eco e muitas conversas simultâneas',
  ],
  communicationModes: [
    'Aponta com o dedo indicador e aguarda confirmação com o olhar',
    'Puxa suavemente a mão do adulto até o que deseja',
    'Vocalizações expressivas com entonação de pergunta e alegria',
    'Palavras isoladas expressivas ("água", "au-au", "olha", "mais", "tchau")',
  ],
  celebratedMilestones: [
    'Buscou o olhar de referência do pai antes de subir no degrau do parque',
    'Ofereceu espontaneamente um bloco de madeira para o primo',
    'Sentou-se calmamente para folhear sozinho um livro de pano por 10 minutos',
    'Conseguiu respirar fundo três vezes quando lembrado do combinado da saída',
  ],
  supportStrategies: [
    {
      id: 'st-1',
      strategy: 'Contagem regressiva lúdica para transições (5 min e 2 min)',
      context: 'Troca de atividades, encerramento de brincadeira no parque',
      observedResponse: 'Redução nítida de choro ou frustração; guarda o brinquedo voluntariamente.',
    },
    {
      id: 'st-2',
      strategy: 'Abaixar-se na altura dos olhos e falar em ritmo cadenciado',
      context: 'Momentos de sobrecarga sensorial ou cansaço no final da tarde',
      observedResponse: 'Favorece o contato visual e diminui a agitação motora.',
    },
    {
      id: 'st-3',
      strategy: 'Avisar antes de ligar aparelhos barulhentos em casa',
      context: 'Uso de liquidificador ou secador de cabelos',
      observedResponse: 'Ele busca a naninha com calma ou coloca as mãozinhas no ouvido sem assustar-se.',
    },
  ],
};

export const MOCK_PROFILE_LIA: ChildProfile = {
  id: 'lia',
  name: 'Lia',
  ageLabel: '1 ano e 4 meses',
  ageMonths: 16,
  preferredPronoun: 'ela',
  interests: [
    'Abrir e fechar tampas de potes plásticos',
    'Bater palminhas acompanhando o ritmo de cantigas',
    'Sentir texturas diferentes (veludo, esponja macia, madeira lisa)',
    'Engatinhar com obstáculos suaves de almofadas no tapete',
  ],
  comfortAnchors: [
    'Balanço lento no colo com peito encostado no ombro',
    'Chupeta de silicone suave para descanso',
    'Massagem circular leve nas costas na hora do sono',
  ],
  sensitivities: [
    'Luz branca direta ao despertar da soneca',
    'Pessoas desconhecidas que se aproximam rapidamente sem aproximação gradual',
  ],
  communicationModes: [
    'Gesto alegre de tchau com ambas as mãos',
    'Balbucios ritmados ("da-da-da", "ma-ma")',
    'Estica os bracinhos solicitando colo com olhar direto',
    'Empurra suavemente o pratinho quando já está saciada',
  ],
  celebratedMilestones: [
    'Primeiros 5 passos equilibrados entre o sofá e o tapete',
    'Reconheceu o próprio reflexo no espelho e sorriu com surpresa',
  ],
  supportStrategies: [
    {
      id: 'st-lia-1',
      strategy: 'Diminuição gradual de estímulos luminosos 30 minutos antes da soneca',
      context: 'Transição para o sono da tarde',
      observedResponse: 'Adormecimento calmo sem choro resistivo.',
    },
    {
      id: 'st-lia-2',
      strategy: 'Aproximação lenta de visitas mantendo Lia no colo de referência',
      context: 'Chegada de pessoas na casa',
      observedResponse: 'Observa com tranquilidade sem demonstrar sobressalto.',
    },
  ],
};

export const MOCK_OBSERVATIONS: Observation[] = [
  // --- Observações de Tomás (childId: 'tomas') ---
  {
    id: 'obs-001',
    childId: 'tomas',
    recordedByCaregiverId: 'cg-helena',
    observedByCaregiverId: 'cg-helena',
    provenance: 'DIRECT',
    occurredAt: '2026-11-10T16:30',
    recordedAt: '2026-11-10T17:15:00.000Z',
    revision: 1,
    environment: 'parque',
    observerRole: 'mae',
    eventType: 'conquista',
    description:
      'Tomás explorou o caminho de pedrinhas no parque. Encontrou gravetos no chão, selecionou três do mesmo comprimento e entregou um para a mãe com um sorriso calmo.',
    antecedents:
      'Tarde ensolarada e amena. Estávamos caminhando em ritmo lento sem pressa de horário.',
    communicationSignals:
      'Sorriso amplo, apontou para os gravetos e emitiu som alegre de "ó!", olhando nos olhos da mãe.',
    supportOffered:
      'A mãe sentou-se na grama na mesma altura, agradeceu o galhinho e repetiu suavemente o gesto de comparar os tamanhos.',
    observedOutcome:
      'Sentou-se ao lado da mãe e permaneceu concentrado por cerca de 8 minutos explorando texturas da grama.',
    positiveAspects:
      'Atenção compartilhada espontânea, reciprocidade afetiva e curiosidade com elementos naturais.',
    notes:
      'Hipótese do observador: O ritmo calmo da caminhada sem pressa favoreceu sua iniciativa de compartilhar o que achou interessante.',
  },
  {
    id: 'obs-002',
    childId: 'tomas',
    recordedByCaregiverId: 'cg-carlos',
    observedByCaregiverId: 'cg-carlos',
    provenance: 'DIRECT',
    occurredAt: '2026-11-09T18:45',
    recordedAt: '2026-11-09T19:30:00.000Z',
    revision: 1,
    environment: 'casa',
    observerRole: 'pai',
    eventType: 'desconforto',
    description:
      'Durante o preparo do jantar, o liquidificador foi ligado na cozinha. Tomás cobriu os ouvidos com as mãos e começou a chorar baixinho enquanto se afastava em direção ao quarto.',
    antecedents:
      'O ambiente estava silencioso logo antes. O ruído do motor iniciou subitamente sem aviso prévio.',
    communicationSignals:
      'Postura retraída, mãos pressionando as orelhas, respiração rápida e choro vocalizado pedindo "papai".',
    supportOffered:
      'O pai desligou imediatamente o aparelho, foi até o quarto, sentou-se no chão ao lado de Tomás sem forçar abraço imediato e ofereceu a naninha azul.',
    observedOutcome:
      'Tomás pegou a naninha, encostou no peito do pai e sua respiração desacelerou em aproximadamente 3 minutos.',
    positiveAspects:
      'Reconheceu o próprio limite sensorial, protegeu os ouvidos e buscou o espaço seguro do quarto por iniciativa própria.',
    notes:
      'Registro reflexivo: Precisamos consolidar o hábito de avisar previamente ("o papai vai fazer um barulho agora") ou usar a estratégia de fazê-lo participar visualmente do preparo.',
  },
  {
    id: 'obs-003',
    childId: 'tomas',
    recordedByCaregiverId: 'cg-marina',
    observedByCaregiverId: 'cg-marina',
    reportedByLabel: 'Prof. Marina (Educadora)',
    provenance: 'REPORTED_BY_OTHER',
    occurredAt: '2026-11-08T09:15',
    recordedAt: '2026-11-08T12:00:00.000Z',
    revision: 1,
    environment: 'escola',
    observerRole: 'educador',
    eventType: 'rotina',
    description:
      'Na chegada à creche, Tomás hesitou na porta da sala, segurando a mão do pai. A educadora ofereceu a caixa de veículos de madeira que ele tanto aprecia.',
    antecedents:
      'Troca de cuidador após um final de semana prolongado em família.',
    communicationSignals:
      'Olhar oscilando entre o pai e o chão; corpo firme rente à perna do pai.',
    supportOffered:
      'Pai e educadora não apressaram a entrada. Ficaram 4 minutos conversando em tom sereno e a educadora colocou um trenzinho no chão.',
    observedOutcome:
      'Tomás deu tchau para o pai com a mãozinha, pegou o trem de madeira e sentou-se no tapete para empurrá-lo nos trilhos desenhados.',
    positiveAspects:
      'Capacidade de usar o objeto de interesse como ponte afetiva e confiança no acolhimento dos adultos.',
    notes:
      'Interpretação pedagógica: O respeito ao tempo de transição na porta (sem despedidas abruptas) previne a desregulação matinal.',
  },
  {
    id: 'obs-004',
    childId: 'tomas',
    recordedByCaregiverId: 'cg-clara',
    observedByCaregiverId: 'cg-clara',
    provenance: 'DIRECT',
    occurredAt: '2026-11-06T15:20',
    recordedAt: '2026-11-06T16:00:00.000Z',
    revision: 1,
    environment: 'casa',
    observerRole: 'avo',
    eventType: 'descoberta',
    description:
      'Brincando com copos plásticos com água morna na varanda, Tomás percebeu que colocar folhas na água fazia com que elas boiassem, enquanto pedrinhas afundavam.',
    antecedents:
      'Momento livre pós-soneca com temperatura agradável e som de passarinhos lá fora.',
    communicationSignals:
      'Olhos bem abertos, expressão de surpresa, puxou a manga da avó dizendo "viu? caiu!" repetidas vezes.',
    supportOffered:
      'A avó celebrou a descoberta com riso tranquilo, forneceu mais gravetos secos e flores caídas para ele testar.',
    observedOutcome:
      'Explorou a bacia com água por 20 minutos com entusiasmo sereno, sorrindo a cada objeto colocado.',
    positiveAspects:
      'Pensamento investigativo preliminar, coordenação motora fina para pinçar objetos e linguagem em expansão.',
    notes:
      'Observação: Atividades sensoriais com água e elementos naturais são um canal excelente de calma e foco prolongado para Tomás.',
  },
  {
    id: 'obs-005',
    childId: 'tomas',
    recordedByCaregiverId: 'cg-helena',
    observedByCaregiverId: 'cg-helena',
    provenance: 'DIRECT',
    occurredAt: '2026-11-04T11:00',
    recordedAt: '2026-11-04T13:10:00.000Z',
    revision: 1,
    environment: 'transporte_consulta',
    observerRole: 'mae',
    eventType: 'rotina',
    description:
      'Na sala de espera da consulta de rotina, Tomás ficou inquieto com o entra-e-sai de pessoas e o telefone tocando frequentemente.',
    antecedents:
      'Espera de mais de 35 minutos após horário agendado.',
    communicationSignals:
      'Começou a andar de um lado para o outro na sala e puxar a bolsa da mãe solicitando ir embora.',
    supportOffered:
      'A mãe convidou Tomás para dar uma volta no corredor externo arborizado e tirou o caderninho de rabiscos com giz de cera.',
    observedOutcome:
      'No corredor silencioso, Tomás desenhou linhas circulares no papel e aceitou beber água.',
    positiveAspects:
      'Expressou seu cansaço sem agressividade, aceitou prontamente a mudança de ambiente oferecida.',
    notes:
      'Fato vs Suposição: O ambiente saturado gerou desconforto compreensível. O espaço externo aberto restaurou o equilíbrio.',
  },

  // --- Observações de Lia (childId: 'lia') ---
  {
    id: 'obs-lia-001',
    childId: 'lia',
    recordedByCaregiverId: 'cg-helena',
    observedByCaregiverId: 'cg-helena',
    provenance: 'DIRECT',
    occurredAt: '2026-11-11T10:15',
    recordedAt: '2026-11-11T10:45:00.000Z',
    revision: 1,
    environment: 'casa',
    observerRole: 'mae',
    eventType: 'conquista',
    description:
      'Lia estava sentada no tapete da sala e conseguiu empilhar dois copinhos de silicone coloridos. Olhou para a mãe e bateu palminhas com um sorriso aberto.',
    antecedents:
      'Manhã calma após o café. Som suave de cantigas infantis tocando baixo.',
    communicationSignals:
      'Sorriso amplo, vocalização ritmada ("da-da!"), sustentação do contato visual por vários segundos.',
    supportOffered:
      'A mãe aplaudiu na mesma cadência, sorriu de volta e estendeu a mão aberta no chão.',
    observedOutcome:
      'Lia engatinhou até o colo da mãe e encostou a cabeça no peito com calma.',
    positiveAspects:
      'Coordenação motora fina para encaixar objetos, celebração compartilhada do próprio êxito.',
    notes:
      'Leitura de vínculo: A aprovação visual serena do cuidador reforça a segurança na exploração livre.',
  },
  {
    id: 'obs-lia-002',
    childId: 'lia',
    recordedByCaregiverId: 'cg-carlos',
    observedByCaregiverId: 'cg-carlos',
    provenance: 'DIRECT',
    occurredAt: '2026-11-09T14:40',
    recordedAt: '2026-11-09T15:20:00.000Z',
    revision: 1,
    environment: 'casa',
    observerRole: 'pai',
    eventType: 'desconforto',
    description:
      'Ao acordar da soneca da tarde em quarto onde a cortina havia se aberto com o vento, a luz solar bateu forte no berço. Lia começou a esfregar os olhos e chorar com choro agudo.',
    antecedents:
      'Acordar súbito com claridade branca direta no rosto.',
    communicationSignals:
      'Esfregar contínuo dos olhos, tronco arqueado no berço, esticando as mãozinhas para cima.',
    supportOffered:
      'O pai fechou a cortina para diminuir a luz, pegou Lia no colo mantendo o rostinho encostado no ombro e fez balanço lento.',
    observedOutcome:
      'O choro cessou em 2 minutos; Lia respirou fundo e aceitou beber água no copinho de transição.',
    positiveAspects:
      'Capacidade de solicitar acolhimento estendendo os bracinhos.',
    notes:
      'Hipótese do pai: Lia precisa de despertar gradual com penumbra antes da exposição à luz clara.',
  },
  {
    id: 'obs-lia-003',
    childId: 'lia',
    recordedByCaregiverId: 'cg-leonardo',
    observedByCaregiverId: 'cg-leonardo',
    reportedByLabel: 'Dr. Leonardo (Pediatra)',
    provenance: 'REPORTED_BY_OTHER',
    occurredAt: '2026-11-07T16:00',
    recordedAt: '2026-11-07T16:30:00.000Z',
    revision: 1,
    environment: 'transporte_consulta',
    observerRole: 'terapeuta',
    eventType: 'descoberta',
    description:
      'Na consulta de rotina, Lia segurou a lanterninha pediátrica de foco suave desligada, girou o brinquedo entre as duas mãozinhas e devolveu para a mesa sem resistir.',
    antecedents:
      'Ambiente com música clássica baixa na sala de atendimento.',
    communicationSignals:
      'Olhos bem atentos ao objeto, balbucio curioso em tom sereno.',
    supportOffered:
      'O profissional manteve as mãos abertas e conversou em tom calmo.',
    observedOutcome:
      'Lia aceitou a troca pelo brinquedo de borracha e continuou tranquila.',
    positiveAspects:
      'Curiosidade investigativa e regulação na transição de posse de objetos.',
    notes:
      'Registro profissional: Mostra receptividade a objetos novos quando o ritmo é desacelerado.',
  },
];

export const MOCK_DISCOVERIES: OfflineDiscovery[] = [
  {
    id: 'disc-1',
    title: 'Cestinha dos Tesouros Naturais',
    ageGroup: '1-2',
    category: 'natureza',
    duration: '15 a 20 minutos',
    materials: [
      'Uma cesta de vime ou caixa de papelão baixa',
      'Pinhas secas limpas',
      'Folhas de diferentes texturas e cores',
      'Pedras lisas grandes que não caibam na boca',
      'Pedaços de casca de árvore sem farpas',
    ],
    purpose:
      'Exploração tátil e sensorial sem telas, estimulando a curiosidade inata pela natureza e fortalecendo o diálogo amoroso.',
    steps: [
      'Coloque a cesta no chão, no nível da criança, sobre um tapete confortável.',
      'Sente-se próximo e espere a iniciativa da criança de pegar o primeiro objeto.',
      'Acompanhe o ritmo dela: nomeie gentilmente texturas ("lisa", "áspera", "geladinha") sem fazer cobranças de vocabulário.',
      'Permita que ela tire, coloque, empilhe ou descarte os itens conforme sua vontade.',
    ],
    whatToObserve:
      'Observe qual textura atrai mais a atenção da criança, quanto tempo ela dedica a cada objeto e se busca compartilhar a descoberta com o olhar.',
  },
  {
    id: 'disc-2',
    title: 'Tenda do Silêncio e das Luzes Suaves',
    ageGroup: '2-3',
    category: 'calmante',
    duration: '10 a 25 minutos',
    materials: [
      'Um lençol claro preso sobre duas cadeiras ou mesa baixa',
      'Almofadas macias ou edredom no chão',
      'Uma pequena lanterna de luz amarelada suave',
      'Livros favoritos de pano ou capa dura',
    ],
    purpose:
      'Criar um refúgio acolhedor de co-regulação emocional para momentos de transição do fim da tarde ou após dias com muitos estímulos.',
    steps: [
      'Monte a tenda em conjunto com a criança como uma brincadeira relaxante.',
      'Convidem o brinquedo ou naninha favorita para "morar" dentro da tenda.',
      'Entrem juntos na tenda e observem a luz suave passar pelo tecido do lençol.',
      'Pratiquem respirações lentas como se estivessem cheirando uma flor e soprando uma velinha.',
    ],
    whatToObserve:
      'Note se a criança relaxa a musculatura dos ombros, a respiração desacelera e se ela escolhe permanecer no espaço de acolhimento.',
  },
  {
    id: 'disc-3',
    title: 'Pintura com Água no Muro ou Calçada',
    ageGroup: '2-3',
    category: 'motor',
    duration: '20 a 30 minutos',
    materials: [
      'Um pote de plástico resistente com água em temperatura ambiente',
      'Pincéis de pintura de diferentes espessuras ou trinchas limpas',
      'Um muro, chão de cerâmica ou pedra ao ar livre',
    ],
    purpose:
      'Expressão motora ampla e causa-e-efeito imediato sem a preocupação de sujeira ou necessidade de "fazer bonito".',
    steps: [
      'Apresente o pincel molhado na água e faça um traço no chão, mostrando a cor mudando com a umidade.',
      'Entregue o pincel na mão da criança e celebre qualquer movimento que ela fizer.',
      'Observem juntos a água evaporando com o vento ou calor do sol.',
    ],
    whatToObserve:
      'Acompanhe o vigor do movimento dos braços, a preferência por linhas retas ou circulares e a satisfação com a transformação visual temporária.',
  },
  {
    id: 'disc-4',
    title: 'Espelho das Emoções Brincantes',
    ageGroup: '3-5',
    category: 'conexao',
    duration: '10 a 15 minutos',
    materials: [
      'Um espelho seguro colocado na altura dos olhos da criança',
      'Rostos disponíveis: o seu e o da criança',
    ],
    purpose:
      'Autopercepção, identificação de expressões afetivas e conexão corporal entre cuidador e criança.',
    steps: [
      'Sentem-se juntos diante do espelho.',
      'Proponha brincadeiras simples: "como fica nossa cara quando tomamos um sustinho engraçado?", "e quando sentimos um cheiro bem gostoso de bolo?".',
      'Faça cócegas leves ou caretas suaves e observem o riso compartilhado no reflexo.',
      'Nomeie sem julgar: "olha como seus olhinhos brilham quando você ri".',
    ],
    whatToObserve:
      'Veja se a criança sustenta o olhar no espelho, se imita suas expressões ou se propõe novas caras por iniciativa própria.',
  },
  {
    id: 'disc-5',
    title: 'Música das Palminhas e Sons do Corpo',
    ageGroup: '0-1',
    category: 'linguagem',
    duration: '10 minutos',
    materials: [
      'Nenhum material necessário — apenas voz, mãos e afeto.',
    ],
    purpose:
      'Conexão auditiva primária, ritmo pré-linguístico e segurança de apego nos primeiros meses de vida.',
    steps: [
      'Deite o bebê de barriguinha para cima em local seguro e incline-se sobre ele mantendo distância de cerca de 25 cm dos olhos.',
      'Cante uma cantiga de ninar suave ou parlenda rimada ("Serra, serra, serrador").',
      'Bata palmas lentas e suaves perto do campo de visão, depois faça cócegas delicadas na barriguinha.',
      'Dê pausas silenciosas de 3 a 5 segundos para ouvir as respostas vocais ou sorrisos do bebê.',
    ],
    whatToObserve:
      'Perceba a alternância de turnos: você canta, para, e o bebê vocaliza ou mexe as perninhas respondendo ao estímulo afetivo.',
  },
  {
    id: 'disc-6',
    title: 'Trilha Sensorial de Pés Descalços',
    ageGroup: '3-5',
    category: 'motor',
    duration: '20 minutos',
    materials: [
      'Três ou quatro superfícies diferentes em linha: toalha felpuda, tapete liso, plástico bolha, papel craft amarfanhado',
      'Pés livres de meias e calçados',
    ],
    purpose:
      'Propriocepção, equilíbrio corporal e exploração de sensações nos pés de forma voluntária e segura.',
    steps: [
      'Disponha os materiais no chão criando um caminho curto.',
      'Tire seus próprios sapatos primeiro e caminhe com calma mostrando como é divertido e gostoso.',
      'Convide a criança pela mão para caminhar com você, respeitando caso ela prefira pular algum material que lhe cause estranhamento.',
      'Conversem sobre qual textura é a favorita.',
    ],
    whatToObserve:
      'Respeito aos limites táteis da criança: não force pisar em algo desconfortável. Observe a modulação do equilíbrio.',
  },
];
