import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsIn, IsUrl, IsDateString, MaxLength, Min, Max } from 'class-validator';

export class CreateSitemapEntryDto {
    @IsUrl()
    url: string;

    @IsOptional()
    @IsString()
    entityType?: string;

    @IsOptional()
    @IsString()
    entityId?: string;

    @IsOptional()
    @IsBoolean()
    includeInSitemap?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    priority?: number;

    @IsOptional()
    @IsString()
    @IsIn(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
    changeFrequency?: string;

    @IsOptional()
    @IsDateString()
    lastModified?: string;

    @IsOptional()
    @IsString()
    @IsIn(['default', 'news', 'image', 'video'])
    sitemapType?: string;

    // News sitemap fields
    @IsOptional()
    @IsString()
    newsTitle?: string;

    @IsOptional()
    @IsDateString()
    newsPublicationDate?: string;

    // Image sitemap fields
    @IsOptional()
    @IsArray()
    images?: Array<{
        url: string;
        title?: string;
        caption?: string;
        geoLocation?: string;
        license?: string;
    }>;

    // Video sitemap fields
    @IsOptional()
    @IsArray()
    videos?: Array<{
        url: string;
        title: string;
        description: string;
        thumbnailUrl: string;
        duration?: number;
        rating?: number;
        viewCount?: number;
        publicationDate?: string;
        familyFriendly?: boolean;
        restriction?: string;
        platform?: string;
        requiresSubscription?: boolean;
        uploader?: string;
        live?: boolean;
        tag?: string[];
    }>;
}

export class UpdateSitemapEntryDto extends CreateSitemapEntryDto {
    @IsOptional()
    url?: string;
}

export class SitemapSettingsDto {
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;

    @IsOptional()
    @IsInt()
    @Min(100)
    @Max(50000)
    maxEntriesPerSitemap?: number;

    @IsOptional()
    @IsBoolean()
    includeImages?: boolean;

    @IsOptional()
    @IsBoolean()
    includeAuthors?: boolean;

    @IsOptional()
    @IsArray()
    excludeEntityTypes?: string[];

    @IsOptional()
    @IsArray()
    excludeUrls?: string[];

    // Default priorities per entity type
    @IsOptional()
    defaultPriorities?: Record<string, number>;

    // Default change frequencies per entity type
    @IsOptional()
    defaultChangeFrequencies?: Record<string, string>;

    @IsOptional()
    @IsBoolean()
    pingSearchEngines?: boolean;

    @IsOptional()
    @IsArray()
    customSitemaps?: Array<{
        name: string;
        entityTypes: string[];
    }>;
}

export class SitemapStats {
    totalEntries: number;
    includedEntries: number;
    excludedEntries: number;
    byType: Record<string, number>;
    byEntityType: Record<string, number>;
    lastGenerated: Date;
    lastPinged: Date;
    sitemapUrls: string[];
}

export class RegenerateSitemapDto {
    @IsOptional()
    @IsBoolean()
    pingSearchEngines?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    sitemapTypes?: string[];
}
