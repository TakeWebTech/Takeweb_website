import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getSitePage } from "@/lib/strapi";

export default async function AboutPage() {
    const page = await getSitePage("about");
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
