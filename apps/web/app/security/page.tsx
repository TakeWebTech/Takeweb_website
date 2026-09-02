import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getSitePage } from "@/lib/strapi";

export default async function SecurityPage() {
    const page = await getSitePage("security");
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
