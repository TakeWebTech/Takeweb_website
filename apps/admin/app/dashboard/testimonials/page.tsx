"use client";

import { useState } from "react";
import {
    Quote,
    Plus,
    Edit,
    Trash2,
    Star,
    X,
    Save,
    User,
    Building,
    MessageSquare,
} from "lucide-react";

interface Testimonial {
    id: string;
    quote: string;
    author: string;
    position: string;
    company: string;
    rating: number;
    isActive: boolean;
    avatar?: string;
}

const initialTestimonials: Testimonial[] = [
    {
        id: "1",
        quote: "TakeWeb transformed our entire digital infrastructure. Their team delivered exceptional results on time and within budget. A true technology partner.",
        author: "Michael Chen",
        position: "CTO",
        company: "TechVista Corp",
        rating: 5,
        isActive: true,
        avatar: "/testimonials/avatar-1.jpg",
    },
    {
        id: "2",
        quote: "The AI solutions implemented by TakeWeb increased our efficiency by 40%. Their expertise in machine learning is unmatched in the industry.",
        author: "Sarah Johnson",
        position: "VP of Engineering",
        company: "DataFlow Inc",
        rating: 5,
        isActive: true,
        avatar: "/testimonials/avatar-2.jpg",
    },
    {
        id: "3",
        quote: "Outstanding cloud migration service. TakeWeb helped us move our entire infrastructure to the cloud with zero downtime. Highly recommended.",
        author: "Amit Patel",
        position: "Director of IT",
        company: "GlobalTech Solutions",
        rating: 5,
        isActive: true,
        avatar: "/testimonials/avatar-3.jpg",
    },
    {
        id: "4",
        quote: "Working with TakeWeb on our mobile app was a game-changer. They understood our vision and delivered a product that exceeded our expectations.",
        author: "Lisa Wang",
        position: "Product Manager",
        company: "InnoApps",
        rating: 4,
        isActive: true,
        avatar: "/testimonials/avatar-4.jpg",
    },
];

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const blankTestimonial: Testimonial = {
        id: Date.now().toString(),
        quote: "",
        author: "",
        position: "",
        company: "",
        rating: 5,
        isActive: true,
    };

    const handleSave = (item: Testimonial) => {
        if (isCreating) {
            setTestimonials([...testimonials, { ...item, id: Date.now().toString() }]);
        } else {
            setTestimonials(testimonials.map((t) => (t.id === item.id ? item : t)));
        }
        setEditingItem(null);
        setIsCreating(false);
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this testimonial?")) return;
        setTestimonials(testimonials.filter((t) => t.id !== id));
    };

    const toggleActive = (id: string) => {
        setTestimonials(testimonials.map((t) =>
            t.id === id ? { ...t, isActive: !t.isActive } : t
        ));
    };

    const activeCount = testimonials.filter((t) => t.isActive).length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Testimonials</h1>
                    <p>Manage client testimonials displayed on your website</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="badge badge-info">{activeCount} Active</span>
                    <button
                        onClick={() => { setEditingItem(blankTestimonial); setIsCreating(true); }}
                        className="btn-primary"
                    >
                        <Plus size={16} />
                        Add Testimonial
                    </button>
                </div>
            </div>

            {/* Preview note */}
            <div className="card-glass flex items-center gap-3 text-sm">
                <MessageSquare size={18} className="text-primary-400 flex-shrink-0" />
                <p className="text-neutral-300">
                    <span className="font-medium text-white">Tip:</span> Active testimonials are displayed in the rotating slider on your homepage. Drag to reorder their display priority.
                </p>
            </div>

            {/* Grid */}
            {testimonials.length === 0 ? (
                <div className="empty-state card">
                    <Quote size={40} className="empty-state-icon" />
                    <p className="text-neutral-400 mb-2">No testimonials yet</p>
                    <p className="text-sm text-neutral-600 mb-4">Add your first client testimonial</p>
                    <button onClick={() => { setEditingItem(blankTestimonial); setIsCreating(true); }} className="btn-primary">
                        <Plus size={16} /> Add Testimonial
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4 stagger-children">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className={`card relative group transition-opacity ${!testimonial.isActive ? "opacity-50" : ""}`}
                        >
                            {/* Quote */}
                            <div className="mb-4">
                                <Quote size={24} className="text-primary-500/30 mb-2" />
                                <p className="text-neutral-300 text-sm leading-relaxed line-clamp-3">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-0.5 mb-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-dark-600"}
                                    />
                                ))}
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                    {testimonial.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{testimonial.author}</p>
                                    <p className="text-xs text-neutral-500">
                                        {testimonial.position}, {testimonial.company}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                                <button
                                    onClick={() => toggleActive(testimonial.id)}
                                    className={`toggle ${testimonial.isActive ? "active" : ""}`}
                                />
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setEditingItem(testimonial); setIsCreating(false); }}
                                        className="btn-icon"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(testimonial.id)}
                                        className="btn-icon hover:text-error-400"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit/Create Modal */}
            {editingItem && (
                <div className="modal-backdrop" onClick={() => { setEditingItem(null); setIsCreating(false); }}>
                    <div className="modal max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">
                                {isCreating ? "Add Testimonial" : "Edit Testimonial"}
                            </h3>
                            <button onClick={() => { setEditingItem(null); setIsCreating(false); }} className="btn-icon">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Quote</label>
                                <textarea
                                    value={editingItem.quote}
                                    onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                                    rows={4}
                                    className="w-full"
                                    placeholder="What did the client say about your service?"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                                        <User size={12} className="inline mr-1" />Author Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingItem.author}
                                        onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                                        className="w-full"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">Position</label>
                                    <input
                                        type="text"
                                        value={editingItem.position}
                                        onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                                        className="w-full"
                                        placeholder="CTO"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">
                                    <Building size={12} className="inline mr-1" />Company
                                </label>
                                <input
                                    type="text"
                                    value={editingItem.company}
                                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                                    className="w-full"
                                    placeholder="Company Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Rating</label>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setEditingItem({ ...editingItem, rating: i + 1 })}
                                            className="p-1"
                                        >
                                            <Star
                                                size={20}
                                                className={i < editingItem.rating ? "text-amber-400 fill-amber-400" : "text-dark-600"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button onClick={() => { setEditingItem(null); setIsCreating(false); }} className="btn-secondary">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSave(editingItem)}
                                    className="btn-primary"
                                    disabled={!editingItem.quote || !editingItem.author}
                                >
                                    <Save size={14} />
                                    {isCreating ? "Add" : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
