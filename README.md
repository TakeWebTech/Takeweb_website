<p align="center">
  <img src="https://via.placeholder.com/200x80/0A0F1A/4A90E2?text=TakeWeb" alt="TakeWeb Logo" width="200" />
</p>

<h1 align="center">TakeWeb Enterprise Website</h1>

<p align="center">
  <strong>Next-generation enterprise IT solutions platform</strong>
  <br />
  Premium design • SEO-optimized • Custom CMS • Production-ready
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Development Commands](#-development-commands)
- [Database Setup](#-database-setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Features](#-features)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

TakeWeb is a **complete enterprise-grade website ecosystem** featuring:

| Component | Description | Port |
|-----------|-------------|------|
| **Public Website** | Next.js 15 frontend with 8+ SEO-optimized pages | 3000 |
| **Admin CMS** | Full-featured content management system | 3001 |
| **Backend API** | NestJS REST API with JWT authentication | 4000 |
| **Database** | PostgreSQL with Prisma ORM | 5433 |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 20+ | `node --version` |
| pnpm | 8+ | `pnpm --version` |
| Docker | Latest | `docker --version` |
| Git | Latest | `git --version` |

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/takeweb-website.git
cd takeweb-website

# Install all dependencies
pnpm install
```

### Step 2: Start Database (Docker)

```bash
# Start PostgreSQL container (runs on port 5433)
docker compose up -d

# Verify container is running
docker ps
```

> **Note**: The database runs on port **5433** to avoid conflicts with other PostgreSQL instances.

### Step 3: Setup Backend

```bash
# Navigate to API directory
cd packages/api

# Create .env file (copy and modify)
cp .env.example .env
# OR create manually with contents below

# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Step 4: Start All Services

Open **3 terminals** and run:

```bash
# Terminal 1: Backend API (http://localhost:4000)
cd packages/api
pnpm start:dev

Service	Email	Password
Admin Panel	admin@takeweb.in	admin
PGAdmin	admin@takeweb.com	admin

# Terminal 2: Public Website (http://localhost:3000)
pnpm dev --filter @takeweb/web

# Terminal 3: Admin Panel (http://localhost:3001)
pnpm dev --filter @takeweb/admin
```

### ✅ Verify Everything Works

| Service | URL | Expected |
|---------|-----|----------|
| Public Website | http://localhost:3000 | Homepage loads |
| Admin Panel | http://localhost:3001 | Login page loads |
| API Health | http://localhost:4000/api/v1 | JSON response |
| Prisma Studio | `npx prisma studio` | Database UI |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | Latest | Animations |
| TypeScript | 5.x | Type safety |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 11.x | Node.js framework |
| Prisma | 6.x | Database ORM |
| PostgreSQL | 16 | Database |
| Passport JWT | Latest | Authentication |
| bcryptjs | Latest | Password hashing |

### Infrastructure

| Service | Purpose | Tier |
|---------|---------|------|
| Docker | Local PostgreSQL | Free |
| Vercel | Frontend hosting | Free |
| Render | Backend hosting | Free |
| Neon | Production PostgreSQL | Free |
| Cloudinary | Media CDN | Free |

---

## 📁 Project Structure

```
TakeWeb/Website/
│
├── apps/                          # Application packages
│   ├── web/                       # Public website (Next.js)
│   │   ├── app/                   # App Router pages
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── about/             # About page
│   │   │   ├── services/          # Services pages
│   │   │   ├── projects/          # Portfolio
│   │   │   ├── careers/           # Job listings
│   │   │   ├── blog/              # Blog system
│   │   │   └── contact/           # Contact form
│   │   ├── components/            # React components
│   │   └── public/                # Static assets
│   │
│   ├── admin/                     # Admin CMS Panel (Next.js)
│   │   ├── app/                   # Dashboard pages
│   │   │   ├── dashboard/         # Overview
│   │   │   ├── posts/             # Blog management
│   │   │   ├── services/          # Services management
│   │   │   ├── projects/          # Portfolio management
│   │   │   ├── contacts/          # Form submissions
│   │   │   └── settings/          # Site settings
│   │   └── components/            # Admin UI components
│   │
│   └── docs/                      # Documentation site
│
├── packages/                      # Shared packages
│   ├── api/                       # Backend API (NestJS)
│   │   ├── src/
│   │   │   ├── auth/              # JWT authentication
│   │   │   ├── blog/              # Blog CRUD
│   │   │   ├── contact/           # Contact submissions
│   │   │   ├── careers/           # Job listings
│   │   │   ├── services/          # Services CRUD
│   │   │   ├── projects/          # Portfolio CRUD
│   │   │   └── prisma/            # Database service
│   │   ├── prisma/
│   │   │   └── schema.prisma      # Database schema (15+ models)
│   │   └── .env                   # Environment variables
│   │
│   ├── ui/                        # Shared UI components
│   ├── eslint-config/             # ESLint configurations
│   └── typescript-config/         # TypeScript configurations
│
├── docker-compose.yml             # PostgreSQL container config
├── render.yaml                    # Render deployment config
├── vercel.json                    # Vercel deployment config
├── turbo.json                     # Turborepo config
├── pnpm-workspace.yaml            # pnpm workspace config
└── package.json                   # Root package.json
```

---

## 💻 Development Commands

### Root Level Commands

```bash
# Install all dependencies
pnpm install

# Run all apps in development
pnpm dev

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean
```

### Frontend Commands

```bash
# Start public website (port 3000)
pnpm dev --filter @takeweb/web

# Start admin panel (port 3001)
pnpm dev --filter @takeweb/admin

# Build for production
pnpm build --filter @takeweb/web
pnpm build --filter @takeweb/admin
```

### Backend API Commands

```bash
# Navigate to API directory first
cd packages/api

# Start in development mode (with hot reload)
pnpm start:dev

# Start in production mode
pnpm start:prod

# Build for production
pnpm build

# Run tests
pnpm test
```

### Database Commands

```bash
# Navigate to API directory first
cd packages/api

# Push schema changes to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name <migration_name>

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database with initial data
npx prisma db seed
```

### Docker Commands

```bash
# Start PostgreSQL container
docker compose up -d

# Stop container
docker compose down

# View logs
docker logs takeweb-postgres

# Reset database completely
docker compose down -v
docker compose up -d

# Check container status
docker ps

# Connect to PostgreSQL directly
docker exec -it takeweb-postgres psql -U postgres -d takeweb
```

---

## 🗄 Database Setup

### Local Development (Docker)

The project uses Docker for local PostgreSQL. The database runs on **port 5433** to avoid conflicts.

**docker-compose.yml:**
```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: takeweb-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: takeweb
    ports:
      - "5433:5432"
    volumes:
      - takeweb_pgdata:/var/lib/postgresql/data

volumes:
  takeweb_pgdata:
```

### Database Schema

The Prisma schema includes **15+ models**:

| Category | Models | Description |
|----------|--------|-------------|
| **Auth** | User, Session | User authentication and sessions |
| **Blog** | BlogPost, Category, Tag, TagsOnPosts | Content management |
| **Portfolio** | Service, Project, ProjectImage | Service offerings and case studies |
| **Careers** | Career, JobApplication | Job listings and applications |
| **Content** | Testimonial, TeamMember | Social proof and team profiles |
| **Forms** | ContactSubmission, NewsletterSubscriber | Form data |
| **System** | Media, SiteSetting | File uploads and configuration |

### User Roles

| Role | Permissions |
|------|-------------|
| `ADMIN` | Full access to all modules |
| `EDITOR` | Edit and publish all content |
| `AUTHOR` | Create content, limited publishing |
| `VIEWER` | Read-only access |

---

## 🔐 Environment Variables

### Backend API (`packages/api/.env`)

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Database Configuration (Local Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/takeweb"

# Optional: Production settings
# JWT_EXPIRES_IN=7d
# FRONTEND_URL=https://takeweb.vercel.app
# ADMIN_URL=https://takeweb-admin.vercel.app
```

### Generate a Secure JWT Secret

```bash
# Run this command to generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Admin Panel (`apps/admin/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

---

## 📡 API Documentation

### Base URL

- **Local**: `http://localhost:4000/api/v1`
- **Production**: `https://takeweb-api.onrender.com/api/v1`

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Create new user | No |
| POST | `/auth/login` | Login, returns JWT | No |
| GET | `/auth/me` | Get current user | Yes |

**Login Request:**
```json
{
  "email": "admin@takeweb.in",
  "password": "your-password"
}
```

**Login Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxyz...",
    "email": "admin@takeweb.in",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }
}
```

### Blog Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/blog/posts` | List published posts | No |
| GET | `/blog/posts/:slug` | Get post by slug | No |
| GET | `/blog/categories` | List categories | No |
| GET | `/blog/tags` | List tags | No |
| POST | `/blog/admin/posts` | Create new post | Yes |
| PUT | `/blog/admin/posts/:id` | Update post | Yes |
| DELETE | `/blog/admin/posts/:id` | Delete post | Yes |

### Contact Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/contact` | Submit contact form | No |
| GET | `/contact/admin` | List submissions | Yes |
| GET | `/contact/admin/:id` | Get submission details | Yes |
| PATCH | `/contact/admin/:id` | Update status | Yes |

### Services Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/services` | List active services | No |
| GET | `/services/:slug` | Get service by slug | No |
| POST | `/services/admin` | Create service | Yes |
| PUT | `/services/admin/:id` | Update service | Yes |

### Using JWT Authentication

Add the JWT token to the Authorization header:

```bash
curl -X GET http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ✨ Features

### Public Website (8+ Pages)

| Page | Key Features |
|------|--------------|
| **Home** | Animated hero, stats counters, services grid, testimonials |
| **About** | Company timeline, mission/vision, leadership team |
| **Services** | 6 SEO pillar pages with benefits, technologies, use cases |
| **Projects** | Case studies with outcomes, filterable by technology |
| **Careers** | Culture section, benefits, open positions |
| **Blog** | Categories, tags, author bios, newsletter signup |
| **Contact** | Smart form with service selection, response time indicator |
| **Testimonials** | Video ready, star ratings, client logos |

### Admin CMS Panel

| Module | Features |
|--------|----------|
| **Dashboard** | Stats cards, recent activity, quick actions |
| **Blog Posts** | CRUD, status filters, SEO fields, rich editor |
| **Services** | Drag-to-reorder, active toggle |
| **Projects** | Grid cards, featured badges |
| **Contacts** | List + detail panel, status management |
| **Careers** | Job listings with applications |
| **Settings** | Profile, site config, notifications, security |

### SEO & Performance

- Dynamic sitemap generation
- robots.txt automation
- Security headers (XSS, CSRF protection)
- Image optimization via Next.js
- Core Web Vitals optimized (90+ Lighthouse score)

---

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

### Quick Deploy Checklist

| Step | Service | Action |
|------|---------|--------|
| 1 | **Neon** | Create free PostgreSQL at [neon.tech](https://neon.tech) |
| 2 | **Render** | Deploy backend using `render.yaml` |
| 3 | **Vercel** | Deploy frontend (auto-detects Next.js) |

### Production Environment Variables

**Backend (Render):**
```env
DATABASE_URL=postgresql://user:pass@xxx.neon.tech/takeweb?sslmode=require
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://takeweb.vercel.app
ADMIN_URL=https://takeweb-admin.vercel.app
```

**Frontend (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://takeweb-api.onrender.com/api/v1
NEXT_PUBLIC_SITE_URL=https://takeweb.vercel.app
```

---

## 🔧 Troubleshooting

### Common Issues

#### Docker container won't start

```bash
# Check if port 5433 is in use
netstat -an | findstr :5433

# Remove existing container and retry
docker compose down -v
docker compose up -d
```

#### Prisma connection failed

```bash
# Check if database is running
docker ps

# Verify DATABASE_URL in .env
cat packages/api/.env

# Test connection manually
docker exec -it takeweb-postgres psql -U postgres -d takeweb -c "SELECT 1"
```

#### JWT_SECRET not defined

```bash
# Generate a new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to packages/api/.env
echo "JWT_SECRET=your-generated-secret" >> packages/api/.env
```

#### Port already in use

| Port | Used By | Solution |
|------|---------|----------|
| 3000 | Web | Kill process: `npx kill-port 3000` |
| 3001 | Admin | Kill process: `npx kill-port 3001` |
| 4000 | API | Kill process: `npx kill-port 4000` |
| 5433 | Database | `docker compose down` |

#### Fresh Start (Nuclear Option)

```bash
# Stop everything
docker compose down -v
rm -rf node_modules
rm -rf packages/api/node_modules
rm -rf apps/web/.next
rm -rf apps/admin/.next

# Reinstall and restart
pnpm install
docker compose up -d
cd packages/api && npx prisma db push && npx prisma generate
```

---

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Score | 90+ | ✅ |
| LCP | < 2.5s | ✅ |
| FID | < 100ms | ✅ |
| CLS | < 0.1 | ✅ |
| First Contentful Paint | < 1.8s | ✅ |

---

## 🛣 Roadmap

### Phase 1 ✅ Complete
- [x] Next.js frontend with 8+ pages
- [x] NestJS backend with JWT auth
- [x] Prisma database schema (15+ models)
- [x] Admin CMS panel
- [x] Docker development setup
- [x] Deployment configurations

### Phase 2 🔄 In Progress
- [ ] Cloudinary media library integration
- [ ] Schema.org structured data
- [ ] Email notifications (SendGrid)
- [ ] Sitemap XML generation

### Phase 3 📋 Planned
- [ ] GraphQL API layer
- [ ] Redis caching
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] A/B testing framework

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 📞 Contact

**TakeWeb** - Enterprise IT Solutions

- Website: [takeweb.in](https://takeweb.in)
- Email: hello@takeweb.in
- LinkedIn: [TakeWeb](https://linkedin.com/company/takeweb)

---

<p align="center">
  Built with ❤️ by <strong>TakeWeb</strong>
</p>
