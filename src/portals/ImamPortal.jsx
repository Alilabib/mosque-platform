import { useState, useEffect, useCallback } from "react";

/* ══════════════════════════════════
   DESIGN TOKENS — WARM, MOBILE-FIRST
   ══════════════════════════════════ */
const C = {
  bg: "#f7f5f0", card: "#ffffff", primary: "#0b6e52", primaryDark: "#064a36",
  primaryLight: "#e4f2ec", gold: "#b8942a", goldLight: "#fdf8eb", goldSoft: "#d4b44a",
  text: "#1a1a1a", text2: "#5a6870", text3: "#9aa4aa", border: "#e5e2db",
  borderL: "#efede8", danger: "#c0392b", dangerLight: "#fce8e5",
  warn: "#d97706", warnLight: "#fef5e0", info: "#1d6fa5", infoLight: "#e7f1f8",
  white: "#fff", shadow: "0 2px 12px rgba(0,0,0,.05)",
};

/* ══════════════════════════════════
   VERIFIED PRAYER TIMES — RIYADH, JUNE 8 2026
   Umm Al-Qura method
   ══════════════════════════════════ */
const PRAYERS = [
  { name: "الفجر", time: "٣:٣٢", iqama: "٣:٥٢", icon: "🌙", done: true },
  { name: "الشروق", time: "٥:٠٣", iqama: "—", icon: "🌅", done: true },
  { name: "الظهر", time: "١١:٥٢", iqama: "١٢:٠٧", icon: "☀️", done: true },
  { name: "العصر", time: "٣:١٣", iqama: "٣:٢٨", icon: "🌤️", done: false },
  { name: "المغرب", time: "٦:٤١", iqama: "٦:٥١", icon: "🌇", done: false },
  { name: "العشاء", time: "٨:١١", iqama: "٨:٢٦", icon: "🌃", done: false },
];

/* ══════════════════════════════════
   MOCK DATA
   ══════════════════════════════════ */
const IMAM = { name: "الشيخ عبدالله المحمد", mosque: "جامع الراجحي", city: "الرياض", district: "حي النسيم" };

const KHUTBAHS = [
  { id: 1, title: "فضل العشر الأوائل من ذي الحجة", date: "٥ يونيو ٢٠٢٦", status: "new", content: "الحمد لله رب العالمين، والصلاة والسلام على أشرف الأنبياء والمرسلين...\n\nأما بعد، فإن من نعم الله على عباده أن جعل لهم مواسم للطاعات، يستكثرون فيها من العمل الصالح، ويتنافسون فيها على الخيرات.\n\nومن أعظم هذه المواسم: العشر الأوائل من ذي الحجة، التي أقسم الله بها في كتابه العزيز فقال: ﴿وَالْفَجْرِ * وَلَيَالٍ عَشْرٍ﴾.\n\nوقد قال النبي ﷺ: \"ما من أيام العمل الصالح فيهن أحب إلى الله من هذه الأيام العشر\".\n\nفاحرصوا — رحمكم الله — على اغتنام هذه الأيام المباركة بالصيام والقيام والذكر والدعاء والصدقة.\n\nالخطبة الثانية:\nاتقوا الله عباد الله، واعلموا أن من أفضل أعمال هذه العشر: صيام يوم عرفة لغير الحاج، فإنه يكفر ذنوب سنتين.\n\nاللهم وفقنا لاغتنام هذه الأيام المباركة...", duration: "٢٠-٢٥ دقيقة", scope: "جميع مساجد الرياض", attachments: ["دليل_الخطبة.pdf", "نقاط_رئيسية.docx"] },
  { id: 2, title: "أهمية بر الوالدين", date: "٢٩ مايو ٢٠٢٦", status: "viewed", content: "خطبة عن بر الوالدين وأجره العظيم عند الله...", duration: "٢٠ دقيقة", scope: "جميع المساجد", attachments: [], recordingUploaded: true },
  { id: 3, title: "التحذير من الغيبة والنميمة", date: "٢٢ مايو ٢٠٢٦", status: "recorded", content: "خطبة عن خطورة الغيبة والنميمة...", duration: "١٨ دقيقة", scope: "جميع المساجد", attachments: [], recordingUploaded: true },
  { id: 4, title: "فضل الصدقة والإنفاق", date: "١٥ مايو ٢٠٢٦", status: "recorded", content: "خطبة عن فضائل الصدقة...", duration: "٢٠ دقيقة", scope: "جميع المساجد", attachments: [], recordingUploaded: true },
];

const TASKS = [
  { id: 1, type: "خطبة", text: "تأكيد الاطلاع على خطبة الجمعة القادمة", urgent: true, due: "قبل الخميس" },
  { id: 2, type: "تسجيل", text: "رفع تسجيل خطبة أهمية بر الوالدين", urgent: false, due: "قبل السبت" },
  { id: 3, type: "صيانة", text: "تأكيد إصلاح مكبر الصوت الأيسر", urgent: false, due: "—" },
];

const NOTIFICATIONS = [
  { id: 1, text: "خطبة جديدة بعنوان: فضل العشر الأوائل من ذي الحجة", time: "قبل ساعتين", read: false, type: "khutbah" },
  { id: 2, text: "تذكير: لم يتم رفع تسجيل خطبة الأسبوع الماضي", time: "أمس", read: false, type: "reminder" },
  { id: 3, text: "تم إصلاح مشكلة التكييف في الجهة اليمنى", time: "أمس", read: true, type: "maintenance" },
  { id: 4, text: "تحديث مواقيت الصلاة لشهر يونيو", time: "قبل ٣ أيام", read: true, type: "system" },
];

const SCHEDULE = [
  { day: "الإثنين", fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
  { day: "الثلاثاء", fajr: true, dhuhr: true, asr: false, maghrib: true, isha: true },
  { day: "الأربعاء", fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
  { day: "الخميس", fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
  { day: "الجمعة", fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
  { day: "السبت", fajr: false, dhuhr: true, asr: true, maghrib: true, isha: false },
  { day: "الأحد", fajr: false, dhuhr: true, asr: true, maghrib: false, isha: false },
];

/* ══════════════════════════════════
   SHARED COMPONENTS
   ══════════════════════════════════ */
function Badge({ text, color = "green" }) {
  const m = { green: [C.primaryLight, C.primary], gold: [C.goldLight, C.gold], red: [C.dangerLight, C.danger], orange: [C.warnLight, C.warn], blue: [C.infoLight, C.info], gray: [C.borderL, C.text2] };
  const [bg, fg] = m[color] || m.gray;
  return <span style={{ background: bg, color: fg, padding: "4px 12px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, display: "inline-block" }}>{text}</span>;
}

function Btn({ children, onClick, variant, full, disabled, small, icon }) {
  const sec = variant === "secondary"; const dn = variant === "danger"; const gh = variant === "ghost";
  const bg = disabled ? C.border : dn ? C.danger : sec ? C.white : gh ? "transparent" : C.primary;
  const fg = disabled ? C.text3 : sec ? C.primary : gh ? C.primary : C.white;
  const bd = sec ? `1.5px solid ${C.primary}` : gh ? "1.5px solid transparent" : "1.5px solid transparent";
  return (
    <button disabled={disabled} onClick={onClick} style={{
      background: bg, color: fg, border: bd, padding: small ? "8px 16px" : "12px 22px",
      borderRadius: 12, fontSize: small ? 13 : 15, fontWeight: 600, cursor: disabled ? "default" : "pointer",
      fontFamily: "inherit", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center",
      gap: 8, width: full ? "100%" : "auto",
    }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.opacity = ".88")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
      {icon && <span>{icon}</span>}{children}
    </button>
  );
}

function PageCard({ children, noPad }) {
  return <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadow, ...(!noPad && { padding: 20 }) }}>{children}</div>;
}

function SectionTitle({ title, badge }) {
  return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h3>{badge}
  </div>;
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: C.primary, color: C.white, padding: "12px 28px", borderRadius: 14, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,.18)", animation: "toastUp .25s ease", fontFamily: "inherit", whiteSpace: "nowrap" }}>
      {msg}<style>{`@keyframes toastUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%)}}`}</style>
    </div>
  );
}

function EmptyState({ icon, msg }) {
  return <div style={{ textAlign: "center", padding: 40, color: C.text3 }}><div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div><div style={{ fontSize: 14 }}>{msg}</div></div>;
}

/* ══════════════════════════════════
   TAB: HOME
   ══════════════════════════════════ */
function HomeTab({ khutbahs, setKhutbahs, notifications, setNotifications, toast }) {
  const nextPrayer = PRAYERS.find(p => !p.done && p.iqama !== "—");
  const unreadKhutbah = khutbahs.find(k => k.status === "new");
  const pendingTasks = TASKS.filter(t => t.urgent).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Greeting */}
      <div style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`, borderRadius: 20, padding: "24px 22px", color: C.white, position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .06, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg"><defs><pattern id="g" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M25 0L50 25L25 50L0 25Z" fill="none" stroke="#fff" strokeWidth=".5"/><circle cx="25" cy="25" r="6" fill="none" stroke="#fff" strokeWidth=".3"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 12, color: C.goldSoft, fontWeight: 600, marginBottom: 6 }}>السلام عليكم ورحمة الله</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{IMAM.name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)" }}>{IMAM.mosque} — {IMAM.district}، {IMAM.city}</div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <div style={{ background: "rgba(255,255,255,.12)", borderRadius: 12, padding: "10px 16px", flex: 1, textAlign: "center", backdropFilter: "blur(4px)" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", marginBottom: 3 }}>الصلاة القادمة</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{nextPrayer?.name || "—"}</div>
              <div style={{ fontSize: 13, color: C.goldSoft }}>{nextPrayer?.time || ""}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,.12)", borderRadius: 12, padding: "10px 16px", flex: 1, textAlign: "center", backdropFilter: "blur(4px)" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", marginBottom: 3 }}>الإقامة</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{nextPrayer?.iqama || "—"}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>بعد الأذان بـ ١٥ د</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action items */}
      {(unreadKhutbah || pendingTasks > 0) && (
        <PageCard>
          <SectionTitle title="مطلوب منك" badge={<Badge text={`${pendingTasks + (unreadKhutbah ? 1 : 0)} عناصر`} color="orange" />} />
          {unreadKhutbah && (
            <div style={{ background: C.goldLight, borderRadius: 14, padding: 16, marginBottom: 10, border: `1px solid ${C.gold}22` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>📜 خطبة جديدة</div>
                <Badge text="جديدة" color="orange" />
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{unreadKhutbah.title}</div>
              <div style={{ fontSize: 12, color: C.text2, marginBottom: 12 }}>{unreadKhutbah.date} · {unreadKhutbah.duration}</div>
              <Btn full onClick={() => {
                setKhutbahs(prev => prev.map(k => k.id === unreadKhutbah.id ? { ...k, status: "viewed" } : k));
                toast("تم تأكيد الاطلاع على الخطبة ✓");
              }}>تأكيد الاطلاع ✓</Btn>
            </div>
          )}
          {TASKS.filter(t => t.urgent).map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.borderL}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.warn, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.text}</div>
                <div style={{ fontSize: 11.5, color: C.text3 }}>{t.due}</div>
              </div>
              <Badge text={t.type} color="gray" />
            </div>
          ))}
        </PageCard>
      )}

      {/* Today's prayer times */}
      <PageCard>
        <SectionTitle title="مواقيت اليوم — الرياض" badge={<span style={{ fontSize: 11, color: C.text3 }}>أم القرى</span>} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {PRAYERS.filter(p => p.iqama !== "—").map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: !p.done ? C.primaryLight : "#fafaf7", border: !p.done ? `1px solid ${C.primary}22` : `1px solid transparent` }}>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, width: 55, color: !p.done ? C.primary : C.text }}>{p.name}</span>
              <span style={{ fontSize: 13, color: C.text2, width: 42 }}>{p.time}</span>
              <span style={{ fontSize: 13, color: C.text2, width: 42 }}>{p.iqama}</span>
              <span style={{ marginRight: "auto" }}><Badge text={p.done ? "تمت" : "قادمة"} color={p.done ? "green" : "blue"} /></span>
            </div>
          ))}
        </div>
      </PageCard>

      {/* Notifications */}
      <PageCard>
        <SectionTitle title="آخر الإشعارات" badge={
          <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} style={{ background: "none", border: "none", fontSize: 12, color: C.primary, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>قراءة الكل</button>
        } />
        {notifications.slice(0, 4).map((n, i) => (
          <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
            style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.borderL}` : "none", cursor: "pointer" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "transparent" : C.primary, flexShrink: 0, marginTop: 6 }} />
            <div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: n.read ? C.text2 : C.text, fontWeight: n.read ? 400 : 600 }}>{n.text}</div>
              <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </PageCard>
    </div>
  );
}

/* ══════════════════════════════════
   TAB: KHUTBAHS
   ══════════════════════════════════ */
function KhutbahsTab({ khutbahs, setKhutbahs, toast }) {
  const [view, setView] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState({});
  const [archiveTab, setArchiveTab] = useState("list");
  const [playing, setPlaying] = useState(null);

  const statusLabel = s => s === "new" ? "جديدة" : s === "viewed" ? "تم الاطلاع" : "تم التسجيل";
  const statusColor = s => s === "new" ? "orange" : s === "viewed" ? "blue" : "green";

  const confirmView = (k) => {
    setKhutbahs(prev => prev.map(x => x.id === k.id ? { ...x, status: x.status === "new" ? "viewed" : x.status } : x));
    toast("تم تأكيد الاطلاع ✓");
  };

  const uploadRecording = (k) => {
    setUploading(true);
    setTimeout(() => {
      setKhutbahs(prev => prev.map(x => x.id === k.id ? { ...x, status: "recorded", recordingUploaded: true } : x));
      setUploading(false);
      toast("تم رفع التسجيل بنجاح ✓");
      setView(prev => prev ? { ...prev, status: "recorded", recordingUploaded: true } : null);
    }, 1500);
  };

  const saveNote = (kId) => {
    toast("تم حفظ الملاحظة ✓");
  };

  // Recordings archive data
  const recordings = khutbahs.filter(k => k.recordingUploaded).map(k => ({ ...k, audioLen: "٢٢:١٥" }));

  if (view) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button onClick={() => setView(null)} style={{ background: "none", border: "none", fontSize: 14, color: C.primary, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, textAlign: "right", padding: 0 }}>→ العودة</button>

        <PageCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
            <Badge text={statusLabel(view.status)} color={statusColor(view.status)} />
            <span style={{ fontSize: 12, color: C.text3 }}>{view.date}</span>
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, lineHeight: 1.5 }}>{view.title}</h2>
          <div style={{ display: "flex", gap: 12, fontSize: 12.5, color: C.text2, marginBottom: 16 }}>
            <span>⏱ {view.duration}</span>
            <span>📍 {view.scope}</span>
          </div>

          {view.attachments?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>المرفقات</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {view.attachments.map((a, i) => (
                  <div key={i} style={{ padding: "8px 14px", borderRadius: 10, background: C.borderL, fontSize: 12.5, color: C.text2, display: "flex", alignItems: "center", gap: 6 }}>📎 {a}</div>
                ))}
              </div>
            </div>
          )}

          {/* Audio player for uploaded recordings */}
          {view.recordingUploaded && (
            <div style={{ marginBottom: 16, padding: 14, background: C.primaryLight, borderRadius: 12, border: `1px solid ${C.primary}22` }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>🎙️ تسجيل الخطبة</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setPlaying(playing === view.id ? null : view.id)} style={{ width: 40, height: 40, borderRadius: "50%", background: C.primary, color: C.white, border: "none", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {playing === view.id ? "⏸" : "▶"}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 6, background: C.borderL, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: playing === view.id ? "45%" : "0%", height: "100%", background: C.primary, borderRadius: 3, transition: "width 2s linear" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.text3, marginTop: 4 }}>
                    <span>{playing === view.id ? "١٠:٠٢" : "٠٠:٠٠"}</span><span>٢٢:١٥</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {view.status === "new" && (
              <Btn full icon="✓" onClick={() => { confirmView(view); setView(prev => ({ ...prev, status: "viewed" })); }}>تأكيد الاطلاع</Btn>
            )}
            {view.status !== "new" && !view.recordingUploaded && (
              <Btn full icon="🎙️" onClick={() => uploadRecording(view)} disabled={uploading}>
                {uploading ? "جاري الرفع..." : "رفع تسجيل الخطبة"}
              </Btn>
            )}
          </div>
        </PageCard>

        {/* Khutbah content */}
        <PageCard>
          <SectionTitle title="نص الخطبة" />
          <div style={{ fontSize: 15, lineHeight: 2.2, color: C.text, whiteSpace: "pre-wrap", fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>
            {view.content}
          </div>
        </PageCard>

        {/* Personal notes */}
        <PageCard>
          <SectionTitle title="ملاحظاتي الشخصية" />
          <textarea value={notes[view.id] || ""} onChange={e => setNotes(prev => ({ ...prev, [view.id]: e.target.value }))}
            placeholder="أضف ملاحظاتك على الخطبة هنا... (لن تظهر للإدارة)"
            rows={3} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: 10 }} />
          <Btn small onClick={() => saveNote(view.id)} disabled={!notes[view.id]}>حفظ الملاحظة</Btn>
        </PageCard>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tab switcher: list vs archive */}
      <div style={{ display: "flex", gap: 4, background: C.borderL, borderRadius: 10, padding: 3 }}>
        {[{ id: "list", label: "الخطب" }, { id: "archive", label: `التسجيلات (${recordings.length})` }].map(t => (
          <button key={t.id} onClick={() => setArchiveTab(t.id)} style={{ flex: 1, padding: "9px 14px", borderRadius: 8, border: "none", background: archiveTab === t.id ? C.card : "transparent", color: archiveTab === t.id ? C.primary : C.text2, fontWeight: archiveTab === t.id ? 700 : 500, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", boxShadow: archiveTab === t.id ? "0 1px 4px rgba(0,0,0,.06)" : "none" }}>{t.label}</button>
        ))}
      </div>

      {archiveTab === "list" ? (
        <PageCard>
          <SectionTitle title="الخطب" badge={<Badge text={`${khutbahs.length} خطبة`} color="gray" />} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {khutbahs.map(k => (
              <div key={k.id} onClick={() => setView(k)} style={{
                padding: 16, borderRadius: 14, border: `1px solid ${k.status === "new" ? C.gold + "44" : C.borderL}`,
                background: k.status === "new" ? C.goldLight : "#fafaf7", cursor: "pointer", transition: "all .15s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, flex: 1 }}>{k.title}</div>
                  <Badge text={statusLabel(k.status)} color={statusColor(k.status)} />
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: C.text2 }}>
                  <span>📅 {k.date}</span><span>⏱ {k.duration}</span>
                  {k.recordingUploaded && <span>🎙️ تم التسجيل</span>}
                </div>
              </div>
            ))}
          </div>
        </PageCard>
      ) : (
        <PageCard>
          <SectionTitle title="أرشيف التسجيلات" />
          {recordings.length > 0 ? recordings.map(r => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.borderL}` }}>
              <button onClick={() => setPlaying(playing === r.id ? null : r.id)} style={{ width: 36, height: 36, borderRadius: "50%", background: playing === r.id ? C.danger : C.primary, color: C.white, border: "none", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {playing === r.id ? "⏸" : "▶"}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: C.text3 }}>{r.date} · {r.audioLen}</div>
              </div>
              <Badge text="مرفوع" color="green" />
            </div>
          )) : <EmptyState icon="🎙️" msg="لا توجد تسجيلات بعد" />}
        </PageCard>
      )}

      <PageCard>
        <SectionTitle title="رفع تسجيل" />
        <div style={{ padding: 28, border: `2px dashed ${C.border}`, borderRadius: 14, textAlign: "center", color: C.text3 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎙️</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>اسحب ملف التسجيل أو انقر للرفع</div>
          <div style={{ fontSize: 12 }}>MP3, WAV, M4A — حد أقصى 50 MB</div>
        </div>
      </PageCard>
    </div>
  );
}

/* ══════════════════════════════════
   TAB: MOSQUE
   ══════════════════════════════════ */
function MosqueTab({ toast }) {
  const [reportModal, setReportModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);
  const [reportForm, setReportForm] = useState({ type: "", desc: "" });
  const [leaveForm, setLeaveForm] = useState({ from: "", to: "", reason: "", type: "إجازة" });
  const [leaves, setLeaves] = useState([
    { id: 1, from: "٢٠٢٦/٠٦/١٥", to: "٢٠٢٦/٠٦/١٧", type: "إجازة", status: "معتمدة", reason: "ظروف عائلية" },
  ]);

  const ISSUES = [
    { id: "TK-0041", type: "تكييف", status: "قيد المعالجة", date: "٧ يونيو", priority: "عالية" },
    { id: "TK-0048", type: "إضاءة ممر", status: "مكتملة", date: "٣ يونيو", priority: "متوسطة" },
  ];

  const submitReport = () => {
    if (!reportForm.type || !reportForm.desc) return;
    setReportModal(false);
    setReportForm({ type: "", desc: "" });
    toast("تم إرسال البلاغ — شكراً لحرصك ✓");
  };

  const submitLeave = () => {
    if (!leaveForm.from || !leaveForm.to || !leaveForm.reason) return;
    setLeaves(prev => [...prev, { id: Date.now(), from: leaveForm.from, to: leaveForm.to, type: leaveForm.type, status: "قيد الاعتماد", reason: leaveForm.reason }]);
    setLeaveModal(false);
    setLeaveForm({ from: "", to: "", reason: "", type: "إجازة" });
    toast("تم إرسال طلب الإجازة ✓");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Mosque info */}
      <PageCard>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🕌</div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{IMAM.mosque}</h2>
          <div style={{ fontSize: 13.5, color: C.text2 }}>{IMAM.district} — {IMAM.city}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[{ n: "٣,٥٠٠", l: "السعة", ic: "👥" }, { n: "٤", l: "خدمات", ic: "⚙️" }, { n: "متصل", l: "الجهاز", ic: "📡" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: 14, background: C.primaryLight, borderRadius: 12 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.ic}</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: C.text2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </PageCard>

      {/* My schedule */}
      <PageCard>
        <SectionTitle title="جدول الإمامة" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                <th style={{ padding: "8px 6px", textAlign: "right", color: C.text2, fontWeight: 600 }}>اليوم</th>
                {["الفجر", "الظهر", "العصر", "المغرب", "العشاء"].map(p => (
                  <th key={p} style={{ padding: "8px 6px", textAlign: "center", color: C.text2, fontWeight: 600 }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCHEDULE.map((s, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderL}`, background: s.day === "الإثنين" ? C.primaryLight : "transparent" }}>
                  <td style={{ padding: "10px 6px", fontWeight: 600 }}>{s.day}</td>
                  {[s.fajr, s.dhuhr, s.asr, s.maghrib, s.isha].map((v, j) => (
                    <td key={j} style={{ textAlign: "center", padding: "10px 6px" }}>
                      {v ? <span style={{ color: C.primary, fontSize: 16 }}>●</span> : <span style={{ color: C.border }}>○</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>

      {/* Maintenance */}
      <PageCard>
        <SectionTitle title="حالة الصيانة" badge={<Btn small variant="ghost" onClick={() => setReportModal(true)}>+ بلاغ</Btn>} />
        {ISSUES.map((t, i) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < ISSUES.length - 1 ? `1px solid ${C.borderL}` : "none" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.primary, width: 65 }}>{t.id}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.type}</div>
              <div style={{ fontSize: 11, color: C.text3 }}>{t.date}</div>
            </div>
            <Badge text={t.status} color={t.status === "مكتملة" ? "green" : "blue"} />
          </div>
        ))}
      </PageCard>

      {/* Leave / Absence requests */}
      <PageCard>
        <SectionTitle title="طلبات الإجازة" badge={<Btn small variant="ghost" onClick={() => setLeaveModal(true)}>+ طلب إجازة</Btn>} />
        {leaves.map((lv, i) => (
          <div key={lv.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < leaves.length - 1 ? `1px solid ${C.borderL}` : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: lv.status === "معتمدة" ? C.primaryLight : C.warnLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
              {lv.status === "معتمدة" ? "✅" : "⏳"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{lv.type} — {lv.reason}</div>
              <div style={{ fontSize: 11.5, color: C.text3 }}>{lv.from} → {lv.to}</div>
            </div>
            <Badge text={lv.status} color={lv.status === "معتمدة" ? "green" : "orange"} />
          </div>
        ))}
        {leaves.length === 0 && <EmptyState icon="📅" msg="لا توجد طلبات" />}
      </PageCard>

      {/* Report modal */}
      {reportModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setReportModal(false)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.4)" }} />
          <div onClick={e => e.stopPropagation()} style={{
            position: "relative", background: C.card, borderRadius: "22px 22px 0 0", width: "100%", maxWidth: 480,
            padding: 24, animation: "sheetUp .25s ease", maxHeight: "70vh", overflow: "auto",
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 16px" }} />
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>بلاغ صيانة</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>نوع المشكلة *</label>
              <select value={reportForm.type} onChange={e => setReportForm(p => ({ ...p, type: e.target.value }))}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", background: C.white, appearance: "auto", boxSizing: "border-box" }}>
                <option value="">اختر النوع</option>
                {["تكييف", "إضاءة", "نظام صوت", "سجاد", "دورات مياه", "كهرباء", "سباكة", "أخرى"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>وصف المشكلة *</label>
              <textarea value={reportForm.desc} onChange={e => setReportForm(p => ({ ...p, desc: e.target.value }))} rows={3}
                placeholder="وصف مختصر للمشكلة..."
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", resize: "none", boxSizing: "border-box" }} />
            </div>
            <Btn full onClick={submitReport} disabled={!reportForm.type || !reportForm.desc}>إرسال البلاغ</Btn>
            <style>{`@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
          </div>
        </div>
      )}

      {/* Leave request modal */}
      {leaveModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setLeaveModal(false)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.4)" }} />
          <div onClick={e => e.stopPropagation()} style={{
            position: "relative", background: C.card, borderRadius: "22px 22px 0 0", width: "100%", maxWidth: 480,
            padding: 24, animation: "sheetUp .25s ease", maxHeight: "70vh", overflow: "auto",
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 16px" }} />
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>طلب إجازة / غياب</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>نوع الطلب</label>
              <select value={leaveForm.type} onChange={e => setLeaveForm(p => ({ ...p, type: e.target.value }))}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", background: C.white, appearance: "auto", boxSizing: "border-box" }}>
                {["إجازة", "غياب طارئ", "إجازة مرضية", "مهمة رسمية"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>من تاريخ *</label>
                <input type="date" value={leaveForm.from} onChange={e => setLeaveForm(p => ({ ...p, from: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>إلى تاريخ *</label>
                <input type="date" value={leaveForm.to} onChange={e => setLeaveForm(p => ({ ...p, to: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>السبب *</label>
              <textarea value={leaveForm.reason} onChange={e => setLeaveForm(p => ({ ...p, reason: e.target.value }))} rows={2}
                placeholder="سبب الإجازة أو الغياب..."
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", resize: "none", boxSizing: "border-box" }} />
            </div>
            <Btn full onClick={submitLeave} disabled={!leaveForm.from || !leaveForm.to || !leaveForm.reason}>إرسال الطلب</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════
   TAB: PROFILE
   ══════════════════════════════════ */
function ProfileTab({ khutbahs, toast }) {
  const viewed = khutbahs.filter(k => k.status !== "new").length;
  const recorded = khutbahs.filter(k => k.recordingUploaded).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageCard>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 12px" }}>👤</div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{IMAM.name}</h2>
          <div style={{ fontSize: 13.5, color: C.text2 }}>إمام {IMAM.mosque}</div>
          <Badge text="إمام معتمد" color="green" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { n: `${viewed}/${khutbahs.length}`, l: "خطب مطّلع عليها", bg: C.primaryLight },
            { n: `${recorded}/${khutbahs.length}`, l: "تسجيلات مرفوعة", bg: C.infoLight },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: 16, background: s.bg, borderRadius: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </PageCard>

      <PageCard>
        <SectionTitle title="البيانات الشخصية" />
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px 14px", fontSize: 14 }}>
          {[["الاسم", IMAM.name], ["المسجد", IMAM.mosque], ["المدينة", IMAM.city], ["الحي", IMAM.district], ["الدور", "إمام"], ["الحالة", "نشط"]].map(([l, v], i) => (
            <React.Fragment key={i}>
              <span style={{ color: C.text2, fontWeight: 600 }}>{l}</span>
              <span>{v}</span>
            </React.Fragment>
          ))}
        </div>
      </PageCard>

      <PageCard>
        <SectionTitle title="الإحصائيات" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "نسبة الاطلاع على الخطب", pct: Math.round(viewed / khutbahs.length * 100), color: C.primary },
            { label: "نسبة رفع التسجيلات", pct: Math.round(recorded / khutbahs.length * 100), color: C.info },
            { label: "الالتزام بالجدول", pct: 94, color: C.gold },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: s.color }}>{s.pct}%</span>
              </div>
              <div style={{ height: 8, background: C.borderL, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 4, transition: "width .5s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </PageCard>

      <PageCard>
        <SectionTitle title="الإعدادات" />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {["إشعارات الخطب الجديدة", "تذكير مواقيت الصلاة", "تنبيهات الصيانة", "اللغة والمنطقة"].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? `1px solid ${C.borderL}` : "none", cursor: "pointer" }}>
              <span style={{ fontSize: 14 }}>{s}</span>
              <span style={{ fontSize: 16, color: C.text3 }}>←</span>
            </div>
          ))}
        </div>
      </PageCard>

      <Btn full variant="secondary" icon="🚪">تسجيل الخروج</Btn>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN APP
   ══════════════════════════════════ */
export default function ImamPortal() {
  const [tab, setTab] = useState("home");
  const [khutbahs, setKhutbahs] = useState(KHUTBAHS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [toastMsg, setToastMsg] = useState(null);

  const toast = useCallback(msg => setToastMsg(msg), []);
  const unread = notifications.filter(n => !n.read).length;

  // Push notification simulation — a new notification arrives after 8s
  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotif = {
        id: Date.now(),
        text: "📜 خطبة جديدة: حقوق الجار في الإسلام — يرجى الاطلاع والتأكيد",
        time: "الآن",
        type: "khutbah",
        read: false,
      };
      setNotifications(prev => [newNotif, ...prev]);
      setToastMsg("📜 وردتك خطبة جديدة!");
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const TABS = [
    { id: "home", label: "الرئيسية", icon: "🏠" },
    { id: "khutbahs", label: "الخطب", icon: "📜" },
    { id: "mosque", label: "المسجد", icon: "🕌" },
    { id: "profile", label: "حسابي", icon: "👤" },
  ];

  return (
    <div dir="rtl" style={{
      fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif",
      background: C.bg, color: C.text,
      maxWidth: 480, margin: "0 auto",
      minHeight: "100vh", position: "relative",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Amiri:wght@400;700&display=swap');
        * { box-sizing:border-box; margin:0 } ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        input::placeholder,textarea::placeholder{color:${C.text3}}`}</style>

      {/* Header */}
      <header style={{
        padding: "14px 20px", background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.primary}, ${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🕌</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.primaryDark }}>بوابة الإمام</div>
            <div style={{ fontSize: 10.5, color: C.text3 }}>٢٢ ذو الحجة ١٤٤٧ هـ</div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setTab("home")} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 4 }}>
            🔔
            {unread > 0 && <span style={{ position: "absolute", top: -2, left: -2, width: 16, height: 16, borderRadius: "50%", background: C.danger, color: C.white, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</span>}
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, padding: "16px 16px 90px", overflow: "auto" }}>
        {tab === "home" && <HomeTab khutbahs={khutbahs} setKhutbahs={setKhutbahs} notifications={notifications} setNotifications={setNotifications} toast={toast} />}
        {tab === "khutbahs" && <KhutbahsTab khutbahs={khutbahs} setKhutbahs={setKhutbahs} toast={toast} />}
        {tab === "mosque" && <MosqueTab toast={toast} />}
        {tab === "profile" && <ProfileTab khutbahs={khutbahs} toast={toast} />}
      </div>

      {/* Bottom Tab Bar */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "rgba(255,255,255,.95)", backdropFilter: "blur(14px)",
        borderTop: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-around",
        padding: "8px 0 12px", zIndex: 50,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            color: tab === t.id ? C.primary : C.text3,
            transition: "all .15s", padding: "4px 12px",
          }}>
            <span style={{ fontSize: 22, transition: "transform .15s", transform: tab === t.id ? "scale(1.15)" : "scale(1)" }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t.id ? 700 : 500 }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 20, height: 3, borderRadius: 2, background: C.primary, marginTop: 1 }} />}
          </button>
        ))}
      </nav>

      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
