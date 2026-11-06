'use strict';
const PHOTO_BY_ID = new Map(PHOTO_BANK.map(photo => [photo.id, photo]));
const CLASS_NAMES = {
 C0:'Sin signos visibles o palpables', C1:'Telangiectasias o venas reticulares',
 C2:'Venas varicosas', C3:'Edema', C4:'Cambios cutáneos o del tejido subcutáneo',
 C5:'Úlcera venosa cicatrizada', C6:'Úlcera venosa activa'
};
function stableNumber(value){let number=2166136261;for(const char of String(value)){number^=char.charCodeAt(0);number=Math.imul(number,16777619);}return number>>>0;}
function shuffled(values,seed){return [...values].map((value,index)=>({value,key:stableNumber(seed+':'+index+':'+value)})).sort((a,b)=>a.key-b.key).map(item=>item.value);}
const registryPhotos = PHOTO_BANK.filter(photo=>photo.sourceType==='dataset' && photo.eligibleForGame!==false);
const articlePhotos = PHOTO_BANK.filter(photo=>photo.sourceType==='article');
const byClass = code => registryPhotos.filter(photo=>photo.class===code);
const firstPhoto = (code,index=0) => byClass(code)[index%Math.max(1,byClass(code).length)]?.id;
const chapterForClass = {C0:1,C1:1,C2:1,C3:2,C4:2,C5:4,C6:4};
for(const photo of registryPhotos){
 const codes=['C0','C1','C2','C3','C4','C5','C6'];
 const near=codes.filter(code=>code!==photo.class).sort((a,b)=>Math.abs(Number(a[1])-Number(photo.class[1]))-Math.abs(Number(b[1])-Number(photo.class[1]))).slice(0,3);
 const options=shuffled([photo.class,...near],photo.id);
 CASES['photo-'+photo.id]={
  chapter:chapterForClass[photo.class],type:'choice',kind:'registry',photo:photo.id,
  title:'¿Qué clase C tiene el caso de referencia?',
  description:'Observa la fotografía y elige la categoría clínica registrada en el repositorio. La etiqueta es del caso completo, no una nueva valoración de cada pierna.',
  hint:photo.class==='C4'?'La fuente reúne los cambios cutáneos en C4, sin especificar subclase.':CLASS_NAMES[photo.class]+'. Es la definición de la categoría registrada; el repositorio no aporta una exploración detallada.',
  options:options.map(code=>[code,CLASS_NAMES[code]]),answer:options.indexOf(photo.class),
  explanation:'La clase de referencia del caso en TRICVI–C es '+photo.class+' ('+CLASS_NAMES[photo.class].toLowerCase()+'). Etiqueta asignada por un angiólogo en la fuente y contrastada entre tabla y carpeta.'+(photo.class==='C4'?' La fuente no distingue C4a, C4b o C4c; este ejercicio tampoco adjudica una subclase.':'')+(photo.class==='C0'||photo.class==='C3'||photo.class==='C5'?' El aspecto de una fotografía no sustituye exploración ni antecedentes; la referencia procede del registro clínico.':''),
  sourceEvidence:'Clase '+photo.class+' en tabla clínica y carpeta del mismo voluntario. Etiqueta por voluntario; sin lateralidad documentada.'
 };
}
// Las historias de estas lecciones son escenarios didácticos expresos. La foto
// sirve como apoyo visual y no transfiere esos antecedentes al paciente real.
const lessonPhotos={c0:firstPhoto('C0'),c1:firstPhoto('C1'),c2:firstPhoto('C2'),edema:firstPhoto('C3'),pigment:'emmert-venous-ulcer-2021',fibrosis:'fallahzadeh-lipodermatosclerosis-2010',corona:'lessiani-corona-2024',atrophy:'emmert-venous-ulcer-2021',healed:firstPhoto('C5'),active:'emmert-venous-ulcer-2021',insufficient:'emmert-diabetic-pressure-2021',recurrence:'emmert-venous-ulcer-2021',varicoseRec:firstPhoto('C2',1),symptoms:firstPhoto('C2',2),intravenous:firstPhoto('C4'),extravenous:firstPhoto('C3'),physiology:firstPhoto('C2',3),assembly:firstPhoto('C2',4),advanced:'emmert-venous-ulcer-2021',missing:'lessiani-corona-2024'};
for(const [id,photo] of Object.entries(lessonPhotos)){
 if(CASES[id]&&PHOTO_BY_ID.has(photo)){CASES[id].photo=photo;CASES[id].kind='simulation';}
}
CASES.compare.pairPhotos=[firstPhoto('C1'),'lessiani-corona-2024'];
CASES.compare.kind='published';
CASES.compare.title='¿Dónde se documenta corona flebectásica?';
CASES.compare.options=[['Caso A','Patrón de la fotografía A'],['Caso B','Patrón de la fotografía B']];
CASES.compare.pairCaptions=['A · Caso del repositorio clasificado C1.','B · Figura clínica publicada para estudiar un hallazgo adicional.'];
CASES.compare.description='Compara los patrones. ¿En qué fotografía está documentada corona flebectásica? Se pregunta por el hallazgo, no por la clase básica completa del miembro.';
CASES.compare.sourceEvidence='A: etiqueta C1 de TRICVI–C. B: Lessiani et al. (2024), figura 1: “Example of corona phlebectatica”.';
CASES.compare.explanation='La fuente identifica corona flebectásica en B. Ese hallazgo se registra como C4c. La figura no permite excluir otras manifestaciones o completar E, A y P.';
Object.assign(CASES.pigment,{type:'choice',kind:'published',title:'Un hallazgo adicional en una úlcera venosa.',description:'El pie de figura documenta hiperpigmentación parduzca alrededor de la lesión. ¿Qué subclase corresponde a ese hallazgo adicional?',options:[['C3','Edema'],['C4a','Pigmentación o eccema'],['C4b','Lipodermatoesclerosis o atrofia blanca']],answer:1,explanation:'La pigmentación venosa es C4a. En esta fotografía también hay una úlcera venosa activa documentada: la clase clínica básica del caso es C6. Se está preguntando por un hallazgo concomitante.',sourceEvidence:'Emmert et al. (2021), figura 1: brownish hyperpigmentation, venous leg ulcer.'});
Object.assign(CASES.fibrosis,{kind:'published',description:'El artículo confirma lipodermatoesclerosis en esta fotografía. ¿Qué subclase incluye ese hallazgo?',sourceEvidence:'Fallahzadeh et al. (2010): diagnóstico explícito de lipodermatosclerosis.',explanation:'La lipodermatoesclerosis se incluye en C4b. El diagnóstico procede del caso publicado. Un acercamiento no permite excluir otras clases fuera del encuadre.'});
Object.assign(CASES.corona,{kind:'published',description:'Observa el patrón en el tobillo y el pie. La figura publicada documenta corona flebectásica. ¿Qué subclase le corresponde?',sourceEvidence:'Lessiani et al. (2024), figura 1: Example of corona phlebectatica.'});
Object.assign(CASES.atrophy,{kind:'published',description:'El pie de figura documenta atrofia blanca junto a una úlcera venosa activa. ¿Qué subclase incluye la atrofia blanca como hallazgo adicional?',explanation:'La atrofia blanca es un hallazgo C4b. No equivale por sí sola a C5. En la imagen completa, la úlcera activa documentada determina C6 para el registro básico.',sourceEvidence:'Emmert et al. (2021), figura 1, atrophie blanche.'});
Object.assign(CASES.active,{kind:'published',description:'La publicación identifica una úlcera venosa crónica activa. ¿Qué clase clínica se registra en CEAP básica?',sourceEvidence:'Emmert et al. (2021), figura 1: Chronic venous leg ulcer.',explanation:'La úlcera venosa activa determina C6 en CEAP básica. Los cambios cutáneos coexistentes no sustituyen esa clase. La recurrencia no está documentada para este paciente.'});
Object.assign(CASES.insufficient,{kind:'published',title:'Una herida abierta no basta.',description:'La fuente describe esta lesión como una úlcera diabética por presión. ¿Puedes asignarle C6 automáticamente?',options:[['Sí','Toda herida abierta es C6'],['Sí, C6r','El pie confirma recurrencia'],['No','C6 requiere una úlcera de origen venoso']],answer:2,explanation:'C6 se refiere a úlcera venosa activa. La fuente describe una úlcera diabética por presión. Esto no demuestra ausencia de enfermedad venosa coexistente, pero impide atribuir C6 automáticamente a esta herida.',sourceEvidence:'Emmert et al. (2021), figura 3: diabetic pressure ulcer on the foot.'});
Object.assign(CASES.advanced,{kind:'published',description:'El pie de figura confirma úlcera venosa activa, pigmentación, liposclerosis, atrofia blanca y corona flebectásica. Selecciona las clases C respaldadas por esos hallazgos.',records:[{label:'Descripción publicada',text:'Se documentan úlcera venosa activa, hiperpigmentación, liposclerosis, atrofia blanca y corona flebectásica. No se establece aquí una nueva etiqueta para edema o recurrencia.'}],options:[['C6','Solo la clase clínica más alta'],['C4a, C4b, C4c, C6','Clases respaldadas por los hallazgos descritos'],['C6r','Recurrencia inferida por la apariencia']],answer:1,explanation:'Estos hallazgos sustentan C4a, C4b, C4c y C6 en un registro detallado. CEAP básica usa C6. No se añade recurrencia ni otras manifestaciones que el ejercicio no documenta.',sourceEvidence:'Emmert et al. (2021), figura 1. Mapeo de hallazgos a CEAP 2020.'});
CASES.recurrence.explanation=CASES.recurrence.explanation.replace('por el dibujo','por la fotografía');
const extraLessons=[
 {id:'recurrence-data',chapter:5,photo:'emmert-venous-ulcer-2021',kind:'published',type:'choice',title:'¿Qué necesitas para justificar C6r?',description:'La fuente confirma úlcera venosa activa, pero no informa recurrencia. Elige el dato necesario.',options:[['Color','El color del lecho'],['Historia','Cicatrización previa y reaparición documentadas'],['Tamaño','Las dimensiones de la lesión']],answer:1,explanation:'C6r requiere recurrencia. Esa historia no está en el pie de figura; no se asigna el modificador r al paciente publicado.'},
 {id:'asymptomatic',chapter:5,photo:firstPhoto('C2'),kind:'simulation',type:'layers',title:'El tamaño de la vena no revela síntomas.',description:'En este escenario simulado hay C2. Abre la entrevista para completar el descriptor.',records:[{label:'Entrevista simulada',text:'La valoración del escenario documenta ausencia de síntomas atribuibles a enfermedad venosa.'}],required:[0],options:[['C2s','Sintomática'],['C2a','Asintomática'],['C2r','Recurrente']],answer:1,explanation:'El descriptor a registra ausencia de síntomas atribuibles a enfermedad venosa. Este antecedente es del escenario didáctico, no del paciente fotografiado.'},
 {id:'congenital',chapter:6,photo:firstPhoto('C2'),kind:'simulation',type:'layers',title:'La etiología no se deduce de la foto.',description:'Completa E en este escenario didáctico.',records:[{label:'Valoración simulada',text:'La evaluación confirma una anomalía venosa congénita responsable de las manifestaciones de esta extremidad.'}],required:[0],options:[['Ec','Congénita'],['Ep','Primaria'],['Esi','Secundaria intravenosa']],answer:0,explanation:'La anomalía congénita confirmada corresponde a Ec. El escenario no describe un diagnóstico nuevo del paciente de la fotografía.'},
 {id:'systems',chapter:6,photo:firstPhoto('C2',1),kind:'simulation',type:'layers',title:'Pueden coexistir varios sistemas.',description:'Elige A según el resultado simulado.',records:[{label:'Dúplex simulado',text:'Se documenta afectación tanto del sistema venoso superficial como del profundo. No se identifica afectación de perforantes.'}],required:[0],options:[['As','Solo superficial'],['Ad','Solo profundo'],['As,d','Superficial y profundo']],answer:2,explanation:'As,d registra la afectación de ambos sistemas documentados. A puede combinar territorios.'},
 {id:'obstruction',chapter:6,photo:firstPhoto('C4'),kind:'simulation',type:'layers',title:'Identifica la alteración hemodinámica.',description:'Completa P con el informe simulado.',records:[{label:'Estudio simulado',text:'Se documenta obstrucción venosa. El estudio no identifica reflujo.'}],required:[0],options:[['Pr','Reflujo'],['Po','Obstrucción'],['Pr,o','Ambos']],answer:1,explanation:'La obstrucción sin reflujo identificado se registra como Po.'},
 {id:'segment-a',chapter:7,photo:firstPhoto('C2',2),kind:'simulation',type:'layers',title:'Del nombre del segmento a su abreviatura.',description:'Practica la notación anatómica de CEAP 2020.',records:[{label:'Informe simulado',text:'Reflujo en la safena magna por encima de la rodilla.'}],required:[0],options:[['GSVa','Safena magna supragenicular'],['GSVb','Safena magna infragenicular'],['SSV','Safena menor']],answer:0,explanation:'GSVa corresponde a safena magna sobre la rodilla. Las abreviaturas sustituyen la numeración de segmentos en la actualización 2020.'},
 {id:'segment-b',chapter:7,photo:firstPhoto('C2',3),kind:'simulation',type:'layers',title:'El segmento también importa.',description:'Elige la abreviatura correspondiente.',records:[{label:'Informe simulado',text:'Reflujo en la safena magna por debajo de la rodilla.'}],required:[0],options:[['GSVa','Safena magna supragenicular'],['GSVb','Safena magna infragenicular'],['SSV','Safena menor']],answer:1,explanation:'GSVb corresponde a safena magna bajo la rodilla. La localización detallada se vincula a la fisiopatología del segmento.'},
 {id:'no-pathology',chapter:6,photo:firstPhoto('C0'),kind:'simulation',type:'layers',title:'Información evaluada y no identificada.',description:'Distingue un estudio negativo de uno pendiente.',records:[{label:'Evaluación simulada',text:'Se completó la evaluación apropiada. No se identifica fisiopatología venosa subyacente.'}],required:[0],options:[['Pendiente','No se realizó evaluación'],['Pn','Sin fisiopatología venosa identificada'],['Pr','Reflujo supuesto']],answer:1,explanation:'Pn expresa ausencia de fisiopatología venosa identificada tras la evaluación apropiada. No equivale a un estudio que falta por realizar.'}
];
extraLessons.find(lesson=>lesson.id==='recurrence-data').sourceEvidence='Emmert et al. (2021), figura 1: úlcera venosa activa; recurrencia no documentada. El dato solicitado procede de CEAP 2020.';
for(const lesson of extraLessons)if(PHOTO_BY_ID.has(lesson.photo))CASES[lesson.id]=lesson;
const registryIds=code=>byClass(code).map(photo=>'photo-'+photo.id);
CHAPTERS[0].cases=[...registryIds('C0'),...registryIds('C1'),...registryIds('C2')];
CHAPTERS[1].cases=[...registryIds('C3'),...registryIds('C4'),'pigment','fibrosis'];
CHAPTERS[2].cases=['compare','corona','atrophy','fibrosis','pigment'];
CHAPTERS[3].cases=[...registryIds('C5'),...registryIds('C6'),'active','insufficient','healed'];
CHAPTERS[4].cases=['recurrence','varicoseRec','symptoms','recurrence-data','asymptomatic'];
CHAPTERS[5].cases=['intravenous','extravenous','physiology','congenital','systems','obstruction','no-pathology'];
CHAPTERS[6].cases=['assembly','advanced','missing','segment-a','segment-b'];
for(const chapter of CHAPTERS)chapter.cases=chapter.cases.filter(id=>CASES[id]&&(CASES[id].photo||CASES[id].pairPhotos));
DEMO.splice(0,DEMO.length,...[registryIds('C2')[0],'compare','pigment','recurrence','assembly'].filter(Boolean));
const playableIds=new Set([...CHAPTERS.flatMap(chapter=>chapter.cases),...DEMO]);
for(const id of Object.keys(CASES))if(!playableIds.has(id))delete CASES[id];
