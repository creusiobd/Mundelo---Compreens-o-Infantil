import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('adult lab: real signup, callback, login, acceptance, family and logout',async({page,request})=>{
 await page.goto('/tests/onb-react-lab/index.html');
 await expect(page.getByRole('heading',{name:'MUNDELO | Laboratório adulto'})).toBeVisible();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.getByRole('button',{name:'Cadastrar',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('Confirmação pendente');
 let callback='';
 for(let i=0;i<40&&!callback;i++){
  const list=await (await request.get('http://127.0.0.1:54324/api/v1/messages')).json();
  for(const hit of list.messages||[]){
   if(!hit.To?.some((t:any)=>t.Address==='adulto-a@example.invalid'))continue;
   const m=await (await request.get('http://127.0.0.1:54324/api/v1/message/'+encodeURIComponent(hit.ID))).json();
   for(const raw of ((m.Text||'')+' '+(m.HTML||'')).match(/https?:\/\/[^\s<>"']+/g)||[]){
    const u=new URL(raw.replaceAll('&amp;','&').replace(/\)\.?$/,''));
    if(u.origin==='http://127.0.0.1:54321'&&u.pathname==='/auth/v1/verify'&&u.searchParams.get('type')==='signup'&&u.searchParams.has('token')){
     const response=await request.get(u.href,{maxRedirects:0});const loc=response.headers().location;if(loc)callback=new URL(loc,u.origin).href;break;
    }
   }
   if(callback)break;
  }
  if(!callback)await new Promise(r=>setTimeout(r,500));
 }
 expect(Boolean(callback)).toBe(true);
 await page.getByLabel('URL de retorno').fill(callback);
 await page.getByRole('button',{name:'Confirmar retorno'}).click();
 await expect(page.getByRole('status')).toHaveText('Identidade sintética');
 await page.getByRole('button',{name:'Entrar',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('Aceites necessários');
 await expect(page.getByRole('button',{name:'Continuar'})).toBeDisabled();
 await page.getByLabel('Aceito os termos de ensaio').check();await page.getByLabel('Aceito a privacidade de ensaio').check();
 await page.getByRole('button',{name:'Continuar'}).click();
 await expect(page.getByRole('heading',{name:'Espaço familiar vazio'})).toBeVisible();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
 await page.getByRole('button',{name:'Encerrar sessão'}).click();
 await expect(page.getByRole('status')).toHaveText('Identidade sintética');
});
