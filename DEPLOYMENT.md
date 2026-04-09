# TakeWeb Deployment Guide

Complete guide for deploying TakeWeb to free-tier cloud services.

## Overview

| Service | Platform | Free Tier |
|---------|----------|-----------|
| Frontend | Vercel | Unlimited |
| Admin Panel | Vercel | Unlimited |
| Backend API | Render | 750 hrs/month |
| Database | Neon | 0.5GB storage |
| Media/CDN | Cloudinary | 25GB bandwidth |

---

## 1. Database (Neon PostgreSQL)

### Setup Steps
1. Create account at [neon.tech](https://neon.tech)
2. Create new project: "TakeWeb Production"
3. Copy the connection string

### Connection String Format
```
postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

---

## 2. Backend API (Render)

### Setup Steps
1. Create account at [render.com](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| Name | `takeweb-api` |
| Root Directory | `packages/api` |
| Build Command | `pnpm install && npx prisma generate && pnpm build` |
| Start Command | `pnpm start:prod` |
| Instance Type | Free |

### Environment Variables
```bash
DATABASE_URL=<your-neon-connection-string>
JWT_SECRET=<generate-secure-random-string>
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://takeweb.vercel.app
ADMIN_URL=https://takeweb-admin.vercel.app
```

---

## 3. Frontend (Vercel)

### Setup Steps
1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Root Directory | `apps/web` |
| Build Command | (leave default) |

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://takeweb-api.onrender.com
NEXT_PUBLIC_SITE_URL=https://takeweb.vercel.app
```

---

## 4. Admin Panel (Vercel)

Create a **second Vercel project** for admin:

| Setting | Value |
|---------|-------|
| Root Directory | `apps/admin` |
| Build Command | (leave default) |

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://takeweb-api.onrender.com
```

---

## 5. Custom Domain (Optional)

### Cloudflare Setup
1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Add DNS records:

```
A     @       76.76.21.21      (Vercel)
CNAME www     cname.vercel-dns.com
CNAME api     takeweb-api.onrender.com
CNAME admin   takeweb-admin.vercel.app
```

### Vercel Domain Config
1. Go to Project Settings > Domains
2. Add custom domain
3. Vercel will auto-provision SSL

---

## Deployment Commands

### Initial Deploy
```bash
# Push to GitHub - auto-deploys to Vercel/Render
git add .
git commit -m "Production ready"
git push origin main
```

### Database Migration
```bash
# Run once after initial deploy
cd packages/api
DATABASE_URL="<production-url>" npx prisma db push
```

### Create Admin User
```bash
# Use API to create first admin
curl -X POST https://takeweb-api.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@takeweb.in","password":"securepassword123","firstName":"Admin","lastName":"User"}'
```

---

## Cost Summary (Free Tier)

| Service | Monthly Cost | Limits |
|---------|-------------|--------|
| Vercel | $0 | 100GB bandwidth |
| Render | $0 | 750 hrs, spins down on idle |
| Neon | $0 | 0.5GB, 3GB transfer |
| Cloudinary | $0 | 25GB bandwidth |
| **Total** | **$0** | |

---

## Production Checklist

- [ ] Update JWT_SECRET with secure random string
- [ ] Set all environment variables
- [ ] Run Prisma migrations on Neon
- [ ] Create admin user
- [ ] Test all pages on production URLs
- [ ] Set up custom domain (optional)
- [ ] Configure Cloudflare SSL (optional)
