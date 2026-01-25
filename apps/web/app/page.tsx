import Link from "next/link";
import Image from "next/image";
import { FloatingElements } from "@/components/floating-elements";
import { PartnerSlider } from "@/components/partner-slider";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/ui/section-header";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ArrowRight, Code, Cloud, Shield, Cpu, Smartphone, BarChart3, Globe, Zap, Users, Award } from "lucide-react";

const services = [
    {
        icon: Code,
        title: "Enterprise Software",
        description: "Custom solutions built with cutting-edge technologies for complex business challenges.",
        href: "/services/enterprise-software",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Cloud,
        title: "Cloud & DevOps",
        description: "Seamless cloud migration, infrastructure automation, and continuous delivery.",
        href: "/services/cloud-devops",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        icon: Shield,
        title: "Cybersecurity",
        description: "Enterprise-grade security to protect your digital assets and ensure compliance.",
        href: "/services/cybersecurity",
        gradient: "from-rose-500 to-pink-500",
    },
    {
        icon: Cpu,
        title: "AI & Data Engineering",
        description: "Intelligent automation and predictive analytics for data-driven decisions.",
        href: "/services/ai-data",
        gradient: "from-amber-500 to-orange-500",
    },
    {
        icon: Smartphone,
        title: "Web & Mobile Apps",
        description: "Native and cross-platform apps delivering exceptional user experiences.",
        href: "/services/web-mobile",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: BarChart3,
        title: "IT Consulting",
        description: "Strategic guidance to modernize operations and accelerate digital transformation.",
        href: "/services/it-consulting",
        gradient: "from-indigo-500 to-blue-500",
    },
];

const stats = [
    { value: 500, suffix: "+", label: "Projects Delivered" },
    { value: 99.9, suffix: "%", label: "Uptime SLA" },
    { value: 150, suffix: "+", label: "Enterprise Clients" },
    { value: 50, suffix: "+", label: "Countries Served" },
];

const features = [
    {
        icon: Award,
        title: "Enterprise-Grade Quality",
        description: "Rigorous testing, security audits, and compliance certifications.",
    },
    {
        icon: Zap,
        title: "Rapid Delivery",
        description: "Agile methodologies ensure on-time delivery without compromising quality.",
    },
    {
        icon: Users,
        title: "Expert Teams",
        description: "Senior architects with deep expertise across industries and technologies.",
    },
    {
        icon: Globe,
        title: "Global Reach",
        description: "Serving clients across continents with 24-hour development cycles.",
    },
];

const testimonials = [
    {
        quote: "TakeWeb transformed our legacy systems into a modern, scalable platform. Their team's expertise and dedication exceeded our expectations.",
        author: "Sarah Chen",
        role: "CTO, TechVentures Inc.",
        avatar: "/founder.jpg",
    },
    {
        quote: "The cloud migration was seamless. We reduced costs by 40% while improving performance. Highly recommend their services.",
        author: "Michael Rodriguez",
        role: "VP Engineering, DataFlow",
        avatar: "/founder.jpg",
    },
    {
        quote: "Their AI solutions helped us automate 70% of our manual processes. The ROI was visible within the first quarter.",
        author: "Emily Watson",
        role: "Director of Operations, InnovateCorp",
        avatar: "/founder.jpg",
    },
];

export default function HomePage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <FloatingElements />

                <div className="container-main relative z-10 pt-24 pb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm font-medium text-amber-500 mb-8 animate-fade-in">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Trusted by 500+ enterprises worldwide
                        </div>

                        {/* Headline */}
                        <h1 className="text-[var(--text-primary)] mb-6 animate-slide-up">
                            Next-Generation{" "}
                            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Enterprise IT Solutions</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-[var(--text-tertiary)] max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
                            We deliver world-class consulting, custom software, cloud solutions,
                            and AI-powered innovations to enterprises and governments worldwide.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-[0_0_40px_-10px_oklch(75%_0.15_85_/_0.5)] hover:-translate-y-1 transition-all group"
                            >
                                Get a Consultation
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-[var(--text-primary)] border-2 border-[var(--border-secondary)] rounded-xl hover:border-amber-500 hover:text-amber-500 transition-all"
                            >
                                Explore Solutions
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-[var(--text-muted)] flex items-start justify-center p-2">
                        <div className="w-1 h-2 rounded-full bg-[var(--text-muted)] animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Partner Slider */}
            <PartnerSlider />

            {/* Stats Section */}
            <section className="py-16 border-b border-[var(--border-primary)]">
                <div className="container-main">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-sm text-[var(--text-tertiary)] font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="section-padding">
                <div className="container-main">
                    <SectionHeader
                        overline="Our Services"
                        title="Comprehensive IT Solutions"
                        titleHighlight="for Modern Enterprises"
                        description="From custom software development to cloud infrastructure and AI, we deliver end-to-end solutions that drive business growth."
                    />

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <Link key={index} href={service.href}>
                                <Card3D className="h-full group cursor-pointer">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5`}>
                                        <service.icon className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 group-hover:text-amber-500 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-[var(--text-tertiary)] mb-4">
                                        {service.description}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500 group-hover:gap-2 transition-all">
                                        Learn more <ArrowRight size={14} />
                                    </span>
                                </Card3D>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why TakeWeb Section */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left - Content */}
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4 block">
                                Why TakeWeb
                            </span>
                            <h2 className="text-[var(--text-primary)] mb-6">
                                Your Trusted Partner in{" "}
                                <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Digital Excellence</span>
                            </h2>
                            <p className="text-lg text-[var(--text-tertiary)] mb-10">
                                We combine deep technical expertise with strategic business acumen
                                to deliver solutions that drive real results.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                            <feature.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                                                {feature.title}
                                            </h4>
                                            <p className="text-sm text-[var(--text-tertiary)]">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right - Visual */}
                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] p-8 flex items-center justify-center overflow-hidden">
                                {/* Concentric circles */}
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="absolute border border-[var(--border-primary)] rounded-full animate-spin-slow"
                                        style={{
                                            width: `${i * 25}%`,
                                            height: `${i * 25}%`,
                                            animationDuration: `${20 + i * 5}s`,
                                            animationDirection: i % 2 === 0 ? 'reverse' : 'normal',
                                        }}
                                    />
                                ))}

                                {/* Center logo */}
                                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center animate-float z-10">
                                    <Image
                                        src="/logo.png"
                                        alt="TakeWeb"
                                        width={48}
                                        height={48}
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-3xl blur-3xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="section-padding">
                <div className="container-main">
                    <SectionHeader
                        overline="Testimonials"
                        title="Trusted by Industry"
                        titleHighlight="Leaders"
                        description="See what our clients say about working with TakeWeb Enterprise."
                    />

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card3D key={index} className="h-full">
                                <div className="flex flex-col h-full">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>

                                    <p className="text-[var(--text-secondary)] mb-6 flex-grow">
                                        &ldquo;{testimonial.quote}&rdquo;
                                    </p>

                                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-primary)]">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[var(--bg-tertiary)]">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.author}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-[var(--text-primary)] text-sm">
                                                {testimonial.author}
                                            </div>
                                            <div className="text-xs text-[var(--text-tertiary)]">
                                                {testimonial.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card3D>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 md:p-16 text-center overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-yellow-400 blur-3xl" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-white mb-4">
                                Ready to Transform Your Business?
                            </h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Let&apos;s discuss how TakeWeb can help you achieve your digital transformation goals.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all group"
                                >
                                    Schedule a Call
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </Link>
                                <Link
                                    href="/projects"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                                >
                                    View Our Work
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
