'use strict';

// Application layout: Motion Sites / Fitness Dashboard. Persistent card deck:
// Motion Sites / Bite-Sized Courses. Adaptations keep clinical photographs
// complete and untinted, with actual local practice data and explicit labels.
const PRACTICE_MODES = [
 {title:'Ronda inicial',description:'Reconoce, compara e integra. Cinco decisiones para entrar en ritmo.',count:5,action:'start-demo',label:'Empezar esta ronda',photo:'tvc-029',tag:'OBSERVA · COMPARA · INTEGRA'},
 {title:'Práctica a tu medida',description:'Retos nuevos y repaso de lo que necesita otra mirada.',count:7,action:'start-adaptive',label:'Entrenar ahora',photo:'tvc-031',tag:'NUEVOS RETOS + REPASO'},
 {title:'El reto del día',description:'La misma selección para ti y tus colegas. Vuelve mañana por otra.',count:3,action:'start-daily',label:'Resolver el reto diario',photo:'tvc-040',tag:'UNA SELECCIÓN CADA DÍA'}
];
state.hubMode=0;
state.routeGroup='all';
let studioDeck=null;
let deckBusy=false;
let studioGesture=null;

function practiceNumbers(){
 const today=progress.history.filter(r=>r.date===localDate()).reduce((sum,r)=>sum+r.total,0);
 const streak=progress.lastDate===localDate()||progress.lastDate===yesterday()?progress.streak:0;
 return {today,streak,chapters:Object.keys(progress.chapters).length};
}

function studioMode(index){
 const mode=PRACTICE_MODES[index];
 const resume=index===0&&savedSession;
 return {...mode,title:resume?'Continúa donde ibas':mode.title,
  description:resume?'Retoma «'+savedSession.round.title+'». Tus respuestas registradas se conservan.':mode.description,
  count:resume?savedSession.round.ids.length-savedSession.round.index-Number(savedSession.checked):mode.count,
  action:resume?'resume-round':mode.action,label:resume?'Retomar ronda':mode.label,
  tag:resume?'RONDA GUARDADA':mode.tag};
}

function renderPracticeDeck(){
 const labels=['Ronda inicial','A tu medida','Reto diario'];
 return `<section class="studio-deck-section" aria-label="Elige el tipo de ronda">
  <div class="studio-mode-tabs" role="group" aria-label="Tipos de ronda">${PRACTICE_MODES.map((m,i)=>`<button class="studio-mode-tab ${i===state.hubMode?'active':''}" data-action="hub-select" data-index="${i}" aria-pressed="${i===state.hubMode}">${labels[i]} <span>${m.count}</span></button>`).join('')}</div>
  <div class="deck-stage"><div class="course-swipe-deck" data-hub-deck tabindex="0" aria-label="Rondas de práctica. Usa las flechas izquierda y derecha para cambiar.">
  ${PRACTICE_MODES.map((_,index)=>{
   const mode=studioMode(index),photo=photoOf(mode.photo),position=(index-state.hubMode+3)%3;
   return `<article class="course-card swipe-card state-${position}" data-mode="${index}" aria-hidden="${position!==0}" aria-label="${esc(mode.title)}">
    <div class="course-artwork"><img src="${esc(photo.file)}" alt="Fotografía clínica de ejemplo para la ronda" draggable="false" decoding="async"><span class="duration">${mode.count} ${mode.action==='resume-round'?'pendientes':'retos'}</span></div>
    <div class="course-copy"><span class="eyebrow">${mode.tag}</span><h2>${esc(mode.title)}</h2><p>${esc(mode.description)}</p><div class="course-bottom"><span>A tu ritmo. Sin cronómetro.</span><span class="play-caption">${mode.action==='resume-round'?'Retomar':'Jugar'}</span></div></div>
    <button class="play-course" data-action="${mode.action}" aria-label="${esc(mode.label)}" tabindex="${position===0?'0':'-1'}">${icon('arrow')}</button>
    <p class="course-credit">Fotografía de ejemplo · ${photoCredit(photo)}</p>
   </article>`;
  }).join('')}</div></div>
  <div class="studio-deck-footer"><div><button class="deck-arrow previous" data-action="hub-previous" aria-label="Tipo de ronda anterior">${icon('arrow')}</button><span class="deck-position">${String(state.hubMode+1).padStart(2,'0')} / 03</span><button class="deck-arrow" data-action="hub-next" aria-label="Siguiente tipo de ronda">${icon('arrow')}</button></div><span>Desliza o usa las flechas.</span></div>
 </section>`;
}

renderHome=function(){
 const n=practiceNumbers(),goal=Math.min(n.today,5);
 const next=CHAPTERS.find(c=>!progress.chapters[c.id])||CHAPTERS[0];
 return `<header class="studio-page-head"><div><span class="eyebrow">TU AULA DE PRÁCTICA / CEAP 2020</span><h1>Una ronda. Una mirada mejor.</h1><p>Elige cómo entrenar hoy.</p></div><button class="xp-chip" data-action="navigate" data-view="progress">${icon('award')}<span><b>${Number(progress.xp).toLocaleString('es-MX')}</b> puntos de práctica</span></button></header>
 <div class="studio-home-grid">${renderPracticeDeck()}<aside class="studio-practice-side" aria-label="Tu avance y siguiente paso">
  <section class="studio-today"><div class="studio-card-top"><span>UN POCO CADA DÍA</span><span class="studio-day">HOY</span></div><h2>Tu siguiente<br>acierto empieza aquí.</h2><p>Una ronda corta también cuenta.</p><div class="studio-goal-number"><b>${goal}<span>/5</span></b><span>retos de hoy</span></div><progress max="5" value="${goal}" aria-label="Objetivo de hoy: ${goal} de 5 retos">${goal}/5</progress><div class="studio-today-stats"><span><b>${progress.rounds}</b>${progress.rounds===1?'ronda terminada':'rondas terminadas'}</span><span><b>${n.streak}</b>${n.streak===1?'día de práctica':'días seguidos'}</span></div><small>Cuenta retos de rondas terminadas hoy, incluidas repeticiones.</small></section>
  <section class="studio-next"><span class="eyebrow">TU SIGUIENTE CAPÍTULO</span><div class="studio-next-heading"><span>${String(next.id).padStart(2,'0')}</span><h2>${esc(next.title)}</h2></div><p>${esc(next.subtitle)}</p><button class="btn primary" data-action="start-chapter" data-id="${next.id}">Continuar capítulo ${icon('arrow')}</button></section>
 </aside></div>
 <section class="studio-route-shortcut"><div><span class="eyebrow">7 CAPÍTULOS · A TU RITMO</span><h2>Observa. Distingue. Integra.</h2></div><div class="studio-chapter-buttons" aria-label="Ir a un capítulo">${CHAPTERS.map(c=>`<button data-action="start-chapter" data-id="${c.id}" aria-label="Capítulo ${c.id}: ${esc(c.title)}" class="${progress.chapters[c.id]?'practiced':''}">${String(c.id).padStart(2,'0')}</button>`).join('')}</div><button class="text-link" data-action="navigate" data-view="route">Ver la ruta ${icon('arrow')}</button></section>
 <div class="studio-study-links"><button data-action="navigate" data-view="library">${icon('layers')}<span><b>Biblioteca clínica</b><small>${PHOTO_BANK.length} fotografías con sus fuentes</small></span>${icon('arrow')}</button><button data-action="navigate" data-view="guide">${icon('target')}<span><b>Guía CEAP 2020</b><small>Consulta las reglas y vuelve a practicar</small></span>${icon('arrow')}</button></div>
 <p class="studio-context">Fotografías clínicas reales y escenarios didácticos identificados. Sin registro. Tu avance se guarda en este navegador.</p>`;
};

renderRoute=function(){
 const groups=[{id:'all',label:'Todos',ids:[1,2,3,4,5,6,7]},{id:'recognize',label:'Reconocer',ids:[1,2]},{id:'distinguish',label:'Distinguir',ids:[3,4]},{id:'integrate',label:'Integrar',ids:[5,6,7]}];
 const group=groups.find(g=>g.id===state.routeGroup)||groups[0];
 return `<header class="studio-page-head"><div><span class="eyebrow">TU RECORRIDO / 7 CAPÍTULOS</span><h1>Entrena una habilidad a la vez.</h1><p>Explora cualquier capítulo. Cada ronda reúne hasta cinco retos.</p></div><button class="btn primary" data-action="start-adaptive">Práctica a mi medida ${icon('arrow')}</button></header>
 <div class="route-tools"><div class="route-filters" role="group" aria-label="Filtrar capítulos por habilidad">${groups.map(g=>`<button class="route-filter ${g.id===state.routeGroup?'active':''}" data-action="route-group" data-group="${g.id}" aria-pressed="${g.id===state.routeGroup}">${g.label} <span>${g.ids.length}</span></button>`).join('')}</div><span>${Object.keys(progress.chapters).length} de 7 capítulos con ronda terminada</span></div>
 <section class="studio-course-list">${CHAPTERS.filter(c=>group.ids.includes(c.id)).map(c=>{
  const skill=progress.skills[c.id],done=progress.chapters[c.id];
  const accuracy=skill?.total?Math.round(skill.correct/skill.total*100):null;
  return `<article class="studio-course-row"><span class="studio-course-number">${String(c.id).padStart(2,'0')}</span><div class="studio-course-info"><span class="eyebrow">${c.cases.length} RETOS EN EL BANCO · ${done?'RONDA TERMINADA':skill?.total?'EN PRÁCTICA':'POR EXPLORAR'}</span><h2>${esc(c.title)}</h2><p>${esc(c.subtitle)}</p></div><span class="studio-course-accuracy">${accuracy===null?'A tu ritmo':accuracy+'% de aciertos'}</span><button class="course-enter" data-action="start-chapter" data-id="${c.id}" aria-label="Entrenar ${esc(c.title)}">${icon('arrow')}</button></article>`;
 }).join('')}</section><div class="notice studio-route-note">Los capítulos son habilidades de práctica. CEAP no se suma como una puntuación ni representa una evolución obligatoria. Los resultados no acreditan competencia clínica.</div>`;
};

function setHubMode(index,focusTarget=null){
 state.hubMode=(index+3)%3;
 const y=window.scrollY;
 render();window.scrollTo({top:y,behavior:'instant'});
 if(focusTarget)main.querySelector(focusTarget)?.focus({preventScroll:true});
 announce('Tipo de ronda: '+PRACTICE_MODES[state.hubMode].title);
}

function refreshStudioDeck(except=null){
 if(!studioDeck)return;
 studioDeck.querySelectorAll('[data-mode]').forEach(card=>{
  const position=(Number(card.dataset.mode)-state.hubMode+3)%3;
  if(card!==except){card.classList.remove('state-0','state-1','state-2');card.classList.add('state-'+position);}
  card.setAttribute('aria-hidden',String(position!==0));
  card.querySelector('button')?.setAttribute('tabindex',position===0?'0':'-1');
  card.querySelectorAll('a').forEach(link=>link.setAttribute('tabindex',position===0?'0':'-1'));
 });
 main.querySelectorAll('.studio-mode-tab').forEach(button=>{const active=Number(button.dataset.index)===state.hubMode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 const position=main.querySelector('.deck-position');if(position)position.textContent=String(state.hubMode+1).padStart(2,'0')+' / 03';
}

async function animateStudioDeck(index,direction=-1,restoreFocus=false){
 if(deckBusy||state.view!=='home')return;
 const target=(index+3)%3;if(target===state.hubMode)return;
 const deck=studioDeck,card=deck?.querySelector('[data-mode="'+state.hubMode+'"]');
 if(!card?.animate||window.matchMedia('(prefers-reduced-motion: reduce)').matches){setHubMode(target,restoreFocus?'[data-hub-deck]':null);return;}
 deckBusy=true;card.classList.add('is-leaving');
 const start=card.style.transform||'translate3d(0,0,0) rotate(0deg)';
 const distance=Math.min(650,Math.max(440,card.offsetWidth*1.35));
 const animation=card.animate([{transform:start,opacity:1},{transform:`translate3d(${direction*distance}px,36px,0) rotate(${direction*20}deg)`,opacity:.05}],{duration:430,easing:'cubic-bezier(.2,.72,.18,1)',fill:'forwards'});
 state.hubMode=target;refreshStudioDeck(card);
 try{await animation.finished;}catch(error){}
 animation.cancel();card.style.transform='';card.style.removeProperty('--swipe-shadow-opacity');card.classList.remove('is-leaving','is-dragging');
 if(studioDeck===deck&&deck.isConnected){refreshStudioDeck();if(restoreFocus)deck.focus({preventScroll:true});announce('Tipo de ronda: '+PRACTICE_MODES[target].title);}
 deckBusy=false;
}

const beforeStudioGame=renderGame;
renderGame=function(){return beforeStudioGame().replace('<div class="game-stats">','<button class="game-guide" data-action="navigate" data-view="guide">Guía CEAP</button><div class="game-stats">');};

const studioNavItems=[['home','Jugar','target'],['route','La ruta','layers'],['progress','Mi avance','award'],['library','Biblioteca','layers'],['guide','Guía CEAP','target']];
document.querySelectorAll('.nav button').forEach(button=>{const item=studioNavItems.find(i=>i[0]===button.dataset.view);if(item)button.setAttribute('aria-label',item[1]);if(item)button.innerHTML='<span class="studio-nav-icon">'+icon(item[2])+'</span><span>'+item[1]+'</span>';});
const mobileNavigation=document.createElement('nav');mobileNavigation.className='mobile-nav';mobileNavigation.setAttribute('aria-label','Navegación móvil');
mobileNavigation.innerHTML=studioNavItems.map(([view,label,name])=>`<button data-action="navigate" data-view="${view}">${icon(name)}<span>${label==='Mi avance'?'Avance':label==='Guía CEAP'?'Guía':label==='La ruta'?'Ruta':label}</span></button>`).join('');
document.body.append(mobileNavigation);
const beforeStudioRender=render;
render=function(){
 studioDeck=null;deckBusy=false;studioGesture=null;
 beforeStudioRender();document.body.dataset.screen=state.view;document.body.dataset.design='studio-2';
 const active=state.view==='game'?'home':state.view==='result'?'progress':state.view==='sources'?'guide':state.view;
 document.querySelectorAll('.nav button,.mobile-nav button').forEach(button=>{const on=button.dataset.view===active;button.classList.toggle('active',on);if(on)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
 if(state.view==='home'){const candidate=main.querySelector('.course-swipe-deck');if(candidate?.querySelectorAll('[data-mode]').length===3){studioDeck=candidate;refreshStudioDeck();}}
};

document.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
 switch(button.dataset.action){
  case'hub-next':animateStudioDeck(state.hubMode+1,-1);break;
  case'hub-previous':animateStudioDeck(state.hubMode-1,1);break;
  case'hub-select':animateStudioDeck(Number(button.dataset.index),Number(button.dataset.index)>state.hubMode?-1:1);break;
  case'route-group':state.routeGroup=button.dataset.group;render();main.querySelector('[data-group="'+state.routeGroup+'"]')?.focus({preventScroll:true});break;
 }
});
document.addEventListener('keydown',event=>{
 if(state.view!=='home'||!event.target.closest?.('[data-hub-deck]'))return;
 if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();animateStudioDeck(state.hubMode+(event.key==='ArrowRight'?1:-1),event.key==='ArrowRight'?-1:1,true);}
});
document.addEventListener('pointerdown',event=>{
 const card=event.target.closest('.swipe-card.state-0');
 if(!card||deckBusy||event.target.closest('button,a')||(event.pointerType==='mouse'&&event.button!==0))return;
 studioGesture={card,id:event.pointerId,startX:event.clientX,startY:event.clientY,x:0,y:0,lastX:event.clientX,lastTime:event.timeStamp,velocity:0};
 card.classList.add('is-dragging');card.setPointerCapture?.(event.pointerId);
});
document.addEventListener('pointermove',event=>{
 const g=studioGesture;if(!g||g.id!==event.pointerId)return;
 const dx=event.clientX-g.startX,dy=event.clientY-g.startY;
 if(Math.abs(dy)>18&&Math.abs(dy)>Math.abs(dx)*1.3){cancelStudioGesture();return;}
 if(Math.abs(dx)<8)return;
 if(event.cancelable)event.preventDefault();
 const elapsed=Math.max(1,event.timeStamp-g.lastTime);g.velocity=g.velocity*.65+(event.clientX-g.lastX)/elapsed*.35;g.lastX=event.clientX;g.lastTime=event.timeStamp;
 g.x=dx;g.y=Math.max(-48,Math.min(48,dy*.3));
 g.card.style.transform=`translate3d(${g.x}px,${g.y}px,0) rotate(${Math.max(-12,Math.min(12,g.x*.035))}deg)`;
 g.card.style.setProperty('--swipe-shadow-opacity',String(Math.min(.2,Math.abs(dx)/650)));
},{passive:false});
function cancelStudioGesture(){
 const g=studioGesture;if(!g)return;studioGesture=null;
 try{g.card.releasePointerCapture?.(g.id);}catch(error){}
 g.card.classList.remove('is-dragging');g.card.style.transform='';g.card.style.removeProperty('--swipe-shadow-opacity');
}
function endStudioGesture(event){
 const g=studioGesture;if(!g||g.id!==event.pointerId)return;
 if(event.type==='pointercancel'){cancelStudioGesture();return;}
 studioGesture=null;try{g.card.releasePointerCapture?.(g.id);}catch(error){}
 g.card.classList.remove('is-dragging');
 const projected=g.x+g.velocity*150;
 if(Math.abs(g.x)>=76||(Math.abs(projected)>=112&&Math.abs(g.x)>=18)){animateStudioDeck(state.hubMode+1,Math.sign(g.x||g.velocity)||-1);}
 else{g.card.style.transform='';g.card.style.removeProperty('--swipe-shadow-opacity');}
}
document.addEventListener('pointerup',endStudioGesture);
document.addEventListener('pointercancel',endStudioGesture);
render();
