"use client";

import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";
import type { ApplicationFieldValue, ErpApplicationField } from "@/lib/careers";

const inputClass =
  "w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

export const countries = getCountries()
  .map((code) => ({
    code,
    name: countryNames.of(code) || code,
    callingCode: `+${getCountryCallingCode(code)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function countryCodeFromName(name: string): CountryCode | undefined {
  return countries.find((country) => country.name === name)?.code;
}

export function fieldOptions(field: ErpApplicationField) {
  if (Array.isArray(field.options)) return field.options.filter(Boolean);
  if (typeof field.options === "string") {
    return field.options
      .split(/\r?\n|,/)
      .map((option) => option.trim())
      .filter(Boolean);
  }
  return [];
}

export function ApplicationField({
  field,
  value,
  error,
  onChange,
  country = "India",
}: {
  field: ErpApplicationField;
  value: ApplicationFieldValue | undefined;
  error?: string;
  onChange: (value: ApplicationFieldValue) => void;
  country?: string;
}) {
  const options = fieldOptions(field);
  const stringValue = typeof value === "string" ? value : "";
  const describedBy = field.help_text ? `${field.key}-help` : undefined;

  if (field.type === "File") return null;

  if (field.type === "Checkbox") {
    return (
      <FieldShell field={field} error={error} hideLabel>
        <label className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
            className="mt-1"
            aria-describedby={describedBy}
          />
          <span>
            {field.label}
            {field.required ? " *" : ""}
          </span>
        </label>
      </FieldShell>
    );
  }

  if (field.type === "Multi Select") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <FieldShell field={field} error={error}>
        <div className="grid sm:grid-cols-2 gap-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-sm text-[var(--text-secondary)]"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...selected, option]
                      : selected.filter((item) => item !== option),
                  )
                }
              />
              {option}
            </label>
          ))}
        </div>
      </FieldShell>
    );
  }

  if (field.type === "Yes/No") {
    return (
      <FieldShell field={field} error={error}>
        <div className="grid grid-cols-2 gap-2">
          {["Yes", "No"].map((option) => (
            <label
              key={option}
              className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-colors ${stringValue === option ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"}`}
            >
              <input
                type="radio"
                name={field.key}
                value={option}
                checked={stringValue === option}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      </FieldShell>
    );
  }

  if (field.key === "country") {
    return (
      <FieldShell field={field} error={error}>
        <select
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          aria-describedby={describedBy}
          autoComplete="country-name"
        >
          <option value="">Select a country</option>
          {countries.map((countryOption) => (
            <option key={countryOption.code} value={countryOption.name}>
              {countryOption.name}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  }

  if (field.type === "Select") {
    return (
      <FieldShell field={field} error={error}>
        <select
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          aria-describedby={describedBy}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  }

  if (field.type === "Long Text") {
    return (
      <FieldShell field={field} error={error}>
        <textarea
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          rows={6}
          className={`${inputClass} resize-none`}
          aria-describedby={describedBy}
        />
      </FieldShell>
    );
  }

  const inputType =
    {
      Email: "email",
      Phone: "tel",
      Number: "number",
      Date: "date",
      URL: "url",
      Text: "text",
    }[field.type] || "text";

  if (field.key === "phone_number" || field.type === "Phone") {
    const countryCode = countryCodeFromName(country) || "IN";
    const callingCode = `+${getCountryCallingCode(countryCode)}`;

    return (
      <FieldShell field={field} error={error}>
        <div className="flex overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] focus-within:border-amber-500">
          <span className="flex items-center border-r border-[var(--border-primary)] px-4 text-[var(--text-secondary)]">
            {callingCode}
          </span>
          <input
            type="tel"
            inputMode="tel"
            value={stringValue}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[var(--text-primary)] focus:outline-none"
            aria-describedby={describedBy}
            autoComplete="tel-national"
            placeholder="Phone number"
          />
        </div>
      </FieldShell>
    );
  }

  return (
    <FieldShell field={field} error={error}>
      <input
        type={inputType}
        value={stringValue}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        aria-describedby={describedBy}
        autoComplete={field.type === "Email" ? "email" : undefined}
      />
    </FieldShell>
  );
}

function FieldShell({
  field,
  error,
  hideLabel = false,
  children,
}: {
  field: ErpApplicationField;
  error?: string;
  hideLabel?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      {!hideLabel && (
        <label className="text-sm text-[var(--text-muted)] mb-2 block">
          {field.label}
          {field.required ? " *" : ""}
        </label>
      )}
      {children}
      {field.help_text && (
        <p
          id={`${field.key}-help`}
          className="mt-2 text-xs text-[var(--text-muted)]"
        >
          {field.help_text}
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
