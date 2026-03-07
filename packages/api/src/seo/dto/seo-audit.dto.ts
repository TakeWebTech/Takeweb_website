import { IsString, IsOptional, IsBoolean, IsInt, IsArray, Min, Max } from 'class-validator';

export class RunSeoAuditDto {
    @IsOptional()
    @IsBoolean()
    fullCrawl?: boolean;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(1000)
    maxPages?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    includeChecks?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    excludeUrls?: string[];
}

export class SeoAuditResult {
    id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    overallScore: number;
    technicalScore: number;
    contentScore: number;
    socialScore: number;
    
    summary: {
        criticalIssues: number;
        warnings: number;
        suggestions: number;
        passed: number;
    };

    categories: SeoAuditCategory[];
    pageResults: SeoPageAudit[];
    
    crawlStats: {
        pagesCrawled: number;
        imagesAnalyzed: number;
        linksAnalyzed: number;
        totalTime: number;
    };

    startedAt: Date;
    completedAt?: Date;
}

export class SeoAuditCategory {
    name: string;
    score: number;
    maxScore: number;
    issues: SeoAuditIssue[];
}

export class SeoAuditIssue {
    id: string;
    category: string;
    severity: 'critical' | 'warning' | 'info' | 'passed';
    title: string;
    description: string;
    howToFix?: string;
    affectedUrls?: string[];
    count?: number;
    impact: 'high' | 'medium' | 'low';
}

export class SeoPageAudit {
    url: string;
    title: string;
    score: number;
    issues: string[];
    warnings: string[];
    passed: string[];
}

// SEO Audit Check Categories
export const SEO_AUDIT_CHECKS = {
    technical: [
        { id: 'robots_txt', name: 'Robots.txt', description: 'Check if robots.txt exists and is valid' },
        { id: 'sitemap_xml', name: 'XML Sitemap', description: 'Check if sitemap.xml exists and is valid' },
        { id: 'ssl_certificate', name: 'SSL Certificate', description: 'Check if site uses HTTPS' },
        { id: 'page_speed', name: 'Page Speed', description: 'Check page load time' },
        { id: 'mobile_friendly', name: 'Mobile Friendly', description: 'Check mobile responsiveness' },
        { id: 'canonical_tags', name: 'Canonical Tags', description: 'Check for proper canonical URLs' },
        { id: 'hreflang_tags', name: 'Hreflang Tags', description: 'Check international targeting' },
        { id: 'structured_data', name: 'Structured Data', description: 'Check schema markup validity' },
        { id: 'broken_links', name: 'Broken Links', description: 'Find and report broken links' },
        { id: 'redirect_chains', name: 'Redirect Chains', description: 'Check for redirect chains' },
        { id: 'duplicate_content', name: 'Duplicate Content', description: 'Find duplicate content issues' },
    ],
    content: [
        { id: 'title_tags', name: 'Title Tags', description: 'Check title tag presence and length' },
        { id: 'meta_descriptions', name: 'Meta Descriptions', description: 'Check meta description presence and length' },
        { id: 'heading_structure', name: 'Heading Structure', description: 'Check H1-H6 usage' },
        { id: 'image_alt_tags', name: 'Image Alt Tags', description: 'Check image alt attributes' },
        { id: 'content_length', name: 'Content Length', description: 'Check for thin content' },
        { id: 'keyword_usage', name: 'Keyword Usage', description: 'Check focus keyword optimization' },
        { id: 'internal_links', name: 'Internal Links', description: 'Check internal linking structure' },
        { id: 'external_links', name: 'External Links', description: 'Check external link quality' },
        { id: 'readability', name: 'Readability', description: 'Check content readability scores' },
    ],
    social: [
        { id: 'og_tags', name: 'Open Graph Tags', description: 'Check OG meta tags' },
        { id: 'twitter_cards', name: 'Twitter Cards', description: 'Check Twitter card meta tags' },
        { id: 'social_links', name: 'Social Links', description: 'Check social media profile links' },
    ],
    performance: [
        { id: 'core_web_vitals', name: 'Core Web Vitals', description: 'Check LCP, FID, CLS' },
        { id: 'image_optimization', name: 'Image Optimization', description: 'Check image sizes and formats' },
        { id: 'javascript_render', name: 'JavaScript Rendering', description: 'Check JS rendering issues' },
        { id: 'caching', name: 'Caching', description: 'Check browser caching headers' },
    ],
};

export class CompareAuditsDto {
    @IsString()
    auditId1: string;

    @IsString()
    auditId2: string;
}

export class AuditComparisonResult {
    audit1: { id: string; date: Date; score: number };
    audit2: { id: string; date: Date; score: number };
    scoreDiff: number;
    improvements: SeoAuditIssue[];
    regressions: SeoAuditIssue[];
    unchanged: number;
}
