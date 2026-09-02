import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getSitePage } from "@/lib/strapi";

export default async function PartnershipsPage() {
    const page = await getSitePage("partnerships");
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
