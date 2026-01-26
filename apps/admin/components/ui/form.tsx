"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        className={`
                            w-full px-4 py-2.5 rounded-lg
                            bg-dark-700 border border-neutral-700
                            text-white placeholder:text-neutral-500
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-200
                            ${icon ? 'pl-10' : ''}
                            ${error ? 'border-red-500 focus:ring-red-500' : ''}
                            ${className}
                        `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-sm text-red-400">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

// Textarea Component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`
                        w-full px-4 py-2.5 rounded-lg
                        bg-dark-700 border border-neutral-700
                        text-white placeholder:text-neutral-500
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200 resize-none
                        ${error ? 'border-red-500 focus:ring-red-500' : ''}
                        ${className}
                    `}
                    rows={4}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-400">{error}</p>
                )}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

// Select Component
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
                        w-full px-4 py-2.5 rounded-lg
                        bg-dark-700 border border-neutral-700
                        text-white
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200
                        ${error ? 'border-red-500 focus:ring-red-500' : ''}
                        ${className}
                    `}
                    {...props}
                >
                    <option value="">Select...</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-red-400">{error}</p>
                )}
            </div>
        );
    }
);
Select.displayName = 'Select';

// Checkbox Component
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = '', ...props }, ref) => {
        return (
            <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
                <input
                    ref={ref}
                    type="checkbox"
                    className="
                        w-5 h-5 rounded
                        bg-dark-700 border border-neutral-700
                        text-primary-500
                        focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
                        cursor-pointer
                    "
                    {...props}
                />
                <span className="text-sm text-neutral-300">{label}</span>
            </label>
        );
    }
);
Checkbox.displayName = 'Checkbox';

// Toggle Switch Component
interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export function Toggle({ label, checked, onChange, disabled }: ToggleProps) {
    return (
        <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={`
                    relative w-11 h-6 rounded-full transition-colors duration-200
                    ${checked ? 'bg-primary-500' : 'bg-neutral-700'}
                `}
            >
                <span
                    className={`
                        absolute top-1 left-1 w-4 h-4 rounded-full bg-white
                        transition-transform duration-200
                        ${checked ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </button>
            <span className="text-sm text-neutral-300">{label}</span>
        </label>
    );
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: ReactNode;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = `
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-dark-700 text-white border border-neutral-600 hover:bg-dark-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        ghost: 'text-neutral-400 hover:text-white hover:bg-dark-700',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : icon ? (
                icon
            ) : null}
            {children}
        </button>
    );
}
