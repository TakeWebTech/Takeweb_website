import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Home, Search } from "lucide-react";

export const metadata: Metadata = {
    title: "Page Not Found | TakeWeb Enterprise",
    description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
                    style={{
                        background: 'radial-gradient(circle, oklch(55% 0.18 250 / 0.15), transparent)',
                        top: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                />
            </div>

            <div className="container-main relative z-10 text-center py-20">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none gradient-text opacity-20">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                                <Search className="text-white" size={40} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                    Page Not Found
                </h2>
                <p className="text-lg text-[var(--text-tertiary)] mb-8 max-w-md mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-[0_0_30px_-8px_oklch(75%_0.15_85_/_0.5)] hover:-translate-y-0.5 transition-all"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-[var(--text-primary)] border-2 border-[var(--border-secondary)] rounded-xl hover:border-amber-500 hover:text-amber-500 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Contact Support
                    </Link>
                </div>

                {/* Suggested Links */}
                <div className="mt-16 pt-8 border-t border-[var(--border-primary)]">
                    <p className="text-sm text-[var(--text-muted)] mb-4">
                        Popular destinations
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/services" className="text-sm text-[var(--text-secondary)] hover:text-amber-500 transition-colors">
                            Services
                        </Link>
                        <span className="text-[var(--border-secondary)]">•</span>
                        <Link href="/products/ai-suite" className="text-sm text-[var(--text-secondary)] hover:text-amber-500 transition-colors">
                            AI Suite
                        </Link>
                        <span className="text-[var(--border-secondary)]">•</span>
                        <Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-amber-500 transition-colors">
                            About Us
                        </Link>
                        <span className="text-[var(--border-secondary)]">•</span>
                        <Link href="/partnerships" className="text-sm text-[var(--text-secondary)] hover:text-amber-500 transition-colors">
                            Partnerships
                        </Link>
                        <span className="text-[var(--border-secondary)]">•</span>
                        <Link href="/blog" className="text-sm text-[var(--text-secondary)] hover:text-amber-500 transition-colors">
                            Blog
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
