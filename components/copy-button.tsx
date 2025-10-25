"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface CopyButtonProps {
  copyText: string;
}

export function CopyButton({ copyText }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleClick}
          size="icon-sm"
          variant="ghost"
          className="relative"
        >
          <Copy
            className={cn(
              "scale-100 transition-transform",
              copied && "scale-0",
            )}
          />
          <Check
            className={cn(
              "absolute scale-0 transition-transform",
              copied && "scale-100",
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Copy</p>
      </TooltipContent>
    </Tooltip>
  );
}
