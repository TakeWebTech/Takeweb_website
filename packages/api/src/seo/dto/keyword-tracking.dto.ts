import { IsString, IsOptional, IsBoolean, IsInt, IsNumber, IsUrl, MaxLength, Min, Max } from 'class-validator';

export class CreateKeywordTrackingDto {
    @IsString()
    @MaxLength(255)
    keyword: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    searchVolume?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    difficulty?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    cpc?: number;

    @IsOptional()
    @IsUrl()
    targetUrl?: string;

    @IsOptional()
    @IsString()
    entityType?: string;

    @IsOptional()
    @IsString()
    entityId?: string;

    @IsOptional()
    @IsBoolean()
    isTracking?: boolean;
}

export class UpdateKeywordTrackingDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    keyword?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    searchVolume?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    difficulty?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    cpc?: number;

    @IsOptional()
    @IsUrl()
    targetUrl?: string;

    @IsOptional()
    @IsString()
    entityType?: string;

    @IsOptional()
    @IsString()
    entityId?: string;

    @IsOptional()
    @IsBoolean()
    isTracking?: boolean;
}

export class BulkAddKeywordsDto {
    keywords: string[];

    @IsOptional()
    @IsUrl()
    targetUrl?: string;
}

export class KeywordRankUpdate {
    @IsString()
    keyword: string;

    @IsInt()
    @Min(0)
    rank: number;
}

export class KeywordStats {
    total: number;
    tracking: number;
    improved: number;
    declined: number;
    unchanged: number;
    avgPosition: number;
    topKeywords: Array<{
        keyword: string;
        currentRank: number;
        previousRank: number;
        change: number;
        targetUrl: string;
    }>;
}

export class KeywordSuggestion {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    cpc: number;
    relevance: number;
    source: string;
}
