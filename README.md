# rss-ozet — Part 4 paketi: Sistemi Büyütmek

Bu paket, Periskop'taki **"Sistemi Büyütmek: Oturumların Ötesinde
Yaşayan Döngüler"** (Claude Code ile Loop & Harness Engineering,
Part 4) yazısının eşlik repo'sudur. İçeriği iki katmandır:

1. **Part 3'ün tamamlanmış hâli** — starter iskele + Part 3'teki
   `/goal` döngüsünün ürettiği feed katmanının referans
   implementasyonu (`src/feeds.ts`, fixture ve zincir testleri).
2. **Part 4 zemini** — initializer'ın çıktıları: `feature-list.json`,
   `init.sh`, CLAUDE.md oturum protokolü, `.claude/agents/reviewer.md`.

Beş feature `feature-list.json`'da "beklemede" durumundadır; onları
siz yazmazsınız, yazıdaki desenle **oturumlara yazdırırsınız**.

## Hızlı başlangıç

    npm install
    bash init.sh          # zemin: tip + lint + 8 test + temiz ağaç

`ZEMİN YEŞİL` görmeden feature'a başlamayın — oturum protokolünün
ilk kuralı budur.

## Çalışma düzeni (yazıdaki dört iterasyon)

1. **Oturum başına bir feature:** Claude Code'u repo kökünde açın ve
   şunu deyin: *"feature-list.json'dan bağımlılığı hazır bir feature
   seç ve oturum protokolüne göre tamamla."* Bitiş tanımı: kod + test
   + reviewer raporu + verify-app + feature id'li tek commit.
   Deseni sıfırdan kendiniz kurmak isterseniz initializer prompt'unun
   tamamı `docs/initializer-prompt.md`'de.
2. **Bağımsız göz:** Reviewer subagent'ı `.claude/agents/reviewer.md`'de
   tanımlı; coder commit'ten önce onu çağırır. Engelleyici bulgu
   düzeltilmeden commit atılmaz.
3. **Paralellik:** Bağımsız feature'lar için worktree açın:

       git worktree add ../rss-ozet-llm-ozet feature/llm-ozet
       git worktree add ../rss-ozet-siralama feature/en-yeni-en-ustte

   Döngü başına bir worktree, worktree başına bir branch; `main`'e
   merge insan işidir. Bağımlılığı olan feature (örn. `ozet-cache`)
   bağımlısı merge olmadan açılmaz.
4. **Bulut:** Feed taraması `/schedule` ile cloud routine'e taşınır;
   routine taze klonda koştuğu için çıktısı lokal dosya değil PR'dır.
   Örnek prompt yazının İterasyon 4 bölümündedir.

## LLM özetleme ve API key

`llm-ozet` feature'ının referans implementasyonu
`reference/summarize-llm.ts`'dedir. Key, ajanın okuyamadığı `.env`'de
durur (permission deny — Part 3); uygulama onu **ortamdan** alır:

    ANTHROPIC_API_KEY=... npm run dev
    # ya da: node --env-file=.env ile başlatın

Key yoksa ya da çağrı başarısızsa extractive fallback devrededir;
canlı API hiçbir hard test koşuluna girmez.

## Dosya haritası (Part 4 eklemeleri)

    feature-list.json                işin yapısı: durum, kabul, bağımlılık
    init.sh                          oturum zemini kapı bekçisi
    .claude/agents/reviewer.md       bağımsız reviewer subagent
    docs/initializer-prompt.md       deseni sıfırdan kuran prompt
    reference/summarize-llm.ts       llm-ozet referans implementasyonu
    src/feeds.ts                     feed katmanı (Part 3 çıktısının referansı)
    tests/feeds.test.ts              fixture testleri (ağ erişimi yok)
    tests/integration.test.ts        zincir testi: feeds → dosya → API → SSR

TASK.md yalnızca kaynak listesini taşır ve `kaynak-yonetimi`
feature'ıyla emekli olacaktır. Part 3 starter'ının kurulum ayrıntıları
(ön koşullar, permission notları, sorun giderme) için:
https://github.com/mndemirel-byte/rss-ozet

## Sorun giderme

**`tsc` xml2js tipinde hata veriyor:** `npm install` çalıştırdığınızdan
emin olun — `@types/xml2js` bu pakette devDependency'dir (feed katmanı
`rss-parser`'ı import ettiği anda strict mod bunu ister).

**init.sh "ÇALIŞMA AĞACI" adımında düşüyor:** Ya dizin bir git repo'su
değildir (`git init` + ilk commit) ya da working tree kirlidir —
ikisi de protokol gereği kırmızıdır.

**Integration testi port hatası veriyor:** Test kendi geçici portunu
açar (port 0); 3000'in dolu olması bu testi etkilemez.
