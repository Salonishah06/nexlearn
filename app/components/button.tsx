import type { ButtonHTMLAttributes, ReactNode } from "react";

/*
  Button
  Height: 44px (default) · Padding: 0 16px (lg) / 0 12px (md) · Radius: 12px
  Font: Inter Medium (14–16px)
  Variants: primary · secondary · tertiary · text
*/

type Variant = "primary" | "secondary" | "tertiary" | "text";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium text-body-lg " +
  "transition-colors duration-150 select-none focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  md: "h-11 px-3",
  lg: "h-11 px-4",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-400 disabled:bg-primary-200 disabled:text-white",
  secondary:
    "border border-primary-500 text-primary-500 bg-transparent hover:bg-primary-100 " +
    "disabled:border-primary-200 disabled:text-primary-300",
  tertiary:
    "text-neutral-900 bg-transparent hover:bg-neutral-100 disabled:text-neutral-300",
  text: "px-1 text-primary-500 bg-transparent hover:text-primary-400 disabled:text-primary-300",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "lg",
  iconLeft,
  iconRight,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
