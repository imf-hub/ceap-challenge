const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const project=path.resolve(__dirname,'..');
const files=['photos.js','lessons.js','clinical-bank.js','engine-base.js','experience.js','studio-experience.js'];
const memory=new Map();
function boot({blocked=false}={}){
 const nodes=new Map();
 function element(){return {innerHTML:'',textContent:'',dataset:{},className:'',open:false,isConnected:true,classList:{add(){},toggle(){}},insertAdjacentHTML(){},insertBefore(){},append(){},appendChild(){},querySelector(){return element();},querySelectorAll(){return[];},setAttribute(){},removeAttribute(){},focus(){},click(){},showModal(){this.open=true;},close(){this.open=false;},remove(){},scrollIntoView(){},closest(){return null;}};}
 const getNode=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);};
 const ctx={console,Date,URL,URLSearchParams,Blob,location:{protocol:'https:',origin:'https://imf-hub.github.io',pathname:'/ceap-challenge/',search:''},navigator:{clipboard:{writeText:async()=>{}}},localStorage:{getItem(key){if(blocked)throw Error('denied');return memory.get(key)||null;},setItem(key,value){if(blocked)throw Error('denied');memory.set(key,value);},removeItem(key){if(blocked)throw Error('denied');memory.delete(key);}},document:{getElementById:getNode,querySelector:getNode,querySelectorAll:()=>[],createElement:element,addEventListener(){},activeElement:null,body:element()},window:{scrollTo(){},scrollY:0,matchMedia:()=>({matches:true})},requestAnimationFrame:fn=>fn(),setTimeout:()=>0};
 vm.createContext(ctx);for(const file of files)vm.runInContext(fs.readFileSync(path.join(project,file),'utf8'),ctx,{filename:file});return ctx;
}
const ctx=boot();
vm.runInContext(`
 state.view='home';render();
 if(!main.innerHTML.includes('data-hub-deck'))throw Error('Missing practice deck');
 setHubMode(1);if(!main.innerHTML.includes('Práctica a tu medida'))throw Error('Mode selection failed');
 setHubMode(2);if(!main.innerHTML.includes('El reto del día'))throw Error('Daily mode failed');
 setHubMode(3);if(state.hubMode!==0)throw Error('Deck wrap failed');
 state.view='route';state.routeGroup='integrate';render();
 if((main.innerHTML.match(/data-action="start-chapter"/g)||[]).length!==3)throw Error('Chapter filter failed');
 state.routeGroup='all';
 if(PHOTO_BANK.length!==62||registryPhotos.length!==57)throw Error('Unexpected media count');
 const files=new Set();for(const photo of PHOTO_BANK){if(files.has(photo.file))throw Error('Duplicate file');files.add(photo.file);if(!photo.sourceUrl||!photo.licenseUrl||!photo.changes)throw Error('Missing attribution');}
 for(const [id,c] of Object.entries(CASES)){
  if(!c.explanation||!c.chapter)throw Error('Incomplete case '+id);
  if(c.photo&&!PHOTO_BY_ID.has(c.photo))throw Error('Missing photo '+id);
  if(c.pairPhotos&&!c.pairPhotos.every(photo=>PHOTO_BY_ID.has(photo)))throw Error('Missing pair '+id);
  if(c.kind==='registry'&&c.photo&&PHOTO_BY_ID.get(c.photo).class==='C4'&&c.options[c.answer][0]!=='C4')throw Error('Unsupported C4 subclass');
  if(c.type==='assembly'){if(c.groups.some(g=>!g.options[g.answer]))throw Error('Bad assembly answer');}
  else if(!c.options[c.answer])throw Error('Bad answer '+id);
 }
 for(const c of CHAPTERS){if(c.cases.length<3)throw Error('Chapter too small');if(c.cases.some(id=>!CASES[id]))throw Error('Missing chapter case');}
 for(const view of ['home','route','progress','guide','library','sources']){state.view=view;render();if(!main.innerHTML||main.innerHTML.includes('undefined'))throw Error('Invalid view '+view);}
 startRound(DEMO,'demo','Test');
 for(let i=0;i<DEMO.length;i++){
  const c=currentCase();state.read=[];state.selected=c.answer;
  if(c.type==='assembly')c.groups.forEach(g=>state.assembly[g.key]=g.answer);
  if(c.required?.length&&canSubmit(c))throw Error('Required records bypassed');
  state.read=[...(c.required||[])];
  checkAnswer();const score=state.round.score;checkAnswer();if(state.round.score!==score)throw Error('Double score');
  nextCase();
 }
 if(state.view!=='result'||state.round.score!==600||progress.rounds!==1)throw Error('Demo round failure');
 finishRound();if(progress.rounds!==1)throw Error('Duplicate persistence');
 for(const chapter of CHAPTERS){
  startRound(chapter.cases,'chapter',chapter.title,chapter.id);
  if(state.round.ids.length>5||new Set(state.round.ids).size!==state.round.ids.length)throw Error('Invalid adaptive selection');
  const count=state.round.ids.length;
  for(let i=0;i<count;i++){const c=currentCase();state.read=[...(c.required||[])];if(c.type==='assembly')c.groups.forEach(g=>state.assembly[g.key]=g.answer);else state.selected=c.answer;checkAnswer();nextCase();}
  if(!progress.chapters[chapter.id])throw Error('Chapter not saved');
 }
 startRound(['assembly'],'practice','Partial');state.read=[0,1,2];state.assembly={C:1,E:1,A:0,P:0};checkAnswer();if(state.round.score!==60||state.round.combo!==0)throw Error('Partial score wrong');nextCase();
 startRound(['corona','fibrosis'],'practice','Error');state.selected=0;checkAnswer();if(state.round.score||state.round.combo)throw Error('Wrong answer score');nextCase();state.selected=CASES.fibrosis.answer;checkAnswer();nextCase();if(state.round.score!==100)throw Error('Combo did not reset');
 const results=Object.values(progress.caseStats);if(!results.some(s=>s.nextReview))throw Error('No review schedule');
 if(new Set(dailyCases()).size!==3)throw Error('Daily duplicates');
 startAdaptive();if(state.round.ids.length!==7)throw Error('Adaptive round length');
 saveSession();if(!savedSession||savedSession.round.ids.length!==7)throw Error('Session not saved');
`,ctx);
const reloaded=boot();assert.equal(vm.runInContext('progress.rounds',reloaded),10);assert.equal(vm.runInContext('savedSession.round.ids.length',reloaded),7);
const blocked=boot({blocked:true});assert.equal(vm.runInContext('storageAvailable',blocked),false);
const media=JSON.parse(fs.readFileSync(path.join(project,'media-manifest.json'),'utf8'));
for(const photo of media.photos)assert.ok(fs.existsSync(path.join(project,photo.file)),photo.file);
const html=fs.readFileSync(path.join(project,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const target=match[1];if(!target.startsWith('http'))assert.ok(fs.existsSync(path.join(project,target)),target);}
console.log('PASS: media integrity, sources, 7 chapters, complete rounds, scoring, dossier gating, adaptive selection, spaced review, resume, persistence and blocked storage.');
console.log(vm.runInContext('JSON.stringify({photos:PHOTO_BANK.length,questions:Object.keys(CASES).length,chapters:CHAPTERS.length})',ctx));
