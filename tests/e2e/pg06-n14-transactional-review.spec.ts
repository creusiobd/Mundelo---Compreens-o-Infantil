import {test,expect} from '@playwright/test';
import fs from 'node:fs';

const envPath=process.env.MUNDELO_N14_LOCAL_ENV;
const usersPath=process.env.MUNDELO_N14_LOCAL_USERS;
const enabled=Boolean(envPath&&usersPath);
function local(){
 if(!envPath||!usersPath)throw Error('Synthetic local fixture missing');
 const vars:Record<string,string>={};
 for(const line of fs.readFileSync(envPath,'utf8').split(/\r?\n/)){
  const m=line.match(/^([A-Z_]+)=(.*)$/);
  if(m)vars[m[1]]=m[2].replace(/^['"]|['"]$/g,'');
 }
 const url=vars.API_URL||vars.SUPABASE_URL;
 const anonKey=vars.ANON_KEY||vars.PUBLISHABLE_KEY||vars.SUPABASE_ANON_KEY;
 if(!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(url||'')||!anonKey)
  throw Error('Remote Supabase forbidden');
 const users=JSON.parse(fs.readFileSync(usersPath,'utf8'));
 return {url,anonKey,users};
}
test.describe('PG06-N14 · real local Supabase checkpoint reached through UI',()=>{
 test.skip(!enabled,'only executed on ephemeral PG06-N14 workflow');
 test('request, approve, server history, stale correction and unauthorized credentials',async({page,request})=>{
  const {url,anonKey,users}=local();
  await page.setViewportSize({width:390,height:844});
  const synthetic={
   url,anonKey,accessToken:users.guardian.token,
   childId:'11111111-1111-4111-8111-111111111111',
   derivedId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',purpose:'care'
  };
  await page.addInitScript(value=>{
   Object.defineProperty(window,'__MUNDELO_N14_LOCAL_REVIEW__',{value,writable:false});
  },synthetic);
  await page.goto('http://127.0.0.1:4174/review-lab');
  await expect(page.getByTestId('pg06-n14-connected-review')).toBeVisible();
  await expect(page.getByTestId('connected-review-status')).toContainText('Síntese bloqueada');
  await expect(page.getByTestId('connected-perspectives').locator('article')).toHaveCount(2);
  await expect(page.getByText('Observação direta')).toBeVisible();
  await expect(page.getByText('Interpretação adulta')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3)).toBe(true);
  const reason=page.getByLabel('Justificativa (20 a 500 caracteres)');
  const check=page.getByRole('checkbox');
  await reason.fill('As contribuições fictícias exigem detalhes adicionais antes de permitir a interpretação.');
  await page.getByLabel('Informação complementar necessária').fill('Relatar a sequência sintética com contexto ambiental.');
  await check.check();
  await page.getByRole('button',{name:'Registrar no laboratório: Solicitar complementação'}).click();
  await expect(page.getByTestId('connected-review-status')).toContainText('Complementação pendente');
  await expect(page.getByTestId('connected-review-history').locator('li')).toHaveCount(1);

  await page.getByLabel('Aprovar revisão humana',{exact:true}).check();
  await reason.fill('As fontes fictícias foram examinadas e suas limitações foram mantidas de forma explícita.');
  await check.check();
  await page.getByRole('button',{name:'Registrar no laboratório: Aprovar revisão humana'}).click();
  await expect(page.getByTestId('connected-review-status')).toContainText('Checkpoint humano confirmado pelo servidor');
  await expect(page.getByTestId('connected-review-history').locator('li')).toHaveCount(2);
  await expect(page.getByText(/não concede por si só acesso/)).toBeVisible();

  // A subsequent correction commits outside the browser; the browser must
  // re-read the database rather than trust its former approved React state.
  const rpc=await request.post(url+'/rest/v1/rpc/pg06_n10_record_event',{
   headers:{apikey:anonKey,Authorization:'Bearer '+users.guardian.token},
   data:{
    p_event:'40000000-0000-4000-8000-000000000014',
    p_child:synthetic.childId,
    p_kind:'SOURCE_REVISED',
    p_target:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    p_expected_revision:8,p_recipient:null
   }
  });
  expect(rpc.ok()).toBeTruthy();
  expect(await rpc.json()).toBe(9);
  await page.getByRole('button',{name:'Recarregar estado confirmado'}).click();
  await expect(page.getByTestId('connected-review-status')).toContainText('Síntese bloqueada');
  await expect(page.getByTestId('connected-review-history').locator('li')).toHaveCount(2);
  await page.reload();
  await expect(page.getByTestId('connected-review-history').locator('li')).toHaveCount(2);
  await expect(page.getByTestId('connected-review-status')).toContainText('Síntese bloqueada');

  // Replaying previous evidence after revision cannot restore approval.
  await page.getByLabel('Aprovar revisão humana',{exact:true}).check();
  await reason.fill('Tentativa sintética de reuso de evidência após uma alteração posterior na fonte.');
  await check.check();
  await page.getByRole('button',{name:'Registrar no laboratório: Aprovar revisão humana'}).click();
  await expect(page.getByRole('alert')).toContainText('Não existe evidência válida');
  await expect(page.getByTestId('connected-review-status')).toContainText('Síntese bloqueada');

  const evilPage=await page.context().newPage();
  await evilPage.addInitScript(value=>{
   Object.defineProperty(window,'__MUNDELO_N14_LOCAL_REVIEW__',{value,writable:false});
  },{...synthetic,accessToken:users.outsider.token});
  await evilPage.goto('http://127.0.0.1:4174/review-lab');
  await expect(evilPage.getByTestId('connected-review-status')).toContainText('Estado indisponível');
  await expect(evilPage.getByRole('alert')).toContainText('não foi autorizada');
  await expect(evilPage.getByTestId('connected-perspectives')).toHaveCount(0);
  await evilPage.close();
 });
});
