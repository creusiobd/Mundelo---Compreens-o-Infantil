import {test,expect,type Page} from '@playwright/test';
import {openCleanSession,selectCaregiver,selectChildProfile} from './fixtures/test-session';
import {navigateToInternalScreen} from './helpers/navigation';

test.beforeEach(async({page})=>{
  await page.route('**/*',route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)
    ? route.continue() : route.abort());
  await openCleanSession(page);
  await navigateToInternalScreen(page,'journal');
});

const journal=(page:Page)=>page.getByTestId('perspective-journal');
const cards=(page:Page)=>page.getByTestId('perspective-card');
async function fill(page:Page,observation:string,context='Casa',interpretation='') {
  const dialog=page.getByRole('dialog',{name:'Formulário de perspectiva'});
  await dialog.getByRole('textbox',{name:'O que foi observado?'}).fill(observation);
  await dialog.getByRole('textbox',{name:'Qual a sua interpretação? (opcional)'}).fill(interpretation);
  await dialog.getByRole('textbox',{name:'Contexto informado'}).fill(context);
  await dialog.getByRole('button',{name:'Salvar perspectiva'}).click();
}
async function create(page:Page,text:string,context='Casa',interpretation='') {
  await journal(page).getByRole('button',{name:'Registrar perspectiva'}).click();
  await fill(page,text,context,interpretation);
  await expect(page.getByRole('dialog',{name:'Formulário de perspectiva'})).toHaveCount(0);
}

test('PG06-N03: duas pessoas registram visões independentes e contestação mantém origem',async({page})=>{
  await create(page,'Aceitou o brinquedo em casa','Casa','Possivelmente confortável');
  await expect(cards(page)).toHaveCount(1);
  await selectCaregiver(page,'cg-marina');
  await create(page,'Afastou o brinquedo na escola','Escola','Talvez precisasse de uma pausa');
  await expect(cards(page)).toHaveCount(2);
  await cards(page).first().getByRole('button',{name:'Apresentar contestação'}).click();
  await fill(page,'Na escola observamos um comportamento diferente','Escola');
  await expect(cards(page)).toHaveCount(3);
  await expect(journal(page)).toContainText('A contribuição original permanece independente');
  await expect(journal(page)).toContainText('Aceitou o brinquedo em casa');
  await expect(journal(page)).toContainText('Afastou o brinquedo na escola');
  await expect(cards(page).first().getByRole('button',{name:'Revisar perspectiva'})).toHaveCount(0);
  await selectCaregiver(page,'cg-helena');
  await expect(cards(page)).toHaveCount(3);
  await expect(journal(page)).toContainText('Na escola observamos um comportamento diferente');
});

test('PG06-N03: revisão cria versões consultáveis sem perder observação antiga',async({page})=>{
  await create(page,'A criança aproximou-se da janela');
  await cards(page).first().getByRole('button',{name:'Revisar perspectiva'}).click();
  await fill(page,'A criança aproximou-se da janela por instantes','Sala');
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toContainText('Versão 2');
  await cards(page).first().getByRole('button',{name:'Consultar versões'}).click();
  const versions=page.getByRole('list',{name:'Histórico de versões'});
  await expect(versions).toContainText('Versão 1');
  await expect(versions).toContainText('Versão 2');
  await expect(versions).toContainText('A criança aproximou-se da janela');
});

test('PG06-N03: troca de criança isola dados, versões e rascunhos',async({page})=>{
  await create(page,'Observação exclusiva de Tomás');
  await journal(page).getByRole('button',{name:'Registrar perspectiva'}).click();
  await page.getByRole('dialog',{name:'Formulário de perspectiva'})
    .getByRole('textbox',{name:'O que foi observado?'}).fill('RASCUNHO PRIVADO');
  await selectChildProfile(page,'lia');
  await expect(journal(page)).not.toContainText('Observação exclusiva de Tomás');
  await expect(journal(page)).not.toContainText('RASCUNHO PRIVADO');
  await expect(page.getByRole('dialog',{name:'Formulário de perspectiva'})).toHaveCount(0);
  await create(page,'Observação exclusiva de Lia');
  await selectChildProfile(page,'tomas');
  await expect(journal(page)).toContainText('Observação exclusiva de Tomás');
  await expect(journal(page)).not.toContainText('Observação exclusiva de Lia');
});

test('PG06-N03: perda de vínculo ou suspensão não revela conteúdo, metadados ou contagens',async({page})=>{
  await create(page,'CONTEUDO-PRIVADO-PG06');
  for (const caregiver of ['cg-ana-unlinked','cg-pedro-suspended']) {
    await selectCaregiver(page,caregiver);
    await expect(journal(page)).toHaveCount(0);
    await expect(page.locator('main#main-content')).not.toContainText('CONTEUDO-PRIVADO-PG06');
    await expect(page.locator('main#main-content')).not.toContainText('Nenhuma perspectiva registrada');
  }
  await selectCaregiver(page,'cg-helena');
  await expect(journal(page)).toContainText('CONTEUDO-PRIVADO-PG06');
});

test('PG06-N03: troca de cuidador invalida formulário aberto e autoria não é transferida',async({page})=>{
  await create(page,'Perspectiva original de Helena');
  await cards(page).first().getByRole('button',{name:'Revisar perspectiva'}).click();
  await selectCaregiver(page,'cg-marina');
  await expect(page.getByRole('dialog',{name:'Formulário de perspectiva'})).toHaveCount(0);
  await expect(cards(page).first().getByRole('button',{name:'Revisar perspectiva'})).toHaveCount(0);
  await selectCaregiver(page,'cg-helena');
  await expect(cards(page).first().getByRole('button',{name:'Revisar perspectiva'})).toBeVisible();
});

test('PG06-N03: submissão concorrente repetida não cria versões silenciosas',async({page})=>{
  await create(page,'Registro inicial para concorrência');
  await cards(page).first().getByRole('button',{name:'Revisar perspectiva'}).click();
  const dialog=page.getByRole('dialog',{name:'Formulário de perspectiva'});
  await dialog.getByRole('textbox',{name:'O que foi observado?'}).fill('Nova versão concorrente');
  await dialog.getByRole('textbox',{name:'Contexto informado'}).fill('Casa');
  // Dois eventos no mesmo turno do navegador tentam a mesma revisão.
  await dialog.getByRole('button',{name:'Salvar perspectiva'}).evaluate(el=>{
    el.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    el.dispatchEvent(new MouseEvent('click',{bubbles:true}));
  });
  await expect(cards(page).first()).toContainText('Versão 2');
  await cards(page).first().getByRole('button',{name:'Consultar versões'}).click();
  await expect(page.getByRole('list',{name:'Histórico de versões'}).getByRole('listitem')).toHaveCount(2);
});
