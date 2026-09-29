// reference/summarize-llm.ts — llm-ozet feature'ının referans implementasyonu.
// Feature tamamlanırken src/summarize.ts bu hâle evrilir; summarize async olur,
// server.ts ve testler uyarlanır (bkz. feature-list.json / llm-ozet kabulü).

function extractive(text: string, maxSentences = 2): string {
  const sentences = text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/);
  return sentences.slice(0, maxSentences).join(" ");
}

export async function summarize(text: string, maxSentences = 2): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return extractive(text, maxSentences);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key,
                 "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 200,
        messages: [{ role: "user",
          content: `Şu haber metnini Türkçe, en fazla iki cümleyle özetle:\n\n${text}` }],
      }),
    });
    if (!r.ok) return extractive(text, maxSentences);
    const data = await r.json();
    return data.content?.[0]?.text ?? extractive(text, maxSentences);
  } catch {
    return extractive(text, maxSentences);
  }
}
