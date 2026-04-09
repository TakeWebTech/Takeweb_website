"use client";

import { HTMLAttributes, useRef, useState } from "react";
import { clsx } from "clsx";

interface Card3DProps extends HTMLAttributes<HTMLDivElement> {
    tiltAmount?: number;
    glareEnabled?: boolean;
}

export function Card3D({
    children,
    className,
    tiltAmount = 10,
    glareEnabled = true,
    ...props
}: Card3DProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState("");
    const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -tiltAmount;
        const rotateY = ((x - centerX) / centerX) * tiltAmount;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
        setGlarePosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    };

    const handleMouseLeave = () => {
        setTransform("");
    };

    return (
        <div
            ref={cardRef}
            className={clsx(
                "relative bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 overflow-hidden transition-all duration-300 ease-out",
                className
            )}
            style={{ transform }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {/* Gradient overlay on hover */}
            <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(600px circle at ${glarePosition.x}% ${glarePosition.y}%, oklch(55% 0.18 250 / 0.06), transparent 40%)`,
                }}
            />

            {/* Glare effect */}
            {glareEnabled && (
                <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: `radial-gradient(200px circle at ${glarePosition.x}% ${glarePosition.y}%, oklch(100% 0 0 / 0.1), transparent 50%)`,
                    }}
                />
            )}

            {/* Border glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    boxShadow: "inset 0 0 0 1px oklch(55% 0.18 250 / 0.2)",
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
