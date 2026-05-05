"use client";

import Link from "next/link";
import { Shield, Building2, Network, Key, Gavel, Users, ArrowRight } from "lucide-react";

const sections = [
    {
        title: "Groups (Departments)",
        description: "Manage organizational departments and groups. Groups are the top-level hierarchy.",
        href: "/dashboard/twadmin/groups",
        icon: Building2,
        color: "from-blue-500 to-blue-600",
        stats: "Departments & divisions",
    },
    {
        title: "Teams",
        description: "Create and manage teams within groups. Assign managers, leads, and members.",
        href: "/dashboard/twadmin/teams",
        icon: Network,
        color: "from-emerald-500 to-emerald-600",
        stats: "Teams & assignments",
    },
    {
        title: "Roles & Permissions",
        description: "Define custom roles with fine-grained module-level permissions.",
        href: "/dashboard/twadmin/roles",
        icon: Key,
        color: "from-amber-500 to-amber-600",
        stats: "Access control matrix",
    },
    {
        title: "Rules Engine",
        description: "Create dynamic access rules per group, team, or individual with conditions.",
        href: "/dashboard/twadmin/rules",
        icon: Gavel,
        color: "from-purple-500 to-purple-600",
        stats: "Dynamic access policies",
    },
];

export default function TWadminPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="page-header">
                <h1 className="flex items-center gap-2"><Shield size={24} className="text-primary-400" /> TWadmin</h1>
                <p>Enterprise Role-Based Access Control & Organization Management</p>
            </div>

            {/* Hierarchy Visualization */}
            <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4">RBAC Hierarchy</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30">
                        <Shield size={16} className="text-red-400" />
                        <span className="text-red-300 font-medium">Root Admin</span>
                    </div>
                    <ArrowRight size={16} className="text-neutral-600" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                        <Building2 size={16} className="text-blue-400" />
                        <span className="text-blue-300 font-medium">Groups</span>
                    </div>
                    <ArrowRight size={16} className="text-neutral-600" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30">
                        <Network size={16} className="text-emerald-400" />
                        <span className="text-emerald-300 font-medium">Teams</span>
                    </div>
                    <ArrowRight size={16} className="text-neutral-600" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30">
                        <Key size={16} className="text-amber-400" />
                        <span className="text-amber-300 font-medium">Roles</span>
                    </div>
                    <ArrowRight size={16} className="text-neutral-600" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neutral-500/20 to-neutral-600/20 border border-neutral-500/30">
                        <Users size={16} className="text-neutral-400" />
                        <span className="text-neutral-300 font-medium">Employees</span>
                    </div>
                </div>
            </div>

            {/* Section Cards */}
            <div className="grid sm:grid-cols-2 gap-4 stagger-children">
                {sections.map((section) => (
                    <Link
                        key={section.href}
                        href={section.href}
                        className="card group hover:border-dark-600 transition-all hover:-translate-y-0.5"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0`}>
                                <section.icon size={22} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">{section.title}</h3>
                                <p className="text-sm text-neutral-400 mt-1">{section.description}</p>
                                <p className="text-xs text-neutral-600 mt-2">{section.stats}</p>
                            </div>
                            <ArrowRight size={16} className="text-neutral-600 group-hover:text-primary-400 transition-colors mt-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
