import type { ReactNode } from "react";

/*
  Badges / Tags
  Uppercase, small (12px), tracked. Variants: video · lesson · popular
*/

type BadgeVariant = "video" | "lesson" | "popular";

const variants: Record<BadgeVariant, string> = {
  video: "bg-primary-100 text-primary-500 border border-transparent",
  lesson: "bg-neutral-100 text-neutral-700 border border-transparent",
  popular: "bg-transparent text-primary-500 border border-primary-300",
};

export function Badge({
  variant = "video",
  children,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-xs px-2 py-0.5 text-small font-semibold uppercase tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
