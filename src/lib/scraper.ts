import * as cheerio from "cheerio";

export interface ScrapedContent {
  title: string;
  description: string;
  domain: string;
  favicon: string;
  content: string; // raw text for AI
  type: "article" | "github" | "youtube" | "paper" | "tool" | "documentation";
}

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname.replace("www.", "");

  // Detect type from domain/URL
  let type: ScrapedContent["type"] = "article";
  if (domain.includes("github.com")) type = "github";
  else if (domain.includes("youtube.com") || domain.includes("youtu.be")) type = "youtube";
  else if (domain.includes("arxiv.org") || url.includes("/paper")) type = "paper";
  else if (domain.includes("docs.") || url.includes("/docs/")) type = "documentation";

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; MemoryLinkBot/1.0; +https://memorylink.app)",
    },
    signal: AbortSignal.timeout(10000),
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove noise
  $("script, style, nav, footer, header, aside, .ad, .ads, [class*='sidebar']").remove();

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim() ||
    "";

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  const favicon =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    `https://${domain}/favicon.ico`;

  // Extract readable content - focus on article body
  const articleContent =
    $("article").text() ||
    $("main").text() ||
    $('[class*="content"]').first().text() ||
    $("body").text();

  // Clean and truncate content for AI (max ~4000 chars to stay in token limit)
  const content = articleContent
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);

  return {
    title: title.slice(0, 200),
    description: description.slice(0, 500),
    domain,
    favicon: favicon.startsWith("http") ? favicon : `https://${domain}${favicon}`,
    content,
    type,
  };
}
