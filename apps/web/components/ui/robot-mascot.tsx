'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function RobotMascot() {
    const [isVisible, setIsVisible] = useState(false);
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Smooth spring animations for robot position
    const robotX = useSpring(cursorX, { stiffness: 150, damping: 20 });
    const robotY = useSpring(cursorY, { stiffness: 150, damping: 20 });

    useEffect(() => {
        // Show mascot after page load
        const timer = setTimeout(() => setIsVisible(true), 2000);

        // Track mouse movement
        const handleMouseMove = (e: MouseEvent) => {
            // Position robot near cursor with offset
            cursorX.set(e.clientX - 40);
            cursorY.set(e.clientY - 40);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [cursorX, cursorY]);

    // Hide on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isVisible ? 0.9 : 0, scale: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{
                x: robotX,
                y: robotY,
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 9998,
            }}
            className="w-20 h-20"
        >
            {/* Robot SVG */}
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-lg"
            >
                {/* Robot Body */}
                <motion.g
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {/* Head */}
                    <rect
                        x="30"
                        y="20"
                        width="40"
                        height="35"
                        rx="8"
                        fill="#b39b5e"
                        stroke="#d4c293"
                        strokeWidth="2"
                    />

                    {/* Antenna */}
                    <line
                        x1="50"
                        y1="20"
                        x2="50"
                        y2="10"
                        stroke="#b39b5e"
                        strokeWidth="2"
                    />
                    <motion.circle
                        cx="50"
                        cy="8"
                        r="3"
                        fill="#d4c293"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />

                    {/* Eyes */}
                    <motion.g
                        animate={{ scaleY: [1, 0.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <circle cx="40" cy="35" r="4" fill="#1a1a1a" />
                        <circle cx="60" cy="35" r="4" fill="#1a1a1a" />
                        <circle cx="40" cy="34" r="1.5" fill="#fff" />
                        <circle cx="60" cy="34" r="1.5" fill="#fff" />
                    </motion.g>

                    {/* Smile */}
                    <path
                        d="M 38 45 Q 50 50 62 45"
                        stroke="#1a1a1a"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Body */}
                    <rect
                        x="35"
                        y="55"
                        width="30"
                        height="25"
                        rx="5"
                        fill="#b39b5e"
                        stroke="#d4c293"
                        strokeWidth="2"
                    />

                    {/* Body Details */}
                    <circle cx="50" cy="67" r="3" fill="#d4c293" />

                    {/* Arms */}
                    <motion.rect
                        x="25"
                        y="60"
                        width="8"
                        height="15"
                        rx="4"
                        fill="#b39b5e"
                        stroke="#d4c293"
                        strokeWidth="1.5"
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ transformOrigin: '29px 60px' }}
                    />
                    <motion.rect
                        x="67"
                        y="60"
                        width="8"
                        height="15"
                        rx="4"
                        fill="#b39b5e"
                        stroke="#d4c293"
                        strokeWidth="1.5"
                        animate={{ rotate: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ transformOrigin: '71px 60px' }}
                    />
                </motion.g>

                {/* Floating effect */}
                <motion.g
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {/* Shadow */}
                    <ellipse
                        cx="50"
                        cy="95"
                        rx="15"
                        ry="3"
                        fill="#000"
                        opacity="0.2"
                    />
                </motion.g>
            </svg>
        </motion.div>
    );
}
