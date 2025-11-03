"use client";

import { Bot, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroupButton } from "@/components/ui/input-group";
import { useState } from "react";
import { Model, models } from "@/components/chatbot";

interface ModelMenuProps {
  model: string;
  setModel: (model: Model) => void;
}

export function ModelMenu({ model, setModel }: ModelMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <InputGroupButton
          size="sm"
          variant="ghost"
          className="ml-auto rounded-full"
        >
          <Bot />
          <span>SmolLM2-{model}-Instruct</span>
          <ChevronDown
            className={cn("transition-transform", open && "-rotate-180")}
          />
        </InputGroupButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top">
        <DropdownMenuLabel>
          <span className="text-muted-foreground text-xs">Models</span>
        </DropdownMenuLabel>
        {models.map((m, i) => (
          <DropdownMenuItem
            disabled={m === "1.7B"}
            key={i}
            onClick={() => setModel(m)}
          >
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
