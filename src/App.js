import { useState, useEffect, useCallback } from "react";

// ─── Données des 28 Manāzil ───────────────────────────────────────────────
const MANAZIL = [
  { num: 1,  ar: "الشَّرَطَيْن",        fr: "An-Naṭḥ",             stars: "α β Ari",          lon: 0    },
  { num: 2,  ar: "البَطَيْن",           fr: "Al-Buṭayn",            stars: "ε δ ρ Ari",         lon: 12.857 },
  { num: 3,  ar: "الثُّرَيَّا",         fr: "Ath-Thurayya",         stars: "Pléiades",           lon: 25.714 },
  { num: 4,  ar: "الدَّبَرَان",         fr: "Ad-Dabarān",           stars: "α Tau",              lon: 38.571 },
  { num: 5,  ar: "الهَقْعَة",           fr: "Al-Haq'a",             stars: "λ φ¹ Ori",           lon: 51.429 },
  { num: 6,  ar: "الهَنْعَة",           fr: "Al-Han'a",             stars: "γ ξ Gem",            lon: 64.286 },
  { num: 7,  ar: "الذِّرَاع",           fr: "Adh-Dhirā'",           stars: "α β Gem",            lon: 77.143 },
  { num: 8,  ar: "النَّثْرَة",          fr: "An-Nathra",            stars: "ε Cnc / M44",        lon: 90    },
  { num: 9,  ar: "الطَّرْف",            fr: "Aṭ-Ṭarf",             stars: "κ λ Leo",            lon: 102.857 },
  { num: 10, ar: "الجَبْهَة",           fr: "Al-Jabha",             stars: "ζ γ η α Leo",        lon: 115.714 },
  { num: 11, ar: "الزُّبْرَة",          fr: "Az-Zubra",             stars: "δ θ Leo",            lon: 128.571 },
  { num: 12, ar: "الصَّرْفَة",          fr: "Aṣ-Ṣarfa",            stars: "β Leo",              lon: 141.429 },
  { num: 13, ar: "العَوَّاء",           fr: "Al-'Awwā'",            stars: "β η γ Vir",          lon: 154.286 },
  { num: 14, ar: "السِّمَاك",           fr: "As-Simāk",             stars: "α Vir (Spica)",      lon: 167.143 },
  { num: 15, ar: "الغَفْر",             fr: "Al-Ghafr",             stars: "ι κ λ Vir",          lon: 180    },
  { num: 16, ar: "الزُّبَانَى",         fr: "Az-Zubānā",            stars: "α β Lib",            lon: 192.857 },
  { num: 17, ar: "الإِكْلِيل",          fr: "Al-Iklīl",             stars: "β δ π Sco",          lon: 205.714 },
  { num: 18, ar: "القَلْب",             fr: "Al-Qalb",              stars: "α Sco (Antarès)",    lon: 218.571 },
  { num: 19, ar: "الشَّوْلَة",          fr: "Ash-Shawla",           stars: "λ υ Sco",            lon: 231.429 },
  { num: 20, ar: "النَّعَائِم",         fr: "An-Na'ā'im",           stars: "γ δ ε η Sgr",        lon: 244.286 },
  { num: 21, ar: "البَلْدَة",           fr: "Al-Balda",             stars: "φ Sgr (espace vide)", lon: 257.143 },
  { num: 22, ar: "سَعْد الذَّابِح",     fr: "Sa'd adh-Dhābiḥ",     stars: "α β Cap",            lon: 270    },
  { num: 23, ar: "سَعْد بُلَع",         fr: "Sa'd Bula'",           stars: "ν μ Cap",            lon: 282.857 },
  { num: 24, ar: "سَعْد السُّعُود",     fr: "Sa'd as-Su'ūd",        stars: "β Aqr",              lon: 295.714 },
  { num: 25, ar: "سَعْد الأَخْبِيَة",  fr: "Sa'd al-Akhbiya",      stars: "γ π η ζ Aqr",        lon: 308.571 },
  { num: 26, ar: "الفَرْغ المُقَدَّم",  fr: "Al-Fargh al-Muqaddam", stars: "α β Peg",            lon: 321.429 },
  { num: 27, ar: "الفَرْغ المُؤَخَّر",  fr: "Al-Fargh al-Mu'akhkhar", stars: "γ Peg / α And",   lon: 334.286 },
  { num: 28, ar: "بَطْن الحُوت",        fr: "Baṭn al-Ḥūt",         stars: "β And",              lon: 347.143 },
];

const MANZIL_SIZE = 360 / 28;

function toRad(d) { return d * Math.PI / 180; }
function mod360(x) { return ((x % 360) + 360) % 360; }

function julianDay(date) {
  const Y = date.getUTCFullYear(), M = date.getUTCMonth() + 1;
  const D = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;
  let y = Y, m = M;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + D + B - 1524.5;
}

function moonLongitudeTropical(jd) {
  const T = (jd - 2451545.0) / 36525;
  let Lp = mod360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  let M  = mod360(357.5291092 + 35999.0502909  * T - 0.0001536 * T * T);
  let Mp = mod360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
  let F  = mod360(93.2720950  + 483202.0175233 * T - 0.0036539 * T * T);
  let D  = mod360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
  M = toRad(M); Mp = toRad(Mp); F = toRad(F); D = toRad(D);
  let lon = Lp
    + 6.288774 * Math.sin(Mp)
    + 1.274027 * Math.sin(2*D - Mp)
    + 0.658314 * Math.sin(2*D)
    + 0.213618 * Math.sin(2*Mp)
    - 0.185116 * Math.sin(M)
    - 0.114332 * Math.sin(2*F)
    + 0.058793 * Math.sin(2*D - 2*Mp)
    + 0.057066 * Math.sin(2*D - M - Mp)
    + 0.053322 * Math.sin(2*D + Mp)
    + 0.045758 * Math.sin(2*D - M)
    - 0.040923 * Math.sin(M - Mp)
    - 0.034720 * Math.sin(D)
    - 0.030383 * Math.sin(M + Mp)
    + 0.015327 * Math.sin(2*D - 2*F)
    - 0.012528 * Math.sin(Mp + 2*F)
    + 0.010980 * Math.sin(Mp - 2*F);
  return mod360(lon);
}

function lahiriAyanamsa(jd) {
  const T = (jd - 2451545.0) / 36525;
  return 23.85 + 50.3 * T / 3600;
}

function moonLongitudeSidereal(jd) {
  return mod360(moonLongitudeTropical(jd) - lahiriAyanamsa(jd));
}

function getManzilIndex(lon) {
  return Math.floor(lon / MANZIL_SIZE) % 28;
}

function findTransitTime(date, targetIdx, direction, getLon) {
  const step = direction * 15 * 60 * 1000;
  let current = new Date(date);
  for (let i = 0; i < 200; i++) {
    current = new Date(current.getTime() + step);
    const idx = getManzilIndex(getLon(julianDay(current)));
    if (idx !== targetIdx) {
      let a = new Date(current.getTime() - step), b = current;
      for (let j = 0; j < 10; j++) {
        const mid = new Date((a.getTime() + b.getTime()) / 2);
        getManzilIndex(getLon(julianDay(mid))) === targetIdx ? (a = mid) : (b = mid);
      }
      return direction === 1 ? b : a;
    }
  }
  return null;
}

function computeMoonData(date, system) {
  const getLon = system === "sidereal" ? moonLongitudeSidereal : moonLongitudeTropical;
  const jd = julianDay(date);
  const lon = getLon(jd);
  const lonTrop = moonLongitudeTropical(jd);
  const lonSid  = moonLongitudeSidereal(jd);
  const aya     = lahiriAyanamsa(jd);
  const manzilIdx = getManzilIndex(lon);
  const manzil = MANAZIL[manzilIdx];
  const posInManzil = mod360(lon - manzil.lon);
  const progress = Math.min(99.9, (posInManzil / MANZIL_SIZE) * 100);
  const entryTime = findTransitTime(date, manzilIdx, -1, getLon);
  const exitTime  = findTransitTime(date, manzilIdx,  1, getLon);
  return { lon: lon.toFixed(2), lonTrop: lonTrop.toFixed(2), lonSid: lonSid.toFixed(2), aya: aya.toFixed(2), manzilIdx, manzil, progress: progress.toFixed(1), entryTime, exitTime };
}

function moonPhase(date) {
  const synodicMonth = 29.53058867;
  const knownNew = new Date("2000-01-06T18:14:00Z");
  const phase = (((date - knownNew) / (1000*60*60*24)) % synodicMonth + synodicMonth) % synodicMonth;
  if (phase < 1.85)  return { name: "Nouvelle Lune",         emoji: "🌑" };
  if (phase < 7.38)  return { name: "Premier Croissant",     emoji: "🌒" };
  if (phase < 9.22)  return { name: "Premier Quartier",      emoji: "🌓" };
  if (phase < 14.76) return { name: "Gibbeuse Croissante",   emoji: "🌔" };
  if (phase < 16.61) return { name: "Pleine Lune",           emoji: "🌕" };
  if (phase < 22.15) return { name: "Gibbeuse Décroissante", emoji: "🌖" };
  if (phase < 23.99) return { name: "Dernier Quartier",      emoji: "🌗" };
  return               { name: "Dernier Croissant",          emoji: "🌘" };
}

function formatTime(d) { if (!d) return "—"; return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
function formatDate(d) { if (!d) return "—"; return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }); }

// ─── App ──────────────────────────────────────────────────────────────────
export default function ManazilApp() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [system, setSystem] = useState("sidereal");
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("today");

  const compute = useCallback((d, sys) => {
    setLoading(true);
    setTimeout(() => { setMoonData(computeMoonData(d, sys)); setLoading(false); }, 250);
  }, []);
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { compute(selectedDate, system); }, [selectedDate, system]);

  const dateStr = selectedDate.toISOString().split("T")[0];
  const timeStr = `${String(selectedDate.getHours()).padStart(2,"0")}:${String(selectedDate.getMinutes()).padStart(2,"0")}`;
  const phase = moonPhase(selectedDate);

  return (
    <div style={s.root}>
      <div style={s.starsBg} />

      <header style={s.header}>
        <div style={s.headerGlow} />
        <div style={s.brand}><span style={s.brandSen}>SEN</span><span style={s.brandDot}>✦</span><span style={s.brandAstro}>ASTRO</span></div>
        <h1 style={s.title}>مَنَازِل القَمَر</h1>
        <p style={s.subtitle}>Stations Lunaires</p>
      </header>

      {/* ── Sélecteur de système ── */}
      <div style={s.systemRow}>
        <button style={{...s.sysBtn,...(system==="sidereal"?s.sysBtnActive:{})}} onClick={()=>setSystem("sidereal")}>
          <span style={s.sysBtnIcon}>☽</span>
          <div>
            <div style={s.sysBtnTitle}>Sidéral</div>
            <div style={s.sysBtnSub}>Tradition arabo-islamique</div>
          </div>
        </button>
        <button style={{...s.sysBtn,...(system==="tropical"?s.sysBtnActive:{})}} onClick={()=>setSystem("tropical")}>
          <span style={s.sysBtnIcon}>☀</span>
          <div>
            <div style={s.sysBtnTitle}>Tropical</div>
            <div style={s.sysBtnSub}>Zodiaque occidental</div>
          </div>
        </button>
      </div>

      {/* ── Info ayanamsa ── */}
      {moonData && (
        <div style={s.ayaBanner}>
          {system === "sidereal" ? (
            <><span style={s.ayaIcon}>⟳</span><span>Ayanamsa Lahiri : <strong style={{color:gold}}>{moonData.aya}°</strong> — Tropical {moonData.lonTrop}° → Sidéral {moonData.lonSid}°</span></>
          ) : (
            <><span style={s.ayaIcon}>☀</span><span>Zodiaque tropical · longitude {moonData.lonTrop}° · ayanamsa non appliqué</span></>
          )}
        </div>
      )}

      <div style={s.tabs}>
        {[["today","Aujourd'hui"],["calendar","7 jours"],["list","Les 28"]].map(([k,l])=>(
          <button key={k} style={{...s.tab,...(tab===k?s.tabActive:{})}} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      <div style={s.content}>
        {tab==="today" && (
          <TodayView
            moonData={moonData} loading={loading} phase={phase} system={system}
            selectedDate={selectedDate} dateStr={dateStr} timeStr={timeStr}
            onDateChange={e=>{ const d=new Date(e.target.value); d.setHours(selectedDate.getHours(),selectedDate.getMinutes()); setSelectedDate(d); }}
            onTimeChange={e=>{ const [h,m]=e.target.value.split(":").map(Number); const d=new Date(selectedDate); d.setHours(h,m,0); setSelectedDate(d); }}
          />
        )}
        {tab==="calendar" && <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate} system={system} />}
        {tab==="list" && <ListView currentIdx={moonData?.manzilIdx} />}
      </div>

      <div style={s.footer}><span style={s.footerText}>© Sen-Astro · Habib Ndiaye</span></div>
    </div>
  );
}

function TodayView({ moonData, loading, phase, system, selectedDate, dateStr, timeStr, onDateChange, onTimeChange }) {
  return (
    <div>
      <div style={s.pickerRow}>
        <div style={s.pickerBox}>
          <label style={s.pickerLabel}>📅 Date</label>
          <input type="date" value={dateStr} onChange={onDateChange} style={s.pickerInput} />
        </div>
        <div style={s.pickerBox}>
          <label style={s.pickerLabel}>⏰ Heure</label>
          <input type="time" value={timeStr} onChange={onTimeChange} style={s.pickerInput} />
        </div>
      </div>

      {loading ? (
        <div style={s.loader}><div style={s.loaderMoon}>☽</div><p style={s.loaderText}>Calcul en cours…</p></div>
      ) : moonData ? (
        <>
          <div style={s.phaseCard}>
            <span style={s.phaseEmoji}>{phase.emoji}</span>
            <div>
              <div style={s.phaseName}>{phase.name}</div>
              <div style={s.phaseDate}>{selectedDate.toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</div>
            </div>
            <div style={s.systemTag}>{system==="sidereal"?"Sidéral":"Tropical"}</div>
          </div>

          <div style={s.manzilCard}>
            <div style={s.manzilBadge}>المنزل الـ {moonData.manzilIdx+1}</div>
            <div style={s.manzilAr}>{moonData.manzil.ar}</div>
            <div style={s.manzilFr}>{moonData.manzil.fr}</div>
            <div style={s.manzilStars}>✦ {moonData.manzil.stars}</div>

            <div style={s.progressWrap}>
              <div style={s.progressLabels}>
                <span>↗ Entrée</span>
                <span style={{color:gold}}>{moonData.progress}% parcouru</span>
                <span>Sortie ↘</span>
              </div>
              <div style={s.progressTrack}>
                <div style={{...s.progressFill, width:`${moonData.progress}%`}} />
                <div style={{...s.progressThumb, left:`calc(${moonData.progress}% - 10px)`}}>☽</div>
              </div>
            </div>

            <div style={s.lonRow}>
              <span style={s.lonLabel}>λ écliptique ({system==="sidereal"?"sidéral":"tropical"})</span>
              <span style={s.lonVal}>{moonData.lon}°</span>
            </div>
          </div>

          <div style={s.transitRow}>
            <div style={s.transitCard}>
              <div style={s.transitArrow}>↗</div>
              <div style={s.transitLabel}>Entrée dans ce manzil</div>
              <div style={s.transitTime}>{formatTime(moonData.entryTime)}</div>
              <div style={s.transitDate}>{formatDate(moonData.entryTime)}</div>
            </div>
            <div style={s.transitSep}>
              <div style={s.transitLine}/><span style={s.transitMoon}>☽</span><div style={s.transitLine}/>
            </div>
            <div style={s.transitCard}>
              <div style={s.transitArrow}>↘</div>
              <div style={s.transitLabel}>Sortie vers le suivant</div>
              <div style={s.transitTime}>{formatTime(moonData.exitTime)}</div>
              <div style={s.transitDate}>{formatDate(moonData.exitTime)}</div>
            </div>
          </div>

          <div style={s.navRow}>
            <div style={s.navCard}>
              <div style={s.navDir}>◀ Précédent</div>
              <div style={s.navAr}>{MANAZIL[(moonData.manzilIdx+27)%28].ar}</div>
              <div style={s.navFr}>{MANAZIL[(moonData.manzilIdx+27)%28].fr}</div>
            </div>
            <div style={s.navCard}>
              <div style={s.navDir}>Suivant ▶</div>
              <div style={s.navAr}>{MANAZIL[(moonData.manzilIdx+1)%28].ar}</div>
              <div style={s.navFr}>{MANAZIL[(moonData.manzilIdx+1)%28].fr}</div>
            </div>
          </div>

          <CompareCard md={moonData} />
        </>
      ) : null}
    </div>
  );
}

function CompareCard({ md }) {
  const tropIdx = getManzilIndex(parseFloat(md.lonTrop));
  const sidIdx  = getManzilIndex(parseFloat(md.lonSid));
  const same = tropIdx === sidIdx;
  return (
    <div style={s.compareCard}>
      <div style={s.compareTitle}>⚖ Comparaison des deux systèmes</div>
      <div style={s.compareRow}>
        <div style={s.compareCol}>
          <div style={s.compareSystem}>☀ Tropical</div>
          <div style={s.compareLon}>{md.lonTrop}°</div>
          <div style={s.compareAr}>{MANAZIL[tropIdx].ar}</div>
          <div style={s.compareFr}>{MANAZIL[tropIdx].fr}</div>
          <div style={s.compareNum}>#{tropIdx+1}</div>
        </div>
        <div style={s.compareDivider}>
          {same ? <div style={s.compareSame}>✓ Identiques</div> : <div style={s.compareDiff}>≠ Différents</div>}
          <div style={s.compareAya}>Δ {md.aya}°</div>
        </div>
        <div style={s.compareCol}>
          <div style={s.compareSystem}>☽ Sidéral</div>
          <div style={s.compareLon}>{md.lonSid}°</div>
          <div style={s.compareAr}>{MANAZIL[sidIdx].ar}</div>
          <div style={s.compareFr}>{MANAZIL[sidIdx].fr}</div>
          <div style={s.compareNum}>#{sidIdx+1}</div>
        </div>
      </div>
    </div>
  );
}

function CalendarView({ selectedDate, setSelectedDate, system }) {
  const getLon = system === "sidereal" ? moonLongitudeSidereal : moonLongitudeTropical;
  const days = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()+i); d.setHours(12,0,0); return d;
  });
  return (
    <div>
      <h3 style={s.sectionTitle}>7 prochains jours · {system==="sidereal"?"Sidéral":"Tropical"}</h3>
      {days.map((d,i)=>{
        const lon = getLon(julianDay(d));
        const idx = getManzilIndex(lon);
        const m = MANAZIL[idx];
        const ph = moonPhase(d);
        return (
          <div key={i} style={{...s.calRow,...(i===0?s.calRowToday:{})}} onClick={()=>setSelectedDate(d)}>
            <div style={s.calDay}>
              <div style={s.calDayName}>{d.toLocaleDateString("fr-FR",{weekday:"short"})}</div>
              <div style={s.calDayNum}>{d.getDate()}</div>
              <div>{ph.emoji}</div>
            </div>
            <div style={s.calManzil}>
              <div style={s.calAr}>{m.ar}</div>
              <div style={s.calFr}>{m.fr}</div>
              <div style={s.calStars}>{m.stars}</div>
            </div>
            <div style={s.calBadge}>#{idx+1}</div>
          </div>
        );
      })}
    </div>
  );
}

function ListView({ currentIdx }) {
  return (
    <div>
      <h3 style={s.sectionTitle}>Les 28 Manāzil al-Qamar</h3>
      {MANAZIL.map((m,i)=>(
        <div key={i} style={{...s.listItem,...(i===currentIdx?s.listItemActive:{})}}>
          <div style={s.listNum}>{i+1}</div>
          <div style={s.listAr}>{m.ar}</div>
          <div style={{flex:1}}>
            <div style={s.listFr}>{m.fr}</div>
            <div style={s.listStars}>{m.stars}</div>
          </div>
          {i===currentIdx && <div style={s.listBadge}>☽ Ici</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────
const gold = "#C9A84C";
const softGold = "#e8c97a";
const indigo = "#1B1464";
const deepBlue = "#07061a";
const midBlue = "#10102e";
const textLight = "#e8dfc8";
const textMuted = "#7a7090";

const s = {
  root: { minHeight:"100vh", maxWidth:430, margin:"0 auto", background:`radial-gradient(ellipse at 50% 0%, #1c1860 0%, ${deepBlue} 55%)`, fontFamily:"'Georgia','Times New Roman',serif", color:textLight, position:"relative", overflow:"hidden" },
  starsBg: { position:"fixed", inset:0, pointerEvents:"none", backgroundImage:`radial-gradient(1px 1px at 20% 30%, #ffffff33, transparent), radial-gradient(1px 1px at 80% 10%, #ffffff22, transparent), radial-gradient(1px 1px at 50% 70%, #ffffff22, transparent), radial-gradient(1px 1px at 10% 80%, #ffffff22, transparent)` },
  header: { textAlign:"center", padding:"28px 20px 16px", background:`linear-gradient(180deg,${indigo}dd 0%,transparent 100%)`, borderBottom:`1px solid ${gold}33`, position:"relative" },
  headerGlow: { position:"absolute", top:-80, left:"50%", transform:"translateX(-50%)", width:240, height:240, background:`radial-gradient(circle, ${gold}18 0%, transparent 70%)`, pointerEvents:"none" },
  brand: { letterSpacing:6, fontSize:10, marginBottom:8, textTransform:"uppercase" },
  brandSen: { color:gold, fontWeight:"bold" },
  brandDot: { color:`${gold}88`, margin:"0 4px", fontSize:8 },
  brandAstro: { color:textMuted },
  title: { margin:"0 0 4px", fontSize:26, fontWeight:"normal", color:softGold, textShadow:`0 0 40px ${gold}66`, letterSpacing:2 },
  subtitle: { margin:0, fontSize:11, color:textMuted, letterSpacing:5, textTransform:"uppercase" },
  systemRow: { display:"flex", gap:8, padding:"12px 14px", background:`${midBlue}99`, borderBottom:`1px solid ${gold}22` },
  sysBtn: { flex:1, display:"flex", alignItems:"center", gap:10, background:"none", border:`1px solid ${gold}22`, borderRadius:10, padding:"10px 12px", cursor:"pointer", color:textMuted, fontFamily:"inherit", transition:"all 0.25s" },
  sysBtnActive: { border:`1px solid ${gold}99`, background:`${gold}18`, color:textLight, boxShadow:`0 0 16px ${gold}22` },
  sysBtnIcon: { fontSize:22, lineHeight:1 },
  sysBtnTitle: { fontSize:13, color:"inherit", marginBottom:1 },
  sysBtnSub: { fontSize:9, color:textMuted, letterSpacing:0.5 },
  ayaBanner: { display:"flex", alignItems:"center", gap:8, background:"#0a0825", borderBottom:`1px solid ${gold}22`, padding:"8px 14px", fontSize:10, color:textMuted, lineHeight:1.5 },
  ayaIcon: { fontSize:14, color:gold, flexShrink:0 },
  tabs: { display:"flex", background:midBlue, borderBottom:`1px solid ${gold}22` },
  tab: { flex:1, padding:"11px 4px", background:"none", border:"none", color:textMuted, cursor:"pointer", fontSize:11, letterSpacing:1, fontFamily:"inherit", transition:"all 0.2s" },
  tabActive: { color:softGold, borderBottom:`2px solid ${gold}`, background:`${gold}11` },
  content: { padding:"14px 14px 90px" },
  pickerRow: { display:"flex", gap:8, marginBottom:14 },
  pickerBox: { flex:1, background:`${midBlue}cc`, border:`1px solid ${gold}33`, borderRadius:10, padding:"9px 12px" },
  pickerLabel: { display:"block", fontSize:9, color:textMuted, marginBottom:4, letterSpacing:1 },
  pickerInput: { background:"none", border:"none", color:textLight, fontSize:12, fontFamily:"inherit", width:"100%", outline:"none", colorScheme:"dark" },
  loader: { textAlign:"center", padding:"60px 0" },
  loaderMoon: { fontSize:44, display:"inline-block" },
  loaderText: { color:textMuted, marginTop:10, fontSize:12 },
  phaseCard: { display:"flex", alignItems:"center", gap:12, background:`linear-gradient(135deg,${midBlue} 0%,${indigo}88 100%)`, border:`1px solid ${gold}33`, borderRadius:12, padding:"12px 14px", marginBottom:12 },
  phaseEmoji: { fontSize:32 },
  phaseName: { fontSize:13, color:softGold, marginBottom:2 },
  phaseDate: { fontSize:10, color:textMuted },
  systemTag: { marginLeft:"auto", fontSize:9, letterSpacing:1, color:deepBlue, background:gold, borderRadius:20, padding:"3px 8px", whiteSpace:"nowrap" },
  manzilCard: { background:`linear-gradient(160deg,${indigo}bb 0%,#0c0b25 100%)`, border:`1px solid ${gold}55`, borderRadius:16, padding:"20px 18px", marginBottom:12, boxShadow:`0 0 50px ${gold}0d`, textAlign:"center" },
  manzilBadge: { fontSize:10, color:textMuted, letterSpacing:3, marginBottom:8 },
  manzilAr: { fontSize:30, color:softGold, marginBottom:5, lineHeight:1.4, direction:"rtl" },
  manzilFr: { fontSize:17, color:textLight, marginBottom:4, letterSpacing:1 },
  manzilStars: { fontSize:10, color:textMuted, marginBottom:18 },
  progressWrap: { marginBottom:14 },
  progressLabels: { display:"flex", justifyContent:"space-between", fontSize:9, color:textMuted, marginBottom:6 },
  progressTrack: { height:5, background:`${gold}22`, borderRadius:3, position:"relative", overflow:"visible" },
  progressFill: { height:"100%", background:`linear-gradient(90deg,${gold}66,${gold})`, borderRadius:3, transition:"width 0.7s ease" },
  progressThumb: { position:"absolute", top:-9, fontSize:18, color:softGold, filter:`drop-shadow(0 0 6px ${gold})`, lineHeight:1 },
  lonRow: { display:"flex", justifyContent:"space-between", paddingTop:10, borderTop:`1px solid ${gold}22` },
  lonLabel: { fontSize:10, color:textMuted },
  lonVal: { fontSize:13, color:softGold },
  transitRow: { display:"flex", alignItems:"center", gap:8, marginBottom:12 },
  transitCard: { flex:1, background:`${midBlue}aa`, border:`1px solid ${gold}33`, borderRadius:12, padding:"12px 8px", textAlign:"center" },
  transitArrow: { fontSize:16, color:gold, marginBottom:4 },
  transitLabel: { fontSize:9, color:textMuted, letterSpacing:0.5, marginBottom:6 },
  transitTime: { fontSize:22, color:softGold, fontVariantNumeric:"tabular-nums", marginBottom:2 },
  transitDate: { fontSize:10, color:textMuted },
  transitSep: { display:"flex", flexDirection:"column", alignItems:"center", gap:4 },
  transitLine: { width:1, height:18, background:`${gold}33` },
  transitMoon: { fontSize:18, color:gold },
  navRow: { display:"flex", gap:8, marginBottom:12 },
  navCard: { flex:1, background:`${midBlue}66`, border:`1px solid ${gold}22`, borderRadius:10, padding:"10px", textAlign:"center" },
  navDir: { fontSize:9, color:textMuted, marginBottom:4 },
  navAr: { fontSize:13, color:softGold, direction:"rtl", marginBottom:2 },
  navFr: { fontSize:10, color:textMuted },
  compareCard: { background:`${midBlue}88`, border:`1px solid ${gold}33`, borderRadius:12, padding:"14px", marginBottom:12 },
  compareTitle: { fontSize:11, color:gold, letterSpacing:1, marginBottom:12, textAlign:"center" },
  compareRow: { display:"flex", alignItems:"center", gap:8 },
  compareCol: { flex:1, textAlign:"center" },
  compareSystem: { fontSize:11, color:textMuted, marginBottom:4 },
  compareLon: { fontSize:14, color:softGold, marginBottom:4 },
  compareAr: { fontSize:13, color:textLight, direction:"rtl", marginBottom:2 },
  compareFr: { fontSize:10, color:textMuted, marginBottom:4 },
  compareNum: { fontSize:10, color:gold },
  compareDivider: { textAlign:"center", minWidth:52 },
  compareSame: { fontSize:10, color:"#4ecf8a", marginBottom:4 },
  compareDiff: { fontSize:10, color:"#e07a5f", marginBottom:4 },
  compareAya: { fontSize:9, color:textMuted },
  sectionTitle: { color:gold, fontSize:13, letterSpacing:2, marginBottom:12, fontWeight:"normal" },
  calRow: { display:"flex", alignItems:"center", gap:10, background:`${midBlue}88`, border:`1px solid ${gold}22`, borderRadius:10, padding:"10px 12px", marginBottom:8, cursor:"pointer" },
  calRowToday: { border:`1px solid ${gold}77`, background:`${indigo}aa` },
  calDay: { textAlign:"center", minWidth:34 },
  calDayName: { fontSize:9, color:textMuted, textTransform:"uppercase" },
  calDayNum: { fontSize:18, color:softGold },
  calManzil: { flex:1 },
  calAr: { fontSize:14, color:softGold, direction:"rtl", marginBottom:2 },
  calFr: { fontSize:11, color:textLight, marginBottom:1 },
  calStars: { fontSize:9, color:textMuted },
  calBadge: { fontSize:18, color:`${gold}55`, fontWeight:"bold" },
  listItem: { background:`${midBlue}88`, border:`1px solid ${gold}22`, borderRadius:10, padding:"9px 12px", marginBottom:7, display:"flex", alignItems:"center", gap:10 },
  listItemActive: { border:`1px solid ${gold}99`, background:`${indigo}cc`, boxShadow:`0 0 20px ${gold}22` },
  listNum: { fontSize:10, color:textMuted, minWidth:20, textAlign:"center" },
  listAr: { fontSize:14, color:softGold, direction:"rtl", minWidth:88 },
  listFr: { fontSize:11, color:textLight, marginBottom:2 },
  listStars: { fontSize:9, color:textMuted },
  listBadge: { fontSize:9, color:deepBlue, background:gold, borderRadius:20, padding:"2px 7px", whiteSpace:"nowrap" },
  footer: { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:`${deepBlue}f0`, borderTop:`1px solid ${gold}22`, textAlign:"center", padding:"9px 0", backdropFilter:"blur(10px)" },
  footerText: { fontSize:9, color:textMuted, letterSpacing:2 },
};
