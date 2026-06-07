"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Plus, Check, ChevronDown } from "lucide-react";

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    searchPlaceholder?: string;
    addLabel?: string;
}

export default function SearchableSelect({
    value,
    onChange,
    options: initialOptions,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    addLabel = "Add New",
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [options, setOptions] = useState<string[]>(initialOptions);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update options if parent provides new ones, keeping our locally added ones if they aren't in the new list
    useEffect(() => {
        setOptions(prev => {
            const merged = new Set([...prev, ...initialOptions]);
            return Array.from(merged);
        });
    }, [initialOptions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));
    const exactMatch = options.find(opt => opt.toLowerCase() === search.toLowerCase());

    const handleSelect = (opt: string) => {
        onChange(opt);
        setIsOpen(false);
        setSearch("");
    };

    const handleAddNew = () => {
        if (!search.trim() || exactMatch) return;
        const newOpt = search.trim();
        setOptions(prev => [...prev, newOpt]);
        onChange(newOpt);
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className="relative" ref={containerRef}>
            <div 
                className="input-field w-full flex items-center justify-between cursor-pointer min-h-[42px] bg-dark-800 border-dark-600 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? "text-white" : "text-neutral-500"}>{value || placeholder}</span>
                <ChevronDown size={16} className={`text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-dark-800 border border-dark-600 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-dark-700 flex items-center gap-2">
                        <Search size={16} className="text-neutral-500 ml-1 flex-shrink-0" />
                        <input 
                            ref={inputRef}
                            autoFocus
                            type="text" 
                            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-neutral-500" 
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    const firstOpt = filteredOptions[0];
                                    if (firstOpt) handleSelect(firstOpt);
                                    else handleAddNew();
                                }
                            }}
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <div 
                                    key={opt}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${value === opt ? "bg-primary-500/10 text-primary-400 font-medium" : "text-neutral-300 hover:bg-dark-700 hover:text-white"}`}
                                    onClick={() => handleSelect(opt)}
                                >
                                    {opt}
                                    {value === opt && <Check size={14} />}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-sm text-neutral-500">
                                No results found.
                            </div>
                        )}

                        <div
                            className={`flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm border transition-colors ${
                                search.trim() && !exactMatch
                                    ? "cursor-pointer text-primary-400 bg-primary-500/5 hover:bg-primary-500/10 border-primary-500/10"
                                    : "cursor-not-allowed text-neutral-500 bg-dark-800 border-dark-700"
                            }`}
                            onClick={() => {
                                if (!search.trim() || exactMatch) {
                                    inputRef.current?.focus();
                                    return;
                                }
                                handleAddNew();
                            }}
                        >
                            <Plus size={14} />
                            <span className="font-medium">{addLabel}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
