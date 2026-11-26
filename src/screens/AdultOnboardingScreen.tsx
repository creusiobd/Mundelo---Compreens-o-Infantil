import React, {useEffect, useRef, useState} from 'react';
import {BrandLogo} from '../components/BrandLogo';

type Step = 'welcome'|'journey'|'signup'|'pending'|'login'|'recovery'|'reset'|'loading'|'acceptance'|'family'|'professional'|'expired'|'blocked'|'error';
type Journey = 'family'|'professional';
const primary = 'min-h-[48px] w-full rounded-2xl bg-[#133E43] px-4 py-3 text-white font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#133E43]';
const secondary = 'min-h-[48px] w-full rounded-2xl border border-[#133E43] px-4 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#133E43]';
const headings: Record<Step,string> = {welcome:'Cada criança, um mundo.',journey:'Como deseja conhecer o Mundelo?',signup:'Cadastro adulto demonstrativo',pending:'Confirmação de e-mail simulada',login:'Entrar na demonstração',recovery:'Recuperar acesso',reset:'Redefinir senha simulada',loading:'Preparando sua jornada',acceptance:'Revise os aceites demonstrativos',family:'Seu espaço familiar',professional:'Acolhimento profissional',expired:'Sessão simulada expirada',blocked:'Acesso indisponível',error:'Não foi possível continuar'};

// No actual identity, credentials, persistence, network calls or child context.
export function AdultOnboardingScreen() {
  const [step,setStep] = useState<Step>('welcome');
  const [journey,setJourney] = useState<Journey>('family');
  const [terms,setTerms] = useState(false);
  const [privacy,setPrivacy] = useState(false);
  const [error,setError] = useState(false);
  const [confirmed,setConfirmed] = useState(false);
  const [resume,setResume] = useState<Step>('login');
  const heading=useRef<HTMLHeadingElement>(null);
  const errorRef=useRef<HTMLParagraphElement>(null);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{heading.current?.focus();},[step]);
  useEffect(()=>{if(error) errorRef.current?.focus();},[error]);
  useEffect(()=>()=>{if(timer.current!==null)clearTimeout(timer.current);},[]);
  function go(target:Step){if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}setError(false);setStep(target);}
  function clear(){setTerms(false);setPrivacy(false);setConfirmed(false);setJourney('family');go('welcome');}
  function simulate(target:Step,from:Step){setResume(from);go('loading');timer.current=setTimeout(()=>{timer.current=null;setStep(target);},250);}
  function accept(){if(!terms||!privacy){setError(true);return;}if(step==='signup'){simulate('pending','signup');}else if(confirmed){simulate(journey,'acceptance');}else{go('blocked');}}
  function demo(){clear();window.location.hash='';window.location.reload();}
  const btn=(label:string,action:()=>void,main=false)=><button type="button" className={main?primary:secondary} onClick={action}>{label}</button>;
  const checks=<fieldset className="space-y-3"><legend className="font-bold">Aceites de ensaio (v1, sem validade jurídica)</legend><label className="flex items-start gap-3 min-h-[44px]"><input type="checkbox" className="mt-1 size-5 shrink-0" checked={terms} onChange={e=>setTerms(e.target.checked)}/> Li os termos simulados: esta jornada não cria conta real.</label><label className="flex items-start gap-3 min-h-[44px]"><input type="checkbox" className="mt-1 size-5 shrink-0" checked={privacy} onChange={e=>setPrivacy(e.target.checked)}/> Li a política simulada: não inserir informações pessoais ou infantis.</label></fieldset>;
  return <div className="min-h-screen bg-[#F8F5EF] text-[#133E43]">
    <a href="#adult-main" onClick={e=>{e.preventDefault();document.getElementById('adult-main')?.focus();}} className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:p-3">Pular para o conteúdo principal</a>
    <header className="max-w-5xl mx-auto px-4 py-5"><BrandLogo layout="stacked"/></header>
    <main id="adult-main" tabIndex={-1} className="max-w-lg mx-auto px-4 pb-10 space-y-4">
      <p className="rounded-xl bg-[#F1CA91]/40 p-3 text-sm font-semibold">Demonstração sintética · nenhuma conta real, nenhum envio de e-mail. Não informe dados pessoais.</p>
      <section className="bg-white rounded-3xl border border-[#133E43]/20 p-4 sm:p-7 space-y-4">
        <h1 ref={heading} tabIndex={-1} className="text-2xl sm:text-3xl font-display font-extrabold leading-tight focus:outline-none">{headings[step]}</h1>
        {error&&<p ref={errorRef} tabIndex={-1} role="alert" className="p-3 rounded-xl border border-red-700 text-red-800">Confirme os dois aceites demonstrativos para continuar, ou volte sem aceitar.</p>}
        {step==='welcome'&&<><p className="text-lg font-semibold">Cada vínculo, uma descoberta.</p><p>Um espaço para compreender e acolher. O Mundelo não diagnostica nem substitui acompanhamento profissional.</p>{btn('Começar minha jornada',()=>go('journey'),true)}{btn('Já tenho uma conta de teste',()=>go('login'))}{btn('Conhecer a demonstração infantil',demo)}</>}
        {step==='journey'&&<><p>Escolha como explorar. A escolha não concede autoridade sobre uma criança.</p>{btn('Jornada familiar',()=>{setJourney('family');go('signup');},true)}{btn('Jornada profissional',()=>{setJourney('professional');go('signup');})}{btn('Voltar',clear)}</>}
        {step==='signup'&&<><p>Usaremos exclusivamente a identidade fictícia Adulto Teste A e um e-mail reservado de exemplo. Nenhuma senha real é necessária.</p><dl className="rounded-xl bg-[#F8F5EF] p-3"><dt>Apelido fictício</dt><dd className="font-semibold">Adulto Teste A</dd><dt>E-mail fictício</dt><dd className="break-all">adulto-a@example.invalid</dd></dl>{checks}{btn('Simular cadastro',accept,true)}{btn('Cancelar',clear)}</>}
        {step==='pending'&&<><p>Nenhum e-mail foi enviado. Escolha o resultado do cenário de confirmação.</p>{btn('Simular confirmação válida',()=>{setConfirmed(true);go('login');},true)}{btn('Simular link expirado',()=>{setResume('pending');go('error');})}{btn('Simular reenvio',()=>simulate('pending','pending'))}{btn('Cancelar',clear)}</>}
        {step==='login'&&<><p>Entrada fictícia, sem senha ou autenticação real. Selecione um cenário.</p>{btn('Simular login confirmado',()=>{setConfirmed(true);simulate('acceptance','login');},true)}{btn('Simular e-mail pendente',()=>go('pending'))}{btn('Simular falha de login',()=>{setResume('login');go('error');})}{btn('Esqueci a senha',()=>go('recovery'))}{btn('Voltar',clear)}</>}
        {step==='recovery'&&<><p>Simulação de pedido de recuperação. A resposta não indica se existe uma conta.</p>{btn('Simular solicitação de recuperação',()=>simulate('reset','recovery'),true)}{btn('Cancelar',()=>go('login'))}</>}
        {step==='reset'&&<><p>Não digite senhas. Este cenário simula o resultado da recuperação, sem credenciais.</p>{btn('Simular redefinição válida',()=>{setConfirmed(false);setTerms(false);setPrivacy(false);go('login');},true)}{btn('Simular link inválido',()=>{setResume('recovery');go('error');})}{btn('Cancelar',clear)}</>}
        {step==='loading'&&<><p role="status">Carregando cenário sintético…</p>{btn('Cancelar',clear)}</>}
        {step==='acceptance'&&<><p>Confira os documentos de ensaio antes de entrar no acolhimento. A recusa não cria espaço.</p>{checks}{btn('Continuar para acolhimento',accept,true)}{btn('Sair sem aceitar',clear)}</>}
        {(step==='family'||step==='professional')&&<><p>{step==='family'?'Este espaço demonstrativo está vazio. Não há crianças cadastradas.':'Este acolhimento é informativo. Nenhuma credencial profissional foi verificada e nenhum acesso foi concedido.'}</p><div className="rounded-xl bg-[#80C5B5]/20 p-4"><h2 className="font-bold">Privacidade e limites</h2><p>Cadastro infantil, convites e compartilhamento estão indisponíveis. Nenhuma informação foi armazenada.</p></div>{btn('Simular acesso bloqueado',()=>go('blocked'))}{btn('Simular sessão expirada',()=>{setConfirmed(false);setTerms(false);setPrivacy(false);go('expired');})}{btn('Sair da demonstração',clear,true)}</>}
        {step==='expired'&&<><p>O acolhimento foi encerrado. Entre novamente no cenário.</p>{btn('Voltar ao login',()=>go('login'),true)}{btn('Sair',clear)}</>}
        {step==='blocked'&&<><p>Nenhuma autorização infantil ou profissional está disponível nesta jornada.</p>{btn('Voltar ao início',clear,true)}</>}
        {step==='error'&&<><p role="alert">Não foi possível concluir a ação simulada. Tente novamente ou volte ao início.</p>{btn('Tentar novamente',()=>go(resume),true)}{btn('Cancelar',clear)}</>}
      </section>
    </main>
  </div>;
}
