import { IsString, IsOptional, IsBoolean, IsArray, IsObject, MaxLength } from 'class-validator';

export class CreateSchemaTemplateDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsString()
    schemaType: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsObject()
    template: Record<string, any>;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    entityTypes?: string[];

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateSchemaTemplateDto extends CreateSchemaTemplateDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    schemaType?: string;

    @IsOptional()
    template?: Record<string, any>;
}

// Pre-defined schema types
export const SCHEMA_TYPES = [
    { type: 'Article', description: 'News, blog posts, and articles' },
    { type: 'NewsArticle', description: 'News articles' },
    { type: 'BlogPosting', description: 'Blog posts' },
    { type: 'Product', description: 'Products with pricing and availability' },
    { type: 'LocalBusiness', description: 'Local business information' },
    { type: 'Organization', description: 'Company or organization' },
    { type: 'Person', description: 'Person profile' },
    { type: 'Event', description: 'Events with date, location, and tickets' },
    { type: 'FAQPage', description: 'Frequently asked questions' },
    { type: 'HowTo', description: 'How-to guides and tutorials' },
    { type: 'Recipe', description: 'Recipes with ingredients and instructions' },
    { type: 'Review', description: 'Reviews and ratings' },
    { type: 'Course', description: 'Online courses' },
    { type: 'JobPosting', description: 'Job listings' },
    { type: 'Service', description: 'Services offered' },
    { type: 'SoftwareApplication', description: 'Software and apps' },
    { type: 'VideoObject', description: 'Video content' },
    { type: 'WebPage', description: 'Generic web page' },
    { type: 'BreadcrumbList', description: 'Navigation breadcrumbs' },
    { type: 'WebSite', description: 'Website with search' },
];

// Default schema templates
export const DEFAULT_SCHEMA_TEMPLATES = {
    Article: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: '{{title}}',
        description: '{{description}}',
        image: '{{image}}',
        author: {
            '@type': 'Person',
            name: '{{author.name}}',
        },
        publisher: {
            '@type': 'Organization',
            name: '{{site.name}}',
            logo: {
                '@type': 'ImageObject',
                url: '{{site.logo}}',
            },
        },
        datePublished: '{{publishedAt}}',
        dateModified: '{{updatedAt}}',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': '{{url}}',
        },
    },
    FAQPage: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: '{{faqs}}',
    },
    LocalBusiness: {
        '@context': 'https://schema.org',
        '@type': '{{businessType}}',
        name: '{{name}}',
        image: '{{image}}',
        '@id': '{{url}}',
        url: '{{url}}',
        telephone: '{{phone}}',
        priceRange: '{{priceRange}}',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '{{address.street}}',
            addressLocality: '{{address.city}}',
            addressRegion: '{{address.region}}',
            postalCode: '{{address.postalCode}}',
            addressCountry: '{{address.country}}',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '{{geo.latitude}}',
            longitude: '{{geo.longitude}}',
        },
        openingHoursSpecification: '{{openingHours}}',
    },
    Service: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: '{{title}}',
        description: '{{description}}',
        provider: {
            '@type': 'Organization',
            name: '{{site.name}}',
        },
        areaServed: '{{areaServed}}',
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: '{{title}}',
            itemListElement: '{{services}}',
        },
    },
    JobPosting: {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: '{{title}}',
        description: '{{description}}',
        datePosted: '{{createdAt}}',
        validThrough: '{{deadline}}',
        employmentType: '{{type}}',
        hiringOrganization: {
            '@type': 'Organization',
            name: '{{site.name}}',
            sameAs: '{{site.url}}',
            logo: '{{site.logo}}',
        },
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: '{{location}}',
            },
        },
        baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'INR',
            value: {
                '@type': 'QuantitativeValue',
                minValue: '{{minSalary}}',
                maxValue: '{{maxSalary}}',
                unitText: 'YEAR',
            },
        },
    },
    BreadcrumbList: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: '{{breadcrumbs}}',
    },
    WebSite: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '{{site.name}}',
        url: '{{site.url}}',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: '{{site.url}}/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    },
};
