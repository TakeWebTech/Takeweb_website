"use client";

interface SectionHeaderProps {
    overline?: string;
    title: string;
    titleHighlight?: string;
    description?: string;
    align?: "left" | "center";
}

export function SectionHeader({
    overline,
    title,
    titleHighlight,
    description,
    align = "center",
}: SectionHeaderProps) {
    return (
        <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-16`}>
            {overline && (
                <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">
                    {overline}
                </span>
            )}
            <h2 className="text-[var(--text-primary)] mb-6">
                {title}{" "}
                {titleHighlight && (
                    <span className="gradient-text">{titleHighlight}</span>
                )}
            </h2>
            {description && (
                <p className="text-lg text-[var(--text-tertiary)]">
                    {description}
                </p>
            )}
        </div>
    );
}
