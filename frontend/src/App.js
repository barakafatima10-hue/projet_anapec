import React, { useState, useEffect, useRef, useCallback } from "react";

const API = "https://projetanapec-production.up.railway.app/api";
const C = {
  violet:"#7B2D8B", gold:"#F5A623", white:"#fff",
  light:"#F0EBF4", border:"#E8D8EC", dark:"#4A1A57", muted:"#9B7AA8",
  green:"#2E7D32", orange:"#E65100", red:"#C62828",
  sidebar:"#3A1047", sidebarLight:"#6B2D8B",
};
const SIDEBAR_W = 230;
const MONTHS    = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const YEARS = ["2025","2026"];
const CURRENT_MONTH = 4;
const CURRENT_YEAR  = "2026";

const CATEGORIES = [
  { id:"inscription",    label:"Inscription",             color:"#7B2D8B", indicators:["Inscription des Chercheurs d'Emploi"] },
  { id:"accompagnement", label:"Accompagnement",          color:"#9B3BAD", indicators:["Entretien de Positionnement","Ateliers de recherche d'emploi"] },
  { id:"insertion",      label:"Insertions",              color:"#4A1A57", indicators:["IDMAJ (hors PI) & TAHFIZ","CIA","CDC","TAHFIZ","PCS","Insertion via Placement à l'International","Insertion via l'entreprenariat"] },
  { id:"entrepreneuriat",label:"Entrepreneuriat",         color:"#C07A10", indicators:["Accompagnement des Porteurs de Projet","Création D'Entreprises","TPE accompagnées techniquement avec renforcement des capacités","Auto Entrepreneurs appuyés","UEI promues à l'autoentrepreneuriat & appuyées à la formalisation"] },
  { id:"international",  label:"Mobilité Internationale", color:"#5B1F6A", indicators:["Nombre de candidats insérés (départ effectif)","Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)","Nombre de bénéficiaires de prestations d'accompagnement à la mobilité internationale autre que les ouvriers agricoles (ateliers, entretiens,  ..)","Nombre de candidats pré sélectionnés autres que les ouvriers agricoles","Nombre de candidats pré sélectionnés dans le cadre de recrutement des étrangers"] },
  { id:"formation",      label:"Formation",               color:"#8B6914", indicators:["TAEHIL","Formation Secteurs Emergents","Formations partenariales"] },
  { id:"employeurs",     label:"Employeurs",              color:"#3D1647", indicators:["Effectif Postes à pourvoir","Nbre d'employeurs contactés","Nbre de nouveau clients","Nbre d'employeur bénéficiaire"] }
];
const ALL_INDICATORS = CATEGORIES.flatMap(c => c.indicators.map(n => ({ name:n, category:c.id, color:c.color })));
const SHORT = {
  "Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)":"Travailleurs saisonniers",
  "Nombre de bénéficiaires de prestations d'accompagnement à la mobilité internationale autre que les ouvriers agricoles (ateliers, entretiens,  ..)":"Bénéficiaires mobilité",
  "Nombre de candidats pré sélectionnés autres que les ouvriers agricoles":"Candidats pré-sél. (autres)",
  "Nombre de candidats pré sélectionnés dans le cadre de recrutement des étrangers":"Candidats pré-sél. (étrangers)",
  "TPE accompagnées techniquement avec renforcement des capacités":"TPE accompagnées",
  "UEI promues à l'autoentrepreneuriat & appuyées à la formalisation":"UEI autoentrepreneuriat",
};
const sn = n => SHORT[n] || n;
function empty() { const o={}; ALL_INDICATORS.forEach(({name})=>{o[name]=0;}); return o; }

const OBJECTIFS_LOCAL = {
  "Inscription des Chercheurs d'Emploi":2820,"Entretien de Positionnement":995,
  "Ateliers de recherche d'emploi":500,"IDMAJ (hors PI) & TAHFIZ":858,
  "CIA":450,"CDC":308,"TAHFIZ":100,"PCS":20,
  "Insertion via Placement à l'International":65,"Insertion via l'entreprenariat":31,
  "Accompagnement des Porteurs de Projet":23,"Création D'Entreprises":12,
  "TPE accompagnées techniquement avec renforcement des capacités":9,
  "Auto Entrepreneurs appuyés":7,"UEI promues à l'autoentrepreneuriat & appuyées à la formalisation":8,
  "Nombre de candidats insérés (départ effectif)":120,
  "Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)":67,
  "Nombre de bénéficiaires de prestations d'accompagnement à la mobilité internationale autre que les ouvriers agricoles (ateliers, entretiens,  ..)":100,
  "Nombre de candidats pré sélectionnés autres que les ouvriers agricoles":21,
  "Nombre de candidats pré sélectionnés dans le cadre de recrutement des étrangers":2,
  "TAEHIL":95,"Formation Secteurs Emergents":0,"Formations partenariales":25,
  "Effectif Postes à pourvoir":3499,"Nbre d'employeurs contactés":750,
  "Nbre de nouveau clients":250,"Nbre d'employeur bénéficiaire":155
};

const REAL_2025_LOCAL = (() => {
  const d = {
    1:{...empty(),"Inscription des Chercheurs d'Emploi":20,"Entretien de Positionnement":88,"CIA":43,"CDC":2,"TAHFIZ":11,"PCS":1,"Insertion via Placement à l'International":15,"Nombre de candidats insérés (départ effectif)":15,"Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)":19,"Effectif Postes à pourvoir":17},
    2:{...empty(),"Inscription des Chercheurs d'Emploi":50,"Entretien de Positionnement":189,"CIA":52,"CDC":3,"TAHFIZ":18,"PCS":1,"Insertion via Placement à l'International":25,"Nombre de candidats insérés (départ effectif)":25,"Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)":36,"Nombre de candidats pré sélectionnés autres que les ouvriers agricoles":3,"TPE accompagnées techniquement avec renforcement des capacités":4,"Effectif Postes à pourvoir":70},
    3:{...empty(),"Inscription des Chercheurs d'Emploi":70,"Entretien de Positionnement":267,"CIA":95,"CDC":10,"TAHFIZ":28,"PCS":1,"Insertion via Placement à l'International":33,"TPE accompagnées techniquement avec renforcement des capacités":8,"Nombre de candidats insérés (départ effectif)":33,"Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)":44,"Nombre de candidats pré sélectionnés autres que les ouvriers agricoles":8,"Effectif Postes à pourvoir":77},
    5:{...empty(),"Inscription des Chercheurs d'Emploi":486,"Entretien de Positionnement":439,"Ateliers de recherche d'emploi":502,"CIA":120,"CDC":63,"TAHFIZ":39,"PCS":4,"Insertion via Placement à l'International":48,"Accompagnement des Porteurs de Projet":27,"TPE accompagnées techniquement avec renforcement des capacités":12,"Nombre de candidats insérés (départ effectif)":48,"Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)":48,"Nombre de candidats pré sélectionnés autres que les ouvriers agricoles":23,"Effectif Postes à pourvoir":374,"Nbre d'employeurs contactés":119,"Nbre de nouveau clients":7,"Nbre d'employeur bénéficiaire":153},
    8:{...empty(),"Inscription des Chercheurs d'Emploi":486,"Entretien de Positionnement":645,"Ateliers de recherche d'emploi":620,"CIA":132,"CDC":64,"TAHFIZ":42,"PCS":4,"Insertion via Placement à l'International":49,"Insertion via l'entreprenariat":7,"Accompagnement des Porteurs de Projet":27,"Création D'Entreprises":7,"TPE accompagnées techniquement avec renforcement des capacités":13,"Auto Entrepreneurs appuyés":1,"UEI promues à l'autoentrepreneuriat & appuyées à la formalisation":3,"Nombre de candidats insérés (départ effectif)":49,"Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)":49,"Nombre de bénéficiaires de prestations d'accompagnement à la mobilité internationale autre que les ouvriers agricoles (ateliers, entretiens,  ..)":86,"Nombre de candidats pré sélectionnés autres que les ouvriers agricoles":23,"Effectif Postes à pourvoir":418,"Nbre d'employeurs contactés":194,"Nbre de nouveau clients":12,"Nbre d'employeur bénéficiaire":228},
    9:{...empty(),"Inscription des Chercheurs d'Emploi":486,"Entretien de Positionnement":715,"Ateliers de recherche d'emploi":631,"CIA":152,"CDC":65,"TAHFIZ":51,"PCS":33,"Insertion via Placement à l'International":49,"Insertion via l'entreprenariat":7,"Accompagnement des Porteurs de Projet":27,"Création D'Entreprises":7,"TPE accompagnées techniquement avec renforcement des capacités":13,"Auto Entrepreneurs appuyés":1,"UEI promues à l'autoentrepreneuriat & appuyées à la formalisation":3,"Nombre de candidats insérés (départ effectif)":49,"Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)":49,"Nombre de bénéficiaires de prestations d'accompagnement à la mobilité internationale autre que les ouvriers agricoles (ateliers, entretiens,  ..)":86,"Nombre de candidats pré sélectionnés autres que les ouvriers agricoles":30,"Effectif Postes à pourvoir":458,"Nbre d'employeurs contactés":475,"Nbre de nouveau clients":16,"Nbre d'employeur bénéficiaire":255},
    10:{...empty(),"Inscription des Chercheurs d'Emploi":511,"Entretien de Positionnement":793,"Ateliers de recherche d'emploi":686,"CIA":179,"CDC":79,"TAHFIZ":60,"PCS":34,"Insertion via Placement à l'International":49,"Insertion via l'entreprenariat":7,"Accompagnement des Porteurs de Projet":27,"Création D'Entreprises":7,"TPE accompagnées techniquement avec renforcement des capacités":13,"Auto Entrepreneurs appuyés":1,"UEI promues à l'autoentrepreneuriat & appuyées à la formalisation":3,"Nombre de candidats insérés (départ effectif)":49,"Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)":49,"Nombre de bénéficiaires de prestations d'accompagnement à la mobilité internationale autre que les ouvriers agricoles (ateliers, entretiens,  ..)":89,"Nombre de candidats pré sélectionnés autres que les ouvriers agricoles":33,"Effectif Postes à pourvoir":510,"Nbre d'employeurs contactés":546,"Nbre de nouveau clients":18,"Nbre d'employeur bénéficiaire":341},
    11:{...empty(),"Inscription des Chercheurs d'Emploi":511,"Entretien de Positionnement":863,"Ateliers de recherche d'emploi":753,"CIA":197,"CDC":79,"TAHFIZ":69,"PCS":34,"Insertion via Placement à l'International":51,"Insertion via l'entreprenariat":7,"Accompagnement des Porteurs de Projet":36,"Création D'Entreprises":14,"TPE accompagnées techniquement avec renforcement des capacités":13,"Auto Entrepreneurs appuyés":1,"UEI promues à l'autoentrepreneuriat & appuyées à la formalisation":3,"Nombre de candidats insérés (départ effectif)":49,"Nombre de travailleur saisonniers agricoles accompagnés (ateliers d'appui, sensibilisation, information, …)":49,"Nombre de bénéficiaires de prestations d'accompagnement à la mobilité internationale autre que les ouvriers agricoles (ateliers, entretiens,  ..)":116,"Nombre de candidats pré sélectionnés autres que les ouvriers agricoles":36,"Effectif Postes à pourvoir":531,"Nbre d'employeurs contactés":973,"Nbre de nouveau clients":21,"Nbre d'employeur bénéficiaire":341},
  };
  Object.keys(d).forEach(m=>{ const r=d[m]; r["IDMAJ (hors PI) & TAHFIZ"]=(r["CIA"]||0)+(r["PCS"]||0)+(r["TAHFIZ"]||0); });
  return d;
})();
const INIT_2026_RAW = {};

function buildCumuls(raw) {
  const months=Object.keys(raw).map(Number).sort((a,b)=>a-b);
  const c={};
  months.forEach((m,i)=>{
    c[m]={...empty()};
    ALL_INDICATORS.forEach(({name})=>{c[m][name]=(i>0?c[months[i-1]][name]||0:0)+(raw[m][name]||0);});
    c[m]["IDMAJ (hors PI) & TAHFIZ"]=(c[m]["CIA"]||0)+(c[m]["PCS"]||0)+(c[m]["TAHFIZ"]||0);
  });
  return c;
}

function taux(o,r){ if(!o||r===null||r===undefined) return null; return Math.round((r/o)*100); }
function stColor(t){ if(t===null) return C.muted; if(t>=90) return C.green; if(t>=60) return C.orange; return C.red; }
function actLevel(n){ if(n===0) return {label:"Inactif",color:C.red,bg:"#FFEBEE"}; if(n<5) return {label:"Faible",color:C.orange,bg:"#FFF3E0"}; if(n<15) return {label:"Moyen",color:"#1565C0",bg:"#E3F2FD"}; return {label:"Actif",color:C.green,bg:"#E8F5E9"}; }
function formatDT(s){ if(!s) return "—"; const d=new Date(s); return d.toLocaleDateString("fr-MA",{day:"2-digit",month:"2-digit",year:"numeric"})+" "+d.toLocaleTimeString("fr-MA",{hour:"2-digit",minute:"2-digit"}); }

function Badge({v}){
  if(v===null||v===undefined) return <span style={{color:C.muted,fontSize:11}}>N/A</span>;
  const c=stColor(v);
  return <span style={{background:c+"22",color:c,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:500}}>{v}%</span>;
}
function TrendArrow({val}){
  if(val===null||val===undefined) return <span style={{color:C.muted,fontSize:11}}>—</span>;
  return <span style={{color:val>0?C.green:C.red,fontSize:13,fontWeight:500}}>{val>0?"↑":"↓"} {Math.abs(val)}%</span>;
}

const selStyle={fontSize:12,padding:"6px 10px",borderRadius:6,border:`1px solid ${C.border}`,fontFamily:"sans-serif",background:"#fff"};
const inp={fontSize:13,padding:"10px 14px",border:`1px solid ${C.border}`,borderRadius:8,width:"100%",boxSizing:"border-box",outline:"none",fontFamily:"sans-serif"};
const btnPrimary={background:C.violet,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"sans-serif"};
const btnSecondary={background:C.light,color:C.violet,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 16px",fontSize:12,cursor:"pointer",fontFamily:"sans-serif"};

// ══ SIDEBAR ══════════════════════════════════════════════════
function Sidebar({ user, view, setView, unreadCount, setShowNotif, showNotif, notifications, markAllRead, markOneRead, fetchNotifications, doLogout }) {
  const NAV_DIR = [
    {id:"dashboard",   l:"Tableau de bord",     icon:"📊"},
    {id:"graphiques",  l:"Graphiques",           icon:"📈"},
    {id:"intelligence",l:"Intelligence",         icon:"🧠"},
    {id:"comparaison", l:"Comparaison",          icon:"⚖️"},
    {id:"saisie",      l:"Saisie",               icon:"✏️"},
    {id:"repartition", l:"Répartition",          icon:"📋"},
    {id:"activites",   l:"Activité conseillers", icon:"👥"},
    {id:"utilisateurs",l:"Utilisateurs",         icon:"👤"},
    {id:"messagerie",  l:"Messagerie",           icon:"✉️"},
  ];

  return (
    <>
      {/* SIDEBAR */}
      <div style={{
        position:"fixed", left:0, top:0, height:"100vh", width:SIDEBAR_W,
        background:`linear-gradient(180deg, ${C.sidebar} 0%, ${C.sidebarLight} 100%)`,
        display:"flex", flexDirection:"column",
        boxShadow:"3px 0 16px rgba(0,0,0,0.25)",
        zIndex:100, overflowY:"auto",
        fontFamily:"sans-serif",
      }}>
        {/* Logo */}
        <div style={{padding:"20px 16px 16px", borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <img src="/logo_anapec.png" alt="ANAPEC Logo" width={32} height={32} style={{ objectFit: 'contain', borderRadius: 4 }} />
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:15,letterSpacing:"0.5px"}}>ANAPEC</div>
              <div style={{color:"rgba(255,255,255,0.5)",fontSize:10}}>Agence Rehamna</div>
            </div>
          </div>
          {/* Profil */}
          <div style={{background:"rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 12px"}}>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em"}}>Connecté en tant que</div>
            <div style={{color:"#fff",fontSize:12,fontWeight:600,marginTop:3}}>{user?.name}</div>
            <div style={{color:C.gold,fontSize:10,marginTop:2}}>
              {user?.role==="directeur"?"● Directeur":"● Conseiller"}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
          {NAV_DIR.map(n=>{
            const active=view===n.id;
            return (
              <button key={n.id} onClick={()=>setView(n.id)} style={{
                width:"100%", padding:"11px 16px",
                background:active?"rgba(255,255,255,0.15)":"transparent",
                border:"none",
                borderLeft:active?`3px solid ${C.gold}`:"3px solid transparent",
                color:active?"#fff":"rgba(255,255,255,0.65)",
                textAlign:"left", cursor:"pointer",
                fontSize:12.5, fontFamily:"sans-serif",
                display:"flex", alignItems:"center", gap:10,
                transition:"all 0.15s ease",
              }}>
                <span style={{fontSize:16,width:20,textAlign:"center"}}>{n.icon}</span>
                <span style={{fontWeight:active?600:400}}>{n.l}</span>
              </button>
            );
          })}
        </nav>

        {/* Bas : notifications + déconnexion */}
        <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
          <button onClick={()=>setShowNotif(!showNotif)} style={{
            width:"100%",padding:"9px 12px",
            background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",
            borderRadius:8,color:"#fff",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            marginBottom:8,fontFamily:"sans-serif",fontSize:12,
          }}>
            <span>🔔 Notifications</span>
            {unreadCount>0&&<span style={{background:C.gold,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{unreadCount}</span>}
          </button>
          <button onClick={doLogout} style={{
            width:"100%",padding:"8px 12px",
            background:"transparent",border:"1px solid rgba(255,255,255,0.2)",
            borderRadius:8,color:"rgba(255,255,255,0.7)",cursor:"pointer",
            fontSize:12,fontFamily:"sans-serif",
          }}>
            ← Déconnexion
          </button>
        </div>
      </div>

      {/* PANNEAU NOTIFICATIONS (flottant à droite de la sidebar) */}
      {showNotif&&(
        <div style={{
          position:"fixed",left:SIDEBAR_W+8,bottom:20,width:360,
          background:"#fff",border:`1px solid ${C.border}`,
          borderRadius:12,boxShadow:`0 8px 32px rgba(0,0,0,0.18)`,
          zIndex:200,overflow:"hidden",
        }}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.dark}}>
            <div>
              <span style={{fontWeight:600,fontSize:13,color:"#fff"}}>Activité des conseillers</span>
              {unreadCount>0&&<span style={{background:C.gold,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:600,marginLeft:8}}>{unreadCount} non lu{unreadCount>1?"s":""}</span>}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={fetchNotifications} style={{background:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer",color:"#fff",fontSize:13,borderRadius:4,padding:"2px 8px"}}>↻</button>
              {unreadCount>0&&<button onClick={markAllRead} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:6,color:"#fff",padding:"3px 10px",fontSize:11,cursor:"pointer",fontFamily:"sans-serif"}}>Tout lire</button>}
              <button onClick={()=>setShowNotif(false)} style={{background:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer",color:"#fff",fontSize:14,borderRadius:4,padding:"2px 8px"}}>✕</button>
            </div>
          </div>
          <div style={{maxHeight:340,overflowY:"auto"}}>
            {notifications.length===0?(
              <div style={{padding:28,textAlign:"center",color:C.muted}}><div style={{fontSize:24,marginBottom:8}}>📋</div><div style={{fontSize:12}}>Aucune activité enregistrée</div></div>
            ):notifications.map(n=>(
              <div key={n.id} onClick={()=>!n.lu&&markOneRead(n.id)} style={{padding:"11px 16px",borderBottom:`1px solid ${C.border}`,background:n.lu?"#fff":C.violet+"07",cursor:n.lu?"default":"pointer"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <span style={{fontSize:15,flexShrink:0,marginTop:1}}>{n.type_message==="urgente"?"🚨":n.type_message==="rappel"?"⚠️":n.titre?.includes("Modification")?"✏️":"📥"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",gap:6}}>
                      <span style={{fontSize:12,fontWeight:n.lu?400:600,color:C.dark,lineHeight:1.3}}>{n.titre}</span>
                      {!n.lu&&<span style={{width:7,height:7,borderRadius:"50%",background:C.gold,flexShrink:0,marginTop:4}}/>}
                    </div>
                    <div style={{fontSize:11,color:"#444",marginTop:3,lineHeight:1.4}}>{n.message}</div>
                    <div style={{fontSize:10,color:C.muted,marginTop:4}}>🕐 {formatDT(n.created_at)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {notifications.length>0&&<div style={{padding:"8px 16px",borderTop:`1px solid ${C.border}`,textAlign:"center",background:"#FAFAFA"}}><span style={{fontSize:11,color:C.muted}}>{notifications.length} notification{notifications.length>1?"s":""}</span></div>}
        </div>
      )}
    </>
  );
}

// ══ PAGE TITRE ════════════════════════════════════════════════
function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
      <div>
        <h1 style={{margin:0,fontSize:20,fontWeight:700,color:C.dark}}>{title}</h1>
        {subtitle&&<p style={{margin:"4px 0 0",fontSize:12,color:C.muted}}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ══ VUE ACTIVITÉ CONSEILLERS ══════════════════════════════════
function ViewActivites() {
  const [actAnnee,setActAnnee]   = useState("2026");
  const [actStats,setActStats]   = useState(null);
  const [actLogs,setActLogs]     = useState([]);
  const [actLoading,setActLoading] = useState(false);
  const [actError,setActError]   = useState("");
  const [actTab,setActTab]       = useState("table");
  const [filterCons,setFilterCons] = useState("all");
  const [filterAct,setFilterAct] = useState("all");
  const [filterFrom,setFilterFrom] = useState("");
  const [filterTo,setFilterTo]   = useState("");
  const barRef=useRef(null), lineRef=useRef(null);
  const barInst=useRef(null), lineInst=useRef(null);

  const loadStats = useCallback(async()=>{
    setActLoading(true);setActError("");
    try{
      const r=await fetch(`${API}/activities/stats?annee=${actAnnee}`);
      if(!r.ok){const t=await r.text();throw new Error(`${r.status} — ${t}`);}
      setActStats(await r.json());
    }catch(e){setActError(e.message);}
    finally{setActLoading(false);}
  },[actAnnee]);

  const loadLogs = useCallback(async()=>{
    const p=new URLSearchParams();
    if(filterCons!=="all") p.set("conseiller_id",filterCons);
    if(filterAct!=="all")  p.set("action_type",filterAct);
    if(filterFrom)          p.set("from",filterFrom);
    if(filterTo)            p.set("to",filterTo);
    p.set("limit","100");
    try{const r=await fetch(`${API}/activities?${p}`);if(r.ok)setActLogs(await r.json());}catch{}
  },[filterCons,filterAct,filterFrom,filterTo]);

  useEffect(()=>{loadStats();},[loadStats]);
  useEffect(()=>{if(actTab==="journal")loadLogs();},[actTab,loadLogs]);

  useEffect(()=>{
    if(actTab!=="bar"||!barRef.current||!actStats||typeof window.Chart==="undefined") return;
    if(barInst.current)barInst.current.destroy();
    const cons=actStats.byConseiller||[];
    barInst.current=new window.Chart(barRef.current,{
      type:"bar",
      data:{labels:cons.map(c=>c.conseiller_nom),datasets:[
        {label:"Total",data:cons.map(c=>Number(c.total_actions)),backgroundColor:cons.map(c=>actLevel(Number(c.total_actions)).color+"cc"),borderRadius:6},
        {label:"Ce mois",data:cons.map(c=>Number(c.actions_ce_mois)),backgroundColor:C.gold+"99",borderRadius:6},
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"top"}},scales:{y:{beginAtZero:true,ticks:{stepSize:1}}}}
    });
  },[actTab,actStats]); // eslint-disable-line

  useEffect(()=>{
    if(actTab!=="line"||!lineRef.current||!actStats||typeof window.Chart==="undefined") return;
    if(lineInst.current)lineInst.current.destroy();
    const cons=actStats.byConseiller||[], byMonth=actStats.byMonth||[];
    const palette=[C.violet,C.gold,C.green,C.orange,"#1565C0","#6D4C41"];
    lineInst.current=new window.Chart(lineRef.current,{
      type:"line",
      data:{labels:MONTHS,datasets:cons.map((c,i)=>{
        const data=Array(12).fill(0);
        byMonth.filter(b=>b.conseiller_id===c.conseiller_id).forEach(b=>{data[Number(b.mois)-1]=Number(b.nb_actions);});
        return {label:c.conseiller_nom,data,borderColor:palette[i%palette.length],backgroundColor:"transparent",tension:0.35,pointRadius:4};
      })},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"top"}},scales:{y:{beginAtZero:true,ticks:{stepSize:1}}}}
    });
  },[actTab,actStats]); // eslint-disable-line

  const cons=actStats?.byConseiller||[];
  const totalActions=cons.reduce((s,c)=>s+Number(c.total_actions),0);
  const totalMois=cons.reduce((s,c)=>s+Number(c.actions_ce_mois),0);
  const nbActifs=cons.filter(c=>Number(c.total_actions)>0).length;
  const ACT_META={create:{label:"Création",emoji:"📥",color:C.green,bg:"#E8F5E9"},update:{label:"Modification",emoji:"✏️",color:"#1565C0",bg:"#E3F2FD"},delete:{label:"Suppression",emoji:"🗑️",color:C.red,bg:"#FFEBEE"}};

  return (
    <div>
      <PageHeader title="📊 Répartition des conseillers" subtitle="Suivi des actions effectuées par chaque conseiller dans le système"
        action={<div style={{display:"flex",gap:8,alignItems:"center"}}>
          <select value={actAnnee} onChange={e=>setActAnnee(e.target.value)} style={selStyle}>{["2024","2025","2026"].map(y=><option key={y}>{y}</option>)}</select>
          <button onClick={loadStats} disabled={actLoading} style={{...btnPrimary,padding:"7px 14px",fontSize:12}}>{actLoading?"⏳":"↻ Actualiser"}</button>
        </div>}
      />

      {actError&&<div style={{background:"#FFEBEE",border:"1px solid #FFCDD2",borderRadius:10,padding:"14px 18px",marginBottom:16,color:C.red,fontSize:12}}><strong>⚠️ Erreur :</strong> {actError}<div style={{marginTop:6,color:"#555",fontSize:11}}>La table <code>activities</code> est créée automatiquement au démarrage du serveur. Redémarrez <code>node server.js</code>.</div></div>}

      {!actError&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[{icon:"⚡",label:"Total actions",val:actLoading?"…":totalActions,color:C.violet},{icon:"📅",label:"Actions ce mois",val:actLoading?"…":totalMois,color:"#1565C0"},{icon:"✅",label:"Conseillers actifs",val:actLoading?"…":nbActifs,color:C.green},{icon:"👥",label:"Conseillers suivis",val:actLoading?"…":cons.length,color:C.gold}].map(k=>(
          <div key={k.label} style={{background:"#fff",borderRadius:10,padding:"14px 16px",border:`1px solid ${C.border}`,borderTop:`3px solid ${k.color}`,textAlign:"center"}}>
            <div style={{fontSize:22}}>{k.icon}</div>
            <div style={{fontSize:24,fontWeight:700,color:k.color,margin:"4px 0"}}>{k.val}</div>
            <div style={{fontSize:11,color:C.muted}}>{k.label}</div>
          </div>
        ))}
      </div>}

      <div style={{display:"flex",gap:0,borderBottom:`2px solid ${C.border}`,marginBottom:16}}>
        {[{id:"table",l:"📋 Tableau"},{id:"bar",l:"📊 Barres"},{id:"line",l:"📈 Évolution"},{id:"journal",l:"🕐 Journal"}].map(t=>(
          <button key={t.id} onClick={()=>setActTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"sans-serif",fontSize:12,padding:"9px 16px",color:actTab===t.id?C.violet:C.muted,fontWeight:actTab===t.id?700:400,borderBottom:actTab===t.id?`2px solid ${C.violet}`:"2px solid transparent",marginBottom:-2,whiteSpace:"nowrap"}}>{t.l}</button>
        ))}
      </div>

      {actTab==="table"&&(
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          {actLoading?<div style={{padding:40,textAlign:"center",color:C.muted}}>⏳ Chargement…</div>
            :cons.length===0?<div style={{padding:40,textAlign:"center",color:C.muted}}><div style={{fontSize:32,marginBottom:12}}>📭</div><div style={{fontWeight:600,marginBottom:6}}>Aucune activité enregistrée</div><div style={{fontSize:12}}>Les actions des conseillers apparaîtront ici après leur première saisie.</div></div>
            :<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:C.dark}}>{["#","Conseiller","Total","Ce mois","Créations","MàJ","Statut","Dernière activité"].map((h,i)=><th key={h} style={{padding:"10px 14px",textAlign:i<=1?"left":"center",color:"#fff",fontWeight:500,fontSize:11,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>{cons.map((c,i)=>{
                const total=Number(c.total_actions),mois=Number(c.actions_ce_mois),lv=actLevel(total);
                return(<tr key={c.conseiller_id} style={{background:i%2===0?"#FAFAFA":"#fff",borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:"10px 14px"}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:22,height:22,borderRadius:"50%",background:C.violet+"18",color:C.violet,fontSize:11,fontWeight:700}}>{i+1}</span></td>
                  <td style={{padding:"10px 14px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:34,height:34,borderRadius:"50%",background:lv.bg,color:lv.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{c.conseiller_nom.split(" ").map(w=>w[0]).slice(0,2).join("")}</div><div><div style={{fontWeight:600,fontSize:13,color:"#222"}}>{c.conseiller_nom}</div><div style={{fontSize:11,color:C.muted}}>{c.email}</div></div></div></td>
                  <td style={{padding:"10px 14px",textAlign:"center"}}><span style={{fontSize:18,fontWeight:700,color:total>0?C.violet:C.muted}}>{total}</span></td>
                  <td style={{padding:"10px 14px",textAlign:"center"}}><span style={{fontSize:14,fontWeight:600,color:mois>0?"#1565C0":C.muted}}>{mois}</span></td>
                  <td style={{padding:"10px 14px",textAlign:"center",color:C.green,fontWeight:600}}>{c.nb_create||0}</td>
                  <td style={{padding:"10px 14px",textAlign:"center",color:"#1565C0",fontWeight:600}}>{c.nb_update||0}</td>
                  <td style={{padding:"10px 14px",textAlign:"center"}}><span style={{background:lv.bg,color:lv.color,borderRadius:10,padding:"2px 10px",fontSize:10,fontWeight:600}}>{lv.label}</span></td>
                  <td style={{padding:"10px 14px",textAlign:"center",fontSize:11,color:C.muted}}>{formatDT(c.derniere_activite)}</td>
                </tr>);
              })}</tbody>
            </table></div>
          }
          {!actLoading&&cons.length>0&&<div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,display:"flex",gap:16,flexWrap:"wrap"}}>
            {[{l:"Inactif",c:C.red},{l:"Faible",c:C.orange},{l:"Moyen",c:"#1565C0"},{l:"Actif",c:C.green}].map(x=>(
              <span key={x.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.muted}}><span style={{width:8,height:8,borderRadius:"50%",background:x.c,display:"inline-block"}}/>{x.l}</span>
            ))}
          </div>}
        </div>
      )}

      {actTab==="bar"&&<div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
        <div style={{fontWeight:600,fontSize:13,color:C.dark,marginBottom:16}}>Actions par conseiller — {actAnnee}</div>
        {actLoading?<div style={{padding:40,textAlign:"center",color:C.muted}}>⏳</div>:cons.length===0?<div style={{padding:40,textAlign:"center",color:C.muted}}>Aucune donnée</div>:<div style={{position:"relative",height:280}}><canvas ref={barRef}/></div>}
      </div>}

      {actTab==="line"&&<div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
        <div style={{fontWeight:600,fontSize:13,color:C.dark,marginBottom:16}}>Évolution mensuelle — {actAnnee}</div>
        {actLoading?<div style={{padding:40,textAlign:"center",color:C.muted}}>⏳</div>:cons.length===0?<div style={{padding:40,textAlign:"center",color:C.muted}}>Aucune donnée</div>:<div style={{position:"relative",height:280}}><canvas ref={lineRef}/></div>}
      </div>}

      {actTab==="journal"&&<div>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",marginBottom:14,display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          {[{l:"Conseiller",el:<select value={filterCons} onChange={e=>setFilterCons(e.target.value)} style={selStyle}><option value="all">Tous</option>{cons.map(c=><option key={c.conseiller_id} value={c.conseiller_id}>{c.conseiller_nom}</option>)}</select>},{l:"Action",el:<select value={filterAct} onChange={e=>setFilterAct(e.target.value)} style={selStyle}><option value="all">Toutes</option><option value="create">Création</option><option value="update">Modification</option><option value="delete">Suppression</option></select>},{l:"Du",el:<input type="date" value={filterFrom} onChange={e=>setFilterFrom(e.target.value)} style={selStyle}/>},{l:"Au",el:<input type="date" value={filterTo} onChange={e=>setFilterTo(e.target.value)} style={selStyle}/>}].map(({l,el})=>(<div key={l}><div style={{fontSize:10,color:C.muted,marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>{l}</div>{el}</div>))}
          <button onClick={loadLogs} style={{...btnPrimary,padding:"7px 18px",fontSize:12}}>Filtrer</button>
        </div>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          {actLogs.length===0?<div style={{padding:40,textAlign:"center",color:C.muted}}><div style={{fontSize:28,marginBottom:10}}>📋</div>Aucune entrée — cliquez sur Filtrer.</div>
            :actLogs.map((log,i)=>{
              const meta=ACT_META[log.action_type]||ACT_META.create;
              return(<div key={log.id} style={{display:"flex",gap:14,padding:"12px 18px",borderBottom:i<actLogs.length-1?`1px solid ${C.border}`:"none",background:i%2===0?"#FAFAFA":"#fff",alignItems:"flex-start"}}>
                <div style={{width:34,height:34,borderRadius:8,background:meta.bg,color:meta.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{meta.emoji}</div>
                <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}><span style={{fontWeight:600,fontSize:13,color:"#222"}}>{log.conseiller_nom}</span><span style={{background:meta.bg,color:meta.color,borderRadius:10,padding:"2px 9px",fontSize:10,fontWeight:600}}>{meta.label}</span></div><div style={{fontSize:12,color:"#444",marginTop:3}}>{log.detail||log.module}</div><div style={{fontSize:10,color:C.muted,marginTop:4}}>🕐 {formatDT(log.created_at)}</div></div>
              </div>);
            })
          }
        </div>
      </div>}
    </div>
  );
}

// ══ COMPOSANT PRINCIPAL ═══════════════════════════════════════
export default function App() {
  const [page,setPage]           = useState("login");
  const [loginMode,setLoginMode] = useState("login");
  const [email,setEmail]         = useState("");
  const [pass,setPass]           = useState("");
  const [newNom,setNewNom]       = useState("");
  const [newPrenom,setNewPrenom] = useState("");
  const [newEmail,setNewEmail]   = useState("");
  const [newPass,setNewPass]     = useState("");
  const [err,setErr]             = useState("");
  const [user,setUser]           = useState(null);
  const [conseillers,setConseillers] = useState([]);

  const [raw2026,setRaw2026]         = useState(INIT_2026_RAW);
  const [saisieVals,setSaisieVals]   = useState({});
  const [saisieObjs,setSaisieObjs]   = useState({});
  const [dbObjectifs,setDbObjectifs] = useState({});
  const [saved,setSaved]             = useState(null);
  const [savedMsg,setSavedMsg]       = useState("");
  const [saisieMonth,setSaisieMonth] = useState(CURRENT_MONTH);
  const [saisieYear,setSaisieYear]   = useState(CURRENT_YEAR);
  const [editMode,setEditMode]       = useState(false);
  const [refreshMsg,setRefreshMsg]   = useState("");

  const [view,setView]       = useState("dashboard");
  const [selYear,setSelYear] = useState("2026");
  const [selMonth,setSelMonth] = useState(3);
  const [selCat,setSelCat]   = useState("all");
  const [selInd,setSelInd]   = useState(ALL_INDICATORS[0].name);

  const [alerts,setAlerts]     = useState([]);
  const [forecast,setForecast] = useState([]);
  const [ranking,setRanking]   = useState([]);
  const [alertSeuil,setAlertSeuil] = useState(60);
  const [intelLoading,setIntelLoading] = useState(false);

  const [notifications,setNotifications] = useState([]);
  const [unreadCount,setUnreadCount]     = useState(0);
  const [showNotif,setShowNotif]         = useState(false);

  const [compAnnee1,setCompAnnee1] = useState("2025");
  const [compAnnee2,setCompAnnee2] = useState("2026");
  const [compMois,setCompMois]     = useState(3);
  const [compData,setCompData]     = useState([]);

  const [repData,setRepData]     = useState(null);
  const [repMois,setRepMois]         = useState(CURRENT_MONTH);
  const [repYear,setRepYear]         = useState(CURRENT_YEAR.toString());
  const [repLoading,setRepLoading] = useState(false);
  const [repError,setRepError]   = useState("");

  const [msgRecipients, setMsgRecipients] = useState([]);
  const [msgTitre, setMsgTitre] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgType, setMsgType] = useState("information");
  const [msgStatus, setMsgStatus] = useState("");
  const [consTotals, setConsTotals] = useState({});
  const [hasDirOverrides, setHasDirOverrides] = useState(false);

  const chartCumRef=useRef(null),chartMonRef=useRef(null),chartForeRef=useRef(null);
  const chartCumInst=useRef(null),chartMonInst=useRef(null),chartForeInst=useRef(null);

  const real2026        = buildCumuls(raw2026);
  const realisations    = selYear==="2025"?REAL_2025_LOCAL:real2026;
  const availableMonths = Object.keys(realisations).map(Number).sort((a,b)=>a-b);

  function getObj(name) { return OBJECTIFS_LOCAL[name] || 0; }
  function getCumul(m,n){ return realisations[m]?.[n]??null; }
  function getMonthOnly(m,n){
    const cur=getCumul(m,n); if(cur===null) return null;
    const mths=Object.keys(realisations).map(Number).sort((a,b)=>a-b);
    const prev=mths.filter(x=>x<m).pop();
    if(!prev) return cur;
    const p=getCumul(prev,n); return p!==null?Math.max(0,cur-p):cur;
  }
  function getCumul2026(m,n){ return real2026[m]?.[n]??null; }
  const filteredInds=selCat==="all"?ALL_INDICATORS:ALL_INDICATORS.filter(i=>i.category===selCat);
  function stats(fn,month){ let a=0,e=0,f=0,t=0; filteredInds.forEach(({name})=>{ const c=fn(month,name),o=getObj(name); if(c!==null&&o){t++;const x=taux(o,c);if(x>=90)a++;else if(x>=60)e++;else f++;} }); return {a,e,f,t}; }

  useEffect(()=>{
    setSaisieObjs({});setSaved(null);setEditMode(false);setConsTotals({});setHasDirOverrides(false);
    if(user?.role==="directeur"){
      (async()=>{
        try{
          const r=await fetch(`${API}/suivi/repartition?annee=${saisieYear}&mois=${saisieMonth}`);
          if(r.ok){
            const json=await r.json();
            const ct={};
            // Sum up all conseillers. This strictly becomes the initial saisieVals.
            (json.lignes||[]).forEach(l=>{
              if(l.role!=="directeur"){
                ct[l.indicateur_nom]=(ct[l.indicateur_nom]||0)+Number(l.valeur_cumul);
              }
            });
            setConsTotals(ct);
            setSaisieVals({...ct});
            return;
          }
        }catch{}
        // Fallback to local data only if network completely fails
        const ex=(saisieYear==="2025"?REAL_2025_LOCAL:raw2026)[saisieMonth];
        if(ex){const v={};ALL_INDICATORS.forEach(({name})=>{if(ex[name]!==undefined&&ex[name]!==0)v[name]=ex[name];});setSaisieVals(v);}else setSaisieVals({});
      })();
    } else {
      (async()=>{
        try {
          const r = await fetch(`${API}/realisations/user/${user?.id}?annee=${saisieYear}&mois=${saisieMonth}`);
          if (r.ok) {
            const data = await r.json();
            const v={};
            data.forEach(d => { v[d.indicateur_nom] = Number(d.valeur_cumul); });
            setSaisieVals(v);
            return;
          }
        } catch(e) {}
        setSaisieVals({});
      })();
    }
  },[saisieMonth, saisieYear, user?.id, view]); // eslint-disable-line

  useEffect(()=>{ if(view==="repartition") fetchRepartition(); },[view,repMois,repYear]); // eslint-disable-line

  useEffect(()=>{
    if(!user) return;
    fetchNotifications();
    fetchDbObjectifs();
    const id=setInterval(fetchNotifications,30000);
    return ()=>clearInterval(id);
  },[user, selYear]); // eslint-disable-line

  async function fetchDbObjectifs(){
    try{ const r=await fetch(`${API}/objectifs/${selYear}`); if(r.ok){ const d=await r.json(); const m={}; d.forEach(o=>m[o.indicateur_nom]=o.valeur); setDbObjectifs(m); } }catch{}
  }

  async function fetchNotifications(){
    if(!user) return;
    try{ const r=await fetch(`${API}/notifications/${user.id}`); if(!r.ok) return; const data=await r.json(); setNotifications(Array.isArray(data)?data:[]); setUnreadCount(Array.isArray(data)?data.filter(n=>!n.lu).length:0); }catch{}
  }
  async function markAllRead(){ try{await fetch(`${API}/notifications/read-all/${user.id}`,{method:"PATCH"});}catch{} setNotifications(p=>p.map(n=>({...n,lu:1}))); setUnreadCount(0); }
  async function markOneRead(id){ try{await fetch(`${API}/notifications/${id}/read`,{method:"PATCH"});}catch{} setNotifications(p=>p.map(n=>n.id===id?{...n,lu:1}:n)); setUnreadCount(p=>Math.max(0,p-1)); }

  async function fetchReal2026(){
    try{
      const res=await fetch(`${API}/realisations/2026`); if(!res.ok) throw new Error();
      const json=await res.json();
      const rawMap={};
      json.forEach(r=>{ if(!rawMap[r.mois]) rawMap[r.mois]={}; rawMap[r.mois][r.indicateur_nom]=Number(r.valeur_cumul); });
      if(Object.keys(rawMap).length>0) setRaw2026(prev=>{const m={...INIT_2026_RAW};Object.keys(rawMap).forEach(k=>{m[+k]={...(m[+k]||empty()),...rawMap[+k]};});return m;});
      setRefreshMsg("Actualisé ✓");
    }catch{setRefreshMsg("Données locales ✓");}
    setTimeout(()=>setRefreshMsg(""),2000);
  }
  async function fetchConseillers(){ try{const r=await fetch(`${API}/utilisateurs`);setConseillers(await r.json());}catch{} }

  async function fetchRepartition(){
    setRepLoading(true);setRepError("");setRepData(null);
    try{
      const r=await fetch(`${API}/suivi/repartition?annee=${repYear}&mois=${repMois}`);
      if(r.ok){
        const json=await r.json();
        // Extract unique conseillers from lignes instead of relying on separate state
        const consMap={};
        (json.lignes||[]).forEach(l=>{
          if(!consMap[l.conseiller_id]) consMap[l.conseiller_id]={id:l.conseiller_id,nom:l.conseiller_nom,email:l.email,role:l.role};
        });
        const activeConseillers = Object.values(consMap).filter(c=>c.role!=='directeur');
        const consIds = new Set(activeConseillers.map(c=>c.id));
        const saisiesMap={},totaux={};
        (json.lignes||[]).forEach(l=>{
          if(!consIds.has(l.conseiller_id)) return;
          saisiesMap[`${l.indicateur_nom}###${l.conseiller_id}`]=Number(l.valeur_cumul);
          totaux[l.conseiller_id]=(totaux[l.conseiller_id]||0)+Number(l.valeur_cumul);
        });
        setRepData({conseillers:activeConseillers,saisiesMap,objMap:json.objectifs||{},totaux});
        setRepLoading(false);return;
      }
      const errTxt=await r.text(); throw new Error(`${r.status}: ${errTxt}`);
    }catch(e){
      // Fallback /api/suivi
      try{
        const r=await fetch(`${API}/suivi?annee=${repYear}&mois=${repMois}`);
        if(!r.ok){setRepError(`Erreur ${r.status}`);setRepLoading(false);return;}
        const rows=await r.json();
        const consMap={};
        rows.forEach(row=>{
          if(!consMap[row.conseiller_id]) consMap[row.conseiller_id]={id:row.conseiller_id,nom:row.conseiller_nom,email:row.email,role:'conseiller'};
        });
        const activeConseillers = Object.values(consMap);
        const saisiesMap={},totaux={};
        rows.forEach(row=>{
          saisiesMap[`${row.indicateur_nom}###${row.conseiller_id}`]=Number(row.valeur_cumul);
          totaux[row.conseiller_id]=(totaux[row.conseiller_id]||0)+Number(row.valeur_cumul);
        });
        setRepData({conseillers:activeConseillers,saisiesMap,objMap:{},totaux});
      }catch(e2){setRepError(e2.message);}
    }
    setRepLoading(false);
  }

  function fetchComparison(){
    const src1=compAnnee1==="2025"?REAL_2025_LOCAL:real2026,src2=compAnnee2==="2026"?real2026:REAL_2025_LOCAL;
    const r1=src1[compMois]||{},r2=src2[compMois]||{};
    setCompData(ALL_INDICATORS.map(({name})=>{
      const v1=Number(r1[name])||0,v2=Number(r2[name])||0;
      if(v1===0&&v2===0) return null;
      const obj=getObj(name)||0;
      return {indicateur_nom:name,cumul_a1:v1,cumul_a2:v2,ecart:v2-v1,evol_pct:v1>0?Math.round(((v2-v1)/v1)*100):null,taux_a1:obj>0?Math.round((v1/obj)*100):null,taux_a2:obj>0?Math.round((v2/obj)*100):null};
    }).filter(Boolean));
  }

  // Intelligence
  function gAlertsLocal(){const na=[];ALL_INDICATORS.forEach(({name})=>{const c=getCumul(selMonth,name),o=getObj(name);if(c===null||!o)return;const t=taux(o,c);if(t===null)return;const mths=Object.keys(realisations).map(Number).sort((a,b)=>a-b);const pm=mths.filter(m=>m<selMonth).pop();const pv=pm?getCumul(pm,name):null;if(t<30)na.push({id:name+'_c',indicateur_nom:sn(name),type_alerte:'objectif_critique',taux_realisation:t,message:`CRITIQUE : "${sn(name)}" à ${t}%.`});else if(t<alertSeuil)na.push({id:name+'_f',indicateur_nom:sn(name),type_alerte:'faible_performance',taux_realisation:t,message:`"${sn(name)}" à ${t}%, sous ${alertSeuil}%.`});else if(pv!==null&&c<pv)na.push({id:name+'_t',indicateur_nom:sn(name),type_alerte:'tendance_negative',taux_realisation:t,message:`"${sn(name)}" en baisse.`});});setAlerts(na);setIntelLoading(false);}
  function gForecastLocal(){const mths=Object.keys(realisations).map(Number).sort((a,b)=>a-b);const res=ALL_INDICATORS.map(({name})=>{const o=getObj(name)||0;const pts=mths.filter(m=>m<=selMonth).map(m=>({mois:m,valeur:getCumul(m,name)||0}));if(!pts.length)return null;const n=pts.length,sx=pts.reduce((s,p)=>s+p.mois,0),sy=pts.reduce((s,p)=>s+p.valeur,0),sxy=pts.reduce((s,p)=>s+p.mois*p.valeur,0),sx2=pts.reduce((s,p)=>s+p.mois*p.mois,0),d=(n*sx2-sx*sx)||1,a=(n*sxy-sx*sy)/d,b=(sy-a*sx)/n;const prev=Math.round(Math.max(0,a*12+b)),tA=Math.round(pts[pts.length-1].valeur/(o||1)*100),tP=Math.round(prev/(o||1)*100);return {indicateur_nom:sn(name),valeur_actuelle:pts[pts.length-1].valeur,prevision_fin:prev,objectif:o,taux_actuel:tA,taux_prevu:tP,tendance:a>0?'hausse':a<0?'baisse':'stable',recommandation:tP>=90?`Trajectoire positive.`:tP>=60?`Prévu à ${tP}%. Effort requis.`:`Critique : ${tP}% prévu.`};}).filter(Boolean);setForecast(res);setIntelLoading(false);}
  function gRankingLocal(){const mths=Object.keys(realisations).map(Number).sort((a,b)=>a-b),pm=mths.filter(m=>m<selMonth).pop();const res=ALL_INDICATORS.map(({name})=>{const c=getCumul(selMonth,name),o=getObj(name);if(c===null||!o)return null;const t=taux(o,c)||0,pv=pm?getCumul(pm,name):null,ev=pv?Math.round((c-pv)*100/(pv||1)):0,st=t>=80?100:t>=60?70:40,sc=Math.round(0.5*t+0.3*st+0.2*(Math.min(Math.max(ev,-100),100)+100)/2);return {indicateur_nom:sn(name),valeur_cumul:c,objectif:o,taux_pct:t,evolution_pct:ev,stabilite:st,score:sc};}).filter(Boolean).sort((a,b)=>b.score-a.score).map((r,i)=>({...r,rang:i+1}));setRanking(res);setIntelLoading(false);}
  async function generateAlerts(){setIntelLoading(true);setAlerts([]);try{const r=await fetch(`${API}/alerts/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({annee:selYear,mois:selMonth,seuil:alertSeuil})});if(!r.ok)throw new Error();await r.json();try{const r2=await fetch(`${API}/alerts?annee=${selYear}&mois=${selMonth}&lu=0`);const d=await r2.json();setAlerts(Array.isArray(d)?d:[]);setIntelLoading(false);}catch{gAlertsLocal();}}catch{gAlertsLocal();}}
  async function fetchForecast(){setIntelLoading(true);try{const r=await fetch(`${API}/forecast?annee=${selYear}&mois=${selMonth}`);if(!r.ok)throw new Error();setForecast(await r.json());setIntelLoading(false);}catch{gForecastLocal();}}
  async function fetchRanking(){setIntelLoading(true);try{const r=await fetch(`${API}/ranking?annee=${selYear}&mois=${selMonth}`);if(!r.ok)throw new Error();setRanking(await r.json());setIntelLoading(false);}catch{gRankingLocal();}}

  // Auth
  async function doLogin(){
    setErr("");
    if(email==="soufiane@anapec.ma"&&pass==="soufiane123"){setUser({id:1,nom:"El Amrani",prenom:"Soufiane",email:"soufiane@anapec.ma",role:"directeur",name:"Soufiane El Amrani"});setPage("app");fetchReal2026();fetchConseillers();return;}
    try{const res=await fetch(`${API}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,mot_de_passe:pass})});const data=await res.json();if(!res.ok){setErr(data.error);return;}setUser({...data.user,name:`${data.user.prenom} ${data.user.nom}`});setPage("app");if(data.user.role==="directeur"){fetchConseillers();fetchReal2026();}else fetchReal2026();}catch{setErr("Serveur non disponible.");}
  }
  async function doRegister(){
    setErr("");if(!newNom||!newPrenom||!newEmail||!newPass){setErr("Tous les champs sont obligatoires.");return;}
    try{const res=await fetch(`${API}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nom:newNom,prenom:newPrenom,email:newEmail,mot_de_passe:newPass})});const data=await res.json();if(!res.ok){setErr(data.error);return;}setUser({...data.user,name:`${data.user.prenom} ${data.user.nom}`});setPage("app");}catch{setErr("Erreur de connexion.");}
  }
  function doLogout(){setUser(null);setPage("login");setEmail("");setPass("");setErr("");setLoginMode("login");setNotifications([]);setUnreadCount(0);}

  function applyLocally(mois,payload){setRaw2026(prev=>{const u={};Object.keys(prev).forEach(m=>{u[+m]={...prev[+m]};});if(!u[mois])u[mois]={...empty()};else u[mois]={...u[mois]};Object.keys(payload).forEach(n=>{u[mois][n]=payload[n];});u[mois]["IDMAJ (hors PI) & TAHFIZ"]=(u[mois]["CIA"]||0)+(u[mois]["PCS"]||0)+(u[mois]["TAHFIZ"]||0);return u;});}

  async function doSaisieWithObj(){
    const rp={},op={};
    const idmajR=(+saisieVals["CIA"]||0)+(+saisieVals["PCS"]||0)+(+saisieVals["TAHFIZ"]||0);
    const idmajO=(+saisieObjs["CIA"]||0)+(+saisieObjs["PCS"]||0)+(+saisieObjs["TAHFIZ"]||0);
    ALL_INDICATORS.forEach(({name})=>{
      rp[name]=saisieVals[name]?+saisieVals[name]:0;
      op[name]=saisieObjs[name]?+saisieObjs[name]:0;
    });
    if(idmajR>0)rp["IDMAJ (hors PI) & TAHFIZ"]=idmajR;else rp["IDMAJ (hors PI) & TAHFIZ"]=0;
    if(idmajO>0)op["IDMAJ (hors PI) & TAHFIZ"]=idmajO;else op["IDMAJ (hors PI) & TAHFIZ"]=0;
    
    setSaved("saving");
    if(saisieYear==="2026") applyLocally(saisieMonth,rp);
    let apiOk=false,apiMsg="";
    try{const res=await fetch(`${API}/realisations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({annee:saisieYear,mois:saisieMonth,realisations:rp,saisi_par:user?.id})});const json=await res.json();if(res.ok){apiOk=true;apiMsg=json.action==="update"?"Données mises à jour !":"Données enregistrées !";}else apiMsg=`Erreur : ${json.error||res.status}`;}catch(e){apiMsg="Backend non disponible. Données locales.";apiOk=true;}
    if(Object.keys(op).length>0){try{await fetch(`${API}/objectifs`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({annee:saisieYear,objectifs:op})});}catch{}}
    if(saisieYear==="2026") await fetchReal2026();
    await fetchRepartition();
    setSaved(apiOk?"ok":"error");setSavedMsg(apiMsg);
    if(apiOk){setEditMode(false);setTimeout(()=>setSaved(null),4000);}
  }

  useEffect(()=>{
    if(view!=="graphiques"||!chartCumRef.current||!chartMonRef.current||typeof window.Chart==="undefined") return;
    const o=getObj(selInd)||0,cD=MONTHS.map((_,i)=>getCumul(i+1,selInd)),mD=MONTHS.map((_,i)=>getMonthOnly(i+1,selInd)),pr=MONTHS.map((_,i)=>o?Math.round(o*(i+1)/12):null);
    if(chartCumInst.current)chartCumInst.current.destroy();
    chartCumInst.current=new window.Chart(chartCumRef.current,{type:"line",data:{labels:MONTHS,datasets:[{label:"Cumul",data:cD,borderColor:C.violet,backgroundColor:C.violet+"22",fill:true,tension:0.3,pointRadius:5},{label:"Objectif",data:pr,borderColor:C.gold,fill:false,tension:0,pointRadius:3,borderDash:[6,3]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{autoSkip:false,font:{size:11}}},y:{beginAtZero:true}}}});
    if(chartMonInst.current)chartMonInst.current.destroy();
    chartMonInst.current=new window.Chart(chartMonRef.current,{type:"bar",data:{labels:MONTHS,datasets:[{label:"Mois",data:mD,backgroundColor:mD.map(v=>stColor(taux(o/12,v))+"cc"),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{autoSkip:false,font:{size:11}}},y:{beginAtZero:true}}}});
  },[view,selYear,selInd,realisations]); // eslint-disable-line

  useEffect(()=>{
    if(view!=="intelligence"||!forecast.length||!chartForeRef.current||typeof window.Chart==="undefined") return;
    if(chartForeInst.current)chartForeInst.current.destroy();
    const top=forecast.slice(0,8);
    chartForeInst.current=new window.Chart(chartForeRef.current,{type:"bar",data:{labels:top.map(f=>f.indicateur_nom),datasets:[{label:"Taux actuel",data:top.map(f=>f.taux_actuel),backgroundColor:C.violet+"99",borderRadius:4},{label:"Prévision",data:top.map(f=>f.taux_prevu),backgroundColor:C.gold+"99",borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:"y",plugins:{legend:{position:"top"}},scales:{x:{max:150,ticks:{callback:v=>v+"%"}}}}});
  },[view,forecast]); // eslint-disable-line

  async function doExport(){
    try {
      const XLSX = await import("xlsx");
      const rows = [];
      const src = selYear==="2025" ? REAL_2025_LOCAL : raw2026;
      const months = Object.keys(src).map(Number).sort((a,b)=>a-b).filter(m=>m<=selMonth);
      ALL_INDICATORS.forEach(({name})=>{
        const row = { Indicateur: sn(name), Objectif: getObj(name)||0 };
        months.forEach(m=>{ row[MONTHS[m-1]] = src[m]?.[name]||0; });
        row["Cumul"] = getCumul(selMonth, name)||0;
        const o = getObj(name)||0;
        row["Taux %"] = o>0 ? Math.round((row["Cumul"]/o)*100) : 0;
        rows.push(row);
      });
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${MONTHS[selMonth-1]} ${selYear}`);
      XLSX.writeFile(wb, `ANAPEC_${selYear}_M${selMonth}.xlsx`);
    } catch(e) {
      console.error(e);
      alert("Export non disponible");
    }
  }

  // ══ LOGIN ══════════════════════════════════════════════════
  if(page==="login") return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg, ${C.sidebar} 0%, ${C.sidebarLight} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif"}}>
      <div style={{width:420,background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{background:`linear-gradient(135deg,${C.sidebar},${C.sidebarLight})`,padding:"32px 0 24px",textAlign:"center"}}>
          <img src="/logo_anapec.png" alt="ANAPEC" width={60} height={60} style={{margin:"0 auto 12px",display:"block",objectFit:"contain"}} />
          <div style={{color:"#fff",fontSize:22,fontWeight:700,letterSpacing:"1px"}}>ANAPEC</div>
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:12,marginTop:4}}>Tableau de bord — Agence Rehamna</div>
          <div style={{color:C.gold,fontSize:10,marginTop:6,letterSpacing:"2px"}}>v2.1</div>
        </div>
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
          {[{id:"login",l:"Connexion"},{id:"register",l:"Créer compte"}].map(t=>(
            <button key={t.id} onClick={()=>{setLoginMode(t.id);setErr("");}} style={{flex:1,padding:"12px 0",border:"none",background:"none",cursor:"pointer",fontSize:12,fontWeight:loginMode===t.id?600:400,color:loginMode===t.id?C.violet:C.muted,borderBottom:loginMode===t.id?`2px solid ${C.violet}`:"2px solid transparent",fontFamily:"sans-serif"}}>{t.l}</button>
          ))}
        </div>
        <div style={{padding:"24px 28px"}}>
          {err&&<div style={{background:"#FFEBEE",color:C.red,padding:"9px 13px",borderRadius:8,fontSize:12,marginBottom:14}}>{err}</div>}
          {loginMode==="login"?(
            <>{[{l:"Email",v:email,s:setEmail,p:"email@anapec.ma",t:"text"},{l:"Mot de passe",v:pass,s:setPass,p:"••••••••",t:"password"}].map(f=>(<div key={f.l} style={{marginBottom:14}}><label style={{fontSize:11,color:C.muted,display:"block",marginBottom:5}}>{f.l}</label><input type={f.t} value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} style={inp} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>))}<button onClick={doLogin} style={{...btnPrimary,width:"100%",marginTop:4,padding:"12px"}}>Se connecter</button></>
          ):(
            <>{[{l:"Nom",v:newNom,s:setNewNom,p:"Nom",t:"text"},{l:"Prénom",v:newPrenom,s:setNewPrenom,p:"Prénom",t:"text"},{l:"Email",v:newEmail,s:setNewEmail,p:"email@anapec.ma",t:"text"},{l:"Mot de passe",v:newPass,s:setNewPass,p:"••••••••",t:"password"}].map(f=>(<div key={f.l} style={{marginBottom:14}}><label style={{fontSize:11,color:C.muted,display:"block",marginBottom:5}}>{f.l}</label><input type={f.t} value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} style={inp}/></div>))}<button onClick={doRegister} style={{...btnPrimary,background:C.gold,width:"100%",marginTop:4,padding:"12px"}}>Créer le compte</button></>
          )}
        </div>
      </div>
    </div>
  );

  // ══ VUE CONSEILLER ════════════════════════════════════════
  if(user?.role==="conseiller"){
    const st26=stats(getCumul2026,saisieMonth);
    const sourceRealisations = saisieYear === "2025" ? REAL_2025_LOCAL : real2026;
    const prevCumul = sourceRealisations[saisieMonth-1] || null;
    return (
      <div style={{display:"flex",fontFamily:"sans-serif",minHeight:"100vh"}}>
        {/* Mini sidebar conseiller */}
        <div style={{position:"fixed",left:0,top:0,height:"100vh",width:SIDEBAR_W,background:`linear-gradient(180deg,${C.sidebar},${C.sidebarLight})`,display:"flex",flexDirection:"column",boxShadow:"3px 0 16px rgba(0,0,0,0.25)",zIndex:100}}>
          <div style={{padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <img src="/logo_anapec.png" alt="ANAPEC" width={32} height={32} style={{objectFit:"contain",borderRadius:4}} />
              <div><div style={{color:"#fff",fontWeight:700,fontSize:15}}>ANAPEC</div><div style={{color:"rgba(255,255,255,0.5)",fontSize:10}}>Agence Rehamna</div></div>
            </div>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 12px"}}>
              <div style={{color:"rgba(255,255,255,0.5)",fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em"}}>Connecté en tant que</div>
              <div style={{color:"#fff",fontSize:12,fontWeight:600,marginTop:3}}>{user.name}</div>
              <div style={{color:C.gold,fontSize:10,marginTop:2}}>● Conseiller</div>
            </div>
          </div>
          <div style={{flex:1,padding:"16px"}}>
            <div style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"12px",marginBottom:12}}>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:10,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Mois sélectionné</div>
              <div style={{color:C.gold,fontSize:16,fontWeight:700}}>{MONTHS_FR[saisieMonth-1]}</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,marginTop:2}}>{saisieYear}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{l:"Indicateurs",v:st26.t,c:"#fff"},{l:"Atteints",v:st26.a,c:C.green},{l:"En cours",v:st26.e,c:C.gold},{l:"Faibles",v:st26.f,c:C.red}].map(s=>(
                <div key={s.l} style={{background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"8px",textAlign:"center"}}>
                  <div style={{fontSize:18,fontWeight:700,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
            <button onClick={()=>setShowNotif(!showNotif)} style={{width:"100%",padding:"9px 12px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,fontFamily:"sans-serif",fontSize:12}}>
              <span>🔔 Notifications</span>
              {unreadCount>0&&<span style={{background:C.gold,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{unreadCount}</span>}
            </button>
            <button onClick={doLogout} style={{width:"100%",padding:"8px 12px",background:"transparent",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:12,fontFamily:"sans-serif"}}>← Déconnexion</button>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{marginLeft:SIDEBAR_W,flex:1,background:C.light,minHeight:"100vh",padding:"24px"}}>
          <div style={{maxWidth:680}}>
            <div style={{background:`linear-gradient(135deg,${C.dark},${C.violet})`,borderRadius:12,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
              <div><div style={{color:"#fff",fontWeight:600,fontSize:15}}>Saisie des réalisations</div><div style={{color:"rgba(255,255,255,0.65)",fontSize:11,marginTop:3}}>Renseignez les réalisations pour la période sélectionnée</div></div>
              <div style={{display:"flex",gap:8}}>
                <select value={saisieMonth} onChange={e=>setSaisieMonth(Number(e.target.value))} style={{...selStyle, background:"rgba(255,255,255,0.1)", color:"#fff", border:"1px solid rgba(255,255,255,0.3)"}}>
                  {MONTHS_FR.map((m,i)=><option key={i+1} value={i+1} style={{color:"#000"}}>{m}</option>)}
                </select>
                <select value={saisieYear} onChange={e=>setSaisieYear(e.target.value)} style={{...selStyle, background:"rgba(255,255,255,0.1)", color:"#fff", border:"1px solid rgba(255,255,255,0.3)"}}>
                  {["2024","2025","2026"].map(y=><option key={y} value={y} style={{color:"#000"}}>{y}</option>)}
                </select>
              </div>
            </div>
            {saved==="saving"&&<div style={{background:"#E3F2FD",border:"1px solid #90CAF9",borderRadius:8,padding:"10px 16px",marginBottom:"1rem",fontSize:13,color:"#1565C0"}}>⏳ Enregistrement…</div>}
            {saved==="ok"&&<div style={{background:"#E8F5E9",color:C.green,padding:"10px 16px",borderRadius:8,marginBottom:"1rem",fontSize:13,fontWeight:500,border:"1px solid #A5D6A7"}}>✓ {savedMsg}</div>}
            {saved==="error"&&<div style={{background:"#FFEBEE",color:C.red,padding:"10px 16px",borderRadius:8,marginBottom:"1rem",fontSize:13,border:"1px solid #FFCDD2"}}>⚠️ {savedMsg}</div>}
            {CATEGORIES.map(cat=>(
              <div key={cat.id} style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,marginBottom:"0.85rem",overflow:"hidden"}}>
                <div style={{background:cat.color+"18",borderBottom:`1px solid ${C.border}`,padding:"8px 16px"}}><span style={{fontWeight:600,fontSize:13,color:cat.color}}>{cat.label}</span></div>
                <div style={{padding:"0.75rem 1rem"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 90px 110px",gap:"4px 10px",marginBottom:6}}><span style={{fontSize:10,color:C.muted}}>Indicateur</span><span style={{fontSize:10,color:C.muted,textAlign:"right"}}>Cumul M{saisieMonth===1?12:saisieMonth-1}</span><span style={{fontSize:10,color:C.gold,textAlign:"right",fontWeight:500}}>Saisie {MONTHS[saisieMonth-1]}</span></div>
                  {cat.indicators.map(name=>{const pv=prevCumul?.[name]??0;return(<div key={name} style={{display:"grid",gridTemplateColumns:"1fr 90px 110px",gap:"4px 10px",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,color:"#333"}}>{sn(name)}</span><span style={{fontSize:12,color:C.muted,textAlign:"right"}}>{pv||"—"}</span><input type="number" min="0" placeholder="0" value={saisieVals[name]??""} onChange={e=>setSaisieVals(p=>({...p,[name]:e.target.value}))} style={{fontSize:12,textAlign:"right",padding:"5px 8px",border:`1px solid ${C.gold}`,borderRadius:6,outline:"none",fontFamily:"sans-serif"}}/></div>);})}
                </div>
              </div>
            ))}
            <button onClick={doSaisieWithObj} disabled={saved==="saving"} style={{...btnPrimary,width:"100%",marginTop:6,opacity:saved==="saving"?0.6:1}}>
              {saved==="saving"?"Enregistrement…":"Enregistrer et transmettre au directeur"}
            </button>
          </div>
        </div>
        
        {/* PANNEAU NOTIFICATIONS (flottant à droite de la sidebar) */}
        {showNotif&&(
          <div style={{
            position:"fixed",left:SIDEBAR_W+8,bottom:20,width:360,
            background:"#fff",border:`1px solid ${C.border}`,
            borderRadius:12,boxShadow:`0 8px 32px rgba(0,0,0,0.18)`,
            zIndex:200,overflow:"hidden",
          }}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.dark}}>
              <div>
                <span style={{fontWeight:600,fontSize:13,color:"#fff"}}>Notifications</span>
                {unreadCount>0&&<span style={{background:C.gold,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:600,marginLeft:8}}>{unreadCount} non lu{unreadCount>1?"s":""}</span>}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={fetchNotifications} style={{background:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer",color:"#fff",fontSize:13,borderRadius:4,padding:"2px 8px"}}>↻</button>
                {unreadCount>0&&<button onClick={markAllRead} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:6,color:"#fff",padding:"3px 10px",fontSize:11,cursor:"pointer",fontFamily:"sans-serif"}}>Tout lire</button>}
                <button onClick={()=>setShowNotif(false)} style={{background:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer",color:"#fff",fontSize:14,borderRadius:4,padding:"2px 8px"}}>✕</button>
              </div>
            </div>
            <div style={{maxHeight:340,overflowY:"auto"}}>
              {notifications.length===0?(
                <div style={{padding:28,textAlign:"center",color:C.muted}}><div style={{fontSize:24,marginBottom:8}}>📋</div><div style={{fontSize:12}}>Aucune notification</div></div>
              ):notifications.map(n=>(
                <div key={n.id} onClick={()=>!n.lu&&markOneRead(n.id)} style={{padding:"11px 16px",borderBottom:`1px solid ${C.border}`,background:n.lu?"#fff":C.violet+"07",cursor:n.lu?"default":"pointer"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <span style={{fontSize:15,flexShrink:0,marginTop:1}}>{n.type_message==="urgente"?"🚨":n.type_message==="rappel"?"⚠️":n.titre?.includes("Modification")?"✏️":"📥"}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:6}}>
                        <span style={{fontSize:12,fontWeight:n.lu?400:600,color:C.dark,lineHeight:1.3}}>{n.titre}</span>
                        {!n.lu&&<span style={{width:7,height:7,borderRadius:"50%",background:C.gold,flexShrink:0,marginTop:4}}/>}
                      </div>
                      <div style={{fontSize:11,color:"#444",marginTop:3,lineHeight:1.4}}>{n.message}</div>
                      <div style={{fontSize:10,color:C.muted,marginTop:4}}>🕐 {formatDT(n.created_at)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // ══ VUE DIRECTEUR ════════════════════════════════════════
  const st=stats(getCumul,selMonth);

  return (
    <div style={{display:"flex",fontFamily:"sans-serif",minHeight:"100vh"}}>
      <Sidebar user={user} view={view} setView={setView} unreadCount={unreadCount} setShowNotif={setShowNotif} showNotif={showNotif} notifications={notifications} markAllRead={markAllRead} markOneRead={markOneRead} fetchNotifications={fetchNotifications} doLogout={doLogout}/>

      {/* CONTENU PRINCIPAL */}
      <div style={{marginLeft:SIDEBAR_W,flex:1,background:C.light,minHeight:"100vh",padding:"24px",boxSizing:"border-box"}}>

        {/* Fil d'Ariane / en-tête de page */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:12,color:C.muted}}>ANAPEC Rehamna › <span style={{color:C.dark,fontWeight:600}}>{
            {dashboard:"Tableau de bord",graphiques:"Graphiques",intelligence:"Intelligence",comparaison:"Comparaison",saisie:"Saisie",repartition:"Répartition",activites:"Activité conseillers",utilisateurs:"Utilisateurs"}[view]||view
          }</span></div>
          <div style={{fontSize:11,color:C.muted}}>Directeur : {user?.name}</div>
        </div>

        {/* FILTRES COMMUNS */}
        {(view==="dashboard"||view==="analyse")&&(
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:"1.25rem",alignItems:"flex-end",background:"#fff",padding:"14px 16px",borderRadius:10,border:`1px solid ${C.border}`}}>
            {[{l:"Année",el:<select value={selYear} onChange={e=>{setSelYear(e.target.value);setSelMonth(e.target.value==="2025"?11:3);}} style={selStyle}>{YEARS.map(y=><option key={y}>{y}</option>)}</select>},{l:"Mois",el:<select value={selMonth} onChange={e=>setSelMonth(+e.target.value)} style={selStyle}>{MONTHS.map((m,i)=>{const mn=i+1,ok=availableMonths.includes(mn)||(selYear==="2026"&&mn<=CURRENT_MONTH);return <option key={i} value={mn} disabled={!ok}>{m}</option>;})}</select>},{l:"Catégorie",el:<select value={selCat} onChange={e=>setSelCat(e.target.value)} style={selStyle}><option value="all">Toutes</option>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select>}]
            .map(({l,el})=>(<div key={l}><label style={{fontSize:10,color:C.muted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>{l}</label>{el}</div>))}
            <button onClick={doExport} style={{...btnSecondary,marginLeft:"auto"}}>⬇ Export Excel</button>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {view==="dashboard"&&(<>
          <div style={{background:`linear-gradient(135deg,${C.dark},${C.violet})`,borderRadius:12,padding:"16px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:42,height:42,borderRadius:10,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><img src="/logo_anapec.png" alt="ANAPEC" width={26} height={26} style={{objectFit:"contain"}} /></div>
            <div><div style={{color:"#fff",fontWeight:600,fontSize:15}}>Total tous conseillers — {MONTHS[selMonth-1]} {selYear}</div><div style={{color:"rgba(255,255,255,0.65)",fontSize:11}}>Cumul cumulatif Janvier → {MONTHS[selMonth-1]}</div></div>
            <button onClick={fetchReal2026} style={{marginLeft:"auto",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:6,color:"#fff",padding:"6px 14px",cursor:"pointer",fontSize:12,fontFamily:"sans-serif"}}>{refreshMsg||"↻ Actualiser"}</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
            {[{l:"Global (Toutes entrées)",v:Object.keys(OBJECTIFS_LOCAL).reduce((sum,n)=>sum+(getCumul(selMonth,n)||0),0),c:C.gold},{l:"Indicateurs",v:st.t,c:C.violet},{l:"Atteints ≥90%",v:st.a,c:C.green},{l:"En cours 60–89%",v:st.e,c:C.orange},{l:"Faibles <60%",v:st.f,c:C.red}].map(s=>(
              <div key={s.l} style={{background:"#fff",borderRadius:10,padding:"14px",border:`1px solid ${C.border}`,borderTop:`3px solid ${s.c}`}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:5}}>{s.l}</div>
                <div style={{fontSize:26,fontWeight:700,color:s.c}}>{s.v}</div>
              </div>
            ))}
          </div>
          {CATEGORIES.filter(c=>selCat==="all"||c.id===selCat).map(cat=>{
            const inds=ALL_INDICATORS.filter(i=>i.category===cat.id);
            return(<div key={cat.id} style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,marginBottom:"1rem",overflow:"hidden"}}>
              <div style={{background:cat.color+"18",borderBottom:`1px solid ${C.border}`,padding:"9px 16px",display:"flex",alignItems:"center",gap:8}}><span style={{width:8,height:8,borderRadius:"50%",background:cat.color,display:"inline-block"}}/><span style={{fontWeight:600,fontSize:13,color:cat.color}}>{cat.label}</span></div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{background:C.light}}>{["Indicateur","Objectif 25",`Cumul M${selMonth} (tous)`,"Mois seul","Taux"].map((h,i)=>(<th key={h} style={{padding:"7px 14px",textAlign:i===0?"left":"right",fontWeight:500,color:C.muted,fontSize:11}}>{h}</th>))}</tr></thead>
                <tbody>{inds.map(({name})=>{const c=getCumul(selMonth,name),ms=getMonthOnly(selMonth,name),o=getObj(name),t=taux(o,c);return(<tr key={name} style={{borderTop:`1px solid ${C.border}`}}><td style={{padding:"8px 14px",color:"#333"}}>{sn(name)}</td><td style={{padding:"8px 14px",textAlign:"right",color:C.muted}}>{o||"—"}</td><td style={{padding:"8px 14px",textAlign:"right",fontWeight:500,color:C.violet}}>{c??""}</td><td style={{padding:"8px 14px",textAlign:"right",color:C.dark}}>{ms??""}</td><td style={{padding:"8px 14px",textAlign:"right"}}><Badge v={t}/></td></tr>);})}</tbody>
              </table>
            </div>);
          })}
        </>)}

        {/* ── GRAPHIQUES ── */}
        {view==="graphiques"&&(<div>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"flex-end",background:"#fff",padding:"14px 16px",borderRadius:10,border:`1px solid ${C.border}`}}>
            {[{l:"Année",el:<select value={selYear} onChange={e=>setSelYear(e.target.value)} style={selStyle}>{YEARS.map(y=><option key={y}>{y}</option>)}</select>},{l:"Indicateur",el:<select value={selInd} onChange={e=>setSelInd(e.target.value)} style={{...selStyle,maxWidth:260}}>{ALL_INDICATORS.map(i=><option key={i.name} value={i.name}>{sn(i.name)}</option>)}</select>}]
            .map(({l,el})=>(<div key={l}><label style={{fontSize:10,color:C.muted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>{l}</label>{el}</div>))}
          </div>
          {[{ref:chartCumRef,title:`Évolution cumulative — ${sn(selInd)}`,h:260},{ref:chartMonRef,title:`Réalisation mensuelle — ${sn(selInd)}`,h:240}].map(({ref,title,h})=>(
            <div key={title} style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:"1.25rem",marginBottom:"1rem"}}>
              <div style={{fontSize:12,fontWeight:600,marginBottom:"0.75rem",color:C.dark}}>{title}</div>
              <div style={{position:"relative",height:h}}><canvas ref={ref}/></div>
            </div>
          ))}
        </div>)}

        {/* ── INTELLIGENCE ── */}
        {view==="intelligence"&&(<div style={{maxWidth:900}}>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"flex-end",background:"#fff",padding:"14px 16px",borderRadius:10,border:`1px solid ${C.border}`}}>
            {[{l:"Année",el:<select value={selYear} onChange={e=>setSelYear(e.target.value)} style={selStyle}>{YEARS.map(y=><option key={y}>{y}</option>)}</select>},{l:"Mois",el:<select value={selMonth} onChange={e=>setSelMonth(+e.target.value)} style={selStyle}>{MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select>},{l:"Seuil (%)",el:<input type="number" value={alertSeuil} onChange={e=>setAlertSeuil(+e.target.value)} min="0" max="100" style={{...selStyle,width:70}}/>}]
            .map(({l,el})=>(<div key={l}><label style={{fontSize:10,color:C.muted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>{l}</label>{el}</div>))}
            <div style={{display:"flex",gap:8}}>
              <button onClick={generateAlerts} disabled={intelLoading} style={{...btnPrimary,padding:"7px 14px",fontSize:12,opacity:intelLoading?0.6:1}}>{intelLoading?"…":"Générer alertes"}</button>
              <button onClick={fetchForecast} style={{...btnSecondary,padding:"7px 14px",fontSize:12}}>Prévisions</button>
              <button onClick={fetchRanking}  style={{...btnSecondary,padding:"7px 14px",fontSize:12}}>Classement</button>
            </div>
          </div>
          {alerts.length>0&&<div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,marginBottom:16,overflow:"hidden"}}><div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:"#FFF3E0"}}><span style={{fontWeight:600,fontSize:13,color:C.orange}}>⚠️ Alertes ({alerts.length})</span></div>{alerts.map(a=>(<div key={a.id} style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:12,background:a.type_alerte==="objectif_critique"?C.red+"06":C.gold+"06"}}><span style={{fontSize:18,flexShrink:0}}>{a.type_alerte==="objectif_critique"?"🚨":a.type_alerte==="tendance_negative"?"📉":"⚠️"}</span><div><div style={{fontSize:11,fontWeight:600,color:a.type_alerte==="objectif_critique"?C.red:a.type_alerte==="tendance_negative"?C.orange:C.gold,marginBottom:3}}>{a.type_alerte==="objectif_critique"?"Critique":a.type_alerte==="tendance_negative"?"Tendance négative":"Performance faible"}</div><div style={{fontSize:12,color:"#333",lineHeight:1.5}}>{a.message}</div></div></div>))}</div>}
          {forecast.length>0&&<div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,marginBottom:16,overflow:"hidden"}}><div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:C.violet+"10"}}><span style={{fontWeight:600,fontSize:13,color:C.violet}}>📈 Prévisions fin d'année</span></div><div style={{position:"relative",height:300,padding:"1rem"}}><canvas ref={chartForeRef}/></div><div style={{padding:"0 1rem 1rem"}}>{forecast.filter(f=>f.taux_prevu<90).slice(0,4).map(f=>(<div key={f.indicateur_nom} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:C.light,borderRadius:6,marginBottom:6}}><div><div style={{fontSize:12,fontWeight:500,color:C.dark}}>{f.indicateur_nom}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{f.recommandation}</div></div><div style={{textAlign:"right",flexShrink:0,marginLeft:12}}><div style={{fontSize:11,color:C.muted}}>Actuel : <Badge v={f.taux_actuel}/></div><div style={{fontSize:11,color:C.muted,marginTop:3}}>Prévu : <Badge v={f.taux_prevu}/></div></div></div>))}</div></div>}
          {ranking.length>0&&<div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}><div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:C.gold+"18"}}><span style={{fontWeight:600,fontSize:13,color:"#8B6914"}}>🏅 Classement des indicateurs</span></div><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{background:C.light}}>{["#","Indicateur","Taux","Score","Tendance","Stabilité"].map((h,i)=>(<th key={h} style={{padding:"7px 14px",textAlign:i<=1?"left":"right",fontWeight:500,color:C.muted,fontSize:11}}>{h}</th>))}</tr></thead><tbody>{ranking.slice(0,10).map(r=>(<tr key={r.indicateur_nom} style={{borderTop:`1px solid ${C.border}`}}><td style={{padding:"8px 14px",fontWeight:500,color:r.rang<=3?C.gold:C.muted}}>{r.rang<=3?"🏅":""} {r.rang}</td><td style={{padding:"8px 14px",color:"#333"}}>{r.indicateur_nom}</td><td style={{padding:"8px 14px",textAlign:"right"}}><Badge v={r.taux_pct}/></td><td style={{padding:"8px 14px",textAlign:"right",fontWeight:500,color:C.violet}}>{r.score}</td><td style={{padding:"8px 14px",textAlign:"right"}}><TrendArrow val={r.evolution_pct}/></td><td style={{padding:"8px 14px",textAlign:"right",color:r.stabilite>=80?C.green:r.stabilite>=60?C.orange:C.red}}>{r.stabilite}%</td></tr>))}</tbody></table></div>}
        </div>)}

        {/* ── COMPARAISON ── */}
        {view==="comparaison"&&(<div style={{maxWidth:900}}>
          <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:16}}>
            <div style={{fontWeight:600,fontSize:14,color:C.dark,marginBottom:12}}>⚖️ Comparaison avancée</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
              {[{l:"Année 1",el:<select value={compAnnee1} onChange={e=>setCompAnnee1(e.target.value)} style={selStyle}>{YEARS.map(y=><option key={y}>{y}</option>)}</select>},{l:"Année 2",el:<select value={compAnnee2} onChange={e=>setCompAnnee2(e.target.value)} style={selStyle}>{YEARS.map(y=><option key={y}>{y}</option>)}</select>},{l:"Mois",el:<select value={compMois} onChange={e=>setCompMois(+e.target.value)} style={selStyle}>{MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select>}]
              .map(({l,el})=>(<div key={l}><label style={{fontSize:10,color:C.muted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>{l}</label>{el}</div>))}
              <button onClick={fetchComparison} style={{...btnPrimary,padding:"7px 16px",fontSize:12}}>Comparer</button>
            </div>
          </div>
          {compData.length>0&&<div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{background:C.light}}>{["Indicateur",`${compAnnee1} M${compMois}`,`${compAnnee2} M${compMois}`,"Écart","Évolution",`Taux ${compAnnee1}`,`Taux ${compAnnee2}`].map((h,i)=>(<th key={h} style={{padding:"7px 12px",textAlign:i===0?"left":"right",fontWeight:500,color:C.muted,fontSize:11,whiteSpace:"nowrap"}}>{h}</th>))}</tr></thead><tbody>{compData.map(r=>(<tr key={r.indicateur_nom} style={{borderTop:`1px solid ${C.border}`}}><td style={{padding:"8px 12px",color:"#333"}}>{sn(r.indicateur_nom)}</td><td style={{padding:"8px 12px",textAlign:"right",color:C.muted}}>{r.cumul_a1||0}</td><td style={{padding:"8px 12px",textAlign:"right",fontWeight:500,color:C.violet}}>{r.cumul_a2||0}</td><td style={{padding:"8px 12px",textAlign:"right",fontWeight:500,color:r.ecart>0?C.green:r.ecart<0?C.red:C.muted}}>{r.ecart>0?"+":""}{r.ecart}</td><td style={{padding:"8px 12px",textAlign:"right"}}><TrendArrow val={r.evol_pct}/></td><td style={{padding:"8px 12px",textAlign:"right"}}><Badge v={r.taux_a1}/></td><td style={{padding:"8px 12px",textAlign:"right"}}><Badge v={r.taux_a2}/></td></tr>))}</tbody></table></div></div>}
        </div>)}

        {/* ── SAISIE ── */}
        {view==="saisie"&&(()=>{
          const isDir=user?.role==="directeur";
          const hasConsTotals=isDir&&Object.keys(consTotals).length>0;
          return(<div style={{maxWidth:820}}>
            <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:14}}>
              <div style={{fontWeight:600,fontSize:14,color:C.dark,marginBottom:6}}>✏️ Saisie des données — 2026</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:10}}>{isDir?"Total de la répartition affiché. Modifiez directement les valeurs puis enregistrez.":"IDMAJ calculé automatiquement (CIA + PCS + TAHFIZ)."}</div>
              <div><label style={{fontSize:10,color:C.muted,display:"block",marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>Mois à saisir</label><select value={saisieMonth} onChange={e=>setSaisieMonth(+e.target.value)} style={selStyle}>{MONTHS.map((m,i)=><option key={i} value={i+1}>{m} 2026</option>)}</select></div>
            </div>
            {saved==="saving"&&<div style={{background:"#E3F2FD",border:"1px solid #90CAF9",borderRadius:8,padding:"10px 16px",marginBottom:12,fontSize:13,color:"#1565C0"}}>⏳ Enregistrement…</div>}
            {saved==="ok"&&<div style={{background:"#E8F5E9",color:C.green,padding:"10px 16px",borderRadius:8,marginBottom:12,fontSize:13,fontWeight:500,border:"1px solid #A5D6A7"}}><span>✓ {savedMsg}</span></div>}
            {saved==="error"&&<div style={{background:"#FFEBEE",color:C.red,padding:"10px 16px",borderRadius:8,marginBottom:12,fontSize:13,border:"1px solid #FFCDD2"}}>⚠️ {savedMsg}</div>}
            {!saved&&hasConsTotals&&isDir&&<div style={{background:"#E3F2FD",border:"1px solid #90CAF9",borderRadius:8,padding:"10px 16px",marginBottom:12,fontSize:13}}><span style={{color:"#1565C0"}}>Le total de la répartition est chargé pour {MONTHS[saisieMonth-1]} 2026 dans la colonne Valeur finale. Modifiez les valeurs directement si nécessaire.</span></div>}
            {!saved&&!hasConsTotals&&!isDir&&raw2026[saisieMonth]&&!editMode&&<div style={{background:"#E3F2FD",border:"1px solid #90CAF9",borderRadius:8,padding:"10px 16px",marginBottom:12,fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#1565C0"}}>Données existantes pour {MONTHS[saisieMonth-1]} 2026.</span><button onClick={()=>setEditMode(true)} style={{background:C.violet,border:"none",borderRadius:6,color:"#fff",padding:"4px 12px",fontSize:12,cursor:"pointer",fontFamily:"sans-serif"}}>Modifier</button></div>}
            {CATEGORIES.map(cat=>{
              const idmajR2=(+saisieVals["CIA"]||0)+(+saisieVals["PCS"]||0)+(+saisieVals["TAHFIZ"]||0);
              return(<div key={cat.id} style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,marginBottom:"0.85rem",overflow:"hidden"}}>
                <div style={{background:cat.color+"18",borderBottom:`1px solid ${C.border}`,padding:"8px 16px"}}><span style={{fontWeight:600,fontSize:13,color:cat.color}}>{cat.label}</span></div>
                <div style={{padding:"0.75rem 1rem"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 90px 110px 70px",gap:"4px 10px",marginBottom:8,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:10,color:C.muted,fontWeight:600}}>Indicateur</span>
                    <span style={{fontSize:10,color:C.violet,textAlign:"right",fontWeight:600}}>Objectif 25</span>
                    <span style={{fontSize:10,color:"#8B6914",textAlign:"right",fontWeight:600}}>{isDir?"Valeur finale":"Réalisation"}</span>
                    <span style={{fontSize:10,color:C.muted,textAlign:"right",fontWeight:600}}>Taux</span>
                  </div>
                  {cat.indicators.map(name=>{
                    const isI=name==="IDMAJ (hors PI) & TAHFIZ";
                    const rv=isI?idmajR2:(+saisieVals[name]||0);
                    const objVal=getObj(name)||0;
                    const t=objVal>0?Math.round((rv/objVal)*100):null;
                    const ro=!isDir&&!editMode&&raw2026[saisieMonth]&&!saved;
                    return(<div key={name} style={{display:"grid",gridTemplateColumns:"1fr 90px 110px 70px",gap:"4px 10px",alignItems:"center",marginBottom:9,opacity:isI?0.85:1}}>
                      <span style={{fontSize:12,color:isI?C.violet:"#333",fontStyle:isI?"italic":"normal"}}>{sn(name)}{isI&&<span style={{fontSize:10,color:C.muted}}> (auto)</span>}</span>
                      <span style={{fontSize:12,textAlign:"right",color:C.violet,fontWeight:500,paddingRight:4}}>{objVal||"—"}</span>
                      {isI?<span style={{fontSize:12,textAlign:"right",color:"#8B6914",fontWeight:500,paddingRight:4}}>{idmajR2||"—"}</span>:<input type="number" min="0" placeholder="0" value={saisieVals[name]??""} onChange={e=>setSaisieVals(p=>({...p,[name]:e.target.value}))} disabled={ro} style={{fontSize:12,textAlign:"right",padding:"5px 8px",border:`1px solid ${ro?"#ddd":C.gold+"88"}`,borderRadius:6,outline:"none",fontFamily:"sans-serif",background:ro?"#f8f8f8":"#fff"}}/>}
                      <div style={{textAlign:"right"}}>{t!==null?<Badge v={t}/>:<span style={{color:C.border,fontSize:11}}>—</span>}</div>
                    </div>);
                  })}
                </div>
              </div>);
            })}
            <button onClick={doSaisieWithObj} disabled={saved==="saving"} style={{...btnPrimary,width:"100%",marginTop:6,padding:"12px 0",fontSize:14,opacity:saved==="saving"?0.6:1}}>
              {saved==="saving"?"Enregistrement…":editMode?`Mettre à jour ${MONTHS[saisieMonth-1]} 2026`:`Enregistrer ${MONTHS[saisieMonth-1]} 2026`}
            </button>
          </div>);
        })()}

        {/* ── RÉPARTITION SAISIES ── */}
        {view==="repartition"&&(<div>
          <div style={{background:`linear-gradient(135deg,${C.dark},${C.violet})`,borderRadius:12,padding:"14px 20px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div><div style={{color:"#fff",fontWeight:600,fontSize:15}}>📋 Répartition des saisies par conseiller</div><div style={{color:"rgba(255,255,255,0.65)",fontSize:11,marginTop:3}}>Valeurs individuelles enregistrées en base de données</div></div>
            <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
              <div><div style={{color:"rgba(255,255,255,0.6)",fontSize:10,marginBottom:3}}>Mois</div><select value={repMois} onChange={e=>setRepMois(+e.target.value)} style={{...selStyle,background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)"}}>{MONTHS.map((m,i)=><option key={i} value={i+1} style={{color:"#333",background:"#fff"}}>{m}</option>)}</select></div>
              <div><div style={{color:"rgba(255,255,255,0.6)",fontSize:10,marginBottom:3}}>Année</div><select value={repYear} onChange={e=>setRepYear(e.target.value)} style={{...selStyle,background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)"}}>{YEARS.map(y=><option key={y} value={y} style={{color:"#333",background:"#fff"}}>{y}</option>)}</select></div>
              <button onClick={fetchRepartition} style={{...btnSecondary,background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)"}}>{repLoading?"⏳":"↻ Actualiser"}</button>
            </div>
          </div>
          {repLoading&&<div style={{background:"#fff",borderRadius:12,padding:40,textAlign:"center",color:C.muted,border:`1px solid ${C.border}`}}>⏳ Chargement…</div>}
          {!repLoading&&repError&&<div style={{background:"#FFEBEE",border:"1px solid #FFCDD2",borderRadius:12,padding:20}}><div style={{color:C.red,fontWeight:600,marginBottom:4}}>⚠️ {repError}</div><div style={{fontSize:11,color:"#555"}}>Vérifiez que node server.js est bien démarré.</div></div>}
          {!repLoading&&!repError&&!repData&&<div style={{background:"#fff",borderRadius:12,padding:40,textAlign:"center",color:C.muted,border:`1px solid ${C.border}`}}><div style={{fontSize:24,marginBottom:8}}>📊</div>Cliquez sur <strong>Actualiser</strong>.</div>}
          {!repLoading&&!repError&&repData&&(()=>{
            const {conseillers,saisiesMap,objMap,totaux}=repData;
            if(!conseillers||!conseillers.length) return <div style={{background:"#fff",borderRadius:12,padding:40,textAlign:"center",color:C.muted,border:`1px solid ${C.border}`}}><div style={{fontSize:24,marginBottom:8}}>📋</div><div style={{fontWeight:500,marginBottom:6}}>Aucune saisie pour {MONTHS[repMois-1]} {repYear}</div><div style={{fontSize:12}}>Connectez-vous en tant que conseiller et enregistrez des valeurs.</div></div>;
            const grandTotal=Object.values(totaux||{}).reduce((s,v)=>s+v,0);
            return(<div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{background:C.dark}}>
                  <th style={{padding:"10px 14px",textAlign:"left",color:"#fff",fontWeight:500,fontSize:11,minWidth:230,position:"sticky",left:0,background:C.dark,zIndex:2}}>Indicateur</th>
                  <th style={{padding:"10px 12px",textAlign:"right",color:C.gold,fontWeight:500,fontSize:11,minWidth:80}}>Objectif</th>
                  {conseillers.map(c=>(<th key={c.id} style={{padding:"10px 12px",textAlign:"center",color:"#fff",fontWeight:500,fontSize:11,minWidth:120,whiteSpace:"nowrap"}}><div>{c.nom}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.5)",fontWeight:400,marginTop:2}}>{c.role==="directeur"?"Directeur":"Conseiller"}</div></th>))}
                  <th style={{padding:"10px 12px",textAlign:"right",color:C.gold,fontWeight:700,fontSize:11,minWidth:80}}>Total</th>
                  <th style={{padding:"10px 12px",textAlign:"right",color:"#fff",fontWeight:500,fontSize:11,minWidth:70}}>Taux</th>
                </tr></thead>
                <tbody>
                  {CATEGORIES.map(cat=>{
                    const catInds=cat.indicators;
                    if(!catInds.length) return null;
                    return [
                      <tr key={`cat-${cat.id}`}><td colSpan={3+conseillers.length+1} style={{padding:"6px 14px",background:cat.color+"22",borderTop:`2px solid ${cat.color}`,fontWeight:700,fontSize:11,color:cat.color,textTransform:"uppercase",letterSpacing:"0.06em"}}>{cat.label}</td></tr>,
                      ...catInds.map((indName,idx)=>{
                        const objVal=getObj(indName)||0;
                        const total=conseillers.reduce((sum,c)=>sum+(saisiesMap[`${indName}###${c.id}`]||0),0);
                        const tx=objVal>0?taux(objVal,total):null;
                        return(<tr key={indName} style={{background:idx%2===0?"#FAFAFA":"#fff",borderBottom:`1px solid ${C.border}`}}>
                          <td style={{padding:"8px 14px",color:"#333",position:"sticky",left:0,background:idx%2===0?"#FAFAFA":"#fff",fontSize:12,borderLeft:`3px solid ${cat.color}`,lineHeight:1.4}}>{sn(indName)}</td>
                          <td style={{padding:"8px 12px",textAlign:"right",color:C.muted}}>{objVal||"—"}</td>
                          {conseillers.map(c=>{const val=saisiesMap[`${indName}###${c.id}`];return(<td key={c.id} style={{padding:"8px 12px",textAlign:"center",fontWeight:val===undefined||val===0?400:600,color:val===undefined||val===0?"#888":C.violet}}>{val!==undefined?val:0}</td>);})}
                          <td style={{padding:"8px 12px",textAlign:"right",fontWeight:700,color:total>0?C.dark:"#CCC",background:"#F5F0FA"}}>{total>0?total:"—"}</td>
                          <td style={{padding:"8px 12px",textAlign:"right",background:"#F5F0FA"}}><Badge v={tx}/></td>
                        </tr>);
                      })
                    ];
                  })}
                  <tr style={{background:C.dark,borderTop:`2px solid ${C.violet}`}}>
                    <td style={{padding:"10px 14px",fontWeight:700,color:C.gold,fontSize:12,position:"sticky",left:0,background:C.dark}}>TOTAL GÉNÉRAL</td>
                    <td/>
                    {conseillers.map(c=>(<td key={c.id} style={{padding:"10px 12px",textAlign:"center",fontWeight:700,color:"#fff",fontSize:13}}>{totaux[c.id]||0}</td>))}
                    <td style={{padding:"10px 12px",textAlign:"right",fontWeight:700,color:C.gold,fontSize:14}}>{grandTotal}</td>
                    <td/>
                  </tr>
                </tbody>
              </table></div>
            </div>);
          })()}
        </div>)}

        {/* ── ACTIVITÉ CONSEILLERS ── */}
        {view==="activites"&&<ViewActivites/>}

        {/* ── UTILISATEURS ── */}
        {view==="utilisateurs"&&(<div style={{maxWidth:800}}>
          <PageHeader title="👤 Gestion des utilisateurs"/>
          <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:C.light}}>{["Nom","Prénom","Email","Rôle","Date création","Statut","Action"].map((h,i)=>(<th key={h} style={{padding:"10px 14px",textAlign:i===0?"left":"center",fontWeight:500,color:C.muted,fontSize:11}}>{h}</th>))}</tr></thead>
              <tbody>
                {conseillers.length===0?<tr><td colSpan={7} style={{padding:"20px",textAlign:"center",color:C.muted,fontSize:12}}>Aucun utilisateur</td></tr>
                :conseillers.map(u=>(<tr key={u.id} style={{borderTop:`1px solid ${C.border}`}}>
                  <td style={{padding:"10px 14px",fontWeight:500,color:C.dark}}>{u.nom}</td>
                  <td style={{padding:"10px 14px",textAlign:"center"}}>{u.prenom}</td>
                  <td style={{padding:"10px 14px",textAlign:"center",color:C.violet}}>{u.email}</td>
                  <td style={{padding:"10px 14px",textAlign:"center"}}><span style={{background:u.role==="directeur"?C.violet+"22":"#E8F5E9",color:u.role==="directeur"?C.violet:C.green,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:500}}>{u.role==="directeur"?"Directeur":"Conseiller"}</span></td>
                  <td style={{padding:"10px 14px",textAlign:"center",fontSize:11,color:C.muted}}>{new Date(u.date_creation).toLocaleDateString("fr-MA")}</td>
                  <td style={{padding:"10px 14px",textAlign:"center"}}><span style={{background:u.actif?"#E8F5E9":"#FFEBEE",color:u.actif?C.green:C.red,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:500}}>{u.actif?"Actif":"Inactif"}</span></td>
                  <td style={{padding:"10px 14px",textAlign:"center"}}>{u.role==="conseiller"&&u.actif&&<button onClick={async()=>{await fetch(`${API}/utilisateurs/${u.id}`,{method:"DELETE"});fetchConseillers();}} style={{background:"#FFEBEE",color:C.red,border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"sans-serif"}}>Désactiver</button>}</td>
                </tr>))}
              </tbody>
            </table>
          </div>
          <button onClick={fetchConseillers} style={{...btnSecondary,marginTop:12}}>↻ Actualiser</button>
        </div>)}

        {/* ── MESSAGERIE ── */}
        {view==="messagerie"&&(<div style={{maxWidth:800}}>
          <PageHeader title="✉️ Messagerie" subtitle="Envoyer des notifications aux conseillers" />
          <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:16}}>
            {msgStatus==="ok"&&<div style={{background:"#E8F5E9",color:C.green,padding:"10px 16px",borderRadius:8,marginBottom:16,fontSize:13,fontWeight:500,border:"1px solid #A5D6A7"}}>✓ Message envoyé avec succès !</div>}
            {msgStatus==="error"&&<div style={{background:"#FFEBEE",color:C.red,padding:"10px 16px",borderRadius:8,marginBottom:16,fontSize:13,border:"1px solid #FFCDD2"}}>⚠️ Erreur lors de l'envoi du message.</div>}
            
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:8}}>1. Destinataires</label>
              <div style={{background:"#FAFAFA",border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 16px",maxHeight:150,overflowY:"auto"}}>
                <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,marginBottom:8,cursor:"pointer",paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
                  <input type="checkbox" checked={msgRecipients.length===conseillers.filter(c=>c.role==="conseiller").length} onChange={(e)=>{
                    if(e.target.checked) setMsgRecipients(conseillers.filter(c=>c.role==="conseiller").map(c=>c.id));
                    else setMsgRecipients([]);
                  }}/> <strong>Tous les conseillers</strong>
                </label>
                {conseillers.filter(c=>c.role==="conseiller").map(c=>(
                  <label key={c.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,marginBottom:6,cursor:"pointer"}}>
                    <input type="checkbox" checked={msgRecipients.includes(c.id)} onChange={(e)=>{
                      if(e.target.checked) setMsgRecipients([...msgRecipients, c.id]);
                      else setMsgRecipients(msgRecipients.filter(id=>id!==c.id));
                    }}/> {c.nom} {c.prenom}
                  </label>
                ))}
              </div>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:8}}>2. Type de message</label>
              <div style={{display:"flex",gap:10}}>
                {[{id:"information",l:"Information",c:"#1565C0",bg:"#E3F2FD"},{id:"rappel",l:"Rappel",c:C.orange,bg:"#FFF3E0"},{id:"urgente",l:"Urgente",c:C.red,bg:"#FFEBEE"}].map(t=>(
                  <button key={t.id} onClick={()=>setMsgType(t.id)} style={{flex:1,padding:"10px",border:`1px solid ${msgType===t.id?t.c:C.border}`,background:msgType===t.id?t.bg:"#fff",color:msgType===t.id?t.c:C.muted,borderRadius:8,cursor:"pointer",fontWeight:500,fontSize:13,transition:"all 0.15s"}}>{t.l}</button>
                ))}
              </div>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:8}}>3. Contenu</label>
              <input type="text" placeholder="Titre de la notification" value={msgTitre} onChange={e=>setMsgTitre(e.target.value)} style={{...inp,marginBottom:10}}/>
              <textarea placeholder="Message..." value={msgBody} onChange={e=>setMsgBody(e.target.value)} style={{...inp,minHeight:100,resize:"vertical"}}></textarea>
            </div>

            <button disabled={msgRecipients.length===0||!msgTitre||!msgBody||msgStatus==="sending"} onClick={async()=>{
              setMsgStatus("sending");
              try{
                const r=await fetch(`${API}/notifications/send`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_ids:msgRecipients,titre:msgTitre,message:msgBody,type_message:msgType})});
                if(!r.ok) throw new Error();
                setMsgStatus("ok");
                setMsgTitre(""); setMsgBody(""); setMsgRecipients([]);
                setTimeout(()=>setMsgStatus(""), 3000);
              }catch{ setMsgStatus("error"); setTimeout(()=>setMsgStatus(""), 3000); }
            }} style={{...btnPrimary,width:"100%",padding:"12px",opacity:(msgRecipients.length===0||!msgTitre||!msgBody||msgStatus==="sending")?0.6:1}}>
              {msgStatus==="sending"?"Envoi en cours...":`Envoyer à ${msgRecipients.length} conseiller(s)`}
            </button>
          </div>
        </div>)}

      </div>
    </div>
  );
}