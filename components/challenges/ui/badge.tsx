"use client";

import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          "bg-[var(--secondary)] text-[var(--secondary-foreground)]": variant === "default",
          "bg-[var(--success)]/15 text-[var(--success)]": variant === "success",
          "bg-[var(--warning)]/15 text-[var(--warning)]": variant === "warning",
          "bg-[var(--destructive)]/15 text-[var(--destructive)]": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
}
