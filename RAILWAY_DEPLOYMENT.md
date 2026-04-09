# TakeWeb Complete Railway Deployment Guide

This guide covers deploying the **entire TakeWeb monorepo** on Railway including:
- 🌐 **Web** (Frontend - Next.js)
- 🔧 **Admin** (Dashboard - Next.js)
- 🚀 **API** (Backend - NestJS + Prisma)
- 🗄️ **PostgreSQL** (Database)

---

## 📊 Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         RAILWAY                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   WEB APP    │  │   ADMIN APP  │  │    API SERVER    │   │
│  │  (Next.js)   │  │  (Next.js)   │  │    (NestJS)      │   │
│  │  Port: 3000  │  │  Port: 3001  │  │    Port: 3002    │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│         │                 │                    │             │
│         └─────────────────┴────────────────────┘             │
│                           │                                  │
│                   ┌───────▼────────┐                        │
│                   │   PostgreSQL   │                        │
│                   │   (Database)   │                        │
│                   └────────────────┘                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Prerequisites

Before starting:
- [ ] GitHub account with repository pushed
- [ ] Railway account at [railway.app](https://railway.app)
- [ ] All code committed and pushed to GitHub

---

## Step 1: Create Railway Project

### 1.1 Login to Railway

1. Go to **[railway.app](https://railway.app)**
2. Click **"Login"** and sign in with GitHub (recommended)

### 1.2 Create New Project

1. Click **"New Project"**
2. Choose **"Empty Project"** (we'll add services manually)
3. Give it a name like **"TakeWeb"**

---

## Step 2: Add PostgreSQL Database

### 2.1 Add Database Service

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will provision a PostgreSQL database automatically

### 2.2 Get Database URL

1. Click on the PostgreSQL service
2. Go to **"Variables"** tab
3. Copy the **`DATABASE_URL`** value (you'll need this later)

Example format:
```
postgresql://postgres:password@roundhouse.proxy.rlwy.net:12345/railway
```

---

## Step 3: Deploy API Backend

### 3.1 Add API Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your **TakeWeb repository**
3. Railway will create a service

### 3.2 Configure API Service

Click on the service → **Settings** tab:

| Setting | Value |
|---------|-------|
| **Service Name** | `api` |
| **Root Directory** | `packages/api` |
| **Build Command** | `pnpm install && npx prisma generate && pnpm build` |
| **Start Command** | `pnpm start:prod` |

### 3.3 Add API Environment Variables

Go to **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (click "Add Reference") |
| `JWT_SECRET` | Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `NODE_ENV` | `production` |
| `PORT` | `3002` |
| `FRONTEND_URL` | `https://your-web-app.up.railway.app` (update later) |
| `ADMIN_URL` | `https://your-admin-app.up.railway.app` (update later) |

### 3.4 Run Database Migrations

After the first deploy succeeds, run migrations:

1. Click on the API service
2. Go to **"Settings"** → **"Deploy"**
3. Click **"Deploy from a Command"**
4. Run: `npx prisma migrate deploy`

Or via Railway CLI:
```bash
railway run -s api npx prisma migrate deploy
```

---

## Step 4: Deploy Web Frontend

### 4.1 Add Web Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your **TakeWeb repository** again
3. This creates a second service from the same repo

### 4.2 Configure Web Service

Click on the service → **Settings** tab:

| Setting | Value |
|---------|-------|
| **Service Name** | `web` |
| **Root Directory** | `apps/web` |
| **Build Command** | `cd ../.. && pnpm install && pnpm build --filter @takeweb/web...` |
| **Start Command** | `pnpm start` |

### 4.3 Add Web Environment Variables

Go to **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_API_URL` | `https://your-api.up.railway.app` (API service URL) |
| `NEXT_TELEMETRY_DISABLED` | `1` |

### 4.4 Generate Domain

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Save the URL (e.g., `takeweb-web.up.railway.app`)

---

## Step 5: Deploy Admin Dashboard

### 5.1 Add Admin Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your **TakeWeb repository** again
3. This creates a third service from the same repo

### 5.2 Configure Admin Service

Click on the service → **Settings** tab:

| Setting | Value |
|---------|-------|
| **Service Name** | `admin` |
| **Root Directory** | `apps/admin` |
| **Build Command** | `cd ../.. && pnpm install && pnpm build --filter @takeweb/admin...` |
| **Start Command** | `pnpm start` |

### 5.3 Add Admin Environment Variables

Go to **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_API_URL` | `https://your-api.up.railway.app` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

### 5.4 Generate Domain

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Save the URL (e.g., `takeweb-admin.up.railway.app`)

---

## Step 6: Update Cross-Service URLs

After all services are deployed, update the URLs:

### 6.1 Update API Service Variables

Go to API service → Variables:

| Variable | Value |
|----------|-------|
| `FRONTEND_URL` | `https://takeweb-web.up.railway.app` |
| `ADMIN_URL` | `https://takeweb-admin.up.railway.app` |

### 6.2 Update Web & Admin Variables

Update both services with the correct API URL:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://takeweb-api.up.railway.app` |

---

## Step 7: Configure Custom Domains (Optional)

### 7.1 Add Custom Domains

For each service:

1. Go to **Settings** → **Networking** → **Custom Domains**
2. Click **"+ Custom Domain"**
3. Add your domains:
   - Web: `takeweb.in`
   - Admin: `admin.takeweb.in`
   - API: `api.takeweb.in`

### 7.2 Configure DNS

At your domain registrar, add CNAME records:

| Type | Name | Value |
|------|------|-------|
| CNAME | `@` or `www` | `takeweb-web.up.railway.app` |
| CNAME | `admin` | `takeweb-admin.up.railway.app` |
| CNAME | `api` | `takeweb-api.up.railway.app` |

---

## 📋 Environment Variables Summary

### PostgreSQL (Auto-generated)
```env
DATABASE_URL=postgresql://...  # Auto-generated
```

### API Service
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-64-char-secret
NODE_ENV=production
PORT=3002
FRONTEND_URL=https://your-web.up.railway.app
ADMIN_URL=https://your-admin.up.railway.app
```

### Web Service
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api.up.railway.app
NEXT_TELEMETRY_DISABLED=1
```

### Admin Service
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api.up.railway.app
NEXT_TELEMETRY_DISABLED=1
```

---

## 🔄 Automatic Deployments

Railway auto-deploys when you push to the main branch:

1. Push code → All services rebuild
2. Each service only rebuilds its own directory (if configured)

To disable auto-deploy for a service:
1. Settings → Deploy → Auto-Deploy → Toggle Off

---

## 🐛 Troubleshooting

### Build Fails: "Could not find Prisma Schema"

**Solution:** Ensure the API service has:
- Root Directory: `packages/api`
- Build Command includes `npx prisma generate`

### Database Connection Refused

**Solution:**
1. Check `DATABASE_URL` is set correctly
2. Use `${{Postgres.DATABASE_URL}}` for automatic linking
3. Ensure PostgreSQL service is running

### CORS Errors

**Solution:** Update API environment variables:
```env
FRONTEND_URL=https://your-actual-web-url.up.railway.app
ADMIN_URL=https://your-actual-admin-url.up.railway.app
```

### Next.js: Module Not Found

**Solution:** Build command should install from monorepo root:
```bash
cd ../.. && pnpm install && pnpm build --filter @takeweb/web...
```

### Out of Memory

**Solution:**
1. Increase service memory in Settings → Resources
2. Or add: `NODE_OPTIONS=--max_old_space_size=4096`

---

## 💰 Cost Estimation

### Railway Pricing

| Service | RAM | Estimated Cost |
|---------|-----|----------------|
| PostgreSQL | 512MB | ~$5/month |
| API | 512MB | ~$5/month |
| Web | 512MB | ~$5/month |
| Admin | 256MB | ~$3/month |
| **Total** | | **~$18/month** |

**Free Tier:** Railway offers $5 free credits monthly.

---

## 🚀 Quick Commands (Railway CLI)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs -s web
railway logs -s api
railway logs -s admin

# Run commands in service
railway run -s api npx prisma migrate deploy
railway run -s api npx prisma db seed

# Open dashboard
railway open
```

---

## ✅ Deployment Checklist

- [ ] PostgreSQL database created
- [ ] API service deployed with Prisma migrations
- [ ] Web frontend deployed
- [ ] Admin dashboard deployed
- [ ] Environment variables configured
- [ ] Cross-service URLs updated
- [ ] Custom domains configured (optional)
- [ ] HTTPS enabled (automatic)
- [ ] Tested all services work together

---

## 📞 Support

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Railway Discord:** [discord.gg/railway](https://discord.gg/railway)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **NestJS Docs:** [docs.nestjs.com](https://docs.nestjs.com)

---

*Last Updated: January 2026*
