"use client";

import { useState, useMemo } from "react";
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

const openPositions = [
    {
        id: "senior-fullstack-1",
        title: "Senior Full-Stack Engineer",
        department: "Engineering",
        location: "Remote / Bangalore",
        type: "Full-time",
        salary: "₹25L - ₹40L",
        experience: "5+ years",
        description: "Build scalable enterprise applications using React, Node.js, and cloud technologies.",
        requirements: [
            "5+ years of experience with React, Node.js, or similar",
            "Strong understanding of microservices architecture",
            "Experience with cloud platforms (AWS/Azure/GCP)",
            "Excellent problem-solving skills",
        ],
        skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
    },
    {
        id: "devops-engineer-1",
        title: "DevOps Engineer",
        department: "Infrastructure",
        location: "Remote / Bangalore",
        type: "Full-time",
        salary: "₹20L - ₹35L",
        experience: "4+ years",
        description: "Design and manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure.",
        requirements: [
            "4+ years of DevOps/SRE experience",
            "Strong Kubernetes and Docker expertise",
            "Experience with Terraform and IaC",
            "Knowledge of monitoring and observability tools",
        ],
        skills: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD"],
    },
    {
        id: "ai-ml-engineer-1",
        title: "AI/ML Engineer",
        department: "Data Science",
        location: "Remote",
        type: "Full-time",
        salary: "₹22L - ₹38L",
        experience: "3+ years",
        description: "Develop machine learning models and AI solutions for enterprise clients.",
        requirements: [
            "3+ years of ML/AI experience",
            "Proficiency in Python and ML frameworks",
            "Experience with NLP or Computer Vision",
            "Strong mathematical foundations",
        ],
        skills: ["Python", "TensorFlow", "PyTorch", "NLP", "MLOps"],
    },
    {
        id: "product-designer-1",
        title: "Senior Product Designer",
        department: "Design",
        location: "Bangalore",
        type: "Full-time",
        salary: "₹18L - ₹30L",
        experience: "4+ years",
        description: "Create beautiful, intuitive interfaces for enterprise products.",
        requirements: [
            "4+ years of product design experience",
            "Strong portfolio of B2B/SaaS products",
            "Proficiency in Figma and design systems",
            "Experience with user research",
        ],
        skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
    },
    {
        id: "tech-pm-1",
        title: "Technical Project Manager",
        department: "Product",
        location: "Bangalore",
        type: "Full-time",
        salary: "₹20L - ₹32L",
        experience: "5+ years",
        description: "Lead cross-functional teams to deliver complex enterprise projects.",
        requirements: [
            "5+ years of project management experience",
            "Technical background in software development",
            "Experience with Agile/Scrum methodologies",
            "Excellent stakeholder management skills",
        ],
        skills: ["Agile", "Scrum", "JIRA", "Technical Planning", "Stakeholder Management"],
    },
    {
        id: "frontend-intern-1",
        title: "Frontend Development Intern",
        department: "Engineering",
        location: "Remote",
        type: "Internship",
        salary: "₹30K - ₹50K/month",
        experience: "0-1 years",
        description: "Learn and grow with our engineering team building modern web applications.",
        requirements: [
            "Currently pursuing or recently completed CS degree",
            "Basic knowledge of React or similar frameworks",
            "Eagerness to learn and grow",
            "Good communication skills",
        ],
        skills: ["React", "JavaScript", "HTML/CSS", "Git"],
    },
    {
        id: "backend-engineer-1",
        title: "Backend Engineer",
        department: "Engineering",
        location: "Remote / Mumbai",
        type: "Full-time",
        salary: "₹18L - ₹28L",
        experience: "3+ years",
        description: "Build robust backend services and APIs for enterprise applications.",
        requirements: [
            "3+ years of backend development experience",
            "Strong with Node.js, Java, or Go",
            "Database design and optimization skills",
            "API design best practices",
        ],
        skills: ["Node.js", "PostgreSQL", "Redis", "Docker", "REST APIs"],
    },
    {
        id: "sales-exec-1",
        title: "Enterprise Sales Executive",
        department: "Sales",
        location: "Bangalore / Delhi",
        type: "Full-time",
        salary: "₹15L - ₹25L + Commission",
        experience: "5+ years",
        description: "Drive enterprise sales and build relationships with key accounts.",
        requirements: [
            "5+ years of B2B technology sales",
            "Track record of closing enterprise deals",
            "Strong network in target industries",
            "Excellent presentation skills",
        ],
        skills: ["Enterprise Sales", "Solution Selling", "CRM", "Negotiation"],
    },
];

const culture = [
    { icon: Zap, title: "Move Fast", description: "We ship quickly and iterate often." },
    { icon: Users, title: "Collaborate Openly", description: "We work transparently and support each other." },
    { icon: Heart, title: "Care Deeply", description: "We care about our work and each other's wellbeing." },
];

export default function CareersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedJob, setSelectedJob] = useState<typeof openPositions[0] | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const filteredPositions = useMemo(() => {
        return openPositions.filter((job) => {
            const matchesSearch = searchQuery === "" ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesDepartment = selectedDepartment === "All" || job.department === selectedDepartment;
            const matchesLocation = selectedLocation === "All" || job.location.includes(selectedLocation);
            const matchesType = selectedType === "All" || job.type === selectedType;

            return matchesSearch && matchesDepartment && matchesLocation && matchesType;
        });
    }, [searchQuery, selectedDepartment, selectedLocation, selectedType]);

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
                            Showing {filteredPositions.length} of {openPositions.length} positions
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
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${position.type === 'Internship'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {position.type}
                                        </span>
                                    </div>

                                    <p className="text-sm text-[var(--text-tertiary)] mb-4 line-clamp-2">
                                        {position.description}
                                    </p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {position.skills.slice(0, 4).map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] rounded"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {position.skills.length > 4 && (
                                            <span className="px-2 py-1 text-xs text-[var(--text-muted)]">
                                                +{position.skills.length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Meta info */}
                                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--border-primary)] text-sm text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {position.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {position.experience}
                                        </span>
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
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${selectedJob.type === 'Internship'
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                        {selectedJob.type}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
                                    <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedJob.department}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {selectedJob.location}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {selectedJob.experience}</span>
                                </div>
                            </div>

                            {/* Salary */}
                            <div className="p-4 bg-amber-500/10 rounded-xl mb-6">
                                <div className="text-sm text-amber-500 font-medium">Compensation</div>
                                <div className="text-xl font-bold text-[var(--text-primary)]">{selectedJob.salary}</div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-3">About the Role</h3>
                                <p className="text-[var(--text-tertiary)]">{selectedJob.description}</p>
                            </div>

                            {/* Requirements */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-3">Requirements</h3>
                                <ul className="space-y-2">
                                    {selectedJob.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[var(--text-tertiary)]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Skills */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-3">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedJob.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-sm text-[var(--text-secondary)] rounded-lg"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

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
