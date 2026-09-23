"use client";

import { useStore } from "@/lib/store";
import { KnowledgeCard } from "@/components/cards/KnowledgeCard";
import { AppShell } from "@/components/layout/AppShell";

export default function RecentPage() {
  const resources = useStore((state) => state.resources);
  const recentResources = [...resources].sort((a, b) =>
    new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto w-full">
        <div className="py-8 border-b border-border/50">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground/50 mb-1.5">Library</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Recently Added</h1>
          <p className="text-[13px] text-muted-foreground mt-1.5">Sorted by save date, newest first</p>
        </div>
        <div className="py-4">
          {recentResources.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-muted-foreground">Nothing saved yet.</p>
            </div>
          ) : (
            <div>
              {recentResources.map((resource) => (
                <KnowledgeCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
