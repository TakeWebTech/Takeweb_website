import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://takeweb.in';

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/services',
        '/contact',
        '/careers',
        '/blog',
        '/projects',
    ];

    // Service pages
    const servicePages = [
        '/services/it-consulting',
        '/services/software-development',
        '/services/cloud-devops',
        '/services/ai-data-analytics',
        '/services/cybersecurity',
        '/services/enterprise-solutions',
    ];

    const allPages = [...staticPages, ...servicePages];

    return allPages.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route.startsWith('/services/') ? 0.9 : 0.8,
    }));
}
