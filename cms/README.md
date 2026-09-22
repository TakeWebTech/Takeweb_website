# TakeWeb CMS

TakeWeb CMS is a Strapi 5 application deployed from this repository. Its schema
is version-controlled under `cms/src`; content and uploads remain persistent in
PostgreSQL and Docker volumes on the Coolify VPS.

## Content Types

- Global
- Home Page
- Site Page
- Service
- Blog Post
- Project
- Job (legacy CMS type; public careers use ERPNext)

Draft/publish is disabled for the initial content types. Visibility uses the
existing `isActive` and `isPublished` fields.

## Create the Coolify Resource

After deleting the old one-click service, create a new resource in the same
Coolify project and environment:

1. Select **Private Repository (with GitHub App)**.
2. Select `TakeWebTech/Takeweb_website` and branch `main`.
3. Select the **Docker Compose** build pack.
4. Set **Base Directory** to `/cms`.
5. Set **Docker Compose Location** to `/docker-compose.coolify.yml`.
6. Save the configuration.
7. Assign `https://cms.takeweb.in:1337` to the `cms` service only.
8. Keep the `postgres` service private with no domain or public port.
9. Enable **Auto Deploy** for the `main` branch.
10. Deploy.

Coolify automatically generates the database credentials and Strapi secrets
referenced by the Compose file. Do not add localhost URLs or mount `src` or
`config` as persistent volumes.

The stack persists only stateful data:

- `cms_database`: PostgreSQL content, administrators, permissions, and tokens
- `cms_uploads`: uploaded media

The Strapi code, content types, components, and configuration are rebuilt from
GitHub on every deployment.

## Automatic Schema Deployment

After Auto Deploy is enabled, the workflow is:

```text
Edit cms/src or cms/config
-> commit
-> push to main
-> Coolify builds the CMS image
-> Strapi starts with the updated schema
```

PostgreSQL content and uploaded media remain intact during image replacement.
Back up both persistent volumes before destructive schema changes.

## Seed Current Website Content

After the first deployment:

1. Open `https://cms.takeweb.in/admin` and create the first administrator.
2. Create a temporary full-access API token.
3. Run from the repository root:

```bash
STRAPI_URL=https://cms.takeweb.in \
STRAPI_API_TOKEN=<temporary-write-token> \
node scripts/seed-strapi.mjs
```

Delete the write token after seeding. Create a read-only API token for Vercel.

## Connect Vercel

Set these server-only environment variables in Vercel and redeploy:

```dotenv
STRAPI_URL=https://cms.takeweb.in
STRAPI_API_TOKEN=<read-only-token>
ERP_BASE_URL=https://admin.takeweb.in
```

Do not use `NEXT_PUBLIC_STRAPI_URL`. The browser does not receive the CMS token
or call Strapi directly.

## Content Changes

Content editors can update entries directly in the Strapi admin. Those changes
are saved in PostgreSQL and do not require a code deployment.

Schema or component changes are made in this repository and deployed by pushing
to `main`.

## Refresh Website Fallback Content

After important content updates:

```bash
STRAPI_URL=https://cms.takeweb.in \
STRAPI_API_TOKEN=<read-only-token> \
node scripts/sync-strapi-fallback.mjs
```

Commit and push the generated fallback update so Vercel retains the latest
known content if the CMS is temporarily unavailable.
