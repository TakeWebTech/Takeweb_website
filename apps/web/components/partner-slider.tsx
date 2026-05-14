"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const partners = [
    { name: "AWS", logo: "/partners/aws.svg" },
    { name: "Google Cloud", logo: "/partners/google-cloud.svg" },
    { name: "Microsoft Azure", logo: "/partners/azure.svg" },
    { name: "Oracle", logo: "/partners/oracle.svg" },
    { name: "Salesforce", logo: "/partners/salesforce.svg" },
    { name: "SAP", logo: "/partners/sap.svg" },
    { name: "IBM", logo: "/partners/ibm.svg" },
    { name: "Red Hat", logo: "/partners/redhat.svg" },
    { name: "Dell", logo: "/partners/dell.svg" },
    { name: "HP", logo: "/partners/hp.svg" },
    { name: "Cisco", logo: "/partners/cisco.svg" },
    { name: "Adobe", logo: "/partners/adobe.svg" },
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
            <div className="container-main mb-8">
                <p className="text-center text-sm text-[var(--text-muted)] uppercase tracking-widest font-semibold">
                    Trusted by leading enterprises & powered by world-class technology
                </p>
            </div>

            <div className="relative flex overflow-hidden">
                {/* Gradient Fade Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />

                {/* Slider */}
                <div
                    ref={sliderRef}
                    className="flex items-center gap-20 will-change-transform py-4"
                    style={{ width: 'max-content' }}
                >
                    {partners.map((partner, index) => (
                        <div
                            key={`${partner.name}-${index}`}
                            className="flex items-center justify-center h-12 opacity-40 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer group"
                        >
                            <div className="relative h-10 w-32 flex items-center justify-center">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    className="object-contain filter brightness-100 dark:brightness-200 contrast-75 group-hover:contrast-100 transition-all"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
