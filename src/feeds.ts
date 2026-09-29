// src/feeds.ts — feed katmanı (Part 3'teki /goal döngüsünün referans çıktısı).
// Kaynak listesi şimdilik TASK.md ile eşlenik burada durur;
// `kaynak-yonetimi` feature'ı bunu data/sources.json'a taşıyacak.
import Parser from "rss-parser";
import { readFileSync, writeFileSync } from "node:fs";
import { summarize } from "./summarize";
import type { Item } from "./server";

export const SOURCES = [
  "https://hnrss.org/frontpage",
  "https://webrazzi.com/feed/",
  "https://feeds.arstechnica.com/arstechnica/index",
];

export type RawEntry = {
  title?: string;
  link?: string;
  guid?: string;
  contentSnippet?: string;
  content?: string;
};

export type FeedFetcher = (url: string) => Promise<{ items: RawEntry[] }>;

// Öğe kimliği: guid varsa guid, yoksa link (idempotency invariant'ı).
export function identity(e: { guid?: string; link?: string }): string {
  return e.guid ?? e.link ?? "";
}

export function normalize(e: RawEntry): Item | null {
  const title = e.title?.trim();
  const link = e.link?.trim();
  if (!title || !link) return null;
  const text = (e.contentSnippet ?? e.content ?? title).trim();
  return { title, link, summary: summarize(text), guid: e.guid };
}

const defaultFetcher: FeedFetcher = (url) => new Parser().parseURL(url);

// Kaynakları tarar, yeni öğeleri data dosyasına ekler; eklenen sayıyı döndürür.
// fetcher parametresi testlerin ağa çıkmadan fixture beslemesi içindir.
export async function fetchAndStore(
  fetcher: FeedFetcher = defaultFetcher,
  sources: string[] = SOURCES,
  file = "data/items.json"
): Promise<number> {
  const existing: Item[] = JSON.parse(readFileSync(file, "utf8"));
  const known = new Set(existing.map(identity));
  const added: Item[] = [];
  for (const src of sources) {
    const feed = await fetcher(src);
    for (const entry of feed.items) {
      const id = identity(entry);
      const item = normalize(entry);
      if (!item || !id || known.has(id)) continue;
      known.add(id);
      added.push(item);
    }
  }
  if (added.length > 0) {
    writeFileSync(file, JSON.stringify([...existing, ...added], null, 2));
  }
  return added.length;
}
