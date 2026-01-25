"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
    { value: 500, suffix: "+", label: "Projects Delivered" },
    { value: 50, suffix: "+", label: "Enterprise Clients" },
    { value: 15, suffix: "+", label: "Years Experience" },
    { value: 99, suffix: "%", label: "Client Satisfaction" },
];

function AnimatedCounter({
    value,
    suffix,
}: {
    value: number;
    suffix: string;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

export function StatsSection() {
    return (
        <section className="section-padding relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="glow-orb w-[600px] h-[600px] bg-primary-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="container-main relative">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-2">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-neutral-400 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
