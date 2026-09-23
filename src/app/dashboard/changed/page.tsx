"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useStore } from "@/lib/store";
import { Brain, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ChangedPagesPage() {
  const resources = useStore((state) => state.resources);
  const changedResources = resources.filter((r) => r.status === "changed");

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto w-full pt-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Brain className="w-4.5 h-4.5 text-amber-600" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-800">Changed Pages</h2>
            <p className="text-[13px] text-muted-foreground">
              {changedResources.length} pages have changed since you last visited
            </p>
          </div>
        </div>

        {changedResources.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-muted-foreground">No changed pages detected yet.</p>
            <p className="text-[12px] text-muted-foreground mt-1">
              We monitor your saved links and notify you here when content changes.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {changedResources.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-amber-200/60 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-amber-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Changed
                    </span>
                    <span className="text-[11px] text-muted-foreground">{r.domain}</span>
                  </div>
                  <h3 className="font-medium text-sm text-slate-800 truncate">{r.title}</h3>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    Saved {format(new Date(r.savedAt), "MMM d, yyyy")}
                  </p>
                </div>
                <Link href={r.url} target="_blank" rel="noopener noreferrer">
                  <button className="shrink-0 w-8 h-8 rounded-xl bg-slate-50 border border-border/40 flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
