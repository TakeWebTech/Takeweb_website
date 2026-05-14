import Link from "next/link";
import { Metadata } from "next";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Shield, Lock, Eye, FileCheck, AlertTriangle, Key } from "lucide-react";

export const metadata: Metadata = {
    title: "Cybersecurity Solutions",
    description: "Enterprise-grade security to protect your digital assets, ensure compliance, and respond to threats.",
};

const services = [
    { icon: Shield, title: "Security Audits", desc: "Comprehensive vulnerability assessment" },
    { icon: Lock, title: "Penetration Testing", desc: "Ethical hacking & exploit analysis" },
    { icon: Eye, title: "Threat Monitoring", desc: "24/7 SOC & incident detection" },
    { icon: FileCheck, title: "Compliance", desc: "GDPR, SOC2, HIPAA, ISO 27001" },
    { icon: AlertTriangle, title: "Incident Response", desc: "Rapid threat containment" },
    { icon: Key, title: "Identity & Access", desc: "Zero trust architecture" },
];

export default function CybersecurityPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            Cybersecurity
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Protect Your{" "}
                            <span className="gradient-text">Digital Assets</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            Enterprise-grade security solutions to safeguard your business
                            and ensure regulatory compliance.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Get Security Assessment <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader overline="Services" title="Security" titleHighlight="Solutions" />
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
                            <h2 className="text-white mb-4">Secure Your Enterprise</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Don&apos;t wait for a breach. Get proactive security today.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Request Assessment <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
