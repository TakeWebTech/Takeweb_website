import { IsString, IsOptional, IsBoolean, IsArray, IsObject, IsUrl, IsInt, IsNumber, MaxLength, Min, Max } from 'class-validator';

export class CreateSeoMetaDto {
    @IsString()
    entityType: string;

    @IsString()
    entityId: string;

    @IsString()
    entitySlug: string;

    // Focus Keywords
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    focusKeywords?: string[];

    @IsOptional()
    @IsBoolean()
    pillarContent?: boolean;

    @IsOptional()
    @IsBoolean()
    cornerstone?: boolean;

    // Basic SEO
    @IsOptional()
    @IsString()
    @MaxLength(70)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    description?: string;

    @IsOptional()
    @IsUrl()
    canonicalUrl?: string;

    // Meta Robots
    @IsOptional()
    @IsObject()
    metaRobots?: {
        index?: boolean;
        follow?: boolean;
        noarchive?: boolean;
        nosnippet?: boolean;
        noimageindex?: boolean;
        notranslate?: boolean;
        max_snippet?: number;
        max_image_preview?: 'none' | 'standard' | 'large';
        max_video_preview?: number;
    };

    // Open Graph
    @IsOptional()
    @IsString()
    @MaxLength(95)
    ogTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    ogDescription?: string;

    @IsOptional()
    @IsUrl()
    ogImage?: string;

    @IsOptional()
    @IsInt()
    ogImageWidth?: number;

    @IsOptional()
    @IsInt()
    ogImageHeight?: number;

    @IsOptional()
    @IsString()
    ogType?: string;

    @IsOptional()
    @IsUrl()
    ogVideo?: string;

    // Twitter Card
    @IsOptional()
    @IsString()
    @MaxLength(70)
    twitterTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    twitterDescription?: string;

    @IsOptional()
    @IsUrl()
    twitterImage?: string;

    @IsOptional()
    @IsString()
    twitterCardType?: string;

    // Schema Markup
    @IsOptional()
    @IsString()
    schemaType?: string;

    @IsOptional()
    @IsObject()
    schemaData?: Record<string, any>;
}

export class UpdateSeoMetaDto {
    @IsOptional()
    @IsString()
    entityType?: string;

    @IsOptional()
    @IsString()
    entityId?: string;

    @IsOptional()
    @IsString()
    entitySlug?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    focusKeywords?: string[];

    @IsOptional()
    @IsBoolean()
    pillarContent?: boolean;

    @IsOptional()
    @IsBoolean()
    cornerstone?: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(70)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    description?: string;

    @IsOptional()
    @IsUrl()
    canonicalUrl?: string;

    @IsOptional()
    @IsObject()
    metaRobots?: Record<string, any>;

    @IsOptional()
    @IsString()
    @MaxLength(95)
    ogTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    ogDescription?: string;

    @IsOptional()
    @IsString()
    ogImage?: string;

    @IsOptional()
    @IsInt()
    ogImageWidth?: number;

    @IsOptional()
    @IsInt()
    ogImageHeight?: number;

    @IsOptional()
    @IsString()
    ogType?: string;

    @IsOptional()
    @IsString()
    ogVideo?: string;

    @IsOptional()
    @IsString()
    @MaxLength(70)
    twitterTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    twitterDescription?: string;

    @IsOptional()
    @IsString()
    twitterImage?: string;

    @IsOptional()
    @IsString()
    twitterCardType?: string;

    @IsOptional()
    @IsString()
    schemaType?: string;

    @IsOptional()
    @IsObject()
    schemaData?: Record<string, any>;
}

export class AnalyzeContentDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    focusKeywords?: string[];

    @IsOptional()
    @IsString()
    metaDescription?: string;

    @IsOptional()
    @IsString()
    slug?: string;
}

export class SeoScoreResult {
    overall: number;
    basic: number;
    readability: number;
    technical: number;
    social: number;
    issues: SeoIssue[];
    suggestions: SeoSuggestion[];
    stats: ContentStats;
}

export class SeoIssue {
    id: string;
    category: string;
    severity: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    howToFix?: string;
}

export class SeoSuggestion {
    id: string;
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}

export class ContentStats {
    wordCount: number;
    characterCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgWordsPerSentence: number;
    avgSentencesPerParagraph: number;
    readingTime: number;
    headings: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number };
    images: number;
    links: { internal: number; external: number; nofollow: number };
    keywordDensity: Record<string, number>;
    fleschReadingEase: number;
    fleschKincaidGrade: number;
}
