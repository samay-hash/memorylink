"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Resource } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Link2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SaveLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  "Fetching page content",
  "Reading content & context",
  "Extracting useful metadata",
  "Generating smart summary",
  "Saving knowledge to library",
];

export function SaveLinkModal({ open, onOpenChange }: SaveLinkModalProps) {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const addResource = useStore((state) => state.addResource);

  // Animate steps while the real API is running
  const stepInterval = Math.floor(3500 / steps.length); // distribute across ~3.5s

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError("");
    setIsProcessing(true);
    setCurrentStep(0);

    // Step animation ticker
    let step = 0;
    const ticker = setInterval(() => {
      step += 1;
      if (step < steps.length) setCurrentStep(step);
    }, stepInterval);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), note }),
      });

      clearInterval(ticker);
      setCurrentStep(steps.length);

      if (!res.ok) {
        let errorMessage = "Failed to save link";
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {
          errorMessage = `Server Error (${res.status}). The request took too long.`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      // Add to local Zustand store so dashboard updates immediately
      addResource({
        id: data.link.id,
        type: data.link.type as Resource["type"],
        url: data.link.url,
        title: data.link.title,
        description: data.link.description,
        domain: data.link.domain,
        favicon: data.link.favicon,
        savedAt: data.link.savedAt,
        tldr: data.link.tldr,
        tags: data.link.tags,
        status: "live",
        userNote: data.link.userNote,
        isFavorite: false,
        // article specific defaults
        ...(data.link.type === "article" && { author: "Unknown", readingTime: "~5 min" }),
      } as Resource);

      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setTimeout(() => {
          setUrl("");
          setNote("");
          setCurrentStep(0);
          setIsSuccess(false);
        }, 300);
      }, 1500);
    } catch (err: unknown) {
      clearInterval(ticker);
      setIsProcessing(false);
      setCurrentStep(0);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isProcessing && onOpenChange(val)}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-border/60 shadow-lg rounded-2xl">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold tracking-tight">Save something useful.</DialogTitle>
          </DialogHeader>

          {!isProcessing && !isSuccess && (
            <form onSubmit={handleSave} className="space-y-4 mt-2">
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70" />
                <Input
                  autoFocus
                  placeholder="Paste a URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9 h-10 bg-muted/30 border-border/60 focus-visible:ring-ring focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                />
              </div>
              <div className="relative">
                <Input
                  placeholder="Add a note (optional)..."
              value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="h-10 bg-muted/30 border-border/60 focus-visible:ring-ring focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                />
              </div>
              {error && (
                <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">{error}</p>
              )}
              <Button type="submit" disabled={!url.trim() || isProcessing} className="w-full h-10 mt-2 font-medium rounded-full">
                Save Link
              </Button>
            </form>
          )}

          <AnimatePresence mode="wait">
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-4 space-y-3"
              >
                {steps.map((step, index) => {
                  const isPast = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isFuture = index > currentStep;

                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                        isFuture ? "opacity-30" : "opacity-100"
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        {isPast ? (
                          <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>
                      <span
                        className={`${
                          isPast ? "text-foreground font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {step}...
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center justify-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Check className="w-6 h-6 text-primary" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">Saved successfully.</h3>
                <p className="text-sm text-muted-foreground">
                  The knowledge card is ready.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
