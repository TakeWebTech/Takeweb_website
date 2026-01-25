"use client";

import { useState, useEffect } from "react";
import { Upload, Search, Trash2, Image as ImageIcon, FileText, Film, Folder } from "lucide-react";

interface Media {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    fileSize: number;
    width: number | null;
    height: number | null;
    alt: string | null;
    folder: string | null;
    createdAt: string;
}

export default function MediaPage() {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [folders, setFolders] = useState<string[]>([]);

    useEffect(() => {
        fetchMedia();
        fetchFolders();
    }, [selectedFolder]);

    const fetchMedia = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const url = selectedFolder
                ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/media?folder=${selectedFolder}`
                : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/media`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setMedia(data);
            }
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFolders = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/media/folders`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) {
                const data = await res.json();
                setFolders(data);
            }
        } catch (error) {
            console.error("Failed to fetch folders:", error);
        }
    };

    const deleteMedia = async (id: string) => {
        if (!confirm("Are you sure you want to delete this file?")) return;

        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/media/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchMedia();
        } catch (error) {
            console.error("Failed to delete media:", error);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith("image/")) return <ImageIcon size={24} className="text-primary-400" />;
        if (mimeType.startsWith("video/")) return <Film size={24} className="text-accent-400" />;
        return <FileText size={24} className="text-neutral-400" />;
    };

    const filteredMedia = media.filter((item) =>
        item.originalName.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Media Library</h1>
                    <p className="text-neutral-400 mt-1">Manage your images and files</p>
                </div>
                <button className="btn-primary">
                    <Upload size={20} />
                    Upload Files
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10"
                    />
                </div>
                <select
                    value={selectedFolder || ""}
                    onChange={(e) => setSelectedFolder(e.target.value || null)}
                    className="w-full sm:w-48"
                >
                    <option value="">All Folders</option>
                    {folders.map((folder) => (
                        <option key={folder} value={folder}>{folder}</option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            {filteredMedia.length === 0 ? (
                <div className="card text-center py-12">
                    <ImageIcon size={48} className="mx-auto text-neutral-600 mb-4" />
                    <p className="text-neutral-400">No media files found. Upload your first file!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMedia.map((item) => (
                        <div key={item.id} className="group relative bg-dark-800 rounded-lg overflow-hidden border border-neutral-800">
                            <div className="aspect-square flex items-center justify-center bg-dark-700">
                                {item.mimeType.startsWith("image/") ? (
                                    <img
                                        src={item.url}
                                        alt={item.alt || item.originalName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    getFileIcon(item.mimeType)
                                )}
                            </div>
                            <div className="p-2">
                                <p className="text-sm text-white truncate">{item.originalName}</p>
                                <p className="text-xs text-neutral-500">{formatFileSize(item.fileSize)}</p>
                            </div>
                            <button
                                onClick={() => deleteMedia(item.id)}
                                className="absolute top-2 right-2 p-1.5 rounded bg-dark-900/80 text-neutral-400 hover:text-error-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
