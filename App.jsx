import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const API = "https://stride-backend-oycv.onrender.com";
const PROFILE = {
  name: "Benjamin",
  age: 46, height: 176, weight: 72, maxHR: 174,
  records: { "10km": "42:07", "Semi": "1h34:02", "Marathon": "3h16:11" },
  zones: {
    z1: { name: "Z1 Récup",  color: "#1e3a5f" },
    z2: { name: "Z2 EF",     color: "#1a56db" },
    z3: { name: "Z3 Tempo",  color: "#0ea5e9" },
    z4: { name: "Z4 Seuil",  color: "#38bdf8" },
    z5: { name: "Z5 VMA",    color: "#7dd3fc" },
  },
};

// ── CSS ────────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
:root {
  --bg:#050d1a; --bg2:#091425; --bg3:#0d1f38;
  --card:#0a1628; --card2:#0e1e35;
  --border:#1a3354; --border2:#1e3d66;
  --blue1:#1a56db; --blue3:#0ea5e9; --blue4:#38bdf8;
  --accent:#00d4ff; --text:#e8f4fd; --text2:#8fb3d4; --text3:#4a7499;
  --green:#10b981; --orange:#f59e0b; --red:#ef4444;
  --font-d:'Bebas Neue',sans-serif; --font-b:'DM Sans',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--text);font-family:var(--font-b);min-height:100vh;}
.app{display:flex;min-height:100vh;}
.sidebar{width:72px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;padding:20px 0;gap:8px;position:fixed;top:0;left:0;bottom:0;z-index:100;}
.logo{font-family:var(--font-d);font-size:18px;color:var(--accent);letter-spacing:2px;margin-bottom:24px;writing-mode:vertical-rl;transform:rotate(180deg);}
.nav{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text3);font-size:20px;transition:all .2s;border:1px solid transparent;background:none;position:relative;}
.nav:hover{color:var(--blue4);background:var(--bg3);}
.nav.active{color:var(--accent);background:rgba(0,212,255,.1);border-color:rgba(0,212,255,.3);}
.tip{position:absolute;left:58px;background:var(--bg3);border:1px solid var(--border2);padding:6px 12px;border-radius:8px;font-size:12px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .15s;color:var(--text);}
.nav:hover .tip{opacity:1;}
.main{margin-left:72px;flex:1;overflow-y:auto;padding:32px;max-width:calc(100vw - 72px);}
.ph{display:flex;align-items:baseline;gap:16px;margin-bottom:32px;}
.pt{font-family:var(--font-d);font-size:48px;letter-spacing:3px;line-height:1;}
.ps{color:var(--text3);font-size:14px;font-weight:300;}
.dot{width:8px;height:8px;background:var(--green);border-radius:50%;box-shadow:0 0 8px var(--green);animation:pulse 2s infinite;margin-left:auto;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(1.3);}}
.grid{display:grid;gap:16px;}
.g4{grid-template-columns:repeat(4,1fr);}
.g3{grid-template-columns:repeat(3,1fr);}
.g2{grid-template-columns:repeat(2,1fr);}
.g21{grid-template-columns:2fr 1fr;}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--border2),transparent);}
.ca{border-color:rgba(0,212,255,.3);}
.ca::before{background:linear-gradient(90deg,transparent,var(--accent),transparent);}
.lbl{font-size:10px;font-weight:600;letter-spacing:2px;color:var(--text3);text-transform:uppercase;margin-bottom:8px;}
.val{font-family:var(--font-d);font-size:42px;letter-spacing:1px;line-height:1;}
.unit{font-size:14px;color:var(--text3);font-weight:300;margin-left:4px;}
.sec{font-size:11px;font-weight:600;letter-spacing:2px;color:var(--text3);text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.sec::after{content:'';flex:1;height:1px;background:var(--border);}
.pb{height:4px;background:var(--bg3);border-radius:2px;margin-top:12px;overflow:hidden;}
.pf{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--blue1),var(--accent));}
.zrow{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.zn{font-size:11px;color:var(--text2);width:70px;flex-shrink:0;}
.zbw{flex:1;height:8px;background:var(--bg3);border-radius:4px;overflow:hidden;}
.zb{height:100%;border-radius:4px;transition:width .8s ease;}
.zt{font-size:11px;color:var(--text3);width:40px;text-align:right;flex-shrink:0;}
.si{border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:8px;background:var(--card2);cursor:pointer;transition:all .2s;}
.si:hover{border-color:var(--border2);transform:translateX(2px);}
.si.exp{border-color:rgba(0,212,255,.3);}
.badge{font-size:10px;font-weight:600;letter-spacing:1.5px;padding:3px 10px;border-radius:20px;text-transform:uppercase;}
.bEF{background:rgba(26,86,219,.2);color:var(--blue4);}
.bVMA{background:rgba(0,212,255,.15);color:var(--accent);}
.bSeuil{background:rgba(14,165,233,.2);color:#38bdf8;}
.bTempo{background:rgba(56,189,248,.15);color:#7dd3fc;}
.bSortie{background:rgba(245,158,11,.15);color:var(--orange);}
.btn{background:linear-gradient(135deg,var(--blue1),var(--blue3));border:none;border-radius:10px;padding:10px 18px;color:white;font-family:var(--font-b);font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
.btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(14,165,233,.3);}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.bsm{padding:6px 12px;font-size:12px;border-radius:8px;}
.chat{background:var(--bg2);border:1px solid var(--border);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;height:420px;}
.msgs{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;}
.msgs::-webkit-scrollbar{width:4px;}
.msgs::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}
.msg{max-width:80%;padding:12px 16px;border-radius:12px;font-size:13px;line-height:1.6;}
.mai{background:var(--card2);border:1px solid var(--border);align-self:flex-start;color:var(--text2);}
.mu{background:rgba(26,86,219,.3);border:1px solid rgba(26,86,219,.4);align-self:flex-end;color:var(--text);}
.cir{display:flex;gap:8px;padding:12px;border-top:1px solid var(--border);background:var(--card);}
.ci{flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:10px 14px;color:var(--text);font-family:var(--font-b);font-size:13px;outline:none;transition:border-color .2s;}
.ci:focus{border-color:var(--accent);}
.ci::placeholder{color:var(--text3);}
.typing{display:flex;gap:4px;align-items:center;padding:4px 0;}
.typing span{width:6px;height:6px;background:var(--text3);border-radius:50%;animation:bounce 1.2s infinite;}
.typing span:nth-child(2){animation-delay:.2s;}
.typing span:nth-child(3){animation-delay:.4s;}
@keyframes bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-6px);}}
.ct{background:var(--card2);border:1px solid var(--border2);border-radius:10px;padding:10px 14px;font-size:12px;color:var(--text2);}
.modal-bg{position:fixed;inset:0;background:rgba(5,13,26,.85);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
.modal{background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:28px;width:480px;max-width:90vw;}
.ta{width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:12px;color:var(--text);font-family:var(--font-b);font-size:13px;resize:vertical;outline:none;min-height:90px;margin-top:12px;transition:border-color .2s;}
.ta:focus{border-color:var(--accent);}
.ri{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);}
.ri:last-child{border-bottom:none;}
.loading{display:flex;align-items:center;justify-content:center;height:200px;color:var(--text3);font-size:13px;gap:10px;}
.spin{width:20px;height:20px;border:2px solid var(--border2);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.conn-banner{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:12px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:#fca5a5;display:flex;align-items:center;gap:10px;}
@media(max-width:900px){.g4{grid-template-columns:repeat(2,1fr);}.g3{grid-template-columns:repeat(2,1fr);}.g21{grid-template-columns:1fr;}}
@media(max-width:600px){.g4,.g3,.g2{grid-template-columns:1fr;}.pt{font-size:32px;}}
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}
`;

// ── HELPERS ────────────────────────────────────────────────────────────────────
const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ct">
      <div style={{ marginBottom: 4, color: "var(--text)", fontWeight: 500 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}</div>)}
    </div>
  );
};

const ZBar = ({ name, minutes, max, color }) => (
  <div className="zrow">
    <span className="zn">{name}</span>
    <div className="zbw"><div className="zb" style={{ width: `${max ? (minutes / max) * 100 : 0}%`, background: color }} /></div>
    <span className="zt">{minutes}min</span>
  </div>
);

const Stars = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {[1,2,3,4,5].map(n => (
      <span key={n} onClick={() => onChange?.(n)}
        style={{ fontSize: 14, cursor: onChange ? "pointer" : "default", color: n <= (value||0) ? "var(--accent)" : "var(--border2)" }}>
        {n <= (value||0) ? "★" : "☆"}
      </span>
    ))}
  </div>
);

const Loader = () => (
  <div className="loading"><div className="spin"/><span>Chargement des données Garmin...</span></div>
);

const badgeClass = (type) => {
  const m = { "EF":"bEF","VMA":"bVMA","Seuil":"bSeuil","Tempo":"bTempo","Sortie longue":"bSortie" };
  return `badge ${m[type] || "bEF"}`;
};

// ── API CALLS ──────────────────────────────────────────────────────────────────
const apiFetch = async (path) => {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
const Dashboard = ({ connected }) => {
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected) { setLoading(false); return; }
    Promise.all([apiFetch("/dashboard/summary"), apiFetch("/stats/weekly?weeks=12")])
      .then(([s, w]) => { setSummary(s); setWeekly(w); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [connected]);

  if (loading) return <Loader />;

  const cw = summary?.current_week || {};
  const cm = summary?.current_month || {};
  const pm = summary?.prev_month || {};
  const wd = summary?.wellness_today || {};
  const diff = ((cm.km || 0) - (pm.km || 0)).toFixed(1);
  const diffPct = pm.km ? (((cm.km - pm.km) / pm.km) * 100).toFixed(1) : 0;
  const lastWeek = weekly[weekly.length - 1] || {};
  const maxZ = Math.max(lastWeek.z1||0, lastWeek.z2||0, lastWeek.z3||0, lastWeek.z4||0, lastWeek.z5||0);

  return (
    <div>
      <div className="ph">
        <div><div className="pt">TABLEAU DE BORD</div><div className="ps">Données live Garmin Connect · {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}</div></div>
        <div className="dot" title="Connecté à Garmin" />
      </div>

      {!connected && (
        <div className="conn-banner">⚠️ Backend non connecté — lancez le serveur et authentifiez-vous sur <strong>localhost:8001/auth/start</strong></div>
      )}

      <div className="sec">Volume</div>
      <div className="grid g4" style={{ marginBottom: 16 }}>
        <div className="card ca">
          <div className="lbl">Cette semaine</div>
          <div className="val">{cw.km || 0}<span className="unit">km</span></div>
          <div className="pb"><div className="pf" style={{ width: `${Math.min((cw.km||0)/60*100, 100)}%` }} /></div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>{cw.sessions || 0} séances · Objectif 55km</div>
        </div>
        <div className="card">
          <div className="lbl">Ce mois</div>
          <div className="val">{cm.km || 0}<span className="unit">km</span></div>
          <div className="pb"><div className="pf" style={{ width: `${Math.min((cm.km||0)/150*100, 100)}%` }} /></div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>{cm.sessions || 0} séances</div>
        </div>
        <div className="card">
          <div className="lbl">Mois précédent</div>
          <div className="val">{pm.km || 0}<span className="unit">km</span></div>
          <div className="pb"><div className="pf" style={{ width: `${Math.min((pm.km||0)/150*100, 100)}%`, background:"linear-gradient(90deg,#1a3354,#1a56db)" }} /></div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>{pm.sessions || 0} séances</div>
        </div>
        <div className="card">
          <div className="lbl">Progression</div>
          <div className="val" style={{ color: diff >= 0 ? "var(--green)" : "var(--red)" }}>
            {diff >= 0 ? "+" : ""}{diff}<span className="unit">km</span>
          </div>
          <div style={{ fontSize: 12, color: diff >= 0 ? "var(--green)" : "var(--red)", marginTop: 6 }}>
            {diff >= 0 ? "↑" : "↓"} {Math.abs(diffPct)}% vs mois précédent
          </div>
        </div>
      </div>

      <div className="grid g21" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="sec">Volume 12 semaines</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="kg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a56db" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3354" />
              <XAxis dataKey="week_label" tick={{ fill: "#4a7499", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4a7499", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Area type="monotone" dataKey="km" stroke="#1a56db" strokeWidth={2} fill="url(#kg)" name="km" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="sec">Zones — Cette semaine</div>
          {Object.entries(PROFILE.zones).map(([k, z]) => (
            <ZBar key={k} name={z.name} minutes={lastWeek[k] || 0} max={maxZ} color={z.color} />
          ))}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 12 }}>
            <div className="sec" style={{ marginBottom: 8 }}>Intensité</div>
            {[["🟦 EF", "ef", "#1a56db"], ["🔵 Seuil", "seuil", "#0ea5e9"], ["⚡ VMA", "vma", "#00d4ff"]].map(([n, k, c]) => (
              <ZBar key={k} name={n} minutes={lastWeek[k] || 0} max={(lastWeek.ef||0)+(lastWeek.seuil||0)+(lastWeek.vma||0)} color={c} />
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="sec">Temps par zone — 12 semaines</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weekly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3354" />
            <XAxis dataKey="week_label" tick={{ fill: "#4a7499", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4a7499", fontSize: 11 }} axisLine={false} tickLine={false} unit="min" />
            <Tooltip content={<CT />} />
            <Bar dataKey="z1" stackId="a" fill="#1e3a5f" name="Z1" />
            <Bar dataKey="z2" stackId="a" fill="#1a56db" name="Z2 EF" />
            <Bar dataKey="z3" stackId="a" fill="#0ea5e9" name="Z3 Tempo" />
            <Bar dataKey="z4" stackId="a" fill="#38bdf8" name="Z4 Seuil" />
            <Bar dataKey="z5" stackId="a" fill="#7dd3fc" name="Z5 VMA" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="sec">Records personnels</div>
          {Object.entries(PROFILE.records).map(([d, t]) => (
            <div key={d} className="ri">
              <div><div style={{ fontSize: 12, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>{d}</div></div>
              <div style={{ fontFamily: "var(--font-d)", fontSize: 24, color: "var(--accent)" }}>{t}</div>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(0,212,255,.05)", borderRadius: 10, border: "1px solid rgba(0,212,255,.15)" }}>
            <div style={{ fontSize: 10, color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Objectif 2026</div>
            <div style={{ fontFamily: "var(--font-d)", fontSize: 26, color: "var(--accent)" }}>10KM SUB 40:00</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>Allure cible 4:00/km</div>
          </div>
        </div>
        <div className="card">
          <div className="sec">Bien-être aujourd'hui</div>
          {[
            ["❤ FC repos", wd.resting_hr ? `${wd.resting_hr} bpm` : "--"],
            ["😤 Stress moy.", wd.stress != null ? `${wd.stress}/100` : "--"],
            ["🔋 Body Battery", wd.body_battery != null ? `${wd.body_battery}%` : "--"],
            ["👟 Pas", wd.steps ? `${(wd.steps/1000).toFixed(1)}k` : "--"],
          ].map(([l, v]) => (
            <div key={l} className="ri">
              <span style={{ fontSize: 13, color: "var(--text2)" }}>{l}</span>
              <span style={{ fontFamily: "var(--font-d)", fontSize: 22, color: "var(--text)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── SESSIONS ──────────────────────────────────────────────────────────────────
const Sessions = () => {
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const [modal, setModal] = useState(null);
  const [tmpFeel, setTmpFeel] = useState(0);
  const [tmpNotes, setTmpNotes] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/activities?days=90"), apiFetch("/feedback")])
      .then(([a, f]) => { setActs(a); setFeedbacks(f); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveFeedback = async () => {
    await fetch(`${API}/activities/${modal.id}/feedback?feeling=${tmpFeel}&notes=${encodeURIComponent(tmpNotes)}`, { method: "POST" });
    setFeedbacks(prev => ({ ...prev, [modal.id]: { feeling: tmpFeel, notes: tmpNotes } }));
    setModal(null);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="ph">
        <div><div className="pt">SÉANCES</div><div className="ps">{acts.length} activités · 90 derniers jours</div></div>
      </div>
      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="sec">Répartition des types</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={
                Object.entries(acts.reduce((acc, a) => { acc[a.type] = (acc[a.type]||0)+1; return acc; }, {}))
                  .map(([n, v]) => ({ name: n, value: v }))
              } cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {["#1a56db","#0ea5e9","#00d4ff","#38bdf8","#f59e0b"].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border2)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="sec">Statistiques globales</div>
          {[
            ["Distance totale", `${acts.reduce((s,a)=>s+a.distance,0).toFixed(0)} km`],
            ["Séances EF", acts.filter(a=>a.type==="EF").length],
            ["Séances intensité", acts.filter(a=>["VMA","Seuil","Tempo"].includes(a.type)).length],
            ["FC moy. globale", `${Math.round(acts.filter(a=>a.avg_hr).reduce((s,a)=>s+a.avg_hr,0)/acts.filter(a=>a.avg_hr).length)} bpm`],
            ["Dénivelé total", `${acts.reduce((s,a)=>s+(a.elevation_gain||0),0).toFixed(0)} m`],
          ].map(([l,v]) => (
            <div key={l} className="ri">
              <span style={{ fontSize: 12, color: "var(--text3)" }}>{l}</span>
              <span style={{ fontFamily: "var(--font-d)", fontSize: 20, color: "var(--text)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sec">Historique</div>
      {acts.map(a => {
        const fb = feedbacks[a.id] || {};
        return (
          <div key={a.id} className={`si ${selected===a.id?"exp":""}`} onClick={() => setSelected(selected===a.id?null:a.id)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span className={badgeClass(a.type)}>{a.type}</span>
                <span style={{ fontSize:11, color:"var(--text3)" }}>{a.date}</span>
                <span style={{ fontSize:12, color:"var(--text2)", fontWeight:500 }}>{a.name}</span>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                {fb.feeling ? <Stars value={fb.feeling} /> : <span style={{ fontSize:11, color:"var(--text3)" }}>Pas de feedback</span>}
                <button className="btn bsm" onClick={e => { e.stopPropagation(); setModal(a); setTmpFeel(fb.feeling||0); setTmpNotes(fb.notes||""); }}>✏ Feedback</button>
              </div>
            </div>
            <div style={{ display:"flex", gap:16, fontSize:12, color:"var(--text2)" }}>
              <span>📍 {a.distance}km</span>
              <span>⏱ {a.duration}</span>
              <span>♥ {a.avg_hr} bpm</span>
              <span>⚡ {a.pace}</span>
              <span>↑ {a.elevation_gain?.toFixed(0)}m</span>
            </div>
            {selected===a.id && (
              <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid var(--border)" }}>
                <div style={{ display:"flex", gap:4, marginBottom:6 }}>
                  {a.zones.map((p,i) => <div key={i} style={{ flex:p, height:8, background:Object.values(PROFILE.zones)[i].color, borderRadius:4 }} title={`${Object.values(PROFILE.zones)[i].name}: ${p}%`} />)}
                </div>
                {fb.notes && <div style={{ background:"var(--bg3)", borderRadius:8, padding:"10px 12px", fontSize:13, color:"var(--text2)", lineHeight:1.6, marginTop:8 }}>💬 {fb.notes}</div>}
              </div>
            )}
          </div>
        );
      })}

      {modal && (
        <div className="modal-bg" onClick={() => setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{ fontFamily:"var(--font-d)", fontSize:28, letterSpacing:2, marginBottom:16 }}>FEEDBACK SÉANCE</div>
            <div style={{ fontSize:13, color:"var(--text3)", marginBottom:16 }}>{modal.type} · {modal.date} · {modal.distance}km · {modal.name}</div>
            <div style={{ fontSize:12, color:"var(--text3)", marginBottom:8, letterSpacing:1 }}>SENSATIONS</div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setTmpFeel(n)} style={{ width:44,height:44,borderRadius:10,border:`1px solid ${n<=tmpFeel?"var(--accent)":"var(--border2)"}`,background:n<=tmpFeel?"rgba(0,212,255,.1)":"var(--bg3)",color:n<=tmpFeel?"var(--accent)":"var(--text3)",fontSize:20,cursor:"pointer",fontFamily:"inherit" }}>★</button>
              ))}
              <span style={{ fontSize:12, color:"var(--text3)", marginLeft:8 }}>{["","Très difficile","Difficile","Correct","Bon","Excellent"][tmpFeel]}</span>
            </div>
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:12, color:"var(--text3)", letterSpacing:1 }}>NOTES</div>
              <textarea className="ta" value={tmpNotes} onChange={e=>setTmpNotes(e.target.value)} placeholder="Comment s'est passée la séance ?" />
            </div>
            <div style={{ display:"flex", gap:8, marginTop:20, justifyContent:"flex-end" }}>
              <button className="btn" style={{ background:"var(--bg3)", color:"var(--text3)" }} onClick={() => setModal(null)}>Annuler</button>
              <button className="btn" onClick={saveFeedback}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── WELLNESS ──────────────────────────────────────────────────────────────────
const Wellness = () => {
  const [wellness, setWellness] = useState([]);
  const [sleep, setSleep] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiFetch("/wellness?days=14"), apiFetch("/sleep?days=14")])
      .then(([w, s]) => { setWellness(w); setSleep(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const today = wellness[0] || {};
  const sleepToday = sleep[0] || {};
  const last7w = wellness.slice(0,7).reverse();
  const last7s = sleep.slice(0,7).reverse();

  return (
    <div>
      <div className="ph"><div><div className="pt">BIEN-ÊTRE</div><div className="ps">Sommeil · Stress · HRV · Récupération</div></div></div>
      <div className="grid g4" style={{ marginBottom:16 }}>
        {[
          ["Sommeil hier", sleepToday.total_hours ? `${sleepToday.total_hours}h` : "--", sleepToday.quality_score ? `Qualité ${sleepToday.quality_score}%` : ""],
          ["FC repos", today.resting_hr ? `${today.resting_hr}` : "--", "bpm"],
          ["Stress moy.", today.stress_avg != null ? `${today.stress_avg}` : "--", "/100"],
          ["Body Battery", today.body_battery_high != null ? `${today.body_battery_high}` : "--", "%"],
        ].map(([l,v,u],i) => (
          <div key={i} className={`card ${i===0?"ca":""}`}>
            <div className="lbl">{l}</div>
            <div className="val">{v}<span className="unit">{u}</span></div>
          </div>
        ))}
      </div>
      <div className="grid g2" style={{ marginBottom:16 }}>
        <div className="card">
          <div className="sec">Sommeil — 7 jours</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last7s} margin={{ top:5, right:10, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3354" />
              <XAxis dataKey="date" tickFormatter={d=>d.slice(5)} tick={{ fill:"#4a7499", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#4a7499", fontSize:11 }} axisLine={false} tickLine={false} unit="h" domain={[0,10]} />
              <Tooltip content={<CT />} />
              <Bar dataKey="total_hours" fill="#1a56db" radius={[4,4,0,0]} name="Sommeil (h)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="sec">Stress — 7 jours</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last7w} margin={{ top:5, right:10, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3354" />
              <XAxis dataKey="date" tickFormatter={d=>d.slice(5)} tick={{ fill:"#4a7499", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#4a7499", fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Line type="monotone" dataKey="stress_avg" stroke="#f59e0b" strokeWidth={2} dot={{ r:3, fill:"#f59e0b" }} name="Stress" />
              <Line type="monotone" dataKey="resting_hr" stroke="#00d4ff" strokeWidth={2} dot={{ r:3, fill:"#00d4ff" }} name="FC repos" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <div className="sec">Détail journalier</div>
        {last7w.reverse().map((d,i) => (
          <div key={i} className="ri">
            <span style={{ fontSize:13, color:"var(--text2)", width:80 }}>{d.date?.slice(5)}</span>
            <div style={{ display:"flex", gap:20, fontSize:12, color:"var(--text3)" }}>
              <span>🌙 {last7s.find(s=>s.date===d.date)?.total_hours || "--"}h</span>
              <span>❤ {d.resting_hr || "--"} bpm</span>
              <span>😤 Stress {d.stress_avg ?? "--"}</span>
              <span>👟 {d.steps ? `${(d.steps/1000).toFixed(1)}k` : "--"} pas</span>
              <span>🔋 {d.body_battery_high ?? "--"}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── COACH IA ──────────────────────────────────────────────────────────────────
const Coach = () => {
  const [msgs, setMsgs] = useState([{ role:"ai", text:`Bonjour Benjamin ! 👋 Je suis ton coach IA.\n\nJ'ai accès à tes vraies données Garmin — tes séances, ton sommeil, ton stress et ta FC repos.\n\nTon profil : 46 ans, VDOT ~52, objectif 10km sub 40:00. Pose-moi n'importe quelle question sur ton entraînement !` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [acts, setActs] = useState([]);
  const [wellness, setWellness] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    Promise.all([apiFetch("/activities?days=30"), apiFetch("/wellness?days=7")])
      .then(([a, w]) => { setActs(a); setWellness(w); })
      .catch(console.error);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const buildSystem = () => {
    const sessStr = acts.slice(0,8).map(a =>
      `- ${a.date}: ${a.type} ${a.distance}km @ ${a.pace}, FC ${a.avg_hr}bpm (max ${a.max_hr}), D+ ${a.elevation_gain?.toFixed(0)}m, nom: ${a.name}`
    ).join("\n");
    const w0 = wellness[0] || {};
    return `Tu es un coach running expert et data analyst spécialisé pour les coureurs de 40+. Tu analyses les données Garmin réelles de Benjamin.

PROFIL:
- Benjamin, 46 ans, 176cm, 72kg, basé à Tower Hamlets (Londres)
- FC max: 174 bpm
- Records: 10km 42:07, semi 1h34:02, marathon 3h16:11 (VDOT ~52)
- Objectif principal: 10km sub 40:00 (allure 4:00/km, VDOT ~54)
- Objectif secondaire: semi sub 1h30, marathon sub 3h10

DONNÉES RÉCENTES (vraies données Garmin):
${sessStr}

WELLNESS AUJOURD'HUI:
- FC repos: ${w0.resting_hr || "--"} bpm
- Stress moyen: ${w0.stress_avg ?? "--"}/100
- Body Battery: ${w0.body_battery_high ?? "--"}%
- Pas: ${w0.steps ? Math.round(w0.steps/1000)+"k" : "--"}

ZONES FC:
- Z1 Récup: < 122 bpm
- Z2 EF: 122-139 bpm  
- Z3 Tempo: 139-152 bpm
- Z4 Seuil: 152-162 bpm
- Z5 VMA: 162-174 bpm

ALLURES CIBLES:
- EF: 5:30-6:00/km (FC < 138)
- Tempo: 4:45-5:00/km
- Seuil: 4:20-4:30/km
- VMA (400m): 3:55-4:05/km

Réponds en français. Sois précis, personnalisé, utilise les vraies données. Donne des conseils actionnables avec allures/FC précises. Max 250 mots.`;
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMsgs(prev => [...prev, { role:"user", text:userMsg }]);
    setLoading(true);
    try {
      const history = msgs.filter((m,i) => i > 0).map(m => ({ role: m.role==="ai"?"assistant":"user", content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: buildSystem(),
          messages: [...history, { role:"user", content:userMsg }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("") || "Erreur API.";
      setMsgs(prev => [...prev, { role:"ai", text }]);
    } catch(e) {
      setMsgs(prev => [...prev, { role:"ai", text:"Erreur de connexion à l'API Claude." }]);
    }
    setLoading(false);
  };

  const suggestions = ["Analyse mes dernières séances","Que faire ce soir ?","Comment progresser vers sub 40 ?","Mon stress affecte-t-il mes perfs ?","Explique ma séance du 05/03"];

  return (
    <div>
      <div className="ph"><div><div className="pt">COACH IA</div><div className="ps">Analyse tes vraies données Garmin en temps réel</div></div></div>
      <div className="grid g3" style={{ marginBottom:20 }}>
        <div className="card ca">
          <div className="lbl">Séances ce mois</div>
          <div className="val">{acts.length}<span className="unit">séances</span></div>
        </div>
        <div className="card">
          <div className="lbl">Distance totale</div>
          <div className="val">{acts.reduce((s,a)=>s+a.distance,0).toFixed(0)}<span className="unit">km</span></div>
        </div>
        <div className="card">
          <div className="lbl">FC moy. globale</div>
          <div className="val">{acts.length ? Math.round(acts.filter(a=>a.avg_hr).reduce((s,a)=>s+a.avg_hr,0)/acts.filter(a=>a.avg_hr).length) : "--"}<span className="unit">bpm</span></div>
        </div>
      </div>
      <div style={{ marginBottom:12 }}>
        <div className="sec">Questions rapides</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => setInput(s)} className="btn bsm"
              style={{ background:"var(--bg3)", color:"var(--text2)", border:"1px solid var(--border2)" }}>{s}</button>
          ))}
        </div>
      </div>
      <div className="chat">
        <div className="msgs">
          {msgs.map((m,i) => (
            <div key={i} className={`msg ${m.role==="ai"?"mai":"mu"}`}>
              {m.role==="ai" && <div style={{ fontSize:10, color:"var(--text3)", marginBottom:6, letterSpacing:1 }}>🤖 COACH IA</div>}
              {m.text.split("\n").map((l,j) => <div key={j}>{l||<br/>}</div>)}
            </div>
          ))}
          {loading && <div className="msg mai"><div style={{ fontSize:10, color:"var(--text3)", marginBottom:6 }}>🤖 COACH IA</div><div className="typing"><span/><span/><span/></div></div>}
          <div ref={endRef} />
        </div>
        <div className="cir">
          <input className="ci" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Pose une question à ton coach..." />
          <button className="btn" onClick={send} disabled={loading||!input.trim()}>→</button>
        </div>
      </div>
    </div>
  );
};

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetch(`${API}/auth/status`)
      .then(r => r.json())
      .then(d => setConnected(d.connected))
      .catch(() => setConnected(false));
  }, []);

  const nav = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"sessions",  icon:"🏃", label:"Séances" },
    { id:"wellness",  icon:"💤", label:"Bien-être" },
    { id:"coach",     icon:"🤖", label:"Coach IA" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="sidebar">
          <div className="logo">STRIDE</div>
          {nav.map(n => (
            <button key={n.id} className={`nav ${page===n.id?"active":""}`} onClick={() => setPage(n.id)}>
              <span style={{ fontSize:20 }}>{n.icon}</span>
              <span className="tip">{n.label}</span>
            </button>
          ))}
        </nav>
        <main className="main">
          {page==="dashboard" && <Dashboard connected={connected} />}
          {page==="sessions"  && <Sessions />}
          {page==="wellness"  && <Wellness />}
          {page==="coach"     && <Coach />}
        </main>
      </div>
    </>
  );
}
