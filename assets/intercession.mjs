// FaithHub intercessions: local browser-only data, no analytics or automatic messages.
export const STORAGE_KEY='faithhub-intercessions-v1';
export const CATEGORIES=['family','friends','church','neighbours','world','other'];
const textOf=(value,max)=>typeof value==='string'?value.trim().slice(0,max):'';
export function normaliseCard(input){
  if(!input||typeof input!=='object'||Array.isArray(input))return null;
  const name=textOf(input.name,80);
  const id=typeof input.id==='string'&&/^[a-zA-Z0-9_-]{1,72}$/.test(input.id)?input.id:null;
  if(!name||!id)return null;
  return {id,name,category:CATEGORIES.includes(input.category)?input.category:'other',
    request:textOf(input.request,280),action:textOf(input.action,160),
    status:input.status==='entrusted'?'entrusted':'active',
    createdAt:typeof input.createdAt==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(input.createdAt)?input.createdAt:new Date(0).toISOString()};
}
export function parseCards(raw){
  try{
    const parsed=JSON.parse(raw||'[]');
    if(!Array.isArray(parsed))return [];
    const result=[],used=new Set();
    for(const row of parsed.slice(0,100)){
      const card=normaliseCard(row);
      if(card&&!used.has(card.id)){used.add(card.id);result.push(card);}
    }
    return result;
  }catch{return [];}
}
export function validateBackup(raw){
  const data=JSON.parse(raw);
  if(!data||typeof data!=='object'||data.version!==1||!Array.isArray(data.cards)||data.cards.length>100)throw Error('Not a supported FaithHub prayer backup');
  const valid=parseCards(JSON.stringify(data.cards));
  if(valid.length!==data.cards.length)throw Error('The backup contains invalid or duplicate cards');
  return valid;
}
export function activeCards(cards){return cards.filter(card=>card.status==='active');}
export function dailyStartIndex(cards,day){
  if(!cards.length)return 0;
  return [...day].reduce((sum,c)=>sum+c.charCodeAt(0),0)%cards.length;
}
export function makeBackup(cards){return JSON.stringify({version:1,source:'FaithHub intercessions',exportedAt:new Date().toISOString(),cards},null,2);}

if(typeof document!=='undefined'){
  const get=id=>document.getElementById(id);
  const form=get('card-form');
  let cards=parseCards(localStorage.getItem(STORAGE_KEY));
  let editingId=null;
  let detailsVisible=false;
  const today=new Date();
  const day=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
  let position=dailyStartIndex(activeCards(cards),day);

  function message(id,value){get(id).textContent=value;}
  function persist(next){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(next));cards=next;return true;}
    catch{message('save-status','Could not save in this browser. Your previous cards are unchanged.');return false;}
  }
  function actionButton(label,onClick){
    const b=document.createElement('button');b.type='button';b.textContent=label;
    b.addEventListener('click',onClick);return b;
  }
  function showFeatured(){
    const active=activeCards(cards);
    const name=get('featured-name'),need=get('featured-request'),action=get('featured-action');
    if(!active.length){
      name.textContent='You can pray without making a list.';
      need.textContent='Jesus, please care for the people on my mind today.';
      action.textContent='';
      return;
    }
    position=((position%active.length)+active.length)%active.length;
    if(!detailsVisible){name.textContent='Prayer details hidden on this screen';need.textContent='Choose Show saved prayer details when you are somewhere private.';action.textContent='Your browser data is not encrypted.';return;}
    const card=active[position];
    name.textContent=card.name;
    need.textContent=card.request||'Jesus, please care for this person or situation.';
    action.textContent=card.action?'If appropriate, I could: '+card.action:'No follow-up action is required.';
  }
  function render(){
    const list=get('card-list'),kind=get('card-filter').value;
    list.replaceChildren();
    const visible=cards.filter(c=>kind==='all'||c.status===kind).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
    get('card-count').textContent=visible.length+' of '+cards.length+' saved cards shown';
    get('empty-cards').hidden=visible.length>0;
    if(!detailsVisible){
      for(const c of visible){
        const article=document.createElement('article');
        const h=document.createElement('h3');h.textContent='Private prayer card';
        const p=document.createElement('p');p.textContent='Hidden until you reveal saved details.';
        article.append(h,p);list.append(article);
      }
      showFeatured();return;
    }
    for(const c of visible){
      const article=document.createElement('article');
      const heading=document.createElement('h3');heading.textContent=c.name;
      const sub=document.createElement('p');sub.className='small-print';sub.textContent=c.category+' · '+(c.status==='entrusted'?'Entrusted / resting':'Still praying');
      const request=document.createElement('p');request.textContent=c.request||'No details saved';
      article.append(heading,sub,request);
      if(c.action){const act=document.createElement('p');act.className='small-print';act.textContent='Possible care: '+c.action;article.append(act);}
      const actions=document.createElement('div');actions.className='card-actions';
      actions.append(actionButton('Edit',()=>{
        editingId=c.id;get('card-name').value=c.name;get('card-category').value=c.category;
        get('card-request').value=c.request;get('card-action').value=c.action;
        get('save-card').textContent='Save changes';get('cancel-edit').hidden=false;
        get('new-card').scrollIntoView({behavior:'auto'});get('card-name').focus();
        message('save-status','Editing '+c.name+'. Nothing changes until you save.');
      }));
      actions.append(actionButton(c.status==='active'?'Mark entrusted':'Resume praying',()=>{
        const updated=cards.map(x=>x.id===c.id?{...x,status:c.status==='active'?'entrusted':'active'}:x);
        if(persist(updated)){position=dailyStartIndex(activeCards(cards),day);render();}
      }));
      actions.append(actionButton('Delete',()=>{
        if(!window.confirm('Permanently delete the prayer card for '+c.name+' from this browser?'))return;
        if(persist(cards.filter(x=>x.id!==c.id))){position=dailyStartIndex(activeCards(cards),day);render();}
      }));
      article.append(actions);list.append(article);
    }
    showFeatured();
  }
  function clearForm(){
    editingId=null;form.reset();get('save-card').textContent='Save this card on this device';get('cancel-edit').hidden=true;
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const name=get('card-name').value.trim().slice(0,80);
    if(!name){message('save-status','Enter a person or situation first.');return;}
    const values={name,category:get('card-category').value,request:get('card-request').value,action:get('card-action').value};
    let next;
    if(editingId){
      next=cards.map(c=>c.id===editingId?{...c,...values}:c);
    } else {
      if(cards.length>=100){message('save-status','The 100-card device limit has been reached. Archive or delete an entry before adding another.');return;}
      next=[...cards,{...values,id:crypto.randomUUID(),status:'active',createdAt:new Date().toISOString()}];
    }
    if(persist(next)){clearForm();position=dailyStartIndex(activeCards(cards),day);render();message('save-status','Saved on this browser. No message was sent.');}
  });
  get('cancel-edit').addEventListener('click',()=>{clearForm();message('save-status','Editing cancelled.');});
  get('privacy-toggle').addEventListener('click',()=>{
    if(detailsVisible){
      const hasTyped=[get('card-name').value,get('card-request').value,get('card-action').value].some(s=>s.trim());
      if(hasTyped&&!window.confirm('Hide saved details and clear your unsaved form text?'))return;
      clearForm();
    }
    detailsVisible=!detailsVisible;
    get('privacy-toggle').setAttribute('aria-pressed',String(detailsVisible));
    get('privacy-toggle').textContent=detailsVisible?'Hide saved prayer details':'Show saved prayer details';
    message('privacy-visibility-status',detailsVisible?'Prayer card details are visible on this screen. Hide them before sharing your device.':'Saved prayer details hidden on screen. This does not encrypt browser storage.');
    render();
  });
  get('next-card').addEventListener('click',()=>{
    position+=1;showFeatured();get('featured').focus();
  });
  get('card-filter').addEventListener('change',render);
  get('export-cards').addEventListener('click',()=>{
    if(!cards.length){message('backup-status','There are no saved cards to export.');return;}
    const url=URL.createObjectURL(new Blob([makeBackup(cards)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='faithhub-private-prayer-backup.json';
    document.body.append(a);a.click();a.remove();
    URL.revokeObjectURL(url);
    message('backup-status','Backup download requested. Treat it as private personal information.');
  });
  get('import-cards').addEventListener('change',async event=>{
    const file=event.target.files?.[0];if(!file)return;
    try{
      if(file.size>128*1024)throw Error('File too large (maximum 128 KB)');
      const imported=validateBackup(await file.text());
      const merged=new Map(cards.map(c=>[c.id,c]));
      for(const c of imported){if(!merged.has(c.id))merged.set(c.id,c);}
      if(merged.size>100)throw Error('Combined list would exceed 100 prayer cards');
      const addition=merged.size-cards.length;
      if(!window.confirm('Import '+addition+' new card(s)? Existing cards will be preserved. This stores the data unencrypted in this browser.'))return;
      if(persist([...merged.values()])){position=dailyStartIndex(activeCards(cards),day);render();message('backup-status','Imported '+addition+' cards. Existing cards kept.');}
    }catch(err){message('backup-status','Import not completed: '+String(err.message||err));}
    finally{event.target.value='';}
  });
  get('delete-all').addEventListener('click',()=>{
    if(!cards.length){message('backup-status','There are no cards to delete.');return;}
    if(!window.confirm('Permanently delete ALL '+cards.length+' prayer cards saved in this browser? This cannot be undone without a backup.'))return;
    try{localStorage.removeItem(STORAGE_KEY);cards=[];clearForm();position=0;render();message('backup-status','All saved prayer cards deleted from this browser.');}
    catch{message('backup-status','Could not clear this browser’s saved cards.');}
  });
  render();
}
