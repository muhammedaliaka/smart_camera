// Ses dosyaları: gerçekten var mı, boş mu; özel adlar için okunuş kararı verilmiş mi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const kok = fileURLToPath(new URL('../..', import.meta.url));
const sesDizini = join(kok, 'ses');
const metinler = JSON.parse(readFileSync(join(sesDizini, 'metinler.json'), 'utf8'));
const uretici = readFileSync(join(kok, 'scripts/ses-uret.py'), 'utf8');

test('ses: her mp3 anlamlı büyüklükte (kesik ya da boş dosya yok)', () => {
  const kucuk = Object.keys(metinler).filter((d) => !existsSync(join(sesDizini, d)) || statSync(join(sesDizini, d)).size < 2500);
  assert.deepEqual(kucuk, []);
});

// Bu sözcükler cümle ortasında büyük harfle yazılsa da özel ad sorunu çıkarmaz.
const GUVENLI = new Set(['I', "I'm", "I'll", "I've", "I'd", 'English', 'Turkish', 'Mr', 'Mrs', 'Ms', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  'Sundays', 'Saturdays', 'Attention', 'French', 'So', 'Yes', 'No', 'Hello', 'Hi', 'Sorry', 'Please', 'Well', 'Thank', 'Thanks', 'Good', 'Goodbye', 'Excuse', 'Okay', 'OK', 'Look', 'Wait', 'Oh', 'Great', 'Nice', 'Welcome', 'See', 'Bye']);

const SAYI = /^(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|(thir|four|fif|six|seven|eigh|nine)teen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)$/i;

// Bilgisayar sesi (Kokoro) Türkçe adları yanlış okuyabilir ("Ece" ilk denemede "S" gibi okundu).
// Metinde yeni bir özel ad görülürse okunuşuna bakıp scripts/ses-uret.py içindeki ADLAR tablosuna, adı da ASR_ISIMLER listesine eklemek gerekir.
test('ses: özel adların hepsi ses-uret.py içindeki ASR_ISIMLER listesinde (okunuşuna bakıldı)', () => {
  const listeSatiri = uretici.match(/ASR_ISIMLER\s*=\s*\[([^\]]*)\]/);
  assert.ok(listeSatiri, 'ASR_ISIMLER bulunamadı');
  const bilinen = new Set([...listeSatiri[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]));
  const bulunan = new Map();
  for (const e of Object.values(metinler)) {
    if (e.ses === 'tr') continue;
    for (const cumle of e.metin.split(/(?<=[.!?])\s+/)) {
      const sozcukler = cumle.match(/[A-Za-zÇĞİÖŞÜçğıöşü][\wÇĞİÖŞÜçğıöşü']*/g) || [];
      sozcukler.forEach((s, i) => {
        const buyuk = /^[A-ZÇĞİÖŞÜ]/.test(s);
        const turkceHarf = /[çğıöşüÇĞİÖŞÜ]/.test(s);
        const hitap = i === 0 && new RegExp(`^${s}[,!]`).test(cumle); // "Ece, can you swim?"
        if (GUVENLI.has(s) || SAYI.test(s)) return;
        if (turkceHarf || (buyuk && i > 0) || (buyuk && hitap)) bulunan.set(s, cumle);
      });
    }
  }
  const eksik = [...bulunan].filter(([s]) => !bilinen.has(s)).map(([s, c]) => `${s}  ("${c}")`);
  assert.deepEqual(eksik, [], 'Bu adların okunuşunu kulakla kontrol et; gerekirse ADLAR tablosuna okunuşunu, ASR_ISIMLER listesine adı yaz');
});

// Çok okunuşlu sözcükler: bilgisayar sesi bağlamdan yanlış okunuşu seçebilir ("close" -> "yakın", "lives" -> "canlı").
// Böyle bir sözcük metinde geçiyorsa ya scripts/ses-uret.py içindeki SOZCUKLER tablosunda okunuşu belirlenmiş olmalı
// ya da burada "incelendi" listesinde olmalı (cümlelerde sesine bakıldı; aşağıdaki not geçerli).
const COK_OKUNUSLU = ['close', 'closed', 'live', 'lives', 'living', 'use', 'used', 'read', 'lead', 'wind', 'tear', 'row', 'bow', 'minute', 'present', 'record', 'content', 'object', 'wound', 'bass', 'desert', 'refuse', 'project'];
// read: yalnız şimdiki zaman (okurum) kullanılıyor, ɹˈiːd okunuyor. Geçmiş zaman ("I read it yesterday") eklenirse SOZCUKLER'e değil, cümleye bakılmalı.
// minute (isim: mˈɪnɪt), wind (isim: wˈɪnd), row (sıra: ɹˈoʊ): Kokoro'nun ön ucu bu sözcüklerde derste kullanılan anlamı seçiyor (ses-uret.py'deki fonemleştiriciyle bakıldı).
const INCELENDI = new Set(['read', 'minute', 'wind', 'row']);

test('ses: çok okunuşlu sözcükler için okunuş belirlenmiş ya da incelenmiş', () => {
  const tablo = uretici.match(/SOZCUKLER\s*=\s*\{([^}]*)\}/);
  assert.ok(tablo, 'SOZCUKLER bulunamadı');
  const belirli = new Set([...tablo[1].matchAll(/"([^"]+)"\s*:/g)].map((m) => m[1]));
  const bulunan = new Map();
  for (const e of Object.values(metinler)) {
    if (e.ses === 'tr') continue;
    for (const s of e.metin.toLowerCase().match(/[a-z']+/g) || []) {
      if (COK_OKUNUSLU.includes(s) && !belirli.has(s) && !INCELENDI.has(s)) bulunan.set(s, e.metin);
    }
  }
  assert.deepEqual([...bulunan].map(([s, c]) => `${s}  ("${c}")`), [], 'Okunuşuna bak; SOZCUKLER tablosuna ekle ya da INCELENDI listesine yaz');
});
