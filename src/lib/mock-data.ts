export type ContentType = "article" | "github" | "youtube" | "paper" | "tool" | "documentation";

export interface BaseResource {
  id: string;
  url: string;
  title: string;
  description: string;
  domain: string;
  favicon?: string;
  type: ContentType;
  savedAt: string;
  publishedAt?: string;
  tldr: string;
  tags: string[];
  status: "live" | "changed" | "unavailable";
  userNote?: string;
  isFavorite?: boolean;
}

export interface ArticleResource extends BaseResource {
  type: "article";
  author: string;
  readingTime: string;
}

export interface GithubResource extends BaseResource {
  type: "github";
  repository: string;
  language: string;
  stars: number;
  forks: number;
  latestRelease: string;
  techStack: string[];
}

export interface YoutubeResource extends BaseResource {
  type: "youtube";
  channel: string;
  duration: string;
  thumbnailUrl: string;
  hasTranscript: boolean;
}

export interface PaperResource extends BaseResource {
  type: "paper";
  authors: string[];
  keyFindings: string[];
  methodology: string;
}

export interface ToolResource extends BaseResource {
  type: "tool";
  category: string;
  pricing: string;
  mainUseCase: string;
}

export interface DocumentationResource extends BaseResource {
  type: "documentation";
  framework: string;
  version: string;
  mainTopic: string;
}

export type Resource =
  | ArticleResource
  | GithubResource
  | YoutubeResource
  | PaperResource
  | ToolResource
  | DocumentationResource;

export const mockResources: Resource[] = [
  {
    id: "1",
    type: "github",
    url: "https://github.com/langchain-ai/langgraph",
    title: "langchain-ai/langgraph: Build resilient language agents as graphs.",
    description: "Build resilient language agents as graphs. LangGraph is a library for building stateful, multi-actor applications with LLMs.",
    domain: "github.com",
    favicon: "https://github.githubassets.com/favicons/favicon.svg",
    savedAt: "2026-09-20T14:30:00Z",
    publishedAt: "2024-01-15T00:00:00Z",
    tldr: "A library for building complex, stateful LLM applications using graph structures instead of simple chains, enabling cyclical execution and multi-agent coordination.",
    tags: ["Python", "LLM", "Agents", "Open Source"],
    status: "live",
    repository: "langchain-ai/langgraph",
    language: "Python",
    stars: 8400,
    forks: 750,
    latestRelease: "v0.1.14",
    techStack: ["Python", "LangChain", "LLMs"],
    userNote: "Useful architecture for the multi-agent orchestration layer.",
  },
  {
    id: "2",
    type: "article",
    url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
    title: "LLM Powered Autonomous Agents",
    description: "Building agents with LLM as its core controller is a cool concept. Several proof-of-concepts demos, such as AutoGPT, GPT-Engineer and BabyAGI, serve as inspiring examples.",
    domain: "lilianweng.github.io",
    savedAt: "2026-09-18T09:15:00Z",
    publishedAt: "2023-06-23T00:00:00Z",
    tldr: "Comprehensive overview of building autonomous agents with LLMs, breaking down the architecture into planning, memory, and tool use components.",
    tags: ["AI", "Architecture", "Agents", "Research"],
    status: "live",
    author: "Lilian Weng",
    readingTime: "18 min read",
  },
  {
    id: "3",
    type: "paper",
    url: "https://arxiv.org/abs/2305.10601",
    title: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models",
    description: "Language models are increasingly being deployed for general problem solving across a wide range of tasks, but are still confined to token-level, left-to-right decision-making processes during inference.",
    domain: "arxiv.org",
    savedAt: "2026-09-15T11:20:00Z",
    publishedAt: "2023-05-17T00:00:00Z",
    tldr: "Introduces 'Tree of Thoughts' (ToT) prompting, allowing LLMs to explore multiple reasoning paths, self-evaluate choices, and look ahead or backtrack for better problem-solving.",
    tags: ["LLM", "Prompting", "Research Paper", "Reasoning"],
    status: "live",
    authors: ["Shunyu Yao", "Dian Yu", "Jeffrey Zhao", "Izhak Shafran", "Thomas L. Griffiths", "Yuan Cao", "Karthik Narasimhan"],
    keyFindings: ["Significantly improves LLM performance on tasks requiring planning or search", "Provides a structured way to combine exploration and exploitation in LLM reasoning"],
    methodology: "Extends Chain of Thought by maintaining a tree of reasoning steps and using heuristic evaluation to search the optimal path.",
  },
  {
    id: "4",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
    title: "Let's build GPT: from scratch, in code, spelled out.",
    description: "We build a Generatively Pretrained Transformer (GPT), following the paper 'Attention is All You Need' and OpenAI's GPT-2 / GPT-3.",
    domain: "youtube.com",
    savedAt: "2026-09-10T18:45:00Z",
    publishedAt: "2023-01-17T00:00:00Z",
    tldr: "A deep dive coding tutorial building a Transformer model from scratch using PyTorch, explaining self-attention and transformer architecture clearly.",
    tags: ["Machine Learning", "PyTorch", "Transformers", "Tutorial"],
    status: "live",
    channel: "Andrej Karpathy",
    duration: "1:56:12",
    thumbnailUrl: "https://i.ytimg.com/vi/zjkBMFhNj_g/maxresdefault.jpg",
    hasTranscript: true,
  },
  {
    id: "5",
    type: "tool",
    url: "https://www.pinecone.io/",
    title: "Pinecone: The vector database for AI",
    description: "Pinecone is the vector database for building AI applications. It's fast, scalable, and easy to use.",
    domain: "pinecone.io",
    savedAt: "2026-09-05T10:00:00Z",
    tldr: "A managed, cloud-native vector database designed to handle high-dimensional embeddings for applications like semantic search and RAG.",
    tags: ["Vector DB", "RAG", "Infrastructure", "SaaS"],
    status: "changed",
    category: "Database",
    pricing: "Freemium / Usage-based",
    mainUseCase: "Storing and querying embeddings for retrieval-augmented generation.",
  },
  {
    id: "6",
    type: "documentation",
    url: "https://nextjs.org/docs/app/building-your-application/routing/server-components",
    title: "React Server Components - Next.js Documentation",
    description: "Learn how to use React Server Components in Next.js to render UI on the server.",
    domain: "nextjs.org",
    savedAt: "2026-09-02T16:30:00Z",
    tldr: "Explains the paradigm shift of Server Components in the Next.js App Router, detailing how to fetch data directly on the server without shipping JavaScript to the client.",
    tags: ["React", "Next.js", "Frontend", "Performance"],
    status: "live",
    framework: "Next.js",
    version: "14.x",
    mainTopic: "React Server Components",
  }
];

export const summaryStats = {
  saved: 342,
  collections: 18,
  unread: 27,
  changed: 6,
};
