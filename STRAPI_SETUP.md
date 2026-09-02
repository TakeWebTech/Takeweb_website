# TakeWeb Strapi Setup

This project should use Strapi as the single content source for the public website.

## Environment

Add these values for `apps/web`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-read-token
```

`STRAPI_API_TOKEN` is optional only when the Strapi public role can read the content.

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
- `features`: JSON
- `benefits`: JSON
- `technologies`: JSON
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
- `technologies`: JSON
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
- `benefits`: JSON
- `deadline`: Date
- `isRemote`: Boolean, default false
- `isActive`: Boolean, default true

## Permissions

In Strapi admin, open `Settings > Users & Permissions > Roles > Public` and allow `find` and `findOne` for:

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
