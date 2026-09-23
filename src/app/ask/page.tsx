"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Search, Sparkles, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const suggestedQuestions = [
  "What have I saved about AI agents?",
  "Compare the tools I've bookmarked.",
  "What are key findings from my research papers?",
  "Summarize what I know about RAG systems.",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function AskLibrary() {
  const resources = useStore((state) => state.resources);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add streaming assistant message placeholder
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", isStreaming: true },
    ]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, links: resources }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                fullContent += parsed.text;
                // Update the streaming message
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: fullContent,
                    isStreaming: true,
                  };
                  return updated;
                });
              } catch {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Mark streaming as done
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: fullContent,
          isStreaming: false,
        };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          isStreaming: false,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto w-full flex flex-col h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="pt-8 pb-6 text-center shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800 mb-1">
            Ask your library
          </h1>
          <p className="text-[13px] text-muted-foreground">
            {resources.length} resources · Powered by Groq AI
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          <AnimatePresence initial={false}>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-2 justify-center pt-4"
              >
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleAsk(q)}
                    className="text-[13px] text-slate-600 bg-white border border-border/40 rounded-full px-4 py-2 hover:bg-slate-50 hover:border-border/60 transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-medium mt-0.5 ${
                    msg.role === "user"
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-slate-800 text-white rounded-tr-sm"
                      : "bg-white border border-border/40 text-slate-700 rounded-tl-sm shadow-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-slate max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                      {msg.isStreaming && (
                        <span className="inline-block w-1 h-4 bg-slate-400 animate-pulse ml-0.5 align-middle" />
                      )}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 pb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(input);
            }}
            className="flex gap-2 bg-white border border-border/40 rounded-2xl p-2 shadow-sm focus-within:border-border/60 transition-colors"
          >
            <Search className="w-4 h-4 text-muted-foreground self-center ml-2 shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your saved knowledge..."
              className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-muted-foreground/60 text-slate-800"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading}
              className="h-8 w-8 p-0 rounded-xl"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
