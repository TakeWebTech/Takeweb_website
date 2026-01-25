"use client";

export function FloatingElements() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Primary gradient orb - top right */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full blur-[100px] animate-float-slow"
                style={{
                    background: 'linear-gradient(135deg, oklch(55% 0.18 250 / 0.25), oklch(48% 0.18 250 / 0.15))',
                    top: '-150px',
                    right: '-100px',
                }}
            />

            {/* Accent orb - bottom left */}
            <div
                className="absolute w-[400px] h-[400px] rounded-full blur-[80px] animate-float"
                style={{
                    background: 'linear-gradient(135deg, oklch(75% 0.15 195 / 0.2), oklch(65% 0.18 195 / 0.1))',
                    bottom: '-100px',
                    left: '-150px',
                    animationDelay: '-2s',
                }}
            />

            {/* Small accent orb - center */}
            <div
                className="absolute w-[300px] h-[300px] rounded-full blur-[60px] animate-pulse-glow"
                style={{
                    background: 'radial-gradient(circle, oklch(65% 0.15 280 / 0.15), transparent)',
                    top: '30%',
                    left: '40%',
                }}
            />

            {/* Geometric shapes */}
            <div className="absolute inset-0">
                {/* Orbiting ring */}
                <div
                    className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full animate-spin-slow"
                    style={{
                        border: '1px solid oklch(100% 0 0 / 0.06)',
                    }}
                />

                {/* Inner ring */}
                <div
                    className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full animate-spin-slow"
                    style={{
                        border: '1px dashed oklch(100% 0 0 / 0.04)',
                        animationDirection: 'reverse',
                        animationDuration: '30s',
                    }}
                />

                {/* Floating dots */}
                <div
                    className="absolute w-2 h-2 rounded-full bg-primary-400/50 animate-float"
                    style={{ top: '15%', left: '20%', animationDelay: '-1s' }}
                />
                <div
                    className="absolute w-3 h-3 rounded-full bg-accent-400/40 animate-float"
                    style={{ top: '60%', right: '15%', animationDelay: '-3s' }}
                />
                <div
                    className="absolute w-2 h-2 rounded-full bg-primary-500/30 animate-float"
                    style={{ bottom: '25%', left: '55%', animationDelay: '-5s' }}
                />
                <div
                    className="absolute w-4 h-4 rounded-full bg-accent-500/20 animate-pulse-glow"
                    style={{ top: '40%', left: '10%' }}
                />

                {/* Gradient lines */}
                <div
                    className="absolute top-1/2 left-0 right-0 h-px"
                    style={{
                        background: 'linear-gradient(90deg, transparent, oklch(100% 0 0 / 0.05), transparent)',
                    }}
                />
                <div
                    className="absolute top-0 bottom-0 left-1/2 w-px"
                    style={{
                        background: 'linear-gradient(180deg, transparent, oklch(100% 0 0 / 0.03), transparent)',
                    }}
                />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(oklch(100% 0 0 / 0.02) 1px, transparent 1px),
                        linear-gradient(90deg, oklch(100% 0 0 / 0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                    maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)',
                }}
            />

            {/* Radial gradient fade to edges */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent, var(--bg-primary))',
                }}
            />
        </div>
    );
}
