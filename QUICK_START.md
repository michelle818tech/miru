# Mirus KPI Tracker - Quick Start Guide

**Start here! 30 minutes to live deployment.**

## Prerequisites
- GitHub account
- Node.js 18+ installed
- Git installed

## Step 1: Clone Repository
```bash
git clone https://github.com/your-username/mirus-kpi.git
cd mirus-kpi
npm install
```

## Step 2: Supabase Setup (5 min)

1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project: "mirus-kpi"
4. Go to **SQL Editor**
5. Copy entire contents of `docs/SUPABASE_SETUP.sql`
6. Paste into SQL editor → Click **RUN**
7. Go to **Settings → API**
8. Copy your **Project URL** and **Anon Key**

## Step 3: Claude API Key
1. Go to https://console.anthropic.com/account/keys
2. Create new API key
3. Copy it

## Step 4: Environment Setup
Create file `.env.local` in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
CLAUDE_API_KEY=sk-ant-xxxxxxxxxx
```

## Step 5: Test Locally
```bash
npm run dev
```
Visit http://localhost:3000

Test login: `tsogzolmaa@mirus.mn` / `password123`

## Step 6: Deploy to Vercel

### Option A: Auto-deploy from GitHub
1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial deploy"
   git push origin main
   ```

2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables from `.env.local`
6. Click "Deploy"

**Done!** Your site is live at: `https://mirus-kpi.vercel.app`

### Option B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

## Test Accounts (After Deployment)

| Role | Email | Password |
|------|-------|----------|
| Manager | tsogzolmaa@mirus.mn | password123 |
| HR | hr@mirus.mn | password123 |
| Admin | michelle@mirus.mn | password123 |

## Odoo Integration

Give this file to your Techmarbles team:
→ `docs/ODOO_INTEGRATION.md`

They need to run the Python script weekly (Sundays 5 AM).

## What's Next?

1. ✅ Test the deployed site
2. ✅ HR creates other 3 manager accounts (Ujin, Badmaa, Uchral)
3. ✅ Techmarbles sets up Odoo sync script
4. ✅ Start using for real weekly tracking

## Troubleshooting

**"Cannot connect to database"**
→ Check Supabase URL and key in `.env.local`

**"AI assessment not working"**
→ Verify Claude API key is correct

**"Vercel deployment failed"**
→ Check that all env variables are set in Vercel dashboard

## Support

Email: michelle@mirus.mn

---

**Total cost:** ~$1/month (Claude API only)  
**Time to live:** 30 minutes  
**Users:** 4 managers + HR + Admin
