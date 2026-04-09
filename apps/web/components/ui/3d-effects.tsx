'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface Card3DProps {
    children: ReactNode;
    className?: string;
}

export function Card3D({ children, className = '' }: Card3DProps) {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateXValue = ((y - centerY) / centerY) * -10;
        const rotateYValue = ((x - centerX) / centerX) * 10;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            className={`relative ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: 1000,
            }}
            animate={{
                rotateX,
                rotateY,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(50px)',
                }}
                whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3 },
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function MagneticButton({
    children,
    className = '',
    onClick,
}: MagneticButtonProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        setPosition({ x: x * 0.3, y: y * 0.3 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            className={className}
            animate={position}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
}

interface ShimmerCardProps {
    children: ReactNode;
    className?: string;
}

export function ShimmerCard({ children, className = '' }: ShimmerCardProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{
                    x: '100%',
                }}
                transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                }}
            />
            {children}
        </div>
    );
}
