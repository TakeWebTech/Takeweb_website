import { IsString, IsOptional, IsBoolean, IsInt, IsIn, MaxLength, Min } from 'class-validator';

export class CreateRedirectDto {
    @IsString()
    @MaxLength(2048)
    sourceUrl: string;

    @IsString()
    @MaxLength(2048)
    targetUrl: string;

    @IsOptional()
    @IsInt()
    @IsIn([301, 302, 307, 308, 410, 451])
    type?: number;

    @IsOptional()
    @IsString()
    @IsIn(['exact', 'contains', 'regex', 'starts_with', 'ends_with'])
    matchType?: string;

    @IsOptional()
    @IsBoolean()
    ignoreCase?: boolean;

    @IsOptional()
    @IsBoolean()
    ignoreSlash?: boolean;

    @IsOptional()
    @IsBoolean()
    queryPassthrough?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    priority?: number;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    note?: string;
}

export class UpdateRedirectDto {
    @IsOptional()
    @IsString()
    @MaxLength(2048)
    sourceUrl?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2048)
    targetUrl?: string;

    @IsOptional()
    @IsInt()
    @IsIn([301, 302, 307, 308, 410, 451])
    type?: number;

    @IsOptional()
    @IsString()
    @IsIn(['exact', 'contains', 'regex', 'starts_with', 'ends_with'])
    matchType?: string;

    @IsOptional()
    @IsBoolean()
    ignoreCase?: boolean;

    @IsOptional()
    @IsBoolean()
    ignoreSlash?: boolean;

    @IsOptional()
    @IsBoolean()
    queryPassthrough?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    priority?: number;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    note?: string;
}

export class BulkCreateRedirectDto {
    redirects: CreateRedirectDto[];
}

export class ImportRedirectsDto {
    @IsString()
    @IsIn(['csv', 'json', 'htaccess'])
    format: string;

    @IsString()
    content: string;
}

export const REDIRECT_TYPES = {
    301: { name: 'Moved Permanently', description: 'Use when the page has permanently moved to a new URL' },
    302: { name: 'Found (Temporary)', description: 'Use for temporary redirects' },
    307: { name: 'Temporary Redirect', description: 'Temporary redirect preserving the request method' },
    308: { name: 'Permanent Redirect', description: 'Permanent redirect preserving the request method' },
    410: { name: 'Gone', description: 'Use when the page has been intentionally removed' },
    451: { name: 'Unavailable For Legal Reasons', description: 'Use when content is blocked for legal reasons' },
};

export class RedirectStats {
    total: number;
    active: number;
    inactive: number;
    byType: Record<number, number>;
    topHits: Array<{ id: string; sourceUrl: string; hitCount: number }>;
    recentlyCreated: number;
    recentlyAccessed: number;
}
