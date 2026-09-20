import { notFound } from "next/navigation";
import { CmsPageRenderer } from "@/components/cms-page-renderer";
import { getSitePage } from "@/lib/strapi";

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getSitePage(slug);
    if (!page) notFound();
    return <CmsPageRenderer page={page} />;
}
