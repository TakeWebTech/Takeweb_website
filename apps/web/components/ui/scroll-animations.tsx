'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    className?: string;
}

export function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    className = '',
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const getInitialPosition = (): { x: number; y: number } => {
        switch (direction) {
            case 'up':
                return { x: 0, y: 50 };
            case 'down':
                return { x: 0, y: -50 };
            case 'left':
                return { x: 50, y: 0 };
            case 'right':
                return { x: -50, y: 0 };
        }
    };

    const initialPos = getInitialPosition();

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                x: initialPos.x,
                y: initialPos.y,
            }}
            animate={{
                opacity: isInView ? 1 : 0,
                x: isInView ? 0 : initialPos.x,
                y: isInView ? 0 : initialPos.y,
            }}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.8, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
}

export function StaggerContainer({
    children,
    className = '',
}: StaggerContainerProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.1,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = '' }: FadeInProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface ParallaxProps {
    children: ReactNode;
    offset?: number;
    className?: string;
}

export function Parallax({ children, offset = 50, className = '' }: ParallaxProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });

    return (
        <motion.div
            ref={ref}
            style={{
                y: isInView ? 0 : offset,
            }}
            transition={{ duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
