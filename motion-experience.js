'use strict';

// Motion Sites / Bite-Sized Courses: a featured deck, short rounds and explicit
// navigation. Adapted to this responsive clinical application; no template
// demo data, phone frames or decorative media are used.
const PRACTICE_MODES=[
 {title:'Ronda inicial',subtitle:'Cinco retos para entrar en ritmo.',description:'Reconoce un caso, compara dos fotografías e integra las pistas del expediente.',count:5,action:'start-demo',label:'Empezar esta ronda',photo:'tvc-029',tag:'OBSERVA · COMPARA · INTEGRA',tone:'rose'},
 {title:'Práctica a tu medida',subtitle:'Tu siguiente acierto empieza aquí.',description:'Combina retos nuevos y repaso según lo que ya has practicado en este navegador.',count:7,action:'start-adaptive',label:'Entrenar ahora',photo:'tvc-031',tag:'NUEVOS RETOS + REPASO',tone:'sage'},
 {title:'El reto del día',subtitle:'Tres decisiones. Una nueva oportunidad.',description:'Resuelve la selección de hoy y comparte el mismo desafío con tus colegas.',count:3,action:'start-daily',label:'Resolver el reto diario',photo:'tvc-040',tag:'UNA SELECCIÓN CADA DÍA',tone:'sand'}
];
state.hubMode=0;
state.routeGroup='all';

function practiceNumbers(){
 const today=progress.history.filter(round=>round.date===localDate()).reduce((sum,round)=>sum+round.total,0);
 const streak=progress.lastDate===localDate()||progress.lastDate===yesterday()?progress.streak:0;
 return {today,streak,chapters:Object.keys(progress.chapters).length};
}
function renderPracticeDeck(){
 const mode=PRACTICE_MODES[state.hubMode];
 const resume=state.hubMode===0&&savedSession;
 const title=resume?'Continúa donde ibas':mode.title;
 const current=resume?savedSession.round.index+1:0;
 const remaining=resume?savedSession.round.ids.length-savedSession.round.index-Number(savedSession.checked):mode.count;
 const photo=photoOf(mode.photo)||byClass('C2')[0];
 return `<section class="practice-deck" aria-label="Elige el tipo de ronda"><div class="deck-controls"><span class="eyebrow">ELIGE TU RONDA</span><div class="deck-switch"><button data-action="hub-previous" aria-label="Tipo de ronda anterior" class="deck-arrow previous">${icon('arrow')}</button><span class="deck-position">${String(state.hubMode+1).padStart(2,'0')} <span>/ 03</span></span><button data-action="hub-next" aria-label="Siguiente tipo de ronda" class="deck-arrow">${icon('arrow')}</button></div></div><div class="deck-stack"><div class="deck-back back-second" aria-hidden="true"></div><div class="deck-back back-first" aria-hidden="true"></div><article class="mode-front tone-${mode.tone}" data-hub-deck tabindex="0" aria-label="${esc(title)}. Usa las flechas izquierda y derecha para cambiar de tipo de ronda."><div class="mode-art"><img src="${esc(photo?.file||'')}" alt="Fotografía clínica de ejemplo para la ronda" draggable="false" decoding="async"><span class="mode-length">${remaining} ${resume?'pendientes':'retos'}</span></div><div class="mode-content"><span class="eyebrow red">${resume?'RONDA GUARDADA':mode.tag}</span><h2>${esc(title)}</h2><p>${resume?'Retoma «'+esc(savedSession.round.title)+'», reto '+current+' de '+savedSession.round.ids.length+'. Tus respuestas ya registradas se conservan.':mode.description}</p><div class="mode-action-row"><span class="mode-meta">A tu ritmo<br><b>Sin cronómetro</b></span><button class="btn primary mode-play" data-action="${resume?'resume-round':mode.action}">${resume?'Retomar ronda':mode.label} ${icon('arrow')}</button></div></div></article></div><div class="deck-bottom"><div class="deck-dots" role="group" aria-label="Tipos de ronda">${PRACTICE_MODES.map((item,index)=>`<button class="deck-dot ${index===state.hubMode?'active':''}" data-action="hub-select" data-index="${index}" aria-label="${esc(item.title)}" aria-pressed="${index===state.hubMode}"></button>`).join('')}</div><span>Cambia con las flechas o desliza la tarjeta.</span></div><p class="deck-attribution">Fotografía de ejemplo: ${photo?photoCredit(photo):''}</p></section>`;
}

renderHome=function(){
 const numbers=practiceNumbers();
 const next=CHAPTERS.find(chapter=>!progress.chapters[chapter.id])||CHAPTERS[0];
 const goal=Math.min(numbers.today,5);
 return `<header class="practice-heading"><div><div class="eyebrow red">TU ESPACIO DE PRÁCTICA / CEAP 2020</div><h1>Tu próxima ronda<br>empieza aquí.</h1><p>Observa el detalle. Conecta las pistas. Afina tu criterio.</p></div><div class="practice-counter"><span class="counter-value">${Number(progress.xp).toLocaleString('es-MX')}</span><span>puntos de práctica</span><button class="text-link" data-action="navigate" data-view="progress">Ver mi avance ${icon('arrow')}</button></div></header><div class="practice-hub">${renderPracticeDeck()}<aside class="practice-sidebar" aria-label="Tu avance y siguiente paso"><section class="today-card"><div class="card-eyebrow"><span class="eyebrow">UN POCO CADA DÍA</span><span class="day-label">HOY</span></div><h2>Tu ritmo.<br> Tu progreso.</h2><p>Una ronda corta también cuenta.</p><div class="goal-heading"><span>Objetivo de hoy</span><b>${goal} / 5 retos</b></div><progress class="daily-progress" max="5" value="${goal}" aria-label="Objetivo de práctica de hoy: ${goal} de 5 retos">${goal}/5</progress><div class="today-stats"><div><b>${progress.rounds}</b><span>${progress.rounds===1?'ronda terminada':'rondas terminadas'}</span></div><div><b>${numbers.streak}</b><span>${numbers.streak===1?'día de práctica':'días seguidos'}</span></div></div><p class="tiny-note">El objetivo cuenta retos de rondas terminadas hoy, incluidas repeticiones.</p></section><section class="next-chapter-card"><div class="eyebrow">SIGUE TU RECORRIDO</div><div class="next-chapter-heading"><span class="chapter-small-number">${String(next.id).padStart(2,'0')}</span><h3>${esc(next.title)}</h3></div><p>${esc(next.subtitle)}</p><button class="btn small" data-action="start-chapter" data-id="${next.id}">Continuar capítulo ${icon('arrow')}</button><button class="text-link" data-action="navigate" data-view="route">Explorar los 7 capítulos →</button></section></aside></div><section class="quick-study"><div><span class="eyebrow">APRENDE A TU MANERA</span><h2>Observa. Distingue. Integra.</h2></div><button class="study-link" data-action="navigate" data-view="library"><span><b>Biblioteca clínica</b><small>${PHOTO_BANK.length} fotografías con sus fuentes</small></span>${icon('arrow')}</button><button class="study-link" data-action="navigate" data-view="guide"><span><b>Guía CEAP 2020</b><small>Las reglas, a un toque</small></span>${icon('arrow')}</button></section><div class="home-note"><span>Fotografías clínicas reales y escenarios didácticos identificados. Sin registro; tu avance se guarda aquí.</span><button class="text-link" data-action="navigate" data-view="sources">Fuentes y alcance ↗</button></div>`;
};

renderRoute=function(){
 const groups=[{id:'all',label:'Todos',ids:[1,2,3,4,5,6,7]},{id:'recognize',label:'Reconocer',ids:[1,2]},{id:'distinguish',label:'Distinguir',ids:[3,4]},{id:'integrate',label:'Integrar',ids:[5,6,7]}];
 const group=groups.find(item=>item.id===state.routeGroup)||groups[0];
 const chapters=CHAPTERS.filter(chapter=>group.ids.includes(chapter.id));
 return `<div class="page-head route-heading"><div><div class="eyebrow red">TU RECORRIDO / 7 CAPÍTULOS</div><h1>Una habilidad.<br>Un nuevo detalle.</h1><p>Explora cualquier capítulo. Cada ronda reúne hasta cinco retos y cambia con tu práctica.</p></div><button class="btn primary small" data-action="start-adaptive">Práctica a mi medida ${icon('arrow')}</button></div><div class="route-tools"><div class="route-filters" role="group" aria-label="Filtrar capítulos por habilidad">${groups.map(item=>`<button class="route-filter ${state.routeGroup===item.id?'active':''}" data-action="route-group" data-group="${item.id}" aria-pressed="${state.routeGroup===item.id}">${item.label}<span>${item.ids.length}</span></button>`).join('')}</div><span class="route-explored">${Object.keys(progress.chapters).length} de 7 capítulos explorados</span></div><section class="motion-route-grid">${chapters.map(chapter=>{const attempts=progress.chapters[chapter.id];const skill=progress.skills[chapter.id];const accuracy=skill?.total?Math.round(skill.correct/skill.total*100):null;return `<button class="route-course ${attempts?'explored':''}" data-action="start-chapter" data-id="${chapter.id}"><div class="route-course-top"><span class="course-number">${String(chapter.id).padStart(2,'0')}</span><span class="course-status">${attempts?'Explorado':'Por explorar'}</span></div><div class="route-course-copy"><span class="eyebrow">${chapter.cases.length} RETOS EN EL BANCO</span><h2>${esc(chapter.title)}</h2><p>${esc(chapter.subtitle)}</p></div><div class="route-course-bottom"><span>${accuracy===null?'Empieza a tu ritmo':accuracy+'% de aciertos en la práctica'}</span><span class="course-arrow">${icon('arrow')}</span></div></button>`;}).join('')}</section><div class="notice route-note"><span>Los niveles representan habilidades del jugador. CEAP no se suma como una puntuación ni describe una evolución obligatoria. Los aciertos y capítulos explorados son datos de práctica, no una certificación.</span></div>`;
};

function setHubMode(index,focusTarget=null){
 state.hubMode=(index+PRACTICE_MODES.length)%PRACTICE_MODES.length;
 const scroll=window.scrollY;
 render();window.scrollTo({top:scroll,behavior:'instant'});
 if(focusTarget)main.querySelector(focusTarget)?.focus({preventScroll:true});
 announce('Tipo de ronda: '+PRACTICE_MODES[state.hubMode].title);
}
const mobileNavigation=document.createElement('nav');
mobileNavigation.className='mobile-nav';
mobileNavigation.setAttribute('aria-label','Navegación móvil');
mobileNavigation.innerHTML=[['home','Jugar'],['route','Ruta'],['progress','Avance'],['library','Biblioteca'],['guide','Guía']].map(([view,label])=>`<button data-action="navigate" data-view="${view}"><span>${label}</span></button>`).join('');
document.body.append(mobileNavigation);
const beforeMotionRender=render;
render=function(){
 beforeMotionRender();
 document.body.dataset.screen=state.view;
 const activeView=state.view==='game'?'home':state.view==='result'?'progress':state.view==='sources'?'guide':state.view;
 document.querySelectorAll('.mobile-nav button').forEach(button=>{const active=button.dataset.view===activeView;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
};

document.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
 switch(button.dataset.action){
  case'hub-next':setHubMode(state.hubMode+1,'[data-action="hub-next"]');break;
  case'hub-previous':setHubMode(state.hubMode-1,'[data-action="hub-previous"]');break;
  case'hub-select':setHubMode(Number(button.dataset.index),'[data-action="hub-select"][data-index="'+button.dataset.index+'"]');break;
  case'route-group':{state.routeGroup=button.dataset.group;render();main.querySelector('[data-action="route-group"][data-group="'+state.routeGroup+'"]')?.focus({preventScroll:true});break;}
 }
});
document.addEventListener('keydown',event=>{
 if(state.view!=='home'||!event.target.matches?.('[data-hub-deck]'))return;
 if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();setHubMode(state.hubMode+(event.key==='ArrowRight'?1:-1),'[data-hub-deck]');}
});
let deckGesture=null;
document.addEventListener('pointerdown',event=>{
 const card=event.target.closest('[data-hub-deck]');
 if(!card||event.target.closest('button,a')||(event.pointerType==='mouse'&&event.button!==0))return;
 deckGesture={card,id:event.pointerId,x:event.clientX,y:event.clientY};
 card.setPointerCapture?.(event.pointerId);
});
document.addEventListener('pointermove',event=>{
 if(!deckGesture||deckGesture.id!==event.pointerId)return;
 const dx=event.clientX-deckGesture.x,dy=event.clientY-deckGesture.y;
 if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.3){if(event.cancelable)event.preventDefault();deckGesture.card.style.transform='translate3d('+Math.max(-65,Math.min(65,dx*.3))+'px,0,0) rotate('+Math.max(-5,Math.min(5,dx*.012))+'deg)';}
},{passive:false});
function releaseDeckGesture(event){
 if(!deckGesture||deckGesture.id!==event.pointerId)return;
 const gesture=deckGesture;deckGesture=null;gesture.card.style.transform='';
 try{gesture.card.releasePointerCapture?.(event.pointerId);}catch(error){}
 if(event.type==='pointercancel')return;
 const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
 if(Math.abs(dx)>72&&Math.abs(dx)>Math.abs(dy)*1.3)setHubMode(state.hubMode+(dx<0?1:-1));
}
document.addEventListener('pointerup',releaseDeckGesture);
document.addEventListener('pointercancel',releaseDeckGesture);
render();
