import Link from "next/link";
import { Metadata } from "next";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Cloud, Server, GitBranch, Monitor, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "Cloud & DevOps Solutions",
    description: "Accelerate your cloud journey with comprehensive cloud migration, infrastructure automation, and DevOps services.",
};

const features = [
    { icon: Cloud, title: "Cloud Migration", desc: "Seamless migration to AWS, Azure, or GCP" },
    { icon: Server, title: "Infrastructure as Code", desc: "Terraform, Pulumi, CloudFormation" },
    { icon: GitBranch, title: "CI/CD Pipelines", desc: "Automated build, test, and deploy" },
    { icon: Monitor, title: "Monitoring & Observability", desc: "Real-time insights and alerting" },
    { icon: Shield, title: "Security & Compliance", desc: "Cloud security best practices" },
    { icon: Zap, title: "Cost Optimization", desc: "Reduce cloud spend by 40%" },
];

const cloudPlatforms = [
    { name: "AWS", services: ["EC2", "EKS", "Lambda", "S3", "RDS"] },
    { name: "Azure", services: ["AKS", "Functions", "Cosmos DB", "DevOps"] },
    { name: "GCP", services: ["GKE", "Cloud Run", "BigQuery", "Pub/Sub"] },
];

export default function CloudDevOpsPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            Cloud & DevOps
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Accelerate Your{" "}
                            <span className="gradient-text">Cloud Journey</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            From migration to optimization, we help you harness the full power
                            of cloud computing with modern DevOps practices.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                Get Started <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader overline="Services" title="What We" titleHighlight="Offer" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <Card3D key={i} className="text-center">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                                <p className="text-sm text-[var(--text-tertiary)]">{feature.desc}</p>
                            </Card3D>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cloud Platforms */}
            <section className="section-padding">
                <div className="container-main">
                    <SectionHeader overline="Platforms" title="Multi-Cloud" titleHighlight="Expertise" />
                    <div className="grid md:grid-cols-3 gap-6">
                        {cloudPlatforms.map((platform) => (
                            <Card3D key={platform.name} className="text-center">
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{platform.name}</h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {platform.services.map((service) => (
                                        <span key={service} className="px-3 py-1 bg-[var(--bg-tertiary)] rounded-full text-xs text-[var(--text-secondary)]">
                                            {service}
                                        </span>
                                    ))}
                                </div>
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
                            <h2 className="text-white mb-4">Ready for the Cloud?</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Let&apos;s discuss your cloud strategy and accelerate your digital transformation.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Schedule Consultation <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
