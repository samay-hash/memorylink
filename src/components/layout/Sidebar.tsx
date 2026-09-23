"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Hash, Settings, User } from "lucide-react";
import { SaveLinkModal } from "@/components/SaveLinkModal";
import { useStore } from "@/lib/store";

const navItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "All Links", href: "/dashboard/links" },
  { name: "Favorites", href: "/dashboard/favorites" },
  { name: "Recently Added", href: "/dashboard/recent" },
];

const intelligenceItems = [
  { name: "Ask My Links", href: "/ask" },
  { name: "Discover", href: "/dashboard/discover" },
  { name: "Changed Pages", href: "/dashboard/changed" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const resources = useStore((state) => state.resources);

  return (
    <aside className="w-56 border-r border-border/50 bg-[#FAFAF8] flex flex-col h-screen overflow-y-auto shrink-0">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="font-bold text-[13px] tracking-widest text-foreground uppercase">
            RECALL
          </Link>
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors border border-border/60 px-2.5 py-1 rounded-md hover:border-border"
          >
            + Save
          </button>
        </div>
        {/* Count badge */}
        <div className="text-[11px] text-muted-foreground/70">
          {resources.length} saved {resources.length === 1 ? "resource" : "resources"}
        </div>
      </div>

      <SaveLinkModal open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen} />

      <div className="flex-1 overflow-y-auto py-4">
        {/* Main Nav */}
        <div className="px-3 mb-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 px-2 mb-1.5">Library</p>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-2 py-1.5 rounded-md text-[12px] transition-all duration-150 group",
                    isActive
                      ? "bg-foreground/8 text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  <span>{item.name}</span>
                  {isActive && <span className="text-muted-foreground/50 text-[10px]">→</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Intelligence */}
        <div className="px-3 mb-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 px-2 mb-1.5">Intelligence</p>
          <div className="space-y-0.5">
            {intelligenceItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-2 py-1.5 rounded-md text-[12px] transition-all duration-150",
                    isActive
                      ? "bg-foreground/8 text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  <span>{item.name}</span>
                  {isActive && <span className="text-muted-foreground/50 text-[10px]">→</span>}
                </Link>
              );
            })}
          </div>
        </div>


      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border/40">
        <div className="space-y-0.5">
          <Link href="/settings" className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">
            <Settings className="w-3 h-3" strokeWidth={1.5} />
            Settings
          </Link>
          <Link href="/account" className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">
            <User className="w-3 h-3" strokeWidth={1.5} />
            Account
          </Link>
        </div>
      </div>
    </aside>
  );
}
