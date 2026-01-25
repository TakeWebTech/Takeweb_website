"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const testimonials = [
    {
        quote:
            "TakeWeb transformed our legacy systems into a modern, scalable platform. Their expertise in cloud migration saved us 40% in infrastructure costs while improving performance by 3x.",
        author: "Rajesh Kumar",
        position: "CTO",
        company: "Global Manufacturing Corp",
        avatar: "/testimonials/avatar-1.jpg",
    },
    {
        quote:
            "The AI-powered analytics solution TakeWeb built has revolutionized how we make decisions. We now have real-time insights that were previously impossible to obtain.",
        author: "Sarah Chen",
        position: "VP of Technology",
        company: "FinTech Solutions Inc",
        avatar: "/testimonials/avatar-2.jpg",
    },
    {
        quote:
            "Working with TakeWeb felt like having an extension of our own team. Their understanding of our business needs and technical execution was exceptional.",
        author: "Michael Roberts",
        position: "Director of IT",
        company: "Healthcare Systems Ltd",
        avatar: "/testimonials/avatar-3.jpg",
    },
    {
        quote:
            "From concept to deployment, TakeWeb delivered our e-commerce platform ahead of schedule. Their agile approach and transparent communication made the process seamless.",
        author: "Priya Sharma",
        position: "CEO",
        company: "Retail Innovations",
        avatar: "/testimonials/avatar-4.jpg",
    },
];

export function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="section-padding bg-dark-800/50">
            <div className="container-main">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary-400 font-medium text-sm uppercase tracking-wider">
                        Testimonials
                    </span>
                    <h2 className="mt-4 text-white">
                        Trusted by{" "}
                        <span className="gradient-text">Industry Leaders</span>
                    </h2>
                    <p className="mt-4 text-lg text-neutral-400">
                        Hear from the enterprises we&apos;ve helped transform.
                    </p>
                </div>

                {/* Testimonials Slider */}
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="glass-card p-8 md:p-12 text-center"
                    >
                        {/* Quote Icon */}
                        <svg
                            className="w-12 h-12 text-primary-500/30 mx-auto mb-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>

                        {/* Quote */}
                        <blockquote className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
                            &ldquo;{testimonials[activeIndex]?.quote}&rdquo;
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                                {testimonials[activeIndex]?.author?.charAt(0)}
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-white">
                                    {testimonials[activeIndex]?.author}
                                </p>
                                <p className="text-sm text-neutral-400">
                                    {testimonials[activeIndex]?.position},{" "}
                                    {testimonials[activeIndex]?.company}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === activeIndex
                                    ? "bg-primary-500 w-8"
                                    : "bg-white/20 hover:bg-white/40"
                                    }`}
                                aria-label={`View testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
