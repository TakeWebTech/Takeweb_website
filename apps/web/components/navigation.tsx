"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { ThemeToggle } from "./theme-provider";

// Mega Menu Structure
const megaMenuData = {
    products: {
        title: "Products",
        sections: [
            {
                title: "Platforms",
                items: [
                    { name: "TakeWeb Cloud Platform", desc: "Enterprise-grade cloud management & automation", href: "/products/cloud-platform" },
                    { name: "TakeWeb AI Suite", desc: "AI, analytics & intelligent automation", href: "/products/ai-suite" },
                    { name: "TakeWeb Secure", desc: "Security, compliance & threat protection", href: "/products/secure" },
                ],
            },
            {
                title: "Developer Tools",
                items: [
                    { name: "TakeWeb APIs", desc: "RESTful & GraphQL APIs", href: "/products/apis" },
                    { name: "DevOps Toolkit", desc: "CI/CD & automation tools", href: "/products/devops-toolkit" },
                    { name: "Monitoring & Observability", desc: "Real-time insights", href: "/products/monitoring" },
                ],
            },
        ],
        featured: { name: "TakeWeb AI Suite", desc: "Transform your enterprise with AI", href: "/products/ai-suite" },
    },
    solutions: {
        title: "Solutions",
        sections: [
            {
                title: "By Business",
                items: [
                    { name: "Startups", href: "/solutions/startups" },
                    { name: "Growing Companies", href: "/solutions/growing-companies" },
                    { name: "Enterprises", href: "/solutions/enterprise" },
                ],
            },
            {
                title: "By Need",
                items: [
                    { name: "Digital Transformation", href: "/solutions/digital-transformation" },
                    { name: "Cloud Migration", href: "/solutions/cloud-migration" },
                    { name: "AI Adoption", href: "/solutions/ai-adoption" },
                    { name: "Security & Compliance", href: "/solutions/security-compliance" },
                ],
            },
        ],
        featured: { name: "Enterprise Transformation", desc: "End-to-end digital transformation", href: "/solutions/enterprise" },
    },
    services: {
        title: "Services",
        sections: [
            {
                title: "Engineering",
                items: [
                    { name: "Custom Software Development", href: "/services/enterprise-software" },
                    { name: "Web & Mobile Applications", href: "/services/web-mobile" },
                ],
            },
            {
                title: "Cloud & DevOps",
                items: [
                    { name: "Cloud Architecture", href: "/services/cloud-devops" },
                    { name: "DevOps & Automation", href: "/services/cloud-devops" },
                ],
            },
            {
                title: "Data & AI",
                items: [
                    { name: "AI / ML Development", href: "/services/ai-data" },
                    { name: "Data Engineering", href: "/services/ai-data" },
                ],
            },
            {
                title: "Security",
                items: [
                    { name: "Cybersecurity", href: "/services/cybersecurity" },
                    { name: "Compliance & Audits", href: "/services/cybersecurity" },
                ],
            },
            {
                title: "Consulting",
                items: [
                    { name: "IT Consulting", href: "/services/it-consulting" },
                    { name: "Technology Strategy", href: "/services/it-consulting" },
                ],
            },
        ],
    },
    industries: {
        title: "Industries",
        items: [
            { name: "SaaS & Technology", href: "/industries/saas" },
            { name: "FinTech & Banking", href: "/industries/fintech" },
            { name: "Healthcare", href: "/industries/healthcare" },
            { name: "Education", href: "/industries/education" },
            { name: "E-commerce", href: "/industries/ecommerce" },
            { name: "Enterprise & Corporates", href: "/industries/enterprise" },
        ],
    },
    resources: {
        title: "Resources",
        sections: [
            {
                title: "Insights",
                items: [
                    { name: "Blog", href: "/blog" },
                    { name: "Articles", href: "/blog" },
                ],
            },
            {
                title: "Learn",
                items: [
                    { name: "Case Studies", href: "/projects" },
                    { name: "Whitepapers", href: "/resources/whitepapers" },
                    { name: "Service Status", href: "/status" },
                    { name: "News & Updates", href: "/blog" },
                ],
            },
        ],
        featured: { name: "Latest Insights", desc: "The Future of Enterprise AI", href: "/blog" },
    },
    company: {
        title: "Company",
        items: [
            { name: "About TakeWeb", href: "/about" },
            { name: "Vision & Values", href: "/about#values" },
            { name: "Leadership", href: "/about#leadership" },
            { name: "Security & Compliance", href: "/security" },
            { name: "Partnerships", href: "/partnerships" },
        ],
    },
};

export function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMenuEnter = (menu: string) => {
        setActiveMenu(menu);
    };

    const handleMenuLeave = () => {
        setActiveMenu(null);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "py-2 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)] shadow-lg"
                : "py-4 bg-transparent"
                }`}
        >
            <nav className="container-main">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-xl">
                            <Image
                                src="/logo.png"
                                alt="TakeWeb"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                            TakeWeb
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1" onMouseLeave={handleMenuLeave}>
                        {/* Products */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleMenuEnter("products")}
                        >
                            <button className="flex items-center gap-1 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium text-sm">
                                Products
                                <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === "products" ? "rotate-180" : ""}`} />
                            </button>

                            {activeMenu === "products" && (
                                <MegaMenu data={megaMenuData.products} onClose={() => setActiveMenu(null)} />
                            )}
                        </div>

                        {/* Solutions */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleMenuEnter("solutions")}
                        >
                            <button className="flex items-center gap-1 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium text-sm">
                                Solutions
                                <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === "solutions" ? "rotate-180" : ""}`} />
                            </button>

                            {activeMenu === "solutions" && (
                                <MegaMenu data={megaMenuData.solutions} onClose={() => setActiveMenu(null)} />
                            )}
                        </div>

                        {/* Services */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleMenuEnter("services")}
                        >
                            <button className="flex items-center gap-1 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium text-sm">
                                Services
                                <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === "services" ? "rotate-180" : ""}`} />
                            </button>

                            {activeMenu === "services" && (
                                <MegaMenuServices data={megaMenuData.services} onClose={() => setActiveMenu(null)} />
                            )}
                        </div>

                        {/* Industries */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleMenuEnter("industries")}
                        >
                            <button className="flex items-center gap-1 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium text-sm">
                                Industries
                                <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === "industries" ? "rotate-180" : ""}`} />
                            </button>

                            {activeMenu === "industries" && (
                                <SimpleDropdown items={megaMenuData.industries.items} onClose={() => setActiveMenu(null)} />
                            )}
                        </div>

                        {/* Resources */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleMenuEnter("resources")}
                        >
                            <button className="flex items-center gap-1 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium text-sm">
                                Resources
                                <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === "resources" ? "rotate-180" : ""}`} />
                            </button>

                            {activeMenu === "resources" && (
                                <MegaMenu data={megaMenuData.resources} onClose={() => setActiveMenu(null)} />
                            )}
                        </div>

                        {/* Company */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleMenuEnter("company")}
                        >
                            <button className="flex items-center gap-1 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium text-sm">
                                Company
                                <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === "company" ? "rotate-180" : ""}`} />
                            </button>

                            {activeMenu === "company" && (
                                <SimpleDropdown items={megaMenuData.company.items} onClose={() => setActiveMenu(null)} />
                            )}
                        </div>

                        {/* Contact */}
                        <Link
                            href="/contact"
                            className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium text-sm"
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        <Link
                            href="/contact"
                            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-[0_0_30px_-8px_oklch(75%_0.15_85_/_0.5)] hover:-translate-y-0.5 transition-all"
                        >
                            Get Consultation
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-[var(--border-primary)] animate-slide-up">
                        <div className="flex flex-col gap-1 pt-4">
                            {/* Mobile menu items with accordions */}
                            {Object.entries(megaMenuData).map(([key, data]) => (
                                <div key={key}>
                                    <button
                                        onClick={() => setMobileSubmenu(mobileSubmenu === key ? null : key)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors font-medium"
                                    >
                                        {data.title}
                                        <ChevronRight size={16} className={`transition-transform ${mobileSubmenu === key ? "rotate-90" : ""}`} />
                                    </button>

                                    {mobileSubmenu === key && (
                                        <div className="ml-4 border-l border-[var(--border-primary)] pl-4 py-2">
                                            {"items" in data && data.items?.map((item: { name: string; href: string }) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block px-4 py-2.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                            {"sections" in data && data.sections?.map((section: { title: string; items: { name: string; href: string }[] }) => (
                                                <div key={section.title} className="mb-2">
                                                    <div className="px-4 py-1 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                                                        {section.title}
                                                    </div>
                                                    {section.items.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block px-4 py-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Link
                                href="/status"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors font-medium"
                            >
                                Service Status
                            </Link>

                            <Link
                                href="/contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="mx-4 mt-4 px-5 py-3 text-center font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl"
                            >
                                Get Consultation
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

// Mega Menu Component
function MegaMenu({ data, onClose }: {
    data: {
        title: string;
        sections?: { title: string; items: { name: string; href: string; desc?: string }[] }[];
        featured?: { name: string; desc: string; href: string };
    };
    onClose: () => void
}) {
    return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[700px] animate-fade-in">
            <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-3 gap-0">
                    {/* Sections */}
                    <div className="col-span-2 p-6 grid grid-cols-2 gap-6">
                        {data.sections?.map((section) => (
                            <div key={section.title}>
                                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                    {section.title}
                                </div>
                                <div className="space-y-1">
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={onClose}
                                            className="block p-2 -mx-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors group"
                                        >
                                            <div className="font-medium text-[var(--text-primary)] text-sm group-hover:text-amber-500 transition-colors">
                                                {item.name}
                                            </div>
                                            {"desc" in item && item.desc && (
                                                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                                                    {item.desc}
                                                </div>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Featured */}
                    {data.featured && (
                        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-6 border-l border-[var(--border-primary)]">
                            <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-3">
                                Featured
                            </div>
                            <Link
                                href={data.featured.href}
                                onClick={onClose}
                                className="block group"
                            >
                                <div className="font-semibold text-[var(--text-primary)] group-hover:text-amber-500 transition-colors">
                                    {data.featured.name}
                                </div>
                                <div className="text-sm text-[var(--text-tertiary)] mt-1">
                                    {data.featured.desc}
                                </div>
                                <div className="flex items-center gap-1 text-sm font-medium text-amber-500 mt-4 group-hover:gap-2 transition-all">
                                    Explore <ArrowRight size={14} />
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Services Mega Menu (5 columns)
function MegaMenuServices({ data, onClose }: { data: typeof megaMenuData.services; onClose: () => void }) {
    return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[900px] animate-fade-in">
            <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-primary)] rounded-2xl shadow-2xl p-6">
                <div className="grid grid-cols-5 gap-6">
                    {data.sections?.map((section) => (
                        <div key={section.title}>
                            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                {section.title}
                            </div>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={onClose}
                                        className="block py-1.5 text-sm text-[var(--text-secondary)] hover:text-amber-500 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Simple Dropdown
function SimpleDropdown({ items, onClose }: { items: { name: string; href: string }[]; onClose: () => void }) {
    return (
        <div className="absolute top-full left-0 pt-4 w-[220px] animate-fade-in">
            <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-primary)] rounded-xl shadow-2xl p-2">
                {items.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={onClose}
                        className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
