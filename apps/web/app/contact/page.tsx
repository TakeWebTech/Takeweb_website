import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getSitePage } from "@/lib/strapi";

export default async function ContactPage() {
    const page = await getSitePage("contact");
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
