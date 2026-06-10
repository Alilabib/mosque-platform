import { useState, useEffect, useCallback, useRef } from "react";

const C = {
  bg:"#f5f4f0",card:"#ffffff",sidebar:"#0f1f24",sidebarHover:"#1a3340",sidebarActive:"#0a4d3c",
  primary:"#0b7a5e",primaryDark:"#065c46",primaryLight:"#e6f5ef",accent:"#c9a230",accentLight:"#fdf6e3",
  danger:"#be3a2a",dangerLight:"#fce8e5",warn:"#d97706",warnLight:"#fef5e0",info:"#1d6fa5",infoLight:"#e7f1f8",
  text:"#1a1a1a",text2:"#5a6a72",text3:"#8a9aa2",border:"#e3e1dc",borderL:"#efeee9",white:"#fff",
};
const FONT="'Noto Sans Arabic','Segoe UI',Tahoma,sans-serif";
const CITIES=["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","تبوك","أبها"];
const MOSQUE_TYPES=["جامع","مسجد","مصلى"];
const SERVICES_LIST=["الجمعة","الجنائز","العيد","التحفيظ","المحاضرات","الدروس"];
const TICKET_TYPES=["تكييف","إضاءة","نظام صوت","سجاد","دورات مياه","سباكة","كهرباء","أخرى"];
const PRIORITIES=["عاجلة","عالية","متوسطة","منخفضة"];
const COMPLAINT_TYPES=["صوت مرتفع","صوت منخفض","تداخل أصوات","نظافة","صيانة","تكييف","إضاءة","ازدحام","أخرى"];
const TEAMS=["فريق HVAC","فريق الصوتيات","فريق الكهرباء","فريق السباكة","فريق النظافة","فريق عام"];
const ROLES=["Super Admin","Regional Admin","City Admin","مشرف مسجد","إمام","مؤذن","فريق صيانة","فريق نظافة","Compliance Officer"];

// --- Shared Components ---
function Badge({text,color="gray"}){const m={green:[C.primaryLight,C.primary],red:[C.dangerLight,C.danger],orange:[C.warnLight,C.warn],blue:[C.infoLight,C.info],gray:[C.borderL,C.text2],gold:[C.accentLight,"#9a7b1a"],purple:["#f0e6f6","#7b2d8e"]};const[bg,fg]=m[color]||m.gray;return<span style={{background:bg,color:fg,padding:"3px 11px",borderRadius:20,fontSize:11.5,fontWeight:600,whiteSpace:"nowrap",display:"inline-block"}}>{text}</span>;}
function Stat({icon,label,value,sub,bg:b}){return<div style={{background:C.card,borderRadius:14,padding:"18px 20px",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:13,cursor:"default"}}><div style={{width:46,height:46,borderRadius:11,background:b||C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{icon}</div><div><div style={{fontSize:24,fontWeight:700,lineHeight:1.1}}>{value}</div><div style={{fontSize:12,color:C.text2,marginTop:2}}>{label}</div>{sub&&<div style={{fontSize:10.5,color:C.primary,marginTop:1,fontWeight:600}}>{sub}</div>}</div></div>;}
function Progress({val,max,color:cl}){const p=Math.min(100,(val/max)*100);return<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:7,background:C.borderL,borderRadius:4,overflow:"hidden"}}><div style={{width:`${p}%`,height:"100%",background:cl||C.primary,borderRadius:4,transition:"width .5s"}}/></div><span style={{fontSize:11,fontWeight:700,color:C.text2,minWidth:36}}>{Math.round(p)}%</span></div>;}
function Btn({children,onClick,variant,small,icon,disabled,full}){const s=variant==="secondary",d=variant==="danger",g=variant==="ghost";const bg=disabled?C.border:d?C.danger:s?C.white:g?"transparent":C.primary;const fg=disabled?C.text3:s?C.primary:g?C.primary:C.white;const bd=s?`1.5px solid ${C.primary}`:d?`1.5px solid ${C.danger}`:"1.5px solid transparent";return<button disabled={disabled} onClick={onClick} style={{background:bg,color:fg,border:bd,padding:small?"6px 14px":"9px 20px",borderRadius:8,fontSize:small?12:13.5,fontWeight:600,cursor:disabled?"default":"pointer",fontFamily:"inherit",transition:"opacity .15s",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,width:full?"100%":"auto"}} onMouseEnter={e=>!disabled&&(e.currentTarget.style.opacity=".85")} onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>{icon&&<span>{icon}</span>}{children}</button>;}
function Card({title,action,children,noPad}){return<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden"}}>{title&&<div style={{padding:"13px 20px",borderBottom:`1px solid ${C.borderL}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}><h3 style={{margin:0,fontSize:15,fontWeight:700}}>{title}</h3>{action}</div>}<div style={noPad?{padding:0}:{padding:"16px 20px"}}>{children}</div></div>;}
function Table({cols,rows,onRow,selectable,selected,onSelect}){return<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:`2px solid ${C.border}`}}>{selectable&&<th style={{padding:"10px 8px",width:32}}><input type="checkbox" checked={selected?.length===rows.length&&rows.length>0} onChange={e=>onSelect(e.target.checked?rows.map((_,i)=>i):[])} style={{cursor:"pointer"}}/></th>}{cols.map((c,i)=><th key={i} style={{padding:"10px 12px",textAlign:"right",color:C.text2,fontWeight:600,fontSize:11.5,whiteSpace:"nowrap"}}>{c.label}</th>)}</tr></thead><tbody>{rows.map((r,ri)=><tr key={ri} style={{borderBottom:`1px solid ${C.borderL}`,cursor:onRow?"pointer":"default",transition:"background .12s",background:selected?.includes(ri)?"#f0f8f4":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=selected?.includes(ri)?"#e8f5f0":"#fafaf7"} onMouseLeave={e=>e.currentTarget.style.background=selected?.includes(ri)?"#f0f8f4":"transparent"} onClick={()=>onRow?.(r)}>{selectable&&<td style={{padding:"10px 8px"}} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selected?.includes(ri)} onChange={()=>{const n=selected.includes(ri)?selected.filter(x=>x!==ri):[...selected,ri];onSelect(n);}} style={{cursor:"pointer"}}/></td>}{cols.map((c,ci)=><td key={ci} style={{padding:"10px 12px",whiteSpace:"nowrap"}}>{c.render?c.render(r,ri):r[c.key]}</td>)}</tr>)}</tbody></table>{rows.length===0&&<div style={{padding:40,textAlign:"center",color:C.text3,fontSize:13}}>لا توجد بيانات</div>}</div>;}
function Modal({open,onClose,title,width,children}){if(!open)return null;return<div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}><div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.45)",backdropFilter:"blur(3px)"}}/><div onClick={e=>e.stopPropagation()} style={{position:"relative",background:C.card,borderRadius:18,width:width||560,maxWidth:"92vw",maxHeight:"88vh",overflow:"auto",boxShadow:"0 24px 60px rgba(0,0,0,.18)",animation:"mIn .2s ease"}}><div style={{padding:"16px 22px",borderBottom:`1px solid ${C.borderL}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.card,zIndex:1}}><h3 style={{margin:0,fontSize:17,fontWeight:700}}>{title}</h3><button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.text2,padding:4}}>✕</button></div><div style={{padding:22}}>{children}</div></div><style>{`@keyframes mIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}`}</style></div>;}
function Field({label,children,req}){return<div style={{marginBottom:14}}><label style={{display:"block",fontSize:13,fontWeight:600,color:C.text,marginBottom:5}}>{label}{req&&<span style={{color:C.danger}}> *</span>}</label>{children}</div>;}
function Input({value,onChange,placeholder,type="text",...r}){return<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"10px 14px",borderRadius:9,border:`1.5px solid ${C.border}`,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",background:C.white}} onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border} {...r}/>;}
function Select({value,onChange,options,placeholder}){return<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:9,border:`1.5px solid ${C.border}`,fontSize:14,fontFamily:"inherit",outline:"none",background:C.white,cursor:"pointer",appearance:"auto",boxSizing:"border-box"}}>{placeholder&&<option value="">{placeholder}</option>}{options.map((o,i)=><option key={i} value={typeof o==="string"?o:o.value}>{typeof o==="string"?o:o.label}</option>)}</select>;}
function Textarea({value,onChange,placeholder,rows=3}){return<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{width:"100%",padding:"10px 14px",borderRadius:9,border:`1.5px solid ${C.border}`,fontSize:14,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box",background:C.white}} onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>;}
function Tabs({tabs,active,onChange}){return<div style={{display:"flex",gap:0,borderBottom:`2px solid ${C.borderL}`,marginBottom:18}}>{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} style={{padding:"9px 18px",border:"none",borderBottom:active===t.id?`2.5px solid ${C.primary}`:"2.5px solid transparent",background:"none",color:active===t.id?C.primary:C.text2,fontWeight:active===t.id?700:500,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:-2}}>{t.label}</button>)}</div>;}
function SearchBar({value,onChange,placeholder}){return<div style={{position:"relative",width:250}}><span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:15,color:C.text3}}>🔍</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"بحث..."} style={{width:"100%",padding:"8px 36px 8px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",background:C.white}} onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/></div>;}
function Toast({msg,type,onClose}){useEffect(()=>{const t=setTimeout(onClose,3000);return()=>clearTimeout(t);},[onClose]);return<div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",zIndex:2000,background:type==="error"?C.danger:C.primary,color:C.white,padding:"12px 28px",borderRadius:12,fontSize:14,fontWeight:600,boxShadow:"0 8px 30px rgba(0,0,0,.2)",fontFamily:FONT,direction:"rtl"}}>{msg}</div>;}
function Confirm({open,onClose,onOk,title,msg}){return<Modal open={open} onClose={onClose} title={title||"تأكيد"} width={420}><p style={{fontSize:14,color:C.text2,lineHeight:1.8,margin:"0 0 18px"}}>{msg}</p><div style={{display:"flex",gap:10}}><Btn onClick={onOk}>تأكيد</Btn><Btn variant="secondary" onClick={onClose}>إلغاء</Btn></div></Modal>;}

// --- CSV Export ---
function exportCSV(cols,rows,filename){const hdr=cols.map(c=>c.label).join(",");const body=rows.map(r=>cols.map(c=>{const v=c.csvKey?r[c.csvKey]:c.key?r[c.key]:"";return`"${String(v).replace(/"/g,'""')}"`;}).join(",")).join("\n");const csv="\uFEFF"+hdr+"\n"+body;const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename+".csv";a.click();}

// --- Simple SVG Charts ---
function BarChart({data,height=180,color=C.primary}){const max=Math.max(...data.map(d=>d.v),1);const w=600;const bw=Math.min(50,w/(data.length*1.8));return<svg viewBox={`0 0 ${w} ${height+30}`} style={{width:"100%"}}>{data.map((d,i)=>{const x=40+i*(w-60)/data.length;const h=(d.v/max)*(height-20);return<g key={i}><rect x={x} y={height-h} width={bw} height={h} rx={4} fill={d.color||color} opacity={.85}/><text x={x+bw/2} y={height+16} textAnchor="middle" fontSize={11} fill={C.text2} fontFamily={FONT}>{d.l}</text><text x={x+bw/2} y={height-h-6} textAnchor="middle" fontSize={11} fill={C.text} fontWeight={600} fontFamily={FONT}>{d.v}</text></g>;})}</svg>;}
function DonutChart({data,size=160}){const total=data.reduce((s,d)=>s+d.v,0);let cum=0;const r=size/2-8,cx=size/2,cy=size/2;const arcs=data.map(d=>{const start=cum/total*Math.PI*2-Math.PI/2;cum+=d.v;const end=cum/total*Math.PI*2-Math.PI/2;const lg=d.v/total>.5?1:0;return{...d,d:`M${cx+r*Math.cos(start)} ${cy+r*Math.sin(start)} A${r} ${r} 0 ${lg} 1 ${cx+r*Math.cos(end)} ${cy+r*Math.sin(end)}`};});return<div style={{display:"flex",alignItems:"center",gap:20}}><svg width={size} height={size}><circle cx={cx} cy={cy} r={r} fill="none" stroke={C.borderL} strokeWidth={22}/>{arcs.map((a,i)=><path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={22} strokeLinecap="round"/>)}<text x={cx} y={cy-6} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.text} fontFamily={FONT}>{total}</text><text x={cx} y={cy+14} textAnchor="middle" fontSize={11} fill={C.text2} fontFamily={FONT}>إجمالي</text></svg><div style={{display:"flex",flexDirection:"column",gap:6}}>{data.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12.5}}><div style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}}/><span style={{color:C.text2}}>{d.l}</span><span style={{fontWeight:700,color:C.text}}>{d.v}</span></div>)}</div></div>;}

// --- Initial Data ---
const initMosques=()=>[
  {id:1,name:"جامع الراجحي",city:"الرياض",district:"حي النسيم",type:"جامع",status:"نشط",capacity:3500,services:["الجمعة","الجنائز","العيد","التحفيظ"],imam:"الشيخ عبدالله المحمد",device:"متصل"},
  {id:2,name:"مسجد الفرقان",city:"الرياض",district:"حي الملز",type:"مسجد",status:"نشط",capacity:800,services:["الجمعة","التحفيظ"],imam:"الشيخ خالد العتيبي",device:"متصل"},
  {id:3,name:"جامع الملك فهد",city:"جدة",district:"حي الحمراء",type:"جامع",status:"نشط",capacity:5000,services:["الجمعة","الجنائز","العيد","التحفيظ","المحاضرات"],imam:"الشيخ سعد الغامدي",device:"غير متصل"},
  {id:4,name:"مسجد التوحيد",city:"الدمام",district:"حي الفيصلية",type:"مسجد",status:"صيانة",capacity:600,services:["الجمعة"],imam:"الشيخ محمد الدوسري",device:"صيانة"},
  {id:5,name:"مسجد الإيمان",city:"مكة المكرمة",district:"حي العزيزية",type:"مسجد",status:"نشط",capacity:1200,services:["الجمعة","التحفيظ","المحاضرات"],imam:"الشيخ أحمد الشهري",device:"متصل"},
  {id:6,name:"جامع البواردي",city:"الرياض",district:"حي العليا",type:"جامع",status:"نشط",capacity:2800,services:["الجمعة","الجنائز","العيد"],imam:"الشيخ فهد القحطاني",device:"متصل"},
  {id:7,name:"مسجد النور",city:"المدينة المنورة",district:"حي قباء",type:"مسجد",status:"نشط",capacity:950,services:["الجمعة","التحفيظ"],imam:"الشيخ ياسر الحربي",device:"متصل"},
  {id:8,name:"مصلى حي الروضة",city:"الرياض",district:"حي الروضة",type:"مصلى",status:"مغلق مؤقتاً",capacity:200,services:[],imam:"—",device:"غير متصل"},
];
const initKhutbahs=()=>[
  {id:1,title:"فضل العشر الأوائل من ذي الحجة",date:"2026-06-05",status:"تم الإرسال",viewed:42,total:50,recordings:38},
  {id:2,title:"أهمية بر الوالدين",date:"2026-05-29",status:"مؤرشفة",viewed:50,total:50,recordings:47},
  {id:3,title:"حقوق الجار في الإسلام",date:"2026-06-12",status:"مسودة",viewed:0,total:50,recordings:0},
  {id:4,title:"التحذير من الغيبة والنميمة",date:"2026-05-22",status:"مؤرشفة",viewed:49,total:50,recordings:45},
];
const initTickets=()=>[
  {id:"TK-0041",mosque:"جامع الراجحي",type:"تكييف",priority:"عالية",status:"قيد المعالجة",date:"2026-06-07",assignee:"فريق HVAC",notes:"التكييف لا يعمل في الجهة اليمنى"},
  {id:"TK-0042",mosque:"مسجد الفرقان",type:"إضاءة",priority:"متوسطة",status:"جديدة",date:"2026-06-08",assignee:"",notes:"إضاءة ممر دورات المياه"},
  {id:"TK-0043",mosque:"جامع الملك فهد",type:"نظام صوت",priority:"عاجلة",status:"قيد المعالجة",date:"2026-06-08",assignee:"فريق الصوتيات",notes:"مكبر الصوت الخارجي لا يعمل"},
  {id:"TK-0044",mosque:"مسجد التوحيد",type:"سجاد",priority:"منخفضة",status:"مكتملة",date:"2026-06-03",assignee:"فريق النظافة",notes:"استبدال سجاد"},
  {id:"TK-0045",mosque:"مسجد الإيمان",type:"دورات مياه",priority:"عالية",status:"جديدة",date:"2026-06-08",assignee:"",notes:"تسرب مياه"},
];
const initComplaints=()=>[
  {id:"SH-0101",mosque:"جامع الراجحي",type:"صوت مرتفع",priority:"عالية",status:"قيد المراجعة",date:"2026-06-07",source:"جمهور",desc:"صوت الأذان مرتفع جداً في الفجر",history:[{date:"٧ يونيو",action:"تم استلام البلاغ",by:"النظام"},{date:"٧ يونيو",action:"تم إحالته للمشرف",by:"أحمد العمري"}]},
  {id:"SH-0102",mosque:"مسجد الفرقان",type:"نظافة",priority:"متوسطة",status:"تم التعيين",date:"2026-06-06",source:"مشرف",desc:"دورات المياه تحتاج تنظيف عاجل",history:[{date:"٦ يونيو",action:"تم استلام البلاغ",by:"محمد الحربي"},{date:"٦ يونيو",action:"تم تعيين فريق النظافة",by:"فهد الشمري"}]},
  {id:"SH-0103",mosque:"جامع الملك فهد",type:"تداخل أصوات",priority:"عالية",status:"جديدة",date:"2026-06-08",source:"جمهور",desc:"تداخل أذان مع مسجد مجاور خاصة في المغرب",history:[{date:"٨ يونيو",action:"تم استلام البلاغ",by:"النظام"}]},
  {id:"SH-0104",mosque:"مسجد النور",type:"تكييف",priority:"متوسطة",status:"تم الحل",date:"2026-06-04",source:"مشرف",desc:"التكييف ضعيف في الجهة اليمنى",history:[{date:"٤ يونيو",action:"تم استلام البلاغ",by:"ياسر الحربي"},{date:"٥ يونيو",action:"تم التعيين لفريق HVAC",by:"فهد الشمري"},{date:"٦ يونيو",action:"تم الحل — استبدال فلتر",by:"ناصر القحطاني"}]},
];
const initDonations=()=>[
  {id:1,project:"بناء مسجد حي السلام",type:"بناء",target:2500000,collected:1875000,status:"نشط",donors:342},
  {id:2,project:"صيانة جامع الراجحي",type:"صيانة",target:150000,collected:150000,status:"مكتمل",donors:89},
  {id:3,project:"حلقات تحفيظ القرآن",type:"تحفيظ",target:500000,collected:215000,status:"نشط",donors:156},
  {id:4,project:"طباعة المصحف الشريف",type:"طباعة",target:300000,collected:78000,status:"نشط",donors:67},
];

const PRAYERS=[{name:"الفجر",adhan:"٣:٣٢",iqama:"٣:٥٢",done:true,vol:75},{name:"الظهر",adhan:"١١:٥٢",iqama:"١٢:٠٧",done:true,vol:70},{name:"العصر",adhan:"٣:١٣",iqama:"٣:٢٨",done:false,vol:70},{name:"المغرب",adhan:"٦:٤١",iqama:"٦:٥١",done:false,vol:75},{name:"العشاء",adhan:"٨:١١",iqama:"٨:٢٦",done:false,vol:65}];
const AUDIT_LOGS=[{time:"١٠:٣٢ ص",user:"أحمد العمري",action:"اعتماد صوت أذان جديد",detail:"أذان الحرم ٢"},{time:"٠٩:١٥ ص",user:"فهد الشمري",action:"تعديل مستوى صوت",detail:"الفجر: ٧٠→٧٥"},{time:"٠٨:٤٥ ص",user:"محمد الحربي",action:"إغلاق تذكرة صيانة",detail:"TK-0044"},{time:"٠٧:٠٠ ص",user:"عبدالله المحمد",action:"تأكيد اطلاع خطبة",detail:"خطبة #1"},{time:"أمس ٤:٢٠ م",user:"سارة الخالدي",action:"إضافة مسجد",detail:"مسجد الهدى"},{time:"أمس ٢:١٥ م",user:"يوسف الزهراني",action:"مراجعة تسجيل خطبة",detail:"خطبة #2"}];
const MODULES=[{id:"dashboard",label:"لوحة التحكم",icon:"📊"},{id:"mosques",label:"إدارة المساجد",icon:"🕌"},{id:"adhan",label:"الأذان والإقامة",icon:"🔊"},{id:"khutbah",label:"إدارة الخطب",icon:"📜"},{id:"maintenance",label:"الصيانة",icon:"🔧"},{id:"complaints",label:"الشكاوى",icon:"📋"},{id:"donations",label:"التبرعات",icon:"💰"},{id:"users",label:"المستخدمون",icon:"👥"},{id:"reports",label:"التقارير",icon:"📈"},{id:"settings",label:"الإعدادات",icon:"⚙️"}];

// ═══ DASHBOARD ═══
function Dashboard({mosques,tickets,complaints,khutbahs,donations}){
  const active=mosques.filter(m=>m.status==="نشط").length;const devOn=mosques.filter(m=>m.device==="متصل").length;
  const openTk=tickets.filter(t=>t.status!=="مكتملة").length;const urgTk=tickets.filter(t=>t.priority==="عاجلة"&&t.status!=="مكتملة").length;
  const newComp=complaints.filter(c=>c.status==="جديدة").length;const totalDon=donations.reduce((s,d)=>s+d.collected,0);
  const cityData=CITIES.slice(0,5).map(c=>({l:c.split(" ")[0],v:mosques.filter(m=>m.city===c).length,color:C.primary}));
  const statusData=[{l:"نشط",v:active,color:C.primary},{l:"صيانة",v:mosques.filter(m=>m.status==="صيانة").length,color:C.warn},{l:"مغلق",v:mosques.filter(m=>m.status==="مغلق مؤقتاً").length,color:C.danger}];
  const tkByType={};tickets.forEach(t=>{tkByType[t.type]=(tkByType[t.type]||0)+1;});
  const tkData=Object.entries(tkByType).map(([l,v])=>({l,v,color:C.info}));
  return<div style={{display:"flex",flexDirection:"column",gap:20}}>
    <div className="admin-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
      <Stat icon="🕌" label="المساجد" value={mosques.length} sub={`${active} نشط`} bg={C.primaryLight}/>
      <Stat icon="📡" label="أجهزة متصلة" value={`${devOn}/${mosques.length}`} sub={`${Math.round(devOn/mosques.length*100)}%`} bg={C.infoLight}/>
      <Stat icon="🔧" label="تذاكر مفتوحة" value={openTk} sub={urgTk?`${urgTk} عاجلة`:""} bg={C.warnLight}/>
      <Stat icon="📋" label="شكاوى جديدة" value={newComp} bg={C.dangerLight}/>
      <Stat icon="📜" label="اطلاع الخطبة" value={khutbahs[0]?`${khutbahs[0].viewed}/${khutbahs[0].total}`:"—"} bg={C.accentLight}/>
      <Stat icon="💰" label="التبرعات" value={`${(totalDon/1e6).toFixed(2)} م`} sub="ريال" bg="#f0e6f6"/>
    </div>
    <div className="admin-stat-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card title="المساجد حسب المدينة"><BarChart data={cityData} height={150}/></Card>
      <Card title="حالة المساجد"><DonutChart data={statusData}/></Card>
    </div>
    <div className="admin-stat-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card title="مواقيت الصلاة — الرياض">{PRAYERS.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:9,background:!p.done?C.primaryLight:"#fafaf8",marginBottom:4}}><span style={{fontWeight:700,fontSize:13,width:50,color:!p.done?C.primary:C.text}}>{p.name}</span><span style={{fontSize:12.5,color:C.text2,width:42}}>{p.adhan}</span><span style={{fontSize:12.5,color:C.text2,width:42}}>{p.iqama}</span><span style={{marginRight:"auto"}}><Badge text={p.done?"تم":"قادم"} color={p.done?"green":"blue"}/></span></div>)}</Card>
      <Card title="التذاكر حسب النوع"><BarChart data={tkData} height={150} color={C.info}/></Card>
    </div>
    <Card title="سجل التدقيق — آخر الإجراءات" action={<Btn small variant="ghost" onClick={()=>exportCSV([{label:"الوقت",csvKey:"time"},{label:"المستخدم",csvKey:"user"},{label:"الإجراء",csvKey:"action"},{label:"التفاصيل",csvKey:"detail"}],AUDIT_LOGS,"audit_log")}>تصدير CSV</Btn>}>{AUDIT_LOGS.map((l,i)=><div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:i<AUDIT_LOGS.length-1?`1px solid ${C.borderL}`:"none",fontSize:12.5}}><span style={{color:C.text3,width:60,flexShrink:0}}>{l.time}</span><span style={{color:C.primary,fontWeight:600,width:95,flexShrink:0}}>{l.user}</span><span style={{color:C.text,flex:1}}>{l.action}</span><span style={{color:C.text3}}>{l.detail}</span></div>)}</Card>
  </div>;
}

// ═══ MOSQUES ═══
function MosquesPage({mosques,setMosques,toast}){
  const[search,setSearch]=useState("");const[sel,setSel]=useState(null);const[modal,setModal]=useState(false);const[editModal,setEditModal]=useState(null);const[delConfirm,setDelConfirm]=useState(null);const[detailTab,setDetailTab]=useState("info");
  const emptyForm={name:"",city:"",district:"",type:"",capacity:"",imam:"",services:[]};
  const[form,setForm]=useState(emptyForm);
  const filtered=mosques.filter(m=>m.name.includes(search)||m.city.includes(search)||m.district.includes(search));
  const stC=s=>s==="نشط"?"green":s==="صيانة"?"orange":"red";const dvC=s=>s==="متصل"?"green":s==="غير متصل"?"red":"orange";
  const toggleSvc=s=>setForm(p=>({...p,services:p.services.includes(s)?p.services.filter(x=>x!==s):[...p.services,s]}));
  const save=()=>{if(!form.name||!form.city||!form.type)return;if(editModal){setMosques(p=>p.map(m=>m.id===editModal.id?{...m,...form,capacity:Number(form.capacity)||0}:m));setEditModal(null);toast("تم تحديث المسجد ✓","success");}else{setMosques(p=>[...p,{id:Date.now(),...form,capacity:Number(form.capacity)||0,status:"نشط",device:"غير متصل"}]);setModal(false);toast("تم إضافة المسجد ✓","success");}setForm(emptyForm);};
  const del=()=>{setMosques(p=>p.filter(m=>m.id!==delConfirm.id));setDelConfirm(null);setSel(null);toast("تم حذف المسجد","success");};
  const openEdit=m=>{setForm({name:m.name,city:m.city,district:m.district,type:m.type,capacity:String(m.capacity),imam:m.imam,services:[...m.services]});setEditModal(m);};
  const formModal=modal||editModal;
  const MosqueForm=()=><><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}><Field label="اسم المسجد" req><Input value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/></Field><Field label="النوع" req><Select value={form.type} onChange={v=>setForm(p=>({...p,type:v}))} options={MOSQUE_TYPES} placeholder="اختر"/></Field><Field label="المدينة" req><Select value={form.city} onChange={v=>setForm(p=>({...p,city:v}))} options={CITIES} placeholder="اختر"/></Field><Field label="الحي"><Input value={form.district} onChange={v=>setForm(p=>({...p,district:v}))}/></Field><Field label="السعة"><Input value={form.capacity} onChange={v=>setForm(p=>({...p,capacity:v}))} type="number"/></Field><Field label="الإمام"><Input value={form.imam} onChange={v=>setForm(p=>({...p,imam:v}))}/></Field></div><Field label="الخدمات"><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{SERVICES_LIST.map(s=><button key={s} onClick={()=>toggleSvc(s)} style={{padding:"5px 13px",borderRadius:18,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:form.services.includes(s)?C.primary:C.borderL,color:form.services.includes(s)?C.white:C.text2,border:"none"}}>{s}</button>)}</div></Field><div style={{display:"flex",gap:10}}><Btn onClick={save} disabled={!form.name||!form.city||!form.type}>{editModal?"تحديث":"حفظ"}</Btn><Btn variant="secondary" onClick={()=>{setModal(false);setEditModal(null);setForm(emptyForm);}}>إلغاء</Btn></div></>;

  if(sel){return<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <button onClick={()=>{setSel(null);setDetailTab("info");}} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.primary}}>→</button>
      <h2 style={{margin:0,fontSize:20,fontWeight:700,flex:1}}>{sel.name}</h2>
      <Badge text={sel.status} color={stC(sel.status)}/><Badge text={sel.device} color={dvC(sel.device)}/>
      <Btn small onClick={()=>openEdit(sel)} icon="✏️">تعديل</Btn>
      <Btn small variant="danger" onClick={()=>setDelConfirm(sel)}>حذف</Btn>
    </div>
    <Tabs tabs={[{id:"info",label:"البيانات"},{id:"services",label:"الخدمات"},{id:"device",label:"الأجهزة"}]} active={detailTab} onChange={setDetailTab}/>
    {detailTab==="info"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Card title="بيانات المسجد"><div style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:"10px 14px",fontSize:13.5}}>{[["النوع",sel.type],["المدينة",sel.city],["الحي",sel.district],["السعة",`${sel.capacity} مصلي`],["الإمام",sel.imam],["الحالة",sel.status]].map(([l,v],i)=><React.Fragment key={i}><span style={{color:C.text2,fontWeight:600}}>{l}</span><span>{v}</span></React.Fragment>)}</div></Card><Card title="إحصائيات"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div style={{textAlign:"center",padding:14,background:C.primaryLight,borderRadius:10}}><div style={{fontSize:24,fontWeight:700}}>{sel.services.length}</div><div style={{fontSize:12,color:C.text2}}>خدمات</div></div><div style={{textAlign:"center",padding:14,background:C.infoLight,borderRadius:10}}><div style={{fontSize:24,fontWeight:700}}>{sel.capacity}</div><div style={{fontSize:12,color:C.text2}}>السعة</div></div></div></Card></div>}
    {detailTab==="services"&&<Card title="الخدمات"><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{sel.services.length?sel.services.map((s,i)=><Badge key={i} text={s} color="green"/>):<span style={{color:C.text3}}>لا توجد خدمات</span>}</div></Card>}
    {detailTab==="device"&&<Card title="نظام الصوت"><div style={{display:"flex",flexDirection:"column",gap:10}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:12,height:12,borderRadius:"50%",background:sel.device==="متصل"?"#27ae60":sel.device==="غير متصل"?C.danger:C.warn}}/><span style={{fontWeight:600}}>{sel.device}</span></div><div style={{fontSize:13,color:C.text2}}>آخر Heartbeat: قبل ٣ دقائق</div><div style={{fontSize:13,color:C.text2}}>إصدار: v2.1.4</div><div style={{fontSize:13,color:C.text2}}>الجدول المحلي: محدّث</div></div></Card>}
    <Confirm open={!!delConfirm} onClose={()=>setDelConfirm(null)} onOk={del} title="حذف المسجد" msg={`هل أنت متأكد من حذف "${delConfirm?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}/>
    <Modal open={!!editModal} onClose={()=>{setEditModal(null);setForm(emptyForm);}} title="تعديل المسجد" width={620}><MosqueForm/></Modal>
  </div>;}

  return<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>إدارة المساجد</h2><div style={{display:"flex",gap:8}}><Btn small variant="ghost" onClick={()=>exportCSV([{label:"الاسم",csvKey:"name"},{label:"النوع",csvKey:"type"},{label:"المدينة",csvKey:"city"},{label:"الحي",csvKey:"district"},{label:"السعة",csvKey:"capacity"},{label:"الإمام",csvKey:"imam"},{label:"الحالة",csvKey:"status"}],mosques,"mosques")}>تصدير CSV</Btn><Btn icon="+" onClick={()=>setModal(true)}>إضافة مسجد</Btn></div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}><Stat icon="🕌" label="الإجمالي" value={mosques.length} bg={C.primaryLight}/><Stat icon="✅" label="نشط" value={mosques.filter(m=>m.status==="نشط").length} bg="#e8f5f0"/><Stat icon="🔧" label="صيانة" value={mosques.filter(m=>m.status==="صيانة").length} bg={C.warnLight}/><Stat icon="⏸️" label="مغلق" value={mosques.filter(m=>m.status==="مغلق مؤقتاً").length} bg={C.dangerLight}/></div>
    <Card title="قائمة المساجد" action={<SearchBar value={search} onChange={setSearch} placeholder="بحث بالاسم أو المدينة..."/>} noPad>
      <Table cols={[{label:"المسجد",render:r=><span style={{fontWeight:600}}>{r.name}</span>},{label:"النوع",key:"type"},{label:"المدينة",key:"city"},{label:"الحي",key:"district"},{label:"السعة",key:"capacity"},{label:"الإمام",key:"imam"},{label:"الحالة",render:r=><Badge text={r.status} color={stC(r.status)}/>},{label:"الجهاز",render:r=><Badge text={r.device} color={dvC(r.device)}/>}]} rows={filtered} onRow={setSel}/>
    </Card>
    <Modal open={modal} onClose={()=>{setModal(false);setForm(emptyForm);}} title="إضافة مسجد جديد" width={620}><MosqueForm/></Modal>
  </div>;
}

// ═══ MAINTENANCE ═══
function MaintenancePage({tickets,setTickets,mosques,toast}){
  const[search,setSearch]=useState("");const[modal,setModal]=useState(false);const[filter,setFilter]=useState("الكل");const[selected,setSelected]=useState([]);const[assignModal,setAssignModal]=useState(null);const[assignTeam,setAssignTeam]=useState("");
  const form0={mosque:"",type:"",priority:"متوسطة",notes:""};const[form,setForm]=useState(form0);
  const filtered=tickets.filter(t=>{if(filter!=="الكل"&&t.status!==filter)return false;return t.mosque.includes(search)||t.type.includes(search)||t.id.includes(search);});
  const prC=p=>p==="عاجلة"?"red":p==="عالية"?"orange":p==="متوسطة"?"blue":"gray";const stC=s=>s==="مكتملة"?"green":s==="قيد المعالجة"?"blue":"gray";
  const add=()=>{if(!form.mosque||!form.type)return;const id=`TK-${String(tickets.length+41).padStart(4,"0")}`;setTickets(p=>[...p,{id,mosque:form.mosque,type:form.type,priority:form.priority,status:"جديدة",date:new Date().toISOString().split("T")[0],assignee:"",notes:form.notes}]);setForm(form0);setModal(false);toast(`تم إنشاء ${id} ✓`,"success");};
  const close=t=>{setTickets(p=>p.map(x=>x.id===t.id?{...x,status:"مكتملة"}:x));toast(`تم إغلاق ${t.id} ✓`,"success");};
  const assign=()=>{if(!assignTeam||!assignModal)return;setTickets(p=>p.map(x=>x.id===assignModal.id?{...x,assignee:assignTeam,status:"قيد المعالجة"}:x));setAssignModal(null);setAssignTeam("");toast("تم تعيين الفريق ✓","success");};
  const bulkClose=()=>{const ids=selected.map(i=>filtered[i]?.id).filter(Boolean);setTickets(p=>p.map(t=>ids.includes(t.id)?{...t,status:"مكتملة"}:t));setSelected([]);toast(`تم إغلاق ${ids.length} تذاكر ✓`,"success");};

  return<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>الصيانة والنظافة</h2><div style={{display:"flex",gap:8}}><Btn small variant="ghost" onClick={()=>exportCSV([{label:"الرقم",csvKey:"id"},{label:"المسجد",csvKey:"mosque"},{label:"النوع",csvKey:"type"},{label:"الأولوية",csvKey:"priority"},{label:"الحالة",csvKey:"status"},{label:"المسؤول",csvKey:"assignee"},{label:"التاريخ",csvKey:"date"}],tickets,"maintenance")}>تصدير CSV</Btn><Btn icon="+" onClick={()=>setModal(true)}>تذكرة جديدة</Btn></div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}><Stat icon="🔧" label="مفتوحة" value={tickets.filter(t=>t.status!=="مكتملة").length} bg={C.warnLight}/><Stat icon="🚨" label="عاجلة" value={tickets.filter(t=>t.priority==="عاجلة"&&t.status!=="مكتملة").length} bg={C.dangerLight}/><Stat icon="✅" label="مكتملة" value={tickets.filter(t=>t.status==="مكتملة").length} bg="#e8f5f0"/><Stat icon="⏱️" label="متوسط الاستجابة" value="٤.٢ س" bg={C.infoLight}/></div>
    {selected.length>0&&<div style={{background:C.primaryLight,borderRadius:10,padding:"10px 16px",display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:13,fontWeight:600}}>{selected.length} محدد</span><Btn small onClick={bulkClose}>إغلاق المحدد</Btn><Btn small variant="ghost" onClick={()=>setSelected([])}>إلغاء التحديد</Btn></div>}
    <Card title="التذاكر" action={<div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{display:"flex",gap:3}}>{["الكل","جديدة","قيد المعالجة","مكتملة"].map(s=><button key={s} onClick={()=>{setFilter(s);setSelected([]);}} style={{padding:"4px 11px",borderRadius:14,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:filter===s?C.primary:C.borderL,color:filter===s?C.white:C.text2}}>{s}</button>)}</div><SearchBar value={search} onChange={setSearch}/></div>} noPad>
      <Table cols={[
        {label:"الرقم",render:r=><span style={{fontWeight:700,color:C.primary}}>{r.id}</span>},{label:"المسجد",render:r=>r.mosque},{label:"النوع",render:r=>r.type},
        {label:"الأولوية",render:r=><Badge text={r.priority} color={prC(r.priority)}/>},{label:"الحالة",render:r=><Badge text={r.status} color={stC(r.status)}/>},
        {label:"المسؤول",render:r=>r.assignee||<button onClick={e=>{e.stopPropagation();setAssignModal(r);}} style={{background:"none",border:`1px dashed ${C.primary}`,borderRadius:6,padding:"3px 10px",fontSize:11,color:C.primary,cursor:"pointer",fontFamily:"inherit"}}>تعيين</button>},
        {label:"التاريخ",render:r=>r.date},
        {label:"إجراء",render:r=>r.status!=="مكتملة"?<Btn small variant="secondary" onClick={e=>{e.stopPropagation();close(r);}}>إغلاق</Btn>:<span style={{color:C.text3,fontSize:12}}>—</span>},
      ]} rows={filtered} selectable selected={selected} onSelect={setSelected}/>
    </Card>
    <Modal open={modal} onClose={()=>setModal(false)} title="تذكرة جديدة"><Field label="المسجد" req><Select value={form.mosque} onChange={v=>setForm(p=>({...p,mosque:v}))} options={mosques.map(m=>m.name)} placeholder="اختر"/></Field><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}><Field label="النوع" req><Select value={form.type} onChange={v=>setForm(p=>({...p,type:v}))} options={TICKET_TYPES} placeholder="اختر"/></Field><Field label="الأولوية"><Select value={form.priority} onChange={v=>setForm(p=>({...p,priority:v}))} options={PRIORITIES}/></Field></div><Field label="ملاحظات"><Textarea value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))}/></Field><div style={{display:"flex",gap:10}}><Btn onClick={add} disabled={!form.mosque||!form.type}>إنشاء</Btn><Btn variant="secondary" onClick={()=>setModal(false)}>إلغاء</Btn></div></Modal>
    <Modal open={!!assignModal} onClose={()=>setAssignModal(null)} title={`تعيين فريق — ${assignModal?.id||""}`} width={400}><Field label="الفريق المسؤول" req><Select value={assignTeam} onChange={setAssignTeam} options={TEAMS} placeholder="اختر الفريق"/></Field><div style={{display:"flex",gap:10}}><Btn onClick={assign} disabled={!assignTeam}>تعيين</Btn><Btn variant="secondary" onClick={()=>setAssignModal(null)}>إلغاء</Btn></div></Modal>
  </div>;
}

// ═══ COMPLAINTS ═══
function ComplaintsPage({complaints,setComplaints,mosques,toast}){
  const[modal,setModal]=useState(false);const[detail,setDetail]=useState(null);const form0={mosque:"",type:"",desc:"",source:"مشرف"};const[form,setForm]=useState(form0);
  const add=()=>{if(!form.mosque||!form.type)return;const id=`SH-${String(complaints.length+101).padStart(4,"0")}`;setComplaints(p=>[...p,{id,mosque:form.mosque,type:form.type,priority:"متوسطة",status:"جديدة",date:new Date().toISOString().split("T")[0],source:form.source,desc:form.desc,history:[{date:"اليوم",action:"تم استلام البلاغ",by:"النظام"}]}]);setForm(form0);setModal(false);toast(`تم تسجيل ${id} ✓`,"success");};
  const resolve=c=>{setComplaints(p=>p.map(x=>x.id===c.id?{...x,status:"تم الحل",history:[...x.history,{date:"اليوم",action:"تم الحل",by:"أحمد العمري"}]}:x));if(detail?.id===c.id)setDetail({...c,status:"تم الحل",history:[...c.history,{date:"اليوم",action:"تم الحل",by:"أحمد العمري"}]});toast(`تم حل ${c.id} ✓`,"success");};

  if(detail){return<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={()=>setDetail(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.primary}}>→</button><h2 style={{margin:0,fontSize:20,fontWeight:700}}>شكوى {detail.id}</h2><Badge text={detail.status} color={detail.status==="تم الحل"?"green":detail.status==="جديدة"?"red":"orange"}/></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card title="تفاصيل الشكوى"><div style={{display:"grid",gridTemplateColumns:"90px 1fr",gap:"10px 12px",fontSize:13.5}}>{[["المسجد",detail.mosque],["النوع",detail.type],["المصدر",detail.source],["الأولوية",detail.priority],["التاريخ",detail.date]].map(([l,v],i)=><React.Fragment key={i}><span style={{color:C.text2,fontWeight:600}}>{l}</span><span>{v}</span></React.Fragment>)}</div><div style={{marginTop:14,padding:12,background:"#fafaf8",borderRadius:10,fontSize:13,lineHeight:1.8}}>{detail.desc}</div>{detail.status!=="تم الحل"&&<div style={{marginTop:14}}><Btn onClick={()=>resolve(detail)}>حل الشكوى ✓</Btn></div>}</Card>
      <Card title="سجل المتابعة"><div style={{position:"relative",paddingRight:20}}>{detail.history?.map((h,i)=><div key={i} style={{display:"flex",gap:12,marginBottom:16,position:"relative"}}><div style={{width:12,height:12,borderRadius:"50%",background:i===detail.history.length-1?C.primary:C.border,border:`2px solid ${C.card}`,flexShrink:0,marginTop:3,zIndex:1}}/>{i<detail.history.length-1&&<div style={{position:"absolute",right:25,top:15,width:2,height:"calc(100% + 4px)",background:C.borderL}}/>}<div><div style={{fontSize:13,fontWeight:600}}>{h.action}</div><div style={{fontSize:11.5,color:C.text3}}>{h.date} — {h.by}</div></div></div>)}</div></Card>
    </div>
  </div>;}

  return<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>الشكاوى والبلاغات</h2><div style={{display:"flex",gap:8}}><Btn small variant="ghost" onClick={()=>exportCSV([{label:"الرقم",csvKey:"id"},{label:"المسجد",csvKey:"mosque"},{label:"النوع",csvKey:"type"},{label:"الحالة",csvKey:"status"},{label:"المصدر",csvKey:"source"},{label:"التاريخ",csvKey:"date"}],complaints,"complaints")}>تصدير CSV</Btn><Btn icon="+" onClick={()=>setModal(true)}>شكوى جديدة</Btn></div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}><Stat icon="📋" label="جديدة" value={complaints.filter(c=>c.status==="جديدة").length} bg={C.dangerLight}/><Stat icon="🔄" label="قيد المعالجة" value={complaints.filter(c=>!["جديدة","تم الحل"].includes(c.status)).length} bg={C.warnLight}/><Stat icon="✅" label="تم حلها" value={complaints.filter(c=>c.status==="تم الحل").length} bg="#e8f5f0"/></div>
    <Card title="الشكاوى" noPad><Table cols={[{label:"الرقم",render:r=><span style={{fontWeight:700,color:C.primary}}>{r.id}</span>},{label:"المسجد",render:r=>r.mosque},{label:"النوع",render:r=>r.type},{label:"الوصف",render:r=><span style={{fontSize:12,color:C.text2,maxWidth:160,display:"inline-block",overflow:"hidden",textOverflow:"ellipsis"}}>{r.desc}</span>},{label:"المصدر",render:r=><Badge text={r.source} color={r.source==="جمهور"?"gold":"gray"}/>},{label:"الحالة",render:r=><Badge text={r.status} color={r.status==="تم الحل"?"green":r.status==="جديدة"?"red":"orange"}/>},{label:"إجراء",render:r=>r.status!=="تم الحل"?<Btn small variant="secondary" onClick={e=>{e.stopPropagation();resolve(r);}}>حل</Btn>:<span style={{color:C.text3,fontSize:12}}>—</span>}]} rows={complaints} onRow={setDetail}/></Card>
    <Modal open={modal} onClose={()=>setModal(false)} title="تسجيل شكوى"><Field label="المسجد" req><Select value={form.mosque} onChange={v=>setForm(p=>({...p,mosque:v}))} options={mosques.map(m=>m.name)} placeholder="اختر"/></Field><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}><Field label="النوع" req><Select value={form.type} onChange={v=>setForm(p=>({...p,type:v}))} options={COMPLAINT_TYPES} placeholder="اختر"/></Field><Field label="المصدر"><Select value={form.source} onChange={v=>setForm(p=>({...p,source:v}))} options={["مشرف","جمهور"]}/></Field></div><Field label="الوصف"><Textarea value={form.desc} onChange={v=>setForm(p=>({...p,desc:v}))}/></Field><div style={{display:"flex",gap:10}}><Btn onClick={add} disabled={!form.mosque||!form.type}>تسجيل</Btn><Btn variant="secondary" onClick={()=>setModal(false)}>إلغاء</Btn></div></Modal>
  </div>;
}

// ═══ KHUTBAH ═══
function KhutbahPage({khutbahs,setKhutbahs,toast}){
  const[modal,setModal]=useState(false);const[view,setView]=useState(null);const form0={title:"",date:"",content:"",scope:"كل المساجد"};const[form,setForm]=useState(form0);
  const add=()=>{if(!form.title||!form.date)return;setKhutbahs(p=>[...p,{id:Date.now(),title:form.title,date:form.date,status:"مسودة",viewed:0,total:50,recordings:0,content:form.content}]);setForm(form0);setModal(false);toast("تم إنشاء الخطبة ✓","success");};
  const send=k=>{setKhutbahs(p=>p.map(x=>x.id===k.id?{...x,status:"تم الإرسال"}:x));setView(null);toast("تم إرسال الخطبة ✓","success");};
  if(view){return<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={()=>setView(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.primary}}>→</button><h2 style={{margin:0,fontSize:20,fontWeight:700}}>{view.title}</h2><Badge text={view.status} color={view.status==="تم الإرسال"?"green":view.status==="مسودة"?"gray":"blue"}/></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card title="تفاصيل"><div style={{display:"grid",gridTemplateColumns:"90px 1fr",gap:"10px 12px",fontSize:13.5}}>{[["التاريخ",view.date],["الحالة",view.status],["الاطلاع",`${view.viewed}/${view.total}`],["التسجيلات",`${view.recordings}/${view.total}`]].map(([l,v],i)=><React.Fragment key={i}><span style={{color:C.text2,fontWeight:600}}>{l}</span><span>{v}</span></React.Fragment>)}</div>{view.status==="مسودة"&&<div style={{marginTop:14}}><Btn onClick={()=>send(view)}>إرسال للأئمة</Btn></div>}</Card>
      <Card title="متابعة الالتزام"><div style={{marginBottom:12}}><Progress val={view.viewed} max={view.total}/></div>{[{name:"الشيخ عبدالله المحمد",st:"اطلع ✓",c:"green"},{name:"الشيخ خالد العتيبي",st:"اطلع ✓",c:"green"},{name:"الشيخ سعد الغامدي",st:"لم يطلع",c:"red"},{name:"الشيخ أحمد الشهري",st:"اطلع + تسجيل",c:"blue"}].map((im,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.borderL}`,fontSize:13}}><span style={{fontWeight:600}}>{im.name}</span><Badge text={im.st} color={im.c}/></div>)}</Card>
    </div></div>;}
  return<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>إدارة الخطب</h2><Btn icon="+" onClick={()=>setModal(true)}>إنشاء خطبة</Btn></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}><Stat icon="📜" label="هذا الشهر" value={khutbahs.length} bg={C.accentLight}/><Stat icon="👁️" label="نسبة الاطلاع" value="٨٤%" bg={C.primaryLight}/><Stat icon="🎙️" label="تسجيلات" value={khutbahs.reduce((s,k)=>s+k.recordings,0)} bg={C.infoLight}/></div>
    <Card title="قائمة الخطب" noPad><Table cols={[{label:"العنوان",render:r=><span style={{fontWeight:600}}>{r.title}</span>},{label:"التاريخ",render:r=>r.date},{label:"الحالة",render:r=><Badge text={r.status} color={r.status==="تم الإرسال"?"green":r.status==="مسودة"?"gray":"blue"}/>},{label:"الاطلاع",render:r=><span>{r.viewed}/{r.total}</span>},{label:"النسبة",render:r=><Progress val={r.viewed} max={r.total}/>},{label:"التسجيلات",render:r=><span>{r.recordings}/{r.total}</span>}]} rows={khutbahs} onRow={setView}/></Card>
    <Modal open={modal} onClose={()=>setModal(false)} title="إنشاء خطبة" width={600}><Field label="العنوان" req><Input value={form.title} onChange={v=>setForm(p=>({...p,title:v}))}/></Field><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}><Field label="التاريخ" req><Input type="date" value={form.date} onChange={v=>setForm(p=>({...p,date:v}))}/></Field><Field label="النطاق"><Select value={form.scope} onChange={v=>setForm(p=>({...p,scope:v}))} options={["كل المساجد","منطقة الرياض","جدة","مساجد محددة"]}/></Field></div><Field label="المحتوى"><Textarea value={form.content} onChange={v=>setForm(p=>({...p,content:v}))} rows={5}/></Field><div style={{display:"flex",gap:10}}><Btn onClick={add} disabled={!form.title||!form.date}>حفظ كمسودة</Btn><Btn variant="secondary" onClick={()=>setModal(false)}>إلغاء</Btn></div></Modal>
  </div>;
}

// ═══ ADHAN ═══
function AdhanPage({toast}){
  const[tab,setTab]=useState("schedule");
  const[uploadModal,setUploadModal]=useState(false);
  const[uploadForm,setUploadForm]=useState({name:"",muezzin:"",type:"أذان عام"});
  const[uploadedFile,setUploadedFile]=useState(null);
  const[playing,setPlaying]=useState(null);
  const[progress,setProgress]=useState(0);
  const[voices,setVoices]=useState([
    {id:1,name:"أذان الحرم المكي ١",muezzin:"الشيخ السديس",type:"أذان عام",duration:"٤:١٢",status:"معتمد",baseFreq:220,scale:[0,1,4,5,7,8,11,12]},
    {id:2,name:"أذان الحرم المكي ٢",muezzin:"الشيخ علي الملا",type:"أذان عام",duration:"٤:٣٥",status:"معتمد",baseFreq:196,scale:[0,2,3,5,7,9,10,12]},
    {id:3,name:"أذان الفجر",muezzin:"الشيخ المعيقلي",type:"أذان فجر",duration:"٤:٤٨",status:"معتمد",baseFreq:185,scale:[0,1,3,5,7,8,10,12]},
    {id:4,name:"إقامة ١",muezzin:"الشيخ السديس",type:"إقامة",duration:"٠:٤٥",status:"معتمد",baseFreq:262,scale:[0,2,4,5,7,9,11,12]},
    {id:5,name:"أذان تجريبي",muezzin:"تجريبي",type:"تجريبي",duration:"٤:٠٠",status:"قيد المراجعة",baseFreq:240,scale:[0,2,3,5,7,9,10,12]},
  ]);
  const fileRef=useRef(null);
  const audioRef=useRef(null);
  const oscRef=useRef(null);
  const noteTimerRef=useRef(null);
  const progressTimerRef=useRef(null);
  const noteIdxRef=useRef(0);

  const playVoice=(v)=>{
    if(playing===v.id){stopVoice();return;}
    stopVoice();
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const gain=ctx.createGain();gain.gain.value=0.25;gain.connect(ctx.destination);
    audioRef.current={ctx,gain};
    setPlaying(v.id);setProgress(0);noteIdxRef.current=0;
    const playNote=()=>{
      if(oscRef.current)try{oscRef.current.stop();}catch(e){}
      const idx=noteIdxRef.current;
      const s=v.scale||[0,2,4,5,7,9,11,12];
      const semi=s[idx%s.length];
      const freq=(v.baseFreq||220)*Math.pow(2,semi/12);
      const osc=ctx.createOscillator();osc.type="sine";
      osc.frequency.setValueAtTime(freq,ctx.currentTime);
      const env=ctx.createGain();
      env.gain.setValueAtTime(0,ctx.currentTime);
      env.gain.linearRampToValueAtTime(0.22,ctx.currentTime+0.12);
      env.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+1.1);
      osc.connect(env);env.connect(gain);
      osc.start(ctx.currentTime);osc.stop(ctx.currentTime+1.2);
      oscRef.current=osc;noteIdxRef.current++;
    };
    playNote();
    noteTimerRef.current=setInterval(playNote,1300);
    progressTimerRef.current=setInterval(()=>{
      setProgress(p=>{if(p>=100){stopVoice();return 0;}return p+0.5;});
    },200);
  };
  const stopVoice=()=>{
    setPlaying(null);setProgress(0);
    if(noteTimerRef.current)clearInterval(noteTimerRef.current);
    if(progressTimerRef.current)clearInterval(progressTimerRef.current);
    if(oscRef.current)try{oscRef.current.stop();}catch(e){}
    if(audioRef.current?.ctx)try{audioRef.current.ctx.close();}catch(e){}
  };
  useEffect(()=>()=>stopVoice(),[]);

  const handleFileSelect=()=>{
    setUploadedFile({name:"adhan_new.mp3",size:"3.2 MB",duration:"٤:٢٥"});
    toast("تم اختيار الملف ✓","success");
  };
  const submitUpload=()=>{
    if(!uploadForm.name||!uploadForm.muezzin||!uploadedFile)return;
    setVoices(p=>[...p,{id:Date.now(),name:uploadForm.name,muezzin:uploadForm.muezzin,type:uploadForm.type,duration:uploadedFile.duration,status:"قيد المراجعة",baseFreq:220,scale:[0,1,4,5,7,8,11,12]}]);
    setUploadModal(false);setUploadForm({name:"",muezzin:"",type:"أذان عام"});setUploadedFile(null);
    toast("تم رفع الصوت — بانتظار الاعتماد ✓","success");
  };
  const approve=v=>{setVoices(p=>p.map(x=>x.id===v.id?{...x,status:"معتمد"}:x));toast(`تم اعتماد "${v.name}" ✓`,"success");};
  const reject=v=>{setVoices(p=>p.filter(x=>x.id!==v.id));toast(`تم رفض "${v.name}"`,"success");};

  return<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>الأذان والإقامة</h2><Btn icon="🎵" onClick={()=>setUploadModal(true)}>رفع صوت جديد</Btn></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}><Stat icon="🎵" label="أصوات معتمدة" value={voices.filter(v=>v.status==="معتمد").length} bg={C.primaryLight}/><Stat icon="⏳" label="بانتظار الاعتماد" value={voices.filter(v=>v.status==="قيد المراجعة").length} bg={C.warnLight}/><Stat icon="✅" label="أذانات اليوم" value={`${PRAYERS.filter(p=>p.done).length}/${PRAYERS.length}`} bg="#e8f5f0"/><Stat icon="⚠️" label="تنبيه فشل" value="١" bg={C.dangerLight}/></div>
    <Tabs tabs={[{id:"schedule",label:"جدول اليوم"},{id:"library",label:"مكتبة الأصوات"},{id:"volume",label:"سياسة الصوت"}]} active={tab} onChange={setTab}/>
    {tab==="schedule"&&<Card title="مواقيت اليوم — تعيين الأصوات">
      <div style={{fontSize:12,color:C.text2,marginBottom:12,padding:"8px 12px",background:C.primaryLight,borderRadius:8}}>💡 الصوت المعيّن هنا سيعمل تلقائياً في الموقع العام عند حلول وقت الصلاة</div>
      {PRAYERS.map((p,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"65px 85px 85px 70px 1fr 100px 90px",alignItems:"center",padding:"10px 12px",borderRadius:9,background:!p.done?C.primaryLight:"#fafaf8",gap:6,fontSize:13,marginBottom:4}}>
        <span style={{fontWeight:700}}>{p.name}</span>
        <span>الأذان: {p.adhan}</span>
        <span>الإقامة: {p.iqama}</span>
        <span>🔊 {p.vol}%</span>
        <select defaultValue="أذان الحرم المكي ١" style={{padding:"5px 8px",borderRadius:7,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.white,cursor:"pointer"}} onChange={()=>toast("تم تغيير صوت "+p.name+" ✓","success")}>
          {voices.map(v=><option key={v.id} value={v.name}>{v.name} — {v.muezzin}</option>)}
        </select>
        <Badge text={p.done?"تم التشغيل":"مجدول"} color={p.done?"green":"blue"}/>
        <button onClick={()=>{playVoice({id:`prayer-${i}`,baseFreq:220,scale:[0,1,4,5,7,8,11,12]});toast(`تم تشغيل الأذان — ${p.name} ✓`,"success");}} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${C.primary}`,background:"transparent",color:C.primary,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{playing===`prayer-${i}`?"⏹ إيقاف":"▶ تشغيل"}</button>
      </div>)}
    </Card>}
    {tab==="library"&&<Card title={`مكتبة الأصوات (${voices.length})`} noPad>
      <Table cols={[
        {label:"",render:r=><button onClick={e=>{e.stopPropagation();playVoice(r);}} style={{width:32,height:32,borderRadius:"50%",background:playing===r.id?C.danger:C.primary,color:C.white,border:"none",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{playing===r.id?"⏹":"▶"}</button>},
        {label:"الاسم",render:r=><div><span style={{fontWeight:600,display:"block"}}>{r.name}</span>{playing===r.id&&<div style={{marginTop:4,display:"flex",alignItems:"center",gap:6}}><div style={{width:100,height:4,background:C.borderL,borderRadius:2,overflow:"hidden"}}><div style={{width:`${progress}%`,height:"100%",background:C.primary,borderRadius:2,transition:"width .2s linear"}}/></div><span style={{fontSize:10,color:C.text3}}>{Math.floor(progress*2.5/60)}:{String(Math.floor(progress*2.5)%60).padStart(2,"0")} / {r.duration}</span></div>}</div>},
        {label:"المؤذن",render:r=>r.muezzin},
        {label:"النوع",render:r=><Badge text={r.type} color="blue"/>},
        {label:"المدة",render:r=>r.duration},
        {label:"الحالة",render:r=><Badge text={r.status} color={r.status==="معتمد"?"green":"orange"}/>},
        {label:"إجراء",render:r=>r.status==="قيد المراجعة"?<div style={{display:"flex",gap:4}}><Btn small onClick={e=>{e.stopPropagation();approve(r);}}>اعتماد</Btn><Btn small variant="danger" onClick={e=>{e.stopPropagation();reject(r);}}>رفض</Btn></div>:<span style={{fontSize:12,color:C.text3}}>—</span>},
      ]} rows={voices}/>
    </Card>}
    {tab==="volume"&&<Card title="قواعد الصوت">{[{s:"مسجد منفرد",a:"Medium/High",c:"green"},{s:"مساجد قريبة",a:"Low/Medium",c:"orange"},{s:"شكوى متكررة",a:"مراجعة تلقائية",c:"red"},{s:"فشل إرسال",a:"آخر معتمد",c:"blue"},{s:"تعديل يدوي",a:"صلاحية عالية",c:"gold"}].map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<4?`1px solid ${C.borderL}`:"none"}}><span style={{fontSize:13}}>{r.s}</span><Badge text={r.a} color={r.c}/></div>)}</Card>}

    {/* Upload Voice Modal */}
    <Modal open={uploadModal} onClose={()=>{setUploadModal(false);setUploadedFile(null);setUploadForm({name:"",muezzin:"",type:"أذان عام"});}} title="رفع صوت أذان جديد" width={560}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
        <Field label="اسم الصوت" req><Input value={uploadForm.name} onChange={v=>setUploadForm(p=>({...p,name:v}))} placeholder="مثال: أذان الفجر ٣"/></Field>
        <Field label="المؤذن" req><Input value={uploadForm.muezzin} onChange={v=>setUploadForm(p=>({...p,muezzin:v}))} placeholder="اسم المؤذن"/></Field>
      </div>
      <Field label="النوع"><Select value={uploadForm.type} onChange={v=>setUploadForm(p=>({...p,type:v}))} options={["أذان عام","أذان فجر","إقامة","تجريبي"]}/></Field>
      <Field label="ملف الصوت" req>
        <div onClick={handleFileSelect} style={{padding:uploadedFile?"16px":"32px",border:`2px dashed ${uploadedFile?C.primary:C.border}`,borderRadius:14,textAlign:"center",cursor:"pointer",background:uploadedFile?C.primaryLight+"44":"#fafaf8",transition:"all .2s"}}>
          {uploadedFile?<div><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:C.primary,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎵</div>
            <div style={{textAlign:"right"}}><div style={{fontWeight:700,fontSize:14}}>{uploadedFile.name}</div><div style={{fontSize:12,color:C.text2}}>{uploadedFile.size} · {uploadedFile.duration}</div></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
            <button onClick={e=>{e.stopPropagation();playVoice({id:"preview",baseFreq:220,scale:[0,1,4,5,7,8,11,12]});}} style={{width:32,height:32,borderRadius:"50%",background:playing==="preview"?C.danger:C.primary,color:C.white,border:"none",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{playing==="preview"?"⏹":"▶"}</button>
            <div style={{flex:1,height:4,background:C.borderL,borderRadius:2,overflow:"hidden"}}><div style={{width:playing==="preview"?`${progress}%`:"0%",height:"100%",background:C.primary,borderRadius:2,transition:"width .2s linear"}}/></div>
            <span style={{fontSize:11,color:C.text3}}>{uploadedFile.duration}</span>
          </div></div>
          :<div><div style={{fontSize:28,marginBottom:8}}>📁</div><div style={{fontSize:14,color:C.text2,marginBottom:4}}>انقر لاختيار ملف صوتي</div><div style={{fontSize:12,color:C.text3}}>MP3, WAV, M4A — حد أقصى 20 MB</div></div>}
        </div>
      </Field>
      <div style={{display:"flex",gap:10,marginTop:8}}><Btn onClick={submitUpload} disabled={!uploadForm.name||!uploadForm.muezzin||!uploadedFile}>رفع وإرسال للاعتماد</Btn><Btn variant="secondary" onClick={()=>{setUploadModal(false);setUploadedFile(null);}}>إلغاء</Btn></div>
    </Modal>
  </div>;
}

// ═══ DONATIONS ═══
function DonationsPage({donations,setDonations,toast}){const[modal,setModal]=useState(false);const form0={project:"",type:"",target:""};const[form,setForm]=useState(form0);const add=()=>{if(!form.project||!form.target)return;setDonations(p=>[...p,{id:Date.now(),project:form.project,type:form.type,target:Number(form.target),collected:0,status:"نشط",donors:0}]);setForm(form0);setModal(false);toast("تم إنشاء المشروع ✓","success");};const total=donations.reduce((s,d)=>s+d.collected,0);
  return<div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>التبرعات</h2><Btn icon="+" onClick={()=>setModal(true)}>مشروع جديد</Btn></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}><Stat icon="💰" label="المحصل" value={`${(total/1e6).toFixed(2)} م`} bg="#f0e6f6"/><Stat icon="📦" label="نشطة" value={donations.filter(d=>d.status==="نشط").length} bg={C.primaryLight}/><Stat icon="👥" label="متبرعون" value={donations.reduce((s,d)=>s+d.donors,0)} bg={C.infoLight}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>{donations.map(d=><Card key={d.id}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{fontWeight:700,fontSize:15}}>{d.project}</div><div style={{fontSize:12,color:C.text2,marginTop:2}}>{d.type} · {d.donors} متبرع</div></div><Badge text={d.status} color={d.status==="مكتمل"?"green":"blue"}/></div><Progress val={d.collected} max={d.target} color={d.status==="مكتمل"?"#27ae60":C.accent}/><div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.text2,marginTop:5}}><span style={{fontWeight:700,color:C.text}}>{(d.collected/1e6).toFixed(2)} م</span><span>الهدف: {(d.target/1e6).toFixed(2)} م</span></div></Card>)}</div><Modal open={modal} onClose={()=>setModal(false)} title="مشروع تبرع جديد"><Field label="اسم المشروع" req><Input value={form.project} onChange={v=>setForm(p=>({...p,project:v}))}/></Field><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}><Field label="النوع" req><Select value={form.type} onChange={v=>setForm(p=>({...p,type:v}))} options={["بناء","صيانة","تحفيظ","طباعة","تبرع عام"]} placeholder="اختر"/></Field><Field label="المبلغ المستهدف" req><Input value={form.target} onChange={v=>setForm(p=>({...p,target:v}))} type="number"/></Field></div><div style={{display:"flex",gap:10}}><Btn onClick={add} disabled={!form.project||!form.target}>إنشاء</Btn><Btn variant="secondary" onClick={()=>setModal(false)}>إلغاء</Btn></div></Modal></div>;}

// ═══ USERS ═══
function UsersPage({toast}){const[users,setUsers]=useState([{id:1,name:"أحمد العمري",role:"Super Admin",scope:"كل المناطق",status:"نشط",email:"ahmed@mosque.sa",login:"اليوم ١٠:٣٢ ص"},{id:2,name:"فهد الشمري",role:"Regional Admin",scope:"منطقة الرياض",status:"نشط",email:"fahad@mosque.sa",login:"اليوم ٩:١٥ ص"},{id:3,name:"سارة الخالدي",role:"City Admin",scope:"جدة",status:"نشط",email:"sara@mosque.sa",login:"أمس ٤:٢٠ م"},{id:4,name:"عبدالله المحمد",role:"إمام",scope:"جامع الراجحي",status:"نشط",email:"imam.a@mosque.sa",login:"اليوم ٧:٠٠ ص"},{id:5,name:"محمد الحربي",role:"مشرف مسجد",scope:"جامع البواردي",status:"نشط",email:"m.harbi@mosque.sa",login:"اليوم ٨:٤٥ ص"},{id:6,name:"ناصر القحطاني",role:"فريق صيانة",scope:"منطقة الرياض",status:"نشط",email:"nasser@mosque.sa",login:"اليوم ١١:٠٠ ص"}]);const[modal,setModal]=useState(false);const form0={name:"",email:"",role:"",scope:""};const[form,setForm]=useState(form0);const add=()=>{if(!form.name||!form.role)return;setUsers(p=>[...p,{id:Date.now(),...form,status:"نشط",login:"—"}]);setForm(form0);setModal(false);toast("تم إضافة المستخدم ✓","success");};const rC=r=>r.includes("Admin")?"blue":r==="إمام"?"green":r.includes("Compliance")?"gold":"gray";
  return<div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>المستخدمون</h2><div style={{display:"flex",gap:8}}><Btn small variant="ghost" onClick={()=>exportCSV([{label:"الاسم",csvKey:"name"},{label:"الدور",csvKey:"role"},{label:"النطاق",csvKey:"scope"},{label:"البريد",csvKey:"email"}],users,"users")}>تصدير CSV</Btn><Btn icon="+" onClick={()=>setModal(true)}>إضافة مستخدم</Btn></div></div><Card title={`المستخدمون (${users.length})`} noPad><Table cols={[{label:"الاسم",render:r=><span style={{fontWeight:600}}>{r.name}</span>},{label:"البريد",render:r=><span style={{fontSize:12,color:C.text2}}>{r.email}</span>},{label:"الدور",render:r=><Badge text={r.role} color={rC(r.role)}/>},{label:"النطاق",render:r=>r.scope},{label:"الحالة",render:r=><Badge text={r.status} color="green"/>},{label:"آخر دخول",render:r=><span style={{fontSize:12,color:C.text3}}>{r.login}</span>}]} rows={users}/></Card><Modal open={modal} onClose={()=>setModal(false)} title="إضافة مستخدم"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}><Field label="الاسم" req><Input value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/></Field><Field label="البريد"><Input value={form.email} onChange={v=>setForm(p=>({...p,email:v}))}/></Field><Field label="الدور" req><Select value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} options={ROLES} placeholder="اختر"/></Field><Field label="النطاق"><Input value={form.scope} onChange={v=>setForm(p=>({...p,scope:v}))}/></Field></div><div style={{display:"flex",gap:10}}><Btn onClick={add} disabled={!form.name||!form.role}>إضافة</Btn><Btn variant="secondary" onClick={()=>setModal(false)}>إلغاء</Btn></div></Modal></div>;}

// ═══ REPORTS ═══
function ReportsPage({mosques,tickets,complaints,donations,toast}){
  const[activeReport,setActiveReport]=useState(null);
  const reports=[{id:"mosques",title:"تقرير المساجد",icon:"🕌",bg:C.primaryLight},{id:"maintenance",title:"تقرير الصيانة",icon:"🔧",bg:C.warnLight},{id:"complaints",title:"تقرير الشكاوى",icon:"📋",bg:C.dangerLight},{id:"donations",title:"تقرير التبرعات",icon:"💰",bg:"#f0e6f6"},{id:"khutbah",title:"تقرير الخطب",icon:"📜",bg:C.accentLight},{id:"devices",title:"تقرير الأجهزة",icon:"📡",bg:C.infoLight},{id:"compliance",title:"تقرير الامتثال",icon:"🛡️",bg:C.dangerLight},{id:"summary",title:"تقرير شامل",icon:"📊",bg:C.primaryLight}];

  if(activeReport){const r=reports.find(x=>x.id===activeReport);return<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={()=>setActiveReport(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.primary}}>→</button><h2 style={{margin:0,fontSize:20,fontWeight:700}}>{r?.icon} {r?.title}</h2><Btn small variant="ghost" onClick={()=>toast("جاري التصدير...","success")}>تصدير PDF</Btn></div>
    {activeReport==="mosques"&&<><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Card title="حسب المدينة"><BarChart data={CITIES.slice(0,5).map(c=>({l:c.split(" ")[0],v:mosques.filter(m=>m.city===c).length,color:C.primary}))} height={160}/></Card><Card title="حسب النوع"><DonutChart data={[...new Set(mosques.map(m=>m.type))].map(t=>({l:t,v:mosques.filter(m=>m.type===t).length,color:t==="جامع"?C.primary:t==="مسجد"?C.info:C.accent}))}/></Card></div><Card title="قائمة المساجد" noPad><Table cols={[{label:"المسجد",render:r=><span style={{fontWeight:600}}>{r.name}</span>},{label:"المدينة",key:"city"},{label:"النوع",key:"type"},{label:"السعة",key:"capacity"},{label:"الحالة",render:r=><Badge text={r.status} color={r.status==="نشط"?"green":"orange"}/>}]} rows={mosques}/></Card></>}
    {activeReport==="maintenance"&&<><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Card title="حسب الأولوية"><DonutChart data={PRIORITIES.map(p=>({l:p,v:tickets.filter(t=>t.priority===p).length,color:p==="عاجلة"?C.danger:p==="عالية"?C.warn:p==="متوسطة"?C.info:C.text3}))}/></Card><Card title="حسب الحالة"><DonutChart data={["جديدة","قيد المعالجة","مكتملة"].map(s=>({l:s,v:tickets.filter(t=>t.status===s).length,color:s==="مكتملة"?C.primary:s==="قيد المعالجة"?C.info:C.text3}))}/></Card></div><Card title="كل التذاكر" noPad><Table cols={[{label:"الرقم",render:r=><span style={{fontWeight:700,color:C.primary}}>{r.id}</span>},{label:"المسجد",render:r=>r.mosque},{label:"النوع",render:r=>r.type},{label:"الأولوية",render:r=><Badge text={r.priority} color={r.priority==="عاجلة"?"red":"blue"}/>},{label:"الحالة",render:r=><Badge text={r.status} color={r.status==="مكتملة"?"green":"gray"}/>}]} rows={tickets}/></Card></>}
    {activeReport==="complaints"&&<Card title="كل الشكاوى" noPad><Table cols={[{label:"الرقم",render:r=><span style={{fontWeight:700,color:C.primary}}>{r.id}</span>},{label:"المسجد",render:r=>r.mosque},{label:"النوع",render:r=>r.type},{label:"الحالة",render:r=><Badge text={r.status} color={r.status==="تم الحل"?"green":"orange"}/>}]} rows={complaints}/></Card>}
    {activeReport==="donations"&&<Card title="مشاريع التبرعات" noPad><Table cols={[{label:"المشروع",render:r=><span style={{fontWeight:600}}>{r.project}</span>},{label:"النوع",render:r=>r.type},{label:"المحصل",render:r=>`${(r.collected/1e3).toFixed(0)} ألف`},{label:"الهدف",render:r=>`${(r.target/1e3).toFixed(0)} ألف`},{label:"النسبة",render:r=><Progress val={r.collected} max={r.target} color={C.accent}/>},{label:"الحالة",render:r=><Badge text={r.status} color={r.status==="مكتمل"?"green":"blue"}/>}]} rows={donations}/></Card>}
    {!["mosques","maintenance","complaints","donations"].includes(activeReport)&&<Card><div style={{textAlign:"center",padding:40,color:C.text3}}><div style={{fontSize:36,marginBottom:10}}>{r?.icon}</div><div style={{fontSize:14}}>بيانات التقرير ستكون متاحة في النسخة الكاملة</div></div></Card>}
  </div>;}

  return<div style={{display:"flex",flexDirection:"column",gap:16}}><h2 style={{margin:0,fontSize:20,fontWeight:700}}>التقارير</h2><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>{reports.map(r=><div key={r.id} onClick={()=>setActiveReport(r.id)} style={{padding:16,borderRadius:14,border:`1px solid ${C.border}`,background:C.card,cursor:"pointer",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.06)";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}><div style={{width:42,height:42,borderRadius:10,background:r.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10}}>{r.icon}</div><div style={{fontWeight:700,fontSize:13}}>{r.title}</div></div>)}</div></div>;
}

// ═══ SETTINGS ═══
function SettingsPage({toast}){
  const[iqama,setIqama]=useState({fajr:"20",dhuhr:"15",asr:"15",maghrib:"10",isha:"15"});
  const[vol,setVol]=useState({default:"70",max:"85",fajr:"65"});
  const prayerNames={fajr:"الفجر",dhuhr:"الظهر",asr:"العصر",maghrib:"المغرب",isha:"العشاء"};
  return<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <h2 style={{margin:0,fontSize:20,fontWeight:700}}>الإعدادات</h2>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card title="مدة الإقامة بعد الأذان (بالدقائق)">{Object.entries(iqama).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.borderL}`}}><span style={{fontSize:14,fontWeight:600}}>{prayerNames[k]}</span><div style={{display:"flex",alignItems:"center",gap:8}}><input type="range" min="5" max="30" value={v} onChange={e=>setIqama(p=>({...p,[k]:e.target.value}))} style={{width:120}}/><span style={{fontSize:14,fontWeight:700,color:C.primary,minWidth:30}}>{v} د</span></div></div>)}<div style={{marginTop:12}}><Btn small onClick={()=>toast("تم حفظ إعدادات الإقامة ✓","success")}>حفظ</Btn></div></Card>
      <Card title="مستوى الصوت الافتراضي (%)">{[{k:"default",l:"الافتراضي"},{k:"max",l:"الحد الأقصى"},{k:"fajr",l:"الفجر (مخفض)"}].map(({k,l})=><div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.borderL}`}}><span style={{fontSize:14,fontWeight:600}}>{l}</span><div style={{display:"flex",alignItems:"center",gap:8}}><input type="range" min="30" max="100" value={vol[k]} onChange={e=>setVol(p=>({...p,[k]:e.target.value}))} style={{width:120}}/><span style={{fontSize:14,fontWeight:700,color:C.primary,minWidth:30}}>{vol[k]}%</span></div></div>)}<div style={{marginTop:12}}><Btn small onClick={()=>toast("تم حفظ إعدادات الصوت ✓","success")}>حفظ</Btn></div></Card>
    </div>
    <Card title="إعدادات عامة">{[{l:"مصدر مواقيت الصلاة",v:"تقويم أم القرى"},{l:"المنطقة الزمنية",v:"AST (UTC+3)"},{l:"اللغة",v:"العربية"},{l:"تنبيهات البريد الإلكتروني",v:"مفعّلة"},{l:"الصيانة التلقائية",v:"تذكير كل ٣٠ يوم"}].map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<4?`1px solid ${C.borderL}`:"none",fontSize:14}}><span style={{color:C.text2,fontWeight:600}}>{s.l}</span><span>{s.v}</span></div>)}</Card>
  </div>;
}

// ═══ MAIN APP ═══
export default function App(){
  const[page,setPage]=useState("dashboard");const[collapsed,setCollapsed]=useState(false);
  const[mosques,setMosques]=useState(initMosques);const[khutbahs,setKhutbahs]=useState(initKhutbahs);
  const[tickets,setTickets]=useState(initTickets);const[complaints,setComplaints]=useState(initComplaints);
  const[donations,setDonations]=useState(initDonations);const[toastMsg,setToastMsg]=useState(null);
  const[notifOpen,setNotifOpen]=useState(false);
  const[notifs,setNotifs]=useState([{id:1,text:"جهاز جامع الملك فهد غير متصل",time:"قبل ١٥ دقيقة",read:false},{id:2,text:"تذكرة عاجلة TK-0043",time:"قبل ٣٠ دقيقة",read:false},{id:3,text:"الشيخ عبدالله أكد اطلاعه",time:"قبل ساعة",read:true}]);
  const toast=useCallback((m,t)=>setToastMsg({m,t}),[]);
  const render=()=>{switch(page){
    case"dashboard":return<Dashboard mosques={mosques} tickets={tickets} complaints={complaints} khutbahs={khutbahs} donations={donations}/>;
    case"mosques":return<MosquesPage mosques={mosques} setMosques={setMosques} toast={toast}/>;
    case"adhan":return<AdhanPage toast={toast}/>;
    case"khutbah":return<KhutbahPage khutbahs={khutbahs} setKhutbahs={setKhutbahs} toast={toast}/>;
    case"maintenance":return<MaintenancePage tickets={tickets} setTickets={setTickets} mosques={mosques} toast={toast}/>;
    case"complaints":return<ComplaintsPage complaints={complaints} setComplaints={setComplaints} mosques={mosques} toast={toast}/>;
    case"donations":return<DonationsPage donations={donations} setDonations={setDonations} toast={toast}/>;
    case"users":return<UsersPage toast={toast}/>;
    case"reports":return<ReportsPage mosques={mosques} tickets={tickets} complaints={complaints} donations={donations} toast={toast}/>;
    case"settings":return<SettingsPage toast={toast}/>;
    default:return<Dashboard mosques={mosques} tickets={tickets} complaints={complaints} khutbahs={khutbahs} donations={donations}/>;
  }};
  const unread=notifs.filter(n=>!n.read).length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return<div dir="rtl" style={{fontFamily:FONT,display:"flex",height:"100vh",background:C.bg,color:C.text,overflow:"hidden"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700;800&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
      .admin-sidebar { display: flex; }
      .admin-hamburger { display: none; }
      .admin-sidebar-overlay { display: none; }
      @media (max-width: 768px) {
        .admin-sidebar { display: none !important; }
        .admin-sidebar.mobile-open { display: flex !important; position: fixed !important; top: 0; right: 0; bottom: 0; width: 260px !important; z-index: 200; box-shadow: -4px 0 24px rgba(0,0,0,.3); }
        .admin-sidebar-overlay.mobile-open { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 199; }
        .admin-hamburger { display: flex !important; }
        .admin-main-content { padding: 14px !important; }
        .admin-header-date { display: none !important; }
        .admin-header-user-info { display: none !important; }
        .admin-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (max-width: 480px) {
        .admin-stat-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>

    {/* Mobile overlay */}
    <div className={`admin-sidebar-overlay ${mobileMenuOpen ? "mobile-open" : ""}`} onClick={() => setMobileMenuOpen(false)} />

    <aside className={`admin-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`} style={{width:collapsed&&!mobileMenuOpen?66:230,background:C.sidebar,flexDirection:"column",transition:"width .25s",flexShrink:0,overflow:"hidden"}}>
      <div style={{padding:collapsed&&!mobileMenuOpen?"16px 8px":"16px 18px",borderBottom:"1px solid rgba(255,255,255,.07)",display:"flex",alignItems:"center",gap:10,minHeight:62}}>
        <div style={{width:36,height:36,borderRadius:9,background:`linear-gradient(135deg,${C.primary},${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🕌</div>
        {(!collapsed||mobileMenuOpen)&&<div><div style={{color:"#fff",fontSize:14,fontWeight:800}}>منصة المساجد</div><div style={{color:"rgba(255,255,255,.4)",fontSize:10}}>MVP v1.0</div></div>}
      </div>
      <nav style={{flex:1,padding:"8px 6px",display:"flex",flexDirection:"column",gap:1,overflowY:"auto"}}>
        {MODULES.map(m=><button key={m.id} onClick={()=>{setPage(m.id);setMobileMenuOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:collapsed&&!mobileMenuOpen?"10px 0":"9px 13px",justifyContent:collapsed&&!mobileMenuOpen?"center":"flex-start",borderRadius:8,border:"none",background:page===m.id?C.sidebarActive:"transparent",color:page===m.id?"#fff":"rgba(255,255,255,.55)",fontSize:13,fontWeight:page===m.id?700:400,cursor:"pointer",fontFamily:"inherit",width:"100%",textAlign:"right"}} onMouseEnter={e=>{if(page!==m.id)e.currentTarget.style.background=C.sidebarHover}} onMouseLeave={e=>{if(page!==m.id)e.currentTarget.style.background="transparent"}}><span style={{fontSize:16,flexShrink:0}}>{m.icon}</span>{(!collapsed||mobileMenuOpen)&&<span>{m.label}</span>}</button>)}
      </nav>
      <button onClick={()=>{if(mobileMenuOpen){setMobileMenuOpen(false)}else{setCollapsed(!collapsed)}}} style={{padding:11,border:"none",borderTop:"1px solid rgba(255,255,255,.07)",background:"transparent",color:"rgba(255,255,255,.35)",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{mobileMenuOpen?"✕ إغلاق":collapsed?"◂":"▸ طي"}</button>
    </aside>
    <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <header style={{height:58,background:C.card,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button className="admin-hamburger" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} style={{display:"none",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:8,border:"none",background:"transparent",cursor:"pointer",fontSize:20}}>{mobileMenuOpen?"✕":"☰"}</button>
          <span style={{fontSize:16,fontWeight:700}}>{MODULES.find(m=>m.id===page)?.icon} {MODULES.find(m=>m.id===page)?.label}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span className="admin-header-date" style={{fontSize:12,color:C.text2}}>٨ يونيو ٢٠٢٦</span>
          <div style={{position:"relative"}}><button onClick={()=>setNotifOpen(!notifOpen)} style={{background:"none",border:"none",fontSize:19,cursor:"pointer",padding:3}}>🔔{unread>0&&<span style={{position:"absolute",top:-2,left:-2,width:15,height:15,borderRadius:"50%",background:C.danger,color:C.white,fontSize:9.5,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}</button>
            {notifOpen&&<div style={{position:"absolute",left:0,top:"110%",width:320,maxWidth:"90vw",background:C.card,borderRadius:14,boxShadow:"0 8px 30px rgba(0,0,0,.12)",border:`1px solid ${C.border}`,zIndex:100,overflow:"hidden"}}><div style={{padding:"10px 14px",borderBottom:`1px solid ${C.borderL}`,fontWeight:700,fontSize:13,display:"flex",justifyContent:"space-between"}}>التنبيهات<button onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))} style={{background:"none",border:"none",fontSize:11,color:C.primary,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>قراءة الكل</button></div>{notifs.map(n=><div key={n.id} style={{padding:"10px 14px",borderBottom:`1px solid ${C.borderL}`,background:n.read?"transparent":C.primaryLight+"44",cursor:"pointer"}} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}><div style={{fontSize:12.5,lineHeight:1.5}}>{n.text}</div><div style={{fontSize:10.5,color:C.text3,marginTop:2}}>{n.time}</div></div>)}</div>}
          </div>
          <div style={{width:1,height:24,background:C.border}}/>
          <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:32,height:32,borderRadius:"50%",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:C.primary}}>أ</div><div className="admin-header-user-info"><div style={{fontSize:12.5,fontWeight:600}}>أحمد العمري</div><div style={{fontSize:10,color:C.text2}}>Super Admin</div></div></div>
        </div>
      </header>
      <div className="admin-main-content" style={{flex:1,overflow:"auto",padding:22}} onClick={()=>notifOpen&&setNotifOpen(false)}>{render()}</div>
    </main>
    {toastMsg&&<Toast msg={toastMsg.m} type={toastMsg.t} onClose={()=>setToastMsg(null)}/>}
  </div>;
}
