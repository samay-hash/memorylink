"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useStore } from "@/lib/store";
import { Compass, Folder } from "lucide-react";
import Link from "next/link";

export default function DiscoverPage() {
  const resources = useStore((state) => state.resources);

  // Build topic clusters from tags
  const tagMap: Record<string, typeof resources> = {};
  resources.forEach((r) => {
    r.tags?.forEach((tag) => {
      if (!tagMap[tag]) tagMap[tag] = [];
      tagMap[tag].push(r);
    });
  });

  const clusters = Object.entries(tagMap)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 12);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto w-full pt-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Compass className="w-4.5 h-4.5 text-slate-600" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-800">Smart Folders</h2>
            <p className="text-[13px] text-muted-foreground">AI automatically organizes your links by context</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {clusters.map(([tag, items]) => (
            <Link href={`/dashboard/collections/${encodeURIComponent(tag)}`} key={tag}>
              <div className="bg-white border border-border/40 rounded-2xl p-5 hover:shadow-sm hover:border-border/60 transition-all group cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                    <Folder className="w-4.5 h-4.5 text-blue-500 fill-blue-500/20" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-slate-800 truncate capitalize">{tag}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Smart Folder</p>
                  </div>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {items.length} saved {items.length === 1 ? "item" : "items"}
                </p>
                <div className="mt-3 space-y-1">
                  {items.slice(0, 2).map((r) => (
                    <p key={r.id} className="text-[11px] text-slate-500 truncate">
                      · {r.title}
                    </p>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {clusters.length === 0 && (
          <div className="text-center py-20 text-muted-foreground text-sm">
            Save some links first to discover your topics.
          </div>
        )}
      </div>
    </AppShell>
  );
}
