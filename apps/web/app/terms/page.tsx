import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getSitePage } from "@/lib/strapi";

export default async function TermsPage() {
    const page = await getSitePage("terms");
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
