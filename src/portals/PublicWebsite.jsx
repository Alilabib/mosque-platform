import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════
   DESIGN TOKENS
   ══════════════════════════════════ */
const T = {
  bg: "#faf9f5",
  cream: "#f5f3ed",
  card: "#ffffff",
  emerald: "#0c6b4e",
  emeraldDark: "#084a36",
  emeraldLight: "#e4f3ec",
  gold: "#b8942a",
  goldLight: "#fdf8eb",
  goldSoft: "#e8d48a",
  text: "#1c1c1c",
  text2: "#5e6b70",
  text3: "#9aa5ab",
  border: "#e6e3db",
  danger: "#be3a2a",
  dangerLight: "#fce8e5",
  white: "#ffffff",
  shadow: "0 2px 16px rgba(0,0,0,.06)",
  shadowLg: "0 8px 40px rgba(0,0,0,.08)",
};

/* ══════════════════════════════════
   MOCK DATA
   ══════════════════════════════════ */
const MOSQUES = [
  { id: 1, name: "جامع الراجحي", city: "الرياض", district: "حي النسيم", type: "جامع", capacity: 3500, services: ["الجمعة","الجنائز","العيد","التحفيظ"], rating: 4.8, reviews: 234, imam: "الشيخ عبدالله المحمد" },
  { id: 2, name: "مسجد الفرقان", city: "الرياض", district: "حي الملز", type: "مسجد", capacity: 800, services: ["الجمعة","التحفيظ"], rating: 4.5, reviews: 89, imam: "الشيخ خالد العتيبي" },
  { id: 3, name: "جامع الملك فهد", city: "جدة", district: "حي الحمراء", type: "جامع", capacity: 5000, services: ["الجمعة","الجنائز","العيد","التحفيظ","المحاضرات"], rating: 4.9, reviews: 512, imam: "الشيخ سعد الغامدي" },
  { id: 4, name: "مسجد الإيمان", city: "مكة المكرمة", district: "حي العزيزية", type: "مسجد", capacity: 1200, services: ["الجمعة","التحفيظ","المحاضرات"], rating: 4.6, reviews: 178, imam: "الشيخ أحمد الشهري" },
  { id: 5, name: "جامع البواردي", city: "الرياض", district: "حي العليا", type: "جامع", capacity: 2800, services: ["الجمعة","الجنائز","العيد"], rating: 4.7, reviews: 301, imam: "الشيخ فهد القحطاني" },
  { id: 6, name: "مسجد النور", city: "المدينة المنورة", district: "حي قباء", type: "مسجد", capacity: 950, services: ["الجمعة","التحفيظ"], rating: 4.8, reviews: 145, imam: "الشيخ ياسر الحربي" },
  { id: 7, name: "مسجد التقوى", city: "الدمام", district: "حي الفيصلية", type: "مسجد", capacity: 700, services: ["الجمعة","الدروس"], rating: 4.4, reviews: 67, imam: "الشيخ محمد الدوسري" },
  { id: 8, name: "جامع الأمير سلطان", city: "جدة", district: "حي الروضة", type: "جامع", capacity: 4200, services: ["الجمعة","الجنائز","العيد","التحفيظ","المحاضرات"], rating: 4.9, reviews: 478, imam: "الشيخ ماجد الزهراني" },
];

const PRAYER_DATA = {
  "الرياض": { fajr: "٣:٣٢", sunrise: "٥:٠٣", dhuhr: "١١:٥٢", asr: "٣:١٣", maghrib: "٦:٤١", isha: "٨:١١" },
  "جدة": { fajr: "٤:١٢", sunrise: "٥:٤٠", dhuhr: "١٢:٢٢", asr: "٣:٤٠", maghrib: "٧:٠٤", isha: "٨:٣٤" },
  "مكة المكرمة": { fajr: "٤:١١", sunrise: "٥:٣٨", dhuhr: "١٢:٢٠", asr: "٣:٣٨", maghrib: "٧:٠٢", isha: "٨:٣٢" },
  "المدينة المنورة": { fajr: "٤:٠٢", sunrise: "٥:٣٠", dhuhr: "١٢:٢٠", asr: "٣:٤٢", maghrib: "٧:٠٨", isha: "٨:٣٨" },
  "الدمام": { fajr: "٣:١٣", sunrise: "٤:٤٣", dhuhr: "١١:٣٨", asr: "٣:٠٥", maghrib: "٦:٣١", isha: "٨:٠١" },
};
// 24h format for real-time calculations
const PRAYER_24H = {
  "الرياض": { fajr:[3,32], sunrise:[5,3], dhuhr:[11,52], asr:[15,13], maghrib:[18,41], isha:[20,11] },
  "جدة": { fajr:[4,12], sunrise:[5,40], dhuhr:[12,22], asr:[15,40], maghrib:[19,4], isha:[20,34] },
  "مكة المكرمة": { fajr:[4,11], sunrise:[5,38], dhuhr:[12,20], asr:[15,38], maghrib:[19,2], isha:[20,32] },
  "المدينة المنورة": { fajr:[4,2], sunrise:[5,30], dhuhr:[12,20], asr:[15,42], maghrib:[19,8], isha:[20,38] },
  "الدمام": { fajr:[3,13], sunrise:[4,43], dhuhr:[11,38], asr:[15,5], maghrib:[18,31], isha:[20,1] },
};
const toArabicNum = n => String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
const pad2 = n => String(n).padStart(2, "0");

const DONATION_PROJECTS = [
  { id: 1, title: "بناء مسجد حي السلام", desc: "مشروع بناء مسجد جديد يتسع لـ ١٥٠٠ مصلي في حي السلام بالرياض", type: "بناء", target: 2500000, collected: 1875000, donors: 342, img: "🕌" },
  { id: 2, title: "حلقات تحفيظ القرآن الكريم", desc: "دعم ٢٠ حلقة تحفيظ في مساجد الرياض وجدة والدمام", type: "تحفيظ", target: 500000, collected: 215000, donors: 156, img: "📖" },
  { id: 3, title: "طباعة وتوزيع المصحف الشريف", desc: "طباعة ١٠,٠٠٠ نسخة من المصحف الشريف وتوزيعها على المساجد", type: "طباعة", target: 300000, collected: 78000, donors: 67, img: "📗" },
  { id: 4, title: "صيانة شاملة لمسجد النور", desc: "صيانة التكييف والسجاد والإضاءة ودورات المياه", type: "صيانة", target: 180000, collected: 112000, donors: 94, img: "🔧" },
];

const CITIES = ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام"];
const COMPLAINT_TYPES = ["صوت مرتفع","صوت منخفض","تداخل أصوات","نظافة","صيانة","تكييف","إضاءة","ازدحام","أخرى"];

/* ══════════════════════════════════
   GEOMETRIC PATTERN SVG
   ══════════════════════════════════ */
function IslamicPattern({ opacity = 0.04, color = T.emerald }) {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={color} strokeWidth="0.5"/>
          <circle cx="30" cy="30" r="8" fill="none" stroke={color} strokeWidth="0.4"/>
          <path d="M15 15L45 15L45 45L15 45Z" fill="none" stroke={color} strokeWidth="0.3"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo)"/>
    </svg>
  );
}

/* ══════════════════════════════════
   SHARED COMPONENTS
   ══════════════════════════════════ */
function Badge({ text, color = "green" }) {
  const map = { green: [T.emeraldLight, T.emerald], gold: [T.goldLight, T.gold], gray: ["#f0eeea", T.text2], red: [T.dangerLight, T.danger], blue: ["#e7f1f8", "#1d6fa5"] };
  const [bg, fg] = map[color] || map.green;
  return <span style={{ background: bg, color: fg, padding: "4px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "inline-block" }}>{text}</span>;
}

function Stars({ rating }) {
  return <span style={{ color: T.gold, fontSize: 14, letterSpacing: 1 }}>{"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}</span>;
}

function Progress({ val, max }) {
  const pct = Math.min(100, (val / max) * 100);
  return (
    <div style={{ height: 8, background: T.cream, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${T.emerald}, ${T.gold})`, borderRadius: 4, transition: "width .6s ease" }} />
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: T.emerald, color: T.white, padding: "14px 32px", borderRadius: 14, fontSize: 15, fontWeight: 600, boxShadow: T.shadowLg, animation: "slideUp .3s ease", fontFamily: "inherit" }}>
      {message}
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(16px) } to { opacity:1; transform:translateX(-50%) } }`}</style>
    </div>
  );
}

/* ══════════════════════════════════
   SECTIONS
   ══════════════════════════════════ */
function Navbar({ active, onNav }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { id: "home", label: "الرئيسية" },
    { id: "mosques", label: "المساجد" },
    { id: "prayers", label: "مواقيت الصلاة" },
    { id: "donate", label: "التبرعات" },
    { id: "complaint", label: "بلاغ / تقييم" },
  ];
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)",
      borderBottom: `1px solid ${T.border}`,
      padding: "0 48px", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }} className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${T.emerald}, ${T.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🕌</div>
        <span style={{ fontSize: 18, fontWeight: 800, color: T.emeraldDark }}>منصة المساجد</span>
      </div>
      {/* Desktop links */}
      <div className="nav-links" style={{ display: "flex", gap: 4 }}>
        {links.map(l => (
          <button key={l.id} onClick={() => onNav(l.id)} style={{
            padding: "8px 18px", borderRadius: 8, border: "none",
            background: active === l.id ? T.emeraldLight : "transparent",
            color: active === l.id ? T.emerald : T.text2,
            fontWeight: active === l.id ? 700 : 500, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
          }}
            onMouseEnter={e => { if (active !== l.id) e.currentTarget.style.background = T.cream }}
            onMouseLeave={e => { if (active !== l.id) e.currentTarget.style.background = "transparent" }}
          >{l.label}</button>
        ))}
      </div>
      {/* Mobile hamburger */}
      <button className="nav-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{
        display: "none", alignItems: "center", justifyContent: "center",
        width: 40, height: 40, borderRadius: 10, border: "none",
        background: mobileOpen ? T.emeraldLight : "transparent",
        cursor: "pointer", fontSize: 22,
      }}>{mobileOpen ? "✕" : "☰"}</button>
      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0,
          background: "rgba(255,255,255,.97)", backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${T.border}`,
          display: "flex", flexDirection: "column", padding: "8px 16px", zIndex: 99,
        }}>
          {links.map(l => (
            <button key={l.id} onClick={() => { onNav(l.id); setMobileOpen(false); }} style={{
              padding: "14px 16px", borderRadius: 10, border: "none", textAlign: "right",
              background: active === l.id ? T.emeraldLight : "transparent",
              color: active === l.id ? T.emerald : T.text2,
              fontWeight: active === l.id ? 700 : 500, fontSize: 15,
              cursor: "pointer", fontFamily: "inherit",
            }}>{l.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection({ onNav }) {
  const [search, setSearch] = useState("");
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: `linear-gradient(160deg, ${T.emeraldDark} 0%, ${T.emerald} 50%, #0a8a65 100%)`,
      color: T.white, padding: "80px 48px 90px", textAlign: "center",
      minHeight: 480, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <IslamicPattern opacity={0.06} color="#ffffff" />
      {/* Decorative arches */}
      <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 50, overflow: "hidden" }}>
        <svg viewBox="0 0 1440 50" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
          <path d="M0,50 Q360,0 720,50 Q1080,0 1440,50 L1440,50 L0,50 Z" fill={T.bg}/>
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.goldSoft, letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>بسم الله الرحمن الرحيم</div>
        <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.3, margin: "0 0 16px", textShadow: "0 2px 20px rgba(0,0,0,.15)" }}>
          منصة المساجد
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.8, color: "rgba(255,255,255,.8)", margin: "0 0 36px", maxWidth: 550, marginInline: "auto" }}>
          ابحث عن المساجد القريبة، تعرف على مواقيت الصلاة، ساهم في دعم بيوت الله
        </p>

        <div style={{
          display: "flex", gap: 0, background: "rgba(255,255,255,.15)", borderRadius: 16,
          padding: 6, maxWidth: 520, margin: "0 auto", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,.2)",
        }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن مسجد بالاسم أو المدينة..."
            style={{
              flex: 1, padding: "14px 20px", border: "none", background: "transparent",
              color: T.white, fontSize: 15, fontFamily: "inherit", outline: "none",
            }}
          />
          <button onClick={() => onNav("mosques")} style={{
            padding: "12px 28px", borderRadius: 12, border: "none",
            background: T.gold, color: T.white, fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", transition: "transform .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >بحث</button>
        </div>

        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 40 }}>
          {[
            { n: "+١٢,٠٠٠", l: "مسجد مسجل" },
            { n: "+٣٠٠", l: "مدينة وحي" },
            { n: "+٢ مليون", l: "ريال تبرعات" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: T.goldSoft }}>{s.n}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrayerTimesSection() {
  const [city, setCity] = useState("الرياض");
  const [now, setNow] = useState(new Date());
  const times = PRAYER_DATA[city];
  const times24 = PRAYER_24H[city];

  // Live clock — updates every second
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const labels = [
    { key: "fajr", name: "الفجر", icon: "🌙" },
    { key: "sunrise", name: "الشروق", icon: "🌅" },
    { key: "dhuhr", name: "الظهر", icon: "☀️" },
    { key: "asr", name: "العصر", icon: "🌤️" },
    { key: "maghrib", name: "المغرب", icon: "🌇" },
    { key: "isha", name: "العشاء", icon: "🌃" },
  ];

  // Find next prayer
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const nowSec = nowMin * 60 + now.getSeconds();
  let nextIdx = -1;
  for (let i = 0; i < labels.length; i++) {
    const [h, m] = times24[labels[i].key];
    if (h * 60 + m > nowMin) { nextIdx = i; break; }
  }
  if (nextIdx === -1) nextIdx = 0; // after isha → next fajr

  // Countdown to next prayer
  const nextKey = labels[nextIdx].key;
  const [nh, nm] = times24[nextKey];
  let diffSec = (nh * 3600 + nm * 60) - nowSec;
  if (diffSec < 0) diffSec += 24 * 3600; // wrap around midnight
  const cdH = Math.floor(diffSec / 3600);
  const cdM = Math.floor((diffSec % 3600) / 60);
  const cdS = diffSec % 60;

  // Current time in Arabic
  const currentTime = toArabicNum(pad2(now.getHours())) + ":" + toArabicNum(pad2(now.getMinutes())) + ":" + toArabicNum(pad2(now.getSeconds()));

  return (
    <section style={{ padding: "70px 48px", background: T.white, position: "relative" }} className="section-prayers">
      <IslamicPattern opacity={0.025} />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, letterSpacing: 2, marginBottom: 8 }}>حسب تقويم أم القرى</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, margin: "0 0 12px" }}>مواقيت الصلاة</h2>
          <p style={{ color: T.text2, fontSize: 15 }}>التوقيت المحلي — ٢٢ ذو الحجة ١٤٤٧ هـ</p>

          {/* Live clock */}
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 14, background: T.cream, borderRadius: 16, padding: "12px 28px", border: `1px solid ${T.border}` }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: T.text3, marginBottom: 2 }}>الوقت الآن</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.text, fontVariantNumeric: "tabular-nums", direction: "ltr" }}>{currentTime}</div>
            </div>
            <div style={{ width: 1, height: 40, background: T.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: T.text3, marginBottom: 2 }}>الصلاة القادمة: {labels[nextIdx].name}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.emerald, fontVariantNumeric: "tabular-nums", direction: "ltr" }}>
                {toArabicNum(pad2(cdH))}:{toArabicNum(pad2(cdM))}:{toArabicNum(pad2(cdS))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32 }}>
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(c)} style={{
              padding: "9px 22px", borderRadius: 24, border: `1.5px solid ${city === c ? T.emerald : T.border}`,
              background: city === c ? T.emerald : T.white, color: city === c ? T.white : T.text2,
              fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
            }}>{c}</button>
          ))}
        </div>

        <div className="prayer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
          {labels.map((p, i) => {
            const isNext = i === nextIdx;
            const [ph, pm] = times24[p.key];
            const isPast = (ph * 60 + pm) <= nowMin;
            const isHighlight = isNext;
            return (
              <div key={p.key} style={{
                textAlign: "center", padding: "28px 16px", borderRadius: 18,
                background: isHighlight
                  ? `linear-gradient(180deg, ${T.emeraldDark}, ${T.emerald})`
                  : isPast ? "#f0eeea" : T.cream,
                color: isHighlight ? T.white : isPast ? T.text3 : T.text,
                border: `1px solid ${isHighlight ? "transparent" : T.border}`,
                transition: "all .3s", cursor: "default",
                transform: isHighlight ? "translateY(-6px)" : "none",
                boxShadow: isHighlight ? "0 8px 28px rgba(12,107,78,.25)" : "none",
              }}
                onMouseEnter={e => !isHighlight && (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => !isHighlight && (e.currentTarget.style.transform = "none")}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 1 }}>{times[p.key]}</div>
                {isHighlight && <div style={{ fontSize: 11, marginTop: 8, opacity: .85, fontWeight: 600, background: "rgba(255,255,255,.15)", borderRadius: 10, padding: "3px 10px", display: "inline-block" }}>الصلاة القادمة</div>}
                {isPast && !isHighlight && <div style={{ fontSize: 11, marginTop: 6, opacity: .6 }}>✓ أُديت</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AdhanPlayerSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [enabled, setEnabled] = useState(false); // browser requires user click first
  const [progress, setProgress] = useState(0);
  const [eqBars, setEqBars] = useState([3,5,7,4,6,8,5,3,6,4,7,5]);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [now, setNow] = useState(new Date());
  const audioCtxRef = useRef(null);
  const gainRef = useRef(null);
  const oscRef = useRef(null);
  const noteIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const noteIndexRef = useRef(0);
  const triggeredRef = useRef({});

  // Admin-assigned voice (simulating what admin set)
  const assignedVoice = { name: "أذان الحرم المكي", muezzin: "الشيخ السديس", style: "مقام حجاز", baseFreq: 220, scale: [0, 1, 4, 5, 7, 8, 11, 12] };

  const prayerNames = { fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء" };

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-trigger adhan when prayer time arrives
  useEffect(() => {
    if (!enabled || muted) return;
    const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const times24 = PRAYER_24H["الرياض"];
    const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

    for (const p of prayers) {
      const [ph, pm] = times24[p];
      const key = `${p}-${ph}-${pm}`;
      // Trigger when time matches (within first 3 seconds of the minute)
      if (h === ph && m === pm && s < 3 && !triggeredRef.current[key] && !isPlaying) {
        triggeredRef.current[key] = true;
        setCurrentPrayer(p);
        startAdhan();
        // Reset trigger after 2 minutes
        setTimeout(() => { delete triggeredRef.current[key]; }, 120000);
        break;
      }
    }
  }, [now, enabled, muted, isPlaying]);

  const startAdhan = () => {
    if (isPlaying) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0.25;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    setIsPlaying(true);
    setProgress(0);
    noteIndexRef.current = 0;

    const playNote = () => {
      if (oscRef.current) try { oscRef.current.stop(); } catch(e) {}
      const idx = noteIndexRef.current;
      const scaleIdx = idx % assignedVoice.scale.length;
      const semitone = assignedVoice.scale[scaleIdx];
      const freq = assignedVoice.baseFreq * Math.pow(2, semitone / 12);

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
      env.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.connect(env);
      env.connect(gain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.3);
      oscRef.current = osc;
      noteIndexRef.current++;
    };

    playNote();
    noteIntervalRef.current = setInterval(playNote, 1400);
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => { if (prev >= 100) { stopAdhan(); return 0; } return prev + 0.4; });
      setEqBars(prev => prev.map(() => 2 + Math.random() * 8));
    }, 200);

    // Auto-stop after ~4 minutes
    setTimeout(() => stopAdhan(), 240000);
  };

  const stopAdhan = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentPrayer(null);
    setEqBars([3,5,7,4,6,8,5,3,6,4,7,5]);
    if (noteIntervalRef.current) clearInterval(noteIntervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (oscRef.current) try { oscRef.current.stop(); } catch(e) {}
    if (audioCtxRef.current) try { audioCtxRef.current.close(); } catch(e) {}
  };

  useEffect(() => () => stopAdhan(), []);

  // Find next prayer for display
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const times24 = PRAYER_24H["الرياض"];
  const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  let nextPrayer = null;
  let minUntilNext = 0;
  for (const p of prayers) {
    const [ph, pm] = times24[p];
    const pMin = ph * 60 + pm;
    if (pMin > nowMin) {
      nextPrayer = p;
      minUntilNext = pMin - nowMin;
      break;
    }
  }
  if (!nextPrayer) { nextPrayer = "fajr"; const [fh, fm] = times24.fajr; minUntilNext = (24 * 60 - nowMin) + fh * 60 + fm; }

  return (
    <section style={{ padding: "50px 48px", background: `linear-gradient(180deg, ${T.emeraldDark} 0%, #062e22 100%)`, position: "relative" }}>
      <IslamicPattern opacity={0.04} color="#fff" />
      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>

        {/* Playing banner */}
        {isPlaying && (
          <div style={{ background: "rgba(255,255,255,.12)", borderRadius: 18, padding: "20px 28px", marginBottom: 24, border: "1px solid rgba(255,255,255,.15)", animation: "pulse 2s infinite" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg, ${T.gold}, #d4a730)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, animation: "spin 3s linear infinite" }}>🔊</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: T.white }}>الأذان يُرفع الآن — {currentPrayer ? prayerNames[currentPrayer] : ""}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 2 }}>{assignedVoice.name} · {assignedVoice.muezzin}</div>
                <div style={{ display: "flex", alignItems: "end", gap: 2, height: 20, marginTop: 8 }}>
                  {eqBars.map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h * 2}px`, maxHeight: 20, background: `linear-gradient(180deg, ${T.goldSoft}, ${T.gold})`, borderRadius: 1.5, transition: "height .15s" }} />
                  ))}
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,.1)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${T.gold}, ${T.goldSoft})`, borderRadius: 2, transition: "width .2s" }} />
                </div>
              </div>
              <button onClick={stopAdhan} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "none", color: T.white, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⏹</button>
            </div>
          </div>
        )}

        {/* Main controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.goldSoft, letterSpacing: 2, marginBottom: 6 }}>نظام الأذان الآلي</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: "0 0 6px" }}>
              {isPlaying ? "الأذان يُرفع الآن ..." : `الأذان القادم: ${prayerNames[nextPrayer]}`}
            </h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", margin: 0 }}>
              {isPlaying
                ? `${assignedVoice.name} — ${assignedVoice.muezzin}`
                : `بعد ${minUntilNext >= 60 ? Math.floor(minUntilNext / 60) + " ساعة و " : ""}${minUntilNext % 60} دقيقة`
              }
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {!enabled ? (
              <button onClick={() => setEnabled(true)} style={{
                padding: "14px 28px", borderRadius: 14, border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${T.gold}, #d4a730)`, color: T.white,
                fontSize: 15, fontWeight: 700, fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(184,148,42,.4)",
              }}>
                🔔 تفعيل الأذان المباشر
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setMuted(!muted)} style={{
                  padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${muted ? "rgba(255,255,255,.2)" : T.goldSoft}`,
                  background: muted ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.1)",
                  color: T.white, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {muted ? "🔇 صامت" : "🔊 مفعّل"}
                </button>
                {/* Demo button - triggers adhan for testing */}
                {!isPlaying && (
                  <button onClick={() => { setCurrentPrayer(nextPrayer); startAdhan(); }} style={{
                    padding: "10px 20px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,.15)",
                    background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.6)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    ▶ تجربة
                  </button>
                )}
              </div>
            )}
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: enabled && !muted ? "#4ade80" : "rgba(255,255,255,.2)", display: "inline-block" }} />
              {!enabled ? "اضغط للتفعيل" : muted ? "الأذان مكتوم" : "سيعمل تلقائياً عند وقت الصلاة"}
            </div>
          </div>
        </div>

        {/* Assigned voice info - set by admin */}
        <div style={{ marginTop: 20, padding: "14px 20px", borderRadius: 14, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎵</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.white }}>{assignedVoice.name}</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.4)" }}>{assignedVoice.muezzin} · {assignedVoice.style} · معتمد من الإدارة</div>
          </div>
          <div style={{ fontSize: 11, color: T.goldSoft, fontWeight: 600, padding: "4px 12px", borderRadius: 8, background: "rgba(184,148,42,.12)" }}>✓ معتمد</div>
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.85} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </section>
  );
}

function MosquesSection({ toast }) {
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("الكل");
  const [selectedMosque, setSelectedMosque] = useState(null);

  const filtered = MOSQUES.filter(m => {
    if (filterCity !== "الكل" && m.city !== filterCity) return false;
    return m.name.includes(search) || m.city.includes(search) || m.district.includes(search);
  });

  return (
    <section style={{ padding: "70px 48px", background: T.bg }} className="section-mosques">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, margin: "0 0 10px" }}>ابحث عن مسجد</h2>
          <p style={{ color: T.text2, fontSize: 15 }}>اعثر على المسجد الأقرب إليك واطلع على خدماته ومواقيته</p>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: 340, maxWidth: "100%" }}>
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: T.text3 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="اسم المسجد أو الحي..."
              style={{ width: "100%", padding: "12px 44px 12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: T.white, boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = T.emerald} onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }} className="city-filters">
            {["الكل", ...CITIES].map(c => (
              <button key={c} onClick={() => setFilterCity(c)} style={{
                padding: "10px 18px", borderRadius: 10, border: "none",
                background: filterCity === c ? T.emerald : T.white, color: filterCity === c ? T.white : T.text2,
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                boxShadow: filterCity !== c ? T.shadow : "none",
              }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }} className="mosque-grid">
          {filtered.map(m => (
            <div key={m.id} style={{
              background: T.white, borderRadius: 18, padding: 24,
              border: `1px solid ${T.border}`, transition: "all .2s",
              boxShadow: "0 1px 8px rgba(0,0,0,.03)", display: "flex", flexDirection: "column",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadowLg; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = T.emerald + "44"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,.03)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = T.border; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: T.text }}>{m.name}</h3>
                  <div style={{ fontSize: 13, color: T.text2 }}>{m.city} — {m.district}</div>
                </div>
                <Badge text={m.type} color="green" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Stars rating={m.rating} />
                <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{m.rating}</span>
                <span style={{ fontSize: 12, color: T.text3 }}>({m.reviews} تقييم)</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {m.services.slice(0, 4).map((s, i) => (
                  <span key={i} style={{ padding: "3px 10px", borderRadius: 6, background: T.cream, fontSize: 11.5, color: T.text2, fontWeight: 500 }}>{s}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: T.text3, marginBottom: 16 }}>
                <span>👤 {m.imam}</span>
                <span>السعة: {m.capacity}</span>
              </div>
              <button onClick={() => setSelectedMosque(m)} style={{
                marginTop: "auto", width: "100%", padding: "12px 20px", borderRadius: 12, border: "none",
                background: T.emerald, color: T.white, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = T.emeraldDark; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.emerald; }}
              >عرض التفاصيل</button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: T.text3 }}><div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div><div style={{ fontSize: 15 }}>لا توجد نتائج مطابقة</div></div>}
      </div>

      {/* Mosque Detail Modal */}
      {selectedMosque && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setSelectedMosque(null)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }} />
          <div onClick={e => e.stopPropagation()} style={{
            position: "relative", background: T.white, borderRadius: 24, width: 680, maxWidth: "92vw",
            maxHeight: "88vh", overflow: "auto", boxShadow: "0 24px 60px rgba(0,0,0,.2)", animation: "modalIn .25s ease",
          }}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${T.emeraldDark}, ${T.emerald})`, padding: "28px 28px 32px", color: T.white, position: "relative" }}>
              <IslamicPattern opacity={0.06} color="#fff" />
              <button onClick={() => setSelectedMosque(null)} style={{
                position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,.15)", border: "none",
                width: 36, height: 36, borderRadius: "50%", color: T.white, fontSize: 18, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1,
              }}>✕</button>
              <div style={{ position: "relative" }}>
                <Badge text={selectedMosque.type} color="gold" />
                <h2 style={{ fontSize: 26, fontWeight: 800, margin: "10px 0 6px" }}>{selectedMosque.name}</h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,.7)", margin: 0 }}>{selectedMosque.city} — {selectedMosque.district}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                  <Stars rating={selectedMosque.rating} />
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{selectedMosque.rating}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>({selectedMosque.reviews} تقييم)</span>
                </div>
              </div>
            </div>
            {/* Body */}
            <div style={{ padding: 28 }}>
              <div className="mosque-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: T.text }}>بيانات المسجد</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px 14px", fontSize: 14 }}>
                    {[["الإمام", selectedMosque.imam], ["السعة", `${selectedMosque.capacity} مصلي`], ["المدينة", selectedMosque.city], ["الحي", selectedMosque.district], ["النوع", selectedMosque.type]].map(([l, v], i) => (
                      <div key={i} style={{ display: "contents" }}><span style={{ color: T.text2, fontWeight: 600 }}>{l}</span><span style={{ color: T.text }}>{v}</span></div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: T.text }}>الخدمات المتاحة</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedMosque.services.map((s, i) => <Badge key={i} text={s} color="green" />)}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: "24px 0 16px", color: T.text }}>تقييم المسجد</h3>
                  <RatingForm mosque={selectedMosque} toast={toast} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: "24px 0 12px", color: T.text }}>الموقع</h3>
                  <div style={{ height: 140, borderRadius: 14, background: `linear-gradient(135deg, ${T.emeraldLight}, #e7f1f8)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 30 }}>📍</div>
                      <div style={{ fontSize: 13, color: T.text2, marginTop: 4 }}>{selectedMosque.city} — {selectedMosque.district}</div>
                      <div style={{ fontSize: 11, color: T.emerald, marginTop: 3, fontWeight: 600 }}>خريطة تفاعلية في النسخة الكاملة</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(20px) scale(.96) } to { opacity:1; transform:none } }`}</style>
          </div>
        </div>
      )}
    </section>
  );
}

function RatingForm({ mosque, toast }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <div style={{ padding: 16, background: T.emeraldLight, borderRadius: 12, textAlign: "center", fontSize: 14, color: T.emerald, fontWeight: 600 }}>شكراً لتقييمك! ⭐ {rating}/5</div>;
  return (
    <div style={{ padding: 16, background: "#fafaf8", borderRadius: 14, border: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
        {[1,2,3,4,5].map(s => (
          <span key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
            style={{ fontSize: 28, cursor: "pointer", color: s <= (hover || rating) ? T.gold : T.border, transition: "color .15s" }}>★</span>
        ))}
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="أضف تعليقاً (اختياري)..." rows={2}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 10 }} />
      <button onClick={() => { if (rating) { setSubmitted(true); toast("تم إرسال التقييم — شكراً لك ⭐"); }}}
        disabled={!rating} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: rating ? T.emerald : T.border, color: T.white, fontSize: 14, fontWeight: 600, cursor: rating ? "pointer" : "default", fontFamily: "inherit" }}>إرسال التقييم</button>
    </div>
  );
}

function DonationsSection({ toast }) {
  const [projects, setProjects] = useState(DONATION_PROJECTS);
  const [donateModal, setDonateModal] = useState(null);
  const [amount, setAmount] = useState("");

  const [receipt, setReceipt] = useState(null);

  const donate = () => {
    const amt = Number(amount);
    if (!amt || !donateModal) return;
    setProjects(prev => prev.map(p => p.id === donateModal.id ? { ...p, collected: Math.min(p.target, p.collected + amt), donors: p.donors + 1 } : p));
    setReceipt({ project: donateModal.title, amount: amt, ref: `DON-${Math.floor(Math.random() * 90000 + 10000)}`, date: "٨ يونيو ٢٠٢٦" });
    setDonateModal(null);
    setAmount("");
  };

  return (
    <section style={{ padding: "70px 48px", background: T.white, position: "relative" }} className="section-donate">
      <IslamicPattern opacity={0.02} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, letterSpacing: 2, marginBottom: 8 }}>صدقة جارية</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, margin: "0 0 10px" }}>ساهم في دعم بيوت الله</h2>
          <p style={{ color: T.text2, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>تبرعك يصل مباشرة للمشاريع المعتمدة عبر بوابات دفع مرخصة</p>
        </div>

        <div className="donate-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 22 }}>
          {projects.map(p => {
            const pct = Math.round(p.collected / p.target * 100);
            return (
              <div key={p.id} style={{
                background: T.bg, borderRadius: 20, padding: 28, border: `1px solid ${T.border}`,
                transition: "all .2s", cursor: "default",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowLg}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ fontSize: 40, marginBottom: 14 }}>{p.img}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px" }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.7, margin: "0 0 16px" }}>{p.desc}</p>
                <Progress val={p.collected} max={p.target} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: T.text2, margin: "8px 0 4px" }}>
                  <span style={{ fontWeight: 700, color: T.emerald }}>{pct}%</span>
                  <span>{(p.collected / 1e3).toFixed(0)} ألف من {(p.target / 1e3).toFixed(0)} ألف</span>
                </div>
                <div style={{ fontSize: 12, color: T.text3, marginBottom: 16 }}>{p.donors} متبرع</div>
                <button onClick={() => setDonateModal(p)} style={{
                  width: "100%", padding: "13px 20px", borderRadius: 12, border: "none",
                  background: T.emerald, color: T.white, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.emeraldDark; e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.emerald; e.currentTarget.style.transform = "scale(1)"; }}
                >تبرع الآن 💳</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* DONATE MODAL */}
      {donateModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setDonateModal(null)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }} />
          <div onClick={e => e.stopPropagation()} style={{
            position: "relative", background: T.white, borderRadius: 24, width: 460, maxWidth: "92vw",
            overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,.2)", animation: "modalIn .25s ease",
          }}>
            <div style={{ background: `linear-gradient(135deg, ${T.emeraldDark}, ${T.emerald})`, padding: "28px 28px 32px", color: T.white, textAlign: "center", position: "relative" }}>
              <IslamicPattern opacity={0.06} color="#fff" />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{donateModal.img}</div>
                <h3 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 700 }}>{donateModal.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.7)", margin: 0 }}>المتبقي: {((donateModal.target - donateModal.collected) / 1e3).toFixed(0)} ألف ريال</p>
              </div>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>مبلغ التبرع (ريال سعودي)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="أدخل المبلغ"
                  style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `2px solid ${T.border}`, fontSize: 18, fontFamily: "inherit", outline: "none", textAlign: "center", fontWeight: 700, boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = T.emerald} onBlur={e => e.target.style.borderColor = T.border}
                />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
                {[50, 100, 500, 1000, 5000].map(a => (
                  <button key={a} onClick={() => setAmount(String(a))} style={{
                    padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                    border: `2px solid ${amount === String(a) ? T.emerald : T.border}`,
                    background: amount === String(a) ? T.emeraldLight : T.white,
                    color: amount === String(a) ? T.emerald : T.text2,
                    cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                  }}>{a}</button>
                ))}
              </div>
              <div style={{ padding: 14, background: T.goldLight, borderRadius: 12, fontSize: 12.5, color: T.gold, textAlign: "center", marginBottom: 20, lineHeight: 1.7 }}>
                ⚠️ عرض تجريبي — في النسخة الكاملة يتم الدفع عبر بوابة مرخصة مع إصدار إيصال رسمي
              </div>
              <button onClick={donate} disabled={!amount}
                style={{
                  width: "100%", padding: "15px", borderRadius: 14, border: "none",
                  background: amount ? T.emerald : T.border, color: T.white,
                  fontSize: 17, fontWeight: 700, cursor: amount ? "pointer" : "default",
                  fontFamily: "inherit", transition: "all .15s",
                }}>
                تأكيد التبرع {amount && `— ${Number(amount).toLocaleString()} ريال`}
              </button>
              <button onClick={() => setDonateModal(null)} style={{ width: "100%", padding: "12px", border: "none", background: "transparent", color: T.text2, fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>إلغاء</button>
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(20px) scale(.96) } to { opacity:1; transform:none } }`}</style>
          </div>
        </div>
      )}
      {receipt && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setReceipt(null)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)" }} />
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: T.white, borderRadius: 24, width: 420, maxWidth: "92vw", padding: 32, textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,.2)", animation: "modalIn .25s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>جزاكم الله خيراً</h3>
            <p style={{ color: T.text2, fontSize: 14, margin: "0 0 20px" }}>تم التبرع بنجاح</p>
            <div style={{ background: "#fafaf8", borderRadius: 14, padding: 20, textAlign: "right", border: `1px solid ${T.border}`, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "10px 12px", fontSize: 14 }}>
                <span style={{ color: T.text2, fontWeight: 600 }}>المشروع</span><span style={{ fontWeight: 600 }}>{receipt.project}</span>
                <span style={{ color: T.text2, fontWeight: 600 }}>المبلغ</span><span style={{ fontWeight: 700, color: T.emerald }}>{receipt.amount.toLocaleString()} ريال</span>
                <span style={{ color: T.text2, fontWeight: 600 }}>رقم العملية</span><span style={{ fontWeight: 600, color: T.emerald }}>{receipt.ref}</span>
                <span style={{ color: T.text2, fontWeight: 600 }}>التاريخ</span><span>{receipt.date}</span>
              </div>
            </div>
            <div style={{ padding: 10, background: T.goldLight, borderRadius: 10, fontSize: 12, color: T.gold, marginBottom: 16 }}>⚠️ في النسخة الكاملة سيتم إصدار إيصال PDF قابل للتحميل</div>
            <button onClick={() => setReceipt(null)} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: T.emerald, color: T.white, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>إغلاق</button>
            <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(20px) scale(.96) } to { opacity:1; transform:none } }`}</style>
          </div>
        </div>
      )}
    </section>
  );
}

function ComplaintSection({ toast }) {
  const [form, setForm] = useState({ mosque: "", type: "", desc: "", name: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [refNum, setRefNum] = useState("");
  const [tab, setTab] = useState("new");
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState(null);

  const submit = () => {
    if (!form.mosque || !form.type || !form.desc) return;
    const ref = `SH-${String(Math.floor(Math.random() * 9000 + 1000))}`;
    setRefNum(ref);
    setSubmitted(true);
    toast("تم إرسال البلاغ بنجاح ✓");
  };

  const track = () => {
    if (!trackId) return;
    setTrackResult({ id: trackId, mosque: "جامع الراجحي", type: "صوت مرتفع", status: "قيد المراجعة", date: "٧ يونيو ٢٠٢٦", history: [{ date: "٧ يونيو", action: "تم استلام البلاغ", by: "النظام" }, { date: "٧ يونيو", action: "تم إحالته للمشرف", by: "الإدارة" }] });
  };

  const reset = () => { setForm({ mosque: "", type: "", desc: "", name: "", phone: "" }); setSubmitted(false); setRefNum(""); };

  return (
    <section style={{ padding: "70px 48px", background: T.bg }} className="section-complaint">
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, margin: "0 0 10px" }}>بلاغ أو تقييم</h2>
          <p style={{ color: T.text2, fontSize: 15 }}>ساعدنا في تحسين تجربة المساجد</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 20 }}>
          {[{ id: "new", label: "بلاغ جديد" }, { id: "track", label: "متابعة بلاغ" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: tab === t.id ? T.emerald : T.white, color: tab === t.id ? T.white : T.text2, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: tab !== t.id ? "0 1px 4px rgba(0,0,0,.05)" : "none" }}>{t.label}</button>
          ))}
        </div>
        <div style={{ background: T.white, borderRadius: 22, padding: 36, border: `1px solid ${T.border}`, boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
          {tab === "track" ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>رقم البلاغ</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <input value={trackId} onChange={e => setTrackId(e.target.value)} placeholder="SH-XXXX" style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 16, fontFamily: "inherit", outline: "none", textAlign: "center", fontWeight: 600, boxSizing: "border-box" }} />
                  <button onClick={track} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: T.emerald, color: T.white, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>بحث</button>
                </div>
              </div>
              {trackResult && (
                <div style={{ marginTop: 20, padding: 20, background: "#fafaf8", borderRadius: 14, border: `1px solid ${T.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: T.emerald }}>{trackResult.id}</span>
                    <Badge text={trackResult.status} color="orange" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "8px 12px", fontSize: 13.5, marginBottom: 16 }}>
                    <span style={{ color: T.text2, fontWeight: 600 }}>المسجد</span><span>{trackResult.mosque}</span>
                    <span style={{ color: T.text2, fontWeight: 600 }}>النوع</span><span>{trackResult.type}</span>
                    <span style={{ color: T.text2, fontWeight: 600 }}>التاريخ</span><span>{trackResult.date}</span>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>سجل المتابعة</div>
                  {trackResult.history.map((h, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === trackResult.history.length - 1 ? T.emerald : T.border, marginTop: 4, flexShrink: 0 }} />
                      <div><div style={{ fontSize: 13, fontWeight: 600 }}>{h.action}</div><div style={{ fontSize: 11.5, color: T.text3 }}>{h.date} — {h.by}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : submitted ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>تم إرسال البلاغ</h3>
              <p style={{ color: T.text2, fontSize: 15 }}>شكراً لمساهمتك — سيتم مراجعة بلاغك في أقرب وقت</p>
              <div style={{ marginTop: 16, padding: 14, background: T.emeraldLight, borderRadius: 12, fontSize: 16, color: T.emerald, fontWeight: 700 }}>رقم البلاغ: {refNum}</div>
              <p style={{ fontSize: 13, color: T.text3, marginTop: 10 }}>احتفظ بهذا الرقم لمتابعة حالة بلاغك</p>
              <button onClick={reset} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, border: `1.5px solid ${T.emerald}`, background: "transparent", color: T.emerald, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>إرسال بلاغ آخر</button>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>المسجد <span style={{ color: T.danger }}>*</span></label><select value={form.mosque} onChange={e => setForm(p => ({ ...p, mosque: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: T.white, appearance: "auto", boxSizing: "border-box" }}><option value="">اختر المسجد</option>{MOSQUES.map(m => <option key={m.id} value={m.name}>{m.name} — {m.city}</option>)}</select></div>
                <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>نوع البلاغ <span style={{ color: T.danger }}>*</span></label><select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: T.white, appearance: "auto", boxSizing: "border-box" }}><option value="">اختر النوع</option>{COMPLAINT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              </div>
              <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>وصف البلاغ <span style={{ color: T.danger }}>*</span></label><textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} rows={4} placeholder="اكتب تفاصيل الملاحظة..." style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>الاسم (اختياري)</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="اسمك" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} /></div>
                <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>الجوال (اختياري)</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="05XXXXXXXX" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} /></div>
              </div>
              <button onClick={submit} disabled={!form.mosque || !form.type || !form.desc} style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: (form.mosque && form.type && form.desc) ? T.emerald : T.border, color: T.white, fontSize: 16, fontWeight: 700, cursor: (form.mosque && form.type && form.desc) ? "pointer" : "default", fontFamily: "inherit", marginTop: 4 }}>إرسال البلاغ</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { q: "كيف أبحث عن أقرب مسجد؟", a: "استخدم خاصية البحث في قسم المساجد، يمكنك التصفية حسب المدينة والحي. في النسخة الكاملة سيتم إضافة البحث بالموقع الجغرافي." },
    { q: "هل التبرعات تصل مباشرة للمشاريع؟", a: "نعم، يتم تحويل التبرعات عبر بوابات دفع مرخصة مباشرة لحساب المشروع المعتمد، مع إصدار إيصال رسمي." },
    { q: "كيف أتابع حالة بلاغي؟", a: "بعد إرسال البلاغ ستحصل على رقم مرجعي. استخدمه في خاصية 'متابعة بلاغ' لمعرفة آخر المستجدات." },
    { q: "هل بيانات المستخدمين محمية؟", a: "نعم، المنصة تلتزم بنظام حماية البيانات الشخصية (PDPL) في المملكة العربية السعودية وتستخدم تشفيراً متقدماً." },
    { q: "كيف يتم تحديد مواقيت الصلاة؟", a: "يتم حساب المواقيت وفق تقويم أم القرى المعتمد من المملكة العربية السعودية." },
  ];
  return (
    <section style={{ padding: "70px 48px", background: T.white, position: "relative" }} className="section-about">
      <IslamicPattern opacity={0.02} />
      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, letterSpacing: 2, marginBottom: 8 }}>عن المنصة</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: "0 0 16px" }}>منصة المساجد</h2>
            <p style={{ fontSize: 15, lineHeight: 2, color: T.text2 }}>
              منصة وطنية شاملة لإدارة المساجد وخدمة المصلين في المملكة العربية السعودية. تهدف المنصة إلى تحسين تجربة المصلين من خلال توفير معلومات دقيقة عن المساجد ومواقيت الصلاة، وتسهيل التبرعات لمشاريع بيوت الله، وتمكين المواطنين من المشاركة في تحسين خدمات المساجد عبر نظام البلاغات والتقييم.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[{ n: "+١٢,٠٠٠", l: "مسجد" }, { n: "+٣٠٠", l: "مدينة" }, { n: "٢٤/٧", l: "خدمة" }].map((s, i) => (
                <div key={i} style={{ padding: "14px 20px", background: T.emeraldLight, borderRadius: 12, textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: T.emerald }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>الأسئلة الشائعة</h3>
            {faqs.map((f, i) => (
              <div key={i} style={{ marginBottom: 8, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "14px 16px", border: "none", background: openFaq === i ? T.emeraldLight : "#fafaf8", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600, color: T.text, textAlign: "right" }}>
                  {f.q}<span style={{ fontSize: 16, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▼</span>
                </button>
                {openFaq === i && <div style={{ padding: "12px 16px", fontSize: 13.5, lineHeight: 1.8, color: T.text2, background: T.white }}>{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: T.emeraldDark, color: "rgba(255,255,255,.7)", padding: "50px 48px 30px", position: "relative" }}>
      <IslamicPattern opacity={0.04} color="#fff" />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg, ${T.emerald}, ${T.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🕌</div>
              <span style={{ color: T.white, fontSize: 17, fontWeight: 800 }}>منصة المساجد</span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.9, maxWidth: 340 }}>
              منصة وطنية لإدارة المساجد وخدمة المصلين في المملكة العربية السعودية
            </p>
          </div>
          <div>
            <h4 style={{ color: T.white, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>روابط سريعة</h4>
            {["الرئيسية","المساجد","مواقيت الصلاة","التبرعات","بلاغ / تقييم"].map(l => (
              <div key={l} style={{ fontSize: 13, marginBottom: 10, cursor: "pointer", transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color = T.goldSoft}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.7)"}
              >{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: T.white, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>المراجع</h4>
            {["وزارة الشؤون الإسلامية","تقويم أم القرى","الهيئة العامة للأوقاف","منصة إحسان"].map(l => (
              <div key={l} style={{ fontSize: 13, marginBottom: 10 }}>{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: T.white, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>تواصل معنا</h4>
            <div style={{ fontSize: 13, marginBottom: 10 }}>📧 info@masajid.sa</div>
            <div style={{ fontSize: 13, marginBottom: 10 }}>📞 920-XXXX-XX</div>
            <div style={{ fontSize: 13 }}>📍 الرياض، المملكة العربية السعودية</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 20, textAlign: "center", fontSize: 12.5, color: "rgba(255,255,255,.4)" }}>
          © ٢٠٢٦ منصة المساجد — جميع الحقوق محفوظة · MVP Demo
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════
   MAIN APP
   ══════════════════════════════════ */
export default function PublicWebsite() {
  const [page, setPage] = useState("home");
  const [toastMsg, setToastMsg] = useState(null);

  const refs = { home: useRef(), prayers: useRef(), mosques: useRef(), donate: useRef(), complaint: useRef() };

  const scrollTo = (id) => {
    setPage(id);
    setTimeout(() => refs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif", background: T.bg, color: T.text, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0 } html { scroll-behavior: smooth }
        ::selection { background: ${T.emeraldLight}; color: ${T.emeraldDark} }
        ::-webkit-scrollbar { width:7px } ::-webkit-scrollbar-track { background:${T.bg} } ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:4px }
        input::placeholder, textarea::placeholder { color: ${T.text3} }
        @media (max-width: 768px) {
          .section-mosques, .section-prayers, .section-donate, .section-complaint, .section-about { padding-left: 16px !important; padding-right: 16px !important; }
          .mosque-grid { grid-template-columns: 1fr !important; }
          .mosque-modal-grid { grid-template-columns: 1fr !important; }
          .prayer-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .nav-links { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .hero-section { padding-left: 20px !important; padding-right: 20px !important; }
          .hero-content { grid-template-columns: 1fr !important; text-align: center; }
          .hero-stats { justify-content: center; }
          .donate-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .city-filters { gap: 4px !important; }
        }
        @media (max-width: 480px) {
          .prayer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <Navbar active={page} onNav={scrollTo} />

      <div ref={refs.home}><HeroSection onNav={scrollTo} /></div>
      <div ref={refs.prayers}><PrayerTimesSection /></div>
      <AdhanPlayerSection />
      <div ref={refs.mosques}>
        <MosquesSection toast={msg => setToastMsg(msg)} />
      </div>
      <div ref={refs.donate}><DonationsSection toast={msg => setToastMsg(msg)} /></div>
      <div ref={refs.complaint}><ComplaintSection toast={msg => setToastMsg(msg)} /></div>
      <AboutSection />
      <Footer />

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
