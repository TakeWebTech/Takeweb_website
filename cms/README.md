# TakeWeb CMS

This folder contains the Strapi schemas and components used by the TakeWeb
public website. Production runs in the existing Coolify Strapi service at
`https://cms.takeweb.in`.

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

## Existing Coolify Service

The Coolify service already owns its server configuration, environment,
PostgreSQL database, and uploads. Do not replace or copy any of those settings.

If an earlier migration copied repository config files into the service, remove
only this mount from the Strapi service Compose definition and redeploy:

```yaml
- "strapi-config:/opt/app/config"
```

This restores the stock Strapi image configuration. Do not remove the
PostgreSQL or uploads volumes.

To install or update only the TakeWeb schemas and their API files, open the
Strapi container terminal and run:

```sh
set -eu
rm -rf /tmp/takeweb-cms /tmp/takeweb-cms.tar.gz
wget -qO /tmp/takeweb-cms.tar.gz \
  https://github.com/TakeWebTech/Takeweb_website/archive/refs/heads/main.tar.gz
mkdir -p /tmp/takeweb-cms
tar -xzf /tmp/takeweb-cms.tar.gz -C /tmp/takeweb-cms --strip-components=1
rm -rf /opt/app/src/api /opt/app/src/components
cp -R /tmp/takeweb-cms/cms/src/api /opt/app/src/api
cp -R /tmp/takeweb-cms/cms/src/components /opt/app/src/components
```

Restart the Strapi resource after copying the files. The database and uploaded
media remain in their existing persistent volumes. This migration does not
touch `/opt/app/config`, the admin application, server settings, environment
variables, PostgreSQL, or `/opt/app/public/uploads`.

## Seed Current Website Content

After the schemas are visible, create a temporary full-access API token in
Strapi and run from the repository root:

```bash
STRAPI_URL=https://cms.takeweb.in \
STRAPI_API_TOKEN=<temporary-write-token> \
node scripts/seed-strapi.mjs
```

Delete the write token after seeding and create a read-only token for Vercel.

## Connect Vercel

Configure these server-only variables in the Vercel project and redeploy:

```dotenv
STRAPI_URL=https://cms.takeweb.in
STRAPI_API_TOKEN=<read-only-token>
ERP_BASE_URL=https://admin.takeweb.in
```

Do not use `NEXT_PUBLIC_STRAPI_URL`; CMS credentials and requests remain on the
Next.js server. `STRAPI_URL` is also read during the Vercel build so Next Image
can allow media served from the CMS uploads path.

## Refresh Fallback Content

After important CMS content changes, refresh the checked-in fallback snapshot:

```bash
STRAPI_URL=https://cms.takeweb.in \
STRAPI_API_TOKEN=<read-only-token> \
node scripts/sync-strapi-fallback.mjs
```

Commit the generated fallback update so the latest known content remains
available if Strapi is temporarily unavailable.
