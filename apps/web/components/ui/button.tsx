"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "icon";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

        const variants = {
            primary: "text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 hover:shadow-[0_0_40px_-10px_oklch(55%_0.18_250_/_0.4)] hover:-translate-y-0.5 focus-visible:ring-primary-400",
            secondary: "text-[var(--text-primary)] bg-transparent border-2 border-[var(--border-secondary)] hover:border-primary-500 hover:text-primary-500 hover:-translate-y-0.5 focus-visible:ring-primary-400",
            ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
            icon: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--border-secondary)]",
        };

        const sizes = {
            sm: variant === "icon" ? "w-9 h-9 rounded-lg" : "px-4 py-2 text-sm rounded-lg",
            md: variant === "icon" ? "w-11 h-11 rounded-xl" : "px-6 py-3 text-base rounded-xl",
            lg: variant === "icon" ? "w-14 h-14 rounded-xl" : "px-8 py-4 text-lg rounded-2xl",
        };

        return (
            <button
                ref={ref}
                className={clsx(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                ) : null}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
