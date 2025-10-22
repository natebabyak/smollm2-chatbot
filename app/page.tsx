"use client";

import {
  pipeline,
  TextGenerationPipelineType,
} from "@huggingface/transformers";
import { useEffect, useRef } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ArrowUp, Moon, Plus, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github } from "@/components/icons/github";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme, theme } = useTheme();

  const generator = useRef<TextGenerationPipelineType | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      generator.current = (await pipeline(
        "text-generation",
        "HuggingFaceTB/SmolLM2-1.7B-Instruct",
      )) as unknown as TextGenerationPipelineType;
    })();
  }, []);

  return (
    <>
      <header className="w-full p-4 backdrop-blur-md">
        <div className="flex justify-between">
          <Button asChild variant="ghost">
            <Link href="/">
              <span className="text-lg font-extralight">smollm2-chatbot</span>
            </Link>
          </Button>
          <div className="flex">
            <Button
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
              }}
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <Sun className="scale-100 rotate-0 !transition-transform dark:scale-0 dark:rotate-90" />
              <Moon className="absolute scale-0 rotate-90 !transition-transform dark:scale-100 dark:rotate-0" />
            </Button>
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
      <main>
        main text area
        <InputGroup className="rounded-full">
          <InputGroupAddon align="inline-start">
            <InputGroupButton size="icon-xs" className="rounded-full">
              <Plus />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupInput placeholder="Ask anything" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              variant="default"
              className="rounded-full"
            >
              <ArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </main>
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
    </>
  );
}
