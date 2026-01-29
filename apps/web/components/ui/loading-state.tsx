'use client';

import { ReactNode } from 'react';

interface LoadingStateProps {
    isLoading: boolean;
    children: ReactNode;
    loadingComponent?: ReactNode;
}

export function LoadingState({
    isLoading,
    children,
    loadingComponent,
}: LoadingStateProps) {
    if (isLoading) {
        return loadingComponent || <DefaultLoader />;
    }

    return <>{children}</>;
}

function DefaultLoader() {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="relative">
                {/* Spinner */}
                <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />

                {/* Pulsing background */}
                <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-pulse" style={{ animationDuration: '2s' }} />
            </div>
        </div>
    );
}

interface SkeletonProps {
    className?: string;
    count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`skeleton rounded-lg ${className}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <Skeleton className="w-12 h-12 rounded-xl mb-5" />
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" count={2} />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}
