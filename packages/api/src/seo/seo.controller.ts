import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { SeoService } from './seo.service';
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
} from './dto';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@Controller('seo')
@UseGuards(JwtAuthGuard, RbacGuard)
@Permissions('seo.manage')
export class SeoController {
  constructor(
    private readonly seoService: SeoService,
    private readonly analyzerService: SeoAnalyzerService,
  ) {}

  // ==================== Dashboard ====================

  @Get('dashboard')
  async getDashboard() {
    return this.seoService.getDashboardStats();
  }

  // ==================== SEO Settings ====================

  @Get('settings')
  async getSettings() {
    return this.seoService.getSettings();
  }

  @Put('settings')
  async updateSettings(@Body() dto: UpdateSeoSettingsDto) {
    return this.seoService.updateSettings(dto);
  }

  // ==================== SEO Meta ====================

  @Get('meta')
  async getAllMeta(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('entityType') entityType?: string,
  ) {
    return this.seoService.getAllSeoMeta(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      entityType,
    );
  }

  @Get('meta/:entityType/:entityId')
  async getMeta(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.seoService.getSeoMeta(entityType, entityId);
  }

  @Post('meta')
  async createMeta(@Body() dto: CreateSeoMetaDto) {
    return this.seoService.createSeoMeta(dto);
  }

  @Put('meta/:entityType/:entityId')
  async updateMeta(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Body() dto: UpdateSeoMetaDto,
  ) {
    return this.seoService.updateSeoMeta(entityType, entityId, dto);
  }

  @Delete('meta/:entityType/:entityId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMeta(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.seoService.deleteSeoMeta(entityType, entityId);
  }

  // ==================== Content Analysis ====================

  @Post('analyze')
  async analyzeContent(@Body() dto: AnalyzeContentDto) {
    return this.seoService.analyzeContent(dto);
  }

  @Post('analyze/quick')
  quickAnalyze(@Body() body: { content: string }) {
    return this.analyzerService.calculateContentStats(body.content);
  }

  @Post('analyze/suggestions')
  getContentSuggestions(@Body() dto: AnalyzeContentDto) {
    return this.analyzerService.generateContentSuggestions({
      content: dto.content,
      title: dto.title,
      metaDescription: dto.metaDescription,
      focusKeywords: dto.focusKeywords,
      slug: dto.slug,
    });
  }

  // ==================== Redirects ====================

  @Get('redirects')
  async getRedirects(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.seoService.getRedirects(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
    );
  }

  @Get('redirects/:id')
  async getRedirect(@Param('id') id: string) {
    return this.seoService.getRedirect(id);
  }

  @Post('redirects')
  async createRedirect(@Body() dto: CreateRedirectDto) {
    return this.seoService.createRedirect(dto);
  }

  @Post('redirects/bulk')
  async createBulkRedirects(@Body() dto: BulkCreateRedirectDto) {
    return this.seoService.createBulkRedirects(dto);
  }

  @Put('redirects/:id')
  async updateRedirect(
    @Param('id') id: string,
    @Body() dto: UpdateRedirectDto,
  ) {
    return this.seoService.updateRedirect(id, dto);
  }

  @Delete('redirects/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRedirect(@Param('id') id: string) {
    return this.seoService.deleteRedirect(id);
  }

  @Delete('redirects')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllRedirects() {
    return this.seoService.deleteAllRedirects();
  }

  // ==================== 404 Errors ====================

  @Get('404-errors')
  async get404Errors(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('resolved') resolved?: string,
  ) {
    return this.seoService.get404Errors(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      resolved !== undefined ? resolved === 'true' : undefined,
    );
  }

  @Post('404-errors/log')
  async log404Error(
    @Body() body: { url: string; referrer?: string; userAgent?: string },
  ) {
    return this.seoService.log404Error(body.url, body.referrer, body.userAgent);
  }

  @Patch('404-errors/:id/resolve')
  async resolve404Error(
    @Param('id') id: string,
    @Body() body: { redirectToUrl?: string },
  ) {
    return this.seoService.resolve404Error(id, body.redirectToUrl);
  }

  @Delete('404-errors/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete404Error(@Param('id') id: string) {
    return this.seoService.delete404Error(id);
  }

  @Delete('404-errors')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll404Errors() {
    return this.seoService.deleteAll404Errors();
  }

  // ==================== Keyword Tracking ====================

  @Get('keywords')
  async getKeywords(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.seoService.getKeywords(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('keywords/:id')
  async getKeyword(@Param('id') id: string) {
    return this.seoService.getKeyword(id);
  }

  @Post('keywords')
  async createKeyword(@Body() dto: CreateKeywordTrackingDto) {
    return this.seoService.createKeyword(dto);
  }

  @Post('keywords/bulk')
  async createBulkKeywords(@Body() dto: BulkAddKeywordsDto) {
    return this.seoService.createBulkKeywords(dto);
  }

  @Put('keywords/:id')
  async updateKeyword(
    @Param('id') id: string,
    @Body() dto: UpdateKeywordTrackingDto,
  ) {
    return this.seoService.updateKeyword(id, dto);
  }

  @Patch('keywords/:id/ranking')
  async updateKeywordRanking(
    @Param('id') id: string,
    @Body() body: { position: number; searchEngine?: string },
  ) {
    return this.seoService.updateKeywordRanking(
      id,
      body.position,
      body.searchEngine,
    );
  }

  @Delete('keywords/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteKeyword(@Param('id') id: string) {
    return this.seoService.deleteKeyword(id);
  }

  // ==================== Sitemap ====================

  @Get('sitemap/entries')
  async getSitemapEntries(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.seoService.getSitemapEntries(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('sitemap.xml')
  async getSitemapXml(@Res() res: Response) {
    const xml = await this.seoService.generateSitemapXml();
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  }

  @Post('sitemap/entries')
  async createSitemapEntry(@Body() dto: CreateSitemapEntryDto) {
    return this.seoService.createSitemapEntry(dto);
  }

  @Put('sitemap/entries/:id')
  async updateSitemapEntry(
    @Param('id') id: string,
    @Body() dto: UpdateSitemapEntryDto,
  ) {
    return this.seoService.updateSitemapEntry(id, dto);
  }

  @Delete('sitemap/entries/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSitemapEntry(@Param('id') id: string) {
    return this.seoService.deleteSitemapEntry(id);
  }

  // ==================== Schema Templates ====================

  @Get('schemas')
  async getSchemaTemplates(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.seoService.getSchemaTemplates(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('schemas/:id')
  async getSchemaTemplate(@Param('id') id: string) {
    return this.seoService.getSchemaTemplate(id);
  }

  @Post('schemas')
  async createSchemaTemplate(@Body() dto: CreateSchemaTemplateDto) {
    return this.seoService.createSchemaTemplate(dto);
  }

  @Put('schemas/:id')
  async updateSchemaTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateSchemaTemplateDto,
  ) {
    return this.seoService.updateSchemaTemplate(id, dto);
  }

  @Delete('schemas/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchemaTemplate(@Param('id') id: string) {
    return this.seoService.deleteSchemaTemplate(id);
  }

  // ==================== SEO Audit ====================

  @Post('audit')
  async runAudit(@Body() dto: RunSeoAuditDto) {
    return this.seoService.runSeoAudit(dto);
  }

  @Get('audit/history')
  async getAuditHistory(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.seoService.getAuditHistory(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  // ==================== Link Suggestions ====================

  @Get('links/suggestions/:entityType/:entityId')
  async getLinkSuggestions(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.seoService.getLinkSuggestions(entityType, entityId);
  }

  @Post('links/suggestions/:entityType/:entityId/generate')
  async generateLinkSuggestions(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.seoService.generateLinkSuggestions(entityType, entityId);
  }

  @Patch('links/suggestions/:id/dismiss')
  async dismissLinkSuggestion(@Param('id') id: string) {
    return this.seoService.dismissLinkSuggestion(id);
  }

  @Patch('links/suggestions/:id/accept')
  async acceptLinkSuggestion(@Param('id') id: string) {
    return this.seoService.acceptLinkSuggestion(id);
  }
}
