/* Heimdall EMS demo extension. Loaded AFTER the original inline script in index.html.
   Extends existing globals (accounts, emergencyCases, renderWorkspace, caseForm, incidentTable, createEmergencyCase).
   ALL DATA IS FICTIONAL and kept in this browser only (localStorage). Nothing is sent to a server. */
(function(){
const KEY='heimdall_demo_v1',$=id=>document.getElementById(id),E=s=>escapeHtml(s);
const STATUSES=['New','Dispatched','En route','On scene','Transporting','Arrived at hospital','Handed over','Completed'];
const NEXT={'Dispatched':'En route','En route':'On scene','On scene':'Transporting','Transporting':'Arrived at hospital'};
const HOSP={lat:-26.2041,lng:28.0473};
const st={ambs:[{id:'Ambulance A',lat:-26.2041,lng:28.0473,caseId:''},{id:'Ambulance B',lat:-26.1458,lng:28.0436,caseId:''},{id:'Ambulance C',lat:-26.0936,lng:28.0064,caseId:''}],records:{},audit:[]};
let myUnit='Ambulance A',ambLayer=null,openRec='',recQ='';
const now=()=>new Date().toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'});

/* ---------- shared store (simulates a backend) ---------- */
function seedRecs(){return {'DEMO-ID-0001':{patientId:'DEMO-ID-0001',givenName:'Thabo',familyName:'Mokoena',phone:'+27 10 000 0111',address:'Braamfontein, Johannesburg',area:'Braamfontein',scheme:'Demo Scheme A',memberNo:'DEMO-MA-100001',maStatus:'Verified (simulated)',kinName:'Nomsa Mokoena',kinRel:'Mother',kinPhone:'+27 10 000 0112',kinConsent:true,bloodType:'O+',allergies:'Penicillin (demo)',conditions:'Asthma (demo)',medications:'Reliever inhaler (demo)',notes:''},
 'DEMO-ID-0002':{patientId:'DEMO-ID-0002',givenName:'Lerato',familyName:'Dlamini',phone:'+27 10 000 0121',address:'Sandton, Johannesburg',area:'Sandton',scheme:'No medical aid',memberNo:'',maStatus:'Not verified',kinName:'Sipho Dlamini',kinRel:'Husband',kinPhone:'+27 10 000 0122',kinConsent:false,bloodType:'A+',allergies:'None known (demo)',conditions:'',medications:'',notes:''}}}
function load(){let s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
 if(s&&s.cases){emergencyCases.length=0;s.cases.forEach(c=>emergencyCases.push(c));st.ambs=s.ambs||st.ambs;st.records=s.records||{};st.audit=s.audit||[];
  if(s.profile&&s.profile.patientId){const id=s.profile.patientId.toUpperCase();if(!st.records[id])st.records[id]=Object.assign({},s.profile,{patientId:id})}}
 else{const m={'DEMO-101':'Ambulance A','DEMO-104':'Ambulance C'};emergencyCases.forEach(c=>{if(m[c.caseId]){c.unit=m[c.caseId];st.ambs.find(a=>a.id===c.unit).caseId=c.caseId}});st.records=seedRecs()}
 emergencyCases.forEach(c=>{c.history=c.history||[];c.unit=c.unit||''});
 nextCaseNumber=Math.max(200,...emergencyCases.map(c=>parseInt(String(c.caseId).replace(/\D/g,''),10)||0))+1}
function save(){try{localStorage.setItem(KEY,JSON.stringify({cases:emergencyCases,ambs:st.ambs,records:st.records,audit:st.audit}))}catch(e){toast('Could not save demo data in this browser.')}}
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
const CAN_EDIT=['hospitaladmin','emsadmin','nurse'];
const recFor=c=>st.records[String(c.patientId).toUpperCase()];
function log(id,act){const a=st.audit[0];if(a&&a.rec===id&&a.role===currentRole&&a.act===act)return;st.audit.unshift({t:now(),role:currentRole,rec:id,act});st.audit.length=Math.min(st.audit.length,50)}
function maHtml(r){const s=r.maStatus||'Not verified',ok=s.startsWith('Verified'),bad=s.startsWith('Could');
 return '<span class="pill" style="background:'+(ok?'#e1f8ef':bad?'#fff0f1':'#eef3fa')+';color:'+(ok?'#087c5d':bad?'#b42336':'#526b89')+'">'+E(s)+'</span>'+(r.maChecked?' <small>checked '+E(r.maChecked)+'</small>':'')}
window.hdAutofill=id=>{const r=st.records[id];if(!r)return;const set=(i,v)=>{if($(i)&&v)$(i).value=v};set('patientName',r.givenName);set('patientSurname',r.familyName);set('patientId',r.patientId);set('patientAddress',r.address);set('patientArea',r.area);toast('Filled from the patient record')};
window.hdFind=v=>{recQ=v;if($('recList'))$('recList').innerHTML=recList()};
window.hdOpen=id=>{openRec=id;log(id,'viewed');save();$('recDetail').innerHTML=recDetail(currentRole);bindForm();if($('recDetail').scrollIntoView)$('recDetail').scrollIntoView({behavior:'smooth',block:'nearest'})};
window.hdNew=()=>{if(!CAN_EDIT.includes(currentRole))return;const n=Math.max(2,...Object.keys(st.records).map(k=>parseInt(k.replace(/\D/g,''),10)||0))+1,id='DEMO-ID-'+String(n).padStart(4,'0');
 st.records[id]={patientId:id,givenName:'',familyName:'',updatedBy:currentRole,updatedAt:now()};log(id,'created');hdOpen(id);hdFind(recQ)};
window.hdVerify=()=>{const r=st.records[openRec];if(!r||!CAN_EDIT.includes(currentRole))return;collect();if(!r.scheme||!r.memberNo){toast('Choose a scheme and enter a demo member number first.');return}
 r.maStatus='Pending (simulated)';save();$('recMA').innerHTML=maHtml(r);
 setTimeout(()=>{r.maStatus=/^DEMO-MA-\d{4,8}$/i.test(r.memberNo)?'Verified (simulated)':'Could not verify (simulated)';r.maChecked=now();log(r.patientId,'verification run');save();if($('recMA'))$('recMA').innerHTML=maHtml(r);if($('recList'))$('recList').innerHTML=recList()},1200)};
function collect(){const r=st.records[openRec];if(!r)return;document.querySelectorAll('#recForm [data-k]').forEach(i=>{r[i.dataset.k]=i.type==='checkbox'?i.checked:i.value.trim()});r.updatedBy=currentRole;r.updatedAt=now()}
function bindForm(){const f=$('recForm');if(!f||!f.addEventListener)return;let tm;f.addEventListener('input',e=>{clearTimeout(tm);tm=setTimeout(()=>{const r=st.records[openRec];if(!r)return;collect();
 if(['scheme','memberNo'].includes(e.target.dataset.k)){r.maStatus='Not verified';r.maChecked='';$('recMA').innerHTML=maHtml(r)}
 log(r.patientId,'edited');save();$('recSaved').textContent='Autosaved locally at '+r.updatedAt+' by '+currentRole;$('recList').innerHTML=recList()},400)})}
function recList(){const q=recQ.toLowerCase(),rows=Object.values(st.records).filter(r=>((r.givenName||'')+' '+(r.familyName||'')+' '+r.patientId).toLowerCase().includes(q));
 return '<div class="table-wrap"><table class="demo-table"><thead><tr><th>Patient</th><th>Demo ID</th><th>Medical aid</th><th></th></tr></thead><tbody>'+(rows.map(r=>'<tr><td>'+E(((r.givenName||'')+' '+(r.familyName||'')).trim()||'(unnamed)')+'</td><td>'+E(r.patientId)+'</td><td>'+maHtml(r)+'</td><td><button type="button" class="btn" style="padding:8px 10px;box-shadow:none" onclick="hdOpen(\''+E(r.patientId)+'\')">Open</button></td></tr>').join('')||'<tr><td colspan="4">No records</td></tr>')+'</tbody></table></div>'}
function recDetail(role){const r=st.records[openRec];if(!r)return '<p class="case-note">Select a record to view it.</p>';const ed=CAN_EDIT.includes(role),v=k=>E(r[k]||'');
 const foot='<p class="case-note"><b>Demo access log (simulated)</b><br>'+(st.audit.filter(a=>a.rec===r.patientId).slice(0,5).map(a=>E(a.t+' · '+a.role+' · '+a.act)).join('<br>')||'—')+'</p>';
 if(!ed){const row=(l,x)=>'<tr><th>'+l+'</th><td>'+E(x||'—')+'</td></tr>';
  return '<div class="hd-card"><h4>'+E(((r.givenName||'')+' '+(r.familyName||'')).trim())+' · '+E(r.patientId)+'</h4><div class="table-wrap"><table class="demo-table"><tbody>'+row('Phone',r.phone)+row('Address',(r.address||'')+(r.area?', '+r.area:''))+row('Blood type',r.bloodType)+row('Allergies',r.allergies)+row('Conditions',r.conditions)+row('Medications',r.medications)
  +row('Medical aid',(r.scheme||'—')+' · '+(r.maStatus||'Not verified'))+row('Next of kin',r.kinConsent&&r.kinName?r.kinName+' ('+(r.kinRel||'?')+') '+(r.kinPhone||''):'Not shared (no consent on record)')+row('Notes',r.notes)+'</tbody></table></div><p class="case-note">View-only for your role.</p>'+foot+'</div>'}
 const inp=(k,l,ph)=>'<div class="field"><label>'+l+'</label><input data-k="'+k+'" value="'+v(k)+'" maxlength="140" placeholder="'+(ph||'')+'"></div>',
 sel=(k,l,o)=>'<div class="field"><label>'+l+'</label><select data-k="'+k+'">'+o.map(x=>'<option'+(r[k]===x?' selected':'')+'>'+E(x)+'</option>').join('')+'</select></div>';
 return '<form class="case-form" id="recForm" autocomplete="off" onsubmit="return false"><h4>'+E(r.patientId)+' <small class="case-note">(autosaves as you type · fictional data only)</small></h4><div class="case-grid">'+inp('givenName','First name')+inp('familyName','Surname')+inp('phone','Phone (fictional)')+inp('address','Address / landmark')
 +sel('area','Johannesburg area',[''].concat(Object.keys(johannesburgAreas)))+sel('bloodType','Blood type',['','O+','O-','A+','A-','B+','B-','AB+','AB-'])+inp('allergies','Allergies','e.g. Penicillin (demo)')+inp('conditions','Conditions')+inp('medications','Medications')+inp('notes','Notes')
 +'</div><h4>Medical aid</h4><div class="case-grid">'+sel('scheme','Scheme (demo list)',['','Demo Scheme A','Demo Scheme B','No medical aid'])+inp('memberNo','Demo member number','DEMO-MA-100234')
 +'</div><p>Status: <span id="recMA">'+maHtml(r)+'</span> <button type="button" class="btn" style="padding:8px 10px;box-shadow:none" onclick="hdVerify()">Run simulated verification</button></p><p class="case-note">Simulated: a number shaped like DEMO-MA-123456 “verifies”. Real verification needs a scheme integration.</p>'
 +'<h4>Next of kin</h4><div class="case-grid">'+inp('kinName','Full name')+inp('kinRel','Relationship')+inp('kinPhone','Phone (fictional)')+'<div class="field"><label>Patient consented to share with EMS/nurses</label><input type="checkbox" data-k="kinConsent" style="width:auto"'+(r.kinConsent?' checked':'')+'></div></div>'
 +'<div class="case-note" id="recSaved">'+(r.updatedAt?'Last saved '+E(r.updatedAt)+' by '+E(r.updatedBy||'?'):'Not saved yet')+'</div>'+foot+'</form>'}
function recordsBlock(role){const ed=CAN_EDIT.includes(role);
 return '<h4>Patient records</h4><p class="case-note">Patients have no login. Their records are shared with all four staff roles: '+(ed?'your role can view and edit.':'your role is view-only.')+' Fictional data only.</p><div class="hd-row"><input id="recQ" class="status-select" style="min-width:220px" placeholder="Search name or ID" value="'+E(recQ)+'" oninput="hdFind(this.value)">'+(ed?'<button type="button" class="btn" style="padding:9px 12px" onclick="hdNew()">New record</button>':'')+'</div><div id="recList">'+recList()+'</div><div id="recDetail">'+recDetail(role)+'</div>'}

/* ---------- case cards (EMS + Nurse) ---------- */
const PC={High:'#e7354d',Medium:'#e08a00',Low:'#08a879'};
function card(c,role){const r=recFor(c),act=role==='ems'&&NEXT[c.status]?'<button class="btn" style="padding:9px 12px" onclick="hdSet(\''+c.caseId+'\',\''+NEXT[c.status]+'\')">Mark: '+NEXT[c.status]+'</button>':
  role==='nurse'&&c.status==='Arrived at hospital'?'<button class="btn" style="padding:9px 12px" onclick="hdSet(\''+c.caseId+'\',\'Handed over\')">Confirm handover</button>':'';
 return '<div class="hd-card"><div class="hd-row"><b>'+E(c.caseId)+'</b><span class="pill" style="background:'+(PC[c.priority]||'#5f7390')+'22;color:'+(PC[c.priority]||'#5f7390')+'">'+E(c.priority)+'</span><span class="pill" style="background:#e6f3ff;color:#0756c9">'+E(c.status)+'</span></div>'
 +'<p><b>'+E(c.name+' '+c.surname)+'</b> · '+E(c.area)+'<br>'+E(c.notes||'')+'<br><small>Unit: '+E(c.unit||'Unassigned')+' · ETA '+E(etaFor(c))+' (simulated)</small>'
 +(r?'<br><small>Allergies: '+E(r.allergies||'—')+' · Conditions: '+E(r.conditions||'—')+' · Medications: '+E(r.medications||'—')+' · Blood: '+E(r.bloodType||'—')+'</small><br><small>Medical aid: '+E(r.maStatus||'Not verified')+' · Next of kin: '+E(r.kinConsent&&r.kinName?r.kinName+' ('+(r.kinRel||'?')+') '+(r.kinPhone||''):'Not shared')+'</small> <button type="button" class="btn" style="padding:6px 9px;box-shadow:none" onclick="hdOpen(\''+E(r.patientId)+'\')">Open record</button>':'<br><small>No patient record on file</small>')+'</p>'+act+'</div>'}
const active=()=>emergencyCases.filter(c=>c.status!=='Completed');

/* ---------- dispatch dashboard (replaces the static incidentTable) ---------- */
window.incidentTable=function(){
 const fleet='<h4>Ambulance tracking <span class="pill" style="background:#fff4dc;color:#8a5a00">SIMULATED</span></h4><div class="table-wrap"><table class="demo-table"><thead><tr><th>Unit</th><th>State</th><th>Approx. position</th></tr></thead><tbody>'
 +st.ambs.map(a=>'<tr><td>'+E(a.id)+'</td><td>'+(a.caseId?'Assigned to '+E(a.caseId):'Available')+'</td><td>'+a.lat.toFixed(3)+', '+a.lng.toFixed(3)+'</td></tr>').join('')+'</tbody></table></div><p class="case-note">Positions move on a timer while the EMS or dispatch portal is open (accelerated). Not real GPS. The map section shows 🚑 markers.</p>';
 const rows=active().map(c=>'<tr><td>'+E(c.caseId)+'</td><td>'+E(c.area)+'</td><td>'+E(c.priority)+'</td><td><select class="status-select" onchange="hdAssign(\''+c.caseId+'\',this.value)"><option value="">Unassigned</option>'+st.ambs.map(a=>'<option'+(c.unit===a.id?' selected':'')+'>'+a.id+'</option>').join('')+'</select></td><td><select class="status-select" onchange="hdSet(\''+c.caseId+'\',this.value)">'+STATUSES.map(s=>'<option'+(c.status===s?' selected':'')+'>'+s+'</option>').join('')+'</select></td><td>'+E(etaFor(c))+'</td></tr>').join('');
 return fleet+'<h4>Dispatch</h4><div class="table-wrap"><table class="demo-table"><thead><tr><th>Case</th><th>Area</th><th>Priority</th><th>Assign unit</th><th>Status</th><th>ETA</th></tr></thead><tbody>'+(rows||'<tr><td colspan="6">No active cases</td></tr>')+'</tbody></table></div>'};
const _caseForm=window.caseForm;
window.caseForm=function(){return _caseForm().replace('<div class="case-grid">','<div class="field"><label>Autofill from patient record</label><select id="hdRec" onchange="hdAutofill(this.value)"><option value="">Choose a record…</option>'+Object.values(st.records).map(r=>'<option value="'+E(r.patientId)+'">'+E(((r.givenName||'')+' '+(r.familyName||'')).trim()+' · '+r.patientId)+'</option>').join('')+'</select></div><div class="case-grid">')};
const _create=window.createEmergencyCase;
window.createEmergencyCase=function(e){const n=emergencyCases.length;_create(e);if(emergencyCases.length>n){const c=emergencyCases[0],id=String(c.patientId).toUpperCase();c.history=[{s:c.status,t:now(),by:currentRole}];c.unit='';
 if(!st.records[id]){st.records[id]={patientId:id,givenName:c.name,familyName:c.surname,address:c.address,area:c.area,updatedBy:currentRole,updatedAt:now()};log(id,'created from case')}
 save();renderWorkspace(currentRole);mapAmbs()}};

/* ---------- workspace rendering ---------- */
function limits(){return '<div class="demo-hint"><b>Simulated in this demo:</b> sign-in, role-based record access, the access log, medical aid verification, ambulance movement/ETA, and cross-role sync (same browser via localStorage).<br><b>Needs a real backend/services:</b> server-enforced authentication and role-based access control, patient consent management, a secure database + real-time API with audit logging, medical aid scheme integration, GPS/telematics, POPIA-compliant storage, and CAD/dispatch integration.<br><button type="button" class="btn" style="margin-top:10px;padding:8px 12px;background:#e6f3ff;color:var(--blue);box-shadow:none" onclick="hdReset()">Reset demo data</button></div>'}
function stats(role){const a=active(),free=st.ambs.filter(x=>!x.caseId).length,mine=a.filter(c=>c.unit===myUnit);
 const m={ ems:[['My unit',myUnit],['My cases',mine.length],['Unit state',mine.length?'Assigned':'Available'],['Data mode','Demo only']],
 nurse:[['Active cases',a.length],['Arrived',a.filter(c=>c.status==='Arrived at hospital').length],['Heading in',a.filter(c=>['En route','On scene','Transporting'].includes(c.status)).length],['Data mode','Demo only']],
 emsadmin:[['Open cases',a.length],['Available units',free],['Units dispatched',st.ambs.length-free],['Unassigned cases',a.filter(c=>!c.unit).length]],
 hospitaladmin:[['Beds available','18'],['Incoming ambulances',a.filter(c=>['En route','Transporting','Arrived at hospital'].includes(c.status)).length],['Active cases',a.length],['Data mode','Demo only']]}[role];
 $('workspaceStats').innerHTML=m.map(s=>'<div class="portal-stat"><small>'+s[0]+'</small><strong>'+s[1]+'</strong></div>').join('')}
const _render=window.renderWorkspace;
window.renderWorkspace=function(role){_render(role);stats(role);const w=$('workspaceContent');
 if(role==='ems'){const mine=active().filter(c=>c.unit===myUnit);w.innerHTML='<h4>My assigned cases</h4><p>Driving: <select class="status-select" onchange="hdUnit(this.value)">'+st.ambs.map(a=>'<option'+(a.id===myUnit?' selected':'')+'>'+a.id+'</option>').join('')+'</select></p><p class="case-note">Cases are assigned by the dispatcher. Simulated GPS runs while this page is open.</p>'+(mine.map(c=>card(c,'ems')).join('')||'<p class="case-note">No cases assigned to this unit.</p>')+recordsBlock(role)+limits()}
 else if(role==='nurse'){w.innerHTML='<h4>Incoming and active cases</h4><p class="case-note">Summaries of cases created by administrators. Statuses update as EMS progresses.</p>'+(active().map(c=>card(c,'nurse')).join('')||'<p class="case-note">No active cases.</p>')+recordsBlock(role)+limits()}
 else w.insertAdjacentHTML('beforeend',recordsBlock(role)+limits());bindForm()};
function refresh(){if(!currentRole)return;const ae=document.activeElement,busy=ae&&(ae.id==='recQ'||(ae.closest&&ae.closest('#recForm')));
 if(!busy&&!(document.querySelector('#newCaseForm')&&[...document.querySelectorAll('#newCaseForm input')].some(i=>i.value)))renderWorkspace(currentRole);
 mapAmbs()}

/* ---------- boot ---------- */
load();
const css=document.createElement('style');css.textContent='.hd-card{border:1px solid var(--line);border-radius:14px;padding:14px;margin:10px 0;background:#f8fbff}.hd-card p{margin:8px 0;line-height:1.6}.hd-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}';document.head.appendChild(css);
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){load();refresh()}});
window.hdTick=tick;window.addEventListener('load',()=>{mapAmbs();setInterval(tick,3000)});
})();
