"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
    return (
        <section className="section-padding relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-dark-900 to-accent-900/30" />
            <div className="absolute inset-0">
                <div className="glow-orb w-[800px] h-[800px] bg-primary-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="container-main relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-white mb-6">
                        Ready to Transform Your{" "}
                        <span className="gradient-text">Digital Future?</span>
                    </h2>
                    <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
                        Let&apos;s discuss how TakeWeb can help you achieve your technology
                        goals. Our experts are ready to create solutions tailored to your
                        business.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact" className="btn-primary text-lg">
                            Schedule a Consultation
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </Link>
                        <Link href="/projects" className="btn-secondary text-lg">
                            View Our Portfolio
                        </Link>
                    </div>

                    {/* Contact alternatives */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="text-neutral-500 mb-4">Or reach out directly</p>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <a
                                href="mailto:hello@takeweb.in"
                                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                hello@takeweb.in
                            </a>
                            <a
                                href="tel:+919876543210"
                                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                +91 98765 43210
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
