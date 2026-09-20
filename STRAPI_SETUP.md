# TakeWeb Strapi Setup

This project should use Strapi as the single content source for the public website.

## Environment

Add these values for `apps/web`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-read-token
ERPNEXT_URL=https://your-erpnext-site.com
ERPNEXT_API_KEY=your-erpnext-api-key
ERPNEXT_API_SECRET=your-erpnext-api-secret
```

`STRAPI_API_TOKEN` is optional only when the Strapi public role can read the content.
ERPNext values are server-only and are used by the Careers page API routes.

## Content-Type Builder

The CMS schemas are already included under `cms/src/api` and `cms/src/components`. Start Strapi with Docker, then open `Content-Type Builder` to view and edit the fields.

Draft/publish is disabled for these first content types. Visibility is controlled through the existing `isActive` and `isPublished` fields.

### Home Page

API ID: `home-page`

Single type sections:

- `hero`: component with badge, title, highlighted title, description, primary CTA, secondary CTA, scroll indicator
- `partnerSlider`: component with eyebrow and repeatable partner tiles
- `stats`: repeatable stat items
- `servicesHeading`: section heading component
- `services`: repeatable service cards
- `whyTakeWeb`: component with section copy and repeatable feature cards
- `testimonialsHeading`: section heading component
- `testimonials`: repeatable testimonial cards
- `cta`: component with title, description, primary CTA, secondary CTA

### Site Page

API ID: `site-page`

Collection type for static public pages such as About, Contact, Partnerships, Security, Privacy, Terms, Status, and Coming Soon.

Fields:

- `title`: Text, required
- `slug`: UID based on title, required
- `path`: Text, required
- `seoTitle`: Text
- `seoDescription`: Text
- `hero`: Page Hero component
- `sections`: Dynamic zone using proper components:
  - Card Grid Section
  - People Section
  - Timeline Section
  - Legal Content Section
  - Contact Section
  - Status Section
  - CTA Section
- `isActive`: Boolean, default true
- `sortOrder`: Number, integer

### Global

API ID: `global`

Single type fields:

- `siteName`: Text, required
- `companyName`: Text
- `tagline`: Text
- `logo`: Media, single
- `email`: Email
- `phone`: Text
- `address`: Text
- `primaryCtaLabel`: Text
- `primaryCtaHref`: Text
- `navigation`: site navigation data
- `footerLinks`: footer column links
- `socialLinks`: social links
- `copyrightText`: Text

### Service

API ID: `service`

Fields:

- `title`: Text, required
- `slug`: UID based on `title`, required
- `shortDescription`: Text
- `description`: Rich text
- `icon`: Text
- `gradient`: Text
- `features`: repeatable Text Item component
- `benefits`: repeatable Text Item component
- `technologies`: repeatable Text Item component
- `sortOrder`: Number, integer
- `isActive`: Boolean, default true

### Blog Post

API ID: `blog-post`

Fields:

- `title`: Text, required
- `slug`: UID based on `title`, required
- `excerpt`: Text
- `content`: Rich text
- `coverImage`: Media, single
- `author`: Text
- `category`: Text
- `readTime`: Number, integer
- `isFeatured`: Boolean, default false
- `isPublished`: Boolean, default true
- `publishedAt`: DateTime

### Project

API ID: `project`

Fields:

- `title`: Text, required
- `slug`: UID based on `title`, required
- `client`: Text
- `industry`: Text
- `shortDescription`: Text
- `description`: Rich text
- `challenge`: Rich text
- `solution`: Rich text
- `results`: Text
- `technologies`: repeatable Text Item component
- `coverImage`: Media, single
- `isFeatured`: Boolean, default false
- `isActive`: Boolean, default true
- `sortOrder`: Number, integer

### Job

API ID: `job`

Fields:

- `title`: Text, required
- `slug`: UID based on `title`, required
- `department`: Text
- `location`: Text
- `type`: Enumeration: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`
- `minSalary`: Number
- `maxSalary`: Number
- `description`: Rich text
- `requirements`: Rich text
- `benefits`: repeatable Text Item component
- `deadline`: Date
- `isRemote`: Boolean, default false
- `isActive`: Boolean, default true

## Permissions

In Strapi admin, open `Settings > Users & Permissions > Roles > Public` and allow `find` and `findOne` for:

- Global
- Home Page
- Site Page
- Service
- Blog Post
- Project
- Job

Alternatively, create an API token and set `STRAPI_API_TOKEN`.

## Seed Current Website Content

After creating the content types, run:

```bash
STRAPI_URL=http://localhost:1337 STRAPI_API_TOKEN=your-token node scripts/seed-strapi.mjs
```

The script posts the existing website content into Strapi through the REST API, including the Home Page single type sections.

## Sync Latest Fallback Content

The website imports fallback page content from `apps/web/content/site-pages.ts`. If Strapi is down, the public pages keep rendering from that last synced snapshot.

After updating content in Strapi, run:

```bash
STRAPI_URL=http://localhost:1337 STRAPI_API_TOKEN=your-read-token node scripts/sync-strapi-fallback.mjs
```

Use the same command in deployment/CI after content changes if you want the fallback snapshot to update automatically.

## ERPNext Careers Integration

The Careers page calls local website API routes:

- `GET /api/careers/jobs`: reads open `Job Opening` records from ERPNext; falls back to Strapi jobs if ERPNext is unavailable.
- `POST /api/careers/apply`: creates a `Job Applicant` record in ERPNext.

Create an ERPNext API key/secret for a user with read access to `Job Opening` and create access to `Job Applicant`, then set the `ERPNEXT_*` environment variables above.
