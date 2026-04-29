import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase.js";

const LOGO_IMG = "data:image/png;base64,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";

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
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    .fade-in { animation: fadeIn 0.4s ease forwards; }
    .spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,0.2); border-top-color:#F5B800; border-radius:50%; animation:spin 0.7s linear infinite; }
    .cnc-strip { display: none; }
    .btn-primary { background:var(--yellow); color:var(--black); border:none; border-radius:6px; padding:12px 24px; font-family:'Barlow Condensed',sans-serif; font-size:16px; font-weight:700; letter-spacing:.5px; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:8px; }
    .btn-primary:hover { background:var(--yellow-dark); transform:translateY(-1px); box-shadow:0 4px 16px rgba(245,184,0,.3); }
    .btn-primary:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
    .btn-secondary { background:transparent; color:var(--yellow); border:1.5px solid var(--yellow); border-radius:6px; padding:11px 24px; font-family:'Barlow Condensed',sans-serif; font-size:16px; font-weight:700; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:8px; }
    .btn-secondary:hover { background:rgba(245,184,0,.1); }
    .btn-ghost { background:transparent; color:var(--gray-light); border:1.5px solid var(--gray); border-radius:6px; padding:10px 20px; font-family:'DM Sans',sans-serif; font-size:14px; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:6px; }
    .btn-ghost:hover { border-color:var(--gray-light); color:var(--white); }
    .btn-green { background:var(--green); color:white; border:none; border-radius:6px; padding:10px 20px; font-family:'Barlow Condensed',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:6px; }
    .btn-green:hover { background:var(--green-light); }
    .card { background:var(--gray-dark); border:1px solid var(--gray); border-radius:12px; padding:20px; }
    .input-field { background:var(--gray-mid); border:1.5px solid var(--gray); border-radius:8px; color:var(--white); padding:12px 16px; font-family:'DM Sans',sans-serif; font-size:14px; width:100%; transition:border-color .2s; outline:none; }
    .input-field:focus { border-color:var(--yellow); }
    .input-field::placeholder { color:var(--gray-light); }
    textarea.input-field { resize:vertical; min-height:100px; }
    .badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .badge-yellow { background:rgba(245,184,0,.15); color:var(--yellow); }
    .badge-green { background:rgba(26,107,46,.2); color:#4caf72; }
    .badge-orange { background:rgba(232,119,34,.15); color:var(--orange); }
    .badge-blue { background:rgba(21,101,192,.15); color:#64b5f6; }
    .badge-gray { background:rgba(100,100,100,.2); color:var(--gray-light); }
    .step-dot { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; transition:all .3s; }
    .step-line { flex:1; height:2px; margin-top:18px; }
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
  `}</style>
);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  aguardando:  { label: "Aguardando Análise", color: "gray",   icon: "⏳", step: 0 },
  analise:     { label: "Em Análise",         color: "blue",   icon: "🔍", step: 1 },
  corte:       { label: "Em Corte",           color: "orange", icon: "🪚", step: 2 },
  filetamento: { label: "Filetamento",        color: "orange", icon: "📐", step: 3 },
  pronto:      { label: "Pronto p/ Retirada", color: "green",  icon: "✅", step: 4 },
  entregue:    { label: "Entregue",           color: "green",  icon: "🚚", step: 5 },
};

const STEPS = [
  { key: "aguardando",  label: "Aguardando", icon: "📋" },
  { key: "analise",     label: "Análise",    icon: "🔍" },
  { key: "corte",       label: "Corte",      icon: "🪚" },
  { key: "filetamento", label: "Filetamento",icon: "📐" },
  { key: "pronto",      label: "Pronto!",    icon: "✅" },
];

const NEXT_STATUS = {
  aguardando: "analise", analise: "corte",
  corte: "filetamento", filetamento: "pronto", pronto: "entregue",
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    orders:  "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    upload:  "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
    send:    "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
    logout:  "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    plus:    "M12 4v16m8-8H4",
    arrow:   "M10 19l-7-7m0 0l7-7m-7 7h18",
    users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(icons[name]||"").split(" M").map((d,i)=><path key={i} d={i===0?d:"M"+d}/>)}
    </svg>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.aguardando;
  return <span className={`badge badge-${cfg.color}`}>{cfg.icon} {cfg.label}</span>;
};

// ─── STATUS STEPS ─────────────────────────────────────────────────────────────
const StatusSteps = ({ currentStatus, stepHistory = {} }) => {
  const currentStep = STATUS_CONFIG[currentStatus]?.step ?? 0;
  return (
    <div style={{ margin:"20px 0" }}>
      <div style={{ display:"flex", alignItems:"flex-start" }}>
        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          const ts = stepHistory[step.key];
          return (
            <div key={step.key} style={{ display:"flex", alignItems:"center", flex:1 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, minWidth:70 }}>
                <div className="step-dot" style={{
                  background: done ? "#4caf72" : active ? "var(--yellow)" : "var(--gray-mid)",
                  color: active ? "var(--black)" : done ? "white" : "var(--gray-light)",
                  boxShadow: active ? "0 0 16px rgba(245,184,0,.4)" : done ? "0 0 8px rgba(76,175,114,.3)" : "none",
                  border: (!done && !active) ? "2px solid var(--gray)" : "none",
                }}>
                  {done ? "✓" : step.icon}
                </div>
                <span style={{ fontSize:10, textAlign:"center", color: active ? "var(--yellow)" : done ? "#4caf72" : "var(--gray-light)", fontWeight: active ? 700 : 400, lineHeight:1.3 }}>
                  {step.label}
                </span>
                {ts && (
                  <span style={{ fontSize:9, color:"var(--gray-light)", textAlign:"center", lineHeight:1.2 }}>
                    {new Date(ts).toLocaleDateString("pt-BR")}<br/>
                    {new Date(ts).toLocaleTimeString("pt-BR", {hour:"2-digit",minute:"2-digit"})}
                  </span>
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex:1, height:3, borderRadius:2, marginBottom:32,
                  background: i < currentStep ? "#4caf72" : "var(--gray-mid)",
                  transition:"background .3s"
                }}/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── LOADING ──────────────────────────────────────────────────────────────────
const Loading = ({ text = "Carregando..." }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:300, gap:16 }}>
    <div className="spinner" style={{ width:36, height:36 }} />
    <span style={{ color:"var(--gray-light)", fontSize:14 }}>{text}</span>
  </div>
);

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError("E-mail ou senha incorretos. Verifique e tente novamente."); setLoading(false); return; }
      if (!data?.user) { setError("Erro ao fazer login. Tente novamente."); setLoading(false); return; }
      let profile = null;
      try {
        const {data: p} = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
        profile = p;
      } catch(e) {}
      onLogin({ ...data.user, name: profile?.name || data.user.email?.split("@")[0] || "Usuário", phone: profile?.phone || "", role: profile?.role || "client" });
    } catch(e) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    await supabase.from("profiles").insert({ id: data.user.id, name, phone, role: "client" });
    onLogin({ ...data.user, name, phone, role: "client" });
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--black)", display:"flex", flexDirection:"column" }}>
      <div className="cnc-strip" />
      <div style={{ padding:"16px 32px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid var(--gray-mid)" }}>
        <img src={LOGO_IMG} alt="Central Marcenaria 4.0" style={{ height:44, width:"auto", objectFit:"contain" }}/>
        <div style={{ marginLeft:"auto", fontSize:13, color:"var(--gray-light)" }}>centralmarcenaria.com.br</div>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ display:"flex", gap:56, alignItems:"center", maxWidth:900, width:"100%" }}>
          <div className="fade-in" style={{ flex:1 }}>
            <div className="barlow" style={{ fontSize:56, fontWeight:900, lineHeight:1, color:"var(--white)" }}>
              CENTRAL<br/><span style={{ color:"var(--yellow)" }}>MARCENARIA</span><br/>
              <span style={{ color:"var(--gray-light)", fontSize:42 }}>4.0</span>
            </div>
            <p style={{ color:"var(--gray-light)", fontSize:15, marginTop:16, lineHeight:1.7, maxWidth:400 }}>
              Envie seus projetos de corte CNC e filetamento, acompanhe o status em tempo real e retire na Central.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:24 }}>
              {[["🪚","Corte CNC / Nesting","Envie seu arquivo DXF ou CNC"],["📐","Filetamento Automático","Bordas ABS, PVC em MDF"],["📦","Pedido em Tempo Real","Notificação quando pronto"]].map(([ic,lb,ds])=>(
                <div key={lb} style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:36,height:36,borderRadius:8,background:"var(--gray-mid)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{ic}</div>
                  <div>
                    <div style={{ fontSize:14,fontWeight:600 }}>{lb}</div>
                    <div style={{ fontSize:12,color:"var(--gray-light)" }}>{ds}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in card" style={{ width:360, flexShrink:0 }}>
            <div style={{ display:"flex", gap:4, marginBottom:22, background:"var(--gray-mid)", borderRadius:8, padding:4 }}>
              {["login","register"].map(t=>(
                <button key={t} onClick={()=>{setTab(t);setError("");}} style={{ flex:1,padding:"8px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"Barlow Condensed,sans-serif",fontSize:15,fontWeight:700,background:tab===t?"var(--yellow)":"transparent",color:tab===t?"var(--black)":"var(--gray-light)",transition:"all .2s" }}>
                  {t==="login"?"ENTRAR":"CADASTRAR"}
                </button>
              ))}
            </div>
            {error && <div style={{ background:"rgba(200,16,46,.12)",border:"1px solid rgba(200,16,46,.3)",borderRadius:8,padding:"10px 14px",color:"#ef5350",fontSize:13,marginBottom:14 }}>⚠️ {error}</div>}
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              {tab==="register" && <>
                <div>
                  <label style={{ fontSize:12,color:"var(--gray-light)",display:"block",marginBottom:5 }}>NOME COMPLETO</label>
                  <input className="input-field" placeholder="João Silva" value={name} onChange={e=>setName(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize:12,color:"var(--gray-light)",display:"block",marginBottom:5 }}>TELEFONE / WHATSAPP</label>
                  <input className="input-field" placeholder="(31) 99999-0000" value={phone} onChange={e=>setPhone(e.target.value)} />
                </div>
              </>}
              <div>
                <label style={{ fontSize:12,color:"var(--gray-light)",display:"block",marginBottom:5 }}>E-MAIL</label>
                <input className="input-field" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(tab==="login"?handleLogin():handleRegister())} />
              </div>
              <div>
                <label style={{ fontSize:12,color:"var(--gray-light)",display:"block",marginBottom:5 }}>SENHA</label>
                <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(tab==="login"?handleLogin():handleRegister())} />
              </div>
              <button className="btn-primary" style={{ width:"100%",justifyContent:"center",marginTop:4,padding:14,fontSize:17 }}
                onClick={tab==="login"?handleLogin:handleRegister} disabled={loading}>
                {loading ? <><div className="spinner" />Aguarde...</> : tab==="login"?"→ ENTRAR":"→ CRIAR CONTA"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"14px 32px",borderTop:"1px solid var(--gray-mid)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <span style={{ fontSize:12,color:"var(--gray-light)" }}>Av. Acesita, nº 1.080, Olaria — Timóteo/MG</span>
        <span style={{ fontSize:12,color:"var(--gray-light)" }}>🔗 marceneiroshop.com.br · @marceneiroshop</span>
      </div>
    </div>
  );
};

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
const Layout = ({ user, activeTab, setActiveTab, onLogout, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isAdmin = user.role === "admin";
  const sideW = collapsed ? 64 : 220;
  const nav = isAdmin
    ? [{ key:"dashboard",icon:"home",label:"Dashboard" },{ key:"orders",icon:"orders",label:"Todos os Pedidos" },{ key:"users",icon:"users",label:"Clientes" }]
    : [{ key:"dashboard",icon:"home",label:"Dashboard" },{ key:"new-order",icon:"plus",label:"Novo Pedido" },{ key:"orders",icon:"orders",label:"Meus Pedidos" }];

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <div style={{ width:sideW,background:"var(--gray-dark)",borderRight:"1px solid var(--gray-mid)",display:"flex",flexDirection:"column",flexShrink:0,position:"fixed",height:"100vh",left:0,top:0,transition:"width .25s ease",overflow:"hidden",zIndex:100 }}>
        <div className="cnc-strip" />
        <div style={{ padding:"12px",borderBottom:"1px solid var(--gray-mid)",display:"flex",alignItems:"center",gap:8,justifyContent:collapsed?"center":"space-between" }}>
          {!collapsed && (
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <img src={LOGO_IMG} alt="Central Marcenaria 4.0" style={{ height:36, width:"auto", objectFit:"contain" }}/>
            </div>
          )}
          {collapsed && (
            <img src={LOGO_IMG} alt="CM" style={{ height:28, width:28, objectFit:"cover", borderRadius:6 }}/>
          )}
          <button onClick={()=>setCollapsed(c=>!c)} style={{ background:"var(--gray-mid)",border:"1px solid var(--gray)",borderRadius:6,color:"var(--gray-light)",cursor:"pointer",padding:"4px 8px",fontSize:14,flexShrink:0,lineHeight:1,transition:"all .2s" }}
            title={collapsed?"Expandir menu":"Recolher menu"}>
            {collapsed ? "▶" : "◀"}
          </button>
        </div>
        <div style={{ padding:"10px 12px",borderBottom:"1px solid var(--gray-mid)",display:"flex",alignItems:"center",gap:8,justifyContent:collapsed?"center":"flex-start" }}>
          <div style={{ width:30,height:30,borderRadius:"50%",background:isAdmin?"var(--green)":"var(--yellow)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:isAdmin?"white":"var(--black)",flexShrink:0 }}>
            {(user.name||user.email||"?").charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize:12,fontWeight:600 }}>{(user.name||user.email||"").split(" ")[0]}</div>
              <div style={{ fontSize:10,color:isAdmin?"var(--green-light)":"var(--gray-light)" }}>{isAdmin?"🔧 Admin":"👤 Cliente"}</div>
            </div>
          )}
        </div>
        <nav style={{ padding:"10px 8px",flex:1,display:"flex",flexDirection:"column",gap:2 }}>
          {nav.map(item=>(
            <div key={item.key} className={`sidebar-item ${activeTab===item.key?"active":""}`}
              onClick={()=>setActiveTab(item.key)} title={item.label}
              style={{ justifyContent:collapsed?"center":"flex-start",padding:collapsed?"10px 0":"10px 14px" }}>
              <Icon name={item.icon} size={17} />
              {!collapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding:"10px 8px",borderTop:"1px solid var(--gray-mid)" }}>
          <div className="sidebar-item" onClick={onLogout} title="Sair"
            style={{ justifyContent:collapsed?"center":"flex-start",padding:collapsed?"10px 0":"10px 14px" }}>
            <Icon name="logout" size={17} />
            {!collapsed && <span>Sair</span>}
          </div>
        </div>
      </div>
      <div style={{ flex:1,marginLeft:sideW,overflow:"auto",transition:"margin-left .25s ease" }}>
        <div className="fade-in" style={{ padding:"24px 28px" }}>{children}</div>
      </div>
    </div>
  );
};

// ─── CLIENT DASHBOARD ─────────────────────────────────────────────────────────
const ClientDashboard = ({ user, orders, setActiveTab, setSelectedOrder }) => {
  const prontos = orders.filter(o=>o.status==="pronto").length;
  const emAnd = orders.filter(o=>!["pronto","entregue"].includes(o.status)).length;
  const stepIndex = (status) => STATUS_CONFIG[status]?.step ?? 0;

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div className="barlow" style={{ fontSize:34,fontWeight:800 }}>Olá, {(user.name||"").split(" ")[0]}! 👋</div>
        <p style={{ color:"var(--gray-light)",fontSize:14,marginTop:4 }}>Bem-vindo ao portal da Central Marcenaria 4.0.</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20 }}>
        {[["Total de Pedidos",orders.length,"📋","var(--yellow)"],["Em Andamento",emAnd,"⚙️","var(--orange)"],["Prontos p/ Retirada",prontos,"✅","#4caf72"]].map(([label,value,icon,color])=>(
          <div key={label} className="card" style={{ borderLeft:`3px solid ${color}`,padding:"14px 18px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div>
                <div style={{ fontSize:12,color:"var(--gray-light)",marginBottom:4 }}>{label}</div>
                <div className="barlow" style={{ fontSize:40,fontWeight:900,color,lineHeight:1 }}>{value}</div>
              </div>
              <span style={{ fontSize:28 }}>{icon}</span>
            </div>
          </div>
        ))}
      </div>
      {prontos > 0 && (
        <div style={{ background:"rgba(26,107,46,.12)",border:"1px solid rgba(26,107,46,.4)",borderRadius:12,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:16 }}>
          <span style={{ fontSize:24 }}>🎉</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600,color:"#4caf72",fontSize:14 }}>Você tem {prontos} pedido(s) prontos para retirada!</div>
            <div style={{ fontSize:12,color:"var(--gray-light)",marginTop:2 }}>Av. Acesita, nº 1.080, Olaria - Timóteo/MG</div>
          </div>
          <button className="btn-green" onClick={()=>setActiveTab("orders")}>Ver Pedidos</button>
        </div>
      )}
      <div className="card" style={{ marginBottom:16 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <div className="barlow" style={{ fontSize:20,fontWeight:700 }}>Pedidos em Andamento</div>
          <button className="btn-ghost" onClick={()=>setActiveTab("orders")} style={{ fontSize:12 }}>Ver todos</button>
        </div>
        {orders.length===0 ? (
          <div style={{ textAlign:"center",padding:28,color:"var(--gray-light)" }}>
            <div style={{ fontSize:36,marginBottom:10 }}>📂</div>
            <div>Nenhum pedido ainda.</div>
            <button className="btn-primary" style={{ marginTop:14 }} onClick={()=>setActiveTab("new-order")}><Icon name="plus" size={16}/>Criar Primeiro Pedido</button>
          </div>
        ) : orders.slice(0,5).map(o=>{
          const step = stepIndex(o.status);
          const cfg = STATUS_CONFIG[o.status]||STATUS_CONFIG.aguardando;
          const hasUnread = (o.unread_count || 0) > 0;
          return (
            <div key={o.id} style={{ padding:"14px 0",borderBottom:"1px solid var(--gray-mid)",cursor:"pointer" }}
              onClick={()=>{setSelectedOrder(o);setActiveTab("order-detail");}}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontWeight:600,fontSize:14 }}>{o.title}</span>
                  <span style={{ fontSize:12,color:"var(--gray-light)" }}>{o.display_id}</span>
                  {hasUnread && <span className="msg-dot" title="Nova mensagem no chat"/>}
                </div>
                <span className={`badge badge-${cfg.color}`}>{cfg.icon} {cfg.label}</span>
              </div>
              {/* ── FIX BUG 2: fontSize 9→12 nas labels das etapas ── */}
              <div style={{ display:"flex",alignItems:"flex-start",gap:2 }}>
                {STEPS.map((s,i)=>(
                  <div key={s.key} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
                    <div style={{ width:"100%",height:5,borderRadius:3,
                      background:i<step?"#4caf72":i===step?"#66bb6a":"var(--gray-mid)",
                      transition:"background .3s",
                      boxShadow:i===step?"0 0 8px rgba(102,187,106,.5)":"none"
                    }}/>
                    <span style={{ fontSize:12,color:i===step?"#66bb6a":i<step?"#4caf72":"var(--gray-light)",fontWeight:i===step?700:400,textAlign:"center",lineHeight:1.3,whiteSpace:"nowrap" }}>
                      {s.icon} {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11,color:"var(--gray-light)",marginTop:6 }}>
                Etapa {step+1} de 5 · {new Date(o.created_at).toLocaleDateString("pt-BR")}
              </div>
            </div>
          );
        })}
      </div>
      <div className="card" style={{ background:"linear-gradient(135deg,rgba(245,184,0,.08),rgba(26,77,46,.12))",border:"1px solid rgba(245,184,0,.2)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <div className="barlow" style={{ fontSize:20,fontWeight:800,color:"var(--yellow)" }}>NOVO PEDIDO DE CORTE?</div>
            <p style={{ color:"var(--gray-light)",fontSize:13,marginTop:4 }}>Envie seu projeto e acompanhe cada etapa em tempo real.</p>
          </div>
          <button className="btn-primary" onClick={()=>setActiveTab("new-order")}><Icon name="plus" size={16}/>Criar Pedido</button>
        </div>
      </div>
    </div>
  );
};

// ─── NEW ORDER ────────────────────────────────────────────────────────────────
const NewOrder = ({ user, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [ot, setOt] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const fileRef = useRef(); const imgRef = useRef();

  const handleFileAdd = (e, type) => {
    const arr = Array.from(e.target.files||[]);
    if (type==="file") setFiles(p=>[...p,...arr]);
    else setImages(p=>[...p,...arr]);
  };

  const handleSubmit = async () => {
    if (!title||!description) return;
    setLoading(true);
    try {
      const display_id = "CM-" + Date.now().toString().slice(-5);
      const fullTitle = `${title}${clientName?" — "+clientName:""}${ot?" [OT:"+ot+"]":""}`;
      const { data: order, error } = await supabase.from("orders").insert({
        display_id, client_id: user.id, client_name: user.name||user.email,
        title: fullTitle, description, status: "aguardando"
      }).select().single();
      if (error) { console.error("Erro ao criar pedido:", error); setLoading(false); return; }
      const uploadWithTimeout = (file, path) => Promise.race([
        supabase.storage.from("order-files").upload(path, file, { upsert: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 15000))
      ]);
      const allFiles = [...files.map(f=>({file:f,isImage:false})), ...images.map(f=>({file:f,isImage:true}))];
      for (const {file, isImage} of allFiles) {
        try {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const path = `${order.id}/${Date.now()}-${safeName}`;
          const result = await uploadWithTimeout(file, path);
          if (result.error) { console.error("Erro upload:", result.error); continue; }
          const { data: { publicUrl } } = supabase.storage.from("order-files").getPublicUrl(path);
          await supabase.from("order_files").insert({ order_id: order.id, name: file.name, size: (file.size/1024).toFixed(0)+" KB", type: file.name.split(".").pop(), url: publicUrl, is_image: isImage });
        } catch(uploadErr) { console.error("Upload falhou:", uploadErr.message); }
      }
      setSubmitted(order);
    } catch(err) { console.error("Erro geral:", err); }
    setLoading(false);
  };

  const resetForm = () => { setSubmitted(null);setTitle("");setClientName("");setOt("");setDescription("");setFiles([]);setImages([]); };

  if (submitted) return (
    <div className="modal-overlay">
      <div style={{ background:"var(--gray-dark)",border:"1px solid rgba(76,175,114,.3)",borderRadius:16,padding:"36px 32px",maxWidth:460,width:"90%",textAlign:"center",animation:"fadeIn .3s ease",boxShadow:"0 20px 60px rgba(0,0,0,.6)" }}>
        <div style={{ width:68,height:68,borderRadius:"50%",background:"rgba(76,175,114,.15)",border:"3px solid #4caf72",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 16px" }}>✅</div>
        <div className="barlow" style={{ fontSize:28,fontWeight:900,color:"var(--white)",marginBottom:6 }}>PEDIDO ENVIADO!</div>
        <div style={{ fontSize:13,color:"var(--gray-light)",marginBottom:20 }}>Sua solicitação foi recebida com sucesso</div>
        <div style={{ background:"rgba(245,184,0,.08)",border:"1px solid rgba(245,184,0,.15)",borderRadius:10,padding:"14px 18px",marginBottom:20,textAlign:"left" }}>
          <div style={{ fontSize:11,color:"var(--gray-light)",marginBottom:4,textTransform:"uppercase",letterSpacing:.5 }}>Número do pedido</div>
          <div style={{ fontSize:22,fontWeight:800,color:"var(--yellow)",marginBottom:12 }}>{submitted.display_id}</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8,fontSize:13,color:"var(--off-white)" }}>
            <div style={{ display:"flex",gap:8,alignItems:"flex-start" }}><span>📊</span><span>Acompanhe o progresso no seu <strong>painel</strong> — a barra mostrará cada etapa em tempo real</span></div>
            <div style={{ display:"flex",gap:8,alignItems:"flex-start" }}><span>💬</span><span>Precisa informar algo? Use o <strong>chat interno</strong> do pedido</span></div>
            <div style={{ display:"flex",gap:8,alignItems:"flex-start" }}><span>📲</span><span>Você será notificado quando o pedido estiver <strong>pronto para retirada</strong></span></div>
          </div>
        </div>
        <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
          <button className="btn-primary" style={{ padding:"12px 24px",fontSize:15 }} onClick={()=>{setSubmitted(null);onSubmit();}}>OK, ver meus pedidos →</button>
          <button className="btn-ghost" style={{ fontSize:13 }} onClick={resetForm}>Novo Pedido</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div className="barlow" style={{ fontSize:30,fontWeight:800 }}>Novo Pedido</div>
        <p style={{ color:"var(--gray-light)",fontSize:14,marginTop:4 }}>Preencha as informações e anexe os arquivos do projeto.</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:20 }}>
        <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
          <div className="card">
            <div className="barlow" style={{ fontSize:17,fontWeight:700,marginBottom:14 }}>Informações do Pedido</div>
            <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                <div>
                  <label style={{ fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5 }}>AMBIENTE *</label>
                  <input className="input-field" placeholder="Ex: Sala de Estar, Cozinha..." value={title} onChange={e=>setTitle(e.target.value)}/>
                </div>
                <div>
                  <label style={{ fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5 }}>CLIENTE (SOLICITANTE)</label>
                  <input className="input-field" placeholder="Nome do cliente final" value={clientName} onChange={e=>setClientName(e.target.value)}/>
                </div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"160px 1fr",gap:12 }}>
                <div>
                  <label style={{ fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5 }}>Nº OT</label>
                  <input className="input-field" placeholder="Ex: 1042" type="number" value={ot} onChange={e=>setOt(e.target.value)}/>
                </div>
                <div>
                  <label style={{ fontSize:11,color:"var(--gray-light)",display:"block",marginBottom:5 }}>DESCRIÇÃO DETALHADA *</label>
                  <input className="input-field" placeholder="Material, espessura, tipo de borda, quantidade de peças..." value={description} onChange={e=>setDescription(e.target.value)}/>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="barlow" style={{ fontSize:17,fontWeight:700,marginBottom:12 }}>📁 Arquivos de Relatórios</div>
            <div className="upload-zone" onClick={()=>fileRef.current.click()}>
              <input ref={fileRef} type="file" multiple style={{ display:"none" }} onChange={e=>handleFileAdd(e,"file")} accept=".dxf,.cnc,.dwg,.pdf,.svg,.nc,.zip"/>
              <div style={{ fontSize:28,marginBottom:6 }}>📂</div>
              <div style={{ fontWeight:600,marginBottom:3 }}>Clique para enviar arquivos</div>
              <div style={{ fontSize:12,color:"var(--gray-light)" }}>DXF, CNC, DWG, PDF, SVG, NC, ZIP</div>
            </div>
            {files.length>0 && <div style={{ marginTop:10,display:"flex",flexDirection:"column",gap:6 }}>
              {files.map((f,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,background:"var(--gray-mid)",borderRadius:8,padding:"9px 12px" }}>
                  <span>📄</span>
                  <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:500 }}>{f.name}</div><div style={{ fontSize:11,color:"var(--gray-light)" }}>{(f.size/1024).toFixed(0)} KB</div></div>
                  <button onClick={()=>setFiles(files.filter((_,j)=>j!==i))} style={{ background:"none",border:"none",color:"var(--gray-light)",cursor:"pointer",fontSize:18 }}>×</button>
                </div>
              ))}
            </div>}
          </div>
          <div className="card">
            <div className="barlow" style={{ fontSize:17,fontWeight:700,marginBottom:12 }}>🖼️ Imagens do Projeto</div>
            <div className="upload-zone" onClick={()=>imgRef.current.click()}>
              <input ref={imgRef} type="file" multiple style={{ display:"none" }} onChange={e=>handleFileAdd(e,"image")} accept="image/*"/>
              <div style={{ fontSize:28,marginBottom:6 }}>🖼️</div>
              <div style={{ fontWeight:600,marginBottom:3 }}>Adicionar imagens</div>
              <div style={{ fontSize:12,color:"var(--gray-light)" }}>JPG, PNG, WEBP</div>
            </div>
            {images.length>0 && <div style={{ marginTop:10,display:"flex",gap:8,flexWrap:"wrap" }}>
              {images.map((img,i)=>(
                <div key={i} style={{ background:"var(--gray-mid)",borderRadius:8,padding:"7px 11px",display:"flex",alignItems:"center",gap:7,fontSize:13 }}>
                  🖼️ {img.name}
                  <button onClick={()=>setImages(images.filter((_,j)=>j!==i))} style={{ background:"none",border:"none",color:"var(--gray-light)",cursor:"pointer" }}>×</button>
                </div>
              ))}
            </div>}
          </div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div className="card" style={{ borderColor:"rgba(245,184,0,.3)" }}>
            <div className="barlow" style={{ fontSize:17,fontWeight:700,marginBottom:12,color:"var(--yellow)" }}>Resumo</div>
            <div style={{ display:"flex",flexDirection:"column",gap:9,fontSize:13 }}>
              {title && <div style={{ display:"flex",justifyContent:"space-between" }}><span style={{ color:"var(--gray-light)" }}>Ambiente</span><span style={{ fontWeight:500,textAlign:"right",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{title}</span></div>}
              {clientName && <div style={{ display:"flex",justifyContent:"space-between" }}><span style={{ color:"var(--gray-light)" }}>Cliente</span><span>{clientName}</span></div>}
              {ot && <div style={{ display:"flex",justifyContent:"space-between" }}><span style={{ color:"var(--gray-light)" }}>Nº OT</span><span style={{ color:"var(--yellow)",fontWeight:600 }}>{ot}</span></div>}
              <div style={{ display:"flex",justifyContent:"space-between" }}><span style={{ color:"var(--gray-light)" }}>Arquivos</span><span>{files.length}</span></div>
              <div style={{ display:"flex",justifyContent:"space-between" }}><span style={{ color:"var(--gray-light)" }}>Imagens</span><span>{images.length}</span></div>
              <div style={{ display:"flex",justifyContent:"space-between" }}><span style={{ color:"var(--gray-light)" }}>Status</span><StatusBadge status="aguardando"/></div>
            </div>
            <div style={{ borderTop:"1px solid var(--gray)",margin:"14px 0" }}/>
            <button className="btn-primary" style={{ width:"100%",justifyContent:"center",padding:13,fontSize:16,opacity:(!title||!description)?0.5:1 }}
              onClick={handleSubmit} disabled={!title||!description||loading}>
              {loading?<><div className="spinner"/>Enviando...</>:"🚀 LIBERAR PEDIDO"}
            </button>
            <p style={{ fontSize:11,color:"var(--gray-light)",textAlign:"center",marginTop:7 }}>A equipe da Central será notificada.</p>
          </div>
          <div className="card" style={{ background:"rgba(26,77,46,.1)" }}>
            <div style={{ fontSize:13,color:"var(--gray-light)",lineHeight:1.9 }}>
              <div style={{ fontWeight:600,color:"var(--white)",marginBottom:8 }}>💡 Dicas para seu pedido:</div>
              <div>• Informe o <strong style={{color:"var(--white)"}}>ambiente</strong> (sala, cozinha, etc.)</div>
              <div>• Coloque o <strong style={{color:"var(--white)"}}>nome do cliente</strong> para rastrear</div>
              <div>• Anexe o arquivo <strong style={{color:"var(--white)"}}>DXF ou CNC</strong> do projeto</div>
              <div>• Especifique <strong style={{color:"var(--white)"}}>material e espessura</strong></div>
              <div>• Informe o <strong style={{color:"var(--white)"}}>tipo de borda</strong> desejado</div>
              <div>• Use o <strong style={{color:"var(--white)"}}>chat interno</strong> para dúvidas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ORDER LIST ───────────────────────────────────────────────────────────────
const OrderList = ({ user, orders, setSelectedOrder, setActiveTab }) => {
  const [filter, setFilter] = useState("all");
  const isAdmin = user.role==="admin";
  const filtered = filter==="all"?orders:orders.filter(o=>o.status===filter);

  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <div className="barlow" style={{ fontSize:32,fontWeight:800 }}>{isAdmin?"Todos os Pedidos":"Meus Pedidos"}</div>
        <p style={{ color:"var(--gray-light)",fontSize:14,marginTop:4 }}>{filtered.length} pedido(s)</p>
      </div>
      <div style={{ display:"flex",gap:8,marginBottom:18,flexWrap:"wrap" }}>
        {[["all","Todos"],["aguardando","Aguardando"],["analise","Análise"],["corte","Corte"],["filetamento","Filetamento"],["pronto","Pronto"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{ padding:"7px 16px",borderRadius:20,border:`1.5px solid ${filter===k?"var(--yellow)":"var(--gray)"}`,background:filter===k?"rgba(245,184,0,.1)":"transparent",color:filter===k?"var(--yellow)":"var(--gray-light)",fontSize:13,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .2s" }}>
            {l}
          </button>
        ))}
      </div>
      <div className="card" style={{ padding:0,overflow:"hidden" }}>
        <div className="table-row table-header" style={{ gridTemplateColumns:isAdmin?"2fr 130px 150px 70px":"2fr 150px 70px",cursor:"default" }}>
          <span>Pedido</span>{isAdmin&&<span>Cliente</span>}<span>Status</span><span></span>
        </div>
        {filtered.length===0 ? (
          <div style={{ textAlign:"center",padding:40,color:"var(--gray-light)" }}><div style={{ fontSize:32,marginBottom:8 }}>📂</div>Nenhum pedido.</div>
        ) : filtered.map(o=>(
          <div key={o.id} className="table-row" style={{ gridTemplateColumns:isAdmin?"2fr 130px 150px 70px":"2fr 150px 70px",cursor:"pointer" }}
            onClick={()=>{setSelectedOrder(o);setActiveTab("order-detail");}}>
            {/* ── FIX BUG 1: msg-dot na listagem ── */}
            <div>
              <div style={{ fontWeight:500,fontSize:14,display:"flex",alignItems:"center",gap:8 }}>
                {o.title}
                {(o.unread_count || 0) > 0 && <span className="msg-dot" title="Nova mensagem"/>}
              </div>
              <div style={{ fontSize:12,color:"var(--gray-light)",marginTop:2 }}>{o.display_id} · {new Date(o.created_at).toLocaleDateString("pt-BR")}</div>
            </div>
            {isAdmin&&<div style={{ fontSize:13 }}>{o.client_name}</div>}
            <StatusBadge status={o.status}/>
            <div style={{ color:"var(--yellow)",fontSize:18 }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ORDER DETAIL ─────────────────────────────────────────────────────────────
const OrderDetail = ({ order, user, onBack, onUpdateStatus }) => {
  const [messages, setMessages] = useState([]);
  const [orderFiles, setOrderFiles] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [preview, setPreview] = useState(null);
  const chatRef = useRef();
  const isAdmin = user.role==="admin";
  const pollRef = useRef();

  const loadMessages = async () => {
    try {
      const {data} = await supabase.from("messages").select("*").eq("order_id",order.id).order("created_at");
      if(data) setMessages(data);
    } catch(e){}
  };

  useEffect(() => {
    supabase.from("order_files").select("*").eq("order_id",order.id).then(({data})=>setOrderFiles(data||[]));
    loadMessages();

    // ── FIX BUG 1: marca como lido ao abrir o pedido ──
    const field = user.role === "admin" ? "last_read_admin_at" : "last_read_client_at";
    supabase.from("orders").update({ [field]: new Date().toISOString() }).eq("id", order.id).then(()=>{});

    pollRef.current = setInterval(loadMessages, 4000);
    return ()=>{ clearInterval(pollRef.current); };
  }, [order.id]);

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; },[messages]);

  const handleSend = async () => {
    if (!newMsg.trim() || sending) return;
    const txt = newMsg;
    setNewMsg("");
    setSending(true);
    try {
      await supabase.from("messages").insert({ order_id: order.id, sender_id: user.id, sender_name: user.name || user.email, sender_role: user.role, text: txt });
      await loadMessages();
    } catch(e) { setNewMsg(txt); }
    setSending(false);
  };

  const handleAdvance = async () => {
    const next = NEXT_STATUS[currentOrder.status];
    if(!next) return;
    try {
      const now = new Date().toISOString();
      const newHistory = {...(currentOrder.step_history||{}), [next]: now};
      await supabase.from("orders").update({status: next, step_history: newHistory}).eq("id", currentOrder.id);
      setCurrentOrder(prev=>({...prev, status: next, step_history: newHistory}));
      onUpdateStatus(currentOrder.id, next, ()=>{});
    } catch(e){ console.error(e); }
  };

  return (
    <div>
      {preview && (
        <div onClick={()=>setPreview(null)} style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"rgba(0,0,0,0.92)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",cursor:"zoom-out" }}>
          <div onClick={e=>e.stopPropagation()} style={{ position:"relative",maxWidth:"90vw",maxHeight:"90vh" }}>
            <button onClick={()=>setPreview(null)} style={{ position:"absolute",top:-40,right:0,background:"none",border:"none",color:"white",fontSize:32,cursor:"pointer" }}>×</button>
            {preview.is_image ? (
              <img src={preview.url} alt={preview.name} style={{ maxWidth:"85vw",maxHeight:"85vh",borderRadius:8,objectFit:"contain" }}/>
            ) : (
              <iframe src={preview.url} title={preview.name} style={{ width:"80vw",height:"80vh",border:"none",borderRadius:8,background:"white" }}/>
            )}
            <div style={{ textAlign:"center",marginTop:12,color:"var(--gray-light)",fontSize:13 }}>{preview.name}</div>
            <div style={{ textAlign:"center",marginTop:8 }}>
              <a href={preview.url} download target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize:13,padding:"8px 18px",textDecoration:"none" }}>↓ Baixar</a>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:24 }}>
        <button className="btn-ghost" onClick={onBack} style={{ padding:"8px 14px" }}><Icon name="arrow" size={14}/>Voltar</button>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
            <div className="barlow" style={{ fontSize:26,fontWeight:800 }}>{currentOrder.title}</div>
            <StatusBadge status={currentOrder.status}/>
          </div>
          <div style={{ fontSize:13,color:"var(--gray-light)",marginTop:2 }}>{currentOrder.display_id} · {currentOrder.client_name} · {new Date(currentOrder.created_at).toLocaleDateString("pt-BR")}</div>
        </div>
        {isAdmin&&NEXT_STATUS[currentOrder.status]&&(
          <button className="btn-primary" onClick={handleAdvance}>
            ▶ Avançar: {STATUS_CONFIG[NEXT_STATUS[currentOrder.status]]?.label}
          </button>
        )}
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <div className="barlow" style={{ fontSize:16,fontWeight:700,marginBottom:4 }}>Progresso do Pedido</div>
        <StatusSteps currentStatus={currentOrder.status} stepHistory={currentOrder.step_history||{}}/>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:20 }}>
        <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
          <div className="card">
            <div className="barlow" style={{ fontSize:16,fontWeight:700,marginBottom:10 }}>📋 Descrição</div>
            <p style={{ fontSize:14,color:"var(--off-white)",lineHeight:1.7 }}>{currentOrder.description}</p>
          </div>
          {orderFiles.length>0&&(
            <div className="card">
              <div className="barlow" style={{ fontSize:16,fontWeight:700,marginBottom:12 }}>📎 Anexos</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {orderFiles.map(f=>(
                  <div key={f.id} onClick={()=>setPreview(f)}
                    style={{ display:"flex",alignItems:"center",gap:10,background:"var(--gray-mid)",borderRadius:8,padding:"10px 14px",cursor:"pointer",transition:"background .2s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--gray)"}
                    onMouseLeave={e=>e.currentTarget.style.background="var(--gray-mid)"}>
                    <span style={{ fontSize:20 }}>{f.is_image?"🖼️":"📄"}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:500 }}>{f.name}</div>
                      <div style={{ fontSize:11,color:"var(--gray-light)" }}>{f.size}</div>
                    </div>
                    <span style={{ fontSize:12,color:"var(--yellow)",fontWeight:600 }}>{f.is_image ? "👁️ Ver" : "📖 Abrir"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="card">
            <div className="barlow" style={{ fontSize:16,fontWeight:700,marginBottom:12 }}>💬 Mensagens</div>
            <div ref={chatRef} style={{ maxHeight:280,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,marginBottom:14,paddingRight:4 }}>
              {messages.length===0&&<div style={{ textAlign:"center",color:"var(--gray-light)",fontSize:13,padding:20 }}>Inicie a conversa!</div>}
              {messages.map(msg=>{
                const isMine=(isAdmin&&msg.sender_role==="admin")||(!isAdmin&&msg.sender_role!=="admin");
                return (
                  <div key={msg.id} style={{ display:"flex",flexDirection:"column",alignItems:isMine?"flex-end":"flex-start" }}>
                    <div style={{ fontSize:11,color:"var(--gray-light)",marginBottom:4 }}>{msg.sender_name} · {new Date(msg.created_at).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</div>
                    <div className={`chat-bubble ${isMine?"chat-mine":"chat-other"}`}>{msg.text}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <input className="input-field" placeholder="Digite uma mensagem..." value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend()}/>
              <button className="btn-primary" onClick={handleSend} disabled={sending} style={{ padding:"0 16px",flexShrink:0 }}><Icon name="send" size={16}/></button>
            </div>
          </div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          <div className="card">
            <div className="barlow" style={{ fontSize:16,fontWeight:700,marginBottom:12 }}>Detalhes</div>
            {[["ID",currentOrder.display_id],["Cliente",currentOrder.client_name],["Abertura",new Date(currentOrder.created_at).toLocaleDateString("pt-BR")],["Anexos",orderFiles.length],["Mensagens",messages.length]].map(([l,v])=>(
              <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--gray-mid)",fontSize:13 }}>
                <span style={{ color:"var(--gray-light)" }}>{l}</span><span style={{ fontWeight:500 }}>{v}</span>
              </div>
            ))}
          </div>
          {isAdmin&&(
            <div className="card">
              <div className="barlow" style={{ fontSize:16,fontWeight:700,marginBottom:12 }}>⚙️ Atualizar Status</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {Object.entries(STATUS_CONFIG).map(([key,cfg])=>(
                  <button key={key} onClick={()=>onUpdateStatus(currentOrder.id,key,setCurrentOrder)}
                    style={{ padding:"10px 14px",borderRadius:8,border:`1.5px solid ${currentOrder.status===key?"var(--yellow)":"var(--gray)"}`,background:currentOrder.status===key?"rgba(245,184,0,.12)":"transparent",color:currentOrder.status===key?"var(--yellow)":"var(--gray-light)",fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"DM Sans,sans-serif",transition:"all .2s",display:"flex",alignItems:"center",gap:8 }}>
                    {cfg.icon} {cfg.label}{currentOrder.status===key&&<span style={{ marginLeft:"auto",color:"var(--yellow)" }}>◉</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const AdminDashboard = ({ orders, setSelectedOrder, setActiveTab }) => {
  const stats = {
    total:orders.length,
    aguardando:orders.filter(o=>o.status==="aguardando").length,
    prod:orders.filter(o=>["analise","corte","filetamento"].includes(o.status)).length,
    prontos:orders.filter(o=>o.status==="pronto").length,
  };
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div className="barlow" style={{ fontSize:36,fontWeight:800 }}>Painel <span style={{ color:"var(--yellow)" }}>Central 4.0</span></div>
        <p style={{ color:"var(--gray-light)",fontSize:14,marginTop:4 }}>Visão geral de todos os pedidos.</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24 }}>
        {[["Total",stats.total,"📦","var(--yellow)"],["Aguardando",stats.aguardando,"⏳","#64b5f6"],["Em Produção",stats.prod,"🪚","var(--orange)"],["Prontos",stats.prontos,"✅","#4caf72"]].map(([l,v,ic,c])=>(
          <div key={l} className="card" style={{ borderTop:`3px solid ${c}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div><div style={{ fontSize:12,color:"var(--gray-light)",marginBottom:6 }}>{l}</div><div className="barlow" style={{ fontSize:44,fontWeight:900,color:c,lineHeight:1 }}>{v}</div></div>
              <span style={{ fontSize:28 }}>{ic}</span>
            </div>
          </div>
        ))}
      </div>
      {stats.aguardando>0&&(
        <div style={{ background:"rgba(245,184,0,.08)",border:"1px solid rgba(245,184,0,.3)",borderRadius:12,padding:"14px 18px",marginBottom:20 }}>
          <div style={{ fontWeight:600,color:"var(--yellow)",fontSize:15 }}>⚠️ {stats.aguardando} pedido(s) aguardando análise</div>
        </div>
      )}
      <div className="card">
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <div className="barlow" style={{ fontSize:20,fontWeight:700 }}>Pedidos Recentes</div>
          <button className="btn-ghost" onClick={()=>setActiveTab("orders")}>Ver todos</button>
        </div>
        {orders.slice(0,6).map(o=>(
          <div key={o.id} className="table-row" style={{ gridTemplateColumns:"1fr 130px 160px 70px",cursor:"pointer" }} onClick={()=>{setSelectedOrder(o);setActiveTab("order-detail");}}>
            {/* ── FIX BUG 1: msg-dot no admin dashboard ── */}
            <div>
              <div style={{ fontWeight:500,fontSize:14,display:"flex",alignItems:"center",gap:8 }}>
                {o.title}
                {(o.unread_count || 0) > 0 && <span className="msg-dot" title="Nova mensagem"/>}
              </div>
              <div style={{ fontSize:12,color:"var(--gray-light)",marginTop:2 }}>{o.display_id} · {o.client_name}</div>
            </div>
            <div style={{ fontSize:13,color:"var(--gray-light)" }}>{new Date(o.created_at).toLocaleDateString("pt-BR")}</div>
            <StatusBadge status={o.status}/>
            <div style={{ color:"var(--yellow)",fontSize:18 }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── USERS PAGE ───────────────────────────────────────────────────────────────
const UsersPage = ({ orders }) => {
  const [clients, setClients] = useState([]);
  useEffect(()=>{
    supabase.from("profiles").select("*").eq("role","client").then(({data})=>setClients(data||[]));
  },[]);
  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <div className="barlow" style={{ fontSize:32,fontWeight:800 }}>Clientes</div>
        <p style={{ color:"var(--gray-light)",fontSize:14,marginTop:4 }}>{clients.length} clientes cadastrados</p>
      </div>
      <div className="card" style={{ padding:0,overflow:"hidden" }}>
        <div className="table-row table-header" style={{ gridTemplateColumns:"2fr 1fr 80px",cursor:"default" }}>
          <span>Cliente</span><span>Telefone</span><span>Pedidos</span>
        </div>
        {clients.map(c=>(
          <div key={c.id} className="table-row" style={{ gridTemplateColumns:"2fr 1fr 80px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:36,height:36,borderRadius:"50%",background:"var(--yellow)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"var(--black)",fontSize:14,flexShrink:0 }}>{(c.name||"?").charAt(0)}</div>
              <div><div style={{ fontWeight:500 }}>{c.name}</div><div style={{ fontSize:12,color:"var(--gray-light)" }}>{c.email}</div></div>
            </div>
            <div style={{ fontSize:13,color:"var(--gray-light)" }}>{c.phone||"—"}</div>
            <div style={{ fontSize:14,fontWeight:600,color:"var(--yellow)" }}>{orders.filter(o=>o.client_id===c.id).length}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const inactivityRef = useRef(null);
  const heartbeatRef = useRef(null);

  const resetInactivity = useCallback(() => {
    clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(async () => {
      await supabase.auth.signOut();
      setUser(null);
      setOrders([]);
    }, 40 * 60 * 1000);
  }, []);

  const startHeartbeat = useCallback(() => {
    clearInterval(heartbeatRef.current);
    heartbeatRef.current = setInterval(async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) return;
        await supabase.auth.refreshSession();
      } catch(e) {}
    }, 2 * 60 * 1000);
  }, []);

  useEffect(() => {
    if (!user) return;
    const events = ["mousedown","keydown","touchstart","scroll","click"];
    events.forEach(e => window.addEventListener(e, resetInactivity, { passive: true }));
    resetInactivity();
    startHeartbeat();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetInactivity));
      clearTimeout(inactivityRef.current);
      clearInterval(heartbeatRef.current);
    };
  }, [user, resetInactivity, startHeartbeat]);

  useEffect(()=>{
    let authTimeout;
    const buildUser = async (session) => {
      if (!session?.user) return null;
      try {
        const {data: profile} = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        if (profile) return {...session.user, ...profile};
        const newProfile = { id: session.user.id, name: session.user.email?.split("@")[0] || "Usuário", phone: "", role: "client" };
        await supabase.from("profiles").upsert(newProfile, {onConflict:"id"});
        return {...session.user, ...newProfile};
      } catch(e) {
        return { ...session.user, name: session.user.email?.split("@")[0] || "Usuário", role: "client" };
      }
    };
    try {
      const projectRef = import.meta.env.VITE_SUPABASE_URL?.match(/\/\/([^.]+)\./)?.[1];
      const key = `sb-${projectRef}-auth-token`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const stored = JSON.parse(raw);
        const exp = stored?.expires_at || stored?.user?.exp;
        const valid = exp && (exp * 1000) > Date.now();
        if (valid && stored?.user) {
          setAuthLoading(false);
          supabase.from("profiles").select("*").eq("id", stored.user.id).maybeSingle().then(({data: profile}) => {
            setUser({ ...stored.user, name: profile?.name || stored.user.email?.split("@")[0] || "Usuário", phone: profile?.phone || "", role: profile?.role || "client" });
          }).catch(()=>{
            setUser({ ...stored.user, name: stored.user.email?.split("@")[0] || "Usuário", role: "client" });
          });
          return;
        }
      }
    } catch(e) {}
    authTimeout = setTimeout(() => { setAuthLoading(false); }, 8000);
    supabase.auth.getSession().then(async({data:{session}})=>{
      clearTimeout(authTimeout);
      if (session) { const u = await buildUser(session); if (u) setUser(u); }
      setAuthLoading(false);
    }).catch(() => { clearTimeout(authTimeout); setAuthLoading(false); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange(async(event, session)=>{
      if (event === "SIGNED_IN" && session) { const u = await buildUser(session); if (u) setUser(u); }
      else if (event === "SIGNED_OUT") { setUser(null); }
      else if (event === "TOKEN_REFRESHED" && session) { setUser(prev => prev ? {...prev, ...session.user} : prev); }
    });
    return () => { clearTimeout(authTimeout); subscription.unsubscribe(); };
  },[]);

  // ── FIX BUG 1: loadOrders calcula unread_count ──
  const loadOrders = useCallback(async()=>{
    if(!user) return;
    setOrdersLoading(true);
    let query = supabase.from("orders").select("*").order("created_at",{ascending:false});
    if(user.role!=="admin") query=query.eq("client_id",user.id);
    const {data}=await query;

    const list = data || [];
    if (list.length > 0) {
      const orderIds = list.map(o => o.id);
      const { data: msgs } = await supabase
        .from("messages")
        .select("order_id, sender_role, created_at")
        .in("order_id", orderIds);

      const withUnread = list.map(o => {
        const lastRead = user.role === "admin" ? o.last_read_admin_at : o.last_read_client_at;
        const lastReadDate = lastRead ? new Date(lastRead) : new Date(0);
        const unread = (msgs || []).filter(m =>
          m.order_id === o.id &&
          m.sender_role !== user.role &&
          new Date(m.created_at) > lastReadDate
        ).length;
        return { ...o, unread_count: unread };
      });
      setOrders(withUnread);
    } else {
      setOrders(list);
    }
    setOrdersLoading(false);
  },[user]);

  useEffect(()=>{ if(user) loadOrders(); },[user, loadOrders]);

  // ── FIX BUG 1: realtime escuta messages também ──
  useEffect(()=>{
    if(!user) return;
    const channel=supabase.channel("orders-changes")
      .on("postgres_changes",{event:"*",schema:"public",table:"orders"},()=>loadOrders())
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},()=>loadOrders())
      .subscribe();
    return ()=>supabase.removeChannel(channel);
  },[user, loadOrders]);

  const handleLogin=(u)=>setUser(u);
  const handleLogout=async()=>{ await supabase.auth.signOut(); setUser(null); setOrders([]); setActiveTab("dashboard"); };

  const handleUpdateStatus = async(orderId, newStatus, setCurrentOrder)=>{
    await supabase.from("orders").update({status:newStatus}).eq("id",orderId);
    setOrders(prev=>prev.map(o=>o.id===orderId?{...o,status:newStatus}:o));
    if(setCurrentOrder) setCurrentOrder(prev=>({...prev,status:newStatus}));
  };

  if(authLoading) return <><FontLoader/><Loading text="Verificando sessão..."/></>;
  if(!user) return <><FontLoader/><LoginPage onLogin={handleLogin}/></>;

  const renderContent=()=>{
    if(activeTab==="order-detail"&&selectedOrder){
      return <OrderDetail order={selectedOrder} user={user} onBack={()=>setActiveTab("orders")} onUpdateStatus={handleUpdateStatus}/>;
    }
    if(ordersLoading) return <Loading text="Carregando pedidos..."/>;
    if(user.role==="admin"){
      if(activeTab==="dashboard") return <AdminDashboard orders={orders} setSelectedOrder={setSelectedOrder} setActiveTab={setActiveTab}/>;
      if(activeTab==="orders") return <OrderList user={user} orders={orders} setSelectedOrder={setSelectedOrder} setActiveTab={setActiveTab}/>;
      if(activeTab==="users") return <UsersPage orders={orders}/>;
    } else {
      if(activeTab==="dashboard") return <ClientDashboard user={user} orders={orders} setActiveTab={setActiveTab} setSelectedOrder={setSelectedOrder}/>;
      if(activeTab==="new-order") return <NewOrder user={user} onSubmit={()=>{loadOrders();setActiveTab("orders");}}/>;
      if(activeTab==="orders") return <OrderList user={user} orders={orders} setSelectedOrder={setSelectedOrder} setActiveTab={setActiveTab}/>;
    }
  };

  return <><FontLoader/><Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} orders={orders}>{renderContent()}</Layout></>;
}
