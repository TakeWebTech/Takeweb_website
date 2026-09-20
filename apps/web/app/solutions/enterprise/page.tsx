import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getSitePage } from "@/lib/strapi";

export default async function Page() {
    const page = await getSitePage("enterprise");
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
