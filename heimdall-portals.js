/* Heimdall EMS demo extension. Loaded AFTER the original inline script in index.html.
   Extends existing globals (accounts, emergencyCases, renderWorkspace, caseForm, incidentTable, createEmergencyCase).
   ALL DATA IS FICTIONAL and kept in this browser only (localStorage). Nothing is sent to a server. */
(function(){
const KEY='heimdall_demo_v1',$=id=>document.getElementById(id),E=s=>escapeHtml(s);
const STATUSES=['New','Dispatched','En route','On scene','Transporting','Arrived at hospital','Handed over','Completed'];
const NEXT={'Dispatched':'En route','En route':'On scene','On scene':'Transporting','Transporting':'Arrived at hospital'};
const HOSP={lat:-26.2041,lng:28.0473};
const st={ambs:[{id:'Ambulance A',lat:-26.2041,lng:28.0473,caseId:''},{id:'Ambulance B',lat:-26.1458,lng:28.0436,caseId:''},{id:'Ambulance C',lat:-26.0936,lng:28.0064,caseId:''}],profile:{}};
let myUnit='Ambulance A',ambLayer=null;
const now=()=>new Date().toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'});

/* ---------- shared store (simulates a backend) ---------- */
function load(){let s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
 if(s&&s.cases){emergencyCases.length=0;s.cases.forEach(c=>emergencyCases.push(c));st.ambs=s.ambs||st.ambs;st.profile=s.profile||{}}
 else{const m={'DEMO-101':'Ambulance A','DEMO-104':'Ambulance C'};emergencyCases.forEach(c=>{if(m[c.caseId]){c.unit=m[c.caseId];st.ambs.find(a=>a.id===c.unit).caseId=c.caseId}})}
 emergencyCases.forEach(c=>{c.history=c.history||[];c.unit=c.unit||''});
 nextCaseNumber=Math.max(200,...emergencyCases.map(c=>parseInt(String(c.caseId).replace(/\D/g,''),10)||0))+1}
function save(){try{localStorage.setItem(KEY,JSON.stringify({cases:emergencyCases,ambs:st.ambs,profile:st.profile}))}catch(e){toast('Could not save demo data in this browser.')}}
function setStatus(c,s,auto){c.status=s;c.history.push({s,t:now(),by:auto?'simulation':(currentRole||'?')});
 if(s==='Completed'){const a=st.ambs.find(x=>x.id===c.unit);if(a&&a.caseId===c.caseId)a.caseId=''}}

/* ---------- simulated tracking ---------- */
const dist=(a,b)=>{const R=6371,r=Math.PI/180,dx=(b.lng-a.lng)*r*Math.cos(a.lat*r),dy=(b.lat-a.lat)*r;return R*Math.sqrt(dx*dx+dy*dy)};
const tgt=c=>c.status==='Transporting'?HOSP:(['Dispatched','En route'].includes(c.status)?c:null);
function etaFor(c){const a=st.ambs.find(x=>x.id===c.unit),t=tgt(c);return a&&t?Math.max(1,Math.round(dist(a,t)/40*60))+' min':'—'}
function tick(){if(!['ems','emsadmin'].includes(currentRole))return;let ch=false;
 st.ambs.forEach(a=>{const c=emergencyCases.find(x=>x.caseId===a.caseId),t=c&&tgt(c);if(!t)return;
  if(c.status==='Dispatched')setStatus(c,'En route',true);const d=dist(a,t);
  if(d<0.15){setStatus(c,c.status==='Transporting'?'Arrived at hospital':'On scene',true);ch=true;return}
  const f=Math.min(1,0.4/d);a.lat+=(t.lat-a.lat)*f;a.lng+=(t.lng-a.lng)*f;ch=true});
 if(ch){save();refresh()}}
function mapAmbs(){if(!window.map||!window.L)return;if(!ambLayer)ambLayer=L.layerGroup().addTo(map);ambLayer.clearLayers();
 st.ambs.forEach(a=>L.marker([a.lat,a.lng],{icon:L.divIcon({html:'<div style="font-size:22px">🚑</div>',className:'',iconSize:[26,26]})}).addTo(ambLayer)
  .bindPopup('<b>'+E(a.id)+' · SIMULATED</b><br>'+(a.caseId?'Assigned to '+E(a.caseId):'Available')+'<br>Not live GPS'))}

/* ---------- actions (called from inline handlers) ---------- */
window.hdSet=(id,s)=>{const c=emergencyCases.find(x=>x.caseId===id);if(!c)return;setStatus(c,s);save();refresh();toast(id+' → '+s+' (synced to all roles)')};
window.hdAssign=(id,u)=>{const c=emergencyCases.find(x=>x.caseId===id);if(!c)return;const a=st.ambs.find(x=>x.id===u);
 if(a&&a.caseId&&a.caseId!==id){toast(u+' is already assigned to '+a.caseId);refresh();return}
 const old=st.ambs.find(x=>x.id===c.unit);if(old&&old.caseId===id)old.caseId='';
 c.unit=u;if(a){a.caseId=id;if(c.status==='New')setStatus(c,'Dispatched')}save();refresh();toast(u?id+' assigned to '+u:id+' unassigned')};
window.hdUnit=u=>{myUnit=u;refresh()};
window.hdReset=()=>{try{localStorage.removeItem(KEY)}catch(e){}location.reload()};
window.hdAutofill=()=>{const p=st.profile;if(!p.patientId){toast('No patient profile saved yet. Fill in the Patient portal first.');return}
 const set=(i,v)=>{if($(i)&&v)$(i).value=v};set('patientName',p.givenName);set('patientSurname',p.familyName);set('patientId',p.patientId);set('patientAddress',p.address);set('patientArea',p.area);toast('Filled from the saved demo patient profile')};
window.hdVerify=()=>{collect();const p=st.profile;if(!p.scheme||!p.memberNo){toast('Choose a scheme and enter a demo member number first.');return}
 p.maStatus='Pending (simulated)';save();$('ptMA').innerHTML=maHtml();
 setTimeout(()=>{p.maStatus=/^DEMO-MA-\d{4,8}$/i.test(p.memberNo)?'Verified (simulated)':'Could not verify (simulated)';p.maChecked=now();save();if($('ptMA'))$('ptMA').innerHTML=maHtml()},1200)};
window.hdSample=()=>{Object.assign(st.profile,{givenName:'Amahle',familyName:'Nkosi',patientId:'DEMO-ID-0003',phone:'+27 10 000 0199',address:'12 Demo Street, near Demo Mall',area:'Rosebank',scheme:'Demo Scheme A',memberNo:'DEMO-MA-100234',maStatus:'Not verified',kinName:'Sipho Nkosi',kinRel:'Brother',kinPhone:'+27 10 000 0188',kinConsent:true});save();renderPatient();toast('Sample fictional profile loaded')};

/* ---------- patient portal ---------- */
function collect(){document.querySelectorAll('#ptForm [data-k]').forEach(i=>{st.profile[i.dataset.k]=i.type==='checkbox'?i.checked:i.value.trim()})}
function maHtml(){const s=st.profile.maStatus||'Not verified',ok=s.startsWith('Verified'),bad=s.startsWith('Could');
 return '<span class="pill" style="background:'+(ok?'#e1f8ef':bad?'#fff0f1':'#eef3fa')+';color:'+(ok?'#087c5d':bad?'#b42336':'#526b89')+'">'+E(s)+'</span>'+(st.profile.maChecked?' <small>checked '+E(st.profile.maChecked)+'</small>':'')}
function ptCase(){const p=st.profile,c=p.patientId&&emergencyCases.find(x=>x.patientId.toLowerCase()===p.patientId.toLowerCase()&&x.status!=='Completed');
 if(!c)return '<p class="case-note">No active case linked to your demo ID. A hospital or EMS administrator creates cases (they can autofill from this profile).</p>';
 return '<div class="hd-card"><b>'+E(c.caseId)+'</b> · <span class="pill" style="background:#e6f3ff;color:#0756c9">'+E(c.status)+'</span><p>Unit: '+E(c.unit||'Not yet assigned')+' · ETA '+E(etaFor(c))+' (simulated)<br><small>'+c.history.map(h=>E(h.t+' '+h.s)).join(' → ')+'</small></p></div>'}
function renderPatient(){const p=st.profile,v=k=>E(p[k]||'');
 const inp=(k,l,ac,ph)=>'<div class="field"><label>'+l+'</label><input data-k="'+k+'" name="'+ac+'" autocomplete="'+ac+'" value="'+v(k)+'" maxlength="120" placeholder="'+(ph||'')+'"></div>';
 const sel=(k,l,opts)=>'<div class="field"><label>'+l+'</label><select data-k="'+k+'">'+opts.map(o=>'<option'+(p[k]===o?' selected':'')+'>'+E(o)+'</option>').join('')+'</select></div>';
 $('workspaceContent').innerHTML='<h4>My profile <small class="case-note">(autosaves as you type)</small></h4><p class="case-note">Use fictional details only. Stored in this browser, not on a server.</p>'
 +'<form class="case-form" id="ptForm" autocomplete="on" onsubmit="return false"><div class="case-grid">'+inp('givenName','First name','given-name')+inp('familyName','Surname','family-name')+inp('patientId','Demo ID number','off','DEMO-ID-0003')+inp('phone','Phone (fictional)','tel')+inp('address','Address / landmark','street-address')
 +sel('area','Johannesburg area',Object.keys(johannesburgAreas))+'</div><h4 style="margin-top:16px">Medical aid</h4><div class="case-grid">'+sel('scheme','Scheme (demo list)',['','Demo Scheme A','Demo Scheme B','No medical aid'])+inp('memberNo','Demo member number','off','DEMO-MA-100234')
 +'</div><p>Status: <span id="ptMA">'+maHtml()+'</span> <button type="button" class="btn" style="padding:8px 10px;box-shadow:none" onclick="hdVerify()">Run simulated verification</button></p><p class="case-note">Simulated: any number shaped like DEMO-MA-123456 “verifies”. Real verification needs a scheme integration.</p>'
 +'<h4>Next of kin</h4><div class="case-grid">'+inp('kinName','Full name','off')+inp('kinRel','Relationship','off')+inp('kinPhone','Phone (fictional)','off')
 +'<div class="field"><label>Share with EMS/nurses during an emergency</label><input type="checkbox" data-k="kinConsent" style="width:auto"'+(p.kinConsent?' checked':'')+'></div></div>'
 +'<div class="case-note" id="ptSaved">'+(p.savedAt?'Saved locally at '+E(p.savedAt):'Not saved yet')+'</div><button type="button" class="btn" style="margin-top:10px;background:#e6f3ff;color:var(--blue);box-shadow:none" onclick="hdSample()">Fill with sample fictional data</button></form>'
 +'<h4>My emergency case</h4><div id="ptCase">'+ptCase()+'</div>'+limits();
 let tm;$('ptForm').addEventListener('input',e=>{clearTimeout(tm);tm=setTimeout(()=>{collect();if(['scheme','memberNo'].includes(e.target.dataset.k)){st.profile.maStatus='Not verified';st.profile.maChecked='';$('ptMA').innerHTML=maHtml()}
  st.profile.savedAt=now();save();$('ptSaved').textContent='Saved locally at '+st.profile.savedAt},400)})}

/* ---------- case cards (EMS + Nurse) ---------- */
const PC={High:'#e7354d',Medium:'#e08a00',Low:'#08a879'};
function card(c,role){const act=role==='ems'&&NEXT[c.status]?'<button class="btn" style="padding:9px 12px" onclick="hdSet(\''+c.caseId+'\',\''+NEXT[c.status]+'\')">Mark: '+NEXT[c.status]+'</button>':
  role==='nurse'&&c.status==='Arrived at hospital'?'<button class="btn" style="padding:9px 12px" onclick="hdSet(\''+c.caseId+'\',\'Handed over\')">Confirm handover</button>':'';
 return '<div class="hd-card"><div class="hd-row"><b>'+E(c.caseId)+'</b><span class="pill" style="background:'+(PC[c.priority]||'#5f7390')+'22;color:'+(PC[c.priority]||'#5f7390')+'">'+E(c.priority)+'</span><span class="pill" style="background:#e6f3ff;color:#0756c9">'+E(c.status)+'</span></div>'
 +'<p><b>'+E(c.name+' '+c.surname)+'</b> · '+E(c.area)+'<br>'+E(c.notes||'')+'<br><small>Unit: '+E(c.unit||'Unassigned')+' · ETA '+E(etaFor(c))+' (simulated)</small>'
 +(role==='nurse'?'<br><small>Medical aid: '+E(c.medAid||'Not on file')+' · Next of kin: '+E(c.kin||'Not on file')+'</small>':'')+'</p>'+act+'</div>'}
const active=()=>emergencyCases.filter(c=>c.status!=='Completed');

/* ---------- dispatch dashboard (replaces the static incidentTable) ---------- */
window.incidentTable=function(){
 const fleet='<h4>Ambulance tracking <span class="pill" style="background:#fff4dc;color:#8a5a00">SIMULATED</span></h4><div class="table-wrap"><table class="demo-table"><thead><tr><th>Unit</th><th>State</th><th>Approx. position</th></tr></thead><tbody>'
 +st.ambs.map(a=>'<tr><td>'+E(a.id)+'</td><td>'+(a.caseId?'Assigned to '+E(a.caseId):'Available')+'</td><td>'+a.lat.toFixed(3)+', '+a.lng.toFixed(3)+'</td></tr>').join('')+'</tbody></table></div><p class="case-note">Positions move on a timer while the EMS or dispatch portal is open (accelerated). Not real GPS. The map section shows 🚑 markers.</p>';
 const rows=active().map(c=>'<tr><td>'+E(c.caseId)+'</td><td>'+E(c.area)+'</td><td>'+E(c.priority)+'</td><td><select class="status-select" onchange="hdAssign(\''+c.caseId+'\',this.value)"><option value="">Unassigned</option>'+st.ambs.map(a=>'<option'+(c.unit===a.id?' selected':'')+'>'+a.id+'</option>').join('')+'</select></td><td><select class="status-select" onchange="hdSet(\''+c.caseId+'\',this.value)">'+STATUSES.map(s=>'<option'+(c.status===s?' selected':'')+'>'+s+'</option>').join('')+'</select></td><td>'+E(etaFor(c))+'</td></tr>').join('');
 return fleet+'<h4>Dispatch</h4><div class="table-wrap"><table class="demo-table"><thead><tr><th>Case</th><th>Area</th><th>Priority</th><th>Assign unit</th><th>Status</th><th>ETA</th></tr></thead><tbody>'+(rows||'<tr><td colspan="6">No active cases</td></tr>')+'</tbody></table></div>'};
const _caseForm=window.caseForm;
window.caseForm=function(){return _caseForm().replace('<div class="case-grid">','<button type="button" class="btn" style="margin-bottom:12px" onclick="hdAutofill()">Autofill from patient profile</button><div class="case-grid">')};
const _create=window.createEmergencyCase;
window.createEmergencyCase=function(e){const n=emergencyCases.length;_create(e);if(emergencyCases.length>n){const c=emergencyCases[0],p=st.profile;c.history=[{s:c.status,t:now(),by:currentRole}];c.unit='';
 if(p.patientId&&p.patientId.toLowerCase()===c.patientId.toLowerCase()){c.medAid=p.maStatus||'Not verified';c.kin=p.kinConsent&&p.kinName?p.kinName+' ('+(p.kinRel||'?')+') '+(p.kinPhone||''):'Not shared'}
 save();renderWorkspace(currentRole);mapAmbs()}};

/* ---------- workspace rendering ---------- */
function limits(){return '<div class="demo-hint"><b>Simulated in this demo:</b> sign-in, medical aid verification, ambulance movement/ETA, and cross-role sync (same browser via localStorage).<br><b>Needs a real backend/services:</b> authentication and role-based access control, a secure database + real-time API with audit logging, medical aid scheme integration, GPS/telematics, POPIA-compliant storage, and CAD/dispatch integration.<br><button type="button" class="btn" style="margin-top:10px;padding:8px 12px;background:#e6f3ff;color:var(--blue);box-shadow:none" onclick="hdReset()">Reset demo data</button></div>'}
function stats(role){const a=active(),free=st.ambs.filter(x=>!x.caseId).length,mine=a.filter(c=>c.unit===myUnit);
 const m={patient:[['Profile','Autosaves'],['Medical aid',(st.profile.maStatus||'Not verified').split(' (')[0]],['Next of kin',st.profile.kinName?'On file':'Missing'],['Data mode','Demo only']],
 ems:[['My unit',myUnit],['My cases',mine.length],['Unit state',mine.length?'Assigned':'Available'],['Data mode','Demo only']],
 nurse:[['Active cases',a.length],['Arrived',a.filter(c=>c.status==='Arrived at hospital').length],['Heading in',a.filter(c=>['En route','On scene','Transporting'].includes(c.status)).length],['Data mode','Demo only']],
 emsadmin:[['Open cases',a.length],['Available units',free],['Units dispatched',st.ambs.length-free],['Unassigned cases',a.filter(c=>!c.unit).length]],
 hospitaladmin:[['Beds available','18'],['Incoming ambulances',a.filter(c=>['En route','Transporting','Arrived at hospital'].includes(c.status)).length],['Active cases',a.length],['Data mode','Demo only']]}[role];
 $('workspaceStats').innerHTML=m.map(s=>'<div class="portal-stat"><small>'+s[0]+'</small><strong>'+s[1]+'</strong></div>').join('')}
const _render=window.renderWorkspace;
window.renderWorkspace=function(role){_render(role);stats(role);const w=$('workspaceContent');
 if(role==='patient')renderPatient();
 else if(role==='ems'){const mine=active().filter(c=>c.unit===myUnit);w.innerHTML='<h4>My assigned cases</h4><p>Driving: <select class="status-select" onchange="hdUnit(this.value)">'+st.ambs.map(a=>'<option'+(a.id===myUnit?' selected':'')+'>'+a.id+'</option>').join('')+'</select></p><p class="case-note">Cases are assigned by the dispatcher. Simulated GPS runs while this page is open.</p>'+(mine.map(c=>card(c,'ems')).join('')||'<p class="case-note">No cases assigned to this unit.</p>')+limits()}
 else if(role==='nurse'){w.innerHTML='<h4>Incoming and active cases</h4><p class="case-note">Summaries of cases created by administrators. Statuses update as EMS progresses.</p>'+(active().map(c=>card(c,'nurse')).join('')||'<p class="case-note">No active cases.</p>')+limits()}
 else w.insertAdjacentHTML('beforeend',limits())};
function refresh(){if(!currentRole)return;
 if(currentRole==='patient'){if($('ptCase'))$('ptCase').innerHTML=ptCase();stats('patient')}
 else if(!(document.querySelector('#newCaseForm')&&[...document.querySelectorAll('#newCaseForm input')].some(i=>i.value)))renderWorkspace(currentRole);
 mapAmbs()}

/* ---------- boot ---------- */
accounts.patient={label:'Patient',email:'patient@heimdall.demo',password:'Patientdemo123!',title:'Patient workspace',description:'Profile, medical aid status and next of kin (demo, fictional data only).',stats:[],table:'patient'};
load();
const css=document.createElement('style');css.textContent='.hd-card{border:1px solid var(--line);border-radius:14px;padding:14px;margin:10px 0;background:#f8fbff}.hd-card p{margin:8px 0;line-height:1.6}.hd-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}';document.head.appendChild(css);
const grid=document.querySelector('.role-grid');if(grid)grid.insertAdjacentHTML('afterbegin','<article class="role-card"><div class="role-icon">🧑</div><h3>Patient</h3><p>For patients keeping their details ready for an emergency.</p><ul><li>Profile with autosave and autofill</li><li>Medical aid verification status (simulated)</li><li>Next-of-kin details and case status</li></ul><button class="btn" onclick="chooseRole(\'patient\')">Sign in as Patient →</button></article>');
const cr=document.querySelector('.credentials');if(cr)cr.insertAdjacentHTML('afterbegin','<div class="credential"><b>Patient</b><br><code>patient@heimdall.demo</code><br><code>Patientdemo123!</code></div>');
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){load();refresh()}});
window.hdTick=tick;window.addEventListener('load',()=>{mapAmbs();setInterval(tick,3000)});
})();
