"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Keyboard, Trophy, Home } from "lucide-react";
import { cn } from "../../lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/challenges", label: "Challenges", icon: Keyboard },
  { href: "/scoreboard", label: "Scoreboard", icon: Trophy },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Keyboard className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              TypeRacer Office
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            <div className="ml-2 pl-2 border-l border-border">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
