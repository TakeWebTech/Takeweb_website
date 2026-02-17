import type { MetadataRoute } from 'next';

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
            url: `${baseUrl}/careers`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    // Service pages
    const servicePages: MetadataRoute.Sitemap = [
        '/services/it-consulting',
        '/services/software-development',
        '/services/cloud-devops',
        '/services/ai-data-analytics',
        '/services/cybersecurity',
        '/services/enterprise-solutions',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
    }));

    // Fetch dynamic blog posts
    let blogPosts: MetadataRoute.Sitemap = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/v1/blog`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (response.ok) {
            const posts = await response.json();
            blogPosts = posts.map((post: any) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.updatedAt || post.createdAt),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            }));
        }
    } catch (error) {
        console.log('Sitemap: Could not fetch blog posts:', error);
    }

    // Fetch dynamic projects
    let projects: MetadataRoute.Sitemap = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/v1/projects`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (response.ok) {
            const projectsList = await response.json();
            projects = projectsList.map((project: any) => ({
                url: `${baseUrl}/projects/${project.slug}`,
                lastModified: new Date(project.updatedAt || project.createdAt),
                changeFrequency: 'monthly' as const,
                priority: 0.75,
            }));
        }
    } catch (error) {
        console.log('Sitemap: Could not fetch projects:', error);
    }

    // Combine all entries
    return [...staticPages, ...servicePages, ...blogPosts, ...projects];
}
