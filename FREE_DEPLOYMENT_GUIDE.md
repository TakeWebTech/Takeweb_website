# TakeWeb Free Deployment Guide

Deploy your entire TakeWeb monorepo for **$0/month** using:
- **Vercel** → Web & Admin (Next.js)
- **Render** → API (NestJS)
- **Neon** → Database (PostgreSQL)

---

## 📊 Architecture Overview

```
                    ┌─────────────────────────────────────┐
                    │            INTERNET                 │
                    └─────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
            ▼                       ▼                       ▼
    ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
    │    VERCEL     │      │    VERCEL     │      │    RENDER     │
    │  ───────────  │      │  ───────────  │      │  ───────────  │
    │   Web App     │      │   Admin App   │      │   API Server  │
    │  (Next.js)    │      │  (Next.js)    │      │   (NestJS)    │
    │               │      │               │      │               │
    │ takeweb.      │      │ admin.        │      │ takeweb-api.  │
    │ vercel.app    │      │ takeweb.      │      │ onrender.com  │
    │               │      │ vercel.app    │      │               │
    └───────────────┘      └───────────────┘      └───────────────┘
                                                          │
                                                          ▼
                                                  ┌───────────────┐
                                                  │     NEON      │
                                                  │  ───────────  │
                                                  │  PostgreSQL   │
                                                  │  (0.5GB free) │
                                                  └───────────────┘
```

---

## 🗄️ Step 1: Set Up Database (Neon)

### 1.1 Create Neon Account

1. Go to **[neon.tech](https://neon.tech)**
2. Click **"Sign Up"** (use GitHub for easy login)
3. Verify your email

### 1.2 Create Database

1. Click **"Create a project"**
2. **Project name:** `takeweb`
3. **Database name:** `takeweb`
4. **Region:** Choose closest to your users
5. Click **"Create Project"**

### 1.3 Copy Connection String

1. On the dashboard, find **"Connection string"**
2. Select **"Prisma"** from the dropdown
3. Copy the connection string:

```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/takeweb?sslmode=require
```
DATABASE_URL="postgresql://neondb_owner:npg_eD9dqcw2ChmX@ep-weathered-mountain-a1lgyziu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
# uncomment next line if you use Prisma <5.10
# DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_eD9dqcw2ChmX@ep-weathered-mountain-a1lgyziu.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

**⚠️ Save this! You'll need it for the API deployment.**

### 1.4 Run Database Migrations

Before deploying the API, run migrations locally:

```bash
cd packages/api

# Set the DATABASE_URL
export DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/takeweb?sslmode=require"

# Or on Windows PowerShell:
$env:DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/takeweb?sslmode=require"

# Run migrations
npx prisma migrate deploy

# (Optional) Seed initial data
npx prisma db seed
```

---

## 🚀 Step 2: Deploy API (Render)

### 2.1 Create Render Account

1. Go to **[render.com](https://render.com)**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended)

### 2.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your **GitHub repository**
3. Select your **TakeWeb repository**

### 2.3 Configure Service

| Setting | Value |
|---------|-------|
| **Name** | `takeweb-api` |
| **Region** | Oregon (US West) or nearest |
| **Branch** | `main` |
| **Root Directory** | `packages/api` |
| **Runtime** | `Node` |
| **Build Command** | `npm install --include=dev && npx prisma generate && npx nest build` |
| **Start Command** | `node dist/main` |
| **Plan** | `Free` |

### 2.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET` | Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `NODE_ENV` | `production` |
| `PORT` | `3002` |
| `FRONTEND_URL` | `https://takeweb.vercel.app` (update after Vercel deploy) |
| `ADMIN_URL` | `https://takeweb-admin.vercel.app` (update after Vercel deploy) |

### 2.5 Deploy

1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Copy your API URL: `https://takeweb-api.onrender.com`

### 2.6 Add Health Check Endpoint

Create a health endpoint in your API. It should already exist, but verify:

```typescript
// packages/api/src/app.controller.ts
@Get('health')
healthCheck() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

---

## 🌐 Step 3: Deploy Web Frontend (Vercel)

### 3.1 Create Vercel Account

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"**
3. Sign up with **GitHub**

### 3.2 Import Project (Web App)

1. Click **"Add New..."** → **"Project"**
2. Select your **TakeWeb repository**
3. Configure project:

| Setting | Value |
|---------|-------|
| **Project Name** | `takeweb` |
| **Framework Preset** | `Next.js` |
| **Root Directory** | Click "Edit" → `apps/web` |
| **Build Command** | `cd ../.. && pnpm install && pnpm build --filter @takeweb/web...` |
| **Output Directory** | `.next` |
| **Install Command** | `cd ../.. && pnpm install` |

### 3.3 Add Environment Variables

Click **"Environment Variables"**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://takeweb-api.onrender.com` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Your site is live at: `https://takeweb.vercel.app`

---

## 🔧 Step 4: Deploy Admin Dashboard (Vercel)

### 4.1 Import Second Project

1. In Vercel, click **"Add New..."** → **"Project"**
2. Select the **same TakeWeb repository**
3. Configure differently:

| Setting | Value |
|---------|-------|
| **Project Name** | `takeweb-admin` |
| **Framework Preset** | `Next.js` |
| **Root Directory** | Click "Edit" → `apps/admin` |
| **Build Command** | `cd ../.. && pnpm install && pnpm build --filter @takeweb/admin...` |
| **Output Directory** | `.next` |
| **Install Command** | `cd ../.. && pnpm install` |

### 4.2 Add Environment Variables

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://takeweb-api.onrender.com` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

### 4.3 Deploy

1. Click **"Deploy"**
2. Your admin is live at: `https://takeweb-admin.vercel.app`

---

## 🔄 Step 5: Update Cross-Service URLs

### 5.1 Update Render API

Go back to Render → takeweb-api → Environment:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://takeweb.vercel.app` |
| `ADMIN_URL` | `https://takeweb-admin.vercel.app` |

Click **"Save Changes"** → Service will redeploy.

---

## 🌍 Step 6: Custom Domains (Optional)

### 6.1 Vercel Custom Domains

1. Go to Project → Settings → Domains
2. Add your domain (e.g., `takeweb.in`)
3. Configure DNS:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### 6.2 Render Custom Domain

1. Go to Service → Settings → Custom Domains
2. Add `api.takeweb.in`
3. Configure DNS as shown

---

## 📋 Environment Variables Summary

### Neon (Database)
```
# Auto-generated, copy connection string
```

### Render (API)
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/takeweb?sslmode=require
JWT_SECRET=your-64-char-generated-secret
NODE_ENV=production
PORT=3002
FRONTEND_URL=https://takeweb.vercel.app
ADMIN_URL=https://takeweb-admin.vercel.app
```

### Vercel (Web)
```env
NEXT_PUBLIC_API_URL=https://takeweb-api.onrender.com
NEXT_TELEMETRY_DISABLED=1
```

### Vercel (Admin)
```env
NEXT_PUBLIC_API_URL=https://takeweb-api.onrender.com
NEXT_TELEMETRY_DISABLED=1
```

---

## 🐛 Troubleshooting

### API Cold Starts (Render Free Tier)

The free tier sleeps after 15 minutes of inactivity. First request takes 30-50 seconds.

**Solutions:**
- Accept it for a portfolio site
- Use a cron job to keep it warm (not allowed on free tier)
- Upgrade to $7/month for always-on

### Database Connection Issues

**Error:** `Connection refused` or `timeout`

**Solution:**
1. Check Neon dashboard - is the database active?
2. Verify `DATABASE_URL` has `?sslmode=require`
3. Check if your connection string is correct

### Build Fails on Vercel

**Error:** `Cannot find module...`

**Solution:**
1. Ensure Build Command starts with `cd ../..`
2. Use `pnpm install` not `npm install`
3. Check that `pnpm-lock.yaml` is committed

### CORS Errors

**Error:** `Access-Control-Allow-Origin` error

**Solution:**
1. Update `FRONTEND_URL` and `ADMIN_URL` in Render
2. Ensure API has CORS configured for these URLs

---

## ✅ Deployment Checklist

- [ ] **Neon:** Database created and connection string copied
- [ ] **Neon:** Migrations run (`npx prisma migrate deploy`)
- [ ] **Render:** API deployed and environment variables set
- [ ] **Render:** API responds at `/health` endpoint
- [ ] **Vercel:** Web app deployed with API URL
- [ ] **Vercel:** Admin app deployed with API URL
- [ ] **Cross-URLs:** Render FRONTEND_URL and ADMIN_URL updated
- [ ] **Testing:** All three services communicate correctly

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Vercel (Web) | Hobby | **$0** |
| Vercel (Admin) | Hobby | **$0** |
| Render (API) | Free | **$0** |
| Neon (Database) | Free | **$0** |
| **Total** | | **$0/month** |

### Upgrade Paths

| Service | When to Upgrade | Cost |
|---------|-----------------|------|
| Render | High traffic, no cold starts | $7/month |
| Neon | > 0.5GB data | $19/month |
| Vercel | Team features, more bandwidth | $20/month |

---

## 🔗 Quick Links

| Service | Dashboard | Docs |
|---------|-----------|------|
| Neon | [console.neon.tech](https://console.neon.tech) | [neon.tech/docs](https://neon.tech/docs) |
| Render | [dashboard.render.com](https://dashboard.render.com) | [render.com/docs](https://render.com/docs) |
| Vercel | [vercel.com/dashboard](https://vercel.com/dashboard) | [vercel.com/docs](https://vercel.com/docs) |

---

## 🚀 Quick Deploy Commands

```bash
# Push all changes to trigger deployments
git add .
git commit -m "Ready for deployment"
git push origin main

# Vercel and Render will auto-deploy from main branch!
```

---

*Last Updated: January 2026*
