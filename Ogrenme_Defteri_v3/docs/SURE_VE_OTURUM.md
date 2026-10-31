# Süre, tek tuşla başlama ve mola

Amaç: "bugün ne kadar sürecek, nereden başlayayım?" sorusunu ortadan kaldırmak ve uzun oturumu **mola ile bölmek**. Kod: `js/sure.js` (saf işlevler), `js/sure-ac.js`, `js/seviye-ac.js` (`bugunSureli`, `sonrakiGorev`), `js/gorunum/bugun.js`, `js/gorunum/mola.js`.

## Nasıl çalışır?

1. **Tek düğme.** Bugün ekranının en üstünde büyük **▶ Başla / Devam et** düğmesi sıradaki görevi açar. Görev bitince sonuç ekranında bir sonrakine geçen düğme vardır; sırayı sen seçmek zorunda değilsin.
2. **Süre tahmini.** Her görevin yanında "≈ N dk" yazar. Tahmin, sayfa türüne göre **kaba saniyelerden** (`SAYFA_SN`) hesaplanır. Bunlar ölçülmüş değil, benim tahminimdir.
3. **Kalibrasyon.** Her oturumun gerçek süresi kaydedilir (`sure` olayı). Son 12 ölçümün gerçek/tahmin oranının **ortancası** (en az 3 ölçümle; 0,6–2 aralığına sıkıştırılmış) sonraki tahminlere uygulanır. İlk günlerde tahminler kabadır; birkaç oturumdan sonra sana göre ayarlanır.
4. **Odak süresi.** Varsayılan **30 dakika** (20–50, 5'er dakika; Ben → Ayarlar). Günün zorunlu görevleri bu pencereye sığacak kadarı **"Şimdi"**, kalanı **"Mola sonrası"** olur (3 dk tolerans; ilk görev her zaman "Şimdi"dedir).
5. **Mola.** "Şimdi" bölümü bitince ve "Mola sonrası" kalmışsa Başla düğmesi önce 2 dakikalık bir **mola ekranı** açar (4 kısa adım: ayağa kalk ve omuzlarını gevşet, uzağa bak, su iç ve nefes al, ellerini silkele). "Molayı atla" ile geçilebilir. Mola sonrası devam edilir. Bugün spor yaptıysan mola yerine geçer, ayrıca mola sorulmaz.
6. **Spor "Hareket"** grubundadır: oturup çalışma değildir, odak süresine sayılmaz, mola yerine geçer.
7. **Bonus.** Bugünün zorunlu işleri bitince "🎁 Hâlâ enerjin var mı?" ile isteğe bağlı görevler önerilir; zorunlu değildir.

## Dayanıklılığın artması (30 → 50 dk)

Son **üç etkin günde** odak süreni (≥ %85) doldurduysan uygulama **+5 dakika önerir**. Karar senindir: "N dk yap" ya da "Şimdi değil" (7 gün susar). Her öneri arasında en az 7 gün vardır; ayardan her zaman geri alabilirsin. Bu eşikler (3 gün, %85, 7 gün) **kanıta değil, tasarım tahminime** dayanır. Dikkat süresinin kesin bir "doğru" değeri yoktur; kişiden kişiye ve konudan konuya değişir.

## Uzun dersleri bölme

91 dersin süresi `node scripts/denetim-sure.mjs` ile denetlenir (ortanca 3 dk; en uzun ≈ 21 dk). İngilizce derslerinde 8'den fazla kelimelik sunum, **≤ 7 kelimelik parçalara bölünür; her parçadan sonra o parçanın alıştırması** gelir (`js/derle.js: kelimeBloklariniBol`). Böylece art arda 13 kelime kartı yerine "6 kart → 6 soru → 7 kart → 7 soru" olur: daha az monoton ve geri çağırma daha erken. Toplam süre değişmez; yorgunluk ve sıkıcılık azalır. Ders yarıda bırakılırsa **kaldığın sayfadan devam teklif edilir**.

## Sınırlar

- Dakika tahminleri ilk günlerde yanlış olabilir (kalibrasyon biriktikçe düzelir).
- "Ders başına en çok ≈ 21 dk" bile 30 dk'lık odak süresine sığar ama ikinci ders için mola gerekebilir.
- Sınama: `tests/unit/sure.test.mjs`, `tests/e2e/bugun-sure.cjs`.
