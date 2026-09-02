import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getSitePage } from "@/lib/strapi";

export default async function ComingSoonPage() {
    const page = await getSitePage("coming-soon");
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
