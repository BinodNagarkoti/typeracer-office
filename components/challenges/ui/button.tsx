"use client";

import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 focus-visible:ring-[var(--ring)]":
            variant === "primary",
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--accent)] focus-visible:ring-[var(--ring)]":
            variant === "secondary",
          "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]":
            variant === "ghost",
        },
        {
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4 text-sm": size === "md",
          "h-12 px-6 text-base": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
