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
import { ArrowUp, Bot, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import TextareaAutosize from "react-textarea-autosize";
import { CopyButton } from "./copy-button";
import Markdown from "react-markdown";

interface Message {
  role: "system" | "user";
  content: string;
}

const models = ["135M", "360M", "1.7B"] as const;
type Model = (typeof models)[number];

export function Chatbot() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
  ]);
  const [model, setModel] = useState<Model>("360M");
  const [multi, setMulti] = useState(false);
  const [open, setOpen] = useState(false);

  const generator = useRef<TextGenerationPipelineType | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      generator.current = (await pipeline(
        "text-generation",
        `HuggingFaceTB/SmolLM2-${model}-Instruct`,
      )) as unknown as TextGenerationPipelineType;
    })();
  }, [model]);

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
        className="px-2 md:px-0"
      >
        <InputGroup className="mx-auto max-w-3xl rounded-3xl px-1">
          <InputGroupAddon align={multi ? "block-start" : "inline-start"}>
            <DropdownMenu onOpenChange={setOpen} open={open}>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                >
                  <Bot />
                  <span>{model}</span>
                  <ChevronDown
                    className={cn(
                      "transition-transform",
                      open && "-rotate-180",
                    )}
                  />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top">
                <DropdownMenuLabel>
                  <span className="text-muted-foreground text-xs">Models</span>
                </DropdownMenuLabel>
                {models.map((m, i) => (
                  <DropdownMenuItem
                    disabled={m === "1.7B"}
                    key={i}
                    onClick={() => setModel(m)}
                  >
                    <div className="grid">
                      <span className="font-medium">SmolLM2-{m}-Instruct</span>
                      <span className="text-muted-foreground text-xs">
                        {m === "135M"
                          ? "Fastest"
                          : m === "360M"
                            ? "Balanced"
                            : "Smartest"}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
          <TextareaAutosize
            data-slot="input-group-control"
            onChange={(e) => setInput(e.target.value)}
            onHeightChange={(height) => setMulti(height >= 32)}
            placeholder="Ask anything"
            value={input}
            className="flex field-sizing-content min-h-12 w-full resize-none bg-transparent px-3 py-2.5 transition-[color,box-shadow] outline-none"
          />
          <InputGroupAddon align={multi ? "block-start" : "inline-end"}>
            <InputGroupButton
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
    </>
  );
}
