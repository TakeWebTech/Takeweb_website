import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getSitePage } from "@/lib/strapi";

export default async function PrivacyPage() {
    const page = await getSitePage("privacy");
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
