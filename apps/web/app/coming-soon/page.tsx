"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Rocket } from "lucide-react";
import { FloatingElements } from "@/components/floating-elements";

export default function ComingSoon() {
    return (
        <section className="min-h-screen relative pt-32 pb-20 overflow-hidden bg-[var(--bg-primary)]">
            <FloatingElements />

            <div className="container-main relative z-10 text-center py-20">
                {/* 3D Model / Icon */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 bg-amber-500/20 blur-[100px] rounded-full" />
                    </div>
                    <div className="relative w-32 h-32 mx-auto rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-2xl flex items-center justify-center rotate-3 hover:rotate-6 transition-transform">
                        <Rocket className="text-amber-500" size={64} />
                    </div>
                </div>

                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm font-bold text-amber-500 mb-8 tracking-widest uppercase">
                    <Sparkles size={16} />
                    In Development
                </span>

                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Coming <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Soon</span>
                </h1>
                
                <p className="text-lg text-[var(--text-tertiary)] max-w-xl mx-auto mb-10 leading-relaxed">
                    We are currently building this section of the TakeWeb Platform to bring you the best-in-class enterprise experience. Stay tuned for updates!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-[0_0_30px_-8px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 transition-all"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 font-bold text-[var(--text-primary)] border-2 border-[var(--border-secondary)] rounded-xl hover:border-amber-500 hover:text-amber-500 bg-[var(--bg-secondary)] hover:-translate-y-0.5 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Contact Us Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
