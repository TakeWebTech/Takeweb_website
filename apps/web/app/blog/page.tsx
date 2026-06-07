import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Clock, User } from "lucide-react";

export const metadata: Metadata = {
    title: "Blog",
    description: "Insights, tutorials, and thought leadership from the TakeWeb team on enterprise IT, cloud, AI, and digital transformation.",
};

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: { firstName: string; lastName: string };
    category?: { name: string };
    readTime: number;
    publishedAt: string;
    status: string;
    viewCount: number;
}

async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/blog/posts`,
            { next: { revalidate: 1800 } } // Cache for 30 minutes
        );
        if (!res.ok) return [];
        const data = await res.json();
        const posts = Array.isArray(data) ? data : data.posts || [];
        return posts;
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return [];
    }
}

const categories = [
    "All",
    "Engineering",
    "Cloud & DevOps",
    "AI & ML",
    "Security",
    "Leadership",
];

export default async function BlogPage() {
    const allPosts = await getBlogPosts();
    const featuredPost = allPosts[0];
    const regularPosts = allPosts.slice(1, 7);

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />

                <div className="container-main relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">
                            Blog & Insights
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Thoughts on{" "}
                            <span className="gradient-text">Technology & Innovation</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)]">
                            Expert insights, tutorials, and thought leadership from our team
                            on enterprise technology, cloud, AI, and digital transformation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="pb-12">
                <div className="container-main">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${index === 0
                                    ? "bg-primary-500 text-white"
                                    : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="pb-16">
                    <div className="container-main">
                        <Link href={`/blog/${featuredPost.slug}`}>
                            <Card3D className="group overflow-hidden p-0">
                                <div className="grid md:grid-cols-2 gap-0">
                                    <div className="relative aspect-video md:aspect-auto">
                                        {featuredPost.coverImage ? (
                                            <Image
                                                src={featuredPost.coverImage}
                                                alt={featuredPost.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center text-6xl">
                                                📝
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 text-xs font-medium bg-primary-500 text-white rounded-full">
                                                Featured
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-10 flex flex-col justify-center">
                                        <span className="text-sm font-medium text-primary-500 mb-3">
                                            {featuredPost.category?.name || "Insights"}
                                        </span>
                                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-primary-500 transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-[var(--text-tertiary)] mb-6">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <User size={14} />
                                                {featuredPost.author?.firstName} {featuredPost.author?.lastName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {Math.max(1, Math.ceil((featuredPost.content?.length || 600) / 1200))} min read
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card3D>
                        </Link>
                    </div>
                </section>
            )}

            {/* All Posts */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader
                        overline="Latest Posts"
                        title="Recent"
                        titleHighlight="Articles"
                    />

                    {regularPosts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-[var(--text-tertiary)]">No blog posts available yet. Stay tuned!</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regularPosts.map((post) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`}>
                                        <Card3D className="h-full group overflow-hidden p-0">
                                            <div className="relative aspect-video">
                                                {post.coverImage ? (
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center text-4xl">
                                                        📝
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <span className="text-xs font-medium text-primary-500 mb-2 block">
                                                    {post.category?.name || "Insights"}
                                                </span>
                                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm text-[var(--text-tertiary)] mb-4 line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                                                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span>{Math.max(1, Math.ceil((post.content?.length || 600) / 1200))} min read</span>
                                                </div>
                                            </div>
                                        </Card3D>
                                    </Link>
                                ))}
                            </div>

                            {allPosts.length > 6 && (
                                <div className="text-center mt-12">
                                    <Link href="/blog?page=2" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-secondary)] rounded-xl hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors">
                                        Load More Articles
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-[var(--text-primary)] mb-4">
                            Stay Updated
                        </h2>
                        <p className="text-[var(--text-tertiary)] mb-8">
                            Subscribe to our newsletter for the latest insights, tutorials, and news.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-5 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 text-white font-semibold bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:shadow-[0_0_30px_-8px_oklch(55%_0.18_250_/_0.4)] transition-all"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
