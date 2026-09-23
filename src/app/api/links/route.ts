import { NextRequest, NextResponse } from "next/server";
import { scrapeUrl } from "@/lib/scraper";
import groq from "@/lib/groq";
import { pinecone, indexName } from "@/lib/pinecone";
import { generateEmbedding, chunkText } from "@/lib/embeddings";

// In-memory store (replaces DB until password is set)
// When DATABASE_URL is properly set, swap this for Prisma calls
const inMemoryLinks: SavedLink[] = [];

export interface SavedLink {
  id: string;
  url: string;
  title: string;
  description: string;
  domain: string;
  favicon: string;
  type: string;
  tldr: string;
  tags: string[];
  status: "live" | "processing" | "error";
  savedAt: string;
  content?: string;
  userNote?: string;
  isFavorite?: boolean;
  metadata?: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  try {
    const { url, note } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Auto-prepend https:// if missing
    const normalizedUrl = url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;

    // 1. Scrape the URL
    let scraped;
    try {
      scraped = await scrapeUrl(normalizedUrl);
    } catch {
      return NextResponse.json(
        { error: "Could not fetch this URL. It may be behind a paywall or require login." },
        { status: 422 }
      );
    }

    let tldr = "No summary available.";
    let tags: string[] = ["Uncategorized"];

    try {
      // 2. Ask Groq to generate TL;DR and tags
      const aiResponse = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: `You are an intelligent knowledge management assistant. 
Given a webpage's title, description, and content, you will:
1. Write a crisp, insightful TL;DR (2-3 sentences max) that captures the core value.
2. Assign exactly 1 broad, professional category (e.g., "Engineering", "Design", "Machine Learning", "Productivity").

Respond ONLY with a valid JSON object in this exact format:
{"tldr": "...", "tags": ["CategoryName"]}`,
          },
          {
            role: "user",
            content: `Title: ${scraped.title}
Description: ${scraped.description}
Content: ${scraped.content.slice(0, 2000)}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      const raw = aiResponse.choices[0].message.content || "{}";
      // Extract JSON even if wrapped in markdown
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        tldr = parsed.tldr || tldr;
        tags = Array.isArray(parsed.tags) ? [parsed.tags[0]] : tags;
      }
    } catch (aiError) {
      console.error("AI processing failed, falling back to defaults:", aiError);
      // Fallback logic if Groq fails (e.g. rate limit, timeout)
      tldr = scraped.description || "Link saved successfully. AI processing was temporarily unavailable.";
      tags = ["General"];
    }

    // 3. Build the saved link object
    const savedLink: SavedLink = {
      id: crypto.randomUUID(),
      url: normalizedUrl,
      title: scraped.title || normalizedUrl,
      description: scraped.description || "",
      domain: scraped.domain,
      favicon: scraped.favicon,
      type: scraped.type,
      tldr,
      tags,
      status: "live",
      savedAt: new Date().toISOString(),
      userNote: note || undefined,
      content: scraped.content,
      isFavorite: false,
    };

    // 4. Chunk and embed content for Pinecone
    try {
      const chunks = chunkText(scraped.content || "");
      if (chunks.length > 0) {
        const index = pinecone.index(indexName);
        
        // Generate embeddings for all chunks in parallel
        const vectors = await Promise.all(
          chunks.map(async (chunk, i) => {
            const embedding = await generateEmbedding(chunk);
            return {
              id: `${savedLink.id}-chunk-${i}`,
              values: embedding,
              metadata: {
                linkId: savedLink.id,
                title: savedLink.title,
                url: savedLink.url,
                text: chunk, // Store the raw text chunk for RAG retrieval
              },
            };
          })
        );
        
        // Upsert to Pinecone
        if (vectors.length > 0) {
          await index.upsert(vectors as any);
        }
      }
    } catch (e) {
      console.error("Pinecone upsert failed:", e);
      // We don't fail the whole request if vector DB fails, we still save to UI
    }

    // 5. Persist to in-memory store (TODO: swap for Prisma when DB password is set)
    inMemoryLinks.unshift(savedLink);

    return NextResponse.json({ success: true, link: savedLink });
  } catch (error: any) {
    console.error("Error saving link:", error);
    return NextResponse.json(
      { error: error?.message || "Something went wrong while saving your link." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ links: inMemoryLinks });
}
