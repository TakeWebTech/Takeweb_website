import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";

export const revalidate = 1800;

interface BlogPost {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    publishedAt?: string;
    metaTitle?: string;
    metaDescription?: string;
    author?: { firstName: string; lastName: string };
    category?: { name: string };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getPost(slug: string): Promise<BlogPost | null> {
    const res = await fetch(`${API_URL}/api/v1/blog/posts/${slug}`, { next: { revalidate } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch blog post");
    return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug).catch(() => null);
    if (!post) return {};

    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        openGraph: {
            title: post.metaTitle || post.title,
            description: post.metaDescription || post.excerpt,
            images: post.coverImage ? [post.coverImage] : undefined,
            type: "article",
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) notFound();

    return (
        <article className="section-padding">
            <div className="container-main max-w-3xl">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary-500 mb-8">
                    <ArrowLeft size={16} /> Back to Blog
                </Link>

                <div className="mb-8">
                    <span className="text-sm font-medium text-primary-500">{post.category?.name || "Insights"}</span>
                    <h1 className="text-[var(--text-primary)] mt-3 mb-4">{post.title}</h1>
                    {post.excerpt && <p className="text-lg text-[var(--text-tertiary)]">{post.excerpt}</p>}
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)] mt-6">
                        <span className="inline-flex items-center gap-1">
                            <User size={14} /> {post.author?.firstName} {post.author?.lastName}
                        </span>
                        {post.publishedAt && (
                            <span className="inline-flex items-center gap-1">
                                <Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                {post.coverImage && (
                    <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl mb-10 object-cover" />
                )}

                <div className="prose prose-invert max-w-none text-[var(--text-secondary)] whitespace-pre-wrap leading-8">
                    {post.content}
                </div>
            </div>
        </article>
    );
}
