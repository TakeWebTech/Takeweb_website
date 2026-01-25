"use client";

import { useEffect, useState } from "react";

// CSS-only hero background with animated gradients and floating elements
// Three.js version disabled due to React 19 compatibility issues
// Can be re-enabled when @react-three/fiber fully supports React 19

export function HeroBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Main gradient orbs */}
            <div
                className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-40"
                style={{
                    background: 'linear-gradient(135deg, oklch(55% 0.18 250), oklch(48% 0.18 250))',
                    top: '-200px',
                    right: '-100px',
                    animation: 'float 8s ease-in-out infinite',
                }}
            />
            <div
                className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
                style={{
                    background: 'linear-gradient(135deg, oklch(65% 0.18 195), oklch(55% 0.16 195))',
                    bottom: '-100px',
                    left: '-150px',
                    animation: 'float 10s ease-in-out infinite reverse',
                }}
            />
            <div
                className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-25"
                style={{
                    background: 'linear-gradient(135deg, oklch(75% 0.15 280), oklch(60% 0.20 290))',
                    top: '30%',
                    left: '40%',
                    animation: 'pulse-glow 6s ease-in-out infinite',
                }}
            />

            {/* Floating geometric shapes */}
            <div className="absolute inset-0">
                {/* Orbiting rings */}
                <div
                    className="absolute top-1/4 right-1/4 w-64 h-64"
                    style={{
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        animation: 'float 12s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute top-1/3 right-1/3 w-48 h-48"
                    style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '50%',
                        animation: 'float 15s ease-in-out infinite reverse',
                    }}
                />

                {/* Floating dots */}
                <div
                    className="absolute w-2 h-2 rounded-full bg-primary-400/60"
                    style={{ top: '20%', left: '25%', animation: 'float 7s ease-in-out infinite' }}
                />
                <div
                    className="absolute w-3 h-3 rounded-full bg-accent-400/50"
                    style={{ top: '60%', right: '20%', animation: 'float 9s ease-in-out infinite reverse' }}
                />
                <div
                    className="absolute w-2 h-2 rounded-full bg-primary-400/40"
                    style={{ bottom: '30%', left: '60%', animation: 'float 8s ease-in-out infinite' }}
                />
                <div
                    className="absolute w-4 h-4 rounded-full bg-accent-500/30"
                    style={{ top: '45%', left: '15%', animation: 'pulse-glow 5s ease-in-out infinite' }}
                />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Radial gradient fade */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent, var(--color-dark-900, oklch(12% 0.02 250)))',
                }}
            />
        </div>
    );
}
