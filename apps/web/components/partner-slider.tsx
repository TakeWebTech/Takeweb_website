"use client";

import { useEffect, useRef } from "react";
import { 
    Cloud, 
    Database, 
    Server, 
    Shield, 
    Globe, 
    Cpu, 
    Activity, 
    Box, 
    Layers, 
    Hexagon, 
    Triangle, 
    Circle, 
    Globe2 
} from "lucide-react";

const partners = [
    { name: "AWS", icon: Cloud },
    { name: "Google Cloud", icon: Database },
    { name: "Microsoft Azure", icon: Server },
    { name: "Oracle", icon: Shield },
    { name: "Salesforce", icon: Globe },
    { name: "SAP", icon: Cpu },
    { name: "IBM", icon: Activity },
    { name: "Red Hat", icon: Box },
    { name: "TechVentures", icon: Layers },
    { name: "DataFlow", icon: Hexagon },
    { name: "InnovateCorp", icon: Triangle },
    { name: "GlobalStack", icon: Circle },
    { name: "PeakSystems", icon: Globe2 },
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

            <div className="relative flex overflow-hidden">
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
                            className="flex items-center justify-center h-12 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer"
                        >
                            <div className="flex items-center gap-3 text-[var(--text-muted)] group">
                                <partner.icon 
                                    size={30} 
                                    className="text-[var(--text-secondary)] group-hover:text-amber-500 transition-colors" 
                                />
                                <span className="text-xl font-bold whitespace-nowrap tracking-tight">
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
