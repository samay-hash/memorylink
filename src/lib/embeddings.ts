import { pipeline, env } from '@xenova/transformers';

// Disable local model downloading in production, use CDN
env.allowLocalModels = false;

// We use all-MiniLM-L6-v2 which creates 384-dimensional embeddings
let embedder: any = null;

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  
  // Truncate to prevent token limit errors
  const safeText = text.slice(0, 8000);
  
  const output = await embedder(safeText, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// Helper to chunk text into smaller paragraphs for better RAG
export function chunkText(text: string, maxWords = 150): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(' '));
  }
  
  return chunks.filter(c => c.trim().length > 20);
}
