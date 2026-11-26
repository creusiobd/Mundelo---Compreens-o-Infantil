import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const route='/#/adult-onboarding-demo';
test('jornada familiar, aceite explícito e expiração',async({page})=>{
 await page.goto(route);
 await page.getByRole('button',{name:'Começar minha jornada'}).click();
 await page.getByRole('button',{name:'Jornada familiar'}).click();
 await page.getByRole('button',{name:'Simular cadastro'}).click();
 await expect(page.getByRole('alert')).toBeFocused();
 await page.getByRole('checkbox').nth(0).check();
 await page.getByRole('checkbox').nth(1).check();
 await page.getByRole('button',{name:'Simular cadastro'}).click();
 await page.getByRole('button',{name:'Simular confirmação válida'}).click();
 await page.getByRole('button',{name:'Simular login confirmado'}).click();
 await page.getByRole('button',{name:'Continuar para acolhimento'}).click();
 await expect(page.getByRole('heading',{name:'Seu espaço familiar'})).toBeVisible();
 await expect(page.getByText('Não há crianças cadastradas.',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Simular sessão expirada'}).click();
 await expect(page.getByRole('heading',{name:'Sessão simulada expirada'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Seu espaço familiar'})).toHaveCount(0);
});
test('profissional não recebe acesso e reload limpa estado',async({page})=>{
 await page.goto(route);
 await page.getByRole('button',{name:'Começar minha jornada'}).click();
 await page.getByRole('button',{name:'Jornada profissional'}).click();
 await page.getByRole('checkbox').nth(0).check();
 await page.getByRole('checkbox').nth(1).check();
 await page.getByRole('button',{name:'Simular cadastro'}).click();
 await page.getByRole('button',{name:'Simular confirmação válida'}).click();
 await page.getByRole('button',{name:'Simular login confirmado'}).click();
 await page.getByRole('button',{name:'Continuar para acolhimento'}).click();
 await expect(page.getByRole('heading',{name:'Acolhimento profissional'})).toBeVisible();
 await page.getByRole('button',{name:'Simular acesso bloqueado'}).click();
 await expect(page.getByRole('heading',{name:'Acesso indisponível'})).toBeVisible();
 await page.reload();
 await expect(page.getByRole('heading',{name:'Cada criança, um mundo.'})).toBeVisible();
});
test('recuperação, erro e retorno',async({page})=>{
 await page.goto(route);
 await page.getByRole('button',{name:'Já tenho uma conta de teste'}).click();
 await page.getByRole('button',{name:'Esqueci a senha'}).click();
 await page.getByRole('button',{name:'Simular solicitação de recuperação'}).click();
 await page.getByRole('button',{name:'Simular link inválido'}).click();
 await page.getByRole('button',{name:'Tentar novamente'}).click();
 await expect(page.getByRole('heading',{name:'Recuperar acesso'})).toBeVisible();
 await page.getByRole('button',{name:'Cancelar'}).click();
 await expect(page.getByRole('heading',{name:'Entrar na demonstração'})).toBeVisible();
});
// Each viewport gets a fresh browser page/context. Repeating goto with the same
// hash URL can preserve the previous React step instead of mounting welcome again.
for (const width of [320,768,1440]) {
 test(`reflow, teclado e axe no cadastro (${width}px)`,async({page})=>{
  await page.setViewportSize({width,height:800});
  await page.goto(route);
  await expect(page.getByRole('heading',{name:'Cada criança, um mundo.'})).toBeFocused();
  const startButton=page.getByRole('button',{name:'Começar minha jornada'});
  await page.keyboard.press('Tab');
  await expect(startButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading',{name:'Como deseja conhecer o Mundelo?'})).toBeFocused();
  const familyButton=page.getByRole('button',{name:'Jornada familiar'});
  await page.keyboard.press('Tab');
  await expect(familyButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading',{name:'Cadastro adulto demonstrativo'})).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  expect(result.violations).toEqual([]);
 });
}
test('demonstração anterior preservada',async({page})=>{
 await page.goto(route);
 await page.getByRole('button',{name:'Conhecer a demonstração infantil'}).click();
 await expect(page.getByRole('heading',{name:'O que podemos compreender hoje?'})).toBeVisible();
});
