# Initializer prompt'u (Part 4, İterasyon 1)

Aşağıdaki prompt'u Claude Code oturumuna olduğu gibi verin.
Bu paket, initializer'ın çıktılarıyla (feature-list.json, init.sh,
CLAUDE.md oturum protokolü) hazır gelir; prompt, deseni kendi
projenizde sıfırdan kurmak isteyenler içindir.

```text
Sen bu repo'nun initializer ajanısın ve yalnızca BİR KEZ çalışacaksın.
Görevin kod yazmak değil; uzun soluklu inşayı taşıyacak zemini kurmak.

1. Repo'yu, CLAUDE.md'yi ve PROGRESS.md'yi oku; mevcut durumu özetle.
2. Aşağıdaki hedef listesini feature-list.json'a dönüştür. Her feature
   şu alanları taşısın: id, aciklama, kabul (ölçülebilir ve
   transcript-kanıtlı kriterler), durum ("beklemede"), bagimlilik, notes.
3. init.sh yaz: yeni bir oturumun zemini tek komutla doğrulaması için —
   bağımlılık kontrolü, tsc, lint, test; hepsi çıktılarını olduğu gibi
   göstersin ve biri kırmızıysa sıfır olmayan kodla çıksın.
4. CLAUDE.md'ye "Oturum protokolü" bölümü ekle:
   - Oturuma init.sh ile başla; kırmızı zeminde feature'a başlama.
   - Oturum başına EN FAZLA BİR feature. Bitiremeyeceksen durumu
     "yarım" yap ve kalan işi feature'ın notes alanına somut yaz.
   - Her feature'ın bitişi: kod + test + reviewer raporu + verify-app
     + feature id'siyle başlayan tek commit. Kirli working tree ile
     oturum kapatılmaz.
5. Hiçbir feature'ı implemente ETME. Bitirdiğinde PROGRESS.md'ye
   "initializer tamamlandı" satırını ekle ve dur.

Hedef listesi: (1) LLM özetleme — stub değişir, extractive fallback
korunur; (2) en yeni en üstte sıralama; (3) kaynak yönetimi —
kaynak listesi TASK.md'den data/sources.json'a taşınır; (4) özet
cache — aynı öğe iki kez özetlenmez; (5) hata sayfası — feed'ler
erişilemezken arayüz bunu söyler.
```
