"use client";

import { use } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useStore } from "@/lib/store";
import { ArrowLeft, ExternalLink, Heart, MoreHorizontal, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function ResourceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const resources = useStore((state) => state.resources);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const updateResource = useStore((state) => state.updateResource);
  const resource = resources.find((r) => r.id === id);

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  if (!resource) {
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto w-full pt-20 text-center text-muted-foreground">
          Link not found.
        </div>
      </AppShell>
    );
  }
  const savedDate = format(new Date(resource.savedAt), "MMMM d, yyyy");

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto w-full pt-6">
        {/* Top Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium text-muted-foreground">
              {resource.favicon && (
                <img src={resource.favicon} alt="" className="w-3.5 h-3.5 rounded-sm object-cover" />
              )}
              {resource.domain}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs text-muted-foreground"
              onClick={() => window.open(resource.url, "_blank", "noopener,noreferrer")}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-2" />
              Open original
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 transition-colors ${resource.isFavorite ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-muted-foreground'}`}
              onClick={() => toggleFavorite(resource.id)}
            >
              <Heart className="w-4 h-4" fill={resource.isFavorite ? "currentColor" : "none"} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* LEFT: Metadata */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-3">Dates</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Saved on</span>
                  <span className="text-foreground">{savedDate}</span>
                </div>
                {resource.publishedAt && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Published</span>
                    <span className="text-foreground">{format(new Date(resource.publishedAt), "MMM d, yyyy")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border/40 pt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-secondary/60 text-foreground/70 font-medium text-[10px] rounded-md px-2 py-0.5 shadow-none border-none">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t border-border/40 pt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-3">Status</h3>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <div className={`w-2 h-2 rounded-full ${resource.status === 'live' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="capitalize">{resource.status}</span>
              </div>
              {resource.status === 'changed' && (
                <p className="text-xs text-muted-foreground mt-2">Some information changed since you saved this.</p>
              )}
            </div>
          </div>

          {/* CENTER: Main Info */}
          <div className="md:col-span-6 space-y-8">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight leading-tight text-foreground mb-4">
                {resource.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {resource.description}
              </p>
            </div>

            <div className="p-5 bg-secondary/30 rounded-xl border border-border/40 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <SparkleIcon />
                <h3 className="text-sm font-semibold text-foreground">AI Summary</h3>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {resource.tldr}
              </p>
            </div>


          </div>

          {/* RIGHT: Notes & Actions */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-card rounded-xl border border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Why I saved this</h3>
                {resource.userNote && !isEditingNote && (
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-muted-foreground" onClick={() => { setNoteDraft(resource.userNote || ""); setIsEditingNote(true); }}>Edit</Button>
                )}
              </div>
              
              {isEditingNote ? (
                <div className="space-y-2">
                  <Textarea 
                    value={noteDraft} 
                    onChange={(e) => setNoteDraft(e.target.value)}
                    className="min-h-[80px] text-sm resize-none bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-ring"
                    placeholder="Add your note here..."
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsEditingNote(false)}>Cancel</Button>
                    <Button size="sm" className="h-7 text-xs" onClick={() => { updateResource(resource.id, { userNote: noteDraft }); setIsEditingNote(false); }}>Save</Button>
                  </div>
                </div>
              ) : resource.userNote ? (
                <p className="text-sm text-foreground italic whitespace-pre-wrap">"{resource.userNote}"</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">No note added.</p>
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => setIsEditingNote(true)}>Add note</Button>
                </div>
              )}
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3">Related Saved Links</h3>
              <div className="space-y-3">
                {resources.filter(r => r.id !== id).slice(0, 2).map(r => (
                  <Link href={`/links/${r.id}`} key={r.id}>
                    <div className="p-3 bg-secondary/30 rounded-lg text-sm group cursor-pointer hover:bg-secondary/50 transition-colors mb-2">
                      <div className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">{r.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{r.domain}</div>
                    </div>
                  </Link>
                ))}
                {resources.length <= 1 && (
                  <div className="text-xs text-muted-foreground italic">No other links saved yet.</div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </AppShell>
  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
  )
}
