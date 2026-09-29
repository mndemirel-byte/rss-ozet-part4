# rss-ozet

RSS kaynaklarını çekip özetleyen minimal haber servisi.
TypeScript + Express. Özetleme şimdilik extractive stub'dır
(bkz. src/summarize.ts).

## Komutlar
- Kur: `npm install`
- Tip kontrolü: `npx tsc --noEmit`
- Test: `npm test`
- Lint: `npm run lint`
- Dev server: `npm run dev` (http://localhost:3000)
- Oturum zemini: `bash init.sh`

## Çalışma kuralları
- Her davranış değişikliği bir testle gelir; testi olmayan feature
  bitmiş sayılmaz.
- Test ve lint çıktısını terminale olduğu gibi yaz; özetleyerek aktarma.
- `src/summarize.ts` stub'ının LLM ile değişimi artık serbest ve
  planlı bir feature'dır: feature-list.json / llm-ozet. Kapsam dışına
  taşma; fallback korunur.
- Yeni bağımlılık eklemeden önce gerekçesini TASK.md'ye yaz.

## Yapılmayacaklar
- `git push` yok (permission katmanında ayrıca engelli; push insan işidir).
- `.env`, kimlik bilgisi ya da API key dosyası oluşturma.
- Testi geçirmek için testi zayıflatma; kaynağı düzelt.

## Oturum protokolü
- Oturuma `bash init.sh` ile başla; kırmızı zeminde feature'a başlama.
- Oturum başına EN FAZLA BİR feature (feature-list.json'dan, bağımlılığı
  hazır olan bir kayıt). Bitiremeyeceksen durumu "yarım" yap ve kalan
  işi feature'ın notes alanına somut yaz.
- Her feature'ın bitişi: kod + test + reviewer subagent raporu +
  verify-app + feature id'siyle başlayan tek commit.
- Kirli working tree ile oturum kapatılmaz.

## Durum dosyaları
- Yeni oturuma başlarken önce feature-list.json ve PROGRESS.md'yi oku.
- feature-list.json: işin yapısı — durum, kabul kriterleri, bağımlılık.
- PROGRESS.md: her anlamlı adımdan sonra tek satır ekle (append-only).
