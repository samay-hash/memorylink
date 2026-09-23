"use client";

import { useStore } from "@/lib/store";
import { KnowledgeCard } from "@/components/cards/KnowledgeCard";
import { AppShell } from "@/components/layout/AppShell";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CollectionTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = use(params);
  const decodedTag = decodeURIComponent(tag);
  
  const resources = useStore((state) => state.resources);
  const filteredResources = resources.filter(r => 
    r.tags?.map(t => t.toLowerCase()).includes(decodedTag.toLowerCase())
  );

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto w-full pt-6">
        <Link 
          href="/dashboard/collections" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to collections
        </Link>
        
        <div className="mb-8 flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground capitalize">
            {decodedTag}
          </h2>
          <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full">
            {filteredResources.length}
          </span>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No items found in this collection.
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="break-inside-avoid">
                <KnowledgeCard resource={resource} />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
