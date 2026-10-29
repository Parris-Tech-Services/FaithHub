import {PASSAGES,PLANS,THEMES,validateAtlas} from "./scripture-atlas-data.mjs";
validateAtlas();
const STORAGE="faithhub:scripture-atlas:v1";
const $=id=>document.getElementById(id);
const byRef=new Map(PASSAGES.map(x=>[x.ref,x]));
const byId=new Map(PASSAGES.map(x=>[x.id,x]));
const state={chosen:PASSAGES.find(x=>x.ref==="Psalm 23")?.id||PASSAGES[0].id,plan:PLANS[0].id,psalms:false,savedOnly:false,limit:18,query:"",theme:"",testament:"",book:""};
function readData(){try{const x=JSON.parse(localStorage.getItem(STORAGE)||"{}");if(!x||typeof x!=="object"||Array.isArray(x))return {};return x}catch{return {}}}
let data=readData();if(!Array.isArray(data.bookmarks))data.bookmarks=[];data.bookmarks=data.bookmarks.filter(x=>typeof x==="string"&&byId.has(x)).slice(0,PASSAGES.length);
if(!data.notes||typeof data.notes!=="object"||Array.isArray(data.notes))data.notes={};if(!data.done||typeof data.done!=="object"||Array.isArray(data.done))data.done={};
const store=()=>{try{localStorage.setItem(STORAGE,JSON.stringify(data));return true}catch{return false}};
function notify(id,message){$(id).textContent=message}
const text=(tag,content,cls)=>{const el=document.createElement(tag);el.textContent=content;if(cls)el.className=cls;return el};
const button=(label,click)=>{const el=text("button",label);el.type="button";el.addEventListener("click",click);return el};
function selected(){return byId.get(state.chosen)||PASSAGES[0]}
function filtered(){let items=PASSAGES.filter(p=>{
 if(state.psalms&&p.book!=="Psalm")return false;
 if(state.savedOnly&&!data.bookmarks.includes(p.id))return false;
 if(state.theme&&p.category!==state.theme&&!p.tags.includes(state.theme.toLowerCase()))return false;
 if(state.testament&&p.testament!==state.testament)return false;
 if(state.book&&p.book!==state.book)return false;
 const q=state.query.trim().toLowerCase();
 return !q||[p.ref,p.title,p.context,p.question,p.category,p.book,...p.tags].join(" ").toLowerCase().includes(q);
});return items;}
function renderLibrary(){const items=filtered();$("library-count").textContent=items.length+" passages found · "+PASSAGES.filter(p=>p.book==="Psalm").length+" Psalms curated";const grid=$("passage-grid");grid.replaceChildren();
for(const p of items.slice(0,state.limit)){const item=button("",()=>choose(p.id,true));item.className="passage-card";item.setAttribute("aria-pressed",p.id===state.chosen?"true":"false");item.setAttribute("aria-label","Study "+p.ref+": "+p.title);
item.append(text("span",p.ref+(data.bookmarks.includes(p.id)?" · Bookmarked":""),"passage-ref"),text("span",p.title,"passage-title"),text("span",p.context,"passage-summary"));grid.append(item);}
if(!items.length)grid.append(text("p","No passages match. Clear a filter or try another topic.","small"));$("show-more").hidden=state.limit>=items.length;}
function choose(id,focus=false){if(!byId.has(id))return;state.chosen=id;renderLibrary();renderStudy();if(focus){$("study").scrollIntoView({block:"start",behavior:"smooth"});$("study").focus({preventScroll:true});}}
function renderStudy(){const p=selected();$("study-heading").textContent=p.ref;$("study-tag").textContent=p.category;$("study-ref").textContent=p.testament+" Testament · "+p.ref;$("study-title").textContent=p.title;$("study-context").textContent=p.context;$("study-question").textContent=p.question;$("study-prayer").textContent=p.prayer;$("read-niv").href=p.niv;$("read-web").href=p.web;
$("bookmark-passage").setAttribute("aria-pressed",data.bookmarks.includes(p.id)?"true":"false");$("bookmark-passage").textContent=data.bookmarks.includes(p.id)?"Remove bookmark":"Bookmark passage";
$("memory-box").classList.add("hidden");$("memory-answer").classList.add("hidden");$("memory-answer").textContent=p.ref+" — "+p.title;$("memory-title").textContent="Open and read "+p.ref+" in full before practising recall.";$("memory-prompt").textContent="Hide the reference and test recall";
$("journal-ref").textContent=p.ref;$("journal-input").value=typeof data.notes[p.id]==="string"?data.notes[p.id]:"";notify("journal-feedback",typeof data.notes[p.id]==="string"?"Loaded note saved on this device.":"No saved note for this passage.");notify("study-feedback","");
const related=$("related");related.replaceChildren();const matches=PASSAGES.filter(other=>other.id!==p.id&&(other.category===p.category||other.tags.some(t=>p.tags.includes(t)))).slice(0,5);for(const other of matches)related.append(button(other.ref,()=>choose(other.id,true)));
}
const option=(value,label)=>{const el=document.createElement("option");el.value=value;el.textContent=label;return el};
for(const theme of THEMES)$("theme-filter").append(option(theme.id,theme.label));
for(const book of [...new Set(PASSAGES.map(x=>x.book))].sort((a,b)=>a.localeCompare(b,"en",{numeric:true})))$("book-filter").append(option(book,book));
$("search").addEventListener("input",e=>{state.query=e.target.value;state.limit=18;renderLibrary()});
for(const id of ["theme-filter","testament-filter","book-filter"])$(id).addEventListener("change",e=>{state[{"theme-filter":"theme","testament-filter":"testament","book-filter":"book"}[id]]=e.target.value;state.limit=18;renderLibrary()});
$("psalm-only").addEventListener("click",()=>{state.psalms=!state.psalms;$("psalm-only").setAttribute("aria-pressed",String(state.psalms));renderLibrary()});
$("saved-only").addEventListener("click",()=>{state.savedOnly=!state.savedOnly;$("saved-only").setAttribute("aria-pressed",String(state.savedOnly));renderLibrary()});
$("clear-filters").addEventListener("click",()=>{Object.assign(state,{query:"",theme:"",testament:"",book:"",psalms:false,savedOnly:false,limit:18});$("search").value="";$("theme-filter").value="";$("testament-filter").value="";$("book-filter").value="";$("psalm-only").setAttribute("aria-pressed","false");$("saved-only").setAttribute("aria-pressed","false");renderLibrary()});
$("show-more").addEventListener("click",()=>{state.limit+=18;renderLibrary()});
$("random-passage").addEventListener("click",()=>{const other=PASSAGES.filter(p=>p.id!==state.chosen);choose(other[Math.floor(Math.random()*other.length)].id,true)});
$("today-passage").addEventListener("click",()=>{const d=new Date();const day=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(2026,0,1))/86400000);choose(PASSAGES[((day%PASSAGES.length)+PASSAGES.length)%PASSAGES.length].id,true)});
$("bookmark-passage").addEventListener("click",()=>{const p=selected(),on=data.bookmarks.includes(p.id);data.bookmarks=on?data.bookmarks.filter(x=>x!==p.id):[...data.bookmarks,p.id];if(!store()){data.bookmarks=on?[...data.bookmarks,p.id]:data.bookmarks.filter(x=>x!==p.id);notify("study-feedback","Could not save bookmark in this browser.");return}renderStudy();renderLibrary();notify("study-feedback",on?"Bookmark removed.":"Bookmarked on this device.")});
$("copy-ref").addEventListener("click",async()=>{try{if(!navigator.clipboard?.writeText)throw Error("unavailable");await navigator.clipboard.writeText(selected().ref);notify("study-feedback","Reference copied.")}catch{notify("study-feedback","Clipboard unavailable. The reference is in the heading above.")}});
$("memory-prompt").addEventListener("click",()=>{$("memory-box").classList.toggle("hidden");$("memory-answer").classList.add("hidden")});
$("memory-reveal").addEventListener("click",()=>{$("memory-answer").classList.remove("hidden")});
function stopSpeech(){if("speechSynthesis" in window)window.speechSynthesis.cancel()}
$("speak-prompt").addEventListener("click",()=>{if(!("speechSynthesis" in window)){notify("study-feedback","Browser read-aloud is unavailable.");return}stopSpeech();const p=selected();const utter=new SpeechSynthesisUtterance(p.ref+". Context: "+p.context+". Reflection: "+p.question+". Prayer: "+p.prayer);utter.lang="en-AU";utter.rate=.88;window.speechSynthesis.speak(utter);notify("study-feedback","Playing original study guide. This is not an audio Bible.")});
$("stop-speech").addEventListener("click",()=>{stopSpeech();notify("study-feedback","Audio stopped.")});window.addEventListener("pagehide",stopSpeech);
for(const el of document.querySelectorAll("[data-psalm]"))el.addEventListener("click",()=>{const p=byRef.get(el.dataset.psalm);if(p)choose(p.id,true)});
$("journal-input").addEventListener("input",()=>notify("journal-feedback","Not saved. Press Save if you wish to keep this reflection."));
$("journal-save").addEventListener("click",()=>{const p=selected(),v=$("journal-input").value.trim();if(!v){notify("journal-feedback","Write something before saving, or use Delete this note.");return}const prev=data.notes[p.id];data.notes[p.id]=v.slice(0,6000);if(!store()){if(prev===undefined)delete data.notes[p.id];else data.notes[p.id]=prev;notify("journal-feedback","Could not save. Browser storage may be unavailable.");return}notify("journal-feedback","Saved in this browser only.")});
$("journal-delete").addEventListener("click",()=>{const p=selected();if(data.notes[p.id]&&!confirm("Delete the saved note for "+p.ref+" from this device?"))return;const prev=data.notes[p.id];delete data.notes[p.id];if(!store()){data.notes[p.id]=prev;notify("journal-feedback","Could not update browser storage.");return}$("journal-input").value="";notify("journal-feedback","Saved note removed.")});
function exportData(){const dataCopy={version:1,exportedAt:new Date().toISOString(),bookmarks:data.bookmarks,notes:data.notes,done:data.done};const blob=new Blob([JSON.stringify(dataCopy,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="faithhub-scripture-atlas-backup.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
$("journal-export").addEventListener("click",()=>{if(confirm("Export your private Scripture notes and bookmark data to a JSON file? Keep it secure.")){exportData();notify("journal-feedback","Export requested. Keep the downloaded file private.")}});
$("journal-reset").addEventListener("click",()=>{if(!confirm("Permanently delete all Scripture Atlas bookmarks, reading marks and saved notes in this browser? This cannot be undone."))return;try{localStorage.removeItem(STORAGE);data={bookmarks:[],notes:{},done:{}};renderLibrary();renderStudy();renderPlan();notify("journal-feedback","Atlas data deleted from this browser.")}catch{notify("journal-feedback","Could not clear browser storage.")}});
function selectedPlan(){return PLANS.find(p=>p.id===state.plan)||PLANS[0]}
function renderPlan(){const grid=$("plan-grid");grid.replaceChildren();for(const p of PLANS){const b=button("",()=>{state.plan=p.id;renderPlan()});b.className="plan-card";b.setAttribute("aria-pressed",String(state.plan===p.id));b.append(text("strong",p.title),text("span",p.description));grid.append(b)}
const p=selectedPlan();$("plan-title").textContent=p.title;$("plan-description").textContent=p.description;const days=$("plan-days");days.replaceChildren();
for(let i=0;i<7;i++){const ref=p.refs[i],found=byRef.get(ref),day=document.createElement("div");day.className="plan-day";const label=document.createElement("div");label.append(text("strong","Day "+(i+1)+" · "+ref),text("div",found?.title||"Read Scripture","small"));const action=document.createElement("div");action.className="toolbar";action.append(button("Open study",()=>found&&choose(found.id,true)));const key=p.id+":"+i;const mark=button(data.done[key]?"Revisited":"Mark revisit",()=>{if(data.done[key])delete data.done[key];else data.done[key]=true;if(!store()){notify("plan-feedback","Could not save locally.");return}notify("plan-feedback","Saved in this browser, without a streak.");renderPlan()});mark.setAttribute("aria-pressed",String(Boolean(data.done[key])));action.append(mark);day.append(label,action);days.append(day)}
}
renderLibrary();renderStudy();renderPlan();
