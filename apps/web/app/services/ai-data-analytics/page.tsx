import Link from "next/link";
import { Metadata } from "next";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Brain, BarChart3, Eye, TrendingUp, Database, Cpu } from "lucide-react";

export const metadata: Metadata = {
    title: "AI & Data Analytics",
    description: "AI-powered analytics solutions including machine learning, predictive analytics, data visualization, business intelligence, and intelligent automation.",
};

const capabilities = [
    { icon: Brain, title: "Machine Learning", desc: "Custom ML models for prediction & classification" },
    { icon: TrendingUp, title: "Predictive Analytics", desc: "Forecast trends & anticipate business outcomes" },
    { icon: Eye, title: "Computer Vision", desc: "Image recognition, OCR & visual inspection" },
    { icon: BarChart3, title: "Data Visualization", desc: "Interactive dashboards & real-time reporting" },
    { icon: Database, title: "Data Engineering", desc: "ETL pipelines, data lakes & warehousing" },
    { icon: Cpu, title: "Intelligent Automation", desc: "RPA, NLP & AI-driven workflow automation" },
];

export default function AIDataAnalyticsPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            AI & Data Analytics
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Turn Data into{" "}
                            <span className="gradient-text">Actionable Intelligence</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            We build AI and analytics solutions that transform raw data into
                            strategic insights, driving smarter decisions across your organization.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Explore AI Solutions <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Capabilities */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader overline="Capabilities" title="AI &" titleHighlight="Data Analytics" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {capabilities.map((cap, i) => (
                            <Card3D key={i} className="text-center">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                                    <cap.icon size={28} />
                                </div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{cap.title}</h3>
                                <p className="text-sm text-[var(--text-tertiary)]">{cap.desc}</p>
                            </Card3D>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 md:p-16 text-center overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Ready to Harness AI & Data?</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Let&apos;s explore how AI can transform your business operations.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Start AI Journey <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
