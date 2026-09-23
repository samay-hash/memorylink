"use client";

import { Resource } from "@/lib/mock-data";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";

interface KnowledgeCardProps {
  resource: Resource;
}

export function KnowledgeCard({ resource }: KnowledgeCardProps) {
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const savedDate = format(new Date(resource.savedAt), "MMM d, yyyy");

  const typeLabel: Record<string, string> = {
    github: "Github",
    article: "Article",
    youtube: "Video",
    paper: "Paper",
    tool: "Tool",
    documentation: "Docs",
    tweet: "Tweet",
    podcast: "Podcast",
    video: "Video",
    other: "Link",
  };

  return (
    <Link href={`/links/${resource.id}`}>
      <div className="group flex items-start gap-3 py-3.5 px-1 border-b border-border/50 hover:bg-foreground/[0.02] transition-colors cursor-pointer">
        {/* Favicon */}
        <div className="w-6 h-6 rounded border border-border/60 bg-white flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
          {resource.favicon ? (
            <img src={resource.favicon} alt="" className="w-4 h-4 object-contain" />
          ) : (
            <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-medium text-foreground leading-snug line-clamp-1 group-hover:text-foreground/80 transition-colors">
                {resource.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground/70">
                <span>{resource.domain}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="uppercase text-[10px] tracking-wide">{typeLabel[resource.type] || "Link"}</span>
                <span className="text-muted-foreground/30">·</span>
                <span>{savedDate}</span>
              </div>

              {resource.tldr && (
                <p className="text-[12px] text-muted-foreground/70 leading-relaxed line-clamp-2 mt-1.5">
                  {resource.tldr}
                </p>
              )}

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {resource.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-muted-foreground/60 uppercase tracking-wide"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(resource.id); }}
                className={`text-[12px] p-1 rounded transition-colors ${resource.isFavorite ? 'text-rose-500' : 'text-muted-foreground/40 hover:text-foreground'}`}
              >
                {resource.isFavorite ? "♥" : "♡"}
              </button>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
