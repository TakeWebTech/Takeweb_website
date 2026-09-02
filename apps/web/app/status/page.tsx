import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getSitePage } from "@/lib/strapi";

export default async function StatusPage() {
    const page = await getSitePage("status");
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
