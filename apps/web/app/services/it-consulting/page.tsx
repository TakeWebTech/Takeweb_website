import Link from "next/link";
import { Metadata } from "next";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Target, TrendingUp, Users, Lightbulb, BarChart3, Cog } from "lucide-react";

export const metadata: Metadata = {
    title: "IT Consulting & Strategy",
    description: "Strategic IT consulting to modernize operations, optimize technology investments, and accelerate digital transformation.",
};

const services = [
    { icon: Target, title: "Digital Strategy", desc: "Roadmaps for transformation" },
    { icon: TrendingUp, title: "Technology Roadmaps", desc: "Multi-year planning" },
    { icon: Users, title: "Change Management", desc: "Adoption & training" },
    { icon: Lightbulb, title: "Innovation Labs", desc: "R&D and prototyping" },
    { icon: BarChart3, title: "Process Optimization", desc: "Efficiency improvements" },
    { icon: Cog, title: "Vendor Selection", desc: "Technology evaluation" },
];

export default function ITConsultingPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            IT Consulting
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Strategic{" "}
                            <span className="gradient-text">Technology Guidance</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            Navigate your digital transformation with expert advice
                            and proven methodologies.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Book Consultation <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader overline="Services" title="Consulting" titleHighlight="Expertise" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, i) => (
                            <Card3D key={i} className="text-center">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                                    <service.icon size={28} />
                                </div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{service.title}</h3>
                                <p className="text-sm text-[var(--text-tertiary)]">{service.desc}</p>
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
                            <h2 className="text-white mb-4">Ready to Transform?</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Let&apos;s discuss your strategic technology needs.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Schedule Session <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
