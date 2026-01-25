import Link from "next/link";
import { Metadata } from "next";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/ui/section-header";
import { FloatingElements } from "@/components/floating-elements";
import { ArrowRight, Code, Cloud, Shield, Cpu, Smartphone, BarChart3, Check } from "lucide-react";

export const metadata: Metadata = {
    title: "Services",
    description: "Comprehensive enterprise IT solutions including software development, cloud services, AI integration, cybersecurity, and digital transformation.",
};

const services = [
    {
        icon: Code,
        title: "Enterprise Software Development",
        description: "Custom software solutions engineered for complex enterprise challenges. From legacy modernization to greenfield development, we build scalable, secure, and maintainable systems.",
        href: "/services/enterprise-software",
        gradient: "from-blue-500 to-cyan-500",
        features: ["Custom Applications", "API Development", "System Integration", "Legacy Modernization"],
    },
    {
        icon: Cloud,
        title: "Cloud & DevOps Solutions",
        description: "Accelerate your cloud journey with our comprehensive cloud services. We help you migrate, optimize, and manage your cloud infrastructure for maximum efficiency.",
        href: "/services/cloud-devops",
        gradient: "from-violet-500 to-purple-500",
        features: ["Cloud Migration", "Infrastructure as Code", "CI/CD Pipelines", "Container Orchestration"],
    },
    {
        icon: Cpu,
        title: "AI & Data Engineering",
        description: "Unlock the power of your data with intelligent solutions. We build AI/ML models, data pipelines, and analytics platforms that drive informed decision-making.",
        href: "/services/ai-data",
        gradient: "from-amber-500 to-orange-500",
        features: ["Machine Learning", "Data Pipelines", "Predictive Analytics", "Computer Vision"],
    },
    {
        icon: Shield,
        title: "Cybersecurity & Compliance",
        description: "Protect your digital assets with enterprise-grade security. Our comprehensive security solutions ensure your systems are secure and compliant with industry standards.",
        href: "/services/cybersecurity",
        gradient: "from-rose-500 to-pink-500",
        features: ["Security Audits", "Penetration Testing", "Compliance (GDPR, SOC2)", "Incident Response"],
    },
    {
        icon: Smartphone,
        title: "Web & Mobile Development",
        description: "Create exceptional digital experiences across all platforms. We build responsive web applications and native mobile apps that users love.",
        href: "/services/web-mobile",
        gradient: "from-emerald-500 to-teal-500",
        features: ["Web Applications", "iOS & Android Apps", "Progressive Web Apps", "Cross-Platform Development"],
    },
    {
        icon: BarChart3,
        title: "IT Consulting & Strategy",
        description: "Navigate your digital transformation with expert guidance. Our consultants help you define strategy, optimize operations, and implement best practices.",
        href: "/services/it-consulting",
        gradient: "from-indigo-500 to-blue-500",
        features: ["Digital Strategy", "Technology Roadmaps", "Process Optimization", "Change Management"],
    },
];

const process = [
    {
        step: "01",
        title: "Discovery",
        description: "We dive deep into understanding your business challenges, goals, and technical requirements.",
    },
    {
        step: "02",
        title: "Strategy",
        description: "Our team creates a comprehensive roadmap with clear milestones and deliverables.",
    },
    {
        step: "03",
        title: "Development",
        description: "Agile development with regular demos and feedback cycles to ensure alignment.",
    },
    {
        step: "04",
        title: "Deployment",
        description: "Smooth rollout with comprehensive testing, training, and documentation.",
    },
    {
        step: "05",
        title: "Support",
        description: "Ongoing maintenance, optimization, and 24/7 support to ensure continued success.",
    },
];

export default function ServicesPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />

                <div className="container-main relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">
                            Our Services
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Enterprise IT Solutions{" "}
                            <span className="gradient-text">That Drive Results</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)]">
                            From strategy to execution, we deliver comprehensive technology solutions
                            that help enterprises innovate, scale, and succeed in the digital age.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <Link key={index} href={service.href}>
                                <Card3D className="h-full group cursor-pointer">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6`}>
                                        <service.icon className="text-white" size={28} />
                                    </div>

                                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 group-hover:text-primary-500 transition-colors">
                                        {service.title}
                                    </h3>

                                    <p className="text-[var(--text-tertiary)] mb-6">
                                        {service.description}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                <Check size={14} className="text-primary-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 group-hover:gap-2 transition-all">
                                        Learn more <ArrowRight size={14} />
                                    </span>
                                </Card3D>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader
                        overline="Our Process"
                        title="How We"
                        titleHighlight="Deliver Excellence"
                        description="A proven methodology that ensures successful outcomes for every project."
                    />

                    <div className="grid md:grid-cols-5 gap-6">
                        {process.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-primary-500/10 text-primary-500 font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-[var(--text-tertiary)]">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Connector */}
                                {index < process.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-primary-500/50 to-transparent" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 md:p-16 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-white mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Let&apos;s discuss your project requirements and how we can help you achieve your goals.
                            </p>

                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                Schedule a Consultation
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
