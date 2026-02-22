"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    FileText,
    Users,
    Briefcase,
    FolderOpen,
    Settings,
    BarChart2,
    Mail,
    Image,
    Award,
    Globe,
    Activity,
    Pencil,
    PlusCircle,
    LayoutDashboard,
    Command,
} from "lucide-react";

interface CommandItem {
    id: string;
    label: string;
    category: string;
    icon: React.ElementType;
    url: string;
    keywords?: string[];
}

const commands: CommandItem[] = [
    // Navigation
    { id: "dashboard", label: "Dashboard", category: "Navigation", icon: LayoutDashboard, url: "/dashboard" },
    { id: "posts", label: "Blog Posts", category: "Navigation", icon: FileText, url: "/dashboard/posts" },
    { id: "services", label: "Services", category: "Navigation", icon: Briefcase, url: "/dashboard/services" },
    { id: "projects", label: "Projects", category: "Navigation", icon: FolderOpen, url: "/dashboard/projects" },
    { id: "team", label: "Team Members", category: "Navigation", icon: Users, url: "/dashboard/team" },
    { id: "careers", label: "Careers", category: "Navigation", icon: Award, url: "/dashboard/careers" },
    { id: "contact", label: "Contact Messages", category: "Navigation", icon: Mail, url: "/dashboard/contact" },
    { id: "media", label: "Media Library", category: "Navigation", icon: Image, url: "/dashboard/media" },
    { id: "pages", label: "Website Pages", category: "Navigation", icon: Globe, url: "/dashboard/pages" },
    { id: "testimonials", label: "Testimonials", category: "Navigation", icon: Award, url: "/dashboard/testimonials" },
    { id: "activity", label: "Activity Log", category: "Navigation", icon: Activity, url: "/dashboard/activity" },
    { id: "users", label: "User Management", category: "Navigation", icon: Users, url: "/dashboard/users" },
    { id: "settings", label: "Settings", category: "Navigation", icon: Settings, url: "/dashboard/settings" },
    // Quick Actions
    { id: "new-post", label: "New Blog Post", category: "Quick Actions", icon: PlusCircle, url: "/dashboard/posts/new", keywords: ["create", "write", "blog"] },
    { id: "analytics", label: "View Analytics", category: "Quick Actions", icon: BarChart2, url: "/dashboard", keywords: ["stats", "traffic"] },
];

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Ctrl+K listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus when opened
    useEffect(() => {
        if (open) {
            setQuery("");
            setSelectedIndex(0);
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    const filtered = commands.filter((cmd) => {
        const q = query.toLowerCase();
        return (
            cmd.label.toLowerCase().includes(q) ||
            cmd.category.toLowerCase().includes(q) ||
            (cmd.keywords || []).some((kw) => kw.includes(q))
        );
    });

    // Group by category
    const grouped: Record<string, CommandItem[]> = {};
    filtered.forEach((cmd) => {
        if (!grouped[cmd.category]) grouped[cmd.category] = [];
        grouped[cmd.category]!.push(cmd);
    });

    const flatFiltered = filtered; // for index navigation

    const navigate = useCallback(
        (cmd: CommandItem) => {
            setOpen(false);
            router.push(cmd.url);
        },
        [router]
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, flatFiltered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && flatFiltered[selectedIndex]) {
            navigate(flatFiltered[selectedIndex]);
        }
    };

    // Scroll selected item into view
    useEffect(() => {
        const selected = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
        selected?.scrollIntoView({ block: "nearest" });
    }, [selectedIndex]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Palette */}
            <div
                className="relative w-full max-w-xl rounded-xl border border-dark-700 bg-dark-900 shadow-2xl overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-700">
                    <Search size={18} className="text-neutral-500 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                    />
                    <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] text-neutral-500 bg-dark-800 border border-dark-700 font-mono">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div ref={listRef} className="max-h-[320px] overflow-y-auto p-2">
                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category} className="mb-2 last:mb-0">
                            <p className="text-[0.65rem] font-semibold text-neutral-500 uppercase tracking-wider px-3 py-1.5">
                                {category}
                            </p>
                            {items.map((cmd) => {
                                const index = flatFiltered.indexOf(cmd);
                                const isSelected = index === selectedIndex;
                                return (
                                    <button
                                        key={cmd.id}
                                        data-index={index}
                                        onClick={() => navigate(cmd)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isSelected
                                            ? "bg-primary-500/10 text-white"
                                            : "text-neutral-300 hover:bg-dark-800"
                                            }`}
                                    >
                                        <cmd.icon
                                            size={16}
                                            className={isSelected ? "text-primary-400" : "text-neutral-500"}
                                        />
                                        <span className="flex-1 text-left">{cmd.label}</span>
                                        {isSelected && (
                                            <span className="text-[0.6rem] text-neutral-500">
                                                ↵ Enter
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="py-8 text-center">
                            <Search size={24} className="mx-auto mb-2 text-neutral-600" />
                            <p className="text-sm text-neutral-500">No results found</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-4 py-2.5 border-t border-dark-700 text-[0.65rem] text-neutral-600">
                    <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-dark-800 border border-dark-700">↑↓</kbd> Navigate</span>
                    <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-dark-800 border border-dark-700">↵</kbd> Open</span>
                    <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-dark-800 border border-dark-700">Esc</kbd> Close</span>
                </div>
            </div>
        </div>
    );
}
