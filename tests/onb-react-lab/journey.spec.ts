import {test,expect,type APIRequestContext} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('adult lab: real signup, callback, login, acceptance, family and logout',async({page,request})=>{
 await page.goto('/tests/onb-react-lab/index.html');
 await expect(page.getByRole('heading',{name:'MUNDELO | Laboratório adulto'})).toBeVisible();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.getByRole('button',{name:'Cadastrar',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('Confirmação pendente');
 const callback=await mailCallback(request,'adulto-a@example.invalid','signup');
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

async function mailCallback(request:APIRequestContext,email:string,type:string){
 let callback='';
 for(let i=0;i<40&&!callback;i++){
  const list=await (await request.get('http://127.0.0.1:54324/api/v1/messages')).json();
  for(const hit of list.messages||[]){
   if(!hit.To?.some((t:any)=>t.Address===email))continue;
   const m=await (await request.get('http://127.0.0.1:54324/api/v1/message/'+encodeURIComponent(hit.ID))).json();
   for(const raw of ((m.Text||'')+' '+(m.HTML||'')).match(/https?:\/\/[^\s<>"']+/g)||[]){
    const u=new URL(raw.replaceAll('&amp;','&').replace(/\)\.?$/,''));
    if(u.origin==='http://127.0.0.1:54321'&&u.pathname==='/auth/v1/verify'&&u.searchParams.get('type')===type&&u.searchParams.has('token')){
     const response=await request.get(u.href,{maxRedirects:0});const loc=response.headers().location;if(loc)callback=new URL(loc,u.origin).href;break;
    }
   }
   if(callback)break;
  }
  if(!callback)await new Promise(r=>setTimeout(r,500));
 }

 if(!callback)throw Error('Synthetic callback unavailable');return callback;
}
test('professional, recovery, reload cancellation and expiry',async({page,request})=>{
 await page.goto('/tests/onb-react-lab/index.html');
 await page.getByLabel('Identidade').selectOption('adulto-p@example.invalid');
 await page.getByRole('button',{name:'Cadastrar',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('Confirmação pendente');
 await page.getByLabel('URL de retorno').fill(await mailCallback(request,'adulto-p@example.invalid','signup'));
 await page.getByRole('button',{name:'Confirmar retorno'}).click();
 await expect(page.getByRole('status')).toHaveText('Identidade sintética');
 await page.getByRole('button',{name:'Recuperar senha'}).click();
 await expect(page.getByRole('status')).toHaveText('Recuperação pendente');
 const recovery=await mailCallback(request,'adulto-p@example.invalid','recovery');
 await page.getByLabel('URL de retorno').fill(recovery);
 await page.getByRole('button',{name:'Confirmar retorno'}).click();
 await expect(page.getByRole('status')).toHaveText('Redefinir senha');
 await expect(page.getByRole('button',{name:'Continuar'})).toHaveCount(0);
 await page.getByRole('button',{name:'Redefinir senha sintética'}).click();
 await expect(page.getByRole('status')).toHaveText('Identidade sintética');
 await page.getByRole('button',{name:'Entrar',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('Aceites necessários');
 await page.getByLabel('Aceito os termos de ensaio').check();await page.getByLabel('Aceito a privacidade de ensaio').check();
 await page.getByLabel('Jornada').selectOption('PRO_INFO');
 await page.getByRole('button',{name:'Continuar'}).click();
 await expect(page.getByRole('heading',{name:'Informações profissionais'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Revalidar espaço'})).toHaveCount(0);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.clock.install();await page.clock.fastForward(24*60*60*1000);
 await expect(page.getByRole('alert')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Informações profissionais'})).toHaveCount(0);
 await page.reload();
 await expect(page.getByRole('status')).toHaveText('Identidade sintética');
});
test('reload cancels pending confirmation without retaining verifier',async({page})=>{
 await page.goto('/tests/onb-react-lab/index.html');
 await page.getByLabel('Identidade').selectOption('adulto-b@example.invalid');
 await page.getByRole('button',{name:'Cadastrar',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('Confirmação pendente');
 await page.reload();
 await expect(page.getByRole('status')).toHaveText('Identidade sintética');
 await expect(page.getByLabel('URL de retorno')).toHaveCount(0);
 expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
});
