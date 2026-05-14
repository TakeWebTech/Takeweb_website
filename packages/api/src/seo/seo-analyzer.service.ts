import { Injectable } from '@nestjs/common';
import { ContentStats, SeoIssue, SeoSuggestion, SeoScoreResult } from './dto';

interface AnalysisInput {
    content: string;
    title?: string;
    metaDescription?: string;
    focusKeywords?: string[];
    slug?: string;
    url?: string;
}

@Injectable()
export class SeoAnalyzerService {
    // SEO Score weights
    private readonly WEIGHTS = {
        basic: 0.35,
        readability: 0.25,
        technical: 0.25,
        social: 0.15,
    };

    // Ideal ranges for various metrics
    private readonly THRESHOLDS = {
        title: { min: 30, max: 60, ideal: 55 },
        metaDescription: { min: 120, max: 160, ideal: 155 },
        contentLength: { min: 300, ideal: 1500, excellent: 2500 },
        keywordDensity: { min: 0.5, max: 2.5, ideal: 1.5 },
        sentenceLength: { max: 20, ideal: 15 },
        paragraphLength: { max: 150, ideal: 100 },
        h1Count: { min: 1, max: 1 },
        h2Count: { min: 2, ideal: 5 },
        imageCount: { min: 1, perWords: 300 },
        internalLinks: { min: 2, perWords: 500 },
        externalLinks: { min: 1, max: 5 },
    };

    /**
     * Main analysis function - returns comprehensive SEO score
     */
    analyzeContent(input: AnalysisInput): SeoScoreResult {
        const stats = this.calculateContentStats(input.content);
        const issues: SeoIssue[] = [];
        const suggestions: SeoSuggestion[] = [];

        // Calculate component scores
        const basicScore = this.analyzeBasicSeo(input, stats, issues, suggestions);
        const readabilityScore = this.analyzeReadability(input.content, stats, issues, suggestions);
        const technicalScore = this.analyzeTechnical(input, stats, issues, suggestions);
        const socialScore = this.analyzeSocial(input, issues, suggestions);

        // Calculate overall weighted score
        const overall = Math.round(
            basicScore * this.WEIGHTS.basic +
            readabilityScore * this.WEIGHTS.readability +
            technicalScore * this.WEIGHTS.technical +
            socialScore * this.WEIGHTS.social
        );

        return {
            overall,
            basic: basicScore,
            readability: readabilityScore,
            technical: technicalScore,
            social: socialScore,
            issues,
            suggestions,
            stats,
        };
    }

    /**
     * Calculate comprehensive content statistics
     */
    calculateContentStats(content: string): ContentStats {
        // Strip HTML tags for text analysis
        const textContent = this.stripHtml(content);
        const words = this.getWords(textContent);
        const sentences = this.getSentences(textContent);
        const paragraphs = this.getParagraphs(textContent);

        // Count headings
        const headings = this.countHeadings(content);

        // Count images
        const images = (content.match(/<img[^>]*>/gi) || []).length;

        // Count links
        const links = this.countLinks(content);

        // Calculate readability scores
        const fleschReadingEase = this.calculateFleschReadingEase(words.length, sentences.length, this.countSyllables(textContent));
        const fleschKincaidGrade = this.calculateFleschKincaidGrade(words.length, sentences.length, this.countSyllables(textContent));

        return {
            wordCount: words.length,
            characterCount: textContent.length,
            sentenceCount: sentences.length,
            paragraphCount: paragraphs.length,
            avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length * 10) / 10 : 0,
            avgSentencesPerParagraph: paragraphs.length > 0 ? Math.round(sentences.length / paragraphs.length * 10) / 10 : 0,
            readingTime: Math.ceil(words.length / 200), // Average reading speed
            headings,
            images,
            links,
            keywordDensity: {},
            fleschReadingEase,
            fleschKincaidGrade,
        };
    }

    /**
     * Analyze basic SEO factors
     */
    private analyzeBasicSeo(
        input: AnalysisInput,
        stats: ContentStats,
        issues: SeoIssue[],
        suggestions: SeoSuggestion[]
    ): number {
        let score = 100;
        const { title, metaDescription, focusKeywords = [], slug } = input;

        // Title analysis
        if (!title) {
            issues.push({
                id: 'missing_title',
                category: 'basic',
                severity: 'error',
                title: 'Missing Title Tag',
                description: 'Your page is missing a title tag. This is critical for SEO.',
                howToFix: 'Add a unique, descriptive title tag between 30-60 characters.',
            });
            score -= 25;
        } else {
            const titleLength = title.length;
            if (titleLength < this.THRESHOLDS.title.min) {
                issues.push({
                    id: 'title_too_short',
                    category: 'basic',
                    severity: 'warning',
                    title: 'Title Too Short',
                    description: `Your title is ${titleLength} characters. It should be at least ${this.THRESHOLDS.title.min} characters.`,
                    howToFix: 'Expand your title with more descriptive keywords.',
                });
                score -= 10;
            } else if (titleLength > this.THRESHOLDS.title.max) {
                issues.push({
                    id: 'title_too_long',
                    category: 'basic',
                    severity: 'warning',
                    title: 'Title Too Long',
                    description: `Your title is ${titleLength} characters. It may be truncated in search results (max ${this.THRESHOLDS.title.max}).`,
                    howToFix: 'Shorten your title to under 60 characters.',
                });
                score -= 5;
            }

            // Check if focus keyword is in title
            if (focusKeywords.length > 0) {
                const hasKeywordInTitle = focusKeywords.some(kw =>
                    title.toLowerCase().includes(kw.toLowerCase())
                );
                if (!hasKeywordInTitle) {
                    issues.push({
                        id: 'keyword_not_in_title',
                        category: 'basic',
                        severity: 'warning',
                        title: 'Focus Keyword Missing from Title',
                        description: 'Your focus keyword does not appear in the title.',
                        howToFix: 'Include your primary focus keyword in the title, preferably near the beginning.',
                    });
                    score -= 10;
                }
            }
        }

        // Meta description analysis
        if (!metaDescription) {
            issues.push({
                id: 'missing_meta_description',
                category: 'basic',
                severity: 'error',
                title: 'Missing Meta Description',
                description: 'Your page is missing a meta description.',
                howToFix: 'Add a compelling meta description between 120-160 characters.',
            });
            score -= 20;
        } else {
            const descLength = metaDescription.length;
            if (descLength < this.THRESHOLDS.metaDescription.min) {
                issues.push({
                    id: 'meta_description_too_short',
                    category: 'basic',
                    severity: 'warning',
                    title: 'Meta Description Too Short',
                    description: `Your meta description is ${descLength} characters. Aim for at least ${this.THRESHOLDS.metaDescription.min}.`,
                    howToFix: 'Expand your meta description with a compelling call-to-action.',
                });
                score -= 5;
            } else if (descLength > this.THRESHOLDS.metaDescription.max) {
                issues.push({
                    id: 'meta_description_too_long',
                    category: 'basic',
                    severity: 'info',
                    title: 'Meta Description May Be Truncated',
                    description: `Your meta description is ${descLength} characters and may be truncated.`,
                    howToFix: 'Keep your meta description under 160 characters.',
                });
                score -= 2;
            }

            // Check if focus keyword is in meta description
            if (focusKeywords.length > 0) {
                const hasKeywordInDesc = focusKeywords.some(kw =>
                    metaDescription.toLowerCase().includes(kw.toLowerCase())
                );
                if (!hasKeywordInDesc) {
                    issues.push({
                        id: 'keyword_not_in_meta_description',
                        category: 'basic',
                        severity: 'warning',
                        title: 'Focus Keyword Missing from Meta Description',
                        description: 'Your focus keyword does not appear in the meta description.',
                        howToFix: 'Include your focus keyword naturally in the meta description.',
                    });
                    score -= 5;
                }
            }
        }

        // Content length analysis
        if (stats.wordCount < this.THRESHOLDS.contentLength.min) {
            issues.push({
                id: 'thin_content',
                category: 'basic',
                severity: 'error',
                title: 'Thin Content',
                description: `Your content has only ${stats.wordCount} words. Aim for at least ${this.THRESHOLDS.contentLength.min} words.`,
                howToFix: 'Add more valuable, relevant content to your page.',
            });
            score -= 20;
        } else if (stats.wordCount < this.THRESHOLDS.contentLength.ideal) {
            suggestions.push({
                id: 'add_more_content',
                category: 'basic',
                title: 'Consider Adding More Content',
                description: `Your content has ${stats.wordCount} words. Top-ranking pages often have ${this.THRESHOLDS.contentLength.ideal}+ words.`,
                priority: 'medium',
            });
        } else if (stats.wordCount >= this.THRESHOLDS.contentLength.excellent) {
            // Bonus for comprehensive content
            score = Math.min(100, score + 5);
        }

        // Focus keyword analysis in content
        if (focusKeywords.length > 0) {
            const textContent = this.stripHtml(input.content).toLowerCase();
            const mainKeyword = focusKeywords[0].toLowerCase();
            const keywordCount = (textContent.match(new RegExp(mainKeyword, 'gi')) || []).length;
            const density = (keywordCount / stats.wordCount) * 100;

            stats.keywordDensity[focusKeywords[0]] = Math.round(density * 100) / 100;

            if (density < this.THRESHOLDS.keywordDensity.min) {
                issues.push({
                    id: 'low_keyword_density',
                    category: 'basic',
                    severity: 'warning',
                    title: 'Low Keyword Density',
                    description: `Your focus keyword appears ${keywordCount} times (${density.toFixed(2)}%). Aim for ${this.THRESHOLDS.keywordDensity.min}-${this.THRESHOLDS.keywordDensity.max}%.`,
                    howToFix: 'Use your focus keyword more throughout the content naturally.',
                });
                score -= 10;
            } else if (density > this.THRESHOLDS.keywordDensity.max) {
                issues.push({
                    id: 'keyword_stuffing',
                    category: 'basic',
                    severity: 'warning',
                    title: 'Potential Keyword Stuffing',
                    description: `Your keyword density is ${density.toFixed(2)}%, which may be seen as keyword stuffing.`,
                    howToFix: 'Reduce keyword usage and use synonyms/related terms instead.',
                });
                score -= 15;
            }

            // Check keyword in first paragraph
            const firstParagraph = this.getParagraphs(input.content)[0] || '';
            if (!firstParagraph.toLowerCase().includes(mainKeyword)) {
                suggestions.push({
                    id: 'keyword_not_in_intro',
                    category: 'basic',
                    title: 'Add Keyword to Introduction',
                    description: 'Consider adding your focus keyword to the first paragraph.',
                    priority: 'high',
                });
            }
        } else {
            issues.push({
                id: 'no_focus_keyword',
                category: 'basic',
                severity: 'warning',
                title: 'No Focus Keyword Set',
                description: 'You haven\'t set a focus keyword for this content.',
                howToFix: 'Add at least one focus keyword to optimize your content.',
            });
            score -= 10;
        }

        // URL/Slug analysis
        if (slug && focusKeywords.length > 0) {
            const hasKeywordInSlug = focusKeywords.some(kw =>
                slug.toLowerCase().includes(kw.toLowerCase().replace(/\s+/g, '-'))
            );
            if (!hasKeywordInSlug) {
                suggestions.push({
                    id: 'keyword_not_in_url',
                    category: 'basic',
                    title: 'Consider Adding Keyword to URL',
                    description: 'Your focus keyword doesn\'t appear in the URL slug.',
                    priority: 'medium',
                });
            }
        }

        return Math.max(0, score);
    }

    /**
     * Analyze content readability
     */
    private analyzeReadability(
        content: string,
        stats: ContentStats,
        issues: SeoIssue[],
        suggestions: SeoSuggestion[]
    ): number {
        let score = 100;
        const textContent = this.stripHtml(content);

        // Flesch Reading Ease analysis
        if (stats.fleschReadingEase < 30) {
            issues.push({
                id: 'very_difficult_reading',
                category: 'readability',
                severity: 'error',
                title: 'Content is Very Difficult to Read',
                description: `Flesch Reading Ease score is ${stats.fleschReadingEase.toFixed(1)}. Aim for 60+ for web content.`,
                howToFix: 'Use shorter sentences, simpler words, and break up complex ideas.',
            });
            score -= 25;
        } else if (stats.fleschReadingEase < 50) {
            issues.push({
                id: 'difficult_reading',
                category: 'readability',
                severity: 'warning',
                title: 'Content is Difficult to Read',
                description: `Flesch Reading Ease score is ${stats.fleschReadingEase.toFixed(1)}. Consider simplifying.`,
                howToFix: 'Use shorter sentences and everyday vocabulary.',
            });
            score -= 10;
        } else if (stats.fleschReadingEase >= 60) {
            // Good readability - small bonus
            score = Math.min(100, score + 5);
        }

        // Sentence length analysis
        if (stats.avgWordsPerSentence > this.THRESHOLDS.sentenceLength.max) {
            issues.push({
                id: 'long_sentences',
                category: 'readability',
                severity: 'warning',
                title: 'Sentences Are Too Long',
                description: `Average sentence length is ${stats.avgWordsPerSentence} words. Aim for ${this.THRESHOLDS.sentenceLength.ideal} or fewer.`,
                howToFix: 'Break long sentences into shorter ones.',
            });
            score -= 10;
        }

        // Paragraph analysis
        const paragraphs = this.getParagraphs(content);
        const longParagraphs = paragraphs.filter(p => this.getWords(this.stripHtml(p)).length > this.THRESHOLDS.paragraphLength.max);
        if (longParagraphs.length > 0) {
            issues.push({
                id: 'long_paragraphs',
                category: 'readability',
                severity: 'warning',
                title: 'Some Paragraphs Are Too Long',
                description: `${longParagraphs.length} paragraph(s) exceed ${this.THRESHOLDS.paragraphLength.max} words.`,
                howToFix: 'Break long paragraphs into smaller chunks for better readability.',
            });
            score -= 5;
        }

        // Heading distribution
        if (stats.headings.h1 === 0) {
            issues.push({
                id: 'missing_h1',
                category: 'readability',
                severity: 'error',
                title: 'Missing H1 Heading',
                description: 'Your content has no H1 heading.',
                howToFix: 'Add exactly one H1 heading that describes the main topic.',
            });
            score -= 15;
        } else if (stats.headings.h1 > 1) {
            issues.push({
                id: 'multiple_h1',
                category: 'readability',
                severity: 'warning',
                title: 'Multiple H1 Headings',
                description: `Found ${stats.headings.h1} H1 headings. Use only one per page.`,
                howToFix: 'Keep only one H1 heading and convert others to H2.',
            });
            score -= 10;
        }

        if (stats.headings.h2 < this.THRESHOLDS.h2Count.min && stats.wordCount > 500) {
            suggestions.push({
                id: 'add_subheadings',
                category: 'readability',
                title: 'Add More Subheadings',
                description: 'Break your content into sections using H2 headings.',
                priority: 'medium',
            });
        }

        // Transition words check
        const transitionWords = this.countTransitionWords(textContent);
        const transitionPercentage = (transitionWords / stats.sentenceCount) * 100;
        if (transitionPercentage < 20 && stats.sentenceCount > 5) {
            suggestions.push({
                id: 'add_transition_words',
                category: 'readability',
                title: 'Use More Transition Words',
                description: 'Adding transition words improves content flow and readability.',
                priority: 'low',
            });
        }

        // Passive voice check
        const passiveCount = this.countPassiveVoice(textContent);
        const passivePercentage = (passiveCount / stats.sentenceCount) * 100;
        if (passivePercentage > 20) {
            issues.push({
                id: 'too_much_passive',
                category: 'readability',
                severity: 'info',
                title: 'High Passive Voice Usage',
                description: `${passivePercentage.toFixed(1)}% of sentences use passive voice.`,
                howToFix: 'Rewrite passive sentences in active voice for more engaging content.',
            });
            score -= 5;
        }

        return Math.max(0, score);
    }

    /**
     * Analyze technical SEO factors
     */
    private analyzeTechnical(
        input: AnalysisInput,
        stats: ContentStats,
        issues: SeoIssue[],
        suggestions: SeoSuggestion[]
    ): number {
        let score = 100;

        // Image analysis
        if (stats.images === 0 && stats.wordCount > 300) {
            issues.push({
                id: 'no_images',
                category: 'technical',
                severity: 'warning',
                title: 'No Images Found',
                description: 'Your content has no images. Images improve engagement and SEO.',
                howToFix: 'Add relevant images with optimized alt text.',
            });
            score -= 10;
        } else {
            // Check recommended image ratio
            const recommendedImages = Math.ceil(stats.wordCount / this.THRESHOLDS.imageCount.perWords);
            if (stats.images < recommendedImages) {
                suggestions.push({
                    id: 'add_more_images',
                    category: 'technical',
                    title: 'Consider Adding More Images',
                    description: `You have ${stats.images} image(s). Consider adding ${recommendedImages - stats.images} more.`,
                    priority: 'low',
                });
            }
        }

        // Link analysis
        const totalLinks = stats.links.internal + stats.links.external;
        if (totalLinks === 0 && stats.wordCount > 300) {
            issues.push({
                id: 'no_links',
                category: 'technical',
                severity: 'warning',
                title: 'No Links Found',
                description: 'Your content has no internal or external links.',
                howToFix: 'Add relevant internal links to related content and authoritative external sources.',
            });
            score -= 15;
        } else {
            if (stats.links.internal < this.THRESHOLDS.internalLinks.min) {
                suggestions.push({
                    id: 'add_internal_links',
                    category: 'technical',
                    title: 'Add More Internal Links',
                    description: `You have ${stats.links.internal} internal link(s). Add more to improve site structure.`,
                    priority: 'high',
                });
                score -= 5;
            }

            if (stats.links.external === 0 && stats.wordCount > 500) {
                suggestions.push({
                    id: 'add_external_links',
                    category: 'technical',
                    title: 'Consider Adding External Links',
                    description: 'Linking to authoritative sources can improve content credibility.',
                    priority: 'low',
                });
            }
        }

        // Focus keyword in headings
        if (input.focusKeywords && input.focusKeywords.length > 0) {
            const headingsText = this.extractHeadingsText(input.content);
            const hasKeywordInHeading = input.focusKeywords.some(kw =>
                headingsText.toLowerCase().includes(kw.toLowerCase())
            );
            if (!hasKeywordInHeading) {
                suggestions.push({
                    id: 'keyword_not_in_heading',
                    category: 'technical',
                    title: 'Add Keyword to a Heading',
                    description: 'Include your focus keyword in at least one subheading.',
                    priority: 'medium',
                });
            }
        }

        return Math.max(0, score);
    }

    /**
     * Analyze social media optimization
     */
    private analyzeSocial(
        input: AnalysisInput,
        issues: SeoIssue[],
        suggestions: SeoSuggestion[]
    ): number {
        // This is a placeholder - actual social analysis would check OG tags, Twitter cards, etc.
        // For content analysis, we give a base score
        let score = 70;

        if (input.title && input.title.length >= 30 && input.title.length <= 60) {
            score += 15;
        }

        if (input.metaDescription && input.metaDescription.length >= 120 && input.metaDescription.length <= 160) {
            score += 15;
        }

        return Math.min(100, score);
    }

    // ==================== Utility Methods ====================

    private stripHtml(html: string): string {
        return html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    private getWords(text: string): string[] {
        return text.split(/\s+/).filter(word => word.length > 0);
    }

    private getSentences(text: string): string[] {
        return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    }

    private getParagraphs(content: string): string[] {
        // Split by paragraph tags or double newlines
        return content
            .split(/<\/p>|<br\s*\/?>\s*<br\s*\/?>|\n\n+/i)
            .map(p => p.replace(/<p[^>]*>/gi, '').trim())
            .filter(p => p.length > 0);
    }

    private countHeadings(content: string): { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number } {
        return {
            h1: (content.match(/<h1[^>]*>/gi) || []).length,
            h2: (content.match(/<h2[^>]*>/gi) || []).length,
            h3: (content.match(/<h3[^>]*>/gi) || []).length,
            h4: (content.match(/<h4[^>]*>/gi) || []).length,
            h5: (content.match(/<h5[^>]*>/gi) || []).length,
            h6: (content.match(/<h6[^>]*>/gi) || []).length,
        };
    }

    private countLinks(content: string): { internal: number; external: number; nofollow: number } {
        const linkMatches = content.match(/<a[^>]*href=["'][^"']*["'][^>]*>/gi) || [];
        let internal = 0;
        let external = 0;
        let nofollow = 0;

        const siteHost = 'takeweb.in'; // This should be configurable

        linkMatches.forEach(link => {
            const hrefMatch = link.match(/href=["']([^"']*)["']/i);
            if (hrefMatch) {
                const href = hrefMatch[1];
                if (href.startsWith('/') || href.includes(siteHost) || !href.includes('://')) {
                    internal++;
                } else {
                    external++;
                }
            }
            if (link.toLowerCase().includes('rel="nofollow"') || link.toLowerCase().includes("rel='nofollow'")) {
                nofollow++;
            }
        });

        return { internal, external, nofollow };
    }

    private extractHeadingsText(content: string): string {
        const headings = content.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || [];
        return headings.map(h => this.stripHtml(h)).join(' ');
    }

    private countSyllables(text: string): number {
        const words = this.getWords(text.toLowerCase());
        let count = 0;
        words.forEach(word => {
            count += this.countWordSyllables(word);
        });
        return count;
    }

    private countWordSyllables(word: string): number {
        word = word.toLowerCase().replace(/[^a-z]/g, '');
        if (word.length <= 3) return 1;

        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');

        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }

    private calculateFleschReadingEase(words: number, sentences: number, syllables: number): number {
        if (words === 0 || sentences === 0) return 0;
        return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    }

    private calculateFleschKincaidGrade(words: number, sentences: number, syllables: number): number {
        if (words === 0 || sentences === 0) return 0;
        return 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
    }

    private countTransitionWords(text: string): number {
        const transitionWords = [
            'however', 'therefore', 'furthermore', 'moreover', 'consequently',
            'nevertheless', 'although', 'because', 'since', 'while',
            'thus', 'hence', 'accordingly', 'meanwhile', 'subsequently',
            'first', 'second', 'third', 'finally', 'additionally',
            'also', 'besides', 'likewise', 'similarly', 'in addition',
            'for example', 'for instance', 'in other words', 'in fact',
            'on the other hand', 'in contrast', 'as a result', 'in conclusion'
        ];

        const lowerText = text.toLowerCase();
        return transitionWords.reduce((count, word) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            return count + (lowerText.match(regex) || []).length;
        }, 0);
    }

    private countPassiveVoice(text: string): number {
        // Simple passive voice detection
        const passivePatterns = [
            /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi,
            /\b(am|is|are|was|were|be|been|being)\s+\w+en\b/gi,
        ];

        let count = 0;
        passivePatterns.forEach(pattern => {
            count += (text.match(pattern) || []).length;
        });
        return count;
    }

    /**
     * Generate AI-powered content suggestions
     */
    generateContentSuggestions(input: AnalysisInput): string[] {
        const suggestions: string[] = [];
        const stats = this.calculateContentStats(input.content);

        if (stats.wordCount < 1000) {
            suggestions.push('Consider expanding your content to at least 1000 words for better ranking potential.');
        }

        if (stats.headings.h2 < 3) {
            suggestions.push('Add more H2 subheadings to break up your content into scannable sections.');
        }

        if (stats.images === 0) {
            suggestions.push('Add relevant images to increase engagement and time on page.');
        }

        if (input.focusKeywords && input.focusKeywords.length > 0) {
            const keyword = input.focusKeywords[0];
            suggestions.push(`Consider adding related terms and synonyms for "${keyword}" to improve semantic relevance.`);
            suggestions.push(`Include a FAQ section addressing common questions about "${keyword}".`);
        }

        return suggestions;
    }
}
