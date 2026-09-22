import fs from "node:fs";

const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/$/, "");
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL) {
  console.error("Missing STRAPI_URL. Set it to the deployed Strapi URL.");
  process.exit(1);
}

if (!TOKEN) {
  console.error("Missing STRAPI_API_TOKEN. Create a Strapi read token before syncing fallback content.");
  process.exit(1);
}

async function strapiFetch(path) {
  const res = await fetch(`${STRAPI_URL}/api/${path.replace(/^\//, "")}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error(`${path}: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  return json.data;
}

function stripStrapiMeta(value) {
  if (Array.isArray(value)) return value.map(stripStrapiMeta);
  if (!value || typeof value !== "object") return value;

  const output = {};
  for (const [key, item] of Object.entries(value)) {
    if (["id", "documentId", "createdAt", "updatedAt", "publishedAt", "createdBy", "updatedBy", "locale", "localizations"].includes(key)) {
      continue;
    }
    output[key] = stripStrapiMeta(item);
  }
  return output;
}

const sitePages = await strapiFetch("site-pages?pagination[pageSize]=100&populate[hero][populate]=*&populate[sections][on][page.card-grid-section][populate][heading]=*&populate[sections][on][page.card-grid-section][populate][cards]=*&populate[sections][on][page.people-section][populate][heading]=*&populate[sections][on][page.people-section][populate][people][populate]=*&populate[sections][on][page.timeline-section][populate][heading]=*&populate[sections][on][page.timeline-section][populate][items]=*&populate[sections][on][page.legal-content-section][populate][sections][populate][items]=*&populate[sections][on][page.legal-content-section][populate][cta]=*&populate[sections][on][page.contact-section][populate]=*&populate[sections][on][page.status-section][populate]=*&populate[sections][on][home.cta-section][populate]=*");
const fallbackSitePages = stripStrapiMeta(sitePages);

const body = `export type CmsTextItem = { text: string };

export type CmsPage = {
    title: string;
    slug: string;
    path: string;
    seoTitle?: string;
    seoDescription?: string;
    hero?: {
        overline?: string;
        title: string;
        titleHighlight?: string;
        description?: string;
        image?: string;
        primaryCta?: { label: string; href: string; variant?: string };
        secondaryCta?: { label: string; href: string; variant?: string };
    };
    sections?: Array<Record<string, unknown>>;
    isActive?: boolean;
    sortOrder?: number;
};

export const fallbackSitePages: CmsPage[] = ${JSON.stringify(fallbackSitePages, null, 4)};
`;

fs.writeFileSync("apps/web/content/site-pages.ts", body);
console.log(`Synced ${fallbackSitePages.length} site pages into apps/web/content/site-pages.ts`);
