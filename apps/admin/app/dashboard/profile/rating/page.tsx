"use client";

import { useState, useEffect } from "react";
import { Star, TrendingUp, TrendingDown, MessageSquare, Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";

const base = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") : "";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" });

export default function RatingPage() {
    const [stats, setStats] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [targets, setTargets] = useState<any[]>([]);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetUserId, setTargetUserId] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(`${base}/api/v1/reviews/stats`, { headers: headers() })
            .then(res => res.ok ? res.json() : null)
            .then(data => setStats(data));
            
        fetch(`${base}/api/v1/reviews/received`, { headers: headers() })
            .then(res => res.ok ? res.json() : [])
            .then(data => setReviews(data));
            
        fetch(`${base}/api/v1/reviews/targets`, { headers: headers() })
            .then(res => res.ok ? res.json() : [])
            .then(data => setTargets(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetUserId) return toast.error("Select an employee");
        setSubmitting(true);
        try {
            const res = await fetch(`${base}/api/v1/reviews`, {
                method: "POST",
                headers: headers(),
                body: JSON.stringify({ targetUserId, rating, comment })
            });
            if (!res.ok) throw new Error(await res.text());
            toast.success("Review submitted anonymously!");
            setIsModalOpen(false);
            setTargetUserId("");
            setRating(5);
            setComment("");
        } catch (err: any) {
            toast.error(err.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const currentRating = stats?.currentRating || 0;
    
    return (
        <div className="space-y-6 animate-fade-in max-w-5xl relative">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="flex items-center gap-2"><Star size={22} className="text-amber-400" /> My Rating</h1>
                    <p>Performance reviews and rating history</p>
                </div>
                <button 
                    onClick={() => window.location.href = '/dashboard/profile/rating/workflow'}
                    className="btn-primary"
                >
                    <Plus size={16} /> Start Review Workflow
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "This Week", value: stats?.currentWeek?.rating || 0, prev: stats?.lastWeek?.rating || 0, color: "from-amber-500 to-orange-600" },
                    { label: "This Month", value: stats?.currentMonth?.rating || 0, prev: stats?.lastMonth?.rating || 0, color: "from-blue-500 to-indigo-600" },
                    { label: "Last Week", value: stats?.lastWeek?.rating || 0, prev: 0, color: "from-emerald-500 to-teal-600" },
                    { label: "Last Month", value: stats?.lastMonth?.rating || 0, prev: 0, color: "from-purple-500 to-violet-600" },
                ].map((card) => {
                    const trend = card.value - card.prev;
                    const isUp = trend >= 0;
                    return (
                        <div key={card.label} className="card relative overflow-hidden">
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`} />
                            <p className="text-xs text-neutral-500 mb-2">{card.label}</p>
                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={16} className={s <= Math.round(card.value) ? "text-amber-400 fill-amber-400" : "text-dark-600"} />
                                ))}
                            </div>
                            <p className="text-2xl font-bold text-white">{card.value.toFixed(1)}</p>
                            {card.prev > 0 && (
                                <div className={`flex items-center gap-1 text-xs mt-1 ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    <span>{isUp ? "+" : ""}{trend.toFixed(1)} vs prev</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Recent Feedback */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={16} className="text-emerald-400" />
                    <h2 className="text-sm font-semibold text-white">Recent Feedback</h2>
                </div>
                {reviews.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500 text-sm">No reviews received yet.</div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map(r => (
                            <div key={r.id} className="p-4 rounded-xl bg-dark-800/50 border border-dark-700/50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-xs font-mono text-neutral-400 border border-dark-600">
                                            {r.anonymousId.split('#')[1]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{r.anonymousId}</p>
                                            <p className="text-[10px] text-neutral-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={12} className={s <= Math.round(r.rating) ? "text-amber-400 fill-amber-400" : "text-dark-600"} />
                                        ))}
                                    </div>
                                </div>
                                {r.comment && <p className="text-sm text-neutral-300 mt-2 p-3 bg-dark-900/50 rounded-lg italic">"{r.comment}"</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center p-4 border-b border-dark-800">
                            <h2 className="text-lg font-bold text-white">Submit Anonymous Review</h2>
                            <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Select Employee</label>
                                <select 
                                    value={targetUserId} 
                                    onChange={e => setTargetUserId(e.target.value)}
                                    className="input-field w-full"
                                    required
                                >
                                    <option value="">-- Choose Employee --</option>
                                    {targets.map(t => (
                                        <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.department || 'General'})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Rating (1-5)</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button 
                                            key={s} type="button" 
                                            onClick={() => setRating(s)}
                                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star size={24} className={s <= rating ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-dark-600"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Feedback (Optional)</label>
                                <textarea 
                                    value={comment} 
                                    onChange={e => setComment(e.target.value)}
                                    className="input-field w-full h-24 resize-none"
                                    placeholder="Write your anonymous constructive feedback here..."
                                />
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                                    {submitting ? "Submitting..." : "Submit Anonymously"}
                                </button>
                                <p className="text-[10px] text-center text-neutral-500 mt-2">
                                    Your real identity will be hidden from the employee as well with the admin team. Only a random anonymous ID will be shown. Admins can not see the full details and are committed to confidentiality. Please provide honest and constructive feedback.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
