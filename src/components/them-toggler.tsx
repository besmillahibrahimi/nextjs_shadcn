"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "./ui/switch";

type Props = {
  useSwitch?: boolean;
};
export function ThemeToggle({ useSwitch }: Readonly<Props>) {
  const { setTheme } = useTheme();

  return useSwitch ? (
    <div className="flex items-center space-x-2">
      <Switch
        id="theme-toggle"
        className="data-[state=checked]:bg-transparent"
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      >
        <Sun className="dark:invisible visible h-[1.2rem] w-[1.2rem]" />
        <Moon className="invisible dark:visible h-[1.2rem] w-[1.2rem]" />
      </Switch>
    </div>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
