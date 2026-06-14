import { useState, useEffect, useRef } from "react";
import { LANGUAGES, RTL_LANGS, translations } from "../i18n";

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
  { id: 1, name: "جامع الراجحي", city: "الرياض", district: "حي النسيم", type: "جامع", capacity: 3500, currentOccupancy: 1247, services: ["الجمعة","الجنائز","العيد","التحفيظ","مصلى نساء","دروس نساء","حلقات تحفيظ نساء"], rating: 4.8, reviews: 234, imam: "الشيخ عبدالله المحمد" },
  { id: 2, name: "مسجد الفرقان", city: "الرياض", district: "حي الملز", type: "مسجد", capacity: 800, currentOccupancy: 312, services: ["الجمعة","التحفيظ"], rating: 4.5, reviews: 89, imam: "الشيخ خالد العتيبي" },
  { id: 3, name: "جامع الملك فهد", city: "جدة", district: "حي الحمراء", type: "جامع", capacity: 5000, currentOccupancy: 2834, services: ["الجمعة","الجنائز","العيد","التحفيظ","المحاضرات","مصلى نساء","حلقات تحفيظ نساء"], rating: 4.9, reviews: 512, imam: "الشيخ سعد الغامدي" },
  { id: 4, name: "مسجد الإيمان", city: "مكة المكرمة", district: "حي العزيزية", type: "مسجد", capacity: 1200, currentOccupancy: 456, services: ["الجمعة","التحفيظ","المحاضرات","مصلى نساء","دروس نساء"], rating: 4.6, reviews: 178, imam: "الشيخ أحمد الشهري" },
  { id: 5, name: "جامع البواردي", city: "الرياض", district: "حي العليا", type: "جامع", capacity: 2800, currentOccupancy: 891, services: ["الجمعة","الجنائز","العيد","مصلى نساء"], rating: 4.7, reviews: 301, imam: "الشيخ فهد القحطاني" },
  { id: 6, name: "مسجد النور", city: "المدينة المنورة", district: "حي قباء", type: "مسجد", capacity: 950, currentOccupancy: 523, services: ["الجمعة","التحفيظ","مصلى نساء","دروس نساء","حلقات تحفيظ نساء"], rating: 4.8, reviews: 145, imam: "الشيخ ياسر الحربي" },
  { id: 7, name: "مسجد التقوى", city: "الدمام", district: "حي الفيصلية", type: "مسجد", capacity: 700, currentOccupancy: 178, services: ["الجمعة","الدروس"], rating: 4.4, reviews: 67, imam: "الشيخ محمد الدوسري" },
  { id: 8, name: "جامع الأمير سلطان", city: "جدة", district: "حي الروضة", type: "جامع", capacity: 4200, currentOccupancy: 1965, services: ["الجمعة","الجنائز","العيد","التحفيظ","المحاضرات","مصلى نساء","دروس نساء","حلقات تحفيظ نساء"], rating: 4.9, reviews: 478, imam: "الشيخ ماجد الزهراني" },
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
const getComplaintTypes = (t) => [
  t("complaintType.loudSound"), t("complaintType.lowSound"), t("complaintType.soundInterference"),
  t("complaintType.cleanliness"), t("complaintType.maintenance"), t("complaintType.airConditioning"),
  t("complaintType.lighting"), t("complaintType.overcrowding"), t("complaintType.other"),
];

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
  const map = { green: [T.emeraldLight, T.emerald], gold: [T.goldLight, T.gold], gray: ["#f0eeea", T.text2], red: [T.dangerLight, T.danger], blue: ["#e7f1f8", "#1d6fa5"], purple: ["#f3e8f9", "#7c3aed"] };
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
function Navbar({ active, onNav, t, lang, setLang, isRTL }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const links = [
    { id: "home", label: t("nav.home") },
    { id: "mosques", label: t("nav.mosques") },
    { id: "prayers", label: t("nav.prayers") },
    { id: "donate", label: t("nav.donate") },
    { id: "complaint", label: t("nav.complaint") },
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
        <span style={{ fontSize: 18, fontWeight: 800, color: T.emeraldDark }}>{t("nav.platform")}</span>
      </div>
      {/* Language switcher */}
      <div style={{ position: "relative" }}>
        <button onClick={() => setLangOpen(!langOpen)} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 10, border: `1px solid ${T.border}`,
          background: T.white, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: T.text2,
        }}>
          <span>{LANGUAGES.find(l => l.code === lang)?.flag}</span>
          <span>{LANGUAGES.find(l => l.code === lang)?.name}</span>
          <span style={{ fontSize: 10 }}>▼</span>
        </button>
        {langOpen && (
          <div style={{
            position: "absolute", top: "100%", marginTop: 4, [isRTL ? "right" : "left"]: 0,
            background: T.white, borderRadius: 12, border: `1px solid ${T.border}`,
            boxShadow: T.shadowLg, overflow: "hidden", zIndex: 200, minWidth: 160,
          }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                style={{
                  width: "100%", padding: "10px 16px", border: "none",
                  background: l.code === lang ? T.emeraldLight : "transparent",
                  display: "flex", alignItems: "center", gap: 10,
                  cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                  color: l.code === lang ? T.emerald : T.text, fontWeight: l.code === lang ? 700 : 500,
                  textAlign: isRTL ? "right" : "left",
                }}>
                <span>{l.flag}</span>
                <span>{l.name}</span>
                {l.code === lang && <span style={{ marginInlineStart: "auto", fontSize: 11, color: T.emerald }}>✓</span>}
              </button>
            ))}
          </div>
        )}
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
              padding: "14px 16px", borderRadius: 10, border: "none", textAlign: isRTL ? "right" : "left",
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

function HeroSection({ onNav, t }) {
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
        <div style={{ fontSize: 13, fontWeight: 600, color: T.goldSoft, letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>{t("hero.bismillah")}</div>
        <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.3, margin: "0 0 16px", textShadow: "0 2px 20px rgba(0,0,0,.15)" }}>
          {t("hero.title")}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.8, color: "rgba(255,255,255,.8)", margin: "0 0 36px", maxWidth: 550, marginInline: "auto" }}>
          {t("hero.subtitle")}
        </p>

        <div style={{
          display: "flex", gap: 0, background: "rgba(255,255,255,.15)", borderRadius: 16,
          padding: 6, maxWidth: 520, margin: "0 auto", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,.2)",
        }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t("hero.searchPlaceholder")}
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
          >{t("hero.search")}</button>
        </div>

        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 40 }}>
          {[
            { n: t("hero.stat1"), l: t("hero.stat1Label") },
            { n: t("hero.stat2"), l: t("hero.stat2Label") },
            { n: t("hero.stat3"), l: t("hero.stat3Label") },
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

function PrayerTimesSection({ t }) {
  const [city, setCity] = useState("الرياض");
  const [now, setNow] = useState(new Date());
  const times = PRAYER_DATA[city];
  const times24 = PRAYER_24H[city];

  // Live clock — updates every second
  useEffect(() => {
    const ti = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(ti);
  }, []);

  const labels = [
    { key: "fajr", name: t("prayer.fajr"), icon: "🌙" },
    { key: "sunrise", name: t("prayer.sunrise"), icon: "🌅" },
    { key: "dhuhr", name: t("prayer.dhuhr"), icon: "☀️" },
    { key: "asr", name: t("prayer.asr"), icon: "🌤️" },
    { key: "maghrib", name: t("prayer.maghrib"), icon: "🌇" },
    { key: "isha", name: t("prayer.isha"), icon: "🌃" },
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
          <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, letterSpacing: 2, marginBottom: 8 }}>{t("prayer.source")}</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, margin: "0 0 12px" }}>{t("prayer.title")}</h2>
          <p style={{ color: T.text2, fontSize: 15 }}>{t("prayer.subtitle")}</p>

          {/* Live clock */}
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 14, background: T.cream, borderRadius: 16, padding: "12px 28px", border: `1px solid ${T.border}` }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: T.text3, marginBottom: 2 }}>{t("prayer.now")}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.text, fontVariantNumeric: "tabular-nums", direction: "ltr" }}>{currentTime}</div>
            </div>
            <div style={{ width: 1, height: 40, background: T.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: T.text3, marginBottom: 2 }}>{t("prayer.next")}: {labels[nextIdx].name}</div>
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
                {isHighlight && <div style={{ fontSize: 11, marginTop: 8, opacity: .85, fontWeight: 600, background: "rgba(255,255,255,.15)", borderRadius: 10, padding: "3px 10px", display: "inline-block" }}>{t("prayer.nextLabel")}</div>}
                {isPast && !isHighlight && <div style={{ fontSize: 11, marginTop: 6, opacity: .6 }}>{t("prayer.done")}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const AZAN_VOICES = [
  { id: 1, name: "مشاري العفاسي", src: "https://cdn.aladhan.com/audio/adhans/a9.mp3" },
  { id: 2, name: "أحمد النفيس", src: "https://cdn.aladhan.com/audio/adhans/a1.mp3" },
  { id: 3, name: "حافظ مصطفى أوزجان", src: "https://cdn.aladhan.com/audio/adhans/a2.mp3" },
  { id: 4, name: "العفاسي — دبي ون", src: "https://cdn.aladhan.com/audio/adhans/a4.mp3" },
  { id: 5, name: "منصور الزهراني", src: "https://cdn.aladhan.com/audio/adhans/a11-mansour-al-zahrani.mp3" },
];

function AdhanPlayerSection({ t }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [now, setNow] = useState(new Date());
  const audioRef = useRef(null);
  const triggeredRef = useRef({});

  const prayerNames = { fajr: t("prayer.fajr"), dhuhr: t("prayer.dhuhr"), asr: t("prayer.asr"), maghrib: t("prayer.maghrib"), isha: t("prayer.isha") };

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
      if (h === ph && m === pm && s < 3 && !triggeredRef.current[key] && !isPlaying) {
        triggeredRef.current[key] = true;
        setCurrentPrayer(p);
        startAdhan();
        setTimeout(() => { delete triggeredRef.current[key]; }, 120000);
        break;
      }
    }
  }, [now, enabled, muted, isPlaying]);

  const startAdhan = () => {
    if (isPlaying) return;
    stopAdhan();
    const audio = new Audio(AZAN_VOICES[selectedVoice].src);
    audioRef.current = audio;
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
      setCurrentPrayer(null);
      audioRef.current = null;
    });
    audio.play().then(() => {
      setIsPlaying(true);
      setProgress(0);
    }).catch(() => {});
  };

  const stopAdhan = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setCurrentPrayer(null);
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

  const formatTime = (sec) => {
    if (!sec || !isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

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
                <div style={{ fontSize: 18, fontWeight: 800, color: T.white }}>{t("adhan.playingNow")} {currentPrayer ? prayerNames[currentPrayer] : ""}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 2 }}>{AZAN_VOICES[selectedVoice].name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, fontSize: 11, color: "rgba(255,255,255,.4)" }}>
                  <span>{formatTime(audioRef.current ? audioRef.current.currentTime : 0)}</span>
                  <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,.1)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${T.gold}, ${T.goldSoft})`, borderRadius: 2, transition: "width .3s" }} />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              <button onClick={stopAdhan} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "none", color: T.white, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⏹</button>
            </div>
          </div>
        )}

        {/* Main controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.goldSoft, letterSpacing: 2, marginBottom: 6 }}>{t("adhan.system")}</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: "0 0 6px" }}>
              {isPlaying ? t("adhan.playing") : `${t("adhan.nextAdhan")} ${prayerNames[nextPrayer]}`}
            </h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", margin: 0 }}>
              {isPlaying
                ? AZAN_VOICES[selectedVoice].name
                : `${minUntilNext >= 60 ? Math.floor(minUntilNext / 60) + " " + t("adhan.hoursAnd") + " " : ""}${minUntilNext % 60} ${t("adhan.minutes")}`
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
                {t("adhan.enable")}
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setMuted(!muted)} style={{
                  padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${muted ? "rgba(255,255,255,.2)" : T.goldSoft}`,
                  background: muted ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.1)",
                  color: T.white, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {muted ? t("adhan.muted") : t("adhan.active")}
                </button>
                {!isPlaying && (
                  <button onClick={() => { setCurrentPrayer(nextPrayer); startAdhan(); }} style={{
                    padding: "10px 20px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,.15)",
                    background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.6)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {t("adhan.test")}
                  </button>
                )}
              </div>
            )}
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: enabled && !muted ? "#4ade80" : "rgba(255,255,255,.2)", display: "inline-block" }} />
              {!enabled ? t("adhan.pressToEnable") : muted ? t("adhan.isMuted") : t("adhan.autoPlay")}
            </div>
          </div>
        </div>

        {/* Voice selector */}
        <div style={{ marginTop: 20, position: "relative" }}>
          <div
            onClick={() => setShowVoiceSelector(!showVoiceSelector)}
            style={{ padding: "14px 20px", borderRadius: 14, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎵</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.white }}>{AZAN_VOICES[selectedVoice].name}</div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.4)" }}>{t("adhan.selectedMuezzin")}</div>
            </div>
            <div style={{ fontSize: 11, color: T.goldSoft, fontWeight: 600, padding: "4px 12px", borderRadius: 8, background: "rgba(184,148,42,.12)" }}>
              {showVoiceSelector ? "▲" : "▼"} {t("adhan.choose")}
            </div>
          </div>

          {showVoiceSelector && (
            <div style={{ position: "absolute", top: "100%", right: 0, left: 0, marginTop: 6, background: "#0a3d2e", borderRadius: 14, border: "1px solid rgba(255,255,255,.1)", overflow: "hidden", zIndex: 10 }}>
              {AZAN_VOICES.map((voice, idx) => (
                <div
                  key={voice.id}
                  onClick={() => { setSelectedVoice(idx); setShowVoiceSelector(false); }}
                  style={{
                    padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                    background: idx === selectedVoice ? "rgba(184,148,42,.15)" : "transparent",
                    borderBottom: idx < AZAN_VOICES.length - 1 ? "1px solid rgba(255,255,255,.06)" : "none",
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: idx === selectedVoice ? `linear-gradient(135deg, ${T.gold}, #d4a730)` : "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: T.white, fontWeight: 700 }}>{voice.id}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: idx === selectedVoice ? 700 : 500, color: idx === selectedVoice ? T.goldSoft : "rgba(255,255,255,.7)" }}>{voice.name}</div>
                  {idx === selectedVoice && <div style={{ fontSize: 11, color: T.goldSoft }}>{t("adhan.selected")}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.85} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </section>
  );
}

/* ══════════════════════════════════
   QIBLA COMPASS SECTION
   ══════════════════════════════════ */
function QiblaSection({ t }) {
  const KAABA = { lat: 21.4225, lng: 39.8262 };
  const CITY_COORDS = {
    "الرياض": { lat: 24.7136, lng: 46.6753 },
    "جدة": { lat: 21.5433, lng: 39.1728 },
    "مكة المكرمة": { lat: 21.4225, lng: 39.8262 },
    "المدينة المنورة": { lat: 24.4672, lng: 39.6112 },
    "الدمام": { lat: 26.3927, lng: 49.9777 },
  };

  const [city, setCity] = useState("الرياض");
  const [deviceHeading, setDeviceHeading] = useState(null);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [compassSupported, setCompassSupported] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;

  const calcQibla = (lat, lng) => {
    const φ1 = toRad(lat);
    const φ2 = toRad(KAABA.lat);
    const Δλ = toRad(KAABA.lng - lng);
    const x = Math.sin(Δλ) * Math.cos(φ2);
    const y = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    let bearing = toDeg(Math.atan2(x, y));
    return ((bearing % 360) + 360) % 360;
  };

  const calcDistance = (lat, lng) => {
    const R = 6371;
    const φ1 = toRad(lat);
    const φ2 = toRad(KAABA.lat);
    const Δφ = toRad(KAABA.lat - lat);
    const Δλ = toRad(KAABA.lng - lng);
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const activeLat = userLat !== null ? userLat : CITY_COORDS[city].lat;
  const activeLng = userLng !== null ? userLng : CITY_COORDS[city].lng;
  const qiblaAngle = calcQibla(activeLat, activeLng);
  const distance = calcDistance(activeLat, activeLng);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); },
        () => {}
      );
    }
  }, []);

  const requestCompass = () => {
    setPermissionRequested(true);
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().then((perm) => {
        if (perm === "granted") startCompass();
      }).catch(() => {});
    } else {
      startCompass();
    }
  };

  const startCompass = () => {
    window.addEventListener("deviceorientation", (e) => {
      const heading = e.webkitCompassHeading !== undefined ? e.webkitCompassHeading : e.alpha !== null ? (360 - e.alpha) : null;
      if (heading !== null) { setDeviceHeading(heading); setCompassSupported(true); }
    });
  };

  useEffect(() => {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission !== "function") {
      startCompass();
    }
  }, []);

  const compassRotation = deviceHeading !== null ? -deviceHeading : 0;
  const needleRotation = qiblaAngle;

  const cardinals = [
    { angle: 0, label: t("qibla.north") },
    { angle: 90, label: t("qibla.east") },
    { angle: 180, label: t("qibla.south") },
    { angle: 270, label: t("qibla.west") },
  ];

  return (
    <section style={{ padding: "70px 48px", background: T.cream, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03, pointerEvents: "none" }}>
        <IslamicPattern />
      </div>
      <style>{`
        @keyframes qibla-pulse {
          0%,100%{filter:drop-shadow(0 0 6px rgba(12,107,78,.3))}
          50%{filter:drop-shadow(0 0 14px rgba(12,107,78,.5))}
        }
      `}</style>
      <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
        <span style={{ background: T.goldLight, color: T.gold, padding: "6px 20px", borderRadius: 20, fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 12 }}>{t("qibla.badge")}</span>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, margin: 0 }}>{t("qibla.title")}</h2>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
        <div style={{ background: T.card, borderRadius: 24, padding: 40, boxShadow: T.shadowLg, textAlign: "center" }}>
          <svg width="280" height="280" viewBox="0 0 280 280" style={{ display: "block", margin: "0 auto 24px" }}>
            <defs>
              <linearGradient id="qibla-arrow-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.emerald} />
                <stop offset="100%" stopColor={T.emeraldDark} />
              </linearGradient>
            </defs>
            <g transform={`rotate(${compassRotation} 140 140)`}>
              <circle cx="140" cy="140" r="130" fill="none" stroke={T.border} strokeWidth="2" />
              <circle cx="140" cy="140" r="126" fill="none" stroke={T.gold} strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="140" cy="140" r="120" fill={T.cream} />

              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30;
                const rad = toRad(angle - 90);
                const x1 = 140 + 118 * Math.cos(rad);
                const y1 = 140 + 118 * Math.sin(rad);
                const x2 = 140 + 110 * Math.cos(rad);
                const y2 = 140 + 110 * Math.sin(rad);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.text3} strokeWidth={i % 3 === 0 ? 2 : 1} />;
              })}

              {cardinals.map((c) => {
                const rad = toRad(c.angle - 90);
                const x = 140 + 100 * Math.cos(rad);
                const y = 140 + 100 * Math.sin(rad);
                return <text key={c.label} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="700" fill={c.angle === 0 ? T.danger : T.text2}>{c.label}</text>;
              })}

              <g transform={`rotate(${needleRotation} 140 140)`} style={{ animation: "qibla-pulse 2s ease-in-out infinite" }}>
                <line x1="140" y1="140" x2="140" y2="36" stroke="url(#qibla-arrow-grad)" strokeWidth="3" strokeLinecap="round" />
                <polygon points="140,28 134,48 146,48" fill={T.emerald} />
                <text x="140" y="22" textAnchor="middle" fontSize="16">🕋</text>
              </g>

              <circle cx="140" cy="140" r="6" fill={T.gold} />
              <circle cx="140" cy="140" r="3" fill={T.white} />
            </g>
          </svg>

          <div style={{ fontSize: 22, fontWeight: 700, color: T.emerald, marginBottom: 8 }}>
            {t("qibla.direction")} {qiblaAngle.toFixed(1)}°
          </div>

          <div style={{ fontSize: 14, color: T.text2, marginBottom: 20 }}>
            {t("qibla.distance")} {distance.toFixed(0)} {t("qibla.km")}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            {compassSupported ? (
              <span style={{ background: T.emeraldLight, color: T.emerald, padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{t("qibla.deviceCompass")}</span>
            ) : (
              <span style={{ background: T.goldLight, color: T.gold, padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{t("qibla.cityBased")}</span>
            )}
          </div>

          {compassSupported && deviceHeading !== null && (
            <div style={{ fontSize: 13, color: T.text3, marginBottom: 16 }}>{t("qibla.moveDevice")}</div>
          )}

          {!compassSupported && !permissionRequested && typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function" && (
            <button onClick={requestCompass} style={{ background: T.emerald, color: T.white, border: "none", padding: "10px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>
              {t("qibla.enableCompass")}
            </button>
          )}

          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 13, color: T.text2, marginLeft: 8 }}>{t("qibla.city")}</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, background: T.white, cursor: "pointer", direction: "rtl" }}>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

function MosquesSection({ toast, t }) {
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
          <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, margin: "0 0 10px" }}>{t("mosques.title")}</h2>
          <p style={{ color: T.text2, fontSize: 15 }}>{t("mosques.subtitle")}</p>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: 340, maxWidth: "100%" }}>
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: T.text3 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("mosques.searchPlaceholder")}
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
              }}>{c === "الكل" ? t("mosques.all") : c}</button>
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
                <span style={{ fontSize: 12, color: T.text3 }}>({m.reviews} {t("mosques.review")})</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {m.services.slice(0, 5).map((s, i) => {
                  const isWomen = s.includes("نساء");
                  return <span key={i} style={{ padding: "3px 10px", borderRadius: 6, background: isWomen ? "#f3e8f9" : T.cream, fontSize: 11.5, color: isWomen ? "#7c3aed" : T.text2, fontWeight: 500 }}>{s}</span>;
                })}
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "8px 12px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "occPulse 2s infinite" }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#15803d" }}>{m.currentOccupancy}</span>
                  <span style={{ fontSize: 11.5, color: "#4ade80" }}>/ {m.capacity}</span>
                  <span style={{ fontSize: 11, color: "#86efac", marginRight: "auto" }}>{t("mosques.prayersNow")}</span>
                  <div style={{ width: 50, height: 6, background: "#dcfce7", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${Math.round(m.currentOccupancy / m.capacity * 100)}%`, height: "100%", background: m.currentOccupancy / m.capacity > 0.8 ? "#f97316" : "#22c55e", borderRadius: 3, transition: "width .3s" }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: T.text3 }}>
                  <span>👤 {m.imam}</span>
                  <span style={{ fontSize: 10, color: T.text3, display: "flex", alignItems: "center", gap: 4 }}>📷 <span style={{ opacity: 0.6 }}>{t("mosques.smartCamera")}</span></span>
                </div>
              </div>
              <button onClick={() => setSelectedMosque(m)} style={{
                marginTop: "auto", width: "100%", padding: "12px 20px", borderRadius: 12, border: "none",
                background: T.emerald, color: T.white, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = T.emeraldDark; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.emerald; }}
              >{t("mosques.viewDetails")}</button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: T.text3 }}><div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div><div style={{ fontSize: 15 }}>{t("mosques.noResults")}</div></div>}
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
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>({selectedMosque.reviews} {t("mosques.review")})</span>
                </div>
              </div>
            </div>
            {/* Body */}
            <div style={{ padding: 28 }}>
              <div className="mosque-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: T.text }}>{t("mosques.data")}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px 14px", fontSize: 14 }}>
                    {[[t("mosques.currentlyPresent"), `${selectedMosque.currentOccupancy} ${t("mosques.worshipper")}`], [t("mosques.imam"), selectedMosque.imam], [t("mosques.capacity"), `${selectedMosque.capacity} ${t("mosques.worshipper")}`], [t("mosques.occupancy"), `${Math.round(selectedMosque.currentOccupancy / selectedMosque.capacity * 100)}%`], [t("mosques.cityLabel"), selectedMosque.city], [t("mosques.district"), selectedMosque.district], [t("mosques.type"), selectedMosque.type]].map(([l, v], i) => (
                      <div key={i} style={{ display: "contents" }}><span style={{ color: T.text2, fontWeight: 600 }}>{l}</span><span style={{ color: T.text }}>{v}</span></div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: T.text }}>{t("mosques.services")}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedMosque.services.map((s, i) => <Badge key={i} text={s} color={s.includes("نساء") ? "purple" : "green"} />)}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: "24px 0 16px", color: T.text }}>{t("mosques.rating")}</h3>
                  <RatingForm mosque={selectedMosque} toast={toast} t={t} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: "24px 0 12px", color: T.text }}>{t("mosques.location")}</h3>
                  <div style={{ height: 140, borderRadius: 14, background: `linear-gradient(135deg, ${T.emeraldLight}, #e7f1f8)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 30 }}>📍</div>
                      <div style={{ fontSize: 13, color: T.text2, marginTop: 4 }}>{selectedMosque.city} — {selectedMosque.district}</div>
                      <div style={{ fontSize: 11, color: T.emerald, marginTop: 3, fontWeight: 600 }}>{t("mosques.mapFull")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(20px) scale(.96) } to { opacity:1; transform:none } } @keyframes occPulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
          </div>
        </div>
      )}
    </section>
  );
}

function RatingForm({ mosque, toast, t }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <div style={{ padding: 16, background: T.emeraldLight, borderRadius: 12, textAlign: "center", fontSize: 14, color: T.emerald, fontWeight: 600 }}>{t("rating.thanks")} ⭐ {rating}/5</div>;
  return (
    <div style={{ padding: 16, background: "#fafaf8", borderRadius: 14, border: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
        {[1,2,3,4,5].map(s => (
          <span key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
            style={{ fontSize: 28, cursor: "pointer", color: s <= (hover || rating) ? T.gold : T.border, transition: "color .15s" }}>★</span>
        ))}
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder={t("rating.placeholder")} rows={2}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 10 }} />
      <button onClick={() => { if (rating) { setSubmitted(true); toast(t("rating.toast")); }}}
        disabled={!rating} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: rating ? T.emerald : T.border, color: T.white, fontSize: 14, fontWeight: 600, cursor: rating ? "pointer" : "default", fontFamily: "inherit" }}>{t("rating.submit")}</button>
    </div>
  );
}

function DonationsSection({ toast, t }) {
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
          <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, letterSpacing: 2, marginBottom: 8 }}>{t("donate.badge")}</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, margin: "0 0 10px" }}>{t("donate.title")}</h2>
          <p style={{ color: T.text2, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>{t("donate.subtitle")}</p>
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
                  <span>{(p.collected / 1e3).toFixed(0)} {t("donate.thousand")} {t("donate.of")} {(p.target / 1e3).toFixed(0)} {t("donate.thousand")}</span>
                </div>
                <div style={{ fontSize: 12, color: T.text3, marginBottom: 16 }}>{p.donors} {t("donate.donors")}</div>
                <button onClick={() => setDonateModal(p)} style={{
                  width: "100%", padding: "13px 20px", borderRadius: 12, border: "none",
                  background: T.emerald, color: T.white, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.emeraldDark; e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.emerald; e.currentTarget.style.transform = "scale(1)"; }}
                >{t("donate.donateNow")}</button>
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
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.7)", margin: 0 }}>{t("donate.remaining")} {((donateModal.target - donateModal.collected) / 1e3).toFixed(0)} {t("donate.thousand")} {t("donate.sar")}</p>
              </div>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{t("donate.amount")}</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={t("donate.enterAmount")}
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
                {t("donate.demoWarning")}
              </div>
              <button onClick={donate} disabled={!amount}
                style={{
                  width: "100%", padding: "15px", borderRadius: 14, border: "none",
                  background: amount ? T.emerald : T.border, color: T.white,
                  fontSize: 17, fontWeight: 700, cursor: amount ? "pointer" : "default",
                  fontFamily: "inherit", transition: "all .15s",
                }}>
                {t("donate.confirm")} {amount && `— ${Number(amount).toLocaleString()} ${t("donate.sar")}`}
              </button>
              <button onClick={() => setDonateModal(null)} style={{ width: "100%", padding: "12px", border: "none", background: "transparent", color: T.text2, fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>{t("donate.cancel")}</button>
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
            <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>{t("donate.jazak")}</h3>
            <p style={{ color: T.text2, fontSize: 14, margin: "0 0 20px" }}>{t("donate.success")}</p>
            <div style={{ background: "#fafaf8", borderRadius: 14, padding: 20, textAlign: "right", border: `1px solid ${T.border}`, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "10px 12px", fontSize: 14 }}>
                <span style={{ color: T.text2, fontWeight: 600 }}>{t("donate.project")}</span><span style={{ fontWeight: 600 }}>{receipt.project}</span>
                <span style={{ color: T.text2, fontWeight: 600 }}>{t("donate.amountLabel")}</span><span style={{ fontWeight: 700, color: T.emerald }}>{receipt.amount.toLocaleString()} {t("donate.sar")}</span>
                <span style={{ color: T.text2, fontWeight: 600 }}>{t("donate.refNum")}</span><span style={{ fontWeight: 600, color: T.emerald }}>{receipt.ref}</span>
                <span style={{ color: T.text2, fontWeight: 600 }}>{t("donate.date")}</span><span>{receipt.date}</span>
              </div>
            </div>
            <div style={{ padding: 10, background: T.goldLight, borderRadius: 10, fontSize: 12, color: T.gold, marginBottom: 16 }}>{t("donate.pdfNote")}</div>
            <button onClick={() => setReceipt(null)} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: T.emerald, color: T.white, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t("donate.close")}</button>
            <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(20px) scale(.96) } to { opacity:1; transform:none } }`}</style>
          </div>
        </div>
      )}
    </section>
  );
}

function ComplaintSection({ toast, t }) {
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
    toast(t("complaint.toast"));
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
          <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, margin: "0 0 10px" }}>{t("complaint.title")}</h2>
          <p style={{ color: T.text2, fontSize: 15 }}>{t("complaint.subtitle")}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 20 }}>
          {[{ id: "new", label: t("complaint.new") }, { id: "track", label: t("complaint.track") }].map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: tab === tb.id ? T.emerald : T.white, color: tab === tb.id ? T.white : T.text2, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: tab !== tb.id ? "0 1px 4px rgba(0,0,0,.05)" : "none" }}>{tb.label}</button>
          ))}
        </div>
        <div style={{ background: T.white, borderRadius: 22, padding: 36, border: `1px solid ${T.border}`, boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
          {tab === "track" ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>{t("complaint.refLabel")}</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <input value={trackId} onChange={e => setTrackId(e.target.value)} placeholder="SH-XXXX" style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 16, fontFamily: "inherit", outline: "none", textAlign: "center", fontWeight: 600, boxSizing: "border-box" }} />
                  <button onClick={track} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: T.emerald, color: T.white, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t("complaint.searchBtn")}</button>
                </div>
              </div>
              {trackResult && (
                <div style={{ marginTop: 20, padding: 20, background: "#fafaf8", borderRadius: 14, border: `1px solid ${T.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: T.emerald }}>{trackResult.id}</span>
                    <Badge text={trackResult.status} color="orange" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "8px 12px", fontSize: 13.5, marginBottom: 16 }}>
                    <span style={{ color: T.text2, fontWeight: 600 }}>{t("complaint.mosque")}</span><span>{trackResult.mosque}</span>
                    <span style={{ color: T.text2, fontWeight: 600 }}>{t("complaint.typeLabel")}</span><span>{trackResult.type}</span>
                    <span style={{ color: T.text2, fontWeight: 600 }}>{t("complaint.dateLabel")}</span><span>{trackResult.date}</span>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>{t("complaint.history")}</div>
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
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{t("complaint.submitted")}</h3>
              <p style={{ color: T.text2, fontSize: 15 }}>{t("complaint.thanks")}</p>
              <div style={{ marginTop: 16, padding: 14, background: T.emeraldLight, borderRadius: 12, fontSize: 16, color: T.emerald, fontWeight: 700 }}>{t("complaint.refDisplay")} {refNum}</div>
              <p style={{ fontSize: 13, color: T.text3, marginTop: 10 }}>{t("complaint.keepRef")}</p>
              <button onClick={reset} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, border: `1.5px solid ${T.emerald}`, background: "transparent", color: T.emerald, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t("complaint.another")}</button>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>{t("complaint.mosqueLabel")} <span style={{ color: T.danger }}>*</span></label><select value={form.mosque} onChange={e => setForm(p => ({ ...p, mosque: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: T.white, appearance: "auto", boxSizing: "border-box" }}><option value="">{t("complaint.chooseMosque")}</option>{MOSQUES.map(m => <option key={m.id} value={m.name}>{m.name} — {m.city}</option>)}</select></div>
                <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>{t("complaint.typeSelect")} <span style={{ color: T.danger }}>*</span></label><select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: T.white, appearance: "auto", boxSizing: "border-box" }}><option value="">{t("complaint.chooseType")}</option>{getComplaintTypes(t).map(ct => <option key={ct} value={ct}>{ct}</option>)}</select></div>
              </div>
              <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>{t("complaint.descLabel")} <span style={{ color: T.danger }}>*</span></label><textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} rows={4} placeholder={t("complaint.descPlaceholder")} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>{t("complaint.nameLabel")}</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t("complaint.namePlaceholder")} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} /></div>
                <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>{t("complaint.phoneLabel")}</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="05XXXXXXXX" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} /></div>
              </div>
              <button onClick={submit} disabled={!form.mosque || !form.type || !form.desc} style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: (form.mosque && form.type && form.desc) ? T.emerald : T.border, color: T.white, fontSize: 16, fontWeight: 700, cursor: (form.mosque && form.type && form.desc) ? "pointer" : "default", fontFamily: "inherit", marginTop: 4 }}>{t("complaint.submitBtn")}</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ t }) {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { q: t("about.faq1q"), a: t("about.faq1a") },
    { q: t("about.faq2q"), a: t("about.faq2a") },
    { q: t("about.faq3q"), a: t("about.faq3a") },
    { q: t("about.faq4q"), a: t("about.faq4a") },
    { q: t("about.faq5q"), a: t("about.faq5a") },
  ];
  return (
    <section style={{ padding: "70px 48px", background: T.white, position: "relative" }} className="section-about">
      <IslamicPattern opacity={0.02} />
      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, letterSpacing: 2, marginBottom: 8 }}>{t("about.badge")}</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: "0 0 16px" }}>{t("about.title")}</h2>
            <p style={{ fontSize: 15, lineHeight: 2, color: T.text2 }}>
              {t("about.desc")}
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[{ n: "+١٢,٠٠٠", l: t("about.statMosque") }, { n: "+٣٠٠", l: t("about.statCity") }, { n: "٢٤/٧", l: t("about.statService") }].map((s, i) => (
                <div key={i} style={{ padding: "14px 20px", background: T.emeraldLight, borderRadius: 12, textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: T.emerald }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{t("about.faqTitle")}</h3>
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

function Footer({ t }) {
  return (
    <footer style={{ background: T.emeraldDark, color: "rgba(255,255,255,.7)", padding: "50px 48px 30px", position: "relative" }}>
      <IslamicPattern opacity={0.04} color="#fff" />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg, ${T.emerald}, ${T.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🕌</div>
              <span style={{ color: T.white, fontSize: 17, fontWeight: 800 }}>{t("footer.platform")}</span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.9, maxWidth: 340 }}>
              {t("footer.desc")}
            </p>
          </div>
          <div>
            <h4 style={{ color: T.white, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{t("footer.quickLinks")}</h4>
            {[t("nav.home"), t("nav.mosques"), t("nav.prayers"), t("nav.donate"), t("nav.complaint")].map(l => (
              <div key={l} style={{ fontSize: 13, marginBottom: 10, cursor: "pointer", transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color = T.goldSoft}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.7)"}
              >{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: T.white, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{t("footer.references")}</h4>
            {[t("footer.ref1"), t("footer.ref2"), t("footer.ref3"), t("footer.ref4")].map(l => (
              <div key={l} style={{ fontSize: 13, marginBottom: 10 }}>{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: T.white, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{t("footer.contact")}</h4>
            <div style={{ fontSize: 13, marginBottom: 10 }}>📧 info@masajid.sa</div>
            <div style={{ fontSize: 13, marginBottom: 10 }}>📞 920-XXXX-XX</div>
            <div style={{ fontSize: 13 }}>📍 الرياض، المملكة العربية السعودية</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 20, textAlign: "center", fontSize: 12.5, color: "rgba(255,255,255,.4)" }}>
          {t("footer.copyright")}
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
  const [lang, setLang] = useState("ar");
  const t = (key) => translations[lang]?.[key] || translations.ar[key] || key;
  const isRTL = RTL_LANGS.includes(lang);
  const currentLang = LANGUAGES.find(l => l.code === lang);
  const dir = isRTL ? "rtl" : "ltr";

  const refs = { home: useRef(), prayers: useRef(), mosques: useRef(), donate: useRef(), complaint: useRef() };

  const scrollTo = (id) => {
    setPage(id);
    setTimeout(() => refs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <div dir={dir} style={{ fontFamily: `'${currentLang.font}', 'Noto Sans Arabic', sans-serif`, background: T.bg, color: T.text, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Inter:wght@400;500;700;800;900&family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Sans+SC:wght@400;500;700;900&display=swap');
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

      <Navbar active={page} onNav={scrollTo} t={t} lang={lang} setLang={setLang} isRTL={isRTL} />

      <div ref={refs.home}><HeroSection onNav={scrollTo} t={t} /></div>
      <div ref={refs.prayers}><PrayerTimesSection t={t} /></div>
      <AdhanPlayerSection t={t} />
      <QiblaSection t={t} />
      <div ref={refs.mosques}>
        <MosquesSection toast={msg => setToastMsg(msg)} t={t} />
      </div>
      <div ref={refs.donate}><DonationsSection toast={msg => setToastMsg(msg)} t={t} /></div>
      <div ref={refs.complaint}><ComplaintSection toast={msg => setToastMsg(msg)} t={t} /></div>
      <AboutSection t={t} />
      <Footer t={t} />

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
