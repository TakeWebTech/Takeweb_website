import type { MetadataRoute } from 'next';
import { getBlogPosts, getProjects, getServices } from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://takeweb.in';

    // Static pages with priorities and change frequencies
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/partnerships`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/status`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    const servicePages: MetadataRoute.Sitemap = (await getServices()).map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
    }));

    const blogPosts: MetadataRoute.Sitemap = (await getBlogPosts()).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const projects: MetadataRoute.Sitemap = (await getProjects()).map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.75,
    }));

    // Combine all entries
    return [...staticPages, ...servicePages, ...blogPosts, ...projects];
}
