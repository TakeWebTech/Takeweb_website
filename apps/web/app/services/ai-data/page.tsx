import Link from "next/link";
import { Metadata } from "next";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Brain, BarChart3, Eye, MessageSquare, Database, Cpu } from "lucide-react";

export const metadata: Metadata = {
    title: "AI & Data Engineering",
    description: "Unlock the power of your data with AI/ML solutions, data pipelines, and advanced analytics platforms.",
};

const capabilities = [
    { icon: Brain, title: "Machine Learning", desc: "Predictive models & deep learning" },
    { icon: Eye, title: "Computer Vision", desc: "Image & video analysis at scale" },
    { icon: MessageSquare, title: "NLP & LLMs", desc: "Chatbots, summarization, RAG" },
    { icon: Database, title: "Data Engineering", desc: "ETL pipelines & data lakes" },
    { icon: BarChart3, title: "Analytics Platforms", desc: "Real-time dashboards & BI" },
    { icon: Cpu, title: "MLOps", desc: "Model deployment & monitoring" },
];

export default function AIDataPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            AI & Data Engineering
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Transform Data into{" "}
                            <span className="gradient-text">Intelligence</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            We build AI-powered solutions and data platforms that drive
                            informed decision-making and unlock new possibilities.
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
                    <SectionHeader overline="Capabilities" title="AI &" titleHighlight="Data Solutions" />
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
                            <h2 className="text-white mb-4">Ready to Harness AI?</h2>
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
