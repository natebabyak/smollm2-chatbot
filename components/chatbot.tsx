"use client";

import {
  pipeline,
  TextGenerationPipelineType,
} from "@huggingface/transformers";
import { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ArrowUp, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  role: "system" | "user";
  content: string;
}

export function Chatbot() {
  const [model, setModel] = useState<"135M" | "360M" | "1.7B">("135M");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const generator = useRef<TextGenerationPipelineType | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      generator.current = (await pipeline(
        "text-generation",
        "HuggingFaceTB/SmolLM2-135M-Instruct",
      )) as unknown as TextGenerationPipelineType;
    })();
  }, []);

  const handleSubmit = async () => {
    if (!generator.current || !input.trim()) return;
    setLoading(true);

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setInput("");

    const output = await generator.current([...messages, userMessage], {
      max_new_tokens: 128,
    });

    const systemMessage: Message = {
      role: "system",
      content:
        (
          output as {
            generated_text: Message[];
          }[]
        )[0].generated_text.at(-1)?.content ??
        "Something went wrong. Please try again later.",
    };

    setMessages((prev) => [...prev, userMessage, systemMessage]);

    setLoading(false);
  };

  return (
    <main className="flex h-full flex-1 flex-col">
      <ScrollArea className="h-full flex-1 rounded-md border">
        <ul className="flex flex-col gap-2 p-4">
          {messages.slice(1).map((m, i) => (
            <li
              key={i}
              className={cn(
                "flex",
                m.role === "system" ? "justify-start" : "justify-end",
              )}
            >
              <p
                className={cn(
                  "max-w-3/4 px-4 py-2",
                  m.role === "user" && "bg-accent rounded-2xl",
                )}
              >
                {m.content}
              </p>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="px-4"
      >
        <InputGroup className="rounded-full">
          <InputGroupAddon align="inline-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  size="xs"
                  variant="outline"
                  className="rounded-full"
                >
                  <span>{model}</span>
                  <ChevronDown />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top">
                <DropdownMenuItem>
                  <div className="grid">
                    <span className="font-medium">SmolLM2-135M-Instruct</span>
                    <span className="text-muted-foreground text-xs">
                      Fastest
                    </span>
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
          </InputGroupAddon>
          <InputGroupInput
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything"
            value={input}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              type="submit"
              variant="default"
              className="rounded-full"
            >
              <ArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </main>
  );
}
