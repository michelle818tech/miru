# Mirus KPI Tracker

Production-ready KPI tracking website for Mirus Skincare managers.

## Quick Start (30 minutes)

### Prerequisites
- GitHub account
- Node.js 18+
- Git

### Step 1: Clone & Install
```bash
git clone https://github.com/your-repo/mirus-kpi.git
cd mirus-kpi
npm install
```

### Step 2: Database Setup
1. Go to https://supabase.com → Create project "mirus-kpi"
2. Go to SQL Editor
3. Copy-paste contents of `docs/SUPABASE_SETUP.sql`
4. Click RUN
5. Copy Project URL and Anon Key from Settings → API

### Step 3: API Keys
1. Get Claude API key: https://console.anthropic.com/account/keys
2. Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
CLAUDE_API_KEY=sk-ant-xxxxx
```

### Step 4: Run Locally
```bash
npm run dev
```
Visit http://localhost:3000

### Step 5: Deploy to Vercel
1. Push to GitHub: `git push origin main`
2. Go to https://vercel.com
3. Import your GitHub repo
4. Add same env variables
5. Deploy!

Your site: `https://mirus-kpi.vercel.app`

## Test Accounts

After deployment:
- **Manager:** tsogzolmaa@mirus.mn / password123
- **HR:** hr@mirus.mn / password123
- **Admin:** michelle@mirus.mn / password123

## Features

✅ Manager weekly reflections with AI quality check  
✅ Auto-sync Odoo POS metrics weekly  
✅ HR dashboard for all 4 managers  
✅ Work ethics & warnings section  
✅ Monthly WHAT/HOW scoring  
✅ KPI tier calculation  
✅ Role-based access (manager/hr/admin)  

## Odoo Integration

See `docs/ODOO_INTEGRATION.md` - give to Techmarbles team.

## Support

Questions? Email: michelle@mirus.mn

## Stack

- **Frontend:** Next.js, React
- **Database:** Supabase (PostgreSQL)
- **Auth:** Email/password
- **AI:** Claude API
- **Hosting:** Vercel

## Cost

- Vercel: FREE
- Supabase: FREE
- Claude: ~$1/month
- **Total:** ~$1/month
