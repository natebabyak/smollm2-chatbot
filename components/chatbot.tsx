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
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelMenu } from "./model-menu";
import { Spinner } from "./ui/spinner";

interface Message {
  role: "system" | "user";
  content: string;
}

export function Chatbot() {
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
        "HuggingFaceTB/SmolLM2-360M-Instruct",
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
    setMessages((prev) => [...prev, userMessage]);
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

    setMessages((prev) => [...prev, systemMessage]);

    setLoading(false);
  };

  return (
    <>
      <ul className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="px-4"
      >
        <InputGroup className="rounded-full">
          <InputGroupAddon align="inline-start">
            <ModelMenu />
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
              variant={loading ? "secondary" : "default"}
              className="rounded-full"
            >
              <ArrowUp className={cn("scale-100", loading && "scale-0")} />
              <Spinner
                className={cn("absolute scale-0", loading && "scale-100")}
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </>
  );
}
