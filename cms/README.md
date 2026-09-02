# TakeWeb CMS

This folder contains the Strapi CMS for the TakeWeb public website.

## Run With Docker

From the repo root:

```bash
docker compose up cms
```

Strapi will be available at:

```text
http://localhost:1337/admin
```

Use `localhost`, not `0.0.0.0`, in the browser.

The first time it opens, create the Strapi admin user.

## Content Types

The CMS already includes these collection types:

- Global
- Home Page
- Service
- Blog Post
- Project
- Job

Home Page is a single type with proper component fields for Hero, moving tiles, stats, services, Why TakeWeb, testimonials, and CTA. Draft/publish is disabled for the first content types; use `isActive` and `isPublished` to control visibility.

They are stored in `src/api/*/content-types/*/schema.json` and `src/components`, which is the normal Strapi project format.

## Public Website Env

Set this for `apps/web`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

If the content is not publicly readable, also set:

```bash
STRAPI_API_TOKEN=your-read-token
```

## Seed Current Site Content

After Strapi is running and you create an API token with create permissions:

```bash
STRAPI_URL=http://localhost:1337 STRAPI_API_TOKEN=your-token node scripts/seed-strapi.mjs
```
