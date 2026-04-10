"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import {
    ArrowRight, Search, MapPin, Clock, Briefcase, Users,
    Zap, Heart, GraduationCap, Coffee, Plane, DollarSign,
    Filter, X, ChevronDown, Upload, FileText
} from "lucide-react";

const benefits = [
    { icon: DollarSign, title: "Competitive Salary", description: "Industry-leading compensation packages" },
    { icon: Heart, title: "Health Insurance", description: "Comprehensive health coverage for you and family" },
    { icon: GraduationCap, title: "Learning Budget", description: "Annual budget for courses and certifications" },
    { icon: Coffee, title: "Flexible Work", description: "Remote-first with flexible hours" },
    { icon: Plane, title: "Paid Time Off", description: "Generous vacation and personal days" },
    { icon: Users, title: "Team Events", description: "Regular team building and offsite retreats" },
];

const departments = ["All", "Engineering", "Product", "Design", "Data Science", "Infrastructure", "Sales", "HR"];
const locations = ["All", "Remote", "Bangalore", "Mumbai", "Delhi", "Hybrid"];
const types = ["All", "Full-time", "Part-time", "Contract", "Internship"];

// Job type mapping
const typeLabels: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
};

interface Job {
    id: string;
    title: string;
    slug: string;
    department: string;
    location: string;
    type: string;
    minSalary?: number;
    maxSalary?: number;
    description: string;
    requirements?: string;
    benefits?: string[];
    deadline?: string;
    isRemote: boolean;
    isActive: boolean;
}

const culture = [
    { icon: Zap, title: "Move Fast", description: "We ship quickly and iterate often." },
    { icon: Users, title: "Collaborate Openly", description: "We work transparently and support each other." },
    { icon: Heart, title: "Care Deeply", description: "We care about our work and each other's wellbeing." },
];

export default function CareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Fetch jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/careers`);
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data.filter((job: Job) => job.isActive));
                } else {
                    throw new Error("API not available");
                }
            } catch (error) {
                // Use fallback data if backend is offline so the page still functions beautifully
                setJobs([
                    {
                        id: "1", title: "Senior Full Stack Engineer", slug: "senior-full-stack-engineer",
                        department: "Engineering", location: "Bangalore", type: "FULL_TIME",
                        minSalary: 35, maxSalary: 55, isRemote: true, isActive: true,
                        description: "We are looking for a Senior Full Stack Engineer to build our next-generation enterprise platforms using Next.js and Node.js.",
                        requirements: "5+ years of experience with React and Node.js\nStrong understanding of system design\nExperience with AWS/GCP"
                    },
                    {
                        id: "2", title: "Product Designer", slug: "product-designer",
                        department: "Design", location: "Remote", type: "FULL_TIME",
                        minSalary: 20, maxSalary: 35, isRemote: true, isActive: true,
                        description: "Join our design team to create beautiful, intuitive interfaces for enterprise applications.",
                        requirements: "3+ years of product design experience\nProficiency in Figma\nStrong portfolio showcasing SaaS products"
                    },
                    {
                        id: "3", title: "Cloud Solutions Architect", slug: "cloud-architect",
                        department: "Infrastructure", location: "Mumbai", type: "CONTRACT",
                        minSalary: 40, maxSalary: 60, isRemote: true, isActive: true,
                        description: "Help our clients migrate and scale their infrastructure on the cloud.",
                        requirements: "AWS/Azure Solutions Architect Certification\nExperience with Kubernetes and Terraform"
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredPositions = useMemo(() => {
        return jobs.filter((job) => {
            const matchesSearch = searchQuery === "" ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDepartment = selectedDepartment === "All" || job.department === selectedDepartment;
            const matchesLocation = selectedLocation === "All" || job.location?.includes(selectedLocation);
            const matchesType = selectedType === "All" || typeLabels[job.type] === selectedType;

            return matchesSearch && matchesDepartment && matchesLocation && matchesType;
        });
    }, [jobs, searchQuery, selectedDepartment, selectedLocation, selectedType]);

    const activeFiltersCount = [selectedDepartment, selectedLocation, selectedType].filter(f => f !== "All").length;

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />

                <div className="container-main relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            Careers at TakeWeb
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Build the Future{" "}
                            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">With Us</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            Join a team of passionate technologists working on challenging problems
                            for some of the world&apos;s leading enterprises.
                        </p>
                        <Link
                            href="#positions"
                            className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-[0_0_40px_-10px_oklch(75%_0.15_85_/_0.5)] hover:-translate-y-1 transition-all group"
                        >
                            View Open Positions
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Culture Section */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader
                        overline="Our Culture"
                        title="What Makes Us"
                        titleHighlight="Different"
                    />

                    <div className="grid md:grid-cols-3 gap-8">
                        {culture.map((item, index) => (
                            <Card3D key={index} className="text-center p-8">
                                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-[var(--text-tertiary)]">{item.description}</p>
                            </Card3D>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="section-padding">
                <div className="container-main">
                    <SectionHeader
                        overline="Benefits"
                        title="Why You'll Love"
                        titleHighlight="Working Here"
                    />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex gap-4 p-6 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl hover:border-[var(--border-secondary)] transition-colors">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                    <benefit.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--text-primary)] mb-1">{benefit.title}</h4>
                                    <p className="text-sm text-[var(--text-tertiary)]">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section id="positions" className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader
                        overline="Open Positions"
                        title="Join Our"
                        titleHighlight="Team"
                        description="Find the perfect role and start your journey with us."
                    />

                    {/* Search & Filters */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search jobs by title, skills, or keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                                />
                            </div>

                            {/* Filter Toggle (Mobile) */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-[var(--text-secondary)]"
                            >
                                <Filter size={18} />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>

                            {/* Desktop Filters */}
                            <div className="hidden lg:flex gap-3">
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-[var(--text-secondary)] focus:outline-none focus:border-amber-500"
                                >
                                    {departments.map(dep => (
                                        <option key={dep} value={dep}>{dep === "All" ? "All Departments" : dep}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-[var(--text-secondary)] focus:outline-none focus:border-amber-500"
                                >
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc === "All" ? "All Locations" : loc}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-[var(--text-secondary)] focus:outline-none focus:border-amber-500"
                                >
                                    {types.map(type => (
                                        <option key={type} value={type}>{type === "All" ? "All Types" : type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        {showFilters && (
                            <div className="lg:hidden mt-4 p-4 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl space-y-4">
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Department</label>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)]"
                                    >
                                        {departments.map(dep => (
                                            <option key={dep} value={dep}>{dep === "All" ? "All Departments" : dep}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Location</label>
                                    <select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)]"
                                    >
                                        {locations.map(loc => (
                                            <option key={loc} value={loc}>{loc === "All" ? "All Locations" : loc}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Job Type</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)]"
                                    >
                                        {types.map(type => (
                                            <option key={type} value={type}>{type === "All" ? "All Types" : type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Results count */}
                        <div className="mt-4 text-sm text-[var(--text-muted)]">
                            {loading ? 'Loading positions...' : `Showing ${filteredPositions.length} of ${jobs.length} positions`}
                        </div>
                    </div>

                    {/* Job Cards Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredPositions.map((position) => (
                            <div
                                key={position.id}
                                onClick={() => setSelectedJob(position)}
                                className="cursor-pointer"
                            >
                                <Card3D className="group h-full">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-amber-500 transition-colors mb-1">
                                                {position.title}
                                            </h3>
                                            <p className="text-sm text-[var(--text-tertiary)]">{position.department}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${position.type === 'INTERNSHIP'
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {typeLabels[position.type] || position.type}
                                        </span>
                                    </div>

                                    <p className="text-sm text-[var(--text-tertiary)] mb-4 line-clamp-2">
                                        {position.description}
                                    </p>



                                    {/* Meta info */}
                                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--border-primary)] text-sm text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {position.location}
                                        </span>
                                        {(position.minSalary || position.maxSalary) && (
                                            <span className="flex items-center gap-1">
                                                ₹{position.minSalary && position.maxSalary ? `${position.minSalary}L - ₹${position.maxSalary}L` : position.minSalary ? `${position.minSalary}L+` : `Up to ₹${position.maxSalary}L`}
                                            </span>
                                        )}
                                    </div>
                                </Card3D>
                            </div>
                        ))}
                    </div>

                    {filteredPositions.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                                <Search className="text-[var(--text-muted)]" size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No positions found</h3>
                            <p className="text-[var(--text-tertiary)]">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Job Detail Modal */}
            {selectedJob && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
                    onClick={() => setSelectedJob(null)}
                >
                    <div
                        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl shadow-2xl animate-slide-up my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedJob(null)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                        {selectedJob.title}
                                    </h2>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${selectedJob.type === 'INTERNSHIP'
                                        ? 'bg-emerald-500/10 text-emerald-500'
                                        : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                        {typeLabels[selectedJob.type] || selectedJob.type}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
                                    <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedJob.department}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {selectedJob.location}</span>
                                    {selectedJob.isRemote && (
                                        <span className="px-2 py-1 text-xs bg-emerald-500/10 text-emerald-500 rounded-full">Remote</span>
                                    )}
                                </div>
                            </div>

                            {/* Salary */}
                            {(selectedJob.minSalary || selectedJob.maxSalary) && (
                                <div className="p-4 bg-amber-500/10 rounded-xl mb-6">
                                    <div className="text-sm text-amber-500 font-medium">Compensation</div>
                                    <div className="text-xl font-bold text-[var(--text-primary)]">
                                        ₹{selectedJob.minSalary && selectedJob.maxSalary ? `${selectedJob.minSalary}L - ₹${selectedJob.maxSalary}L` : selectedJob.minSalary ? `${selectedJob.minSalary}L+` : `Up to ₹${selectedJob.maxSalary}L`}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-3">About the Role</h3>
                                <p className="text-[var(--text-tertiary)]">{selectedJob.description}</p>
                            </div>

                            {/* Requirements */}
                            {selectedJob.requirements && selectedJob.requirements.trim() && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-3">Requirements</h3>
                                    <ul className="space-y-2">
                                        {selectedJob.requirements.split('\n').filter(r => r.trim()).map((req, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[var(--text-tertiary)]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                                {req.trim()}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Benefits */}
                            {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-3">Benefits</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.benefits.map((benefit, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-sm text-[var(--text-secondary)] rounded-lg"
                                            >
                                                {benefit}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Apply Section */}
                            <div className="border-t border-[var(--border-primary)] pt-6">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-4">Apply for this Position</h3>

                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    <Link
                                        href={`/careers/apply?job=${selectedJob.id}`}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg transition-all"
                                    >
                                        <FileText size={18} />
                                        Apply Now
                                    </Link>
                                    <button className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-[var(--text-primary)] border border-[var(--border-secondary)] rounded-xl hover:border-amber-500 transition-all">
                                        <Upload size={18} />
                                        Upload CV to Match
                                    </button>
                                </div>

                                <p className="text-sm text-[var(--text-muted)]">
                                    Upload your CV and we&apos;ll check how well it matches this position. You can also apply directly with your profile.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 md:p-16 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Don&apos;t See Your Role?</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                We&apos;re always looking for talented people. Send us your resume and we&apos;ll be in touch.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                Get in Touch
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
