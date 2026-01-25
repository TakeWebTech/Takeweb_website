"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const partners = [
    { name: "AWS", logo: "/partners/aws.svg" },
    { name: "Google Cloud", logo: "/partners/gcp.svg" },
    { name: "Microsoft Azure", logo: "/partners/azure.svg" },
    { name: "Oracle", logo: "/partners/oracle.svg" },
    { name: "Salesforce", logo: "/partners/salesforce.svg" },
    { name: "SAP", logo: "/partners/sap.svg" },
    { name: "IBM", logo: "/partners/ibm.svg" },
    { name: "Red Hat", logo: "/partners/redhat.svg" },
    { name: "Docker", logo: "/partners/docker.svg" },
    { name: "Kubernetes", logo: "/partners/kubernetes.svg" },
];

export function PartnerSlider() {
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        // Clone items for infinite scroll
        const items = slider.innerHTML;
        slider.innerHTML = items + items;

        let position = 0;
        const speed = 0.5; // pixels per frame

        const animate = () => {
            position += speed;

            // Reset position when first set of items is scrolled
            if (position >= slider.scrollWidth / 2) {
                position = 0;
            }

            slider.style.transform = `translateX(-${position}px)`;
            requestAnimationFrame(animate);
        };

        const animation = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animation);
    }, []);

    return (
        <section className="py-12 border-y border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden">
            <div className="container-main mb-6">
                <p className="text-center text-sm text-[var(--text-muted)] uppercase tracking-wide font-medium">
                    Trusted by leading enterprises & powered by world-class technology
                </p>
            </div>

            <div className="relative">
                {/* Gradient Fade Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />

                {/* Slider */}
                <div
                    ref={sliderRef}
                    className="flex items-center gap-16 will-change-transform"
                    style={{ width: 'max-content' }}
                >
                    {partners.map((partner, index) => (
                        <div
                            key={`${partner.name}-${index}`}
                            className="flex items-center justify-center h-12 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                        >
                            {/* Placeholder logos - you can replace with actual partner logos */}
                            <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-xs font-bold">
                                    {partner.name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium whitespace-nowrap">
                                    {partner.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
