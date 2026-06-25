export type Theme = "light" | "dark" | "system";

export const themes: Record<Theme, Record<string, string>> = {
  light: {
    "--background": "#ffffff",
    "--foreground": "#171717",
    "--card": "#ffffff",
    "--card-foreground": "#171717",
    "--primary": "#2563eb",
    "--primary-foreground": "#ffffff",
    "--secondary": "#f3f4f6",
    "--secondary-foreground": "#1f2937",
    "--muted": "#f3f4f6",
    "--muted-foreground": "#6b7280",
    "--accent": "#f3f4f6",
    "--accent-foreground": "#1f2937",
    "--destructive": "#dc2626",
    "--destructive-foreground": "#ffffff",
    "--border": "#e5e7eb",
    "--input": "#e5e7eb",
    "--ring": "#2563eb",
    "--success": "#16a34a",
    "--warning": "#f59e0b",
  },
  dark: {
    "--background": "#0a0a0a",
    "--foreground": "#ededed",
    "--card": "#1a1a1a",
    "--card-foreground": "#ededed",
    "--primary": "#3b82f6",
    "--primary-foreground": "#ffffff",
    "--secondary": "#262626",
    "--secondary-foreground": "#f3f4f6",
    "--muted": "#262626",
    "--muted-foreground": "#9ca3af",
    "--accent": "#262626",
    "--accent-foreground": "#f3f4f6",
    "--destructive": "#ef4444",
    "--destructive-foreground": "#ffffff",
    "--border": "#333333",
    "--input": "#333333",
    "--ring": "#3b82f6",
    "--success": "#22c55e",
    "--warning": "#fbbf24",
  },
  system: {},
};

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
