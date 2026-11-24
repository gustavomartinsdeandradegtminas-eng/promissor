(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA='5535992460382', WA_RH='5535992460246', MAIL='rh@promissorarmazem.com.br';
  var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};

  /* ----- cabeçalho, menu e botão flutuante ----- */
  var hdr=$('.hdr'), fab=$('#fab'), hero=$('#inicio');
  var burger=$('#burger'), mnav=$('#mnav');
  function setMenu(open){
    burger.setAttribute('aria-expanded',open?'true':'false');
    burger.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    mnav.classList.toggle('is-open',open);
    document.body.style.overflow=open?'hidden':'';
  }
  burger.addEventListener('click',function(){setMenu(burger.getAttribute('aria-expanded')!=='true')});
  $$('a',mnav).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&mnav.classList.contains('is-open')){setMenu(false);burger.focus()}});
  window.addEventListener('resize',function(){if(window.innerWidth>=980)setMenu(false)});

  /* ----- hero: barras diagonais, cisalhamento no scroll ----- */
  requestAnimationFrame(function(){requestAnimationFrame(function(){hero.classList.add('is-in')})});

  /* ----- scroll: tudo em um único rAF ----- */
  var steps=$('#steps'), stepEls=$$('.step',steps), ticking=false;
  function onScroll(){
    ticking=false;
    var y=window.scrollY||0, vh=window.innerHeight;
    hdr.classList.toggle('is-stuck',y>8);
    fab.classList.toggle('is-on',y>vh*0.7);
    if(!reduce){hero.style.setProperty('--sh',clamp(y/9,0,60).toFixed(1))}
    if(!reduce){
      var r=steps.getBoundingClientRect();
      var p=clamp((vh*0.55-r.top)/r.height,0,1);
      steps.style.setProperty('--p',p.toFixed(4));
      stepEls.forEach(function(s){s.classList.toggle('is-on',s.getBoundingClientRect().top<vh*0.62)});
    }
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
  window.addEventListener('resize',onScroll);
  onScroll();

  /* ----- pilares: sublinhado desenha ao aparecer ----- */
  var vals=$('#values');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.6});
    io.observe(vals);
  } else {vals.classList.add('is-in')}

  /* ----- grãos caindo no hero ----- */
  var cv=$('#grains');
  if(cv && !reduce && cv.getContext){
    var ctx=cv.getContext('2d'), W=0,H=0,dpr=1,grains=[],running=false,last=0;
    var cols=['#E2A82E','#F0C25A','#C98F1B','#F6D58A'];
    function size(){
      var r=cv.getBoundingClientRect(); dpr=Math.min(window.devicePixelRatio||1,2);
      W=r.width;H=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function spawn(g,first){
      g.x=W*(0.50+Math.random()*0.36); g.y=first?Math.random()*H:-8-Math.random()*H*0.2;
      g.r=1.6+Math.random()*2.6; g.vy=70+Math.random()*110; g.vx=-(18+Math.random()*34);
      g.a=.35+Math.random()*.5; g.c=cols[(Math.random()*cols.length)|0]; g.rot=Math.random()*Math.PI;
    }
    function init(){size();var n=Math.round(clamp(W/9,26,70));grains=[];for(var i=0;i<n;i++){var g={};spawn(g,true);grains.push(g)}}
    function frame(t){
      if(!running)return;
      var dt=Math.min((t-last)/1000,.05); last=t;
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<grains.length;i++){
        var g=grains[i]; g.y+=g.vy*dt; g.x+=g.vx*dt; g.vy+=40*dt;
        if(g.y>H+8||g.x<-8){spawn(g,false)}
        var fade=clamp((H-g.y)/(H*.25),0,1);
        ctx.globalAlpha=g.a*fade; ctx.fillStyle=g.c;
        ctx.beginPath(); ctx.ellipse(g.x,g.y,g.r*1.25,g.r,g.rot,0,6.2832); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    function start(){if(running)return;running=true;last=performance.now();requestAnimationFrame(frame)}
    function stop(){running=false}
    init();
    window.addEventListener('resize',function(){init()});
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){es[0].isIntersecting?start():stop()},{threshold:0}).observe(hero);
    } else start();
    document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});
  }

  /* ----- unidades: mapa e cartões ----- */
  function setUnit(id){
    $$('.pin').forEach(function(p){p.classList.toggle('is-active',p.dataset.unit===id)});
    $$('.unit').forEach(function(u){u.classList.toggle('is-active',u.dataset.unit===id)});
  }
  $$('.pin').forEach(function(p){p.addEventListener('click',function(){
    setUnit(p.dataset.unit);
    var u=$('.unit[data-unit="'+p.dataset.unit+'"]');
    if(window.innerWidth<900&&u){u.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})}
  })});
  $$('.unit').forEach(function(u){u.addEventListener('click',function(e){if(!e.target.closest('a'))setUnit(u.dataset.unit)})});

  /* ----- formulários: WhatsApp e e-mail ----- */
  function val(id){return ($('#'+id).value||'').trim()}
  function bad(id,on){var el=$('#'+id);el.setAttribute('aria-invalid',on?'true':'false');return on}
  function wire(link,url){link.setAttribute('href',url)}
  $$('.fld input,.fld textarea').forEach(function(el){el.addEventListener('input',function(){el.removeAttribute('aria-invalid')})});
  function digits(s){return s.replace(/\D/g,'')}

  var ctSend=$('#ctSend'), ctStatus=$('#ctStatus');
  function ctBuild(){
    var t='Olá! Vim pelo site da Promissor.\n\nNome: '+val('ct-nome')+'\nUnidade: '+$('#ct-uni').value+'\nAssunto: '+$('#ct-ass').value+'\n\n'+val('ct-msg');
    if(val('ct-tel'))t+='\n\nTelefone para retorno: '+val('ct-tel');
    wire(ctSend,'https://wa.me/'+WA+'?text='+encodeURIComponent(t));
  }
  ['ct-nome','ct-uni','ct-ass','ct-msg','ct-tel'].forEach(function(id){$('#'+id).addEventListener('input',ctBuild);$('#'+id).addEventListener('change',ctBuild)});
  ctBuild();
  ctSend.addEventListener('click',function(e){
    var e1=bad('ct-nome',!val('ct-nome')), e2=bad('ct-msg',!val('ct-msg'));
    if(e1||e2){e.preventDefault();ctStatus.textContent='Preencha os campos marcados para continuar.';(e1?$('#ct-nome'):$('#ct-msg')).focus();return}
    ctBuild();
    ctStatus.innerHTML='Abrindo o WhatsApp… Se não abrir, <a href="'+ctSend.getAttribute('href')+'" target="_blank" rel="noopener">toque aqui</a>.';
  });

  var cvMail=$('#cvMail'), cvZap=$('#cvZap'), cvStatus=$('#cvStatus');
  function cvText(){
    var t='Olá! Gostaria de enviar meu currículo.\n\nNome: '+val('cv-nome')+'\nTelefone: '+val('cv-tel');
    if(val('cv-mail'))t+='\nE-mail: '+val('cv-mail');
    t+='\nVaga de interesse: '+$('#cv-vaga').value;
    if(val('cv-msg'))t+='\n\n'+val('cv-msg');
    return t;
  }
  function cvBuild(){
    var t=cvText();
    wire(cvZap,'https://wa.me/'+WA_RH+'?text='+encodeURIComponent(t));
    wire(cvMail,'mailto:'+MAIL+'?subject='+encodeURIComponent('Currículo – '+$('#cv-vaga').value)+'&body='+encodeURIComponent(t+'\n\n(Currículo em anexo)'));
  }
  ['cv-nome','cv-tel','cv-mail','cv-vaga','cv-msg'].forEach(function(id){$('#'+id).addEventListener('input',cvBuild);$('#'+id).addEventListener('change',cvBuild)});
  cvBuild();
  function cvCheck(e){
    var e1=bad('cv-nome',!val('cv-nome')), e2=bad('cv-tel',digits(val('cv-tel')).length<10);
    if(e1||e2){e.preventDefault();cvStatus.textContent='Preencha os campos marcados para continuar.';(e1?$('#cv-nome'):$('#cv-tel')).focus();return false}
    cvBuild(); return true;
  }
  cvMail.addEventListener('click',function(e){if(cvCheck(e))cvStatus.innerHTML='Abrindo seu e-mail… Se não abrir, escreva para <strong>'+MAIL+'</strong> e anexe o currículo.'});
  cvZap.addEventListener('click',function(e){if(cvCheck(e))cvStatus.textContent='Abrindo o WhatsApp do RH…'});
})();
