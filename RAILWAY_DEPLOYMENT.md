# Railway Deployment Guide - TakeWeb Website

This guide will walk you through deploying the TakeWeb website to Railway step by step.

## Prerequisites

Before you begin, ensure you have:
- [ ] A **GitHub account** with your code pushed to a repository
- [ ] A **Railway account** (free tier available at [railway.app](https://railway.app))
- [ ] All changes committed and pushed to GitHub

---

## Step 1: Prepare Your Repository

### 1.1 Commit All Changes

Open your terminal in the project directory and run:

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Push to GitHub
git push origin main
```

### 1.2 Verify Files Exist

Ensure these files are in your repository root:
- ✅ `railway.json` - Railway configuration
- ✅ `nixpacks.toml` - Build configuration
- ✅ `package.json` - Project dependencies
- ✅ `pnpm-lock.yaml` - Dependency lock file

---

## Step 2: Create Railway Account & Project

### 2.1 Sign Up for Railway

1. Go to **[railway.app](https://railway.app)**
2. Click **"Login"** or **"Start a New Project"**
3. Sign up with your **GitHub account** (recommended for easy deployment)

### 2.2 Create a New Project

1. From the Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. If prompted, authorize Railway to access your GitHub repositories
4. Search for and select your **TakeWeb repository**

---

## Step 3: Configure the Deployment

### 3.1 Environment Variables

After selecting your repo, Railway will auto-detect it's a Node.js project. You may need to add these environment variables:

Click on your service → **Variables** tab → Add:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

### 3.2 Verify Build Settings

Railway should auto-detect the settings from `nixpacks.toml`, but verify:

Click on your service → **Settings** tab:

- **Build Command**: Should use nixpacks (automatic)
- **Start Command**: `cd apps/web && pnpm start`
- **Root Directory**: Leave empty (project root)

### 3.3 Configure Port (if needed)

Railway auto-assigns a port. Next.js will use the `PORT` environment variable automatically.

---

## Step 4: Deploy

### 4.1 Trigger Deployment

1. Railway should automatically start building after you connect the repo
2. Watch the **Build Logs** in the Deployments tab
3. Wait for the build to complete (usually 2-5 minutes)

### 4.2 Monitor Build Progress

In the Deployments tab, you'll see:
```
Building with Nixpacks...
Installing dependencies...
Building Next.js application...
Starting server...
```

### 4.3 Verify Deployment

Once deployed:
1. Railway will show a **green checkmark** ✅
2. Click on the **deployment URL** to view your site
3. The URL will look like: `https://your-project.up.railway.app`

---

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain

1. Go to your service → **Settings** → **Domains**
2. Click **"+ Custom Domain"**
3. Enter your domain (e.g., `takeweb.in`)
4. Railway will provide DNS records

### 5.2 Configure DNS

Add these records at your domain registrar:

**For root domain (takeweb.in):**
```
Type: CNAME
Name: @
Value: your-project.up.railway.app
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: your-project.up.railway.app
```

### 5.3 Enable HTTPS

Railway automatically provisions SSL certificates. Wait a few minutes after adding your domain.

---

## Step 6: Set Up Automatic Deployments

### 6.1 Auto-Deploy on Push

By default, Railway auto-deploys when you push to your main branch. To verify:

1. Go to **Settings** → **General**
2. Ensure **"Automatic Deployments"** is enabled
3. Select your deployment branch (usually `main`)

### 6.2 Deploy Previews (Optional)

Enable PR previews to test changes before merging:

1. Go to **Settings** → **Deployments**
2. Enable **"PR Deployments"**

---

## Troubleshooting

### Build Fails with "pnpm not found"

The `nixpacks.toml` should handle this, but if not:
1. Go to **Variables**
2. Add: `NIXPACKS_PKGS` = `nodejs_18,pnpm`

### Module Not Found Errors

Ensure all packages are in your `pnpm-lock.yaml`:
```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "Update lock file"
git push
```

### Port Binding Issues

Railway sets the `PORT` env variable. Next.js uses it automatically. If issues persist:
1. Go to **Variables**
2. Add: `PORT` = `3000`

### Out of Memory Errors

If the build runs out of memory:
1. Go to **Settings** → **General**
2. Increase the service memory limit
3. Or optimize your build in `package.json`

---

## Cost Estimation

Railway Pricing (as of 2024):

| Plan | Included | Price |
|------|----------|-------|
| **Hobby** | $5/month credits | Free |
| **Pro** | $20/month credits | $20/month |

For a simple Next.js site like TakeWeb:
- **Memory**: ~256MB-512MB
- **CPU**: Minimal
- **Estimated Cost**: Free tier should be sufficient

---

## Quick Reference

### Useful Railway CLI Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Deploy manually
railway up

# Open dashboard
railway open
```

### Environment Variables Summary

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## Next Steps After Deployment

1. ✅ Test all pages work correctly
2. ✅ Verify the 404 page displays properly
3. ✅ Test the contact form (if connected to a backend)
4. ✅ Check responsive design on mobile
5. ✅ Set up monitoring/analytics
6. ✅ Configure custom domain

---

## Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Status Page**: [status.railway.app](https://status.railway.app)

---

*Last updated: January 2026*
