"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
      className="rounded-full"
    >
      <Sun className="scale-100 rotate-0 !transition-transform dark:scale-0 dark:rotate-90" />
      <Moon className="absolute scale-0 rotate-90 !transition-transform dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
