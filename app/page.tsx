import { Button } from "@/components/ui/button";
import { Chatbot } from "@/components/chatbot";
import { Github } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

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
      <Chatbot />
      <footer className="w-full p-2">
        <p className="text-muted-foreground text-center text-xs">
          ChatSLM can make mistakes. Check important info.
        </p>
      </footer>
    </div>
  );
}
