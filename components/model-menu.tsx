"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Model } from "@/components/chatbot";

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
        <DropdownMenuItem onClick={() => setModel("135M")}>
          <div className="grid">
            <span className="font-medium">SmolLM2-135M-Instruct</span>
            <span className="text-muted-foreground text-xs">Fastest</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setModel("360M")}>
          <div className="grid">
            <span className="font-medium">SmolLM2-360M-Instruct</span>
            <span className="text-muted-foreground text-xs">Balanced</span>
          </div>
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="grid">
                <span className="font-medium">SmolLM2-1.7B-Instruct</span>
                <span className="text-muted-foreground text-xs">Smartest</span>
              </div>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This model (SmolLM2-1.7B-Instruct) may not work as expected on
                your device.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setModel("1.7B");
                  setOpen(false);
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
