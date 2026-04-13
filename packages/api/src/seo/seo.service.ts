import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeoAnalyzerService } from './seo-analyzer.service';

@Injectable()
export class SeoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analyzer: SeoAnalyzerService,
  ) {}

  // ================= SETTINGS =================
  async getSettings() {
    let settings = await this.prisma.seoSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.seoSettings.create({
        data: {
          siteTitle: 'TakeWeb',
          titleSeparator: '|',
          metaDescription: 'Default description',
        },
      });
    }
    return settings;
  }

  async updateSettings(dto: any) {
    const existing = await this.getSettings();
    return this.prisma.seoSettings.update({
      where: { id: existing.id },
      data: dto,
    });
  }

  // ================= META =================
  getSeoMeta(entityType: string, entityId: string) {
    return this.prisma.seoMeta.findUnique({
      where: { entityType_entityId: { entityType, entityId } },
    });
  }

  async getAllSeoMeta(page = 1, limit = 20, entityType?: string) {
    const where = entityType ? { entityType } : {};

    const [items, total] = await Promise.all([
      this.prisma.seoMeta.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.seoMeta.count({ where }),
    ]);

    return { items, total };
  }

  async createSeoMeta(dto: any) {
    return this.prisma.seoMeta.create({ data: dto });
  }

  async updateSeoMeta(entityType: string, entityId: string, dto: any) {
    return this.prisma.seoMeta.updateMany({
      where: { entityType, entityId },
      data: dto,
    });
  }

  async deleteSeoMeta(entityType: string, entityId: string) {
    return this.prisma.seoMeta.deleteMany({
      where: { entityType, entityId },
    });
  }

  analyzeContent(dto: any) {
    return this.analyzer.analyzeContent(dto);
  }

  // ================= REDIRECTS =================
  async getRedirects(page = 1, limit = 20, status?: string) {
    return this.prisma.redirect.findMany();
  }

  async getRedirect(id: string) {
    return this.prisma.redirect.findUnique({ where: { id } });
  }

  async createRedirect(dto: any) {
    return this.prisma.redirect.create({ data: dto });
  }

  async createBulkRedirects(dto: any) {
    return Promise.all(
      dto.redirects.map((r: any) =>
        this.prisma.redirect.create({ data: r }),
      ),
    );
  }

  async updateRedirect(id: string, dto: any) {
    return this.prisma.redirect.update({
      where: { id },
      data: dto,
    });
  }

  async deleteRedirect(id: string) {
    return this.prisma.redirect.delete({ where: { id } });
  }

  async deleteAllRedirects() {
    return this.prisma.redirect.deleteMany();
  }

  // ================= 404 =================
  async get404Errors(page = 1, limit = 20, resolved?: boolean) {
    return this.prisma.error404Log.findMany();
  }

  async log404Error(url: string, ref?: string, agent?: string) {
    return this.prisma.error404Log.create({
      data: { url, referrer: ref, userAgent: agent },
    });
  }

  async resolve404Error(id: string, redirectToUrl?: string) {
    return this.prisma.error404Log.update({
      where: { id },
      data: { isResolved: true },
    });
  }

  async delete404Error(id: string) {
    return this.prisma.error404Log.delete({ where: { id } });
  }

  async deleteAll404Errors() {
    return this.prisma.error404Log.deleteMany();
  }

  // ================= KEYWORDS =================
  async getKeywords(page = 1, limit = 20) {
    return this.prisma.keywordTracking.findMany();
  }

  async getKeyword(id: string) {
    return this.prisma.keywordTracking.findUnique({ where: { id } });
  }

  async createKeyword(dto: any) {
    return this.prisma.keywordTracking.create({ data: dto });
  }

  async createBulkKeywords(dto: any) {
    return Promise.all(
      dto.keywords.map((k: string) =>
        this.prisma.keywordTracking.create({ data: { keyword: k } }),
      ),
    );
  }

  async updateKeyword(id: string, dto: any) {
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
    return this.prisma.keywordTracking.update({
      where: { id },
      data: { currentRank: position },
    });
  }

  async deleteKeyword(id: string) {
    return this.prisma.keywordTracking.delete({ where: { id } });
  }

  // ================= SITEMAP =================
  async getSitemapEntries(page = 1, limit = 50) {
    return this.prisma.sitemapEntry.findMany();
  }

  async createSitemapEntry(dto: any) {
    return this.prisma.sitemapEntry.create({ data: dto });
  }

  async updateSitemapEntry(id: string, dto: any) {
    return this.prisma.sitemapEntry.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSitemapEntry(id: string) {
    return this.prisma.sitemapEntry.delete({ where: { id } });
  }

  async generateSitemapXml(): Promise<string> {
    const entries = await this.prisma.sitemapEntry.findMany();
    return `<urlset>${entries
      .map((e: any) => `<url>${e.url}</url>`)
      .join('')}</urlset>`;
  }

  // ================= SCHEMA =================
  async getSchemaTemplates(page = 1, limit = 20) {
    return this.prisma.schemaTemplate.findMany();
  }

  async getSchemaTemplate(id: string) {
    return this.prisma.schemaTemplate.findUnique({ where: { id } });
  }

  async createSchemaTemplate(dto: any) {
    return this.prisma.schemaTemplate.create({ data: dto });
  }

  async updateSchemaTemplate(id: string, dto: any) {
    return this.prisma.schemaTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSchemaTemplate(id: string) {
    return this.prisma.schemaTemplate.delete({ where: { id } });
  }

  // ================= AUDIT =================
  async runSeoAudit(dto: any) {
    return { status: 'ok' };
  }

  async getAuditHistory(page = 1, limit = 10) {
    return this.prisma.seoAudit.findMany();
  }

  // ================= LINKS =================
  async getLinkSuggestions(entityType: string, entityId: string) {
    return [];
  }

  async generateLinkSuggestions(entityType: string, entityId: string) {
    return [];
  }

  async dismissLinkSuggestion(id: string) {
    return true;
  }

  async acceptLinkSuggestion(id: string) {
    return true;
  }

  // ================= DASHBOARD =================
  async getDashboardStats() {
    return {
      totalPosts: await this.prisma.blogPost.count(),
    };
  }
}