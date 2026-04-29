import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase.js";

// ─── LOGO SVG ─────────────────────────────────────────────────────────────────
const LogoMark = ({ height = 36, collapsed = false }) => collapsed ? (
  <svg height={height} width={height} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="40" height="40" fill="#1C1C1C" rx="6"/>
    <rect x="4" y="4" width="4" height="32" fill="#F5B800" rx="2"/>
    <text x="12" y="18" fontFamily="Barlow Condensed,sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF">CM</text>
    <text x="12" y="30" fontFamily="Barlow Condensed,sans-serif" fontWeight="700" fontSize="9" fill="#F5B800">4.0</text>
  </svg>
) : (
  <svg height={height} viewBox="0 0 210 40" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
    <rect x="0" y="0" width="5" height="40" fill="#F5B800" rx="2"/>
    <rect x="0" y="0" width="210" height="2" fill="#F5B800" rx="1"/>
    <rect x="0" y="38" width="210" height="2" fill="#1A4D2E" rx="1"/>
    <text x="11" y="15" fontFamily="Barlow Condensed,sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="1">CENTRAL</text>
    <text x="11" y="29" fontFamily="Barlow Condensed,sans-serif" fontWeight="900" fontSize="13" fill="#F5B800" letterSpacing="0.5">MARCENARIA</text>
    <text x="157" y="29" fontFamily="Barlow Condensed,sans-serif" fontWeight="700" fontSize="10" fill="#888888">4.0</text>
  </svg>
);

// ─── GOOGLE FONTS ─────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
    :root {
      --yellow: #F5B800; --yellow-dark: #D9A200;
      --green: #1A4D2E; --green-light: #22863a;
      --black: #0F0F0F; --gray-dark: #1C1C1C; --gray-mid: #2A2A2A;
      --gray: #3D3D3D; --gray-light: #888; --off-white: #F7F4EE; --white: #FFFFFF;
      --red: #C8102E; --orange: #E87722;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--black); color: var(--white); font-family: 'DM Sans', sans-serif; }
    .barlow { font-family: 'Barlow Condensed', sans-serif; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--gray-dark); }
    ::-webkit-scrollbar-thumb { background: var(--gray); border-radius: 3px; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .fade-in { animation: fadeIn 0.4s ease forwards; }
    .spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,0.2); border-top-color:#F5B800; border-radius:50%; animation:spin 0.7s linear infinite; }
    .btn-primary { background:var(--yellow); color:var(--black); border:none; border-radius:6px; padding:12px 24px; font-family:'Barlow Condensed',sans-serif; font-size:16px; font-weight:700; letter-spacing:.5px; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:8px; }
    .btn-primary:hover { background:var(--yellow-dark); transform:translateY(-1px); box-shadow:0 4px 16px rgba(245,184,0,.3); }
    .btn-primary:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
    .btn-ghost { background:transparent; color:var(--gray-light); border:1.5px solid var(--gray); border-radius:6px; padding:10px 20px; font-family:'DM Sans',sans-serif; font-size:14px; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:6px; }
    .btn-ghost:hover { border-color:var(--gray-light); color:var(--white); }
    .btn-green { background:var(--green); color:white; border:none; border-radius:6px; padding:10px 20px; font-family:'Barlow Condensed',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:6px; }
    .btn-green:hover { background:var(--green-light); }
    .card { background:var(--gray-dark); border:1px solid var(--gray); border-radius:12px; padding:20px; }
    .input-field { background:var(--gray-mid); border:1.5px solid var(--gray); border-radius:8px; color:var(--white); padding:12px 16px; font-family:'DM Sans',sans-serif; font-size:14px; width:100%; transition:border-color .2s; outline:none; }
    .input-field:focus { border-color:var(--yellow); }
    .input-field::placeholder { color:var(--gray-light); }
    textarea.input-field { resize:vertical; min-height:100px; }
    .search-field { background:var(--gray-mid); border:1.5px solid var(--gray); border-radius:8px; color:var(--white); padding:10px 14px 10px 38px; font-family:'DM Sans',sans-serif; font-size:14px; width:100%; transition:border-color .2s; outline:none; }
    .search-field:focus { border-color:var(--yellow); }
    .search-field::placeholder { color:var(--gray-light); }
    .badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .badge-yellow { background:rgba(245,184,0,.15); color:var(--yellow); }
    .badge-green { background:rgba(26,107,46,.2); color:#4caf72; }
    .badge-orange { background:rgba(232,119,34,.15); color:var(--orange); }
    .badge-blue { background:rgba(21,101,192,.15); color:#64b5f6; }
    .badge-gray { background:rgba(100,100,100,.2); color:var(--gray-light); }
    .step-dot { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; transition:all .3s; }
    .upload-zone { border:2px dashed var(--gray); border-radius:12px; padding:28px; text-align:center; cursor:pointer; transition:all .2s; }
    .upload-zone:hover { border-color:var(--yellow); background:rgba(245,184,0,.04); }
    .chat-bubble { max-width:75%; padding:10px 14px; border-radius:12px; font-size:14px; line-height:1.5; }
    .chat-mine { background:var(--yellow); color:var(--black); border-bottom-right-radius:4px; }
    .chat-other { background:var(--gray-mid); color:var(--white); border-bottom-left-radius:4px; }
    .sidebar-item { display:flex; align-items:center; gap:12px; padding:10px 16px; border-radius:8px; font-size:14px; color:var(--gray-light); cursor:pointer; transition:all .2s; }
    .sidebar-item:hover { background:var(--gray-mid); color:var(--white); }
    .sidebar-item.active { background:rgba(245,184,0,.12); color:var(--yellow); border-left:3px solid var(--yellow); }
    .table-row { display:grid; padding:14px 16px; border-bottom:1px solid var(--gray-mid); align-items:center; transition:background .15s; }
    .table-row:hover { background:rgba(255,255,255,.03); }
    .table-header { color:var(--gray-light); font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.8px; }
    .msg-dot { width:9px; height:9px; border-radius:50%; background:#ef5350; display:inline-block; flex-shrink:0; box-shadow:0 0 6px rgba(239,83,80,.6); animation:pulseDot 1.5s infinite; }
    @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.3)} }
    .modal-overlay { position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,.75); z-index:500; display:flex; align-items:center; justify-content:center; }
    .highlight { background:rgba(245,184,0,.25); border-radius:3px; padding:0 2px; color:var(--yellow); font-weight:600; }
  `}</style>
);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const matchSearch = (order, term) => {
  if (!term.trim()) return true;
  const q = term.toLowerCase().trim();
  const title = (order.title||"").toLowerCase();
  const client = (order.client_name||"").toLowerCase();
  const otMatch = order.title?.match(/\[OT:([^\]]+)\]/i);
  const ot = otMatch ? otMatch[1].toLowerCase() : "";
  return title.includes(q) || client.includes(q) || ot.includes(q);
};

const Highlight = ({ text, term }) => {
  if (!term.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(term.toLowerCase().trim());
  if (idx === -1) return <>{text}</>;
  return <>{text.slice(0,idx)}<mark className="highlight">{text.slice(idx,idx+term.trim().length)}</mark>{text.slice(idx+term.trim().length)}</>;
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  aguardando:  { label:"Aguardando Análise", color:"gray",   icon:"⏳", step:0 },
  analise:     { label:"Em Análise",         color:"blue",   icon:"🔍", step:1 },
  corte:       { label:"Em Corte",           color:"orange", icon:"🪚", step:2 },
  filetamento: { label:"Filetamento",        color:"orange", icon:"📐", step:3 },
  pronto:      { label:"Pronto p/ Retirada", color:"green",  icon:"✅", step:4 },
  entregue:    { label:"Entregue",           color:"green",  icon:"🚚", step:5 },
};
const STEPS = [
  { key:"aguardando",  label:"Aguardando", icon:"📋" },
  { key:"analise",     label:"Análise",    icon:"🔍" },
  { key:"corte",       label:"Corte",      icon:"🪚" },
  { key:"filetamento", label:"Filetamento",icon:"📐" },
  { key:"pronto",      label:"Pronto!",    icon:"✅" },
];
const NEXT_STATUS = { aguardando:"analise", analise:"corte", corte:"filetamento", filetamento:"pronto", pronto:"entregue" };

// Status que NÃO aparecem na lista "Pedidos em Andamento" do cliente
const STATUSES_CONCLUIDOS = ["entregue"];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size=18 }) => {
  const icons = {
    home:     "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    orders:   "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    send:     "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
    logout:   "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    plus:     "M12 4v16m8-8H4",
    arrow:    "M10 19l-7-7m0 0l7-7m-7 7h18",
    users:    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    building: "M3 21h18 M3 7l9-4 9 4 M4 11h16v10H4V11z M9 21v-6h6v6",
    paperclip:"M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48",
    search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
    x:        "M18 6L6 18 M6 6l12 12",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(icons[name]||"").split(" M").map((d,i)=><path key={i} d={i===0?d:"M"+d}/>)}
    </svg>
  );
};

const SearchInput = ({ value, onChange, placeholder="Buscar por ambiente, cliente ou OT..." }) => (
  <div style={{position:"relative",flex:1}}>
    <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--gray-light)",pointerEvents:"none",display:"flex"}}>
      <Icon name="search" size={15}/>
    </div>
    <input className="search-field" placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}/>
    {value && (
      <button onClick={()=>onChange("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--gray-light)",cursor:"pointer",display:"flex",padding:2}}>
        <Icon name="x" size={14}/>
      </button>
    )}
  </div>
);

const StatusBadge = ({ status, subStatus }) => {
  const cfg = STATUS_CONFIG[status]||STATUS_CONFIG.aguardando;
  return (
    <span style={{display:"inline-flex",flexDirection:"column",gap:3,alignItems:"flex-start"}}>
      <span className={`badge badge-${cfg.color}`}>{cfg.icon} {cfg.label}</span>
      {subStatus==="aguardando_chapa" && <span className="badge badge-orange" style={{fontSize:11,padding:"3px 8px"}}>🧱 Aguard. Chapa</span>}
    </span>
  );
};

const StatusSteps = ({ currentStatus, stepHistory={}, createdAt }) => {
  const currentStep = STATUS_CONFIG[currentStatus]?.step ?? 0;
  return (
    <div style={{margin:"20px 0"}}>
      <div style={{display:"flex",alignItems:"flex-start"}}>
        {STEPS.map((step,i) => {
          const done=i<currentStep, active=i===currentStep;
          const ts = stepHistory[step.key] || (step.key==="aguardando" && createdAt ? createdAt : null);
          return (
            <div key={step.key} style={{display:"flex",alignItems:"center",flex:1}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,minWidth:70}}>
                <div className="step-dot" style={{background:done?"#4caf72":active?"var(--yellow)":"var(--gray-mid)",color:active?"var(--black)":done?"white":"var(--gray-light)",boxShadow:active?"0 0 16px rgba(245,184,0,.4)":done?"0 0 8px rgba(76,175,114,.3)":"none",border:(!done&&!active)?"2px solid var(--gray)":"none"}}>
                  {done?"✓":step.icon}
                </div>
                <span style={{fontSize:10,textAlign:"center",color:active?"var(--yellow)":done?"#4caf72":"var(--gray-light)",fontWeight:active?700:400,lineHeight:1.3}}>{step.label}</span>
                {ts && <span style={{fontSize:9,color:"var(--gray-light)",textAlign:"center",lineHeight:1.2}}>{new Date(ts).toLocaleDateString("pt-BR")}<br/>{new Date(ts).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span>}
              </div>
              {i<STEPS.length-1 && <div style={{flex:1,height:3,borderRadius:2,marginBottom:32,background:i<currentStep?"#4caf72":"var(--gray-mid)",transition:"background .3s"}}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Loading = ({ text="Carregando..." }) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:300,gap:16}}>
    <div className="spinner" style={{width:36,height:36}}/>
    <span style={{color:"var(--gray-light)",fontSize:14}}>{text}</span>
  </div>
);

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [tab,setTab]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [accessKey,setAccessKey]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const {data,error:err} = await supabase.auth.signInWithPassword({email,password});
      if (err) { setError("E-mail ou senha incorretos."); setLoading(false); return; }
      if (!data?.user) { setError("Erro ao fazer login."); setLoading(false); return; }
      let profile=null;
      try { const {data:p}=await supabase.from("profiles").select("*").eq("id",data.user.id).maybeSingle(); profile=p; } catch(e){}
      onLogin({...data.user,name:profile?.name||data.user.email?.split("@")[0]||"Usuário",phone:profile?.phone||"",role:profile?.role||"client",company_id:profile?.company_id||null});
    } catch(e) { setError("Erro de conexão."); }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!name||!email||!password||!phone) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    const {data,error:err} = await supabase.auth.signUp({email,password});
    if (err) { setError(err.message); setLoading(false); return; }
    let company_id=null;
    if (accessKey.trim()) {
      const {data:comp} = await supabase.from("companies").select("id").eq("access_key",accessKey.trim()).maybeSingle();
      if (!comp) { setError("Chave de empresa inválida."); setLoading(false); return; }
      company_id=comp.id;
    }
    await supabase.from("profiles").upsert({id:data.user.id,name,phone,role:"client",email,company_id},{onConflict:"id"});
    onLogin({...data.user,name,phone,role:"client",email,company_id});
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--black)",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"16px 32px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid var(--gray-mid)"}}>
        <LogoMark height={40}/>
        <div style={{marginLeft:"auto",fontSize:13,color:"var(--gray-light)"}}>centralmarcenaria.com.br</div>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{display:"flex",gap:56,alignItems:"center",maxWidth:900,width:"100%"}}>
          <div className="fade-in" style={{flex:1}}>
            <div className="barlow" style={{fontSize:56,fontWeight:900,lineHeight:1,color:"var(--white)"}}>
              CENTRAL<br/><span style={{color:"var(--yellow)"}}>MARCENARIA</span><br/>
              <span style={{color:"var(--gray-light)",fontSize:42}}>4.0</span>
            </div>
            <p style={{color:"var(--gray-light)",fontSize:15,marginTop:16,lineHeight:1.7,maxWidth:400}}>
              Envie seus projetos de corte CNC e filetamento, acompanhe o status em tempo real e retire na Central.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:24}}>
              {[["🪚","Corte CNC / Nesting","Envie seu arquivo DXF ou CNC"],["📐","Filetamento Automático","Bordas ABS, PVC em MDF"],["📦","Pedido em Tempo Real","Notificação quando pronto"]].map(([ic,lb,ds])=>(
                <div key={lb} style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:36,height:36,borderRadius:8,background:"var(--gray-mid)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{ic}</div>
                  <div><div style={{fontSize:14,fontWeight:600}}>{lb}</div><div style={{fontSize:12,color:"var(--gray-light)"}}>{ds}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="fade-in card" style={{width:360,flexShrink:0}}>
            <div style={{display:"flex",gap:4,marginBottom:22,background:"var(--gray-mid)",borderRadius:8,padding:4}}>
              {["login","register"].map(t=>(
                <button key={t} onClick={()=>{setTab(t);setError("");}} style={{flex:1,padding:"8px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"Barlow Condensed,sans-serif",fontSize:15,fontWeight:700,background:tab===t?"var(--yellow)":"transparent",color:tab===t?"var(--black)":"var(--gray-light)",transition:"all .2s"}}>
                  {t==="login"?"ENTRAR":"CADASTRAR"}
                </button>
              ))}
            </div>
            {error && <div style={{background:"rgba(200,16,46,.12)",border:"1px solid rgba(200,16,46,.3)",borderRadius:8,padding:"10px 14px",color:"#ef5350",fontSize:13,marginBottom:14}}>⚠️ {error}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              {tab==="register" && <>
                <div><label style={{fontSize:12,color:"var(--gray-light)",display:"block",marginBottom:5}}>NOME COMPLETO</label><input className="input-field" placeholder="João Silva" value={name} onChange={e=>setName(e.target.value)}/></div>
                <div><label style={{fontSize:12,color:"var(--gray-light)",display:"block",marginBottom:5}}>TELEFONE / WHATSAPP</label><input className="input-field" placeholder="(31) 99999-0000" value={phone} onChange={e=>setPhone(e.target.value)}/></div>
                <div>
                  <label style={{fontSize:12,color:"var(--gray-light)",display:"block",marginBottom:5}}>CHAVE DA EMPRESA <span style={{fontSize:10}}>· opcional</span></label>
                  <input className="input-field" placeholder="Ex: 123456" value={accessKey} onChange={e=>setAccessKey(e.target.value)} maxLength={8}/>
                  <div style={{fontSize:11,color:"var(--gray-light)",marginTop:3}}>Solicite ao gestor da empresa se houver.</div>
                </div>
              </>}
              <div><label style={{fontSize:12,color:"var(--gray-light)",display:"block",marginBottom:5}}>E-MAIL</label><input className="input-field" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(tab==="login"?handleLogin():handleRegister())}/></div>
              <div><label style={{fontSize:12,color:"var(--gray-light)",display:"block",marginBottom:5}}>SENHA</label><input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(tab==="login"?handleLogin():handleRegister())}/></div>
              <button className="btn-primary" style={{width:"100%",justifyContent:"center",marginTop:4,padding:14,fontSize:17}} onClick={tab==="login"?handleLogin:handleRegister} disabled={loading}>
                {loading?<><div className="spinner"/>Aguarde...</>:tab==="login"?"→ ENTRAR":"→ CRIAR CONTA"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"14px 32px",borderTop:"1px solid var(--gray-mid)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:12,color:"var(--gray-light)"}}>Av. Acesita, nº 1.080, Olaria — Timóteo/MG</span>
        <span style={{fontSize:12,color:"var(--gray-light)"}}>🔗 marceneiroshop.com.br · @marceneiroshop</span>
      </div>
    </div>
  );
};

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
const Layout = ({ user, activeTab, setActiveTab, onLogout, children }) => {
  const [collapsed,setCollapsed]=useState(false);
  const isAdmin=user.role==="admin";
  const sideW=collapsed?64:220;
  const nav=isAdmin
    ?[{key:"dashboard",icon:"home",label:"Dashboard"},{key:"orders",icon:"orders",label:"Todos os Pedidos"},{key:"users",icon:"users",label:"Clientes"},{key:"companies",icon:"building",label:"Empresas"}]
    :[{key:"dashboard",icon:"home",label:"Dashboard"},{key:"new-order",icon:"plus",label:"Novo Pedido"},{key:"orders",icon:"orders",label:"Meus Pedidos"}];
  return (
    <div style={{display:"flex",minHeight:"100vh"}}>
      <div style={{width:sideW,background:"var(--gray-dark)",borderRight:"1px solid var(--gray-mid)",display:"flex",flexDirection:"column",flexShrink:0,position:"fixed",height:"100vh",left:0,top:0,transition:"width .25s ease",overflow:"hidden",zIndex:100}}>
        <div style={{padding:"12px",borderBottom:"1px solid var(--gray-mid)",display:"flex",alignItems:"center",gap:8,justifyContent:collapsed?"center":"space-between",minHeight:60}}>
          <LogoMark height={32} collapsed={collapsed}/>
          <button onClick={()=>setCollapsed(c=>!c)} style={{background:"var(--gray-mid)",border:"1px solid var(--gray)",borderRadius:6,color:"var(--gray-light)",cursor:"pointer",padding:"4px 8px",fontSize:14,flexShrink:0,lineHeight:1}} title={collapsed?"Expandir":"Recolher"}>
            {collapsed?"▶":"◀"}
          </button>
        </div>
        <div style={{padding:"10px 12px",borderBottom:"1px solid var(--gray-mid)",display:"flex",alignItems:"center",gap:8,justifyContent:collapsed?"center":"flex-start"}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:isAdmin?"var(--green)":"var(--yellow)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:isAdmin?"white":"var(--black)",flexShrink:0}}>
            {(user.name||user.email||"?").charAt(0).toUpperCase()}
          </div>
          {!collapsed && <div>
            <div style={{fontSize:12,fontWeight:600}}>{(user.name||user.email||"").split(" ")[0]}</div>
            <div style={{fontSize:10,color:isAdmin?"var(--green-light)":"var(--gray-light)"}}>{isAdmin?"🔧 Admin":"👤 Cliente"}</div>
          </div>}
        </div>
        <nav style={{padding:"10px 8px",flex:1,display:"flex",flexDirection:"column",gap:2}}>
          {nav.map(item=>(
            <div key={item.key} className={`sidebar-item ${activeTab===item.key?"active":""}`} onClick={()=>setActiveTab(item.key)} title={item.label} style={{justifyContent:collapsed?"center":"flex-start",padding:collapsed?"10px 0":"10px 14px"}}>
              <Icon name={item.icon} size={17}/>
              {!collapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>
        <div style={{padding:"10px 8px",borderTop:"1px solid var(--gray-mid)"}}>
          <div className="sidebar-item" onClick={onLogout} title="Sair" style={{justifyContent:collapsed?"center":"flex-start",padding:collapsed?"10px 0":"10px 14px"}}>
            <Icon name="logout" size={17}/>
            {!collapsed && <span>Sair</span>}
          </div>
        </div>
      </div>
      <div style={{flex:1,marginLeft:sideW,overflow:"auto",transition:"margin-left .25s ease"}}>
        <div className="fade-in" style={{padding:"24px 28px"}}>{children}</div>
      </div>
    </div>
  );
};

// ─── CLIENT DASHBOARD ─────────────────────────────────────────────────────────
const ClientDashboard = ({ user, orders, setActiveTab, setSelectedOrder }) => {
  const prontos = orders.filter(o=>o.status==="pronto").length;
  // "Em andamento" = tudo que não é pronto nem entregue
  const emAnd = orders.filter(o=>!["pronto","entregue"].includes(o.status)).length;
  // Lista do dashboard: exclui entregue (pedidos encerrados saem da visão principal)
  const pedidosAtivos = orders.filter(o=>o.status!=="entregue");
  const stepIndex = (status) => STATUS_CONFIG[status]?.step ?? 0;

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div className="barlow" style={{fontSize:34,fontWeight:800}}>Olá, {(user.name||"").split(" ")[0]}! 👋</div>
        <p style={{color:"var(--gray-light)",fontSize:14,marginTop:4}}>Bem-vindo ao portal da Central Marcenaria 4.0.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        {[["Total de Pedidos",orders.length,"📋","var(--yellow)"],["Em Andamento",emAnd,"⚙️","var(--orange)"],["Prontos p/ Retirada",prontos,"✅","#4caf72"]].map(([label,value,icon,color])=>(
          <div key={label} className="card" style={{borderLeft:`3px solid ${color}`,padding:"14px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:12,color:"var(--gray-light)",marginBottom:4}}>{label}</div><div className="barlow" style={{fontSize:40,fontWeight:900,color,lineHeight:1}}>{value}</div></div>
              <span style={{fontSize:28}}>{icon}</span>
            </div>
          </div>
        ))}
      </div>
      {prontos>0 && (
        <div style={{background:"rgba(26,107,46,.12)",border:"1px solid rgba(26,107,46,.4)",borderRadius:12,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontSize:24}}>🎉</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,color:"#4caf72",fontSize:14}}>Você tem {prontos} pedido(s) prontos para retirada!</div>
            <div style={{fontSize:12,color:"var(--gray-light)",marginTop:2}}>Av. Acesita, nº 1.080, Olaria - Timóteo/MG</div>
          </div>
          <button className="btn-green" onClick={()=>setActiveTab("orders")}>Ver Pedidos</button>
        </div>
      )}
      <div className="card" style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div className="barlow" style={{fontSize:20,fontWeight:700}}>Pedidos em Andamento</div>
          <button className="btn-ghost" onClick={()=>setActiveTab("orders")} style={{fontSize:12}}>Ver todos</button>
        </div>
        {/* FIX: exclui pedidos com status "entregue" desta lista */}
        {pedidosAtivos.length===0 ? (
          <div style={{textAlign:"center",padding:28,color:"var(--gray-light)"}}>
            <div style={{fontSize:36,marginBottom:10}}>📂</div>
            <div>Nenhum pedido em andamento.</div>
            <button className="btn-primary" style={{marginTop:14}} onClick={()=>setActiveTab("new-order")}><Icon name="plus" size={16}/>Criar Primeiro Pedido</button>
          </div>
        ) : pedidosAtivos.slice(0,5).map(o=>{
          const step=stepIndex(o.status);
          const hasUnread=(o.unread_count||0)>0;
          return (
            <div key={o.id} style={{padding:"14px 0",borderBottom:"1px solid var(--gray-mid)",cursor:"pointer"}} onClick={()=>{setSelectedOrder(o);setActiveTab("order-detail");}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontWeight:600,fontSize:14}}>{o.title}</span>
                  <span style={{fontSize:12,color:"var(--gray-light)"}}>{o.display_id}</span>
                  {user.company_id && o.client_id!==user.id && <span style={{fontSize:11,color:"var(--yellow)",fontWeight:600,background:"rgba(245,184,0,.1)",padding:"2px 7px",borderRadius:10}}>👤 {o.client_name}</span>}
                  {hasUnread && <span className="msg-dot" title="Nova mensagem"/>}
                </div>
                <StatusBadge status={o.status} subStatus={o.sub_status}/>
              </div>
              <div style={{display:"flex",alignItems:"flex-start",gap:2}}>
                {STEPS.map((s,i)=>(
                  <div key={s.key} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{width:"100%",height:5,borderRadius:3,background:i<step?"#4caf72":i===step?"#66bb6a":"var(--gray-mid)",transition:"background .3s",boxShadow:i===step?"0 0 8px rgba(102,187,106,.5)":"none"}}/>
                    <span style={{fontSize:12,color:i===step?"#66bb6a":i<step?"#4caf72":"var(--gray-light)",fontWeight:i===step?700:400,textAlign:"center",lineHeight:1.3,whiteSpace:"nowrap"}}>{s.icon} {s.label}</span>
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,color:"var(--gray-light)",marginTop:6}}>Etapa {step+1} de 5 · {new Date(o.created_at).toLocaleDateString("pt-BR")}</div>
            </div>
          );
        })}
      </div>
      <div className="card" style={{background:"linear-gradient(135deg,rgba(245,184,0,.08),rgba(26,77,46,.12))",border:"1px solid rgba(245,184,0,.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div className="barlow" style={{fontSize:20,fontWeight:800,color:"var(--yellow)"}}>NOVO PEDIDO DE CORTE?</div>
            <p style={{color:"var(--gray-light)",fontSize:13,marginTop:4}}>Envie seu projeto e acompanhe cada etapa em tempo real.</p>
          </div>
          <button className="btn-primary" onClick={()=>setActiveTab("new-order")}><Icon name="plus" size={16}/>Criar Pedido</button>
        </div>
      </div>
    </div>
  );
};

// ─── NEW ORDER ────────────────────────────────────────────────────────────────
const NewOrder = ({ user, onSubmit }) => {
  const [title,setTitle]=useState("");
  const [clientName,setClientName]=useState("");
  const [ot,setOt]=useState("");
  const [description,setDescription]=useState("");
  const [files,setFiles]=useState([]);
  const [images,setImages]=useState([]);
  const [loading,setLoading]=useState(false);
  const [submitted,setSubmitted]=useState(null);
  const fileRef=useRef(); const imgRef=useRef();

  const handleFileAdd=(e,type)=>{ const arr=Array.from(e.target.files||[]); if(type==="file") setFiles(p=>[...p,...arr]); else setImages(p=>[...p,...arr]); };

  const handleSubmit = async () => {
    if (!title||!description) return;
    setLoading(true);
    try {
      const display_id="CM-"+Date.now().toString().slice(-5);
      const fullTitle=`${title}${clientName?" — "+clientName:""}${ot?" [OT:"+ot+"]":""}`;
      const {data:order,error} = await supabase.from("orders").insert({
        display_id, client_id:user.id, client_name:user.name||user.email,
        title:fullTitle, description, status:"aguardando",
        company_id:user.company_id||null
      }).select().single();
      if (error) { console.error(error); setLoading(false); return; }
      const uploadWithTimeout=(file,path)=>Promise.race([
        supabase.storage.from("order-files").upload(path,file,{upsert:true}),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error("timeout")),15000))
      ]);
      for (const {file,isImage} of [...files.map(f=>({file:f,isImage:false})),...images.map(f=>({file:f,isImage:true}))]) {
        try {
          const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
          const path=`${order.id}/${Date.now()}-${safeName}`;
          const result=await uploadWithTimeout(file,path);
          if (result.error) continue;
          const {data:{publicUrl}}=supabase.storage.from("order-files").getPublicUrl(path);
          await supabase.from("order_files").insert({order_id:order.id,name:file.name,size:(file.size/1024).toFixed(0)+" KB",type:file.name.split(".").pop(),url:publicUrl,is_image:isImage});
        } catch(e) { console.error("Upload falhou:",e.message); }
      }
      setSubmitted(order);
    } catch(err) { console.error(err); }
    setLoading(false);
  };

  const resetForm=()=>{ setSubmitted(null);setTitle("");setClientName("");setOt("");setDescription("");setFiles([]);setImages([]); };

  return (
    <>
      {submitted && (
        <div className="modal-overlay" style={{zIndex:9999}}>
          <div style={{background:"var(--gray-dark)",border:"1px solid rgba(76,175,114,.3)",borderRadius:16,padding:"36px 32px",maxWidth:460,width:"90%",textAlign:"center",animation:"fadeIn .3s ease",boxShadow:"0 20px 60px rgba(0,0,0,.8)"}}>
            <div style={{width:68,height:68,borderRadius:"50%",background:"rgba(76,175,114,.15)",border:"3px solid #4caf72",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 16px"}}>✅</div>
            <div className="barlow" style={{fontSize:28,fontWeight:900,marginBottom:6}}>PEDIDO ENVIADO!</div>
            <div style={{fontSize:13,color:"var(--gray-light)",marginBottom:20}}>Sua solicitação foi recebida com sucesso</div>
            <div style={{background:"rgba(245,184,0,.08)",border:"1px solid rgba(245,184,0,.15)",borderRadius:10,padding:"14px 18px",marginBottom:20,textAlign:"left"}}>
              <div style={{fontSize:11,color:"var(--gray-light)",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>Número do pedido</div>
              <div style={{fontSize:22,fontWeight:800,color:"var(--yellow)",marginBottom:12}}>{submitted.display_id}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,fontSize:13}}>
                <div style={{display:"flex",gap:8}}><span>📊</span><span>Acompanhe no <strong>painel</strong> em tempo real</span></div>
                <div style={{display:"flex",gap:8}}><span>💬</span><span>Use o <strong>chat interno</strong> para dúvidas ou enviar mais arquivos</span></div>
                <div style={{display:"flex",gap:8}}><span>📲</span><span>Notificação quando <strong>pronto para retirada</strong></span></div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="btn-primary" onClick={()=>{setSubmitted(null);onSubmit();}}>OK, ver meus pedidos →</button>
              <button className="btn-ghost" style={{fontSize:13}} onClick={resetForm}>Novo Pedido</button>
            </div>
          </div>
        </div>
      )}
      <div>
        <div style={{marginBottom:20}}>
          <div className="barlow" style={{fontSize:30,fontWeight:800}}>Novo Pedido</div>
          <p style={{color:"var(--gray-light)",fontSize:14,marginTop:4}}>Preencha as informações e anexe os arquivos do projeto.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            <div className="card">
              <div className="barlow" style={{fontSize:17,fontWeight:700,marginBottom:14}}>Informações do Pedido</div>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={{fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5}}>AMBIENTE *</label><input className="input-field" placeholder="Ex: Sala de Estar, Cozinha..." value={title} onChange={e=>setTitle(e.target.value)}/></div>
                  <div><label style={{fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5}}>CLIENTE (SOLICITANTE)</label><input className="input-field" placeholder="Nome do cliente final" value={clientName} onChange={e=>setClientName(e.target.value)}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:12}}>
                  <div><label style={{fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5}}>Nº OT</label><input className="input-field" placeholder="Ex: 1042" type="number" value={ot} onChange={e=>setOt(e.target.value)}/></div>
                  <div><label style={{fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5}}>DESCRIÇÃO DETALHADA *</label><input className="input-field" placeholder="Material, espessura, tipo de borda, quantidade de peças..." value={description} onChange={e=>setDescription(e.target.value)}/></div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="barlow" style={{fontSize:17,fontWeight:700,marginBottom:12}}>📁 Arquivos de Relatórios</div>
              <div className="upload-zone" onClick={()=>fileRef.current.click()}>
                <input ref={fileRef} type="file" multiple style={{display:"none"}} onChange={e=>handleFileAdd(e,"file")} accept=".dxf,.cnc,.dwg,.pdf,.svg,.nc,.zip"/>
                <div style={{fontSize:28,marginBottom:6}}>📂</div>
                <div style={{fontWeight:600,marginBottom:3}}>Clique para enviar arquivos</div>
                <div style={{fontSize:12,color:"var(--gray-light)"}}>DXF, CNC, DWG, PDF, SVG, NC, ZIP</div>
              </div>
              {files.length>0 && <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
                {files.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"var(--gray-mid)",borderRadius:8,padding:"9px 12px"}}>
                    <span>📄</span>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{f.name}</div><div style={{fontSize:11,color:"var(--gray-light)"}}>{(f.size/1024).toFixed(0)} KB</div></div>
                    <button onClick={()=>setFiles(files.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--gray-light)",cursor:"pointer",fontSize:18}}>×</button>
                  </div>
                ))}
              </div>}
            </div>
            <div className="card">
              <div className="barlow" style={{fontSize:17,fontWeight:700,marginBottom:12}}>🖼️ Imagens do Projeto</div>
              <div className="upload-zone" onClick={()=>imgRef.current.click()}>
                <input ref={imgRef} type="file" multiple style={{display:"none"}} onChange={e=>handleFileAdd(e,"image")} accept="image/*"/>
                <div style={{fontSize:28,marginBottom:6}}>🖼️</div>
                <div style={{fontWeight:600,marginBottom:3}}>Adicionar imagens</div>
                <div style={{fontSize:12,color:"var(--gray-light)"}}>JPG, PNG, WEBP</div>
              </div>
              {images.length>0 && <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
                {images.map((img,i)=>(
                  <div key={i} style={{background:"var(--gray-mid)",borderRadius:8,padding:"7px 11px",display:"flex",alignItems:"center",gap:7,fontSize:13}}>
                    🖼️ {img.name}
                    <button onClick={()=>setImages(images.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--gray-light)",cursor:"pointer"}}>×</button>
                  </div>
                ))}
              </div>}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="card" style={{borderColor:"rgba(245,184,0,.3)"}}>
              <div className="barlow" style={{fontSize:17,fontWeight:700,marginBottom:12,color:"var(--yellow)"}}>Resumo</div>
              <div style={{display:"flex",flexDirection:"column",gap:9,fontSize:13}}>
                {title && <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"var(--gray-light)"}}>Ambiente</span><span style={{fontWeight:500,textAlign:"right",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title}</span></div>}
                {clientName && <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"var(--gray-light)"}}>Cliente</span><span>{clientName}</span></div>}
                {ot && <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"var(--gray-light)"}}>Nº OT</span><span style={{color:"var(--yellow)",fontWeight:600}}>{ot}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"var(--gray-light)"}}>Arquivos</span><span>{files.length}</span></div>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"var(--gray-light)"}}>Imagens</span><span>{images.length}</span></div>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"var(--gray-light)"}}>Status</span><StatusBadge status="aguardando"/></div>
              </div>
              <div style={{borderTop:"1px solid var(--gray)",margin:"14px 0"}}/>
              <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:13,fontSize:16,opacity:(!title||!description)?0.5:1}} onClick={handleSubmit} disabled={!title||!description||loading}>
                {loading?<><div className="spinner"/>Enviando...</>:"🚀 LIBERAR PEDIDO"}
              </button>
              <p style={{fontSize:11,color:"var(--gray-light)",textAlign:"center",marginTop:7}}>A equipe da Central será notificada.</p>
            </div>
            <div className="card" style={{background:"rgba(26,77,46,.1)"}}>
              <div style={{fontSize:13,color:"var(--gray-light)",lineHeight:1.9}}>
                <div style={{fontWeight:600,color:"var(--white)",marginBottom:8}}>💡 Dicas para seu pedido:</div>
                <div>• Informe o <strong style={{color:"var(--white)"}}>ambiente</strong> (sala, cozinha, etc.)</div>
                <div>• Anexe o arquivo <strong style={{color:"var(--white)"}}>DXF ou CNC</strong> do projeto</div>
                <div>• Especifique <strong style={{color:"var(--white)"}}>material e espessura</strong></div>
                <div>• Use o <strong style={{color:"var(--white)"}}>chat interno</strong> para mais arquivos depois</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── ORDER LIST ───────────────────────────────────────────────────────────────
const OrderList = ({ user, orders, setSelectedOrder, setActiveTab, initialFilter="all" }) => {
  const [filter,setFilter]=useState(initialFilter);
  const [search,setSearch]=useState("");
  const isAdmin=user.role==="admin";
  useEffect(()=>{ setFilter(initialFilter); },[initialFilter]);

  const filtered = orders
    .filter(o=>filter==="all"||o.status===filter)
    .filter(o=>matchSearch(o,search));

  return (
    <div>
      <div style={{marginBottom:18}}>
        <div className="barlow" style={{fontSize:32,fontWeight:800}}>{isAdmin?"Todos os Pedidos":"Meus Pedidos"}</div>
        <p style={{color:"var(--gray-light)",fontSize:14,marginTop:4}}>{filtered.length} pedido(s){search?` para "${search}"`:""}</p>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:18,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["all","Todos"],["aguardando","Aguardando"],["analise","Análise"],["corte","Corte"],["filetamento","Filetamento"],["pronto","Pronto"],["entregue","Entregue"]].map(([k,l])=>(
            <button key={k} onClick={()=>setFilter(k)} style={{padding:"7px 16px",borderRadius:20,border:`1.5px solid ${filter===k?"var(--yellow)":"var(--gray)"}`,background:filter===k?"rgba(245,184,0,.1)":"transparent",color:filter===k?"var(--yellow)":"var(--gray-light)",fontSize:13,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .2s",whiteSpace:"nowrap"}}>{l}</button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch}/>
      </div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div className="table-row table-header" style={{gridTemplateColumns:isAdmin?"2fr 130px 150px 70px":"2fr 150px 70px",cursor:"default"}}>
          <span>Pedido</span>{isAdmin&&<span>Cliente</span>}<span>Status</span><span></span>
        </div>
        {filtered.length===0 ? (
          <div style={{textAlign:"center",padding:40,color:"var(--gray-light)"}}>
            <div style={{fontSize:32,marginBottom:8}}>🔍</div>
            <div>{search?`Nenhum resultado para "${search}"` :"Nenhum pedido."}</div>
            {search&&<button onClick={()=>setSearch("")} className="btn-ghost" style={{marginTop:12,fontSize:13}}>Limpar busca</button>}
          </div>
        ) : filtered.map(o=>(
          <div key={o.id} className="table-row" style={{gridTemplateColumns:isAdmin?"2fr 130px 150px 70px":"2fr 150px 70px",cursor:"pointer"}} onClick={()=>{setSelectedOrder(o);setActiveTab("order-detail");}}>
            <div>
              <div style={{fontWeight:500,fontSize:14,display:"flex",alignItems:"center",gap:8}}>
                <Highlight text={o.title} term={search}/>
                {(o.unread_count||0)>0 && <span className="msg-dot" title="Nova mensagem"/>}
              </div>
              <div style={{fontSize:12,color:"var(--gray-light)",marginTop:2}}>
                {o.display_id} · {new Date(o.created_at).toLocaleDateString("pt-BR")}
                {!isAdmin && user.company_id && o.client_id!==user.id && <span style={{marginLeft:8,color:"var(--yellow)",fontWeight:600}}>· 👤 {o.client_name}</span>}
              </div>
            </div>
            {isAdmin&&<div style={{fontSize:13}}><Highlight text={o.client_name||""} term={search}/></div>}
            <StatusBadge status={o.status} subStatus={o.sub_status}/>
            <div style={{color:"var(--yellow)",fontSize:18}}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ORDER DETAIL ─────────────────────────────────────────────────────────────
const OrderDetail = ({ order, user, onBack, onUpdateStatus }) => {
  const [messages,setMessages]=useState([]);
  const [orderFiles,setOrderFiles]=useState([]);
  const [newMsg,setNewMsg]=useState("");
  const [sending,setSending]=useState(false);
  const [currentOrder,setCurrentOrder]=useState(order);
  const [preview,setPreview]=useState(null);
  const [uploading,setUploading]=useState(false);
  const chatRef=useRef();
  const attachRef=useRef();
  const isAdmin=user.role==="admin";
  const pollRef=useRef();

  const loadMessages=async()=>{ try { const {data}=await supabase.from("messages").select("*").eq("order_id",order.id).order("created_at"); if(data) setMessages(data); } catch(e){} };
  const loadFiles=async()=>{ const {data}=await supabase.from("order_files").select("*").eq("order_id",order.id); setOrderFiles(data||[]); };

  useEffect(()=>{
    loadFiles(); loadMessages();
    const field=user.role==="admin"?"last_read_admin_at":"last_read_client_at";
    supabase.from("orders").update({[field]:new Date().toISOString()}).eq("id",order.id).then(()=>{});
    pollRef.current=setInterval(loadMessages,4000);
    return()=>{ clearInterval(pollRef.current); };
  },[order.id]);

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[messages]);

  const handleSend=async()=>{
    if (!newMsg.trim()||sending) return;
    const txt=newMsg; setNewMsg(""); setSending(true);
    try { await supabase.from("messages").insert({order_id:order.id,sender_id:user.id,sender_name:user.name||user.email,sender_role:user.role,text:txt}); await loadMessages(); } catch(e){ setNewMsg(txt); }
    setSending(false);
  };

  const handleAttachFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
      const path=`${order.id}/${Date.now()}-${safeName}`;
      const {error:upErr}=await supabase.storage.from("order-files").upload(path,file,{upsert:true});
      if (upErr) { console.error(upErr); setUploading(false); return; }
      const {data:{publicUrl}}=supabase.storage.from("order-files").getPublicUrl(path);
      const isImage=file.type?.startsWith("image");
      await supabase.from("order_files").insert({order_id:order.id,name:file.name,size:(file.size/1024).toFixed(0)+" KB",type:file.name.split(".").pop(),url:publicUrl,is_image:isImage});
      await loadFiles();
      await supabase.from("messages").insert({order_id:order.id,sender_id:user.id,sender_name:user.name||user.email,sender_role:user.role,text:`📎 Novo arquivo adicionado: ${file.name}`});
      await loadMessages();
    } catch(err){ console.error("Erro ao anexar:",err); }
    setUploading(false); e.target.value="";
  };

  const handleToggleChapa=async()=>{
    const newSub=currentOrder.sub_status==="aguardando_chapa"?null:"aguardando_chapa";
    try { await supabase.from("orders").update({sub_status:newSub}).eq("id",currentOrder.id); setCurrentOrder(prev=>({...prev,sub_status:newSub})); } catch(e){}
  };

  const handleAdvance=async()=>{
    const next=NEXT_STATUS[currentOrder.status]; if(!next) return;
    try {
      const now=new Date().toISOString();
      const newHistory={...(currentOrder.step_history||{})};
      const currentStep=STATUS_CONFIG[currentOrder.status]?.step??0;
      const nextStep=STATUS_CONFIG[next]?.step??0;
      for (let i=currentStep; i<nextStep; i++) { const sk=STEPS[i]?.key; if(sk&&!newHistory[sk]) newHistory[sk]=now; }
      newHistory[next]=now;
      await supabase.from("orders").update({status:next,step_history:newHistory,sub_status:null}).eq("id",currentOrder.id);
      setCurrentOrder(prev=>({...prev,status:next,step_history:newHistory,sub_status:null}));
      onUpdateStatus(currentOrder.id,next,()=>{},newHistory);
    } catch(e){}
  };

  return (
    <div>
      {preview && (
        <div onClick={()=>setPreview(null)} style={{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"rgba(0,0,0,0.92)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",cursor:"zoom-out"}}>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",maxWidth:"90vw",maxHeight:"90vh"}}>
            <button onClick={()=>setPreview(null)} style={{position:"absolute",top:-40,right:0,background:"none",border:"none",color:"white",fontSize:32,cursor:"pointer"}}>×</button>
            {preview.is_image?<img src={preview.url} alt={preview.name} style={{maxWidth:"85vw",maxHeight:"85vh",borderRadius:8,objectFit:"contain"}}/>:<iframe src={preview.url} title={preview.name} style={{width:"80vw",height:"80vh",border:"none",borderRadius:8,background:"white"}}/>}
            <div style={{textAlign:"center",marginTop:12,color:"var(--gray-light)",fontSize:13}}>{preview.name}</div>
            <div style={{textAlign:"center",marginTop:8}}><a href={preview.url} download target="_blank" rel="noreferrer" className="btn-primary" style={{fontSize:13,padding:"8px 18px",textDecoration:"none"}}>↓ Baixar</a></div>
          </div>
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
        <button className="btn-ghost" onClick={onBack} style={{padding:"8px 14px"}}><Icon name="arrow" size={14}/>Voltar</button>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div className="barlow" style={{fontSize:26,fontWeight:800}}>{currentOrder.title}</div>
            <StatusBadge status={currentOrder.status} subStatus={currentOrder.sub_status}/>
          </div>
          <div style={{fontSize:13,color:"var(--gray-light)",marginTop:2}}>{currentOrder.display_id} · {currentOrder.client_name} · {new Date(currentOrder.created_at).toLocaleDateString("pt-BR")}</div>
        </div>
        {isAdmin&&NEXT_STATUS[currentOrder.status]&&<button className="btn-primary" onClick={handleAdvance}>▶ Avançar: {STATUS_CONFIG[NEXT_STATUS[currentOrder.status]]?.label}</button>}
      </div>
      <div className="card" style={{marginBottom:20}}>
        <div className="barlow" style={{fontSize:16,fontWeight:700,marginBottom:4}}>Progresso do Pedido</div>
        <StatusSteps currentStatus={currentOrder.status} stepHistory={currentOrder.step_history||{}} createdAt={currentOrder.created_at}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <div className="card">
            <div className="barlow" style={{fontSize:16,fontWeight:700,marginBottom:10}}>📋 Descrição</div>
            <p style={{fontSize:14,color:"var(--off-white)",lineHeight:1.7}}>{currentOrder.description}</p>
          </div>
          {orderFiles.length>0&&(
            <div className="card">
              <div className="barlow" style={{fontSize:16,fontWeight:700,marginBottom:12}}>📎 Anexos ({orderFiles.length})</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {orderFiles.map(f=>(
                  <div key={f.id} onClick={()=>setPreview(f)} style={{display:"flex",alignItems:"center",gap:10,background:"var(--gray-mid)",borderRadius:8,padding:"10px 14px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="var(--gray)"} onMouseLeave={e=>e.currentTarget.style.background="var(--gray-mid)"}>
                    <span style={{fontSize:20}}>{f.is_image?"🖼️":"📄"}</span>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{f.name}</div><div style={{fontSize:11,color:"var(--gray-light)"}}>{f.size}</div></div>
                    <span style={{fontSize:12,color:"var(--yellow)",fontWeight:600}}>{f.is_image?"👁️ Ver":"📖 Abrir"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="card">
            <div className="barlow" style={{fontSize:16,fontWeight:700,marginBottom:12}}>💬 Mensagens</div>
            <div ref={chatRef} style={{maxHeight:280,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,marginBottom:14,paddingRight:4}}>
              {messages.length===0&&<div style={{textAlign:"center",color:"var(--gray-light)",fontSize:13,padding:20}}>Inicie a conversa!</div>}
              {messages.map(msg=>{
                const isMine=(isAdmin&&msg.sender_role==="admin")||(!isAdmin&&msg.sender_role!=="admin");
                return (
                  <div key={msg.id} style={{display:"flex",flexDirection:"column",alignItems:isMine?"flex-end":"flex-start"}}>
                    <div style={{fontSize:11,color:"var(--gray-light)",marginBottom:4}}>{msg.sender_name} · {new Date(msg.created_at).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</div>
                    <div className={`chat-bubble ${isMine?"chat-mine":"chat-other"}`}>{msg.text}</div>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input ref={attachRef} type="file" style={{display:"none"}} onChange={handleAttachFile} accept=".dxf,.cnc,.dwg,.pdf,.svg,.nc,.zip,image/*"/>
              <button onClick={()=>attachRef.current.click()} disabled={uploading} title="Anexar arquivo ao pedido"
                style={{background:"var(--gray-mid)",border:"1.5px solid var(--gray)",borderRadius:8,color:"var(--gray-light)",cursor:"pointer",padding:"11px 12px",flexShrink:0,transition:"all .2s",display:"flex",alignItems:"center",opacity:uploading?0.5:1}}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--yellow)"; e.currentTarget.style.color="var(--yellow)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--gray)"; e.currentTarget.style.color="var(--gray-light)"; }}>
                {uploading ? <div className="spinner" style={{width:16,height:16}}/> : <Icon name="paperclip" size={16}/>}
              </button>
              <input className="input-field" placeholder="Digite uma mensagem..." value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend()} style={{flex:1}}/>
              <button className="btn-primary" onClick={handleSend} disabled={sending} style={{padding:"0 16px",flexShrink:0}}><Icon name="send" size={16}/></button>
            </div>
            <div style={{fontSize:11,color:"var(--gray-light)",marginTop:6,textAlign:"center"}}>📎 Use o clipe para enviar arquivos adicionais a qualquer momento</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="card">
            <div className="barlow" style={{fontSize:16,fontWeight:700,marginBottom:12}}>Detalhes</div>
            {[["ID",currentOrder.display_id],["Cliente",currentOrder.client_name],["Abertura",new Date(currentOrder.created_at).toLocaleDateString("pt-BR")],["Anexos",orderFiles.length],["Mensagens",messages.length]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--gray-mid)",fontSize:13}}>
                <span style={{color:"var(--gray-light)"}}>{l}</span><span style={{fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
          {(()=>{
            const history={...(currentOrder.step_history||{})};
            if (!history.aguardando) history.aguardando=currentOrder.created_at;
            const stepKeys=STEPS.map(s=>s.key).filter(k=>history[k]);
            if (stepKeys.length===0) return null;
            const firstTs=new Date(currentOrder.created_at);
            const lastTs=stepKeys.length>1?new Date(history[stepKeys[stepKeys.length-1]]):null;
            const diasTotal=lastTs?Math.ceil((lastTs-firstTs)/(1000*60*60*24)):Math.ceil((new Date()-firstTs)/(1000*60*60*24));
            const concluido=currentOrder.status==="pronto"||currentOrder.status==="entregue";
            return (
              <div className="card">
                <div className="barlow" style={{fontSize:16,fontWeight:700,marginBottom:12}}>📅 Histórico de Etapas</div>
                <div style={{display:"flex",flexDirection:"column",gap:0}}>
                  {STEPS.filter(s=>history[s.key]).map(s=>(
                    <div key={s.key} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--gray-mid)",fontSize:12}}>
                      <span style={{color:"var(--gray-light)"}}>{s.icon} {s.label}</span>
                      <span style={{fontWeight:500,color:s.key===currentOrder.status?"var(--yellow)":"inherit"}}>{new Date(history[s.key]).toLocaleDateString("pt-BR")} {new Date(history[s.key]).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12,padding:"10px 12px",borderRadius:8,background:concluido?"rgba(76,175,114,.1)":"rgba(245,184,0,.08)",border:`1px solid ${concluido?"rgba(76,175,114,.3)":"rgba(245,184,0,.2)"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,color:"var(--gray-light)"}}>{concluido?"⏱️ Tempo total":"⏱️ Em aberto há"}</span>
                  <span style={{fontWeight:700,fontSize:14,color:concluido?"#4caf72":"var(--yellow)"}}>{diasTotal===0?"menos de 1 dia":`${diasTotal} dia${diasTotal>1?"s":""}`}</span>
                </div>
              </div>
            );
          })()}
          {isAdmin&&(
            <div className="card">
              <div className="barlow" style={{fontSize:16,fontWeight:700,marginBottom:12}}>⚙️ Atualizar Status</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {Object.entries(STATUS_CONFIG).map(([key,cfg])=>(
                  <button key={key} onClick={()=>onUpdateStatus(currentOrder.id,key,setCurrentOrder,currentOrder.step_history)} style={{padding:"10px 14px",borderRadius:8,border:`1.5px solid ${currentOrder.status===key?"var(--yellow)":"var(--gray)"}`,background:currentOrder.status===key?"rgba(245,184,0,.12)":"transparent",color:currentOrder.status===key?"var(--yellow)":"var(--gray-light)",fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"DM Sans,sans-serif",transition:"all .2s",display:"flex",alignItems:"center",gap:8}}>
                    {cfg.icon} {cfg.label}{currentOrder.status===key&&<span style={{marginLeft:"auto"}}>◉</span>}
                  </button>
                ))}
                {currentOrder.status==="analise"&&(
                  <button onClick={handleToggleChapa} style={{padding:"10px 14px",borderRadius:8,border:`1.5px solid ${currentOrder.sub_status==="aguardando_chapa"?"var(--orange)":"var(--gray)"}`,background:currentOrder.sub_status==="aguardando_chapa"?"rgba(232,119,34,.12)":"transparent",color:currentOrder.sub_status==="aguardando_chapa"?"var(--orange)":"var(--gray-light)",fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"DM Sans,sans-serif",transition:"all .2s",display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                    {currentOrder.sub_status==="aguardando_chapa"?"✅ Chapa Recebida — Remover Aguardo":"🧱 Colocar em Aguardo de Chapa"}
                    {currentOrder.sub_status==="aguardando_chapa"&&<span style={{marginLeft:"auto",color:"var(--orange)"}}>◉</span>}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const AdminDashboard = ({ orders, setSelectedOrder, setActiveTab, setOrdersFilter }) => {
  const [companies,setCompanies]=useState([]);
  const [dashSearch,setDashSearch]=useState("");
  useEffect(()=>{ supabase.from("companies").select("id,name").then(({data})=>setCompanies(data||[])); },[]);
  const compMap=Object.fromEntries(companies.map(c=>[c.id,c.name]));
  const stats={
    total:orders.length,
    aguardando:orders.filter(o=>o.status==="aguardando").length,
    prod:orders.filter(o=>["analise","corte","filetamento"].includes(o.status)).length,
    prontos:orders.filter(o=>o.status==="pronto").length,
  };
  const verAguardando=()=>{ setOrdersFilter("aguardando"); setActiveTab("orders"); };
  const dashFiltered=orders.filter(o=>matchSearch(o,dashSearch));

  return (
    <div>
      <div style={{marginBottom:24}}>
        <div className="barlow" style={{fontSize:36,fontWeight:800}}>Painel <span style={{color:"var(--yellow)"}}>Central 4.0</span></div>
        <p style={{color:"var(--gray-light)",fontSize:14,marginTop:4}}>Visão geral de todos os pedidos.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20}}>
        {[["Total",stats.total,"📦","var(--yellow)"],["Aguardando",stats.aguardando,"⏳","#64b5f6"],["Em Produção",stats.prod,"🪚","var(--orange)"],["Prontos",stats.prontos,"✅","#4caf72"]].map(([l,v,ic,c])=>(
          <div key={l} className="card" style={{borderTop:`3px solid ${c}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:12,color:"var(--gray-light)",marginBottom:6}}>{l}</div><div className="barlow" style={{fontSize:44,fontWeight:900,color:c,lineHeight:1}}>{v}</div></div>
              <span style={{fontSize:28}}>{ic}</span>
            </div>
          </div>
        ))}
      </div>
      {stats.aguardando>0&&(
        <div style={{background:"rgba(245,184,0,.08)",border:"1px solid rgba(245,184,0,.3)",borderRadius:12,padding:"14px 20px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
          <div style={{fontWeight:600,color:"var(--yellow)",fontSize:15}}>⚠️ {stats.aguardando} pedido(s) aguardando análise</div>
          <button onClick={verAguardando} style={{background:"var(--yellow)",color:"var(--black)",border:"none",borderRadius:6,padding:"8px 18px",fontFamily:"Barlow Condensed,sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>Ver Aguardando →</button>
        </div>
      )}
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,gap:12,flexWrap:"wrap"}}>
          <div className="barlow" style={{fontSize:20,fontWeight:700,flexShrink:0}}>Pedidos Recentes</div>
          <div style={{display:"flex",gap:10,alignItems:"center",flex:1,justifyContent:"flex-end",minWidth:280}}>
            <SearchInput value={dashSearch} onChange={setDashSearch} placeholder="Buscar ambiente, cliente ou OT..."/>
            <button className="btn-ghost" style={{flexShrink:0,fontSize:13}} onClick={()=>{ setOrdersFilter("all"); setActiveTab("orders"); }}>Ver todos</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 160px 110px 160px 70px",padding:"8px 12px",borderBottom:"2px solid var(--gray-mid)"}}>
          {["Pedido","Empresa / Cliente","Abertura","Status",""].map((h,i)=>(
            <span key={i} style={{fontSize:11,color:"var(--gray-light)",fontWeight:600,textTransform:"uppercase",letterSpacing:.8,textAlign:i===2?"center":"left"}}>{h}</span>
          ))}
        </div>
        {dashFiltered.length===0 ? (
          <div style={{textAlign:"center",padding:32,color:"var(--gray-light)"}}>
            <div style={{fontSize:28,marginBottom:8}}>🔍</div>
            <div>Nenhum resultado para "{dashSearch}"</div>
            <button onClick={()=>setDashSearch("")} className="btn-ghost" style={{marginTop:10,fontSize:13}}>Limpar busca</button>
          </div>
        ) : dashFiltered.slice(0,10).map(o=>{
          const companyName=o.company_id?compMap[o.company_id]:null;
          return (
            <div key={o.id} style={{display:"grid",gridTemplateColumns:"1fr 160px 110px 160px 70px",padding:"12px",borderBottom:"1px solid var(--gray-mid)",alignItems:"center",cursor:"pointer",transition:"background .15s"}}
              onClick={()=>{setSelectedOrder(o);setActiveTab("order-detail");}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div>
                <div style={{fontWeight:500,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
                  <Highlight text={o.title} term={dashSearch}/>
                  {(o.unread_count||0)>0&&<span className="msg-dot" title="Nova mensagem"/>}
                </div>
                <div style={{fontSize:11,color:"var(--gray-light)",marginTop:2}}>{o.display_id}</div>
              </div>
              <div>
                {companyName?(<>
                  <div style={{fontSize:12,color:"var(--yellow)",fontWeight:600}}>🏢 {companyName}</div>
                  <div style={{fontSize:11,color:"var(--gray-light)",marginTop:2}}>👤 <Highlight text={o.client_name||""} term={dashSearch}/></div>
                </>):(
                  <div style={{fontSize:13,color:"var(--gray-light)"}}>👤 <Highlight text={o.client_name||""} term={dashSearch}/></div>
                )}
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:10,color:"var(--gray-light)",marginBottom:2,textTransform:"uppercase",letterSpacing:.5}}>Abertura</div>
                <div style={{fontSize:13,fontWeight:500}}>{new Date(o.created_at).toLocaleDateString("pt-BR")}</div>
              </div>
              <StatusBadge status={o.status} subStatus={o.sub_status}/>
              <div style={{color:"var(--yellow)",fontSize:18,textAlign:"right"}}>→</div>
            </div>
          );
        })}
        {dashFiltered.length>10 && (
          <div style={{padding:"12px 16px",textAlign:"center",fontSize:13,color:"var(--gray-light)",borderTop:"1px solid var(--gray-mid)"}}>
            Mostrando 10 de {dashFiltered.length} resultados ·{" "}
            <span style={{color:"var(--yellow)",cursor:"pointer",fontWeight:600}} onClick={()=>{ setOrdersFilter("all"); setActiveTab("orders"); }}>Ver todos →</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── COMPANIES PAGE ───────────────────────────────────────────────────────────
const CompaniesPage = () => {
  const [companies,setCompanies]=useState([]);
  const [showCreate,setShowCreate]=useState(false);
  const [newName,setNewName]=useState("");
  const [newPhone,setNewPhone]=useState("");
  const [creating,setCreating]=useState(false);
  const [copied,setCopied]=useState(null);
  const loadCompanies=async()=>{ const {data}=await supabase.from("companies").select("*").order("created_at",{ascending:false}); setCompanies(data||[]); };
  useEffect(()=>{ loadCompanies(); },[]);
  const handleCreate=async()=>{
    if (!newName.trim()) return; setCreating(true);
    let key,exists=true;
    while(exists){ key=Math.floor(100000+Math.random()*900000).toString(); const {data}=await supabase.from("companies").select("id").eq("access_key",key).maybeSingle(); exists=!!data; }
    await supabase.from("companies").insert({name:newName.trim(),phone:newPhone.trim()||null,access_key:key});
    setCreating(false);setShowCreate(false);setNewName("");setNewPhone("");loadCompanies();
  };
  const handleCopy=(key)=>{ navigator.clipboard?.writeText(key); setCopied(key); setTimeout(()=>setCopied(null),2500); };
  return (
    <div>
      {showCreate&&(<div className="modal-overlay"><div style={{background:"var(--gray-dark)",border:"1px solid var(--gray)",borderRadius:14,padding:28,maxWidth:420,width:"90%",animation:"fadeIn .25s ease"}}><div className="barlow" style={{fontSize:22,fontWeight:800,marginBottom:16}}>🏢 Cadastrar Empresa</div><div style={{display:"flex",flexDirection:"column",gap:13}}><div><label style={{fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5}}>NOME DA EMPRESA *</label><input className="input-field" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Ex: Calais Móveis Ltda."/></div><div><label style={{fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5}}>TELEFONE</label><input className="input-field" value={newPhone} onChange={e=>setNewPhone(e.target.value)} placeholder="(31) 99999-0000"/></div><div style={{background:"rgba(245,184,0,.08)",border:"1px solid rgba(245,184,0,.2)",borderRadius:8,padding:"10px 14px",fontSize:13,lineHeight:1.7}}>💡 Uma <strong>chave de 6 dígitos</strong> será gerada automaticamente.</div></div><div style={{display:"flex",gap:10,marginTop:22,justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>setShowCreate(false)}>Cancelar</button><button className="btn-primary" onClick={handleCreate} disabled={creating||!newName.trim()}>{creating?<><div className="spinner"/>Criando...</>:"🏢 Criar Empresa"}</button></div></div></div>)}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><div className="barlow" style={{fontSize:32,fontWeight:800}}>Empresas</div><p style={{color:"var(--gray-light)",fontSize:14,marginTop:4}}>{companies.length} empresa(s)</p></div>
        <button className="btn-primary" onClick={()=>setShowCreate(true)}><Icon name="plus" size={16}/>Nova Empresa</button>
      </div>
      {companies.length===0?<div className="card" style={{textAlign:"center",padding:40,color:"var(--gray-light)"}}><div style={{fontSize:36,marginBottom:8}}>🏢</div><div>Nenhuma empresa ainda.</div><button className="btn-primary" style={{marginTop:14}} onClick={()=>setShowCreate(true)}>Cadastrar primeira empresa</button></div>
      :companies.map(co=>(
        <div key={co.id} className="card" style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
            <div>
              <div className="barlow" style={{fontSize:20,fontWeight:700}}>{co.name}</div>
              {co.phone&&<div style={{fontSize:13,color:"var(--gray-light)",marginTop:2}}>📞 {co.phone}</div>}
              <div style={{fontSize:12,color:"var(--gray-light)",marginTop:4}}>Cadastrada em {new Date(co.created_at).toLocaleDateString("pt-BR")}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"var(--gray-light)",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Chave de Acesso</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <code style={{fontSize:28,fontWeight:900,color:"var(--yellow)",letterSpacing:6,fontFamily:"monospace"}}>{co.access_key}</code>
                <button onClick={()=>handleCopy(co.access_key)} style={{background:copied===co.access_key?"rgba(76,175,114,.15)":"var(--gray-mid)",border:`1px solid ${copied===co.access_key?"#4caf72":"var(--gray)"}`,borderRadius:6,color:copied===co.access_key?"#4caf72":"var(--gray-light)",cursor:"pointer",padding:"6px 12px",fontSize:12,transition:"all .2s",fontWeight:500}}>
                  {copied===co.access_key?"✅ Copiado!":"📋 Copiar"}
                </button>
              </div>
              <div style={{fontSize:11,color:"var(--gray-light)",marginTop:6}}>Funcionários usam esta chave no cadastro</div>
            </div>
          </div>
        </div>
      ))}
      <div className="card" style={{background:"rgba(26,77,46,.08)",border:"1px solid rgba(26,107,46,.2)",marginTop:8}}>
        <div className="barlow" style={{fontSize:16,fontWeight:700,marginBottom:10,color:"#4caf72"}}>Como vincular funcionários</div>
        <div style={{fontSize:13,color:"var(--gray-light)",lineHeight:1.9}}>
          <div>1. Crie a empresa aqui e anote a <strong style={{color:"var(--white)"}}>chave de 6 dígitos</strong></div>
          <div>2. O funcionário acessa o portal e clica em <strong style={{color:"var(--white)"}}>CADASTRAR</strong></div>
          <div>3. Preenche nome, telefone, e-mail, senha e a <strong style={{color:"var(--white)"}}>Chave da Empresa</strong></div>
          <div>4. Pronto — ele verá todos os pedidos da empresa e poderá criar novos</div>
        </div>
      </div>
    </div>
  );
};

// ─── USERS PAGE ───────────────────────────────────────────────────────────────
const UsersPage = ({ orders }) => {
  const [clients,setClients]=useState([]);
  const [editClient,setEditClient]=useState(null);
  const [editName,setEditName]=useState("");
  const [editPhone,setEditPhone]=useState("");
  const [deleteClient,setDeleteClient]=useState(null);
  const [deleteConfirm,setDeleteConfirm]=useState("");
  const [resetClient,setResetClient]=useState(null);
  const [resetEmail,setResetEmail]=useState("");
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState(null);
  const showToast=(msg,type="green")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),4000); };
  const loadClients=async()=>{
    const {data:cd}=await supabase.from("profiles").select("*").eq("role","client");
    const {data:coD}=await supabase.from("companies").select("id,name");
    const cMap=Object.fromEntries((coD||[]).map(c=>[c.id,c.name]));
    setClients((cd||[]).map(c=>({...c,company_name:c.company_id?(cMap[c.company_id]||null):null})));
  };
  useEffect(()=>{ loadClients(); },[]);
  const displayName=(c)=>c.name||c.email?.split("@")[0]||"—";
  const displayInitial=(c)=>(c.name||c.email||"?").charAt(0).toUpperCase();
  const orderCount=(c)=>orders.filter(o=>o.client_id===c.id).length;
  const handleEdit=(c)=>{ setEditClient(c);setEditName(c.name||"");setEditPhone(c.phone||""); };
  const handleSaveEdit=async()=>{
    if (!editName.trim()) return; setSaving(true);
    await supabase.from("profiles").update({name:editName.trim(),phone:editPhone.trim()}).eq("id",editClient.id);
    setSaving(false);setEditClient(null);showToast("Cliente atualizado!");loadClients();
  };
  const handleDelete=async()=>{
    if (deleteConfirm!=="DELETAR") return; setSaving(true);
    await supabase.from("orders").update({client_id:null}).eq("client_id",deleteClient.id);
    await supabase.from("profiles").delete().eq("id",deleteClient.id);
    setSaving(false);setDeleteClient(null);setDeleteConfirm("");showToast("Cliente excluído.","red");loadClients();
  };
  const handleResetPassword=async()=>{
    if (!resetEmail.trim()) return; setSaving(true);
    const {error}=await supabase.auth.resetPasswordForEmail(resetEmail.trim(),{redirectTo:window.location.origin});
    setSaving(false);setResetClient(null);
    if(error) showToast("Erro: "+error.message,"red"); else showToast(`Link enviado para ${resetEmail}!`);
  };
  const btnAction=(onClick,title,emoji,danger=false)=>(
    <button title={title} onClick={onClick} style={{background:"var(--gray-mid)",border:"1px solid var(--gray)",borderRadius:6,color:"var(--gray-light)",cursor:"pointer",padding:"6px 9px",fontSize:15,transition:"all .2s",lineHeight:1}} onMouseEnter={e=>e.currentTarget.style.color=danger?"#ef5350":"var(--white)"} onMouseLeave={e=>e.currentTarget.style.color="var(--gray-light)"}>{emoji}</button>
  );
  return (
    <div>
      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:600,background:toast.type==="red"?"#b71c1c":"#1b5e20",border:`1px solid ${toast.type==="red"?"#ef5350":"#4caf72"}`,borderRadius:10,padding:"12px 20px",color:"white",fontSize:14,fontWeight:500,animation:"fadeIn .3s ease"}}>{toast.type==="red"?"🗑️":"✅"} {toast.msg}</div>}
      {editClient&&(<div className="modal-overlay"><div style={{background:"var(--gray-dark)",border:"1px solid var(--gray)",borderRadius:14,padding:"28px",maxWidth:420,width:"90%",animation:"fadeIn .25s ease"}}><div className="barlow" style={{fontSize:22,fontWeight:800,marginBottom:4}}>✏️ Editar Cliente</div><div style={{fontSize:12,color:"var(--gray-light)",marginBottom:20,background:"var(--gray-mid)",borderRadius:6,padding:"6px 10px",display:"inline-block"}}>{editClient.email||editClient.id.slice(0,16)+"…"}</div><div style={{display:"flex",flexDirection:"column",gap:13}}><div><label style={{fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5}}>NOME</label><input className="input-field" value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Nome do cliente"/></div><div><label style={{fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5}}>TELEFONE</label><input className="input-field" value={editPhone} onChange={e=>setEditPhone(e.target.value)} placeholder="(31) 99999-0000"/></div></div><div style={{display:"flex",gap:10,marginTop:22,justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>setEditClient(null)}>Cancelar</button><button className="btn-primary" onClick={handleSaveEdit} disabled={saving||!editName.trim()}>{saving?<><div className="spinner"/>Salvando...</>:"💾 Salvar"}</button></div></div></div>)}
      {resetClient&&(<div className="modal-overlay"><div style={{background:"var(--gray-dark)",border:"1px solid var(--gray)",borderRadius:14,padding:"28px",maxWidth:420,width:"90%",animation:"fadeIn .25s ease"}}><div className="barlow" style={{fontSize:22,fontWeight:800,marginBottom:4}}>🔑 Redefinir Senha</div><div style={{background:"rgba(245,184,0,.08)",border:"1px solid rgba(245,184,0,.2)",borderRadius:8,padding:"10px 14px",fontSize:13,marginBottom:18,lineHeight:1.7}}>💡 Será enviado um <strong>link de redefinição</strong> por e-mail.</div><div><label style={{fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5}}>E-MAIL DO CLIENTE</label><input className="input-field" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} placeholder="email@cliente.com"/></div><div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>setResetClient(null)}>Cancelar</button><button className="btn-primary" onClick={handleResetPassword} disabled={saving||!resetEmail.trim()}>{saving?<><div className="spinner"/>Enviando...</>:"📧 Enviar Link"}</button></div></div></div>)}
      {deleteClient&&(<div className="modal-overlay"><div style={{background:"var(--gray-dark)",border:"1px solid rgba(200,16,46,.4)",borderRadius:14,padding:"28px",maxWidth:440,width:"90%",animation:"fadeIn .25s ease"}}><div className="barlow" style={{fontSize:22,fontWeight:800,marginBottom:4,color:"#ef5350"}}>⚠️ Excluir Cliente</div><div style={{fontSize:13,color:"var(--gray-light)",marginBottom:16}}>Esta ação é <strong style={{color:"var(--white)"}}>permanente e irreversível</strong>.</div><div style={{background:"rgba(200,16,46,.08)",border:"1px solid rgba(200,16,46,.2)",borderRadius:8,padding:"12px 14px",marginBottom:16}}><div style={{fontSize:14,fontWeight:600}}>{displayName(deleteClient)}</div>{deleteClient.email&&<div style={{fontSize:12,color:"var(--gray-light)",marginTop:2}}>{deleteClient.email}</div>}<div style={{fontSize:12,color:"var(--gray-light)",marginTop:6}}>{orderCount(deleteClient)} pedido(s) — <strong style={{color:"var(--white)"}}>histórico mantido</strong>.</div></div><div style={{fontSize:13,color:"var(--gray-light)",marginBottom:8}}>Digite <code style={{color:"#ef5350",background:"rgba(200,16,46,.1)",padding:"1px 6px",borderRadius:4}}>DELETAR</code> para confirmar:</div><input className="input-field" value={deleteConfirm} onChange={e=>setDeleteConfirm(e.target.value)} placeholder="DELETAR" style={{borderColor:deleteConfirm==="DELETAR"?"#ef5350":"var(--gray)"}}/><div style={{fontSize:12,color:"var(--gray-light)",marginTop:10,padding:"8px 10px",background:"rgba(255,255,255,.03)",borderRadius:6}}>ℹ️ Login permanece no Supabase — remova em Authentication → Users se necessário.</div><div style={{display:"flex",gap:10,marginTop:18,justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>{setDeleteClient(null);setDeleteConfirm("");}}>Cancelar</button><button style={{background:deleteConfirm==="DELETAR"?"#c62828":"var(--gray-mid)",color:"white",border:`1px solid ${deleteConfirm==="DELETAR"?"#ef5350":"var(--gray)"}`,borderRadius:6,padding:"11px 22px",fontFamily:"Barlow Condensed,sans-serif",fontSize:15,fontWeight:700,cursor:deleteConfirm==="DELETAR"?"pointer":"not-allowed",opacity:deleteConfirm==="DELETAR"?1:0.5,display:"inline-flex",alignItems:"center",gap:8,transition:"all .2s"}} onClick={handleDelete} disabled={deleteConfirm!=="DELETAR"||saving}>{saving?<><div className="spinner"/>Excluindo...</>:"🗑️ Excluir Definitivamente"}</button></div></div></div>)}
      <div style={{marginBottom:22}}>
        <div className="barlow" style={{fontSize:32,fontWeight:800}}>Clientes</div>
        <p style={{color:"var(--gray-light)",fontSize:14,marginTop:4}}>{clients.length} clientes cadastrados</p>
      </div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div className="table-row table-header" style={{gridTemplateColumns:"2fr 1fr 70px 110px",cursor:"default"}}><span>Cliente</span><span>Telefone</span><span>Pedidos</span><span></span></div>
        {clients.length===0&&<div style={{textAlign:"center",padding:40,color:"var(--gray-light)"}}>Nenhum cliente cadastrado.</div>}
        {clients.map(c=>(
          <div key={c.id} className="table-row" style={{gridTemplateColumns:"2fr 1fr 70px 110px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"var(--yellow)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"var(--black)",fontSize:14,flexShrink:0}}>{displayInitial(c)}</div>
              <div><div style={{fontWeight:500}}>{displayName(c)}</div><div style={{fontSize:12,color:"var(--gray-light)"}}>{c.email||"—"}</div>{c.company_name&&<div style={{fontSize:11,color:"var(--yellow)",marginTop:2}}>🏢 {c.company_name}</div>}</div>
            </div>
            <div style={{fontSize:13,color:"var(--gray-light)"}}>{c.phone||"—"}</div>
            <div style={{fontSize:14,fontWeight:600,color:"var(--yellow)"}}>{orderCount(c)}</div>
            <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
              {btnAction(()=>handleEdit(c),"Editar","✏️")}
              {btnAction(()=>{setResetClient(c);setResetEmail(c.email||"");},"Redefinir senha","🔑")}
              {btnAction(()=>setDeleteClient(c),"Excluir","🗑️",true)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [activeTab,setActiveTab]=useState("dashboard");
  const [orders,setOrders]=useState([]);
  const [ordersLoading,setOrdersLoading]=useState(false);
  const [selectedOrder,setSelectedOrder]=useState(null);
  const [ordersFilter,setOrdersFilter]=useState("all");
  const inactivityRef=useRef(null);
  const heartbeatRef=useRef(null);

  const resetInactivity=useCallback(()=>{ clearTimeout(inactivityRef.current); inactivityRef.current=setTimeout(async()=>{ await supabase.auth.signOut();setUser(null);setOrders([]); },40*60*1000); },[]);
  const startHeartbeat=useCallback(()=>{ clearInterval(heartbeatRef.current); heartbeatRef.current=setInterval(async()=>{ try{ const {data}=await supabase.auth.getSession(); if(!data?.session) return; await supabase.auth.refreshSession(); }catch(e){} },2*60*1000); },[]);

  useEffect(()=>{
    if (!user) return;
    const events=["mousedown","keydown","touchstart","scroll","click"];
    events.forEach(e=>window.addEventListener(e,resetInactivity,{passive:true}));
    resetInactivity();startHeartbeat();
    return()=>{ events.forEach(e=>window.removeEventListener(e,resetInactivity)); clearTimeout(inactivityRef.current); clearInterval(heartbeatRef.current); };
  },[user,resetInactivity,startHeartbeat]);

  useEffect(()=>{
    let authTimeout;
    const buildUser=async(session)=>{
      if (!session?.user) return null;
      try {
        const {data:profile,error}=await supabase.from("profiles").select("*").eq("id",session.user.id).maybeSingle();
        if (profile&&!error) {
          if (!profile.email&&session.user.email) { await supabase.from("profiles").update({email:session.user.email}).eq("id",session.user.id); profile.email=session.user.email; }
          let company_name=null;
          if (profile.company_id) { try{ const {data:comp}=await supabase.from("companies").select("name").eq("id",profile.company_id).maybeSingle(); company_name=comp?.name||null; }catch(e){} }
          return {...session.user,...profile,name:profile.name||session.user.email?.split("@")[0]||"Usuário",email:profile.email||session.user.email,company_id:profile.company_id||null,company_name};
        }
        const np={id:session.user.id,name:session.user.email?.split("@")[0]||"Usuário",phone:"",role:"client",email:session.user.email||"",company_id:null};
        await supabase.from("profiles").upsert(np,{onConflict:"id"});
        return {...session.user,...np};
      } catch(e){ return {...session.user,name:session.user.email?.split("@")[0]||"Usuário",role:"client"}; }
    };
    try {
      const projectRef=import.meta.env.VITE_SUPABASE_URL?.match(/\/\/([^.]+)\./)?.[1];
      const key=`sb-${projectRef}-auth-token`;
      const raw=localStorage.getItem(key);
      if (raw) {
        const stored=JSON.parse(raw);
        const exp=stored?.expires_at||stored?.user?.exp;
        const valid=exp&&(exp*1000)>Date.now();
        if (valid&&stored?.user) {
          supabase.from("profiles").select("*").eq("id",stored.user.id).maybeSingle()
            .then(({data:profile,error})=>{
              if (profile&&!error) setUser({...stored.user,name:profile.name||stored.user.email?.split("@")[0]||"Usuário",phone:profile.phone||"",role:profile.role||"client",email:profile.email||stored.user.email||"",company_id:profile.company_id||null,company_name:null});
              else setUser({...stored.user,name:stored.user.email?.split("@")[0]||"Usuário",role:"client",email:stored.user.email||""});
              setAuthLoading(false);
            })
            .catch(()=>{ setUser({...stored.user,name:stored.user.email?.split("@")[0]||"Usuário",role:"client"}); setAuthLoading(false); });
          return;
        }
      }
    } catch(e){}
    authTimeout=setTimeout(()=>setAuthLoading(false),8000);
    supabase.auth.getSession().then(async({data:{session}})=>{ clearTimeout(authTimeout); if(session){const u=await buildUser(session);if(u)setUser(u);} setAuthLoading(false); }).catch(()=>{ clearTimeout(authTimeout);setAuthLoading(false); });
    const {data:{subscription}}=supabase.auth.onAuthStateChange(async(event,session)=>{
      if(event==="SIGNED_IN"&&session){const u=await buildUser(session);if(u)setUser(u);}
      else if(event==="SIGNED_OUT")setUser(null);
      else if(event==="TOKEN_REFRESHED"&&session)setUser(prev=>prev?{...prev,...session.user}:prev);
    });
    return()=>{ clearTimeout(authTimeout);subscription.unsubscribe(); };
  },[]);

  const loadOrders=useCallback(async()=>{
    if(!user) return;
    setOrdersLoading(true);
    try {
      let query=supabase.from("orders").select("*").order("created_at",{ascending:false});
      if(user.role!=="admin") {
        if(user.company_id) query=query.or(`client_id.eq.${user.id},company_id.eq.${user.company_id}`);
        else query=query.eq("client_id",user.id);
      }
      const {data}=await query;
      const list=data||[];
      if(list.length>0){
        const orderIds=list.map(o=>o.id);
        const {data:msgs}=await supabase.from("messages").select("order_id,sender_role,created_at").in("order_id",orderIds);
        const withUnread=list.map(o=>{
          const lastRead=user.role==="admin"?o.last_read_admin_at:o.last_read_client_at;
          const lastReadDate=lastRead?new Date(lastRead):new Date(0);
          const unread=(msgs||[]).filter(m=>m.order_id===o.id&&m.sender_role!==user.role&&new Date(m.created_at)>lastReadDate).length;
          return {...o,unread_count:unread};
        });
        setOrders(withUnread);
      } else setOrders(list);
    } catch(e){ setOrders([]); }
    setOrdersLoading(false);
  },[user]);

  useEffect(()=>{ if(user) loadOrders(); },[user,loadOrders]);

  useEffect(()=>{
    if(!user) return;
    const channel=supabase.channel("orders-changes")
      .on("postgres_changes",{event:"*",schema:"public",table:"orders"},()=>loadOrders())
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},()=>loadOrders())
      .subscribe();
    return()=>supabase.removeChannel(channel);
  },[user,loadOrders]);

  const handleLogin=(u)=>setUser(u);
  const handleLogout=async()=>{ await supabase.auth.signOut();setUser(null);setOrders([]);setActiveTab("dashboard");setOrdersFilter("all"); };

  const handleUpdateStatus=async(orderId,newStatus,setCurrentOrder,currentHistory={})=>{
    const clearSub=newStatus!=="analise";
    const now=new Date().toISOString();
    const newHistory={...currentHistory,[newStatus]:now};
    const updateData=clearSub?{status:newStatus,sub_status:null,step_history:newHistory}:{status:newStatus,step_history:newHistory};
    await supabase.from("orders").update(updateData).eq("id",orderId);
    setOrders(prev=>prev.map(o=>o.id===orderId?{...o,status:newStatus,sub_status:clearSub?null:o.sub_status,step_history:newHistory}:o));
    if(setCurrentOrder) setCurrentOrder(prev=>({...prev,status:newStatus,sub_status:clearSub?null:prev.sub_status,step_history:newHistory}));
  };

  if(authLoading) return <><FontLoader/><Loading text="Verificando sessão..."/></>;
  if(!user) return <><FontLoader/><LoginPage onLogin={handleLogin}/></>;

  const renderContent=()=>{
    if(activeTab==="order-detail"&&selectedOrder) return <OrderDetail order={selectedOrder} user={user} onBack={()=>setActiveTab("orders")} onUpdateStatus={handleUpdateStatus}/>;
    if(ordersLoading && activeTab!=="new-order") return <Loading text="Carregando pedidos..."/>;
    if(user.role==="admin"){
      if(activeTab==="dashboard") return <AdminDashboard orders={orders} setSelectedOrder={setSelectedOrder} setActiveTab={setActiveTab} setOrdersFilter={setOrdersFilter}/>;
      if(activeTab==="orders") return <OrderList user={user} orders={orders} setSelectedOrder={setSelectedOrder} setActiveTab={setActiveTab} initialFilter={ordersFilter}/>;
      if(activeTab==="users") return <UsersPage orders={orders}/>;
      if(activeTab==="companies") return <CompaniesPage/>;
    } else {
      if(activeTab==="dashboard") return <ClientDashboard user={user} orders={orders} setActiveTab={setActiveTab} setSelectedOrder={setSelectedOrder}/>;
      if(activeTab==="new-order") return <NewOrder user={user} onSubmit={()=>{loadOrders();setActiveTab("orders");}}/>;
      if(activeTab==="orders") return <OrderList user={user} orders={orders} setSelectedOrder={setSelectedOrder} setActiveTab={setActiveTab} initialFilter="all"/>;
    }
  };

  return <><FontLoader/><Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} orders={orders}>{renderContent()}</Layout></>;
}
