import Link from "next/link";
import { Metadata } from "next";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Landmark, CreditCard, ShieldCheck, TrendingUp, Banknote, Lock } from "lucide-react";

export const metadata: Metadata = {
    title: "FinTech Solutions",
    description: "Enterprise-grade fintech solutions including payment processing, regulatory compliance, trading platforms, fraud detection, and digital banking.",
};

const solutions = [
    { icon: CreditCard, title: "Payment Systems", desc: "PCI-DSS compliant payment gateways & processing" },
    { icon: ShieldCheck, title: "Regulatory Compliance", desc: "KYC, AML & automated regulatory reporting" },
    { icon: TrendingUp, title: "Trading Platforms", desc: "Low-latency trading engines & market analytics" },
    { icon: Lock, title: "Fraud Detection", desc: "AI-powered transaction monitoring & risk scoring" },
    { icon: Banknote, title: "Digital Banking", desc: "Neo-banking platforms & financial APIs" },
    { icon: Landmark, title: "Wealth Management", desc: "Portfolio analytics & robo-advisory solutions" },
];

export default function FintechPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            FinTech Solutions
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Powering the Future of{" "}
                            <span className="gradient-text">Financial Technology</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            We build secure, compliant, and high-performance financial platforms
                            that enable innovation while meeting the strictest regulatory standards.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Discuss Your Project <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Solutions */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader overline="What We Offer" title="FinTech" titleHighlight="Solutions" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {solutions.map((item, i) => (
                            <Card3D key={i} className="text-center">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
                                <p className="text-sm text-[var(--text-tertiary)]">{item.desc}</p>
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
                            <h2 className="text-white mb-4">Ready to Innovate in Finance?</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Let&apos;s build secure, scalable financial technology together.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Get Started <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
