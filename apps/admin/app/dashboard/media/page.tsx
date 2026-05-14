"use client";

import { useState, useEffect, useRef } from "react";
import {
    Image as ImageIcon, Upload, Trash2, Search, Copy,
    CheckCircle2, X, FileImage, Film, File,
} from "lucide-react";

interface MediaItem {
    id: string;
    filename: string;
    url: string;
    mimetype: string;
    size: number;
    createdAt: string;
}

function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getIcon(mime: string) {
    if (mime?.startsWith("image/")) return FileImage;
    if (mime?.startsWith("video/")) return Film;
    return File;
}

export default function MediaPage() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [uploading, setUploading] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchMedia(); }, []);

    const fetchMedia = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/media`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) setMedia(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const formData = new FormData();
            for (const file of e.target.files) formData.append("file", file);
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/media/upload`,
                { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData }
            );
            fetchMedia();
        } catch (e) { console.error(e); } finally { setUploading(false); }
    };

    const deleteMedia = async (id: string) => {
        if (!confirm("Delete this file?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/media/${id}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            fetchMedia();
        } catch (e) { console.error(e); }
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopied(url);
        setTimeout(() => setCopied(null), 2000);
    };

    const filtered = media.filter((m) =>
        m.filename.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="skeleton aspect-square rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Media Library</h1>
                    <p>Upload and manage your images, videos, and files</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="badge badge-neutral">{media.length} Files</span>
                    <input type="file" ref={fileRef} onChange={handleUpload} className="hidden" multiple accept="image/*,video/*,.pdf" />
                    <button onClick={() => fileRef.current?.click()} className="btn-primary" disabled={uploading}>
                        <Upload size={16} />
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input type="text" placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 text-sm" />
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state card">
                    <ImageIcon size={40} className="empty-state-icon" />
                    <p className="text-neutral-400 mb-2">No media files found</p>
                    <p className="text-sm text-neutral-600 mb-4">Upload your first file</p>
                    <button onClick={() => fileRef.current?.click()} className="btn-primary">
                        <Upload size={16} /> Upload File
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 stagger-children">
                    {filtered.map((item) => {
                        const Icon = getIcon(item.mimetype);
                        const isImage = item.mimetype?.startsWith("image/");

                        return (
                            <div key={item.id} className="card p-0 overflow-hidden group">
                                {/* Preview */}
                                <div className="aspect-square bg-dark-800 flex items-center justify-center relative">
                                    {isImage ? (
                                        <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                                    ) : (
                                        <Icon size={32} className="text-neutral-600" />
                                    )}
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => copyUrl(item.url)}
                                            className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                            title="Copy URL"
                                        >
                                            {copied === item.url ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                        </button>
                                        <button
                                            onClick={() => deleteMedia(item.id)}
                                            className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center text-error-400 hover:bg-error-500/20 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                {/* Info */}
                                <div className="px-3 py-2">
                                    <p className="text-xs font-medium text-neutral-300 truncate">{item.filename}</p>
                                    <p className="text-[0.65rem] text-neutral-600">{formatSize(item.size)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
