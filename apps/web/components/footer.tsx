import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, Youtube } from "lucide-react";
import type { GlobalContent } from "@/lib/strapi";

const socialIconMap = { LinkedIn: Linkedin, Twitter: Twitter, GitHub: Github, YouTube: Youtube };

export function Footer({ global }: { global: GlobalContent }) {
    const footerLinks = global.footerLinks || {};
    const socialLinks = global.socialLinks || [];
    const logo = typeof global.logo === "string" && global.logo ? global.logo : "/logo.png";

    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
            {/* Main Footer */}
            <div className="container-main py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="relative w-12 h-12 overflow-hidden rounded-xl">
                                <Image
                                    src={logo}
                                    alt={global.siteName}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                {global.siteName}
                            </span>
                        </Link>
                        <p className="text-[var(--text-tertiary)] mb-6 max-w-sm">
                            {global.tagline}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <a
                                href={`mailto:${global.email}`}
                                className="flex items-center gap-3 text-sm text-[var(--text-tertiary)] hover:text-primary-500 transition-colors"
                            >
                                <Mail size={16} />
                                {global.email}
                            </a>
                            <a
                                href={`tel:${global.phone?.replace(/\s/g, "")}`}
                                className="flex items-center gap-3 text-sm text-[var(--text-tertiary)] hover:text-primary-500 transition-colors"
                            >
                                <Phone size={16} />
                                {global.phone}
                            </a>
                            <div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
                                <MapPin size={16} />
                                {global.address}
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-4 text-sm">
                            Services
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.services?.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-4 text-sm">
                            Solutions
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.solutions?.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-4 text-sm">
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.company?.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-4 text-sm">
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.legal?.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--border-primary)]">
                <div className="container-main py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-[var(--text-muted)]">
                            © {new Date().getFullYear()} {global.copyrightText || `${global.companyName}. All rights reserved.`}
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => {
                                const Icon = socialIconMap[social.name as keyof typeof socialIconMap] || Linkedin;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-primary-500 hover:border-primary-500/50 transition-colors"
                                        aria-label={social.name}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
