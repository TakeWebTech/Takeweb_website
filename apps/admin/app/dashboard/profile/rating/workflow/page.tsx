"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, ChevronRight, Star, Shield, AlertTriangle, Send, Check } from "lucide-react";
import { toast } from "react-hot-toast";

const base = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") : "";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" });

const CATEGORIES = [
    { id: "TEAM_MEMBER", label: "Team Members" },
    { id: "PROJECT_LEAD", label: "Project Leads" },
    { id: "TEAM_LEAD", label: "Team Leads" },
    { id: "DEPARTMENT_LEAD", label: "Department Leads" },
    { id: "HR", label: "HR Representatives" },
    { id: "MANAGEMENT", label: "Management" },
    { id: "COMPANY_FEEDBACK", label: "Company Feedback" }
];

export default function ReviewWorkflowPage() {
    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    
    // Workflow Data
    const [targets, setTargets] = useState<any>({});
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [activeCategory, setActiveCategory] = useState("TEAM_MEMBER");
    const [reviews, setReviews] = useState<Record<string, any>>({});
    
    // Feedback State
    const [companyFeedback, setCompanyFeedback] = useState({ category: "Work Culture", priority: "Medium", content: "", isAnonymous: true });

    useEffect(() => {
        fetch(`${base}/api/v1/reviews/workflow-targets`, { headers: headers() })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.categories) {
                    setTargets(data.categories);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleRatingChange = (userId: string, rating: number) => {
        setReviews(prev => ({ ...prev, [userId]: { ...prev[userId], rating, status: "SUBMITTED" } }));
    };

    const handleCommentChange = (userId: string, comment: string) => {
        setReviews(prev => ({ ...prev, [userId]: { ...prev[userId], comment } }));
    };

    const handleMarkNA = (userId: string) => {
        setReviews(prev => ({ 
            ...prev, 
            [userId]: prev[userId]?.status === "NA" ? undefined : { status: "NA" }
        }));
    };

    const isCategoryComplete = (categoryId: string) => {
        if (categoryId === "COMPANY_FEEDBACK") return true; // Optional
        const categoryTargets = targets[categoryId] || [];
        if (categoryTargets.length === 0) return true;
        
        return categoryTargets.every((t: any) => 
            reviews[t.id] && (reviews[t.id].status === "NA" || reviews[t.id].rating > 0)
        );
    };

    const completedCategoriesCount = CATEGORIES.filter(c => isCategoryComplete(c.id)).length;
    const progressPercentage = (completedCategoriesCount / CATEGORIES.length) * 100;

    const handleNextCategory = () => {
        const currentIndex = CATEGORIES.findIndex(c => c.id === activeCategory);
        if (!isCategoryComplete(activeCategory)) {
            toast.error("Please complete all reviews in this category or mark them as N/A");
            return;
        }
        if (currentIndex < CATEGORIES.length - 1) {
            setActiveCategory(CATEGORIES[currentIndex + 1].id);
        } else {
            submitAllReviews();
        }
    };

    const submitAllReviews = async () => {
        try {
            // Submit individual user reviews
            for (const categoryId of Object.keys(targets)) {
                for (const user of targets[categoryId]) {
                    const review = reviews[user.id];
                    if (review) {
                        await fetch(`${base}/api/v1/reviews`, {
                            method: "POST",
                            headers: headers(),
                            body: JSON.stringify({ 
                                targetUserId: user.id, 
                                rating: review.rating, 
                                comment: review.comment, 
                                status: review.status,
                                categoryId 
                            })
                        });
                    }
                }
            }

            // Submit company feedback if provided
            if (companyFeedback.content.trim()) {
                await fetch(`${base}/api/v1/reviews/feedback`, {
                    method: "POST",
                    headers: headers(),
                    body: JSON.stringify(companyFeedback)
                });
            }

            toast.success("All reviews submitted successfully!");
            window.location.href = "/dashboard/profile/rating";
        } catch (error) {
            toast.error("Failed to submit some reviews. Please try again.");
        }
    };

    if (step === 1) {
        return (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in mt-10">
                <div className="text-center space-y-4 mb-10">
                    <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Anonymous Review System</h1>
                    <p className="text-neutral-400 text-lg">Honest feedback drives our organizational growth.</p>
                </div>

                <div className="card space-y-6">
                    <h2 className="text-xl font-semibold text-white border-b border-dark-700 pb-4">Review Policy</h2>
                    
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                            <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-white">Complete Anonymity</h3>
                                <p className="text-sm text-neutral-400">Your real identity will be completely hidden from the employees you review. A random anonymous ID will be generated for you.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-white">Professional Conduct</h3>
                                <p className="text-sm text-neutral-400">Honest, constructive feedback is encouraged. Abusive language, harassment, discrimination, or personal attacks are strictly prohibited and monitored by AI.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                            <AlertCircle className="text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-white">No Forced Reviews</h3>
                                <p className="text-sm text-neutral-400">If you do not work closely with an assigned individual, you can easily mark the review as "N/A" (Prefer Not to Review).</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-dark-700">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-dark-600 bg-dark-900 text-blue-500 focus:ring-blue-500"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            <span className="text-white font-medium">I understand and agree to the anonymous review policy.</span>
                        </label>
                    </div>

                    <button 
                        disabled={!agreed}
                        onClick={() => setStep(2)}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${agreed ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-dark-700 text-neutral-500 cursor-not-allowed'}`}
                    >
                        Start Review Workflow <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    const currentTargets = targets[activeCategory] || [];

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
            {/* Progress Header */}
            <div className="card p-4 shrink-0 flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-white">Overall Progress</span>
                        <span className="text-blue-400">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                    </div>
                </div>
                <div className="ml-8 text-right hidden sm:block">
                    <p className="text-sm text-neutral-400">Current Category</p>
                    <p className="font-bold text-white">{CATEGORIES.find(c => c.id === activeCategory)?.label}</p>
                </div>
            </div>

            {/* 2-Panel Layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-0">
                
                {/* Left Sidebar */}
                <div className="card p-4 overflow-y-auto space-y-2">
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Categories</h3>
                    {CATEGORIES.map(category => {
                        const isComplete = isCategoryComplete(category.id);
                        const isActive = activeCategory === category.id;
                        
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${isActive ? 'bg-blue-500/10 border border-blue-500/50 text-blue-400' : 'bg-dark-800/50 border border-transparent text-neutral-400 hover:bg-dark-700'}`}
                            >
                                <span className="font-medium text-sm">{category.label}</span>
                                {isComplete && <CheckCircle2 size={16} className="text-emerald-500" />}
                            </button>
                        )
                    })}
                </div>

                {/* Right Panel */}
                <div className="md:col-span-3 card p-6 overflow-y-auto bg-dark-900/50">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-neutral-500">Loading targets...</div>
                    ) : activeCategory === "COMPANY_FEEDBACK" ? (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Company Feedback & Suggestions</h2>
                            <p className="text-neutral-400 text-sm mb-6">Share your ideas on how to improve the workplace, culture, and processes.</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Category Tag</label>
                                    <select 
                                        value={companyFeedback.category}
                                        onChange={e => setCompanyFeedback({...companyFeedback, category: e.target.value})}
                                        className="input-field w-full"
                                    >
                                        <option>Work Culture</option>
                                        <option>Team Collaboration</option>
                                        <option>Productivity</option>
                                        <option>HR Policies</option>
                                        <option>Leadership</option>
                                        <option>Technology</option>
                                        <option>Infrastructure</option>
                                        <option>Communication</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Priority</label>
                                    <select 
                                        value={companyFeedback.priority}
                                        onChange={e => setCompanyFeedback({...companyFeedback, priority: e.target.value})}
                                        className="input-field w-full"
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Critical</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Feedback Detail</label>
                                <textarea 
                                    value={companyFeedback.content}
                                    onChange={e => setCompanyFeedback({...companyFeedback, content: e.target.value})}
                                    className="input-field w-full h-40 resize-none"
                                    placeholder="I think we should improve..."
                                />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer mt-4">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-dark-600 bg-dark-900 text-blue-500"
                                    checked={companyFeedback.isAnonymous}
                                    onChange={(e) => setCompanyFeedback({...companyFeedback, isAnonymous: e.target.checked})}
                                />
                                <span className="text-neutral-300 text-sm">Submit anonymously</span>
                            </label>

                        </div>
                    ) : currentTargets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center text-neutral-500">
                                <Check size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">No targets found</h3>
                                <p className="text-neutral-500 text-sm">You have no pending reviews in this category.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">{CATEGORIES.find(c => c.id === activeCategory)?.label}</h2>
                                <span className="px-3 py-1 bg-dark-800 rounded-full text-xs text-neutral-400">{currentTargets.length} to review</span>
                            </div>

                            {currentTargets.map((target: any) => {
                                const review = reviews[target.id] || { rating: 0, comment: "", status: "PENDING" };
                                const isNA = review.status === "NA";

                                return (
                                    <div key={target.id} className={`p-5 rounded-2xl border transition-all ${isNA ? 'bg-dark-800/30 border-dark-700/50 opacity-75' : 'bg-dark-800 border-dark-700'}`}>
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            
                                            {/* Profile Info */}
                                            <div className="flex items-start gap-4 shrink-0 w-64">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                                    {target.firstName[0]}{target.lastName[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">{target.firstName} {target.lastName}</h3>
                                                    <p className="text-xs text-blue-400">{target.department || "General"}</p>
                                                    <p className="text-xs text-neutral-500 mt-1">ID: {target.id.slice(-6)}</p>
                                                </div>
                                            </div>

                                            {/* Actions & Form */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <div className={`flex items-center gap-1 ${isNA ? 'opacity-50 pointer-events-none' : ''}`}>
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <button 
                                                                key={s} 
                                                                onClick={() => handleRatingChange(target.id, s)}
                                                                className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                                            >
                                                                <Star size={24} className={s <= review.rating ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-dark-600"} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button 
                                                        onClick={() => handleMarkNA(target.id)}
                                                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${isNA ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-dark-900 border-dark-600 text-neutral-400 hover:text-white'}`}
                                                    >
                                                        {isNA ? "Skipped (N/A)" : "Mark as N/A"}
                                                    </button>
                                                </div>

                                                {!isNA && (
                                                    <textarea 
                                                        value={review.comment}
                                                        onChange={(e) => handleCommentChange(target.id, e.target.value)}
                                                        placeholder="Constructive feedback for this employee..."
                                                        className="input-field w-full h-20 resize-none text-sm"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="flex justify-between items-center shrink-0 pt-4">
                <button 
                    onClick={() => {
                        const currentIndex = CATEGORIES.findIndex(c => c.id === activeCategory);
                        if (currentIndex > 0) setActiveCategory(CATEGORIES[currentIndex - 1].id);
                    }}
                    className={`btn-secondary ${activeCategory === CATEGORIES[0].id ? 'invisible' : ''}`}
                >
                    Previous
                </button>

                <button 
                    onClick={handleNextCategory}
                    className="btn-primary"
                >
                    {activeCategory === CATEGORIES[CATEGORIES.length - 1].id ? (
                        <>Submit All Reviews <Send size={16} /></>
                    ) : (
                        <>Next Category <ChevronRight size={16} /></>
                    )}
                </button>
            </div>
        </div>
    );
}
