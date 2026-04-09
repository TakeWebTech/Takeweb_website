"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft, Search, Target, CheckCircle2, AlertTriangle,
    XCircle, Info, TrendingUp, FileText, Clock, Lightbulb,
} from "lucide-react";

interface ContentStats {
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

interface SeoIssue {
    id: string;
    category: string;
    severity: "error" | "warning" | "info";
    title: string;
    description: string;
    howToFix: string;
}

interface SeoSuggestion {
    id: string;
    category: string;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
}

interface AnalysisResult {
    overall: number;
    basic: number;
    readability: number;
    technical: number;
    social: number;
    issues: SeoIssue[];
    suggestions: SeoSuggestion[];
    stats: ContentStats;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function SeoAnalyzerPage() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [focusKeywords, setFocusKeywords] = useState("");
    const [slug, setSlug] = useState("");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    const analyzeContent = async () => {
        if (!content.trim()) return;

        setAnalyzing(true);
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_URL}/api/v1/seo/analyze`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    title: title || undefined,
                    metaDescription: metaDescription || undefined,
                    focusKeywords: focusKeywords ? focusKeywords.split(",").map(k => k.trim()) : [],
                    slug: slug || undefined,
                }),
            });
            if (res.ok) {
                setResult(await res.json());
            }
        } catch (e) {
            console.error("Analysis failed:", e);
        } finally {
            setAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-success";
        if (score >= 60) return "text-warning";
        return "text-error";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-success";
        if (score >= 60) return "bg-warning";
        return "bg-error";
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "error": return <XCircle className="text-error" size={16} />;
            case "warning": return <AlertTriangle className="text-warning" size={16} />;
            default: return <Info className="text-info" size={16} />;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "high": return <span className="badge badge-error text-xs">High</span>;
            case "medium": return <span className="badge badge-warning text-xs">Medium</span>;
            default: return <span className="badge badge-info text-xs">Low</span>;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/seo" className="btn-ghost btn-sm">
                    <ArrowLeft size={16} />
                </Link>
                <div className="page-header">
                    <h1>Content Analyzer</h1>
                    <p>Analyze and optimize your content for search engines</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                    <div className="card-container p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Target size={18} />
                            Focus Keywords
                        </h3>
                        <input
                            type="text"
                            value={focusKeywords}
                            onChange={(e) => setFocusKeywords(e.target.value)}
                            placeholder="Enter keywords separated by commas"
                            className="input input-bordered w-full"
                        />
                        <p className="text-xs text-neutral-500">
                            Primary keyword should be first. E.g., "web development, website design, responsive design"
                        </p>
                    </div>

                    <div className="card-container p-6 space-y-4">
                        <h3 className="font-semibold">SEO Title</h3>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your SEO title"
                            className="input input-bordered w-full"
                        />
                        <div className="flex justify-between text-xs">
                            <span className={title.length > 60 ? "text-warning" : "text-neutral-500"}>
                                {title.length}/60 characters
                            </span>
                            {title.length > 0 && title.length <= 60 && (
                                <span className="text-success">✓ Good length</span>
                            )}
                        </div>
                    </div>

                    <div className="card-container p-6 space-y-4">
                        <h3 className="font-semibold">Meta Description</h3>
                        <textarea
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            placeholder="Enter your meta description"
                            className="textarea textarea-bordered w-full"
                            rows={3}
                        />
                        <div className="flex justify-between text-xs">
                            <span className={metaDescription.length > 160 ? "text-warning" : "text-neutral-500"}>
                                {metaDescription.length}/160 characters
                            </span>
                            {metaDescription.length >= 120 && metaDescription.length <= 160 && (
                                <span className="text-success">✓ Optimal length</span>
                            )}
                        </div>
                    </div>

                    <div className="card-container p-6 space-y-4">
                        <h3 className="font-semibold">URL Slug</h3>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="your-page-url-slug"
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="card-container p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <FileText size={18} />
                            Content
                        </h3>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your content here (HTML or plain text)..."
                            className="textarea textarea-bordered w-full font-mono text-sm"
                            rows={12}
                        />
                        <button
                            onClick={analyzeContent}
                            disabled={analyzing || !content.trim()}
                            className="btn-primary w-full"
                        >
                            {analyzing ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Search size={16} />
                                    Analyze Content
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    {result ? (
                        <>
                            {/* Overall Score */}
                            <div className="card-container p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">SEO Score</h3>
                                    <span className={`text-3xl font-bold ${getScoreColor(result.overall)}`}>
                                        {result.overall}/100
                                    </span>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-full ${getScoreBg(result.overall)} transition-all duration-500`}
                                        style={{ width: `${result.overall}%` }}
                                    />
                                </div>

                                {/* Category Scores */}
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div>
                                        <p className="text-sm text-neutral-500">Basic SEO</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold ${getScoreColor(result.basic)}`}>
                                                {result.basic}%
                                            </span>
                                            <div className="flex-1 bg-base-300 rounded-full h-2">
                                                <div
                                                    className={`h-full rounded-full ${getScoreBg(result.basic)}`}
                                                    style={{ width: `${result.basic}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500">Readability</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold ${getScoreColor(result.readability)}`}>
                                                {result.readability}%
                                            </span>
                                            <div className="flex-1 bg-base-300 rounded-full h-2">
                                                <div
                                                    className={`h-full rounded-full ${getScoreBg(result.readability)}`}
                                                    style={{ width: `${result.readability}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500">Technical</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold ${getScoreColor(result.technical)}`}>
                                                {result.technical}%
                                            </span>
                                            <div className="flex-1 bg-base-300 rounded-full h-2">
                                                <div
                                                    className={`h-full rounded-full ${getScoreBg(result.technical)}`}
                                                    style={{ width: `${result.technical}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500">Social</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold ${getScoreColor(result.social)}`}>
                                                {result.social}%
                                            </span>
                                            <div className="flex-1 bg-base-300 rounded-full h-2">
                                                <div
                                                    className={`h-full rounded-full ${getScoreBg(result.social)}`}
                                                    style={{ width: `${result.social}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Stats */}
                            <div className="card-container p-6">
                                <h3 className="font-semibold mb-4">Content Statistics</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-base-200 rounded-lg">
                                        <p className="text-2xl font-bold">{result.stats.wordCount}</p>
                                        <p className="text-xs text-neutral-500">Words</p>
                                    </div>
                                    <div className="text-center p-3 bg-base-200 rounded-lg">
                                        <p className="text-2xl font-bold">{result.stats.sentenceCount}</p>
                                        <p className="text-xs text-neutral-500">Sentences</p>
                                    </div>
                                    <div className="text-center p-3 bg-base-200 rounded-lg">
                                        <p className="text-2xl font-bold flex items-center justify-center gap-1">
                                            <Clock size={16} />
                                            {result.stats.readingTime}
                                        </p>
                                        <p className="text-xs text-neutral-500">Min read</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-2">Headings</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="badge badge-outline">H1: {result.stats.headings.h1}</span>
                                            <span className="badge badge-outline">H2: {result.stats.headings.h2}</span>
                                            <span className="badge badge-outline">H3: {result.stats.headings.h3}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-2">Links & Images</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="badge badge-outline">Internal: {result.stats.links.internal}</span>
                                            <span className="badge badge-outline">External: {result.stats.links.external}</span>
                                            <span className="badge badge-outline">Images: {result.stats.images}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm text-neutral-500 mb-2">Readability</p>
                                    <div className="flex gap-4">
                                        <div>
                                            <p className="text-xs text-neutral-400">Flesch Reading Ease</p>
                                            <p className={`font-semibold ${getScoreColor(result.stats.fleschReadingEase)}`}>
                                                {result.stats.fleschReadingEase.toFixed(1)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-400">Grade Level</p>
                                            <p className="font-semibold">
                                                {result.stats.fleschKincaidGrade.toFixed(1)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-400">Avg Words/Sentence</p>
                                            <p className="font-semibold">
                                                {result.stats.avgWordsPerSentence}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {Object.keys(result.stats.keywordDensity).length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-neutral-500 mb-2">Keyword Density</p>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(result.stats.keywordDensity).map(([kw, density]) => (
                                                <span key={kw} className="badge badge-primary">
                                                    {kw}: {density}%
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Issues */}
                            {result.issues.length > 0 && (
                                <div className="card-container p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <AlertTriangle size={18} />
                                        Issues ({result.issues.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {result.issues.map((issue) => (
                                            <div
                                                key={issue.id}
                                                className="p-4 bg-base-200 rounded-lg"
                                            >
                                                <div className="flex items-start gap-3">
                                                    {getSeverityIcon(issue.severity)}
                                                    <div className="flex-1">
                                                        <p className="font-medium">{issue.title}</p>
                                                        <p className="text-sm text-neutral-500 mt-1">
                                                            {issue.description}
                                                        </p>
                                                        <p className="text-sm text-primary mt-2">
                                                            <strong>Fix:</strong> {issue.howToFix}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {result.suggestions.length > 0 && (
                                <div className="card-container p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <Lightbulb size={18} />
                                        Suggestions ({result.suggestions.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {result.suggestions.map((suggestion) => (
                                            <div
                                                key={suggestion.id}
                                                className="p-4 bg-base-200 rounded-lg flex items-start gap-3"
                                            >
                                                <TrendingUp className="text-success" size={16} />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">{suggestion.title}</p>
                                                        {getPriorityBadge(suggestion.priority)}
                                                    </div>
                                                    <p className="text-sm text-neutral-500 mt-1">
                                                        {suggestion.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="card-container p-12 text-center">
                            <Search className="mx-auto text-neutral-400 mb-4" size={48} />
                            <h3 className="font-semibold mb-2">Ready to Analyze</h3>
                            <p className="text-neutral-500">
                                Enter your content on the left and click "Analyze Content" to get detailed SEO insights.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
