import { Button } from "@/components/ui/button";
import { Chatbot } from "@/components/chatbot";
import { Github } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="p-4">
        <div className="flex flex-none justify-between">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/">
              <span className="text-lg font-extralight">ChatSLM</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
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
            <div className="h-4">
              <Separator orientation="vertical" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <Chatbot />
      </div>
      <footer className="w-full flex-none p-2">
        <p className="text-muted-foreground text-center text-xs">
          ChatSLM can make mistakes. Check important info.
        </p>
      </footer>
    </div>
  );
}
