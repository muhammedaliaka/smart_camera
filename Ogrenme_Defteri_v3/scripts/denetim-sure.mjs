#!/usr/bin/env node
// Ders süresi ve sıkıcılık denetimi: her dersin tahmini süresini, en uzun tekdüze (aynı türde art arda) dizisini ve metin ağırlığını yazar.
//   node scripts/denetim-sure.mjs [--esik 15] [--hepsi]
// Eşik üstü süre ya da 8+ tekdüze sayfa ya da 5+ art arda "anlat" sayfası uyarı sayılır. Çıkış kodu her zaman 0 (bilgi amaçlıdır).
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { icerikDogrula } from './dogrula.mjs';
import { derle } from '../js/derle.js';
import { sayfalarSn, dakika } from '../js/sure.js';

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const a = process.argv.slice(2);
const ESIK = +(a.includes('--esik') ? a[a.indexOf('--esik') + 1] : 15);
const { ic, idx } = icerikDogrula(join(kok, 'icerik'));
const ctx = { kelime: (id) => idx.kelime.get(id), tumKelimeler: ic.kelimeler, sesler: ic.sesler, dis: (id) => idx.dis.get(id), hareket: (id) => idx.hareket.get(id), ders: (id) => idx.ders.get(id), deneme: 0 };

const satirlar = [];
for (const d of ic.dersler) {
  let sayfalar;
  try { sayfalar = derle(d, ctx).sayfalar; } catch (e) { satirlar.push({ id: d.id, hata: e.message }); continue; }
  let enUzun = 0, cur = 0, onceki = null, anlatSira = 0, enAnlat = 0;
  for (const s of sayfalar) {
    cur = s.t === onceki ? cur + 1 : 1; onceki = s.t; enUzun = Math.max(enUzun, cur);
    anlatSira = s.t === 'anlat' ? anlatSira + 1 : 0; enAnlat = Math.max(enAnlat, anlatSira);
  }
  satirlar.push({ id: d.id, iz: d.iz, sv: d.sv ?? '', sayfa: sayfalar.length, dk: dakika(sayfalarSn(sayfalar)), tekduze: enUzun, anlat: enAnlat });
}
const uyar = (s) => !s.hata && (s.dk > ESIK || s.tekduze >= 8 || s.anlat >= 5);
console.log(`${satirlar.length} ders; eşik ${ESIK} dk`);
const toplam = satirlar.filter((s) => !s.hata).reduce((t, s) => t + s.dk, 0);
const dk = satirlar.map((s) => s.dk).filter(Number.isFinite).sort((x, y) => x - y);
console.log(`süre: ortanca ${dk[Math.floor(dk.length / 2)]} dk · en uzun ${dk[dk.length - 1]} dk · toplam ${toplam} dk`);
for (const s of satirlar.filter((x) => a.includes('--hepsi') || x.hata || uyar(x))) {
  console.log(s.hata ? `  HATA ${s.id}: ${s.hata}` : `  ${uyar(s) ? '⚠' : ' '} ${s.id.padEnd(28)} ${String(s.iz).padEnd(9)} sv ${String(s.sv).padEnd(3)} ${String(s.sayfa).padStart(3)} sayfa ≈ ${String(s.dk).padStart(2)} dk · en uzun tekdüze ${s.tekduze} · art arda anlat ${s.anlat}`);
}
