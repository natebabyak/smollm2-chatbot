"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroupButton } from "@/components/ui/input-group";
import { useState } from "react";

const models = ["135M", "360M", "1.7B"] as const;
type Model = (typeof models)[number];

export function ModelMenu() {
  const [model, setModel] = useState<Model>("360M");
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <InputGroupButton variant="outline" className="group rounded-full">
          {model}
          <ChevronDown
            className={cn("transition-transform", open && "-rotate-180")}
          />
        </InputGroupButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top">
        {models.map((m, i) => (
          <DropdownMenuItem key={i} onClick={() => setModel(m)}>
            <div className="grid">
              <span className="font-medium">SmolLM2-{m}-Instruct</span>
              <span className="text-muted-foreground text-xs">
                {m === "135M"
                  ? "Fastest"
                  : m === "360M"
                    ? "Balanced"
                    : "Smartest"}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
