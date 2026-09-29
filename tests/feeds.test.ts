import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fetchAndStore, identity, normalize, type FeedFetcher } from "../src/feeds";

const dir = mkdtempSync(join(tmpdir(), "rss-ozet-"));
const file = join(dir, "items.json");
afterAll(() => rmSync(dir, { recursive: true, force: true }));

const fixture: FeedFetcher = async () => ({
  items: [
    { title: "Birinci haber", link: "https://a.example/1", guid: "a-1",
      contentSnippet: "İlk cümle. İkinci cümle. Üçüncü cümle." },
    { title: "İkinci haber", link: "https://a.example/2",
      contentSnippet: "Tek cümle." },
    { title: "", link: "https://a.example/bozuk" },
  ],
});

describe("feed katmanı (fixture ile, ağ erişimi yok)", () => {
  beforeEach(() => writeFileSync(file, "[]"));

  it("kimlik guid'i önceler, yoksa link'e düşer", () => {
    expect(identity({ guid: "g", link: "l" })).toBe("g");
    expect(identity({ link: "l" })).toBe("l");
  });

  it("normalize: başlıksız/linksiz öğeyi eler, özeti stub'dan geçirir", () => {
    expect(normalize({ title: "", link: "x" })).toBeNull();
    const n = normalize({ title: "B", link: "https://x", contentSnippet: "Bir. İki. Üç." });
    expect(n?.summary).toBe("Bir. İki.");
  });

  it("üç kaynağı tarar, geçerli öğeleri data dosyasına yazar", async () => {
    const added = await fetchAndStore(fixture, ["s1", "s2", "s3"], file);
    // fixture her kaynakta aynı iki geçerli öğeyi döndürür; kimlik tekilleştirir
    expect(added).toBe(2);
    const stored = JSON.parse(readFileSync(file, "utf8"));
    expect(stored).toHaveLength(2);
    expect(stored[0]).toMatchObject({ title: "Birinci haber", guid: "a-1" });
  });

  it("idempotent: ikinci tarama aynı öğeleri yeniden eklemez", async () => {
    await fetchAndStore(fixture, ["s1"], file);
    const second = await fetchAndStore(fixture, ["s1"], file);
    expect(second).toBe(0);
    expect(JSON.parse(readFileSync(file, "utf8"))).toHaveLength(2);
  });
});
