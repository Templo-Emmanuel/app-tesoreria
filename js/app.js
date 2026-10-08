/* Tesorería Iglesia Emmanuel — aplicación estática (HTML + JS) con Supabase */
var $=i=>document.getElementById(i);
var fm=n=>"S/ "+Number(n).toLocaleString("es-PE",{minimumFractionDigits:2,maximumFractionDigits:2});
var fd=d=>d.split("-").reverse().join("/");
var esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
var mn=id=>{var x=S.mem.find(y=>y.id===id);return x?x.n:"(sin nombre)"};
var MS=()=>$("mes").value,sum=a=>a.reduce((s,x)=>s+x.m,0);
var by=(a,m)=>a.filter(x=>x.f.slice(0,7)===(m||MS())).sort((p,q)=>p.f<q.f?-1:1);
var z2=n=>String(n).padStart(2,"0");
var prevM=m=>{var p=m.split("-"),d=new Date(p[0],p[1]-2,1);return d.getFullYear()+"-"+z2(d.getMonth()+1)};
var mname=m=>{var p=m.split("-");return new Date(p[0],p[1]-1,1).toLocaleDateString("es-PE",{month:"long",year:"numeric"})};
function sundays(m){var p=m.split("-"),d=new Date(p[0],p[1]-1,1),o=[];while(d.getMonth()==p[1]-1){if(d.getDay()==0)o.push(m+"-"+z2(d.getDate()));d.setDate(d.getDate()+1)}return o}
function R(id,cells,m){return {id:id,c:cells.map(c=>`<td>${c}</td>`).join("")+`<td class="n">${fm(m)}</td>`}}
function tbl(k,h,rows,tot){return `<tr>${h.map((x,i)=>`<th${i==h.length-1?' class="n"':''}>${x}</th>`).join("")}<th></th></tr>`+(rows.length?rows.map(x=>`<tr>${x.c}<td class="n"><button class="g" onclick="ed('${k}',${x.id})">Editar</button><button class="g d" onclick="del('${k}',${x.id})">Borrar</button></td></tr>`).join(""):`<tr><td colspan="${h.length+1}" class="sub">Sin registros este mes</td></tr>`)+`<tr class="t"><td colspan="${h.length-1}">Total</td><td class="n">${fm(tot)}</td><td></td></tr>`}
var tr=(a,b,cl)=>`<tr${cl?` class="${cl}"`:""}><td>${a}</td><td class="n">${b===""?"":fm(b)}</td></tr>`;
function modal(html,onok){var d=document.createElement("div");d.className="md";d.innerHTML=`<div class="mb">${html}<div style="margin-top:12px;text-align:right"><button id="mx">Cancelar</button> <button class="p" id="mo">Aceptar</button></div></div>`;document.body.appendChild(d);d.querySelector("#mx").onclick=()=>d.remove();d.querySelector("#mo").onclick=()=>{if(onok(d)!==false)d.remove()}}
function toast(m){var t=document.createElement("div");t.className="ts";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),3800)}
function csv(){var q=v=>'"'+String(v).replace(/"/g,'""')+'"',r=[["Tipo","Fecha","Detalle","Miembro","Monto"]];
 S.dom.forEach(x=>r.push(["Ofrenda domingo",x.f,x.s,"",x.m]));S.alq.forEach(x=>r.push(["Ofrenda alquiler",x.f,x.n||"",mn(x.mem),x.m]));S.diez.forEach(x=>r.push(["Diezmo",x.f,"",mn(x.mem),x.m]));S.gas.forEach(x=>r.push(["Gasto "+x.t,x.f,x.d,"",x.m]));
 return "\ufeff"+r.map(a=>a.map(q).join(",")).join("\n")}
function rAnual(){var y=MS().slice(0,4),ms=months().filter(m=>m.slice(0,4)===y),T={ing:0,egr:0,Dz:0},h=`<h1>IGLESIA DE DIOS DEL PERÚ · EMMANUEL</h1><div class="sub">Informe anual de Tesorería ${y}</div><div class="sc"><table><tr><th>Mes</th><th class="n">Ingresos</th><th class="n">Egresos</th><th class="n">Neto</th><th class="n">Saldo en caja</th><th class="n">Diezmos</th></tr>`;
 ms.forEach(m=>{var c=calc(m);T.ing+=c.ing;T.egr+=c.egr;T.Dz+=c.Dz;h+=`<tr><td>${mname(m)}</td><td class="n">${fm(c.ing)}</td><td class="n">${fm(c.egr)}</td><td class="n">${fm(c.neto+c.aj)}</td><td class="n">${fm(c.saldo)}</td><td class="n">${fm(c.Dz)}</td></tr>`});
 h+=`<tr class="t"><td>Total</td><td class="n">${fm(T.ing)}</td><td class="n">${fm(T.egr)}</td><td class="n">${fm(T.ing-T.egr)}</td><td class="n">${fm(calc(ms[ms.length-1]).saldo)}</td><td class="n">${fm(T.Dz)}</td></tr></table></div>`;
 var tm={};S.diez.filter(x=>x.f.slice(0,4)===y).forEach(x=>tm[x.mem]=(tm[x.mem]||0)+x.m);
 h+=`<h2 style="margin-top:14px">Diezmos del año por miembro</h2><table>${Object.keys(tm).map(Number).sort((a,b)=>mn(a).localeCompare(mn(b))).map(id=>tr(esc(mn(id)),tm[id])).join("")}${tr("TOTAL DE DIEZMOS",T.Dz,"t")}</table><div class="sig"><div>Tesorero</div><div>Pastor</div></div>`;$("repc").innerHTML=h}
function rRep(){if(REPY)return rAnual();var m=MS(),c=calc(m),D=by(S.dom,m),A=by(S.alq,m),G=by(S.gas,m),Z=by(S.diez,m),V=G.filter(x=>x.t==="Variado");
 $("repc").innerHTML=`<h1>IGLESIA DE DIOS DEL PERÚ · EMMANUEL</h1><div class="sub">Informe de Tesorería — ${mname(m)}</div>
 <table>${tr("Caja del mes anterior",c.ca,"t")}</table>
 <h2>I. INGRESOS</h2><h3>1. Ofrenda de los domingos</h3><table>${D.map(x=>tr(fd(x.f)+" · "+esc(x.s),x.m)).join("")}${tr("Total domingos",c.D,"t")}</table>
 <h3>2. Otros</h3><table>${tr("a) Ofrenda para alquiler",c.A)}${A.map(x=>`<tr><td class="sub">&nbsp;&nbsp;&nbsp;&nbsp;${esc(mn(x.mem))} (${fd(x.f)})</td><td class="n sub">${fm(x.m)}</td></tr>`).join("")}${tr("b) Ofrenda pastoral",c.Pa)}${tr("TOTAL DE INGRESOS DEL MES",c.ing,"t")}</table>
 <h2>II. EGRESOS</h2><table>${tr("1. Oficina Territorial — a) Diezmo de ofrenda (10% de domingos)",c.dto)}<tr><td>2. Gastos del templo</td><td></td></tr>${FIX.map((t,i)=>tr("&nbsp;&nbsp;"+"abc"[i]+") "+t,sum(G.filter(x=>x.t===t)))).join("")}<tr><td>3. Gastos variados</td><td></td></tr>${V.map(x=>tr("&nbsp;&nbsp;"+fd(x.f)+" · "+esc(x.d),x.m)).join("")}${tr("TOTAL DE EGRESOS DEL MES",c.egr,"t")}</table>
 <table style="margin-top:12px">${tr("INGRESO NETO",c.neto,"t")}${c.cr!=null?tr("Caja real al cierre del mes",c.cr,"t"):""}${tr("SALDO EN CAJA",c.saldo,"t")}</table>
 <h2>III. DIEZMOS (registro aparte, no incluidos en el saldo)</h2><table>${Z.map(x=>tr(esc(mn(x.mem)),x.m)).join("")}${tr("TOTAL DE DIEZMOS",c.Dz,"t")}</table>
 <h3>Reporte Tesorería Central</h3><table>${tr("1. Atención pastoral — Diezmo entregado al Pastor (90%)",c.Dz*0.9)}${tr("2. Oficina Territorial — a) Diezmo de diezmos (10%)",c.Dz*0.1)}${tr("&nbsp;&nbsp;&nbsp;&nbsp;b) Diezmo de ofrenda",c.dto)}</table>
 <div class="sig"><div>Tesorero</div><div>Pastor</div></div>`}
function dups(){var o=[],n=S.mem.map(x=>x.n.toLowerCase());S.mem.forEach((a,i)=>S.mem.forEach((b,j)=>{if(i<j&&(n[i].indexOf(n[j])==0||n[j].indexOf(n[i])==0))o.push(a.n+" ≈ "+b.n)}));return o}
function pick(p){var q=$(p+"nom").value.trim(),ql=q.toLowerCase(),h="";sel[p]=null;
 if(q){S.mem.forEach(m=>{if(m.n.toLowerCase()===ql)sel[p]=m.id});
  h=S.mem.filter(m=>m.n.toLowerCase().indexOf(ql)>-1).slice(0,6).map(m=>`<button onclick="chooseM('${p}',${m.id})">${esc(m.n)}</button>`).join("");
  if(!sel[p])h+=`<button class="nw" onclick="regM('${p}')">➕ Registrar «${esc(q)}»</button>`}
 $(p+"sug").innerHTML=h}
function chooseM(p,id){sel[p]=id;$(p+"nom").value=mn(id);$(p+"sug").innerHTML=""}
function regM(p){var q=$(p+"nom").value.trim().replace(/\s+/g," ");if(!q)return;var id=nid(S.mem);S.mem.push({id:id,n:q});save();chooseM(p,id)}
function renM(id){var m=S.mem.find(x=>x.id===id);modal(`<p>Nuevo nombre</p><input id="mi" value="${esc(m.n)}" style="width:100%">`,d=>{var n=d.querySelector("#mi").value.trim().replace(/\s+/g," ");if(!n)return false;m.n=n;save();render()})}
function mergeM(id){var m=S.mem.find(x=>x.id===id);modal(`<p>Unir <b>${esc(m.n)}</b> con:</p><select id="mi" style="width:100%">${S.mem.filter(x=>x.id!==id).sort((a,b)=>a.n.localeCompare(b.n)).map(x=>`<option value="${x.id}">${esc(x.n)}</option>`).join("")}</select><p class="note">Todos sus registros pasan al miembro elegido y este nombre se elimina.</p>`,d=>{var t=+d.querySelector("#mi").value;if(!t)return false;S.alq.concat(S.diez).forEach(x=>{if(x.mem===id)x.mem=t});S.mem=S.mem.filter(x=>x.id!==id);save();render()})}
function delM(id){if(S.alq.concat(S.diez).some(x=>x.mem===id)){toast("Tiene registros: únelo con otro miembro en vez de borrarlo");return}modal("<p>¿Borrar este miembro?</p>",()=>{S.mem=S.mem.filter(x=>x.id!==id);save();render()})}

/* ===== Estado y base de datos (Supabase) ===== */
var S={mem:[],dom:[],alq:[],diez:[],gas:[],cfg:[]},sb,SNAP={},CUR="inicio",Q="",REPY=false,eG=null,sel={},saving=Promise.resolve(),FIRSTM="",_n=0;
var TD=new Date().toISOString().slice(0,10),_m=TD.slice(0,7),FIX=["Alquiler","Internet","Distrital"],DTO=CFG.diezmoOfrenda,DZP=CFG.diezmoPastor;
var nid=()=>{_n=Math.max(_n+1,Date.now()*1000);return _n};
var TB={
 mem:{t:"miembros",k:"id",o:x=>({id:x.id,nombre:x.n,alq_freq:x.fq||null,diezmante:!!x.dz}),i:r=>({id:r.id,n:r.nombre,fq:r.alq_freq,dz:r.diezmante})},
 dom:{t:"domingos",k:"id",o:x=>({id:x.id,fecha:x.f,servicio:x.s,monto:x.m}),i:r=>({id:r.id,f:r.fecha,s:r.servicio,m:+r.monto})},
 alq:{t:"ofrenda_alquiler",k:"id",o:x=>({id:x.id,fecha:x.f,miembro_id:x.mem,monto:x.m,nota:x.n||null}),i:r=>({id:r.id,f:r.fecha,mem:r.miembro_id,m:+r.monto,n:r.nota||undefined})},
 diez:{t:"diezmos",k:"id",o:x=>({id:x.id,fecha:x.f,miembro_id:x.mem,monto:x.m}),i:r=>({id:r.id,f:r.fecha,mem:r.miembro_id,m:+r.monto})},
 gas:{t:"gastos",k:"id",o:x=>({id:x.id,fecha:x.f,tipo:x.t,detalle:x.d||"",monto:x.m}),i:r=>({id:r.id,f:r.fecha,t:r.tipo,d:r.detalle||"",m:+r.monto})},
 cfg:{t:"meses",k:"mes",o:x=>({mes:x.mes,ofrenda_pastoral:x.pas||0,caja_anterior:x.ca,caja_real:x.cr,cerrado:!!x.cl}),i:r=>({mes:r.mes,pas:+r.ofrenda_pastoral||0,ca:r.caja_anterior==null?null:+r.caja_anterior,cr:r.caja_real==null?null:+r.caja_real,cl:!!r.cerrado})}};
async function fetchAll(t){var o=[],p=0;for(;;){var r=await sb.from(t).select("*").range(p,p+999);if(r.error)throw r.error;o=o.concat(r.data);if(r.data.length<1000)break;p+=1000}return o}
function snap(k){var m={};S[k].forEach(x=>m[x[TB[k].k]]=JSON.stringify(TB[k].o(x)));return m}
async function load(){var ks=Object.keys(TB),r=await Promise.all(ks.map(k=>fetchAll(TB[k].t)));ks.forEach((k,i)=>{S[k]=r[i].map(TB[k].i);SNAP[k]=snap(k)})}
async function sync(){var ks=Object.keys(TB),cur={},dl={};
 for(var k of ks){var b=TB[k];cur[k]=snap(k);var up=S[k].filter(x=>cur[k][x[b.k]]!==SNAP[k][x[b.k]]).map(b.o);dl[k]=Object.keys(SNAP[k]).filter(id=>!(id in cur[k]));
  if(up.length){var r=await sb.from(b.t).upsert(up);if(r.error)throw r.error}}
 for(var k of ks.slice().reverse()){if(dl[k].length){var r=await sb.from(TB[k].t).delete().in(TB[k].k,dl[k]);if(r.error)throw r.error}}
 SNAP=cur}
function save(){$("st").textContent="Guardando…";saving=saving.then(sync).then(()=>{$("st").textContent="✓ Guardado"}).catch(e=>{$("st").textContent="⚠ Sin guardar";toast("No se pudo guardar: "+((e&&e.message)||e))})}

/* ===== Cálculos ===== */
var cf=m=>S.cfg.find(x=>x.mes===m)||{};
function setCf(m,p){var x=S.cfg.find(y=>y.mes===m);if(!x){x={mes:m,pas:0,ca:null,cr:null,cl:false};S.cfg.push(x)}Object.assign(x,p)}
var LK=()=>!!cf(MS()).cl;
function ok(){if(LK()){toast("Este mes está cerrado. Reábrelo en Revisión para modificarlo.");return false}return true}
function months(){var s={};["dom","alq","diez","gas"].forEach(k=>S[k].forEach(x=>s[x.f.slice(0,7)]=1));S.cfg.forEach(x=>s[x.mes]=1);s[_m]=1;var k=Object.keys(s).sort(),o=[],m=k[0];while(m<=k[k.length-1]){o.push(m);var p=m.split("-"),d=new Date(p[0],+p[1],1);m=d.getFullYear()+"-"+z2(d.getMonth()+1)}return o}
function calc(m){var f=cf(m),D=sum(by(S.dom,m)),Pa=+f.pas||0,A=sum(by(S.alq,m)),ing=D+Pa+A,dto=D*DTO,G=sum(by(S.gas,m)),egr=dto+G,neto=ing-egr,Dz=sum(by(S.diez,m)),ca=f.ca!=null?f.ca:(m<=FIRSTM?0:calc(prevM(m)).fin),saldo=ca+neto;
 return{D:D,Pa:Pa,A:A,ing:ing,dto:dto,G:G,egr:egr,neto:neto,aj:0,Dz:Dz,ca:ca,saldo:saldo,cr:f.cr==null?null:f.cr,fin:f.cr==null?saldo:f.cr}}
function chk(m){var o=[],dd=by(S.dom,m).map(x=>x.f),g=by(S.gas,m),k={},c=calc(m);
 sundays(m).forEach(d=>{if(d<=TD&&dd.indexOf(d)<0)o.push(["w","Falta registrar el domingo "+fd(d)])});
 FIX.forEach(t=>{if((m<_m||new Date().getDate()>=10)&&!g.some(x=>x.t===t&&x.m>0))o.push(["w","Falta el gasto fijo: "+t])});
 by(S.alq,m).forEach(x=>{if(x.n)o.push(["w","Alquiler sin detalle: "+mn(x.mem)+" "+fm(x.m)+" ("+x.n+")"]);var q=x.mem+x.f+x.m;if(k[q])o.push(["w","Posible alquiler duplicado: "+mn(x.mem)+" "+fd(x.f)]);k[q]=1});
 k={};by(S.diez,m).forEach(x=>{if(k[x.mem])o.push(["w","Diezmo repetido en el mes: "+mn(x.mem)]);k[x.mem]=1});
 if(c.cr!=null&&Math.abs(c.cr-c.saldo)>.005)o.push(["w","La caja real ("+fm(c.cr)+") difiere de la calculada ("+fm(c.saldo)+") en "+fm(c.cr-c.saldo)]);
 if(!o.length)o.push(["ok","Sin observaciones"]);return o}

/* ===== Iconos y navegación ===== */
var IC={home:"M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",dom:"M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18M8 2v4M16 2v4",alq:"M4 21V5l8-3 8 3v16M9 21v-5h6v5M9 9h.01M15 9h.01M9 13h.01M15 13h.01",diez:"M12 21s-7-4.6-9.2-9A5.2 5.2 0 0 1 12 6a5.2 5.2 0 0 1 9.2 6c-2.2 4.4-9.2 9-9.2 9z",gas:"M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6",mem:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",rev:"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",rep:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8",anual:"M4 20V10M10 20V4M16 20v-8M22 20H2",download:"M12 3v12M7 10l5 5 5-5M4 21h16",lock:"M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",help:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01",ing:"M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",egr:"M22 17l-8.5-8.5-5 5L2 7M16 17h6v-6",caja:"M3 7h18v13H3zM3 7l3-4h12l3 4M16 14h2",search:"M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3"};
var ic=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${IC[n]}"/></svg>`;
var NAV=[["inicio","Servicios","home"],["dom","Ingresos","dom"],["alq","Alquiler","alq"],["diez","Diezmos","diez"],["gas","Gastos","gas"],["mem","Miembros","mem"],["rev","Revisión","rev"],["rep","Informes","rep"]];
var TT={inicio:["Panel de tesorería","Elige el mes arriba, registra en cada servicio y revisa antes de cerrar el mes."],dom:["Ingresos de la iglesia","Escribe el servicio y el monto de cada domingo. La ofrenda de alquiler se suma sola desde la pestaña Alquiler."],alq:["Ofrenda para alquiler","Cuenta como ingreso de la iglesia. Quien aporta cada domingo tiene una casilla por domingo; quien aporta al mes, una sola."],diez:["Diezmos","Registro aparte: no se suma a los ingresos ni al saldo de la iglesia."],gas:["Gastos","Los tres gastos fijos del mes y los gastos variados que vayan surgiendo."],mem:["Miembros","Agrega, renombra o une nombres duplicados. Aquí también defines quién aporta al alquiler y quién da diezmo."],rev:["Revisión del mes","Las alertas te dicen qué falta o no cuadra. Después cuenta la caja real y cierra el mes."],rep:["Informes","Listos para imprimir o guardar como PDF y entregar a la iglesia."]};
var go=v=>{CUR=v;render();window.scrollTo(0,0)};
var goM=x=>{$("mes").value=x;render()};
var nextM=()=>{var p=MS().split("-"),d=new Date(p[0],+p[1],1);goM(d.getFullYear()+"-"+z2(d.getMonth()+1))};
var rr=()=>setTimeout(render,0);
function render(){var a=document.activeElement,id=a&&a.id,ss=a&&a.selectionStart,same=render.c===CUR;render.c=CUR;FIRSTM=months()[0];var T=TT[CUR];
 $("nav").innerHTML=NAV.map(n=>`<button class="${n[0]===CUR?"on":""}" onclick="go('${n[0]}')">${ic(n[2])}${n[1]}</button>`).join("");
 $("view").innerHTML=`<h1 class="pt">${T[0]}</h1><p class="sub">${T[1]}</p>${LK()&&["dom","alq","diez","gas"].indexOf(CUR)>-1?`<p class="al i">🔒 Este mes está cerrado. Reábrelo en Revisión para modificarlo.</p>`:""}`+VW[CUR]();
 if(CUR==="rep")rRep();
 if(same&&id&&$(id)){var e=$(id);e.focus();try{e.setSelectionRange(ss,ss)}catch(x){try{e.select()}catch(y){}}}}

/* ===== Vistas ===== */
var num=(id,v,fn,ph)=>`<input type="number" step="0.01" inputmode="decimal" id="${id}" value="${v||""}" placeholder="${ph||""}" onchange="${fn}">`;
var nm=(a,b)=>a.n.localeCompare(b.n);
function vInicio(){var m=MS(),c=calc(m),ws=chk(m).filter(x=>x[0]=="w").length,g=by(S.gas,m),su=sundays(m).filter(d=>d<=TD),dd=by(S.dom,m).map(x=>x.f);
 var B=[["Ingresos de la iglesia",c.ing,"g1","ing","dom"],["Egresos",c.egr,"g2","egr","gas"],["Saldo en caja",c.fin,"g3","caja","rev"],["Diezmos (aparte)",c.Dz,"g4c","diez","diez"]];
 var st=[["Domingos",su.length>0&&su.every(d=>dd.indexOf(d)>-1),"dom"],["Alquiler",by(S.alq,m).length>0,"alq"],["Diezmos",by(S.diez,m).length>0,"diez"],["Gastos fijos",FIX.every(t=>g.some(x=>x.t===t&&x.m>0)),"gas"],["Revisión",ws===0,"rev"],["Cerrar mes",LK(),"rev"]];
 var TL=[["Ingresos","dom","go('dom')"],["Ofrenda alquiler","alq","go('alq')"],["Diezmos","diez","go('diez')"],["Gastos","gas","go('gas')"],["Miembros","mem","go('mem')"],["Revisión","rev","go('rev')"],["Informe mensual","rep","REPY=false;go('rep')"],["Informe anual","anual","REPY=true;go('rep')"],["Copia de datos","download","dlJson()"],["Movimientos (Excel)","download","dlCsv()"],[LK()?"Reabrir mes":"Cerrar mes","lock","toggleLock()"],["Ayuda","help","help()"]];
 return `<div class="g4">${B.map(b=>`<div class="bc ${b[2]}" onclick="go('${b[4]}')">${b[3]==="caja"&&ws?`<i class="dot">${ws}</i>`:""}<div class="ci">${ic(b[3])}</div><div class="bl"><span>${b[0]}</span><b>${fm(b[1])}</b></div></div>`).join("")}</div>
 <h2>Pasos del mes de ${mname(m)}</h2><div class="steps">${st.map((s,i)=>`<div class="stp ${s[1]?"ok":""}" onclick="go('${s[2]}')"><span>${s[1]?"✔":i+1}</span>${s[0]}</div>`).join("")}</div>
 <h2>Servicios</h2><div class="g6">${TL.map(t=>`<div class="tl" onclick="${t[2]}"><div class="ti">${ic(t[1])}</div><b>${t[0]}</b></div>`).join("")}</div>`}
function vDom(){var m=MS(),su=sundays(m),all=su.concat(by(S.dom,m).map(x=>x.f).filter(d=>su.indexOf(d)<0)).sort(),h=`<tr><th>Fecha</th><th>Servicio</th><th class="n">Monto (S/)</th></tr>`;
 all.forEach(d=>{var e=S.dom.find(x=>x.f===d)||{s:"",m:""};h+=`<tr><td>${new Date(d+"T12:00").toLocaleDateString("es-PE",{weekday:"long",day:"2-digit"})}</td><td><input list="svl" id="ds_${d}" value="${esc(e.s)}" onchange="setDom('${d}')"></td><td class="n">${num("dm_"+d,e.m,"setDom('"+d+"')")}</td></tr>`});
 return `<div class="box sc"><table>${h}<tr class="t"><td colspan="2">Total domingos</td><td class="n">${fm(calc(m).D)}</td></tr></table><p class="note" style="margin-top:8px">Diezmo de ofrenda (${DTO*100}%) que se calcula solo: ${fm(calc(m).dto)}</p><div class="f"><div><label>Añadir otra fecha (no domingo)</label><input type="date" id="xf"></div><div><button onclick="addX()">Añadir</button></div></div></div>
 <div class="box"><h2>Ofrenda pastoral del mes</h2><div class="f"><div><label>Monto (S/)</label>${num("pas",cf(m).pas,"setPas()")}</div></div></div>
<div class="box"><h2>Resumen de ingresos del mes</h2><table>${tr("Ofrendas de los domingos",calc(m).D)}<tr><td>Ofrenda de alquiler <button class="g" onclick="go('alq')">ver detalle</button></td><td class="n">${fm(calc(m).A)}</td></tr>${tr("Ofrenda pastoral",calc(m).Pa)}${tr("Total de ingresos del mes",calc(m).ing,"t")}</table></div>
 <datalist id="svl"><option>Servicio Central</option><option>Ayuno</option><option>Santa Cena</option><option>Chocolatada General</option><option>Aniversario</option><option>Sin servicio</option></datalist>`}
function setDom(d){if(!ok()){rr();return}var s=$("ds_"+d).value.trim(),v=parseFloat($("dm_"+d).value),i=S.dom.findIndex(x=>x.f===d);
 if(!s&&isNaN(v)){if(i>=0)S.dom.splice(i,1)}else{var r={f:d,s:s||"Servicio",m:isNaN(v)?0:v};if(i>=0){r.id=S.dom[i].id;S.dom[i]=r}else{r.id=nid();S.dom.push(r)}}save();rr()}
function addX(){var d=$("xf").value;if(!ok()||!d)return;if(!S.dom.some(x=>x.f===d))S.dom.push({id:nid(),f:d,s:"Servicio",m:0});save();goM(d.slice(0,7))}
function setPas(){if(!ok()){rr();return}setCf(MS(),{pas:parseFloat($("pas").value)||0});save();rr()}
var pk=(p,extra)=>`<div class="box"><h2>Añadir miembro a esta lista</h2><div class="f"><div class="pk"><label>Buscar o registrar miembro</label><input id="${p}nom" autocomplete="off" placeholder="Escribe el nombre…" oninput="pick('${p}')"><div class="sug" id="${p}sug"></div></div>${extra||""}<div><button class="p" onclick="addL('${p}')">Añadir</button></div></div></div>`;
function addL(p){if(!sel[p]){toast("Elige un miembro de la lista o regístralo con ➕");return}var x=S.mem.find(y=>y.id===sel[p]);if(p==="a")x.fq=$("afq").value;else x.dz=true;sel[p]=null;save();render()}
function vAlq(){var m=MS(),su=sundays(m),A=by(S.alq,m),ms=S.mem.filter(x=>x.fq||A.some(a=>a.mem===x.id)).sort(nm),cs=su.map(()=>0),cm=0,
 h=`<tr><th>Miembro</th>${su.map(d=>`<th class="n">${d.slice(8)}/${d.slice(5,7)}</th>`).join("")}<th class="n">Mensual</th><th class="n">Total</th></tr>`;
 ms.forEach(x=>{var mine=A.filter(a=>a.mem===x.id),mo=x.fq==="mensual",tot=sum(mine);
  h+=`<tr><td>${esc(x.n)} <button class="tg" title="Cambiar frecuencia" onclick="togFq(${x.id})">${mo?"mensual":"semanal"}</button>${mine.some(a=>a.n)?` <span class="out" title="Sin detalle semanal en el Excel">⚠</span>`:""}</td>`;
  su.forEach((d,i)=>{var v=sum(mine.filter(a=>a.f===d));if(!mo)cs[i]+=v;h+=mo?`<td class="n sub">·</td>`:`<td class="n">${num("a_"+x.id+"_"+d,v,"setA("+x.id+",'"+d+"')")}</td>`});
  if(mo)cm+=tot;h+=(mo?`<td class="n">${num("a_"+x.id+"_M",tot,"setA("+x.id+",'M')")}</td>`:`<td class="n sub">·</td>`)+`<td class="n"><b>${fm(mo?tot:sum(mine))}</b></td></tr>`});
 if(!ms.length)h+=`<tr><td colspan="${su.length+3}" class="sub">Aún no hay miembros en esta lista. Añádelos abajo.</td></tr>`;
 return `<div class="box sc"><table>${h}<tr class="t"><td>Total</td>${cs.map(v=>`<td class="n">${fm(v)}</td>`).join("")}<td class="n">${fm(cm)}</td><td class="n">${fm(calc(m).A)}</td></tr></table></div>`+pk("a",`<div><label>¿Cuándo aporta?</label><select id="afq"><option value="semanal">Cada domingo</option><option value="mensual">Una vez al mes</option></select></div>`)}
function setA(id,key){if(!ok()){rr();return}var m=MS(),v=parseFloat($("a_"+id+"_"+key).value),mine=S.alq.filter(a=>a.mem===id&&a.f.slice(0,7)===m),d=key==="M"?(mine[0]?mine[0].f:m+"-01"):key;
 S.alq=S.alq.filter(a=>!(a.mem===id&&a.f.slice(0,7)===m&&(key==="M"||a.f===d)));if(v>0)S.alq.push({id:nid(),f:d,mem:id,m:v});save();rr()}
function togFq(id){var x=S.mem.find(y=>y.id===id);x.fq=x.fq==="mensual"?"semanal":"mensual";save();render()}
function vDiez(){var m=MS(),Z=by(S.diez,m),yr=m.slice(0,4),c=calc(m),ms=S.mem.filter(x=>x.dz||S.diez.some(z=>z.mem===x.id)).sort(nm),h=`<tr><th>Miembro</th><th class="n">Diezmo del mes (S/)</th><th class="n">Total ${yr}</th></tr>`;
 ms.forEach(x=>{h+=`<tr><td>${esc(x.n)}</td><td class="n">${num("z_"+x.id,sum(Z.filter(z=>z.mem===x.id)),"setZ("+x.id+")")}</td><td class="n sub">${fm(sum(S.diez.filter(z=>z.mem===x.id&&z.f.slice(0,4)===yr)))}</td></tr>`});
 return `<div class="box sc"><table>${h}<tr class="t"><td>Total del mes</td><td class="n">${fm(c.Dz)}</td><td></td></tr></table><p class="note" style="margin-top:8px">Para el Pastor (${DZP*100}%): ${fm(c.Dz*DZP)} · Diezmo de diezmos (${Math.round((1-DZP)*100)}%): ${fm(c.Dz*(1-DZP))}</p></div>`+pk("d")}
function setZ(id){if(!ok()){rr();return}var m=MS(),v=parseFloat($("z_"+id).value),mine=S.diez.filter(a=>a.mem===id&&a.f.slice(0,7)===m),d=mine[0]?mine[0].f:m+"-01";
 S.diez=S.diez.filter(a=>!(a.mem===id&&a.f.slice(0,7)===m));if(v>0)S.diez.push({id:nid(),f:d,mem:id,m:v});save();rr()}
function vGas(){var m=MS(),g=by(S.gas,m),V=g.filter(x=>x.t==="Variado"),e=eG&&S.gas.find(x=>x.id===eG),h=`<tr><th>Gasto fijo</th><th class="n">Monto (S/)</th></tr>`;
 FIX.forEach(t=>{var x=g.find(y=>y.t===t),pe=S.gas.find(y=>y.t===t&&y.f.slice(0,7)===prevM(m));h+=`<tr><td>${t}</td><td class="n">${num("fx_"+t,x&&x.m,"setFx('"+t+"')",pe?pe.m:"")}</td></tr>`});
 var c=calc(m);return `<div class="box sc"><table>${h}<tr><td>Diezmo de ofrenda (${DTO*100}% de las ofrendas de todos los servicios)</td><td class="n"><b>${fm(c.dto)}</b> <span class="sub">· automático</span></td></tr><tr class="t"><td>Total de gastos del mes</td><td class="n">${fm(c.egr)}</td></tr></table><div style="margin-top:10px"><button onclick="cpf()">Copiar fijos del mes anterior</button></div></div>
 <div class="box"><h2>${e?"Editando gasto":"Nuevo gasto variado"}</h2><div class="f"><div><label>Fecha</label><input type="date" id="gfecha" value="${e?e.f:(m===_m?TD:m+"-01")}"></div><div><label>Detalle</label><input id="gdet" value="${e?esc(e.d):""}" placeholder="Ej. Compra de reflector"></div><div><label>Monto (S/)</label>${num("gmonto",e&&e.m,"")}</div><div><button class="p" onclick="saveG()">${e?"Guardar cambios":"Guardar"}</button> ${e?`<button onclick="eG=null;render()">Cancelar</button>`:""}</div></div></div>
 <div class="box sc"><table>${tbl("gas",["Fecha","Detalle","Monto"],V.map(x=>R(x.id,[fd(x.f),esc(x.d||"—")],x.m)),sum(V))}</table></div>`}
function setFx(t){if(!ok()){rr();return}var m=MS(),v=parseFloat($("fx_"+t).value);S.gas=S.gas.filter(x=>!(x.t===t&&x.f.slice(0,7)===m));if(v>0)S.gas.push({id:nid(),f:m+"-01",t:t,d:"",m:v});save();rr()}
function cpf(){if(!ok())return;var m=MS();FIX.forEach(t=>{var pe=S.gas.find(x=>x.t===t&&x.f.slice(0,7)===prevM(m));if(pe&&!S.gas.some(x=>x.t===t&&x.f.slice(0,7)===m))S.gas.push({id:nid(),f:m+"-01",t:t,d:"",m:pe.m})});save();render()}
function saveG(){if(!ok())return;var f=$("gfecha").value,m=parseFloat($("gmonto").value),d=$("gdet").value.trim();if(!f||!(m>0)||!d){toast("Completa fecha, detalle y monto");return}
 var r={f:f,t:"Variado",d:d,m:m};if(eG){r.id=eG;S.gas[S.gas.findIndex(x=>x.id===eG)]=r}else{r.id=nid();S.gas.push(r)}eG=null;save();render()}
function ed(k,id){if(!ok())return;eG=id;render();window.scrollTo(0,0)}
function del(k,id){if(!ok())return;modal("<p>¿Borrar este gasto?</p>",()=>{S.gas=S.gas.filter(x=>x.id!==id);save();render()})}
function vMem(){var q=Q.toLowerCase(),y=MS().slice(0,4),d=dups(),h=`<tr><th>Nombre</th><th>Ofrenda de alquiler</th><th>Diezmo</th><th class="n">Diezmos ${y}</th><th class="n">Alquiler ${y}</th><th></th></tr>`,so=(v,t)=>`<option value="${v}" ${t===v?"selected":""}>`;
 S.mem.filter(m=>m.n.toLowerCase().indexOf(q)>-1).sort(nm).forEach(m=>{h+=`<tr><td>${esc(m.n)}</td><td><select onchange="setMem(${m.id},'fq',this.value)">${so("","")}${m.fq?"":""}No aporta</option>${so("semanal",m.fq)}Cada domingo</option>${so("mensual",m.fq)}Una vez al mes</option></select></td><td><input type="checkbox" ${m.dz?"checked":""} onchange="setMem(${m.id},'dz',this.checked)"></td><td class="n">${fm(sum(S.diez.filter(x=>x.mem===m.id&&x.f.slice(0,4)===y)))}</td><td class="n">${fm(sum(S.alq.filter(x=>x.mem===m.id&&x.f.slice(0,4)===y)))}</td><td class="n"><button class="g" onclick="renM(${m.id})">Renombrar</button><button class="g" onclick="mergeM(${m.id})">Unir con…</button><button class="g d" onclick="delM(${m.id})">Borrar</button></td></tr>`});
 return `<div class="box"><h2>Nuevo miembro</h2><div class="f"><div class="pk"><label>Nombre completo</label><input id="nn" placeholder="Ej. María Quispe" onkeydown="if(event.key==='Enter')newMem()"></div><div><label>Ofrenda de alquiler</label><select id="nfq"><option value="">No aporta</option><option value="semanal">Cada domingo</option><option value="mensual">Una vez al mes</option></select></div><div><label>¿Da diezmo?</label><select id="ndz"><option value="">No</option><option value="1">Sí</option></select></div><div><button class="p" onclick="newMem()">➕ Agregar miembro</button></div></div></div>
 ${d.length?`<div class="box"><h2>Posibles duplicados</h2><p class="note">${d.map(esc).join(" · ")}</p><p class="note">Usa "Unir con…" para juntar sus registros.</p></div>`:""}
 <div class="box"><input id="mq" value="${esc(Q)}" placeholder="Buscar miembro…" oninput="Q=this.value;render()" style="width:100%"></div><div class="box sc"><table>${h}</table></div>`}
function newMem(){var n=$("nn").value.trim().replace(/\s+/g," ");if(!n){toast("Escribe el nombre");return}if(S.mem.some(x=>x.n.toLowerCase()===n.toLowerCase())){toast("Ese nombre ya existe");return}
 S.mem.push({id:nid(),n:n,fq:$("nfq").value||null,dz:$("ndz").value==="1"});save();render();toast("Miembro agregado")}
function setMem(id,k,v){var x=S.mem.find(y=>y.id===id);x[k]=k==="dz"?!!v:(v||null);save();render()}
function vRev(){var m=MS(),c=calc(m),f=cf(m),t=`<tr><th>Mes</th><th class="n">Caja ant.</th><th class="n">Ingresos</th><th class="n">Egresos</th><th class="n">Caja final</th><th class="n">Diezmos</th><th class="n">Avisos</th></tr>`;
 months().forEach(x=>{var k=calc(x),w=chk(x).filter(y=>y[0]=="w").length;t+=`<tr style="cursor:pointer" onclick="goM('${x}')"><td>${mname(x)}${cf(x).cl?" 🔒":""}</td><td class="n">${fm(k.ca)}</td><td class="n">${fm(k.ing)}</td><td class="n">${fm(k.egr)}</td><td class="n">${fm(k.fin)}</td><td class="n">${fm(k.Dz)}</td><td class="n ${w?"out":""}">${w}</td></tr>`});
 return `<div class="box"><div style="float:right"><button onclick="toggleLock()">${LK()?"🔓 Reabrir mes":"🔒 Cerrar mes"}</button></div><h2>Observaciones de ${mname(m)}</h2>${chk(m).map(x=>`<p class="al ${x[0]}">${x[0]=="w"?"⚠":x[0]=="ok"?"✔":"ℹ"} ${esc(x[1])}</p>`).join("")}</div>
 <div class="box"><h2>Caja del mes</h2><div class="f"><div><label>Caja del mes anterior (S/)</label>${num("ca",f.ca,"setCaja('ca')",c.ca.toFixed(2))}</div><div><label>Saldo calculado</label><input value="${fm(c.saldo)}" disabled></div><div><label>Caja real al cierre (S/)</label>${num("cr",f.cr,"setCaja('cr')")}</div></div><p class="note" style="margin-top:8px">Cuenta el dinero real al terminar el mes y escríbelo en "Caja real": el mes siguiente empezará con ese valor y la diferencia queda anotada arriba. Deja "Caja del mes anterior" vacía para que se tome sola.</p></div>
 <div class="box sc"><h2>Resumen del año (toca un mes para abrirlo)</h2><table>${t}</table></div>`}
function setCaja(k){var v=parseFloat($(k).value);setCf(MS(),{[k]:isNaN(v)?null:v});save();rr()}
function toggleLock(){var m=MS();setCf(m,{cl:!cf(m).cl});save();render()}
function vRep(){return `<div class="noprint" style="margin-bottom:12px"><button class="${REPY?"":"p"}" onclick="REPY=false;render()">Informe mensual</button> <button class="${REPY?"p":""}" onclick="REPY=true;render()">Informe anual</button> <button onclick="window.print()">🖨 Imprimir / Guardar PDF</button></div><div class="box rep" id="repc"></div>`}
var VW={inicio:vInicio,dom:vDom,alq:vAlq,diez:vDiez,gas:vGas,mem:vMem,rev:vRev,rep:vRep};
function help(){modal(`<h2>Cómo usar la aplicación</h2><ol style="padding-left:18px;line-height:1.6"><li>Elige el <b>mes</b> arriba (flechas ‹ ›).</li><li><b>Domingos:</b> escribe servicio y monto de cada domingo.</li><li><b>Alquiler y Diezmos:</b> escribe el monto junto al nombre. Si alguien es nuevo, escríbelo abajo y pulsa ➕.</li><li><b>Gastos:</b> llena los tres fijos y añade los variados.</li><li><b>Revisión:</b> corrige lo que marque en rojo y anota la caja real.</li><li><b>Cerrar mes</b> y entrega el informe desde <b>Informes</b>.</li></ol><p class="note">Todo se guarda solo, al salir de cada casilla.</p>`,()=>{})}
function dlF(n,txt,type){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:type}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
var dlJson=()=>dlF("tesoreria-"+TD+".json",JSON.stringify(S,null,1),"application/json"),dlCsv=()=>dlF("movimientos-"+TD+".csv",csv(),"text/csv;charset=utf-8");
function logout(){modal("<p>¿Cerrar sesión?</p>",()=>{sb.auth.signOut().then(()=>location.reload())})}
async function login(){var r=await sb.auth.signInWithPassword({email:$("le").value.trim(),password:$("lp").value});if(r.error){$("lerr").textContent="Correo o contraseña incorrectos";return}start()}
async function start(){$("lg").classList.add("hide");$("app").classList.remove("hide");$("sico").innerHTML=ic("search");$("mes").value=_m;
 try{await load()}catch(e){toast("No se pudieron cargar los datos: "+((e&&e.message)||e))}render();$("st").textContent="✓ Conectado";
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)saving.then(load).then(render).catch(()=>{})})}
async function boot(){if(!window.supabase||/TU-/.test(CFG.url+CFG.key)){document.body.innerHTML="<p style='padding:30px'>Falta configurar <b>js/config.js</b> con la URL y la clave de tu proyecto Supabase.</p>";return}
 sb=supabase.createClient(CFG.url,CFG.key);var s=(await sb.auth.getSession()).data.session;if(s)start();else $("lg").classList.remove("hide")}
boot();
