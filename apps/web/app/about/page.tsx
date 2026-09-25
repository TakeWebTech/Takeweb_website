import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getCompanyPage } from "@/lib/strapi";

export default async function AboutPage() {
    const page = await getCompanyPage();
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
