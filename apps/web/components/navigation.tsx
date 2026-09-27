"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-provider";
import type { GlobalContent, GlobalNavigationLink, GlobalNavigationMenu } from "@/lib/strapi";

export function Navigation({ global }: { global: GlobalContent }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menus = (global.navigationMenus || [])
        .filter((menu) => menu.isActive !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const logo = typeof global.logo === "string" && global.logo ? global.logo : "/logo.png";
    const ctaLabel = global.primaryCtaLabel || "Get Consultation";
    const ctaHref = global.primaryCtaHref || "/contact";

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-2 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)] shadow-lg" : "py-4 bg-transparent"}`}>
            <nav className="container-main">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-xl">
                            <Image src={logo} alt={global.siteName} fill className="object-contain" priority />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">{global.siteName}</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1" onMouseLeave={() => setActiveMenu(null)}>
                        {menus.map((menu) => {
                            if (menu.menuType === "direct-link") {
                                return menu.href ? <Link key={menu.key} href={menu.href} target={menu.openNewTab ? "_blank" : undefined} rel={menu.openNewTab ? "noopener noreferrer" : undefined} className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium text-sm">{menu.label}</Link> : null;
                            }

                            return (
                                <div key={menu.key} className="relative" onMouseEnter={() => setActiveMenu(menu.key)}>
                                    <button className="flex items-center gap-1 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium text-sm">
                                        {menu.label}
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === menu.key ? "rotate-180" : ""}`} />
                                    </button>
                                    {activeMenu === menu.key && menu.menuType === "simple-dropdown" && <SimpleDropdown links={menu.directLinks || []} onClose={() => setActiveMenu(null)} />}
                                    {activeMenu === menu.key && menu.menuType === "mega-menu" && <MegaMenu menu={menu} onClose={() => setActiveMenu(null)} />}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link href="/contact" className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-[0_0_30px_-8px_oklch(75%_0.15_85_/_0.5)] hover:-translate-y-0.5 transition-all">
                            {ctaLabel}
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors" aria-label="Toggle menu">
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-[var(--border-primary)] animate-slide-up">
                        <div className="flex flex-col gap-1 pt-4">
                            {menus.map((menu) => {
                                if (menu.menuType === "direct-link") {
                                    return menu.href ? <NavLink key={menu.key} link={{ name: menu.label, href: menu.href, openNewTab: menu.openNewTab }} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl" /> : null;
                                }
                                const expanded = mobileSubmenu === menu.key;
                                return (
                                    <div key={menu.key}>
                                        <button onClick={() => setMobileSubmenu(expanded ? null : menu.key)} className="w-full flex items-center justify-between px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors font-medium">
                                            {menu.label}
                                            <ChevronRight size={16} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
                                        </button>
                                        {expanded && <MobileMenuContent menu={menu} onClose={() => setIsMobileMenuOpen(false)} />}
                                    </div>
                                );
                            })}
                            <Link href={ctaHref} onClick={() => setIsMobileMenuOpen(false)} className="mx-4 mt-4 px-5 py-3 text-center font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl">{ctaLabel}</Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

function MegaMenu({ menu, onClose }: { menu: GlobalNavigationMenu; onClose: () => void }) {
    const columns = (menu.columns || []).filter((column) => column.isActive !== false);
    const featured = columns.flatMap((column) => column.links || []).find((link) => link.isActive !== false && link.isFeatured);
    const showFeatured = menu.megaMenuLayout === "featured-panel" && featured;
    const columnCount = Math.min(5, Math.max(1, menu.desktopColumns || columns.length || 1));

    return (
        <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 animate-fade-in ${showFeatured ? "w-[700px]" : "w-[900px]"}`}>
            <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden">
                <div className={showFeatured ? "grid grid-cols-[minmax(0,1fr)_230px]" : "block"}>
                    <div className="grid gap-6 p-6" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
                        {columns.map((column) => (
                            <div key={column.title}>
                                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">{column.title}</div>
                                <div className="space-y-1">
                                    {(column.links || []).filter((link) => link.isActive !== false).map((link) => <NavLink key={`${link.name}-${link.href}`} link={link} onClick={onClose} showDescription={menu.megaMenuLayout === "featured-panel"} className={menu.megaMenuLayout === "featured-panel" ? "block p-2 -mx-2 rounded-lg" : "block py-1.5"} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                    {showFeatured && (
                        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-6 border-l border-[var(--border-primary)]">
                            <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-3">{menu.featuredLabel || "Featured"}</div>
                            <Link href={featured.href} target={featured.openNewTab ? "_blank" : undefined} rel={featured.openNewTab ? "noopener noreferrer" : undefined} onClick={onClose} className="block group">
                                <div className="font-semibold text-[var(--text-primary)] group-hover:text-amber-500 transition-colors">{featured.name}</div>
                                {featured.description && <div className="text-sm text-[var(--text-tertiary)] mt-1">{featured.description}</div>}
                                <div className="flex items-center gap-1 text-sm font-medium text-amber-500 mt-4 group-hover:gap-2 transition-all">{menu.featuredButtonLabel || "Explore"} <ArrowRight size={14} /></div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SimpleDropdown({ links, onClose }: { links: GlobalNavigationLink[]; onClose: () => void }) {
    return <div className="absolute top-full left-0 pt-4 w-[220px] animate-fade-in"><div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-primary)] rounded-xl shadow-2xl p-2">{links.filter((link) => link.isActive !== false).map((link) => <NavLink key={`${link.name}-${link.href}`} link={link} onClick={onClose} className="block px-4 py-2.5 rounded-lg" />)}</div></div>;
}

function MobileMenuContent({ menu, onClose }: { menu: GlobalNavigationMenu; onClose: () => void }) {
    return (
        <div className="ml-4 border-l border-[var(--border-primary)] pl-4 py-2">
            {(menu.directLinks || []).filter((link) => link.isActive !== false).map((link) => <NavLink key={`${link.name}-${link.href}`} link={link} onClick={onClose} className="block px-4 py-2.5" />)}
            {(menu.columns || []).filter((column) => column.isActive !== false).map((column) => <div key={column.title} className="mb-2"><div className="px-4 py-1 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">{column.title}</div>{(column.links || []).filter((link) => link.isActive !== false).map((link) => <NavLink key={`${link.name}-${link.href}`} link={link} onClick={onClose} className="block px-4 py-2" />)}</div>)}
        </div>
    );
}

function NavLink({ link, onClick, className = "", showDescription = false }: { link: GlobalNavigationLink; onClick?: () => void; className?: string; showDescription?: boolean }) {
    return (
        <Link href={link.href} target={link.openNewTab ? "_blank" : undefined} rel={link.openNewTab ? "noopener noreferrer" : undefined} onClick={onClick} className={`${className} text-sm text-[var(--text-secondary)] hover:text-amber-500 hover:bg-[var(--bg-tertiary)] transition-colors group`}>
            <span className="font-medium">{link.name}</span>
            {showDescription && link.description && <span className="block text-xs font-normal text-[var(--text-muted)] mt-0.5">{link.description}</span>}
        </Link>
    );
}
