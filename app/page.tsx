import { Button } from "@/components/ui/button";
import { Chatbot } from "@/components/chatbot";
import { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChevronsUpDown, Github } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const metadata: Metadata = {
  title: "ChatSLM2",
  description: "A chatbot built using HuggingFaceTB's SmolLM2 collection",
};

export default function Home() {
  return (
    <div>
      <header className="w-full p-4 backdrop-blur-md">
        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="group">
                <span className="text-lg font-extralight">ChatSLM</span>
                <ChevronsUpDown className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom">
              <DropdownMenuItem>
                <div className="grid">
                  <span className="font-medium">SmolLM2-135M-Instruct</span>
                  <span className="text-muted-foreground text-xs">Fastest</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="grid">
                  <span className="font-medium">SmolLM2-360M-Instruct</span>
                  <span className="text-muted-foreground text-xs">
                    Balanced
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="grid">
                  <span className="font-medium">SmolLM2-1.7B-Instruct</span>
                  <span className="text-muted-foreground text-xs">
                    Smartest
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex">
            <ThemeToggle />
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <a
                href="https://github.com/natebabyak/smollm2-chatbot"
                target="_blank"
              >
                <Github />
              </a>
            </Button>
          </div>
        </div>
      </header>
      <Chatbot />
      <footer className="w-full">
        <p className="text-muted-foreground text-center text-xs">
          Built with{" "}
          <a
            href="https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct"
            className="underline-offset-4 hover:underline"
          >
            HuggingFaceTB/SmolLM2-1.7B-Instruct
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
