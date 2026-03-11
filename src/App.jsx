import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from "recharts";

const API = "https://stride-backend-oycv.onrender.com";
const PROFILE = {
  name: "Benjamin",
  age: 46, height: 176, weight: 72, maxHR: 174,
  records: { "10km": "42:07", "Semi": "1h34:02", "Marathon": "3h16:11" },
 zones: {
    z1: { name: "Z1 Récup",  color: "#1e3a5f" },
    z2: { name: "Z2 EF",     color: "#1a56db" },
    z3: { name: "Z3 Seuil",  color: "#0ea5e9" },
    z4: { name: "Z4 Tempo",  color: "#38bdf8" },
    z5: { name: "Z5 VMA",    color: "#7dd3fc" },
},
};

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
.filter-bar{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center;}
.fbtn{padding:7px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text3);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;}
.fbtn:hover{border-color:var(--border2);color:var(--text2);}
.fbtn.active{border-color:var(--accent);background:rgba(0,212,255,.1);color:var(--accent);}
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
.zone-legend{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;}
.zone-legend-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text3);}
.zone-legend-dot{width:10px;height:10px;border-radius:2px;flex-shrink:0;}
@media(max-width:900px){.g4{grid-template-columns:repeat(2,1fr);}.g3{grid-template-columns:repeat(2,1fr);}.g21{grid-template-columns:1fr;}}
@media(max-width:600px){.g4,.g3,.g2{grid-template-columns:1fr;}.pt{font-size:32px;}}
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}
`;

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ct">
      <div style={{ marginBottom: 4, color: "var(--text)", fontWeight: 500 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}</div>)}
    </div>
  );
};

const ZBar = ({ name, value, pct, max, color, unit = "min" }) => (
  <div className="zrow">
    <span className="zn">{name}</span>
    <div className="zbw"><div className="zb" style={{ width: `${max ? (value / max) * 100 : 0}%`, background: color }} /></div>
    <span className="zt" style={{ width: 80, textAlign: "right", fontSize: 10 }}>
      <span style={{ color: "var(--text2)" }}>{value}{unit}</span>
      {pct != null && <span style={{ color: "var(--text3)", marginLeft: 4 }}>({pct}%)</span>}
    </span>
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

const apiFetch = async (path) => {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
};

// ── ZONE LEGEND ───────────────────────────────────────────────────────────────
const ZoneLegend = () => (
  <div className="zone-legend">
    {Object.entries(PROFILE.zones).map(([k, z]) => (
      <div key={k} className="zone-legend-item">
        <div className="zone-legend-dot" style={{ background: z.color }} />
        <span>{z.name}</span>
      </div>
    ))}
  </div>
);

// ── CUSTOM BAR LABEL ──────────────────────────────────────────────────────────
const CustomBarLabel = ({ x, y, width, height, value, total }) => {
  if (!value || !total || height < 14) return null;
  const pct = Math.round((value / total) * 100);
  if (pct < 8) return null;
  return (
    <text x={x + width / 2} y={y + height / 2 + 4} fill="rgba(255,255,255,0.7)" textAnchor="middle" fontSize={9} fontWeight={600}>
      {pct}%
    </text>
  );
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
  const smp = summary?.same_month_prev_year || {};
  const smpLabel = summary?.same_month_prev_year_label || "Mars 2025";
  const diffKm = summary?.month_diff_km ?? 0;
  const diffPct = summary?.month_diff_pct ?? 0;
  const ytd = summary?.ytd || {};
  const ytdPrev = summary?.ytd_prev || {};
  const ytdLabel = summary?.ytd_label || "YTD 2026";
  const ytdPrevLabel = summary?.ytd_prev_label || "YTD 2025";
  const wd = summary?.wellness_today || {};
  const lastWeek = weekly[weekly.length - 1] || {};
  const maxZ = Math.max(lastWeek.z1||0, lastWeek.z2||0, lastWeek.z3||0, lastWeek.z4||0, lastWeek.z5||0);

  // Pour les % dans le graphe 12 semaines
  const weeklyWithPct = weekly.map(w => {
    const total = (w.z1||0)+(w.z2||0)+(w.z3||0)+(w.z4||0)+(w.z5||0);
    return { ...w, _total: total };
  });

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
          <div className="lbl">{smpLabel} (complet)</div>
          <div className="val">{smp.km || 0}<span className="unit">km</span></div>
          <div className="pb"><div className="pf" style={{ width: `${Math.min((smp.km||0)/150*100, 100)}%`, background:"linear-gradient(90deg,#1a3354,#1a56db)" }} /></div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>{smp.sessions || 0} séances · mois complet</div>
        </div>
        <div className="card">
          <div className="lbl">vs {smpLabel}</div>
          <div className="val" style={{ color: diffKm >= 0 ? "var(--green)" : "var(--red)" }}>
            {diffKm >= 0 ? "+" : ""}{diffKm}<span className="unit">km</span>
          </div>
          <div style={{ fontSize: 12, color: diffKm >= 0 ? "var(--green)" : "var(--red)", marginTop: 6 }}>
            {diffKm >= 0 ? "↑" : "↓"} {Math.abs(diffPct)}% vs mois complet N-1
          </div>
        </div>
      </div>

      <div className="sec">YTD</div>
      <div className="grid g4" style={{ marginBottom: 16 }}>
        <div className="card ca">
          <div className="lbl">{ytdLabel}</div>
          <div className="val">{ytd.km || 0}<span className="unit">km</span></div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>{ytd.sessions || 0} séances depuis le 1er jan.</div>
        </div>
        <div className="card">
          <div className="lbl">{ytdPrevLabel}</div>
          <div className="val">{ytdPrev.km || 0}<span className="unit">km</span></div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>{ytdPrev.sessions || 0} séances · même période</div>
        </div>
        <div className="card">
          <div className="lbl">Écart YTD</div>
          {(() => {
            const d = ((ytd.km||0) - (ytdPrev.km||0)).toFixed(1);
            const p = ytdPrev.km ? (((ytd.km||0) - ytdPrev.km) / ytdPrev.km * 100).toFixed(1) : 0;
            return (
              <>
                <div className="val" style={{ color: d >= 0 ? "var(--green)" : "var(--red)" }}>
                  {d >= 0 ? "+" : ""}{d}<span className="unit">km</span>
                </div>
                <div style={{ fontSize: 12, color: d >= 0 ? "var(--green)" : "var(--red)", marginTop: 6 }}>
                  {d >= 0 ? "↑" : "↓"} {Math.abs(p)}% vs N-1
                </div>
              </>
            );
          })()}
        </div>
        <div className="card">
          <div className="sec" style={{ marginBottom: 8 }}>Bien-être</div>
          {[
            ["❤ FC repos", wd.resting_hr ? `${wd.resting_hr} bpm` : "--"],
            ["🔋 Body Battery", wd.body_battery_high != null ? `${wd.body_battery_high}%` : "--"],
            ["😴 Score sommeil", wd.sleep_score != null ? `${wd.sleep_score}/100` : "--"],
            ["😤 Stress", wd.stress_avg != null ? `${wd.stress_avg}/100` : "--"],
          ].map(([l, v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0", borderBottom:"1px solid var(--border)", fontSize:12 }}>
              <span style={{ color:"var(--text3)" }}>{l}</span>
              <span style={{ color:"var(--text)", fontWeight:600 }}>{v}</span>
            </div>
          ))}
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
          {Object.entries(PROFILE.zones).map(([k, z], i) => {
            const zKeys = ["z1","z2","z3","z4","z5"];
            const totalZ = zKeys.reduce((s, zk) => s + (lastWeek[zk] || 0), 0);
            const val = lastWeek[zKeys[i]] || 0;
            const pct = totalZ ? Math.round((val / totalZ) * 100) : 0;
            return <ZBar key={k} name={z.name} value={val} pct={pct} max={maxZ} color={z.color} />;
          })}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="sec">Temps par zone — 12 semaines</div>
        <ZoneLegend />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyWithPct} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3354" />
            <XAxis dataKey="week_label" tick={{ fill: "#4a7499", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4a7499", fontSize: 11 }} axisLine={false} tickLine={false} unit="min" />
            <Tooltip content={<CT />} />
            <Bar dataKey="z1" stackId="a" fill="#1e3a5f" name="Z1 Récup">
              {weeklyWithPct.map((entry, i) => <Cell key={i} fill="#1e3a5f" />)}
            </Bar>
            <Bar dataKey="z2" stackId="a" fill="#1a56db" name="Z2 EF" />
            <Bar dataKey="z3" stackId="a" fill="#0ea5e9" name="Z3 Tempo" />
            <Bar dataKey="z4" stackId="a" fill="#38bdf8" name="Z4 Seuil" />
            <Bar dataKey="z5" stackId="a" fill="#7dd3fc" name="Z5 VMA" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

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
    </div>
  );
};
const LapsDetail = ({ activityId, type }) => {
  const [laps, setLaps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const load = async () => {
    if (laps) { setShow(!show); return; }
    setLoading(true);
    try {
      const data = await apiFetch(`/activities/${activityId}/laps`);
      setLaps(data);
      setShow(true);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const activeLaps = laps?.filter(l => l.intensity === "ACTIVE") || [];
  const warmupLaps = laps?.filter(l => l.intensity === "WARMUP") || [];
  const cooldownLaps = laps?.filter(l => l.intensity === "COOLDOWN") || [];
  const recoveryLaps = laps?.filter(l => l.intensity === "RECOVERY") || [];

  const intensityColor = {
    "ACTIVE": "var(--accent)",
    "RECOVERY": "var(--blue3)",
    "WARMUP": "var(--text3)",
    "COOLDOWN": "var(--text3)",
  };

  return (
    <div style={{ marginTop:8 }}>
      <button className="btn bsm" onClick={load} disabled={loading}
        style={{ background:"var(--bg3)", color:"var(--text2)", border:"1px solid var(--border2)", marginBottom:8 }}>
        {loading ? "⏳ Chargement..." : show ? "▲ Masquer les laps" : "▼ Voir les laps"}
      </button>
      {show && laps && (
        <div>
          {/* Résumé fractions si séance fractionnée */}
          {activeLaps.length > 0 && (
            <div style={{ background:"rgba(0,212,255,.05)", border:"1px solid rgba(0,212,255,.15)", borderRadius:10, padding:"10px 14px", marginBottom:8 }}>
              <div style={{ fontSize:10, color:"var(--accent)", letterSpacing:1, fontWeight:600, marginBottom:6 }}>
                ⚡ {activeLaps.length} FRACTIONS · {activeLaps[0]?.distance}m
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {activeLaps.map((l, i) => (
                  <div key={i} style={{ background:"var(--bg3)", border:"1px solid rgba(0,212,255,.2)", borderRadius:8, padding:"4px 10px", fontSize:11, textAlign:"center" }}>
                    <div style={{ color:"var(--accent)", fontWeight:600 }}>{l.pace}</div>
                    <div style={{ color:"var(--text3)", fontSize:10 }}>♥ {l.avg_hr}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:"var(--text3)", marginTop:6 }}>
                Allure moy. fractions : <span style={{ color:"var(--text2)" }}>
                  {(() => {
                    const totalSec = activeLaps.reduce((s,l)=>s+l.duration_sec,0);
                    const totalDist = activeLaps.reduce((s,l)=>s+l.distance,0);
                    const avgPaceSec = totalDist > 0 ? (totalSec / totalDist * 1000) : 0;
                    const m = Math.floor(avgPaceSec/60), s = Math.round(avgPaceSec%60);
                    return `${m}:${s.toString().padStart(2,"0")}/km`;
                  })()}
                </span>
                {" · "}FC moy. : <span style={{ color:"var(--text2)" }}>
                  {Math.round(activeLaps.reduce((s,l)=>s+l.avg_hr,0)/activeLaps.length)} bpm
                </span>
              </div>
            </div>
          )}

          {/* Tous les laps */}
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {laps.map((l, i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"center", padding:"5px 8px", borderRadius:6, background: l.intensity==="ACTIVE" ? "rgba(0,212,255,.05)" : "transparent", fontSize:11 }}>
                <span style={{ width:20, color:"var(--text3)", textAlign:"right" }}>{l.lap_index}</span>
                <span style={{ width:70, color: intensityColor[l.intensity] || "var(--text3)", fontWeight: l.intensity==="ACTIVE"?600:400, fontSize:10 }}>{l.intensity}</span>
                <span style={{ width:45, color:"var(--text3)" }}>{l.distance}m</span>
                <span style={{ width:60, color: l.intensity==="ACTIVE" ? "var(--accent)" : "var(--text2)", fontWeight: l.intensity==="ACTIVE"?600:400 }}>{l.pace}</span>
                <span style={{ width:55, color:"var(--text3)" }}>♥ {l.avg_hr}</span>
                <span style={{ color:"var(--text3)" }}>⟳ {l.cadence}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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
  const [filterMode, setFilterMode] = useState("ytd");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterWeek, setFilterWeek] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/activities?days=365"), apiFetch("/feedback")])
      .then(([a, f]) => { setActs(a); setFeedbacks(f); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveFeedback = async () => {
    await fetch(`${API}/activities/${modal.id}/feedback?feeling=${tmpFeel}&notes=${encodeURIComponent(tmpNotes)}`, { method: "POST" });
    setFeedbacks(prev => ({ ...prev, [modal.id]: { feeling: tmpFeel, notes: tmpNotes } }));
    setModal(null);
  };

  // Filtrage
  const today = new Date();
  const yearStart = `${today.getFullYear()}-01-01`;

  const filteredActs = acts.filter(a => {
    if (filterMode === "ytd") return a.date >= yearStart;
    if (filterMode === "month" && filterMonth) return a.date.startsWith(filterMonth);
    if (filterMode === "week" && filterWeek) {
      const d = new Date(a.date);
      const monday = new Date(filterWeek);
      const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
      return d >= monday && d <= sunday;
    }
    return true;
  });

  // Générer les mois disponibles
  const months = [...new Set(acts.map(a => a.date.slice(0,7)))].sort().reverse();

  // Générer les semaines disponibles (lundis)
  const weeks = [...new Set(acts.map(a => {
    const d = new Date(a.date);
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().slice(0,10);
  }))].sort().reverse();

  if (loading) return <Loader />;

  const totalKm = filteredActs.reduce((s,a)=>s+a.distance,0);
  const totalHrs = filteredActs.reduce((s,a)=>s+(a.duration_seconds||0),0) / 3600;

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">SÉANCES</div>
          <div className="ps">{filteredActs.length} activités · {totalKm.toFixed(0)}km · {totalHrs.toFixed(1)}h</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="filter-bar">
        <span style={{ fontSize:11, color:"var(--text3)", letterSpacing:1, textTransform:"uppercase" }}>Période :</span>
        <button className={`fbtn ${filterMode==="ytd"?"active":""}`} onClick={() => setFilterMode("ytd")}>YTD {today.getFullYear()}</button>
        <button className={`fbtn ${filterMode==="month"?"active":""}`} onClick={() => setFilterMode("month")}>Par mois</button>
        <button className={`fbtn ${filterMode==="week"?"active":""}`} onClick={() => setFilterMode("week")}>Par semaine</button>
        {filterMode === "month" && (
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
            style={{ background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:8, padding:"6px 10px", color:"var(--text)", fontSize:12, outline:"none" }}>
            <option value="">Choisir un mois</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        )}
        {filterMode === "week" && (
          <select value={filterWeek} onChange={e => setFilterWeek(e.target.value)}
            style={{ background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:8, padding:"6px 10px", color:"var(--text)", fontSize:12, outline:"none" }}>
            <option value="">Choisir une semaine</option>
            {weeks.map(w => <option key={w} value={w}>Sem. {w}</option>)}
          </select>
        )}
      </div>

      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="sec">Répartition des types</div>
          {/* Légende couleurs */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
            {[["EF","#1a56db"],["Tempo","#0ea5e9"],["Seuil","#00d4ff"],["Sortie longue","#f59e0b"],["VMA","#38bdf8"]].map(([n,c]) => (
              <div key={n} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"var(--text3)" }}>
                <div style={{ width:8, height:8, borderRadius:2, background:c }} />{n}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={
                Object.entries(filteredActs.reduce((acc, a) => { acc[a.type] = (acc[a.type]||0)+1; return acc; }, {}))
                  .map(([n, v]) => ({ name: n, value: v }))
              } cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value"
                label={({ name, percent }) => `${(percent*100).toFixed(0)}%`}
                labelLine={false}>
                {["#1a56db","#0ea5e9","#00d4ff","#38bdf8","#f59e0b"].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border2)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="sec">Statistiques période</div>
          {[
            ["Distance totale", `${totalKm.toFixed(0)} km`],
            ["Temps total", `${totalHrs.toFixed(1)} h`],
            ["Séances EF", `${filteredActs.filter(a=>a.type==="EF").length} (${filteredActs.length ? Math.round(filteredActs.filter(a=>a.type==="EF").length/filteredActs.length*100) : 0}%)`],
            ["Séances intensité", `${filteredActs.filter(a=>["VMA","Seuil","Tempo"].includes(a.type)).length} (${filteredActs.length ? Math.round(filteredActs.filter(a=>["VMA","Seuil","Tempo"].includes(a.type)).length/filteredActs.length*100) : 0}%)`],
            ["FC moy. globale", filteredActs.filter(a=>a.avg_hr).length ? `${Math.round(filteredActs.filter(a=>a.avg_hr).reduce((s,a)=>s+a.avg_hr,0)/filteredActs.filter(a=>a.avg_hr).length)} bpm` : "--"],
            ["Dénivelé total", `${filteredActs.reduce((s,a)=>s+(a.elevation_gain||0),0).toFixed(0)} m`],
          ].map(([l,v]) => (
            <div key={l} className="ri">
              <span style={{ fontSize: 12, color: "var(--text3)" }}>{l}</span>
              <span style={{ fontFamily: "var(--font-d)", fontSize: 20, color: "var(--text)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sec">Historique</div>
      {filteredActs.map(a => {
        const fb = feedbacks[a.id] || {};
        const totalZoneMin = a.zones ? a.zones.reduce((s,v)=>s+v,0) : 0;
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
                {/* Légende zones */}
                <ZoneLegend />
                {/* Barre zones avec km et % */}
                <div style={{ display:"flex", gap:2, marginBottom:8, height:16, borderRadius:4, overflow:"hidden" }}>
                  {a.zones && a.zones.map((p,i) => p > 0 ? (
                    <div key={i} style={{ flex:p, background:Object.values(PROFILE.zones)[i].color, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}
                      title={`${Object.values(PROFILE.zones)[i].name}: ${p}%`}>
                      {p >= 10 && <span style={{ fontSize:9, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>{p}%</span>}
                    </div>
                  ) : null)}
                </div>
                {/* Détail zones */}
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                  {a.zones && a.zones.map((p,i) => {
                    if (!p) return null;
                    const durationMin = Math.round((a.duration_seconds || 0) * p / 100 / 60);
                    const km = (a.distance * p / 100).toFixed(1);
                    return (
                      <div key={i} style={{ background:"var(--bg3)", border:`1px solid ${Object.values(PROFILE.zones)[i].color}44`, borderRadius:8, padding:"4px 10px", fontSize:10 }}>
                        <span style={{ color:Object.values(PROFILE.zones)[i].color, fontWeight:600 }}>{Object.values(PROFILE.zones)[i].name}</span>
                        <span style={{ color:"var(--text3)", marginLeft:6 }}>{km}km · {durationMin}min · {p}%</span>
                      </div>
                    );
                  })}
                </div>
                <LapsDetail activityId={a.id} type={a.type} />
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

  const todaySleep = sleep.find(s => s.total_hours > 0) || sleep[0] || {};
  const todayW = wellness.find(w => w.resting_hr || w.body_battery_high || w.stress_avg != null) || wellness[0] || {};
  const last7w = wellness.slice(0,7).reverse();
  const last7s = sleep.slice(0,7).reverse();

  return (
    <div>
      <div className="ph"><div><div className="pt">BIEN-ÊTRE</div><div className="ps">Sommeil · Stress · HRV · Récupération</div></div></div>

      <div className="grid g4" style={{ marginBottom:16 }}>
        {[
          ["Sommeil", todaySleep.total_hours ? `${todaySleep.total_hours}h` : "--", todaySleep.quality_score ? `Score ${todaySleep.quality_score}/100` : "", true],
          ["FC repos", todaySleep.resting_hr ? `${todaySleep.resting_hr}` : "--", "bpm", false],
          ["HRV nuit", todaySleep.hrv_overnight ? `${todaySleep.hrv_overnight.toFixed(0)}` : "--", "ms · " + (todaySleep.hrv_status || "--"), false],
          ["Body Battery", todayW.body_battery_high != null ? `${todayW.body_battery_high}` : "--", "%", false],
        ].map(([l,v,u,accent],i) => (
          <div key={i} className={`card ${accent?"ca":""}`}>
            <div className="lbl">{l}</div>
            <div className="val">{v}<span className="unit" style={{ fontSize:11 }}>{u}</span></div>
          </div>
        ))}
      </div>

      <div className="grid g4" style={{ marginBottom:16 }}>
        {[
          ["Stress moyen", todayW.stress_avg != null ? `${todayW.stress_avg}` : "--", "/100"],
          ["Respiration", todaySleep.respiration ? `${todaySleep.respiration?.toFixed(1)}` : "--", "rpm"],
          ["HRV 7j moy.", todaySleep.hrv_7d_avg ? `${todaySleep.hrv_7d_avg?.toFixed(0)}` : "--", "ms"],
          ["Body Battery Δ", todaySleep.body_battery_change ? `+${todaySleep.body_battery_change}` : "--", "%"],
        ].map(([l,v,u],i) => (
          <div key={i} className="card">
            <div className="lbl">{l}</div>
            <div className="val" style={{ fontSize:28 }}>{v}<span className="unit">{u}</span></div>
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
              <Bar dataKey="deep_hours" stackId="s" fill="#1e3a5f" name="Profond (h)" radius={[0,0,0,0]} />
              <Bar dataKey="rem_hours" stackId="s" fill="#1a56db" name="REM (h)" />
              <Bar dataKey="light_hours" stackId="s" fill="#0ea5e9" name="Léger (h)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            {[["Profond","#1e3a5f"],["REM","#1a56db"],["Léger","#0ea5e9"]].map(([n,c]) => (
              <div key={n} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"var(--text3)" }}>
                <div style={{ width:8, height:8, borderRadius:2, background:c }} />{n}
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="sec">FC repos & HRV — 7 jours</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last7s} margin={{ top:5, right:10, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3354" />
              <XAxis dataKey="date" tickFormatter={d=>d.slice(5)} tick={{ fill:"#4a7499", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#4a7499", fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Line type="monotone" dataKey="resting_hr" stroke="#00d4ff" strokeWidth={2} dot={{ r:3, fill:"#00d4ff" }} name="FC repos" />
              <Line type="monotone" dataKey="hrv_overnight" stroke="#f59e0b" strokeWidth={2} dot={{ r:3, fill:"#f59e0b" }} name="HRV nuit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="sec">Détail journalier</div>
        {last7s.slice().reverse().map((d,i) => {
          const w = last7w.find(x => x.date === d.date) || {};
          return (
            <div key={i} className="ri">
              <span style={{ fontSize:13, color:"var(--text2)", width:80 }}>{d.date?.slice(5)}</span>
              <div style={{ display:"flex", gap:16, fontSize:12, color:"var(--text3)", flexWrap:"wrap" }}>
                <span>🌙 {d.total_hours || "--"}h <span style={{ color:"var(--text2)" }}>{d.quality_score ? `(${d.quality_score})` : ""}</span></span>
                <span>❤ {d.resting_hr || "--"} bpm</span>
                <span>📊 HRV {d.hrv_overnight ? d.hrv_overnight.toFixed(0) : "--"}ms</span>
                <span>😤 Stress {w.stress_avg ?? "--"}</span>
                <span>🔋 {w.body_battery_high ?? "--"}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── PLAN SEMAINE ──────────────────────────────────────────────────────────────
const DAYS_FR = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

const callClaude = async (messages, system, maxTokens = 1500) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": window.ANTHROPIC_KEY || "",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system, messages })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.map(c => c.text || "").join("") || "";
};

const Plan = () => {
  const [acts, setActs]       = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [wellness, setWellness] = useState([]);
  const [weekly, setWeekly]   = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [step, setStep]       = useState("config");
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [targetKm, setTargetKm]   = useState(50);
  const [availDays, setAvailDays] = useState({ Lundi:true, Mardi:false, Mercredi:true, Jeudi:true, Vendredi:false, Samedi:true, Dimanche:true });
  const [extraNote, setExtraNote] = useState("");
  const [plan, setPlan]       = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch("/activities?days=28"),
      apiFetch("/feedback"),
      apiFetch("/wellness?days=7"),
      apiFetch("/stats/weekly?weeks=4"),
    ]).then(([a, f, w, wk]) => { setActs(a); setFeedbacks(f); setWellness(w); setWeekly(wk); })
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, []);

  const buildContext = () => {
    const w0 = wellness[0] || {};
    const lastWeek = weekly[weekly.length - 1] || {};
    const sessStr = acts.slice(0, 12).map(a => {
      const fb = feedbacks[a.id];
      const fbStr = fb ? ` | Ressenti: ${["","Très difficile","Difficile","Correct","Bon","Excellent"][fb.feeling] || fb.feeling}${fb.notes ? ` — "${fb.notes}"` : ""}` : "";
      return `- ${a.date}: ${a.type} ${a.distance}km @ ${a.pace}, FC moy ${a.avg_hr}bpm (max ${a.max_hr}), D+ ${a.elevation_gain?.toFixed(0)}m${fbStr}`;
    }).join("\n");
    return `PROFIL BENJAMIN:
- 46 ans, 176cm, 72kg, FCmax 174bpm, VDOT ~52
- Records: 10km 42:07 | Semi 1h34:02 | Marathon 3h16:11
- Objectif: 10km sub 40:00 (4:00/km, VDOT 54)

SÉANCES RÉCENTES + FEEDBACKS:
${sessStr}

WELLNESS ACTUEL:
- FC repos: ${w0.resting_hr || "--"} bpm
- Stress moyen: ${w0.stress_avg ?? "--"}/100
- Body Battery: ${w0.body_battery_high ?? "--"}%
- HRV nuit: ${w0.hrv_overnight ?? "--"}ms

VOLUME 4 DERNIÈRES SEMAINES: ${weekly.map(w => `${w.week_label}: ${w.km}km (${w.sessions}s)`).join(" | ")}
Volume semaine dernière: ${lastWeek.km || "--"}km, ${lastWeek.sessions || "--"} séances`;
  };

  const runAnalysis = async () => {
    setAnalysisLoading(true);
    setStep("analysis");
    try {
      const ctx = buildContext();
      const text = await callClaude(
        [{ role: "user", content: `Analyse mes séances récentes et donne-moi un bilan coach avant de créer mon plan.\n\n${ctx}` }],
        `Tu es un coach running expert pour coureurs 40+. Analyse les données Garmin ET les feedbacks subjectifs du coureur.
Donne un bilan structuré en 3 parties:
1. **Points positifs** (ce qui fonctionne bien, progrès notés)
2. **Points d'attention** (fatigue, tendances négatives, signaux d'alerte)
3. **Recommandations pour la semaine** (orientations générales sans encore générer le plan)
Sois précis, cite les vraies données. Max 300 mots. Réponds en français.`,
        1200
      );
      setAnalysis(text);
    } catch(e) {
      setAnalysis("Erreur d'analyse. Vérifie la clé API Anthropic.");
    }
    setAnalysisLoading(false);
  };

  const generatePlan = async () => {
    setPlanLoading(true);
    setStep("plan");
    try {
      const ctx = buildContext();
      const daysStr = Object.entries(availDays).filter(([,v])=>v).map(([k])=>k).join(", ");
      const prompt = `${ctx}

BILAN COACH:
${analysis}

CONTRAINTES:
- Volume cible: ${targetKm} km
- Jours disponibles: ${daysStr}
- Note: ${extraNote || "aucune"}

Réponds UNIQUEMENT en JSON valide:
{
  "summary": "Résumé focus semaine",
  "total_km": 48,
  "intensity_focus": "description",
  "coach_note": "Note personnalisée",
  "days": [
    {
      "day": "Lundi",
      "date": "YYYY-MM-DD",
      "type": "EF",
      "title": "Titre",
      "description": "Description",
      "distance_km": 10,
      "duration_min": 65,
      "pace_target": "5:45-6:00/km",
      "hr_target": "< 138 bpm",
      "details": ["point 1", "point 2"]
    }
  ]
}
Inclure 7 jours. Séances UNIQUEMENT les jours: ${daysStr}. Aujourd'hui: ${new Date().toLocaleDateString("fr-FR")}.`;

      const text = await callClaude([{ role: "user", content: prompt }], "Tu es un coach running expert. Réponds uniquement en JSON valide.", 2500);
      const clean = text.replace(/```json|```/g, "").trim();
      setPlan(JSON.parse(clean));
    } catch(e) {
      setPlan({ error: "Erreur de génération: " + e.message });
    }
    setPlanLoading(false);
  };

  const reset = () => { setStep("config"); setAnalysis(null); setPlan(null); };

  const typeColor = {
    "Repos": "var(--text3)", "EF": "var(--blue1)", "Tempo": "var(--blue3)",
    "Seuil": "var(--blue4)", "VMA": "var(--accent)", "Sortie longue": "var(--orange)",
    "Récupération": "var(--green)"
  };
  const dayBadge = (type) => ({
    background: `${typeColor[type] || "var(--border2)"}22`,
    color: typeColor[type] || "var(--text3)",
    border: `1px solid ${typeColor[type] || "var(--border2)"}55`,
  });

  if (dataLoading) return <Loader />;

  const steps = [
    { id:"config", label:"Démarrer", num:1 },
    { id:"analysis", label:"Bilan IA", num:2 },
    { id:"constraints", label:"Contraintes", num:3 },
    { id:"plan", label:"Mon plan", num:4 },
  ];

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">PLAN SEMAINE</div>
          <div className="ps">Personnalisé · Basé sur tes données, feedbacks et disponibilités</div>
        </div>
        {step !== "config" && (
          <button className="btn bsm" onClick={reset} style={{ background:"var(--bg3)", color:"var(--text3)", marginLeft:"auto" }}>↺ Recommencer</button>
        )}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:28 }}>
        {steps.map((s, i) => {
          const stepOrder = ["config","analysis","constraints","plan"];
          const current = stepOrder.indexOf(step);
          const isActive = s.id === step;
          const isDone = stepOrder.indexOf(s.id) < current;
          return (
            <div key={s.id} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? 1 : "none" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,background:isDone?"var(--green)":isActive?"var(--accent)":"var(--bg3)",color:isDone||isActive?"var(--bg)":"var(--text3)",border:`2px solid ${isDone?"var(--green)":isActive?"var(--accent)":"var(--border)"}`,transition:"all .3s" }}>{isDone?"✓":s.num}</div>
                <span style={{ fontSize:10,color:isActive?"var(--accent)":isDone?"var(--green)":"var(--text3)",letterSpacing:1,whiteSpace:"nowrap" }}>{s.label}</span>
              </div>
              {i < steps.length-1 && <div style={{ flex:1,height:2,background:isDone?"var(--green)":"var(--border)",margin:"0 8px",marginBottom:16,transition:"background .3s" }} />}
            </div>
          );
        })}
      </div>

      {step === "config" && (
        <div>
          <div className="grid g4" style={{ marginBottom:20 }}>
            {[
              ["Séances analysées", `${acts.length}`],
              ["Avec feedback", `${acts.filter(a=>feedbacks[a.id]).length} / ${acts.length}`],
              ["Volume 4 semaines", `${weekly.reduce((s,w)=>s+(w.km||0),0).toFixed(0)} km`],
              ["Stress actuel", `${wellness[0]?.stress_avg ?? "--"}/100`],
            ].map(([l,v]) => (
              <div key={l} className="card"><div className="lbl">{l}</div><div style={{ fontFamily:"var(--font-d)", fontSize:28 }}>{v}</div></div>
            ))}
          </div>
          <div className="card" style={{ marginBottom:20 }}>
            <div className="sec">Séances récentes + feedbacks</div>
            {acts.slice(0,6).map(a => {
              const fb = feedbacks[a.id];
              return (
                <div key={a.id} className="ri">
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span className={badgeClass(a.type)} style={{ fontSize:9 }}>{a.type}</span>
                    <span style={{ fontSize:12, color:"var(--text3)" }}>{a.date}</span>
                    <span style={{ fontSize:12, color:"var(--text2)" }}>{a.distance}km @ {a.pace}</span>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    {fb?.feeling ? <div style={{ display:"flex", gap:2 }}>{[1,2,3,4,5].map(n=><span key={n} style={{ fontSize:11, color:n<=fb.feeling?"var(--accent)":"var(--border2)" }}>★</span>)}</div> : <span style={{ fontSize:11, color:"var(--text3)", fontStyle:"italic" }}>Pas de feedback</span>}
                    {fb?.notes && <span style={{ fontSize:11, color:"var(--text3)" }}>"{fb.notes.slice(0,40)}{fb.notes.length>40?"…":""}"</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign:"center" }}>
            <button className="btn" onClick={runAnalysis} style={{ fontSize:15, padding:"14px 40px" }}>🔍 Analyser mes séances</button>
            <div style={{ fontSize:12, color:"var(--text3)", marginTop:8 }}>L'IA va d'abord analyser tes données avant de créer le plan</div>
          </div>
        </div>
      )}

      {step === "analysis" && (
        <div>
          <div className="card ca" style={{ marginBottom:20 }}>
            <div className="sec">Bilan coach · Analyse de tes séances</div>
            {analysisLoading ? <div className="loading"><div className="spin"/><span>Analyse en cours...</span></div> : (
              <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.8, whiteSpace:"pre-wrap" }}>
                {analysis?.split("\n").map((line, i) => {
                  const isBold = line.startsWith("**") || line.match(/^\d\./);
                  return <div key={i} style={{ color:isBold?"var(--text)":"var(--text2)", fontWeight:isBold?600:400, marginBottom:line===""?8:2 }}>{line.replace(/\*\*/g,"")}</div>;
                })}
              </div>
            )}
          </div>
          {!analysisLoading && <div style={{ textAlign:"center" }}><button className="btn" onClick={() => setStep("constraints")} style={{ fontSize:15, padding:"14px 40px" }}>Définir mes contraintes →</button></div>}
        </div>
      )}

      {step === "constraints" && (
        <div>
          <div className="card" style={{ marginBottom:20 }}>
            <div className="sec">Volume cible</div>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:8 }}>
              <input type="range" min={20} max={90} step={5} value={targetKm} onChange={e=>setTargetKm(Number(e.target.value))} style={{ flex:1, accentColor:"var(--accent)" }} />
              <div style={{ fontFamily:"var(--font-d)", fontSize:42, color:"var(--accent)", minWidth:80, textAlign:"right" }}>{targetKm}<span style={{ fontSize:16, color:"var(--text3)" }}>km</span></div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text3)" }}><span>20km (récup)</span><span>55km (normal)</span><span>90km (charge max)</span></div>
          </div>
          <div className="card" style={{ marginBottom:20 }}>
            <div className="sec">Jours disponibles</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {DAYS_FR.map(d => (
                <button key={d} onClick={()=>setAvailDays(prev=>({...prev,[d]:!prev[d]}))} style={{ padding:"10px 16px",borderRadius:10,border:`1px solid ${availDays[d]?"var(--accent)":"var(--border)"}`,background:availDays[d]?"rgba(0,212,255,.1)":"var(--bg3)",color:availDays[d]?"var(--accent)":"var(--text3)",cursor:"pointer",fontSize:13,fontWeight:availDays[d]?600:400,transition:"all .2s" }}>{d}</button>
              ))}
            </div>
            <div style={{ fontSize:11, color:"var(--text3)", marginTop:10 }}>{Object.values(availDays).filter(Boolean).length} jours sélectionnés</div>
          </div>
          <div className="card" style={{ marginBottom:20 }}>
            <div className="sec">Note pour le coach</div>
            <textarea className="ta" value={extraNote} onChange={e=>setExtraNote(e.target.value)} placeholder="Ex: compétition samedi, mollets tendus..." style={{ minHeight:80 }} />
          </div>
          <div style={{ textAlign:"center" }}><button className="btn" onClick={generatePlan} style={{ fontSize:15, padding:"14px 40px" }}>⚡ Générer mon plan personnalisé</button></div>
        </div>
      )}

      {step === "plan" && (
        <div>
          {planLoading ? (
            <div className="card" style={{ textAlign:"center", padding:60 }}>
              <div className="spin" style={{ margin:"0 auto 16px", width:32, height:32 }}/>
              <div style={{ fontFamily:"var(--font-d)", fontSize:22, letterSpacing:2, color:"var(--text3)" }}>GÉNÉRATION EN COURS...</div>
            </div>
          ) : plan?.error ? <div className="conn-banner">⚠️ {plan.error}</div> : plan && (
            <div>
              <div className="card ca" style={{ marginBottom:16 }}>
                <div className="lbl">Focus de la semaine</div>
                <div style={{ fontSize:15, color:"var(--text)", lineHeight:1.6, marginBottom:10 }}>{plan.summary}</div>
                {plan.coach_note && <div style={{ background:"rgba(0,212,255,.05)", border:"1px solid rgba(0,212,255,.15)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"var(--text2)", marginBottom:10, lineHeight:1.6 }}>💬 {plan.coach_note}</div>}
                <div style={{ display:"flex", gap:16, fontSize:12 }}>
                  <span style={{ color:"var(--accent)" }}>🎯 {plan.intensity_focus}</span>
                  <span style={{ color:"var(--text3)" }}>📍 <strong style={{ color:"var(--text)" }}>{plan.total_km} km</strong></span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(plan.days || []).map((d, i) => (
                  <div key={i} className="card" style={{ padding:"16px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:d.distance_km>0?10:0 }}>
                      <div style={{ width:64, flexShrink:0 }}>
                        <div style={{ fontFamily:"var(--font-d)", fontSize:18, letterSpacing:1 }}>{d.day}</div>
                        <div style={{ fontSize:10, color:"var(--text3)" }}>{d.date?.slice(5)}</div>
                      </div>
                      <span className="badge" style={dayBadge(d.type)}>{d.type}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{d.title}</div>
                        <div style={{ fontSize:12, color:"var(--text3)" }}>{d.description}</div>
                      </div>
                      {d.distance_km > 0 && (
                        <div style={{ display:"flex", gap:12, fontSize:12, color:"var(--text2)", flexShrink:0, flexWrap:"wrap", justifyContent:"flex-end" }}>
                          <span>📍 {d.distance_km}km</span>
                          <span>⏱ {d.duration_min}min</span>
                          {d.pace_target && d.pace_target !== "--" && <span style={{ color:"var(--accent)" }}>⚡ {d.pace_target}</span>}
                          {d.hr_target && d.hr_target !== "--" && <span>♥ {d.hr_target}</span>}
                        </div>
                      )}
                    </div>
                    {d.details?.length > 0 && (
                      <div style={{ paddingLeft:76, display:"flex", flexWrap:"wrap", gap:6 }}>
                        {d.details.map((pt, j) => <span key={j} style={{ fontSize:11, color:"var(--text3)", background:"var(--bg3)", padding:"3px 10px", borderRadius:20, border:"1px solid var(--border)" }}>{pt}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
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
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!window.ANTHROPIC_KEY) setApiKeyMissing(true);
    Promise.all([apiFetch("/activities?days=30"), apiFetch("/wellness?days=7")])
      .then(([a, w]) => { setActs(a); setWellness(w); })
      .catch(console.error);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const buildSystem = () => {
    const sessStr = acts.slice(0,8).map(a => `- ${a.date}: ${a.type} ${a.distance}km @ ${a.pace}, FC ${a.avg_hr}bpm (max ${a.max_hr}), D+ ${a.elevation_gain?.toFixed(0)}m`).join("\n");
    const w0 = wellness[0] || {};
    return `Tu es un coach running expert pour coureurs 40+. Tu analyses les données Garmin réelles de Benjamin.

PROFIL: 46 ans, 176cm, 72kg, FCmax 174, Records: 10km 42:07, semi 1h34:02, marathon 3h16:11, VDOT ~52
OBJECTIF: 10km sub 40:00 (4:00/km, VDOT ~54)

SÉANCES RÉCENTES:
${sessStr}

WELLNESS: FC repos ${w0.resting_hr||"--"}bpm · Stress ${w0.stress_avg??"--"}/100 · Body Battery ${w0.body_battery_high??"--"}% · HRV ${w0.hrv_overnight??"--"}ms

ZONES FC: Z1<122 | Z2 122-139 | Z3 139-152 | Z4 152-162 | Z5 162-174
ALLURES: EF 5:30-6:00/km | Tempo 4:45-5:00 | Seuil 4:20-4:30 | VMA 3:55-4:05

Réponds en français. Précis, personnalisé, cite les vraies données. Max 250 mots.`;
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
        headers:{ "Content-Type":"application/json", "x-api-key": window.ANTHROPIC_KEY || "", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system: buildSystem(), messages: [...history, { role:"user", content:userMsg }] })
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role:"ai", text: data.content?.map(c=>c.text||"").join("")||"Erreur API." }]);
    } catch(e) {
      setMsgs(prev => [...prev, { role:"ai", text:"Erreur de connexion à l'API Claude." }]);
    }
    setLoading(false);
  };

  const suggestions = ["Analyse mes dernières séances","Que faire ce soir ?","Comment progresser vers sub 40 ?","Mon stress affecte-t-il mes perfs ?"];

  return (
    <div>
      <div className="ph"><div><div className="pt">COACH IA</div><div className="ps">Analyse tes vraies données Garmin en temps réel</div></div></div>
      {apiKeyMissing && <div className="conn-banner" style={{ marginBottom:16 }}>⚠️ Clé API manquante</div>}
      <div className="grid g3" style={{ marginBottom:20 }}>
        <div className="card ca"><div className="lbl">Séances ce mois</div><div className="val">{acts.length}<span className="unit">séances</span></div></div>
        <div className="card"><div className="lbl">Distance totale</div><div className="val">{acts.reduce((s,a)=>s+a.distance,0).toFixed(0)}<span className="unit">km</span></div></div>
        <div className="card"><div className="lbl">FC moy. globale</div><div className="val">{acts.length?Math.round(acts.filter(a=>a.avg_hr).reduce((s,a)=>s+a.avg_hr,0)/acts.filter(a=>a.avg_hr).length):"--"}<span className="unit">bpm</span></div></div>
      </div>
      <div style={{ marginBottom:12 }}>
        <div className="sec">Questions rapides</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {suggestions.map(s => <button key={s} onClick={()=>setInput(s)} className="btn bsm" style={{ background:"var(--bg3)", color:"var(--text2)", border:"1px solid var(--border2)" }}>{s}</button>)}
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
    fetch(`${API}/auth/status`).then(r=>r.json()).then(d=>setConnected(d.connected)).catch(()=>setConnected(false));
  }, []);

  const nav = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"sessions",  icon:"🏃", label:"Séances" },
    { id:"wellness",  icon:"💤", label:"Bien-être" },
    { id:"plan",      icon:"📅", label:"Plan semaine" },
    { id:"coach",     icon:"🤖", label:"Coach IA" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="sidebar">
          <div className="logo">STRIDE</div>
          {nav.map(n => (
            <button key={n.id} className={`nav ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
              <span style={{ fontSize:20 }}>{n.icon}</span>
              <span className="tip">{n.label}</span>
            </button>
          ))}
        </nav>
        <main className="main">
          {page==="dashboard" && <Dashboard connected={connected} />}
          {page==="sessions"  && <Sessions />}
          {page==="wellness"  && <Wellness />}
          {page==="plan"      && <Plan />}
          {page==="coach"     && <Coach />}
        </main>
      </div>
    </>
  );
}
