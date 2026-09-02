import Image from "next/image";
import { notFound } from "next/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { getBlogPosts } from "@/lib/strapi";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = (await getBlogPosts()).find((item) => item.slug === slug);

    if (!post) notFound();

    return (
        <>
            <section className="relative pt-32 pb-12 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <span className="text-sm font-semibold uppercase tracking-widest text-primary-500">
                            {post.category}
                        </span>
                        <h1 className="text-[var(--text-primary)] mt-4 mb-6">{post.title}</h1>
                        <p className="text-lg text-[var(--text-tertiary)]">{post.excerpt}</p>
                        <div className="mt-6 text-sm text-[var(--text-muted)]">
                            {post.author} {post.readTime ? `• ${post.readTime} min read` : ""}
                        </div>
                    </div>
                </div>
            </section>

            {post.coverImage && (
                <div className="container-main pb-12">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--border-primary)]">
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                    </div>
                </div>
            )}

            <article className="container-main max-w-3xl pb-24">
                <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--text-secondary)] whitespace-pre-line">
                    {post.content}
                </div>
            </article>
        </>
    );
}
