"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Link as LinkIcon,
    Image as ImageIcon,
    Code,
    Quote,
    Minus,
    Eye,
    EyeOff,
    Columns,
    FileText,
    Undo,
    Redo,
    Copy,
    Check,
} from "lucide-react";

interface RichEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
    label?: string;
    error?: string;
}

type ViewMode = "edit" | "split" | "preview";

/* ── Markdown ➜ HTML (simple) ── */
function markdownToHtml(md: string): string {
    let html = md
        // Code blocks
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="md-code-block"><code>$2</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
        // Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="md-img" />')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link">$1</a>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        // Strikethrough
        .replace(/~~(.+?)~~/g, "<del>$1</del>")
        // Headings
        .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
        // Blockquote
        .replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
        // Horizontal rule
        .replace(/^---$/gm, '<hr class="md-hr" />')
        // Unordered list
        .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
        // Ordered list
        .replace(/^\d+\. (.+)$/gm, '<li class="md-li-ordered">$1</li>')
        // Paragraphs — wrap remaining lines
        .replace(/^(?!<[hbluoip]|<li|<hr|<pre|<code|<del|<strong|<em|<a |<img)(.+)$/gm, "<p>$1</p>");

    // Wrap consecutive <li> in <ul>
    html = html.replace(/((?:<li class="md-li">.*<\/li>\s*)+)/g, '<ul class="md-ul">$1</ul>');
    html = html.replace(/((?:<li class="md-li-ordered">.*<\/li>\s*)+)/g, '<ol class="md-ol">$1</ol>');

    return html;
}

/* ── Toolbar config ── */
interface ToolbarAction {
    icon: React.ElementType;
    label: string;
    action: "wrap" | "prefix" | "insert" | "block";
    before?: string;
    after?: string;
    text?: string;
}

const toolbarGroups: ToolbarAction[][] = [
    [
        { icon: Bold, label: "Bold", action: "wrap", before: "**", after: "**" },
        { icon: Italic, label: "Italic", action: "wrap", before: "*", after: "*" },
        { icon: Strikethrough, label: "Strikethrough", action: "wrap", before: "~~", after: "~~" },
        { icon: Code, label: "Inline Code", action: "wrap", before: "`", after: "`" },
    ],
    [
        { icon: Heading1, label: "Heading 1", action: "prefix", before: "# " },
        { icon: Heading2, label: "Heading 2", action: "prefix", before: "## " },
        { icon: Heading3, label: "Heading 3", action: "prefix", before: "### " },
    ],
    [
        { icon: List, label: "Bullet List", action: "prefix", before: "- " },
        { icon: ListOrdered, label: "Numbered List", action: "prefix", before: "1. " },
        { icon: Quote, label: "Blockquote", action: "prefix", before: "> " },
    ],
    [
        { icon: LinkIcon, label: "Link", action: "insert", text: "[link text](https://)" },
        { icon: ImageIcon, label: "Image", action: "insert", text: "![alt text](https://)" },
        { icon: Minus, label: "Divider", action: "insert", text: "\n---\n" },
    ],
];

/* ═══════════════════════ COMPONENT ═══════════════════════ */
export default function RichEditor({
    value,
    onChange,
    placeholder = "Start writing...",
    minHeight = "300px",
    label,
    error,
}: RichEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("edit");
    const [copied, setCopied] = useState(false);

    // Auto-resize textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (ta && viewMode !== "preview") {
            ta.style.height = "auto";
            ta.style.height = Math.max(parseInt(minHeight), ta.scrollHeight) + "px";
        }
    }, [value, viewMode, minHeight]);

    /* ── Apply toolbar action ── */
    const applyAction = useCallback(
        (action: ToolbarAction) => {
            const ta = textareaRef.current;
            if (!ta) return;

            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const selected = value.substring(start, end);
            let newValue = value;
            let cursorPos = start;

            switch (action.action) {
                case "wrap": {
                    const before = action.before || "";
                    const after = action.after || "";
                    const wrapped = `${before}${selected || "text"}${after}`;
                    newValue = value.substring(0, start) + wrapped + value.substring(end);
                    cursorPos = start + before.length;
                    break;
                }
                case "prefix": {
                    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
                    const prefix = action.before || "";
                    newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
                    cursorPos = start + prefix.length;
                    break;
                }
                case "insert": {
                    const insert = action.text || "";
                    newValue = value.substring(0, start) + insert + value.substring(end);
                    cursorPos = start + insert.length;
                    break;
                }
            }

            onChange(newValue);
            // Restore cursor after React re-render
            requestAnimationFrame(() => {
                ta.focus();
                ta.setSelectionRange(cursorPos, cursorPos);
            });
        },
        [value, onChange]
    );

    /* ── Keyboard shortcuts ── */
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case "b":
                        e.preventDefault();
                        applyAction({ icon: Bold, label: "Bold", action: "wrap", before: "**", after: "**" });
                        break;
                    case "i":
                        e.preventDefault();
                        applyAction({ icon: Italic, label: "Italic", action: "wrap", before: "*", after: "*" });
                        break;
                }
            }
            // Tab indent
            if (e.key === "Tab") {
                e.preventDefault();
                const ta = textareaRef.current;
                if (!ta) return;
                const start = ta.selectionStart;
                const newVal = value.substring(0, start) + "    " + value.substring(ta.selectionEnd);
                onChange(newVal);
                requestAnimationFrame(() => {
                    ta.setSelectionRange(start + 4, start + 4);
                });
            }
        },
        [applyAction, value, onChange]
    );

    /* ── Stats ── */
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
    const charCount = value.length;

    const copyMarkdown = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const viewModes: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
        { mode: "edit", icon: FileText, label: "Edit" },
        { mode: "split", icon: Columns, label: "Split" },
        { mode: "preview", icon: Eye, label: "Preview" },
    ];

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                    {label}
                </label>
            )}

            <div className={`rounded-xl border overflow-hidden ${error ? "border-red-500" : "border-dark-700"} bg-dark-850`}>
                {/* ── Toolbar ── */}
                <div className="flex items-center justify-between border-b border-dark-700 bg-dark-800 px-2 py-1.5">
                    <div className="flex items-center gap-0.5 flex-wrap">
                        {toolbarGroups.map((group, gi) => (
                            <div key={gi} className="flex items-center">
                                {gi > 0 && <div className="w-px h-5 bg-dark-600 mx-1" />}
                                {group.map((action) => (
                                    <button
                                        key={action.label}
                                        type="button"
                                        onClick={() => applyAction(action)}
                                        title={action.label}
                                        className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-dark-700 transition-colors"
                                    >
                                        <action.icon size={15} />
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={copyMarkdown}
                            title="Copy Markdown"
                            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-dark-700 transition-colors"
                        >
                            {copied ? <Check size={14} className="text-success-400" /> : <Copy size={14} />}
                        </button>
                        <div className="w-px h-5 bg-dark-600 mx-1" />
                        {viewModes.map((vm) => (
                            <button
                                key={vm.mode}
                                type="button"
                                onClick={() => setViewMode(vm.mode)}
                                title={vm.label}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === vm.mode
                                    ? "text-primary-400 bg-dark-700"
                                    : "text-neutral-400 hover:text-white hover:bg-dark-700"
                                    }`}
                            >
                                <vm.icon size={15} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Editor / Preview area ── */}
                <div className={`${viewMode === "split" ? "grid grid-cols-2 divide-x divide-dark-700" : ""}`}>
                    {/* Editor */}
                    {viewMode !== "preview" && (
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-600 
                                       font-mono text-sm leading-relaxed p-4 resize-none focus:outline-none"
                            style={{ minHeight }}
                        />
                    )}

                    {/* Preview */}
                    {(viewMode === "preview" || viewMode === "split") && (
                        <div
                            className="rich-editor-preview p-4 prose prose-invert max-w-none overflow-auto text-sm"
                            style={{ minHeight }}
                            dangerouslySetInnerHTML={{ __html: markdownToHtml(value) || `<p class="text-neutral-600">${placeholder}</p>` }}
                        />
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-dark-700 bg-dark-800 text-[0.7rem] text-neutral-500">
                    <div className="flex items-center gap-3">
                        <span>{wordCount} words</span>
                        <span>{charCount} characters</span>
                    </div>
                    <span>Markdown supported · Ctrl+B bold · Ctrl+I italic</span>
                </div>
            </div>

            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
}
