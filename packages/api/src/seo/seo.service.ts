import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeoAnalyzerService } from './seo-analyzer.service';
import {
  UpdateSeoSettingsDto,
  CreateSeoMetaDto,
  UpdateSeoMetaDto,
  AnalyzeContentDto,
  CreateRedirectDto,
  UpdateRedirectDto,
  BulkCreateRedirectDto,
  CreateKeywordTrackingDto,
  UpdateKeywordTrackingDto,
  BulkAddKeywordsDto,
  CreateSitemapEntryDto,
  UpdateSitemapEntryDto,
  CreateSchemaTemplateDto,
  UpdateSchemaTemplateDto,
  RunSeoAuditDto,
  SeoAuditResult,
  SeoAuditCategory,
  SeoAuditIssue,
  SeoPageAudit,
  SEO_AUDIT_CHECKS,
  SeoScoreResult,
} from './dto';

@Injectable()
export class SeoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analyzer: SeoAnalyzerService,
  ) {}

  // ==================== SEO Settings ====================

  async getSettings() {
    let settings = await this.prisma.seoSettings.findFirst();
    if (!settings) {
      // Create default settings
      settings = await this.prisma.seoSettings.create({
        data: {
          siteTitle: 'TakeWeb - Enterprise Solutions',
          titleSeparator: '|',
          metaDescription:
            'TakeWeb provides enterprise digital solutions including web development, app development, and AI solutions.',
        },
      });
    }
    return settings;
  }

  async updateSettings(dto: UpdateSeoSettingsDto) {
    const existing = await this.getSettings();
    return this.prisma.seoSettings.update({
      where: { id: existing.id },
      data: dto,
    });
  }

  // ==================== SEO Meta ====================

  getSeoMeta(entityType: string, entityId: string) {
    return this.prisma.seoMeta.findUnique({
      where: {
        entityType_entityId: { entityType, entityId },
      },
    });
  }

  async getAllSeoMeta(page = 1, limit = 20, entityType?: string) {
    const where = entityType ? { entityType } : {};
    const [items, total] = await Promise.all([
      this.prisma.seoMeta.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.seoMeta.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createSeoMeta(dto: CreateSeoMetaDto) {
    // Check if meta already exists
    const existing = await this.prisma.seoMeta.findUnique({
      where: {
        entityType_entityId: {
          entityType: dto.entityType,
          entityId: dto.entityId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('SEO meta already exists for this entity');
    }

    return this.prisma.seoMeta.create({
      data: dto,
    });
  }

  async updateSeoMeta(
    entityType: string,
    entityId: string,
    dto: UpdateSeoMetaDto,
  ) {
    const existing = await this.prisma.seoMeta.findUnique({
      where: {
        entityType_entityId: { entityType, entityId },
      },
    });

    if (!existing) {
      // Create if doesn't exist - entitySlug is required
      const entitySlug = dto.entitySlug || entityId;
      return this.prisma.seoMeta.create({
        data: {
          entityType,
          entityId,
          entitySlug,
          ...dto,
        },
      });
    }

    return this.prisma.seoMeta.update({
      where: { id: existing.id },
      data: dto,
    });
  }

  async deleteSeoMeta(entityType: string, entityId: string) {
    const existing = await this.prisma.seoMeta.findUnique({
      where: {
        entityType_entityId: { entityType, entityId },
      },
    });

    if (!existing) {
      throw new NotFoundException('SEO meta not found');
    }

    return this.prisma.seoMeta.delete({
      where: { id: existing.id },
    });
  }

  // ==================== Content Analysis ====================

  analyzeContent(dto: AnalyzeContentDto): SeoScoreResult {
    return this.analyzer.analyzeContent({
      content: dto.content,
      title: dto.title,
      metaDescription: dto.metaDescription,
      focusKeywords: dto.focusKeywords,
      slug: dto.slug,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  analyzeUrl(url: string): Promise<SeoScoreResult> {
    // This would fetch the URL content and analyze it
    // For now, return a placeholder
    throw new BadRequestException(
      'URL analysis requires fetching external content',
    );
  }

  // ==================== Redirects ====================

  async getRedirects(page = 1, limit = 20, status?: string) {
    const where: any = {};
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const [items, total] = await Promise.all([
      this.prisma.redirect.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.redirect.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRedirect(id: string) {
    const redirect = await this.prisma.redirect.findUnique({
      where: { id },
    });

    if (!redirect) {
      throw new NotFoundException('Redirect not found');
    }

    return redirect;
  }

  async createRedirect(dto: CreateRedirectDto) {
    // Check for duplicate source URL
    const existing = await this.prisma.redirect.findFirst({
      where: { sourceUrl: dto.sourceUrl },
    });

    if (existing) {
      throw new ConflictException(
        'A redirect already exists for this source URL',
      );
    }

    // Check for redirect loops
    if (dto.sourceUrl === dto.targetUrl) {
      throw new BadRequestException(
        'Source and target URLs cannot be the same',
      );
    }

    return this.prisma.redirect.create({
      data: dto,
    });
  }

  async createBulkRedirects(dto: BulkCreateRedirectDto) {
    const results = {
      created: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const redirect of dto.redirects) {
      try {
        await this.createRedirect(redirect);
        results.created++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${redirect.sourceUrl}: ${error.message}`);
      }
    }

    return results;
  }

  async updateRedirect(id: string, dto: UpdateRedirectDto) {
    const redirect = await this.getRedirect(id);

    // Check for redirect loops if URLs are being updated
    if (dto.sourceUrl && dto.targetUrl && dto.sourceUrl === dto.targetUrl) {
      throw new BadRequestException(
        'Source and target URLs cannot be the same',
      );
    }

    return this.prisma.redirect.update({
      where: { id },
      data: dto,
    });
  }

  async deleteRedirect(id: string) {
    await this.getRedirect(id);
    return this.prisma.redirect.delete({
      where: { id },
    });
  }

  async deleteAllRedirects() {
    return this.prisma.redirect.deleteMany({});
  }

  async incrementRedirectHitCount(id: string) {
    return this.prisma.redirect.update({
      where: { id },
      data: {
        hitCount: { increment: 1 },
        lastAccessedAt: new Date(),
      },
    });
  }

  async findRedirectBySource(sourceUrl: string) {
    return this.prisma.redirect.findFirst({
      where: {
        sourceUrl,
        isActive: true,
      },
    });
  }

  // ==================== 404 Error Monitoring ====================

  async get404Errors(page = 1, limit = 20, resolved?: boolean) {
    const where: any = {};
    if (resolved !== undefined) where.isResolved = resolved;

    const [items, total] = await Promise.all([
      this.prisma.error404Log.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { lastSeenAt: 'desc' },
      }),
      this.prisma.error404Log.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async log404Error(url: string, referrer?: string, userAgent?: string) {
    const existing = await this.prisma.error404Log.findUnique({
      where: { url },
    });

    if (existing) {
      return this.prisma.error404Log.update({
        where: { id: existing.id },
        data: {
          hitCount: { increment: 1 },
          lastSeenAt: new Date(),
          referrer: referrer || existing.referrer,
          userAgent: userAgent || existing.userAgent,
        },
      });
    }

    return this.prisma.error404Log.create({
      data: {
        url,
        referrer,
        userAgent,
      },
    });
  }

  async resolve404Error(id: string, redirectToUrl?: string) {
    const error = await this.prisma.error404Log.findUnique({
      where: { id },
    });

    if (!error) {
      throw new NotFoundException('404 error not found');
    }

    // Create redirect if URL provided
    if (redirectToUrl) {
      await this.createRedirect({
        sourceUrl: error.url,
        targetUrl: redirectToUrl,
        type: 301,
        isActive: true,
      });
    }

    return this.prisma.error404Log.update({
      where: { id },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
        redirectToId: redirectToUrl,
      },
    });
  }

  async delete404Error(id: string) {
    return this.prisma.error404Log.delete({
      where: { id },
    });
  }

  async deleteAll404Errors() {
    return this.prisma.error404Log.deleteMany({
      where: { isResolved: true },
    });
  }

  // ==================== Keyword Tracking ====================

  async getKeywords(page = 1, limit = 20) {
    const [items, total] = await Promise.all([
      this.prisma.keywordTracking.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.keywordTracking.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getKeyword(id: string) {
    const keyword = await this.prisma.keywordTracking.findUnique({
      where: { id },
    });

    if (!keyword) {
      throw new NotFoundException('Keyword not found');
    }

    return keyword;
  }

  async createKeyword(dto: CreateKeywordTrackingDto) {
    // Check for duplicate keyword
    const existing = await this.prisma.keywordTracking.findFirst({
      where: { keyword: dto.keyword },
    });

    if (existing) {
      throw new ConflictException('This keyword is already being tracked');
    }

    return this.prisma.keywordTracking.create({
      data: dto,
    });
  }

  async createBulkKeywords(dto: BulkAddKeywordsDto) {
    const results = {
      created: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const keyword of dto.keywords) {
      try {
        await this.createKeyword({
          keyword,
          targetUrl: dto.targetUrl,
        });
        results.created++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${keyword}: ${error.message}`);
      }
    }

    return results;
  }

  async updateKeyword(id: string, dto: UpdateKeywordTrackingDto) {
    await this.getKeyword(id);
    return this.prisma.keywordTracking.update({
      where: { id },
      data: dto,
    });
  }

  async updateKeywordRanking(
    id: string,
    position: number,
    searchEngine = 'google',
  ) {
    const keyword = await this.getKeyword(id);
    const history = (keyword.rankHistory as any[]) || [];

    history.push({
      date: new Date().toISOString(),
      position,
      searchEngine,
    });

    // Keep only last 90 days of history
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const filteredHistory = history.filter(
      (h) => new Date(h.date) > ninetyDaysAgo,
    );

    const previousRank = keyword.currentRank;

    return this.prisma.keywordTracking.update({
      where: { id },
      data: {
        currentRank: position,
        previousRank,
        bestRank: Math.min(keyword.bestRank || 100, position),
        rankHistory: filteredHistory,
        lastCheckedAt: new Date(),
      },
    });
  }

  async deleteKeyword(id: string) {
    await this.getKeyword(id);
    return this.prisma.keywordTracking.delete({
      where: { id },
    });
  }

  // ==================== Sitemap Management ====================

  async getSitemapEntries(page = 1, limit = 50) {
    const [items, total] = await Promise.all([
      this.prisma.sitemapEntry.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { priority: 'desc' },
      }),
      this.prisma.sitemapEntry.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createSitemapEntry(dto: CreateSitemapEntryDto) {
    // Check for duplicate URL
    const existing = await this.prisma.sitemapEntry.findUnique({
      where: { url: dto.url },
    });

    if (existing) {
      throw new ConflictException('URL already exists in sitemap');
    }

    return this.prisma.sitemapEntry.create({
      data: dto,
    });
  }

  async updateSitemapEntry(id: string, dto: UpdateSitemapEntryDto) {
    const entry = await this.prisma.sitemapEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Sitemap entry not found');
    }

    return this.prisma.sitemapEntry.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSitemapEntry(id: string) {
    return this.prisma.sitemapEntry.delete({
      where: { id },
    });
  }

  async generateSitemapXml(): Promise<string> {
    const entries = await this.prisma.sitemapEntry.findMany({
      where: { includeInSitemap: true },
      orderBy: { priority: 'desc' },
    });

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const entry of entries) {
      xml += '  <url>\n';
      xml += `    <loc>${entry.url}</loc>\n`;
      if (entry.lastModified) {
        xml += `    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>\n`;
      }
      xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
      xml += '  </url>\n';
    }

    xml += '</urlset>';
    return xml;
  }

  // ==================== Schema Templates ====================

  async getSchemaTemplates(page = 1, limit = 20) {
    const [items, total] = await Promise.all([
      this.prisma.schemaTemplate.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.schemaTemplate.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSchemaTemplate(id: string) {
    const template = await this.prisma.schemaTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Schema template not found');
    }

    return template;
  }

  async createSchemaTemplate(dto: CreateSchemaTemplateDto) {
    return this.prisma.schemaTemplate.create({
      data: dto,
    });
  }

  async updateSchemaTemplate(id: string, dto: UpdateSchemaTemplateDto) {
    await this.getSchemaTemplate(id);
    return this.prisma.schemaTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSchemaTemplate(id: string) {
    await this.getSchemaTemplate(id);
    return this.prisma.schemaTemplate.delete({
      where: { id },
    });
  }

  // ==================== SEO Audit ====================

  async runSeoAudit(dto: RunSeoAuditDto): Promise<SeoAuditResult> {
    const categories: SeoAuditCategory[] = [];
    const pageAudits: SeoPageAudit[] = [];

    // Get all published content for audit
    const [posts, services, projects] = await Promise.all([
      this.prisma.blogPost.findMany({ where: { status: 'PUBLISHED' } }),
      this.prisma.service.findMany({ where: { isActive: true } }),
      this.prisma.project.findMany({ where: { isFeatured: true } }),
    ]);

    // Audit each category
    for (const categoryKey of Object.keys(SEO_AUDIT_CHECKS)) {
      const categoryChecks =
        SEO_AUDIT_CHECKS[categoryKey as keyof typeof SEO_AUDIT_CHECKS];
      const issues: SeoAuditIssue[] = [];

      for (const check of categoryChecks) {
        const checkResult = await this.runAuditCheck(
          check.id,
          posts,
          services,
          projects,
        );
        if (checkResult) {
          issues.push(checkResult);
        }
      }

      const passed = categoryChecks.length - issues.length;
      const failed = issues.length;
      const score = Math.round((passed / categoryChecks.length) * 100);

      categories.push({
        name: categoryKey,
        score,
        maxScore: 100,
        passed,
        failed,
        issues,
      });
    }

    // Analyze individual pages
    for (const post of posts.slice(0, dto.maxPages || 50)) {
      const analysis = this.analyzer.analyzeContent({
        content: post.content,
        title: post.metaTitle || post.title,
        metaDescription: post.metaDescription || '',
        focusKeywords: [],
        slug: post.slug,
      });

      pageAudits.push({
        url: `/blog/${post.slug}`,
        title: post.title,
        score: analysis.overall,
        issues: analysis.issues
          .filter((i) => i.severity === 'error')
          .map((i) => i.title),
        warnings: analysis.issues
          .filter((i) => i.severity === 'warning')
          .map((i) => i.title),
        passed: analysis.suggestions
          .filter((s) => s.priority === 'low')
          .map((s) => s.title),
      });
    }

    // Calculate overall score
    const overallScore = Math.round(
      categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length,
    );

    const result: SeoAuditResult = {
      id: '',
      status: 'completed',
      overallScore,
      technicalScore:
        categories.find((c) => c.name === 'technical')?.score || 0,
      contentScore: categories.find((c) => c.name === 'content')?.score || 0,
      socialScore: categories.find((c) => c.name === 'social')?.score || 0,
      summary: {
        criticalIssues: categories.reduce(
          (sum, cat) =>
            sum + cat.issues.filter((i) => i.severity === 'critical').length,
          0,
        ),
        warnings: categories.reduce(
          (sum, cat) =>
            sum + cat.issues.filter((i) => i.severity === 'warning').length,
          0,
        ),
        suggestions: categories.reduce(
          (sum, cat) =>
            sum + cat.issues.filter((i) => i.severity === 'info').length,
          0,
        ),
        passed: categories.reduce((sum, cat) => sum + cat.passed, 0),
      },
      categories,
      pageResults: pageAudits,
      crawlStats: {
        pagesCrawled: pageAudits.length,
        imagesAnalyzed: 0,
        linksAnalyzed: 0,
        totalTime: 0,
      },
      startedAt: new Date(),
      completedAt: new Date(),
    };

    // Save audit to database
    const savedAudit = await this.prisma.seoAudit.create({
      data: {
        overallScore: result.overallScore,
        technicalScore: result.technicalScore,
        contentScore: result.contentScore,
        socialScore: result.socialScore,
        criticalIssues: result.summary.criticalIssues,
        warnings: result.summary.warnings,
        suggestions: result.summary.suggestions,
        passed: result.summary.passed,
        results: result as any,
        pagesCrawled: pageAudits.length,
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });

    result.id = savedAudit.id;
    return result;
  }

  private async runAuditCheck(
    checkId: string,
    posts: any[],
    services: any[],
    projects: any[],
  ): Promise<SeoAuditIssue | null> {
    switch (checkId) {
      case 'missing_meta_titles':
        const missingTitles = posts.filter((p) => !p.metaTitle).length;
        if (missingTitles > 0) {
          return {
            id: checkId,
            category: 'content',
            severity: 'warning',
            title: 'Missing Meta Titles',
            description: `${missingTitles} posts are missing meta titles`,
            affectedUrls: posts
              .filter((p) => !p.metaTitle)
              .map((p) => `/blog/${p.slug}`),
            howToFix: 'Add unique meta titles to each post',
            impact: 'medium',
          };
        }
        break;

      case 'missing_meta_descriptions':
        const missingDescs = posts.filter((p) => !p.metaDescription).length;
        if (missingDescs > 0) {
          return {
            id: checkId,
            category: 'content',
            severity: 'warning',
            title: 'Missing Meta Descriptions',
            description: `${missingDescs} posts are missing meta descriptions`,
            affectedUrls: posts
              .filter((p) => !p.metaDescription)
              .map((p) => `/blog/${p.slug}`),
            howToFix: 'Add compelling meta descriptions to each post',
            impact: 'medium',
          };
        }
        break;

      case 'thin_content':
        const thinContent = posts.filter((p) => {
          const wordCount = p.content.split(/\s+/).length;
          return wordCount < 300;
        });
        if (thinContent.length > 0) {
          return {
            id: checkId,
            category: 'content',
            severity: 'critical',
            title: 'Thin Content Detected',
            description: `${thinContent.length} posts have less than 300 words`,
            affectedUrls: thinContent.map((p) => `/blog/${p.slug}`),
            howToFix: 'Expand content to at least 300 words, ideally 1000+',
            impact: 'high',
          };
        }
        break;

      case 'missing_og_images':
        const missingImages = posts.filter((p) => !p.ogImage).length;
        if (missingImages > 0) {
          return {
            id: checkId,
            category: 'social',
            severity: 'info',
            title: 'Missing Open Graph Images',
            description: `${missingImages} posts are missing OG images`,
            affectedUrls: posts
              .filter((p) => !p.ogImage)
              .map((p) => `/blog/${p.slug}`),
            howToFix: 'Add featured images for social sharing',
            impact: 'low',
          };
        }
        break;
    }

    return null;
  }

  async getAuditHistory(page = 1, limit = 10) {
    const [items, total] = await Promise.all([
      this.prisma.seoAudit.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.seoAudit.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ==================== Link Suggestions ====================

  async generateLinkSuggestions(entityType: string, entityId: string) {
    // Get the source content
    let sourceContent = '';
    let sourceTitle = '';

    if (entityType === 'BlogPost') {
      const post = await this.prisma.blogPost.findUnique({
        where: { id: entityId },
      });
      if (post) {
        sourceContent = post.content;
        sourceTitle = post.title;
      }
    }

    if (!sourceContent) {
      throw new NotFoundException('Source content not found');
    }

    // Get all other content to find linking opportunities
    const allPosts = await this.prisma.blogPost.findMany({
      where: {
        id: { not: entityId },
        status: 'PUBLISHED',
      },
      select: { id: true, title: true, slug: true },
    });

    const suggestions = [];

    for (const post of allPosts) {
      // Simple keyword matching - check if post title words appear in source content
      const titleWords = post.title
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 4);
      for (const word of titleWords) {
        if (sourceContent.toLowerCase().includes(word)) {
          suggestions.push({
            targetEntityType: 'BlogPost',
            targetEntityId: post.id,
            targetUrl: `/blog/${post.slug}`,
            targetTitle: post.title,
            suggestedAnchorText: word,
            relevanceScore: 0.7,
            reason: `Content contains "${word}" which relates to this post`,
          });
          break;
        }
      }
    }

    // Save suggestions
    for (const suggestion of suggestions.slice(0, 10)) {
      await this.prisma.linkSuggestion.upsert({
        where: {
          sourceType_sourceId_targetType_targetId: {
            sourceType: entityType,
            sourceId: entityId,
            targetType: suggestion.targetEntityType,
            targetId: suggestion.targetEntityId,
          },
        },
        update: {
          targetUrl: suggestion.targetUrl,
          anchorText: suggestion.suggestedAnchorText,
          relevanceScore: suggestion.relevanceScore,
        },
        create: {
          sourceType: entityType,
          sourceId: entityId,
          sourceUrl: `/blog/${entityId}`,
          targetType: suggestion.targetEntityType,
          targetId: suggestion.targetEntityId,
          targetUrl: suggestion.targetUrl,
          anchorText: suggestion.suggestedAnchorText,
          relevanceScore: suggestion.relevanceScore,
        },
      });
    }

    return suggestions;
  }

  async getLinkSuggestions(entityType: string, entityId: string) {
    return this.prisma.linkSuggestion.findMany({
      where: {
        sourceType: entityType,
        sourceId: entityId,
        isDismissed: false,
      },
      orderBy: { relevanceScore: 'desc' },
    });
  }

  async dismissLinkSuggestion(id: string) {
    return this.prisma.linkSuggestion.update({
      where: { id },
      data: { isDismissed: true },
    });
  }

  async acceptLinkSuggestion(id: string) {
    return this.prisma.linkSuggestion.update({
      where: { id },
      data: { isApplied: true },
    });
  }

  // ==================== Analytics Dashboard ====================

  async getDashboardStats() {
    const [
      totalPosts,
      totalServices,
      totalProjects,
      redirects,
      errors404,
      keywords,
      latestAudit,
    ] = await Promise.all([
      this.prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.service.count({ where: { isActive: true } }),
      this.prisma.project.count(),
      this.prisma.redirect.count(),
      this.prisma.error404Log.count({ where: { isResolved: false } }),
      this.prisma.keywordTracking.count(),
      this.prisma.seoAudit.findFirst({ orderBy: { createdAt: 'desc' } }),
    ]);

    // Get content with missing SEO
    const contentMissingSeo = await this.prisma.blogPost.count({
      where: {
        status: 'PUBLISHED',
        OR: [{ metaTitle: null }, { metaDescription: null }],
      },
    });

    return {
      overview: {
        totalContent: totalPosts + totalServices + totalProjects,
        totalPosts,
        totalServices,
        totalProjects,
        seoScore: latestAudit?.overallScore || 0,
      },
      issues: {
        contentMissingSeo,
        unresolved404s: errors404,
        totalRedirects: redirects,
      },
      keywords: {
        tracked: keywords,
      },
      lastAudit: latestAudit
        ? {
            score: latestAudit.overallScore,
            date: latestAudit.createdAt,
            criticalIssues: latestAudit.criticalIssues,
          }
        : null,
    };
  }
}
