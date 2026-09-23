"use client";

import { useStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

export default function CollectionsPage() {
  const resources = useStore((state) => state.resources);
  
  // Extract unique tags/collections
  const allTags = resources.flatMap(r => r.tags || []);
  const uniqueTags = [...new Set(allTags)];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto w-full pt-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Collections
          </h2>
          <p className="text-muted-foreground mt-1">
            Browse your library by tags and topics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {uniqueTags.map((tag) => {
            const count = resources.filter(r => r.tags?.includes(tag)).length;
            
            return (
              <Link 
                href={`/dashboard/collections/${tag.toLowerCase()}`} 
                key={tag}
              >
                <div className="bg-card border border-border p-5 rounded-xl hover:shadow-sm hover:border-border/80 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary/10 transition-colors">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-lg">{tag}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-12">
                    {count} {count === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
