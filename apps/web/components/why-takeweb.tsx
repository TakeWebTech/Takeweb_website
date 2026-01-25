"use client";

import { motion } from "framer-motion";

const features = [
    {
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
            </svg>
        ),
        title: "Enterprise-Grade Quality",
        description:
            "Built to the highest standards with rigorous testing, security audits, and compliance certifications.",
    },
    {
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                />
            </svg>
        ),
        title: "Rapid Delivery",
        description:
            "Agile methodologies and experienced teams ensure on-time delivery without compromising quality.",
    },
    {
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
        ),
        title: "Expert Teams",
        description:
            "Senior architects and developers with deep expertise across industries and technologies.",
    },
    {
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
            </svg>
        ),
        title: "Continuous Support",
        description:
            "24/7 support and maintenance to ensure your systems run smoothly and evolve with your business.",
    },
    {
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
        title: "Global Reach",
        description:
            "Serving clients across continents with culturally aware teams and 24-hour development cycles.",
    },
    {
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
            </svg>
        ),
        title: "Innovation First",
        description:
            "Leveraging emerging technologies like AI, blockchain, and quantum computing to future-proof your business.",
    },
];

export function WhyTakeWebSection() {
    return (
        <section className="section-padding">
            <div className="container-main">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column - Content */}
                    <div>
                        <span className="text-primary-400 font-medium text-sm uppercase tracking-wider">
                            Why TakeWeb
                        </span>
                        <h2 className="mt-4 text-white mb-6">
                            Your Trusted Partner in{" "}
                            <span className="gradient-text">Digital Excellence</span>
                        </h2>
                        <p className="text-lg text-neutral-400 mb-8">
                            We combine deep technical expertise with strategic business
                            acumen to deliver solutions that drive real results. Our track
                            record speaks for itself.
                        </p>

                        {/* Features Grid */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">
                                            {feature.title}
                                        </h4>
                                        <p className="text-sm text-neutral-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-3xl glass-card p-8 flex items-center justify-center overflow-hidden">
                            {/* Abstract visualization */}
                            <div className="relative w-full h-full">
                                {/* Concentric circles */}
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="absolute inset-0 border border-white/10 rounded-full"
                                        style={{
                                            transform: `scale(${i * 0.25})`,
                                            animationDelay: `${i * 0.2}s`,
                                        }}
                                    />
                                ))}

                                {/* Center icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center animate-float">
                                        <svg
                                            className="w-12 h-12 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Floating icons */}
                                <div className="absolute top-8 right-12 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
                                    <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="absolute bottom-16 left-8 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center animate-float" style={{ animationDelay: "0.5s" }}>
                                    <svg className="w-6 h-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-3xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
