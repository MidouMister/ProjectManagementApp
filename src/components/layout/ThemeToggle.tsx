"use client";

import { useTheme } from "next-themes";
import { MoonStar, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 opacity-50">
        <div className="w-4 h-4 rounded-full bg-border" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9 rounded-full relative group hover:bg-muted"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.15rem] w-[1.15rem] scale-100 dark:scale-0 transition-transform duration-300 text-foreground" />
      <MoonStar className="absolute h-[1.15rem] w-[1.15rem] scale-0 dark:scale-100 transition-transform duration-300 text-foreground" />
      <span className="sr-only">Changer le thème</span>
    </Button>
  );
}
