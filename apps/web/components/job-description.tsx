"use client";

import { useMemo } from "react";
import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "a",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

function sanitizeDescription(description: string, compact: boolean) {
  return sanitizeHtml(description, {
    allowedTags: compact ? [] : allowedTags,
    allowedAttributes: compact ? {} : { a: ["href", "title", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: compact
      ? undefined
      : {
          a: (_tagName, attributes) => ({
            tagName: "a",
            attribs: {
              ...(attributes.href ? { href: attributes.href } : {}),
              ...(attributes.title ? { title: attributes.title } : {}),
              rel: "noopener noreferrer",
              ...(attributes.target === "_blank" ? { target: "_blank" } : {}),
            },
          }),
        },
  });
}

export function JobDescription({
  description,
  compact = false,
  fallback = "Details will be shared during the application process.",
}: {
  description: string | null;
  compact?: boolean;
  fallback?: string;
}) {
  const sanitized = useMemo(
    () => sanitizeDescription(description || fallback, compact),
    [compact, description, fallback],
  );

  return (
    <div
      className={
        compact
          ? "line-clamp-2 text-sm text-[var(--text-tertiary)]"
          : "job-rich-text text-[var(--text-tertiary)]"
      }
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
