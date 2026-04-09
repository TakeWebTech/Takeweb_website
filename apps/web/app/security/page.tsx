import Link from "next/link";
import { Metadata } from "next";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Shield, Lock, Eye, Server, FileCheck, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "Security",
    description: "Learn about TakeWeb's security practices, compliance certifications, data protection measures, and infrastructure security.",
};

const practices = [
    { icon: Lock, title: "Data Encryption", desc: "AES-256 encryption at rest, TLS 1.3 in transit for all data" },
    { icon: Shield, title: "Access Control", desc: "Role-based access, MFA, and least-privilege principles" },
    { icon: Eye, title: "Continuous Monitoring", desc: "24/7 security monitoring, SIEM & real-time alerting" },
    { icon: Server, title: "Infrastructure Security", desc: "SOC 2 Type II certified cloud infrastructure" },
    { icon: FileCheck, title: "Compliance", desc: "GDPR, HIPAA, ISO 27001 & PCI-DSS compliant" },
    { icon: AlertTriangle, title: "Incident Response", desc: "Documented IR plans with <1 hour response SLA" },
];

export default function SecurityPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            Security & Compliance
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Enterprise-Grade{" "}
                            <span className="gradient-text">Security First</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            At TakeWeb, security is not an afterthought — it&apos;s built into
                            everything we do. From code to infrastructure, we protect your data
                            with industry-leading practices.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Request Security Audit <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Security Practices */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader overline="Our Approach" title="Security" titleHighlight="Practices" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {practices.map((item, i) => (
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

            {/* Trust Section */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">
                            Our Security <span className="gradient-text">Commitments</span>
                        </h2>
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)]">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Regular Penetration Testing</h3>
                                <p className="text-[var(--text-tertiary)] text-sm">
                                    We conduct regular third-party penetration testing and vulnerability assessments across all our systems and client deployments.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)]">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Secure Development Lifecycle</h3>
                                <p className="text-[var(--text-tertiary)] text-sm">
                                    Every line of code goes through automated SAST/DAST scanning, peer review, and security checks before deployment.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)]">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Employee Security Training</h3>
                                <p className="text-[var(--text-tertiary)] text-sm">
                                    All team members undergo mandatory security awareness training, background checks, and sign NDAs before onboarding.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 md:p-16 text-center overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Have Security Questions?</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Our security team is happy to answer your questions and provide additional documentation.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Contact Security Team <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
