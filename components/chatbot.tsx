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
import { ArrowUp, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function Chatbot() {
  const [messages, setMessages] = useState<
    {
      role: "system" | "user";
      content: string;
    }[]
  >([
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

    const newMessage: {
      role: "system" | "user";
      content: string;
    } = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, newMessage]);

    setInput("");

    const output = await generator.current([...messages, newMessage], {
      max_new_tokens: 128,
    });

    const content =
      (
        output as {
          generated_text: {
            role: string;
            content: string;
          }[];
        }[]
      )[0].generated_text.at(-1)?.content ??
      "Something went wrong. Please try again later.";

    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        content: content,
      },
    ]);

    setLoading(false);
  };

  return (
    <main className="flex h-full w-full flex-col overflow-y-auto p-4">
      <ScrollArea>
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
                  "max-w-3/4 px-3 py-2",
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
      >
        <InputGroup className="rounded-full">
          <InputGroupAddon align="inline-start">
            <InputGroupButton size="icon-xs" className="rounded-full">
              <Plus />
            </InputGroupButton>
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
