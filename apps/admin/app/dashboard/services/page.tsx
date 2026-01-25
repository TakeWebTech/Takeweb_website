"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Service {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/services/admin/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/services/admin/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ isActive: !currentStatus }),
                }
            );
            fetchServices();
        } catch (error) {
            console.error("Failed to toggle status:", error);
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/services/admin/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchServices();
        } catch (error) {
            console.error("Failed to delete service:", error);
        }
    };

    const filteredServices = services.filter((service) =>
        service.title.toLowerCase().includes(search.toLowerCase())
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
                    <h1 className="text-2xl font-bold text-white">Services</h1>
                    <p className="text-neutral-400 mt-1">Manage your service offerings</p>
                </div>
                <Link href="/dashboard/services/new" className="btn-primary">
                    <Plus size={20} />
                    Add Service
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10"
                />
            </div>

            {/* Table */}
            {filteredServices.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-neutral-400">No services found. Add your first service!</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Order</th>
                                <th className="w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service) => (
                                <tr key={service.id}>
                                    <td>
                                        <div className="font-medium text-white">{service.title}</div>
                                        <div className="text-sm text-neutral-500">/{service.slug}</div>
                                    </td>
                                    <td className="max-w-xs truncate">{service.shortDescription}</td>
                                    <td>
                                        <button
                                            onClick={() => toggleActive(service.id, service.isActive)}
                                            className={`flex items-center gap-1 ${service.isActive ? "text-success-500" : "text-neutral-500"
                                                }`}
                                        >
                                            {service.isActive ? (
                                                <ToggleRight size={20} />
                                            ) : (
                                                <ToggleLeft size={20} />
                                            )}
                                            {service.isActive ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td>{service.sortOrder}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/dashboard/services/${service.id}`}
                                                className="p-1.5 rounded hover:bg-dark-700 text-neutral-400 hover:text-white"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => deleteService(service.id)}
                                                className="p-1.5 rounded hover:bg-dark-700 text-neutral-400 hover:text-error-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
