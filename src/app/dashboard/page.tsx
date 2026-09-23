"use client";

import { useStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { VT323 } from "next/font/google";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
});

export default function Dashboard() {
  const resources = useStore((state) => state.resources);
  const allTags = [...new Set(resources.flatMap((r) => r.tags || []))];
  
  // Calculate resources per tag for the "Library Structure" grid
  const tagCounts: Record<string, number> = {};
  resources.forEach(r => {
    r.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topCollections = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name, count], index) => ({ 
      name, 
      count, 
      index: String(index + 1).padStart(2, '0'),
      href: `/dashboard/collections/${encodeURIComponent(name)}` 
    }));

  const latestResource = resources.length > 0 
    ? [...resources].sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())[0]
    : null;

  return (
    <AppShell>
      <div className="max-w-[1200px] mx-auto w-full pt-4 pb-16 px-4">
        
        {/* Top Banner Box */}
        <div className="w-full bg-white border border-border/50 rounded-xl p-3 flex items-center justify-between shadow-sm mb-12">
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground ml-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Track your memory.
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <Link href="/dashboard/recent" className="px-3 py-1.5 border border-border/50 rounded-md hover:bg-muted/30 transition-colors text-foreground font-medium">
              View latest
            </Link>
            <span className="text-muted-foreground/60 hidden sm:inline">or start with Search</span>
          </div>
        </div>

        {/* 2-Column Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Main Left Column */}
          <div className="flex-1 w-full">
            
            {/* Hero Section */}
            <div className="mb-14">
              <h1 className={`${vt323.className} text-[3.5rem] tracking-tight leading-none text-[#1C1B1A] mb-4`}>
                Personal Knowledge archive
              </h1>
              <p className="text-[15px] text-muted-foreground/80 leading-relaxed font-medium max-w-xl">
                A structured path from scattered links to a unified second brain. {topCollections.length} collections, {resources.length} resources, covering everything you've saved and organized.
              </p>
              <Link href="/dashboard/recent">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-border/60 rounded-md text-[12px] font-medium text-foreground mt-6 hover:bg-muted/30 transition-colors shadow-sm cursor-pointer">
                  <span className="bg-foreground text-background text-[9px] px-1 rounded-sm uppercase font-bold tracking-wider">N</span>
                  Library progress <ArrowRight className="w-3 h-3 text-muted-foreground" />
                </div>
              </Link>
            </div>

            {/* Collections Grid (Library Structure) */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
                  LIBRARY STRUCTURE
                </p>
                <Link href="/dashboard/collections" className="text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors">
                  View all collections →
                </Link>
              </div>
              
              {topCollections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topCollections.map((collection) => (
                    <Link key={collection.name} href={collection.href}>
                      <div className="flex items-start justify-between p-5 bg-[#FDFDFC] border border-border/40 rounded-xl hover:border-border/80 hover:bg-white hover:shadow-sm transition-all group h-full">
                        <div className="flex items-start gap-4">
                          <span className="text-[13px] font-mono text-muted-foreground/40 font-medium">
                            {collection.index}
                          </span>
                          <div>
                            <h4 className="text-[14px] font-medium text-foreground mb-0.5 group-hover:text-black transition-colors capitalize">
                              {collection.name}
                            </h4>
                            <p className="text-[12px] text-muted-foreground/70 font-medium">
                              {collection.count} {collection.count === 1 ? 'RESOURCE' : 'RESOURCES'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors mt-0.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-white border border-border/40 rounded-xl">
                  <p className="text-sm text-muted-foreground">Save some links to automatically generate your library structure.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            
            {/* Visual Flair Image */}
            <div className="hidden lg:flex w-full h-[180px] border border-border/50 rounded-xl bg-white shadow-sm items-center justify-center p-4 relative overflow-hidden">
               <Image src="/invieg.png" alt="Archive illustration" width={140} height={140} className="object-contain filter drop-shadow-md z-10 relative hover:scale-105 transition-transform duration-500" />
               <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/30 to-transparent z-0" />
            </div>

            {/* CTA Card */}
            {latestResource && (
              <div className="w-full bg-white border border-border/50 rounded-xl p-5 shadow-sm group hover:border-border/80 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-md bg-[#F9F8F6] border border-border/40 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-muted-foreground/70" />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
                    QUICK ACCESS
                  </p>
                </div>
                
                <h3 className="text-[14px] font-semibold text-foreground mb-1 line-clamp-2">
                  {latestResource.title}
                </h3>
                <p className="text-[12px] text-muted-foreground line-clamp-2 mb-4">
                  {latestResource.tldr || "Read your latest saved resource."}
                </p>
                
                <Link href={`/links/${latestResource.id}`}>
                  <div className="w-full py-2 bg-[#F9F8F6] border border-border/60 rounded-md text-[12px] font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                    Start reading <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </Link>
              </div>
            )}

            {/* Recent Activity Mini-Feed */}
            <div className="w-full bg-[#FDFDFC] border border-border/40 rounded-xl p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-4">
                Recent Activity
              </p>
              <div className="space-y-4">
                {resources.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No recent activity.</p>
                ) : (
                  [...resources]
                    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
                    .slice(0, 4)
                    .map((r) => (
                      <div key={`activity-${r.id}`} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-[12px] text-foreground font-medium line-clamp-1">{r.title}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(r.savedAt).toLocaleDateString()} • {r.domain}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </AppShell>
  );
}


