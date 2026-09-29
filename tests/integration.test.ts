// Zincir testi: feed katmanı → data/items.json → /api/items → SSR sayfa.
// Gerçek data dosyasını kullanır; başta yedekler, sonda geri koyar.
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import app from "../src/server";
import { fetchAndStore, type FeedFetcher } from "../src/feeds";

const FILE = "data/items.json";
const original = readFileSync(FILE, "utf8");
let server: Server;
let base: string;

const fixture: FeedFetcher = async () => ({
  items: [{
    title: "R&D bütçesi <2026> raporu",
    link: "https://ornek.example/rd?a=1&b=2",
    guid: "zincir-testi-1",
    contentSnippet: "Zincir testinin öğesi. Fazlası kırpılır. Bu cümle görünmez.",
  }],
});

beforeAll(async () => {
  await fetchAndStore(fixture, ["fixture"], FILE);
  server = createServer(app).listen(0);
  const addr = server.address();
  if (addr === null || typeof addr === "string") throw new Error("port yok");
  base = `http://127.0.0.1:${addr.port}`;
});

afterAll(() => {
  server.close();
  writeFileSync(FILE, original);
});

describe("uçtan uca zincir: feeds → dosya → API → SSR", () => {
  it("feed'den gelen öğe /api/items'ta HTTP 200 ile görünür", async () => {
    const res = await fetch(`${base}/api/items`);
    expect(res.status).toBe(200);
    const items = await res.json();
    expect(items.some((i: { guid?: string }) => i.guid === "zincir-testi-1")).toBe(true);
  });

  it("aynı öğe SSR sayfada HTML-escaped hâliyle basılır", async () => {
    const html = await (await fetch(`${base}/`)).text();
    expect(html).toContain("R&amp;D bütçesi &lt;2026&gt; raporu");
    expect(html).toContain("Zincir testinin öğesi. Fazlası kırpılır.");
    expect(html).not.toContain("R&D bütçesi <2026>");
  });
});
