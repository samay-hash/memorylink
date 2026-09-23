"use client";

import { Bell, Search, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const resources = useStore(state => state.resources);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredResources = searchQuery.trim() === ""
    ? []
    : resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8);

  return (
    <header className="h-14 px-8 flex items-center justify-between shrink-0 border-b border-border/40 bg-[#FAFAF8]">
      <div className="flex flex-col">
        <span className="text-[11px] text-muted-foreground/60 uppercase tracking-[0.12em] font-medium">
          Your Library
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Dialog open={searchOpen} onOpenChange={(open) => { setSearchOpen(open); if (!open) setSearchQuery(""); }}>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 h-8 px-3 rounded-md border border-border/60 bg-white text-[12px] text-muted-foreground hover:text-foreground hover:border-border transition-all md:w-52 lg:w-64 relative"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-muted-foreground/60 border border-border/50 rounded px-1 py-0.5 bg-muted/50 font-mono">
              ⌘K
            </kbd>
          </button>
          <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden rounded-xl border-border/60 shadow-xl" showCloseButton={false}>
            <div className="flex items-center border-b border-border/60 px-4">
              <Search className="mr-3 h-4 w-4 shrink-0 text-muted-foreground/60" />
              <Input
                placeholder="Search your saved knowledge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 border-none shadow-none focus-visible:ring-0"
                autoFocus
              />
            </div>

            <div className="max-h-[380px] overflow-y-auto">
              {searchQuery.trim() === "" ? (
                <div className="py-10 text-center">
                  <p className="text-[12px] text-muted-foreground/60 uppercase tracking-wider">Start typing to search</p>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">No results for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="p-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 px-3 py-2">Results</p>
                  {filteredResources.map((resource, i) => (
                    <Link href={`/links/${resource.id}`} key={resource.id} onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 cursor-pointer transition-colors group">
                        <div className="w-7 h-7 rounded-md border border-border/60 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                          {resource.favicon ? (
                            <img src={resource.favicon} className="w-4 h-4 object-contain" alt="" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5 text-muted-foreground/60" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-foreground truncate leading-tight">{resource.title}</p>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{resource.domain}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center text-[10px] font-bold text-background tracking-wide">
          SS
        </div>
      </div>
    </header>
  );
}
