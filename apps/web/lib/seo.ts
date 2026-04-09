import type { Metadata } from 'next';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    canonical?: string;
    type?: 'website' | 'article';
}

export function generateSEO({
    title,
    description,
    image = '/og-image.png',
    canonical,
    type = 'website',
}: SEOProps): Metadata {
    const baseUrl = 'https://takeweb.in';
    const fullTitle = `${title} | TakeWeb Enterprise`;

    return {
        title: fullTitle,
        description,
        openGraph: {
            title: fullTitle,
            description,
            images: [
                {
                    url: image.startsWith('http') ? image : `${baseUrl}${image}`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type,
            siteName: 'TakeWeb Enterprise',
            url: canonical ? `${baseUrl}${canonical}` : baseUrl,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [image.startsWith('http') ? image : `${baseUrl}${image}`],
        },
        alternates: canonical
            ? {
                canonical: `${baseUrl}${canonical}`,
            }
            : undefined,
    };
}
