export const moments = [
 {id:'morning',title:'Beginning the day',posture:'Open your hands, if comfortable.',prayer:'Jesus, this day is yours. Thank you for the gift of life. Help me notice you and love the people you place before me.',next:'Name one gift. Ask for help with one thing ahead.',scripture:'JHN.15.4-5'},
 {id:'midday',title:'In the middle of it all',posture:'Feel your feet on the ground. Let one breath come naturally.',prayer:'Jesus, I am here, and you are with me. Thank you for one good thing in this day. Give me your peace and wisdom for what comes next.',next:'Pause once. Give thanks for something specific.',scripture:'1TH.5.16-18'},
 {id:'home',title:'Coming home',posture:'If you are travelling, wait until safely stopped. Let your shoulders soften.',prayer:'Jesus, help me arrive with love. I bring you what I am carrying. Give me gentleness, patience and the courage to speak truth kindly.',next:'Choose one small act of attention for the people at home.',scripture:'COL.3.12-14'},
 {id:'overwhelmed',title:'When I am overwhelmed',posture:'Sit or stand in a way that feels supported. No need to force calm.',prayer:'Jesus, I feel stretched and I do not know what to say. Here is what is happening inside me. Meet me with mercy and show me the next small step.',next:'Tell him one honest feeling. You can stay here without fixing it.',scripture:'MAT.11.28-30'},
 {id:'room',title:'Pray the room',posture:'Look gently around the room, or picture the people you will meet.',prayer:'Holy Spirit, bring to mind someone I can love in prayer. Jesus, be near to them in what they are carrying. Show me how to care without taking over.',next:'Name someone quietly. Ask for their good. A thought is an invitation to discern, not proof that God has spoken.',scripture:'1TI.2.1-2'},
 {id:'night',title:'Giving the day back',posture:'Rest your hands. Let the day begin to end.',prayer:'Jesus, thank you for the good I received today. I am sorry for where I failed to love. I entrust what is unfinished to you. Keep me and those I love in your care tonight.',next:'Notice one gift, one moment needing grace, and one concern to entrust to Jesus.',scripture:'PSA.4.8'},
 {id:'lament',title:'When it hurts',posture:'Bring your real feelings. You do not need to tidy them up.',prayer:'Jesus, this hurts. I wish things were different. Hear my grief and anger. I am bringing them to you because I do not want to carry them alone.',next:'Continue in your own words: “What I wish you would change is…”',scripture:'PSA.13'}
];
export const anchors = {kettle:'After I put the kettle on, I will open my hands and thank Jesus for one gift.',lunch:'After I sit down for lunch, I will pause and pray for one person.',home:'After I arrive home and am safely stopped, I will ask Jesus for gentleness before going inside.',bed:'After I put my phone on charge, I will thank Jesus for one gift and entrust the day to him.'};
export const fruits = [
 ['Love','Jesus, help me seek the good of the person in front of me.','Listen to someone without preparing your reply.'],
 ['Joy','Jesus, help me receive goodness even in an imperfect day.','Notice and enjoy one small gift.'],
 ['Peace','Jesus, I entrust what I cannot control to you.','Speak one concern to God before reaching for another distraction.'],
 ['Patience','Holy Spirit, help me leave room for another person.','Allow a pause before responding.'],
 ['Kindness','Jesus, show me a simple way to care.','Offer a specific word of encouragement.'],
 ['Goodness','Jesus, help me choose what is right and loving.','Do one useful thing without needing recognition.'],
 ['Faithfulness','Jesus, help me be trustworthy in small things.','Keep one promise, or honestly renegotiate it.'],
 ['Gentleness','Jesus, give me your strength without harshness.','Say what is true in a softer voice.'],
 ['Self-control','Holy Spirit, help me choose love over impulse.','Pause before a reactive word or an automatic habit.']
];
export function validateShelf(value) {
 if (!value || value.version !== 1 || !Array.isArray(value.resources) || value.resources.length > 50) throw new Error('Choose a version 1 FaithHub shelf with at most 50 links.');
 return {version:1,resources:value.resources.map(item=>{
  if (!item || typeof item.title !== 'string' || !item.title.trim() || item.title.length>150 || typeof item.url !== 'string' || item.url.length>2000) throw new Error('Each link needs a title and a valid HTTPS address.');
  const url=new URL(item.url);
  if(url.protocol!=='https:' || url.username || url.password) throw new Error('Only HTTPS links without embedded passwords are supported.');
  return {title:item.title.trim(),url:url.href};
 })};
}
export function mergeShelf(current,incoming){
 const a=validateShelf(current),b=validateShelf(incoming);
 const seen=new Set(a.resources.map(r=>r.url));
 return validateShelf({version:1,resources:[...a.resources,...b.resources.filter(r=>{if(seen.has(r.url))return false;seen.add(r.url);return true;})]});
}
export function createCalendar(time,now=new Date()){
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw new Error('Choose a valid reminder time.');
 const pad=n=>String(n).padStart(2,'0');
 const date=`${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`;
 const stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//FaithHub//Daily Prayer//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:daily-prayer-${time.replace(':','')}@faithhub`,`DTSTAMP:${stamp}`,`DTSTART:${date}T${time.replace(':','')}00`,'DURATION:PT2M','RRULE:FREQ=DAILY','SUMMARY:Pause with Jesus - one thank you','DESCRIPTION:Open FaithHub or simply thank Jesus for one gift. Begin again gently.','BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:Pause with Jesus - one thank you','END:VALARM','END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
