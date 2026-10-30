// FaithHub browser backup format v1. The canonical list is audited against every
// localStorage writer in the deployed static site AND secondary React app.
// No remote requests, no background writes, and no mutable data until explicit restore.
export const BACKUP_FORMAT='faithhub-browser-backup';
export const BACKUP_VERSION=1;
export const MAX_FILE_BYTES=4*1024*1024;
export const INVENTORY=Object.freeze([
  {key:'faithhub-rule-of-life-v2',label:'Daily rhythms and reflections',kind:'object'},
  {key:'faithhub-theme',label:'Light/dark setting',kind:'theme'},
  {key:'faithhub-appearance-v1',label:'Appearance style',kind:'appearance'},
  {key:'faithhub:prayer-shelf:v1',label:'Saved resource shelf',kind:'object'},
  {key:'faithhub:prayer-anchor:v1',label:'Everyday prayer anchor',kind:'anchor'},
  {key:'faithhub:prayer-four-movements:notes:v1',label:'Four-movements prayer notes',kind:'object'},
  {key:'faithhub:scripture-atlas:v1',label:'Scripture Atlas notes and bookmarks',kind:'object'},
  {key:'faithhub-psalm-explore-notes-v1',label:'Psalms private notes',kind:'object'},
  {key:'faithhub-intercessions-v1',label:'Private intercession cards',kind:'array'},
  {key:'faithhub-podcast-selected-v2',label:'Selected podcast',kind:'podcast'},
  {key:'faithhub-local-podcast-v1',label:'Legacy podcast selection',kind:'legacyPodcast'},
  {key:'rule-of-life-companion-v1',label:'Secondary FaithHub app data',kind:'object'}
]);
const KEYS=new Set(INVENTORY.map(x=>x.key));
const MAX_VALUE_CHARS=1_800_000;
const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function ensureNoDangerousKeys(v,seen=new WeakSet(),depth=0){
  if(depth>35)throw Error('Saved object is nested too deeply');
  if(!v||typeof v!=='object')return;
  if(seen.has(v))return;
  seen.add(v);
  for(const k of Object.keys(v)){
    if(['__proto__','constructor','prototype'].includes(k))throw Error('The backup includes unsupported object properties');
    ensureNoDangerousKeys(v[k],seen,depth+1);
  }
}
export function validateValue(meta,value){
  if(typeof value!=='string'||value.length>MAX_VALUE_CHARS)throw Error('Invalid size or type for '+meta.label);
  switch(meta.kind){
    case 'theme': if(!['light','dark'].includes(value))throw Error('Unknown light/dark setting');break;
    case 'appearance':if(!['original','sanctuary','uxpilot'].includes(value))throw Error('Unknown appearance style');break;
    case 'anchor':if(!['kettle','lunch','home','bed'].includes(value))throw Error('Unknown daily prayer anchor');break;
    case 'podcast':if(!/^(spotify|apple|audio|external):[a-zA-Z0-9_-]{1,90}$/.test(value))throw Error('Unknown podcast selection');break;
    case 'legacyPodcast':if(!/^\d{1,3}$/.test(value)||Number(value)>24)throw Error('Invalid legacy podcast number');break;
    default:{
      let data;
      try{data=JSON.parse(value)}catch{throw Error('Unreadable JSON in '+meta.label)}
      if(meta.kind==='object'&&!isObject(data))throw Error('Expected object in '+meta.label);
      if(meta.kind==='array'&&!Array.isArray(data))throw Error('Expected list in '+meta.label);
      ensureNoDangerousKeys(data);
    }
  }
  return value;
}
export function inventoryStorage(storage){
  const records=Object.create(null),unrecognised=[];
  for(const item of INVENTORY){
    const raw=storage.getItem(item.key);
    if(raw!==null)records[item.key]=raw; // preserve raw bytes; export includes unreadable entries for recovery
  }
  for(let i=0;i<storage.length;i++){
    const key=storage.key(i);
    if(typeof key==='string'&&/^faithhub[-:]/i.test(key)&&!KEYS.has(key))unrecognised.push(key);
  }
  return {records,unrecognised};
}
export function makeBackup(storage,createdAt=new Date().toISOString()){
  const {records,unrecognised}=inventoryStorage(storage);
  const blob=JSON.stringify({format:BACKUP_FORMAT,version:BACKUP_VERSION,createdAt,records},null,2);
  if(new TextEncoder().encode(blob).length>MAX_FILE_BYTES)throw Error('Backup exceeds 4 MB. No file was created.');
  return {blob,count:Object.keys(records).length,unrecognised};
}
export function parseBackup(raw){
  if(typeof raw!=='string'||new TextEncoder().encode(raw).length>MAX_FILE_BYTES)throw Error('Backup is too large');
  let input;
  try{input=JSON.parse(raw)}catch{throw Error('This is not valid JSON')}
  if(!isObject(input)||input.format!==BACKUP_FORMAT||input.version!==BACKUP_VERSION||!isObject(input.records))throw Error('Not a supported FaithHub browser backup');
  if(typeof input.createdAt!=='string'||!Number.isFinite(Date.parse(input.createdAt)))throw Error('Backup has no valid creation date');
  const keys=Object.keys(input.records);
  if(keys.length>INVENTORY.length||keys.some(key=>!KEYS.has(key)))throw Error('Backup contains unknown or unsupported storage keys');
  for(const key of keys)validateValue(INVENTORY.find(x=>x.key===key),input.records[key]);
  if(!keys.length)throw Error('Backup contains no recognised saved data');
  return {createdAt:input.createdAt,records:input.records};
}
export function planRestore(storage,parsed,replace=false){
  const writes=[],skipped=[];
  for(const item of INVENTORY){
    if(!Object.hasOwn(parsed.records,item.key))continue;
    const current=storage.getItem(item.key);
    if(current!==null&&!replace){skipped.push(item);continue;}
    if(current===parsed.records[item.key]){skipped.push(item);continue;}
    writes.push({item,value:parsed.records[item.key],wasPresent:current!==null});
  }
  return {writes,skipped};
}
export function restore(storage,parsed,replace=false){
  // Validate all input before writing anything, even when called outside UI.
  const verified=parseBackup(JSON.stringify({format:BACKUP_FORMAT,version:BACKUP_VERSION,createdAt:parsed.createdAt,records:parsed.records}));
  const plan=planRestore(storage,verified,replace);
  const originals=new Map();
  for(const {item} of plan.writes) originals.set(item.key,storage.getItem(item.key));
  const changed=[];
  try{
    for(const {item,value} of plan.writes){
      storage.setItem(item.key,value);
      changed.push(item.key);
    }
  }catch(error){
    const failures=[];
    for(const key of changed.reverse()){
      try{
        const before=originals.get(key);
        if(before===null)storage.removeItem(key);else storage.setItem(key,before);
      }catch{failures.push(key)}
    }
    if(failures.length)throw Error('Restore interrupted and rollback failed for '+failures.length+' item(s). Existing data may have changed; use your backup to recover.');
    throw Error('Could not restore data; all completed writes were rolled back. Your previous data is unchanged.');
  }
  return {restored:plan.writes.length,skipped:plan.skipped.length,replaced:plan.writes.filter(x=>x.wasPresent).length};
}

if(typeof document!=='undefined'){
  const $=id=>document.getElementById(id),status=(id,msg)=>$(id).textContent=msg;
  let parsed=null,filename='';
  const storage=window.localStorage;
  function updateInventory(){
    try{
      const {records,unrecognised}=inventoryStorage(storage);
      const names=INVENTORY.filter(item=>Object.hasOwn(records,item.key)).map(x=>x.label);
      $('data-count').textContent=names.length+' of '+INVENTORY.length+' known data types currently saved in this browser.';
      $('data-types').replaceChildren();
      for(const n of names){
        const li=document.createElement('li');li.textContent=n;$('data-types').append(li);
      }
      $('data-empty').hidden=names.length>0;
      $('unknown-warning').textContent=unrecognised.length?'Found '+unrecognised.length+' unrecognised FaithHub storage key(s), which this tool will not export or overwrite. The known-data inventory may need an update.':'';
    }catch{status('backup-status','Browser storage could not be read. You can still pray without storing anything.');}
  }
  function download(text,filename){
    const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download=filename;
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('export-all').addEventListener('click',()=>{
    try{
      const result=makeBackup(storage);
      if(!result.count){status('backup-status','No saved FaithHub data found on this browser.');return;}
      if(result.unrecognised.length){
        status('backup-status','Export stopped: unrecognised FaithHub data was found. We will not label this an all-data backup.');
        return;
      }
      const stamp=new Date().toISOString().slice(0,10);
      download(result.blob,'faithhub-private-backup-'+stamp+'.json');
      status('backup-status','Download requested for '+result.count+' data types. Keep the file private and check your device downloads.');
    }catch(e){status('backup-status','No export created: '+e.message)}
  });
  function resetImport(){
    parsed=null;filename='';$('restore-all').disabled=true;
    $('import-preview').textContent='Choose a previously exported FaithHub backup to review its contents before restoring.';
  }
  $('import-all').addEventListener('change',async event=>{
    resetImport();
    const file=event.target.files?.[0];if(!file)return;
    try{
      if(file.size>MAX_FILE_BYTES)throw Error('The selected file exceeds 4 MB');
      const candidate=parseBackup(await file.text());
      const plan=planRestore(storage,candidate,$('overwrite-option').checked);
      parsed=candidate;filename=file.name;
      $('restore-all').disabled=plan.writes.length===0;
      status('import-preview','File: '+filename+'. Created '+candidate.createdAt+'. '+Object.keys(candidate.records).length+' data types. This mode would restore '+plan.writes.length+' and leave '+plan.skipped.length+' unchanged. No saved data has been changed.');
    }catch(e){status('import-preview','Not ready to restore: '+e.message);}
  });
  $('overwrite-option').addEventListener('change',()=>{
    if(!parsed)return;
    try{
      const plan=planRestore(storage,parsed,$('overwrite-option').checked);
      $('restore-all').disabled=plan.writes.length===0;
      status('import-preview','File: '+filename+'. This mode would restore '+plan.writes.length+' and leave '+plan.skipped.length+' unchanged. No data changed yet.');
    }catch(e){status('import-preview','Could not check existing data: '+e.message);}
  });
  $('restore-all').addEventListener('click',()=>{
    if(!parsed)return;
    try{
      const replace=$('overwrite-option').checked;
      const plan=planRestore(storage,parsed,replace);
      if(!plan.writes.length){status('restore-status','Nothing needs restoring in this mode.');return;}
      const message=replace
        ?'This will overwrite '+plan.writes.filter(x=>x.wasPresent).length+' existing data type(s) on this device with backup contents. Save a fresh backup of your current data first. Continue?'
        :'Add '+plan.writes.length+' missing data type(s) to this browser without overwriting what is already here?';
      if(!window.confirm(message))return;
      const result=restore(storage,parsed,replace);
      status('restore-status','Restored '+result.restored+' data type(s). '+result.skipped+' unchanged. Reload other open FaithHub pages to see restored data. No email or external account was used.');
      updateInventory();resetImport();$('import-all').value='';
    }catch(e){status('restore-status',e.message);}
  });
  resetImport();updateInventory();
}
