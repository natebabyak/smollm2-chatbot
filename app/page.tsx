import { Button } from "@/components/ui/button";
import { Chatbot } from "@/components/chatbot";
import { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import { Github } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ChatSLM",
  description: "An AI chatbot built using SmolLM2",
};

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <header className="p-4">
        <div className="flex justify-between">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/">
              <span className="text-lg font-extralight">ChatSLM</span>
            </Link>
          </Button>
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
      <div className="flex-1">
        <Chatbot />
      </div>
      <footer className="w-full p-2">
        <p className="text-muted-foreground text-center text-xs">
          ChatSLM can make mistakes. Check important info.
        </p>
      </footer>
    </div>
  );
}
