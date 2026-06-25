"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Theme } from "../../lib/theme";

const options: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: "light", icon: <Sun className="w-4 h-4" />, label: "Light" },
  { value: "dark", icon: <Moon className="w-4 h-4" />, label: "Dark" },
  { value: "system", icon: <Monitor className="w-4 h-4" />, label: "System" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-colors ${theme === opt.value
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
            }`}
          title={opt.label}
        >
          {theme === opt.value && (
            <motion.div
              layoutId="theme-toggle-bg"
              className="absolute inset-0 bg-background rounded-md shadow-sm border border-border"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{opt.icon}</span>
        </button>
      ))}
    </div>
  );
}
