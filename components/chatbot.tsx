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
} from "@/components/ui/input-group";
import { ArrowUp, Plus, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import TextareaAutosize from "react-textarea-autosize";
import { CopyButton } from "./copy-button";
import Markdown from "react-markdown";
import { ModelMenu } from "./model-menu";

interface Message {
  role: "system" | "user";
  content: string;
}

export const models = ["135M", "360M", "1.7B"] as const;
export type Model = (typeof models)[number];

export function Chatbot() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
  ]);
  const [model, setModel] = useState<Model>("135M");

  const generator = useRef<TextGenerationPipelineType | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      generator.current = (await pipeline(
        "text-generation",
        `HuggingFaceTB/SmolLM2-${model}-Instruct`,
      )) as unknown as TextGenerationPipelineType;
    })();
  }, [model]);

  const handleSubmit = () => {
    if (!generator.current || !input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    generateResponse([...messages, userMessage]);
  };

  const generateResponse = async (currentMessages: Message[]) => {
    if (!generator.current) return;

    setLoading(true);

    const output = await generator.current(currentMessages, {
      max_new_tokens: 128,
    });

    const fullContent =
      (
        output as {
          generated_text: Message[];
        }[]
      )[0].generated_text.at(-1)?.content ??
      "Something went wrong. Please try again later.";

    setMessages((prev) => [...prev, { role: "system", content: "" }]);
    const systemMessageIndex = currentMessages.length;

    const words = fullContent.split(" ");
    let index = 0;

    const interval = setInterval(() => {
      if (index <= words.length) {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[systemMessageIndex] = {
            role: "system",
            content: words.slice(0, index).join(" "),
          };
          return newMessages;
        });
        index++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 50);
  };

  return (
    <div className="flex h-full flex-col">
      <ul className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 overflow-y-auto p-4 px-2 md:px-0">
        {messages.slice(1).map((m, i) => (
          <li key={i} className="flex">
            {m.role === "system" ? (
              <div className="flex flex-col">
                <Markdown>{m.content}</Markdown>
                <CopyButton copyText={m.content} />
              </div>
            ) : (
              <p className="bg-accent ml-auto max-w-1/2 rounded-2xl px-4 py-2">
                {m.content}
              </p>
            )}
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex-none px-2 md:px-0"
      >
        <InputGroup className="mx-auto max-w-3xl rounded-3xl px-1">
          <TextareaAutosize
            data-slot="input-group-control"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                if (e.metaKey || e.ctrlKey) {
                  return;
                }
                e.preventDefault();
                if (!loading && input.trim()) {
                  handleSubmit();
                }
              }
            }}
            placeholder="Ask anything"
            value={input}
            className="flex field-sizing-content min-h-12 w-full resize-none bg-transparent px-3 py-2.5 transition-[color,box-shadow] outline-none"
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton
              disabled
              size="icon-sm"
              variant="outline"
              className="rounded-full"
            >
              <Plus />
            </InputGroupButton>
            <InputGroupButton
              disabled
              size="icon-sm"
              variant="outline"
              className="rounded-full"
            >
              <Settings2 />
            </InputGroupButton>
            <ModelMenu model={model} setModel={setModel} />
            <InputGroupButton
              disabled={loading}
              size="icon-sm"
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
    </div>
  );
}
