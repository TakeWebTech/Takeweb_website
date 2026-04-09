import { IsString, IsOptional, IsBoolean, IsArray, IsObject, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateSeoSettingsDto {
    // General Settings
    @IsOptional()
    @IsString()
    @MaxLength(70)
    siteTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(5)
    titleSeparator?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    metaDescription?: string;

    // Homepage SEO
    @IsOptional()
    @IsString()
    @MaxLength(70)
    homeTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    homeDescription?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    homeKeywords?: string[];

    // Social Profiles
    @IsOptional()
    @IsUrl()
    facebookUrl?: string;

    @IsOptional()
    @IsString()
    twitterUsername?: string;

    @IsOptional()
    @IsUrl()
    linkedinUrl?: string;

    @IsOptional()
    @IsUrl()
    instagramUrl?: string;

    @IsOptional()
    @IsUrl()
    youtubeUrl?: string;

    @IsOptional()
    @IsUrl()
    pinterestUrl?: string;

    // Webmaster Verification
    @IsOptional()
    @IsString()
    googleVerification?: string;

    @IsOptional()
    @IsString()
    bingVerification?: string;

    @IsOptional()
    @IsString()
    yandexVerification?: string;

    @IsOptional()
    @IsString()
    pinterestVerification?: string;

    @IsOptional()
    @IsString()
    baiduVerification?: string;

    // Analytics & Search Console
    @IsOptional()
    @IsString()
    googleAnalyticsId?: string;

    @IsOptional()
    @IsString()
    googleTagManagerId?: string;

    @IsOptional()
    @IsString()
    googleSearchConsole?: string;

    // Schema.org Organization
    @IsOptional()
    @IsString()
    orgName?: string;

    @IsOptional()
    @IsUrl()
    orgLogo?: string;

    @IsOptional()
    @IsUrl()
    orgUrl?: string;

    @IsOptional()
    @IsString()
    orgType?: string;

    // Local SEO
    @IsOptional()
    @IsString()
    localBusinessType?: string;

    @IsOptional()
    @IsString()
    streetAddress?: string;

    @IsOptional()
    @IsString()
    addressLocality?: string;

    @IsOptional()
    @IsString()
    addressRegion?: string;

    @IsOptional()
    @IsString()
    postalCode?: string;

    @IsOptional()
    @IsString()
    addressCountry?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    priceRange?: string;

    @IsOptional()
    @IsObject()
    geo?: { latitude: number; longitude: number };

    @IsOptional()
    @IsArray()
    openingHours?: { day: string; open: string; close: string }[];

    // Robots Settings
    @IsOptional()
    @IsBoolean()
    robotsIndex?: boolean;

    @IsOptional()
    @IsBoolean()
    robotsFollow?: boolean;

    @IsOptional()
    @IsBoolean()
    robotsArchive?: boolean;

    @IsOptional()
    @IsBoolean()
    robotsSnippet?: boolean;

    @IsOptional()
    @IsBoolean()
    robotsImageIndex?: boolean;

    // Advanced
    @IsOptional()
    @IsBoolean()
    breadcrumbsEnabled?: boolean;

    @IsOptional()
    @IsString()
    breadcrumbsSeparator?: string;

    @IsOptional()
    @IsBoolean()
    noIndexEmptyArchives?: boolean;

    @IsOptional()
    @IsBoolean()
    removeStopwords?: boolean;
}
