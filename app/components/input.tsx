import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { SearchIcon, ChevronDownIcon } from "./icons";

/*
  Inputs
  Height: 44px · Radius: 12px · Border: 1px solid #E2E8F0
  Padding: 0 16px · Focus: border color #FB923C
*/

const fieldBase =
  "h-11 w-full rounded-md border border-border bg-surface text-body-lg text-neutral-900 " +
  "placeholder:text-neutral-500 transition-colors outline-none " +
  "focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30";

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  shortcut?: string;
}

export function SearchInput({
  className = "",
  shortcut = "⌘ K",
  placeholder = "Search anything…",
  ...props
}: SearchInputProps) {
  return (
    <div className="relative">
      <SearchIcon
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
      />
      <input
        type="search"
        placeholder={placeholder}
        className={`${fieldBase} pl-11 pr-16 ${className}`}
        {...props}
      />
      {shortcut ? (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xs border border-border bg-neutral-100 px-1.5 py-0.5 text-small font-medium text-neutral-500">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

export function Select({ className = "", options, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={`${fieldBase} appearance-none px-4 pr-11 ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        size={18}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
      />
    </div>
  );
}
