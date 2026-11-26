import {test,expect} from '@playwright/test';

test.describe('PG06-N13 synthetic human review UI (development-only)',()=>{
 const open=async(page:import('@playwright/test').Page,width=1280)=>{
  await page.setViewportSize({width,height:820});
  await page.goto('http://127.0.0.1:4174/review-lab');
  await expect(page.getByRole('heading',{name:'Revisão humana de perspectivas'})).toBeVisible();
 };
 test('separate adult viewpoints, provenance and initial blocked state',async({page})=>{
  await open(page,390);
  await expect(page.getByTestId('perspective-collection').locator('article')).toHaveCount(3);
  await expect(page.getByText('Responsável fictício A')).toBeVisible();
  await expect(page.getByText('Profissional fictício B')).toBeVisible();
  await expect(page.getByText('Educadora fictícia C')).toBeVisible();
  await expect(page.getByText('Interpretação adulta')).toBeVisible();
  await expect(page.getByTestId('review-status')).toContainText('Síntese bloqueada');
  await expect(page.getByText('leitura, compartilhamento e exportação reais permanecem indisponíveis')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2)).toBe(true);
 });
 test('request complement, maintain block and approved simulation do not grant real access',async({page})=>{
  await open(page);
  const reason=page.getByLabel('Justificativa da decisão (20 a 500 caracteres)');
  const consent=page.getByRole('checkbox');
  await reason.fill('Falta contextualizar os acontecimentos descritos por adultos diferentes.');
  await page.getByLabel('Informações complementares necessárias').fill('Registrar a sequência de acontecimentos em outra situação.');
  await consent.check();
  await page.getByRole('button',{name:'Registrar: Solicitar complementação'}).click();
  await expect(page.getByTestId('review-status')).toContainText('Complementação pendente');
  await expect(page.getByTestId('review-history').locator('li')).toHaveCount(1);
  await expect(page.getByTestId('review-history')).toContainText('Registrar a sequência');
  await page.getByLabel('Manter bloqueado',{exact:true}).check();
  await reason.fill('A interpretação permanece indeterminada; precisamos respeitar a autoria.');
  await consent.check();
  await page.getByRole('button',{name:'Registrar: Manter bloqueado'}).click();
  await expect(page.getByTestId('review-status')).toContainText('Síntese bloqueada');
  await expect(page.getByTestId('review-history').locator('li')).toHaveCount(2);
  await page.getByLabel('Aprovar avaliação sintética',{exact:true}).check();
  await reason.fill('Após revisar as fontes sintéticas, a avaliação ilustrativa foi concluída.');
  await consent.check();
  await page.getByRole('button',{name:'Registrar: Aprovar avaliação sintética'}).click();
  await expect(page.getByTestId('review-status')).toContainText('Avaliação simulada registrada');
  await expect(page.getByTestId('review-history').locator('li')).toHaveCount(3);
  await expect(page.getByText('A aprovação visual é apenas uma simulação, sem concessão de acesso.')).toBeVisible();
  await page.getByRole('button',{name:'Simular alteração da fonte'}).click();
  await expect(page.getByTestId('review-status')).toContainText('Síntese bloqueada');
  await expect(page.getByTestId('review-history').locator('li')).toHaveCount(3);
  await page.reload();
  await expect(page.getByTestId('review-history')).toHaveCount(0);
  await expect(page.getByTestId('review-status')).toContainText('Síntese bloqueada');
 });
 test('missing acknowledgment stops submission and announced error is accessible',async({page})=>{
  await open(page);
  await page.getByLabel('Justificativa da decisão (20 a 500 caracteres)').fill(
   'Precisa de contexto e de preservação da autoria das perspectivas.'
  );
  await page.getByLabel('Informações complementares necessárias').fill(
   'Solicitar descrição adicional do ambiente demonstrativo.'
  );
  await page.getByRole('button',{name:'Registrar: Solicitar complementação'}).click();
  await expect(page.getByRole('alert')).toContainText('Confirme que analisou as três perspectivas');
  await expect(page.getByTestId('review-history')).toHaveCount(0);
 });
 test('route is isolated from production entry',async({page})=>{
  await page.goto('http://127.0.0.1:4173/review-lab');
  await expect(page.getByRole('heading',{name:'Revisão humana de perspectivas'})).toHaveCount(0);
 });
});
