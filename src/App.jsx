import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const PublicWebsite = lazy(() => import('./portals/PublicWebsite'))
const AdminPortal = lazy(() => import('./portals/AdminPortal'))
const ImamPortal = lazy(() => import('./portals/ImamPortal'))

const Loading = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: "'Noto Sans Arabic', sans-serif", direction: 'rtl' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🕌</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#0b7a5e' }}>جاري التحميل...</div>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<PublicWebsite />} />
          <Route path="/admin/*" element={<AdminPortal />} />
          <Route path="/imam/*" element={<ImamPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div dir="rtl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: "'Noto Sans Arabic', sans-serif", background: '#f5f4f0' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🕌</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>الصفحة غير موجودة</h1>
        <p style={{ color: '#5a6a72', fontSize: 15, marginBottom: 24 }}>٤٠٤ — الصفحة المطلوبة غير متوفرة</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <Link to="/" style={{ padding: '12px 32px', borderRadius: 12, background: '#0b7a5e', color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>الموقع العام</Link>
          <Link to="/admin" style={{ padding: '12px 32px', borderRadius: 12, background: '#fff', color: '#0b7a5e', textDecoration: 'none', fontSize: 15, fontWeight: 600, border: '1.5px solid #0b7a5e' }}>لوحة الإدارة</Link>
          <Link to="/imam" style={{ padding: '12px 32px', borderRadius: 12, background: '#fff', color: '#0b7a5e', textDecoration: 'none', fontSize: 15, fontWeight: 600, border: '1.5px solid #0b7a5e' }}>بوابة الإمام</Link>
        </div>
      </div>
    </div>
  )
}
