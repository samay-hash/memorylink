"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Search, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { VT323, Instrument_Serif } from "next/font/google";
import Image from "next/image";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: "italic"
});

const WORDS = ["library", "brain", "workflow", "network"];

export default function LandingPage() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-foreground font-sans overflow-hidden flex flex-col">
      
      {/* Top Banner (like Fanout) */}
      <div className="w-full bg-[#F3F6FA] border-b border-border/40 py-2.5 flex items-center justify-center gap-2 text-sm text-[#3E65B5]">
        <span className="font-semibold text-[11px] uppercase tracking-wider bg-white rounded-sm px-1.5 py-0.5 shadow-sm">NEW FEATURE</span>
        <span className="font-medium tracking-tight">Recall Intelligence is dropping this week</span>
        <Link href="/" className="font-medium hover:underline opacity-80 flex items-center">
          Sign up today <span className="ml-1">→</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full relative z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-foreground">
            <Package className="w-5 h-5" strokeWidth={2} />
            <span className="font-bold text-lg tracking-tight">Recall</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-foreground text-background px-1.5 py-0.5 rounded-full ml-1">Beta</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground ml-4">
            <Link href="#features" className="hover:text-foreground">Features</Link>
            <Link href="#how-it-works" className="hover:text-foreground">How it works</Link>
            <Link href="https://github.com/samay-hash/memorylink/releases" target="_blank" className="hover:text-foreground">Download</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 hover:bg-muted/30 cursor-pointer transition-colors mr-2 text-sm font-medium">
            New in September <span className="text-muted-foreground">→</span>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-secondary/50">
            <Search className="w-4 h-4" />
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-full px-5 h-9 font-medium shadow-none border-border/80">
              Sign in
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative flex items-center justify-center pt-10 pb-32">
        
        {/* Background glow for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white rounded-full blur-[120px] -z-10" />

        {/* Floating Images Cluster (Left) */}
        <div className="hidden lg:block absolute left-[2%] xl:left-[8%] top-[15%] w-[250px] h-[300px] z-20 group perspective-1000">
          <motion.div
            initial={{ opacity: 0, x: -30, rotate: -15 }}
            animate={{ opacity: 1, x: 0, rotate: -10 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-0 left-0 w-[140px] transition-all duration-500 group-hover:rotate-[-15deg] group-hover:-translate-x-4 group-hover:-translate-y-2 origin-bottom-left filter drop-shadow-xl"
          >
            <Image src="/invieg.png" alt="Science Book" width={200} height={300} className="w-full h-auto object-contain" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-8 left-8 w-[140px] transition-all duration-500 group-hover:rotate-[-2deg] group-hover:-translate-y-4 group-hover:translate-x-2 z-10 origin-bottom-left filter drop-shadow-xl"
          >
            <Image src="/mogli.png" alt="AI Architecture" width={200} height={300} className="w-full h-auto object-contain" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 6 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-16 left-16 w-[130px] transition-all duration-500 group-hover:rotate-[12deg] group-hover:translate-x-6 group-hover:translate-y-2 z-20 origin-bottom-left filter drop-shadow-xl"
          >
            <Image src="/invvh.png" alt="LLM Diagram" width={200} height={300} className="w-full h-auto object-contain" />
          </motion.div>
        </div>

        <div className="max-w-[900px] mx-auto text-center z-10 px-6 mt-16 relative">
          <h1 className="text-[3rem] sm:text-[4rem] md:text-[4.5rem] font-medium tracking-tighter text-[#1C1B1A] mb-8 leading-[1.1] md:leading-[1.05] flex flex-col items-center justify-center w-full">
            
            {/* Line 1 */}
            <div className="flex items-center justify-center whitespace-nowrap">
              <span className="tracking-tighter">Everything your</span>
              <span className="relative inline-flex items-center w-[160px] sm:w-[220px] md:w-[280px] h-[1.2em] overflow-hidden align-bottom ml-3 md:ml-4 tracking-tighter">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0 flex items-center text-[#1C1B1A]"
                  >
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            {/* Line 2 */}
            <div className="flex items-center justify-center whitespace-nowrap mt-2 md:mt-0">
              <span>knows.</span>
              <span className={`ml-3 md:ml-4 text-[1.1em] tracking-normal text-[#1C1B1A] ${vt323.className} flex items-center relative top-[2px] md:top-[4px]`}>
                Mapped .
              </span>
            </div>
            
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Learn what it takes to organize at a senior level — sequenced resources, intelligent metadata, and instant recall for researchers and developers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/samay-hash/memorylink/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full px-7 h-14 text-base font-medium shadow-md bg-[#252423] hover:bg-black text-white border border-[#3E3C3A] transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-80"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              Download for Mac
              <span className="text-white/50 text-sm">↓ .dmg</span>
            </a>
            <Link href="/dashboard">
              <Button variant="ghost" size="lg" className="rounded-full px-5 h-14 text-base font-medium text-muted-foreground hover:text-foreground">
                <PlayCircle className="w-5 h-5 mr-2 opacity-60" /> Use in browser
              </Button>
            </Link>
          </div>
        </div>


      </main>

      {/* Section 2: Technical Workflow (New Professional Section) */}
      <section className="py-24 bg-white relative z-10 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">Under the hood</p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6 leading-tight">
                An intelligent pipeline for every link you save.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We don't just bookmark URLs. We extract the raw HTML, strip the noise, run it through our language models to generate vector embeddings, and organize it into a semantic graph.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#F3F6FA] flex items-center justify-center shrink-0 border border-border/60">
                    <span className="text-sm font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-1">Instant Extraction</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Bypasses paywalls and extracts pure markdown using advanced scraping.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#F3F6FA] flex items-center justify-center shrink-0 border border-border/60">
                    <span className="text-sm font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-1">LLM Summarization</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Generates a concise TL;DR and categorizes the content automatically.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#F3F6FA] flex items-center justify-center shrink-0 border border-border/60">
                    <span className="text-sm font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-1">Vector Indexing</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Embeds paragraphs into Pinecone for millisecond semantic search later.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Block Visual */}
            <div className="flex-1 w-full bg-[#111111] rounded-2xl border border-[#222] p-6 shadow-2xl overflow-hidden relative group">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <span className="ml-2 text-xs text-white/40 font-mono">memorylink_pipeline.ts</span>
              </div>
              <pre className="text-[13px] font-mono text-white/80 leading-relaxed overflow-x-auto">
                <code>
                  <span className="text-purple-400">await</span> <span className="text-blue-400">pipeline</span>.<span className="text-yellow-200">process</span>({`{\n`}
                  {`  `}url: <span className="text-green-300">"https://arxiv.org/abs/1706.03762"</span>,\n
                  {`  `}options: {`{\n`}
                  {`    `}extractMarkdown: <span className="text-orange-300">true</span>,\n
                  {`    `}generateEmbeddings: <span className="text-orange-300">true</span>,\n
                  {`    `}autoTag: <span className="text-orange-300">true</span>\n
                  {`  }\n`}
                  {`}`});\n\n
                  <span className="text-white/40">// Output:</span>\n
                  {`{\n`}
                  {`  `}title: <span className="text-green-300">"Attention Is All You Need"</span>,\n
                  {`  `}category: <span className="text-green-300">"Machine Learning"</span>,\n
                  {`  `}tldr: <span className="text-green-300">"Introduces the Transformer network architecture..."</span>,\n
                  {`  `}vectors_upserted: <span className="text-orange-300">142</span>\n
                  {`}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Semantic Search (Previously Section 2) */}
      <section className="py-24 bg-[#FDFDFC] text-foreground relative z-10 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 text-[#1C1B1A]">Ask your library.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Stop searching for exact keywords. Ask natural language questions and let our semantic engine find the exact paragraphs across all your saved links and papers.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-foreground/80 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Vector embeddings for every document</li>
              <li className="flex items-center gap-3 text-foreground/80 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Conversational answers with citations</li>
              <li className="flex items-center gap-3 text-foreground/80 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Millisecond retrieval times</li>
            </ul>
          </div>
          
          <div className="flex-1 w-full max-w-md bg-white border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 bg-muted/30 rounded-full p-2 px-4 border border-border/40">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground/80">"How does the attention mechanism work?"</span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#F9F8F6] rounded-xl p-4 border border-border/50">
                <span className="text-xs font-semibold tracking-wide text-blue-600 mb-2 block uppercase">From: Attention Is All You Need</span>
                <p className="text-sm text-foreground/80 leading-relaxed font-medium">The model replaces recurrence with attention, making the path between any two positions constant. Self-attention relates different positions of a single sequence...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-32 bg-[#F3F6FA] text-center border-t border-border/40 relative z-10">
        <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to organize your mind?</h2>
        <p className="text-muted-foreground mb-10 max-w-md mx-auto">Join thousands of researchers and developers who have upgraded their personal knowledge systems.</p>
        <Link href="/dashboard">
          <Button size="lg" className="rounded-full px-8 h-14 text-base font-medium shadow-md bg-[#252423] hover:bg-black text-white">
            Start organizing free
          </Button>
        </Link>
      </footer>

      {/* Chat bubble widget (like the reference) */}
      <div className="fixed bottom-6 right-6 bg-white border border-border/60 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 z-50 cursor-pointer hover:shadow-xl transition-all">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs font-medium">150 online</span>
        <div className="w-px h-3 bg-border mx-1" />
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
      </div>

    </div>
  );
}
