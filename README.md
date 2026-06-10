# منصة المساجد — Mosque Management Platform

A comprehensive Saudi mosque management platform with three portals:

| Route | Portal | Audience |
|-------|--------|----------|
| `/` | Public Website | المصلون والجمهور |
| `/admin` | Admin Portal | إدارة المنصة |
| `/imam` | Imam Portal | الأئمة |

## Tech Stack
- **Frontend:** React 19 + Vite + React Router
- **Backend:** Supabase (PostgreSQL + Auth + Storage + RLS)
- **Deploy:** Vercel

## Quick Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
cd mosque-platform
npm install
vercel
```

### Option 2: GitHub → Vercel
1. Push to GitHub:
```bash
git init
git add .
git commit -m "Mosque Platform MVP"
git remote add origin https://github.com/YOUR_USER/mosque-platform.git
git push -u origin main
```
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo → Deploy

## Environment Variables (optional)
```
VITE_SUPABASE_URL=https://axuvnigmzqtvkvbkrrml.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## Database
- **17 tables**, 11 enums, 6 triggers, 2 storage buckets
- Supabase Dashboard: https://supabase.com/dashboard/project/axuvnigmzqtvkvbkrrml

## Features
- 🕌 Mosque CRUD with search, filter, edit, delete
- 🔊 Adhan voice management with upload, preview, approval workflow
- ⏰ Real-time prayer times with live clock and countdown
- 📜 Khutbah management with imam compliance tracking
- 🔧 Maintenance ticketing with team assignment and bulk ops
- 📋 Complaints with timeline history and public tracking
- 💰 Donations with receipt and project progress
- 📈 Reports with charts and CSV export
- ⚙️ Platform settings (iqama durations, volume levels)
- 🔔 Notifications with push simulation
- 📅 Imam leave/absence requests
- 🎵 Auto-play adhan at prayer time on public website
