import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { pinecone, indexName } from "@/lib/pinecone";
import { generateEmbedding } from "@/lib/embeddings";

export const maxDuration = 60; // Allow up to 60 seconds for RAG and AI on Vercel

export async function POST(req: NextRequest) {
  try {
    const { question, links } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Always try to get the server-side saved links too (the source of truth)
    let serverLinks: any[] = [];
    try {
      // Fetch from the in-memory server store
      const baseUrl = req.nextUrl.origin;
      const linksRes = await fetch(`${baseUrl}/api/links`, { cache: "no-store" });
      if (linksRes.ok) {
        const data = await linksRes.json();
        serverLinks = data.links || [];
      }
    } catch {
      // Ignore errors fetching server links
    }

    // Merge: prefer server links, supplement with client-sent links
    const allLinks = serverLinks.length > 0 ? serverLinks : (links || []);

    // Build a plain-text library summary for the AI as a reliable fallback
    const librarySummary = allLinks.length > 0
      ? allLinks.map((r: any, i: number) =>
          `[${i + 1}] "${r.title}" (${r.url})\n    Category: ${r.tags?.join(", ") || "General"}\n    Summary: ${r.tldr || r.description || "No summary."}`
        ).join("\n\n")
      : "The user has not saved any links yet.";

    // Semantic Vector Search for true RAG
    let ragContext = "";
    
    try {
      const questionEmbedding = await generateEmbedding(question);
      const index = pinecone.index(indexName);
      
      const queryResponse = await index.query({
        vector: questionEmbedding,
        topK: 6,
        includeMetadata: true,
      });

      if (queryResponse.matches && queryResponse.matches.length > 0) {
        ragContext = "RELEVANT EXCERPTS FROM SAVED CONTENT (via semantic search):\n\n" +
          queryResponse.matches
            .map((m: any, i: number) => {
              const meta = m.metadata || {};
              return `[${i + 1}] From: "${meta.title || "Unknown"}" (${meta.url || ""})\n${meta.text || ""}`;
            })
            .join("\n\n---\n\n");
      }
    } catch (e) {
      console.error("Pinecone search failed, using library summary fallback:", e);
    }

    // Build the full context: RAG excerpts + library overview
    const fullContext = [
      ragContext,
      `USER'S FULL LIBRARY (${allLinks.length} saved resources):\n\n${librarySummary}`
    ].filter(Boolean).join("\n\n========\n\n");

    const stream = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are a smart personal knowledge assistant with access to the user's saved link library.

YOUR JOB:
- Answer questions based on the user's library contents below.
- If they ask "what links have I saved?" or similar, list them clearly from LIBRARY section.
- Reference specific resources using [number] citations when relevant.
- If the library is empty, say "You haven't saved any links yet. Save some links from your dashboard to get started!"
- Keep answers concise and helpful. Use markdown for lists/headings.

${fullContext}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.4,
      max_tokens: 1000,
      stream: true,
    });

    // Stream the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Ask AI error:", error);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
