// Oynatıcıyı rastgele ama makul davranışlarla sonuna kadar gezen test yardımcısı (Playwright ile kullanılır).
// Her yeni sayfa türünde ekran taşması ve küçük dokunma hedefi (<38 px) denetler; ekran görüntüsü alabilir.
async function kontrolEt(p, etiket, sonuc) {
  const r = await p.evaluate(() => {
    const sorun = [];
    const genis = document.documentElement.scrollWidth - window.innerWidth;
    if (genis > 1) sorun.push('yatay taşma ' + genis + 'px');
    const alan = document.querySelector('.oyuncu') || document;
    for (const e of alan.querySelectorAll('button, a.dugme, a.gorev, input, textarea, a.sekme, summary, .secenek, .kutu, .cip')) {
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const stil = getComputedStyle(e);
      if (stil.visibility === 'hidden' || stil.display === 'none') continue;
      if (e.closest('[hidden]')) continue;
      if (e.type === 'checkbox' && e.closest('.onay-satir')) continue;
      if (r.height < 38 || r.width < 38) sorun.push(`küçük hedef ${Math.round(r.width)}x${Math.round(r.height)}: ${(e.getAttribute('aria-label') || e.textContent || e.className).trim().slice(0, 30)}`);
      if (r.right > window.innerWidth + 1 || r.left < -1) sorun.push(`ekran dışı: ${(e.textContent || '').trim().slice(0, 30)}`);
    }
    return sorun;
  });
  if (r.length) sonuc.push(`[${etiket}] ` + r.join(' | '));
}

async function gez(p, { ad, klasor, sonuc, dogru = 0.5, azami = 120, ekran = true }) {
  const gorulen = new Set();
  let rng = 1234567;
  const rastgele = () => { rng = (rng * 1664525 + 1013904223) % 4294967296; return rng / 4294967296; };
  for (let i = 0; i < azami; i++) {
    if (await p.locator('.oyuncu .sonuc').count()) {
      await kontrolEt(p, ad + ':sonuc', sonuc);
      if (ekran) await p.screenshot({ path: `${klasor}/${ad}-sonuc.png` });
      return { bitti: true, adim: i };
    }
    const sheet = p.locator('.geri-bildirim .dugme');
    if (await sheet.count()) {
      const tip = await p.locator('.geri-bildirim').first().getAttribute('class');
      if (!gorulen.has('fb-' + tip) && ekran) { gorulen.add('fb-' + tip); await p.waitForTimeout(350); await p.screenshot({ path: `${klasor}/${ad}-geri-${tip.replace(/\W+/g, '-')}.png` }); }
      await sheet.first().click(); await p.waitForTimeout(60); continue;
    }
    const ic = p.locator('.oyuncu-sayfa').first();
    await ic.waitFor({ timeout: 4000 });
    const ipucu = (await ic.innerText()).slice(0, 60).replace(/\s+/g, ' ');
    let tur = 'genel';
    const say = async (s) => p.locator('.oyuncu ' + s).count();
    const altBirincil = p.locator('.oyuncu-alt .dugme.birincil');
    if (await say('.secenekler .secenek')) tur = 'mcq';
    else if (await say('.kart-kapali')) tur = 'kartlar';
    else if (await say('.kutu-izgara .kutu')) tur = 'eslestir';
    else if (await say('.cip[style*="font-size:1.05rem"]')) tur = 'cumle';
    else if (await say('textarea.metin-alani')) tur = 'metin';
    else if (await say('input.girdi[type=text], input.girdi[type=number]')) tur = 'girdi';
    else if (await say('.adim-sayac')) tur = 'sayac';
    else if (await say('.cip[aria-pressed]')) tur = 'cip';
    if (!gorulen.has(tur + ipucu.slice(0, 20))) {
      gorulen.add(tur + ipucu.slice(0, 20));
      await kontrolEt(p, `${ad}:${tur}:${ipucu.slice(0, 25)}`, sonuc);
      if (ekran) await p.screenshot({ path: `${klasor}/${ad}-${String(i).padStart(2, '0')}-${tur}.png` });
    }
    try {
      if (tur === 'mcq') {
        const n = await p.locator('.oyuncu .secenekler .secenek').count();
        await p.locator('.oyuncu .secenekler .secenek').nth(Math.floor(rastgele() * n)).click();
        await altBirincil.click();
      } else if (tur === 'eslestir') {
        const kutular = p.locator('.oyuncu .kutu-izgara .kutu');
        const n = await kutular.count();
        // çiftleri doğru eşleştirmek için ses/emoji bilinmediği için sırayla dene: sol-sağ tüm kombinasyonlar
        for (let a = 0; a < n; a += 2) {
          for (let b = 1; b < n; b += 2) {
            if (await kutular.nth(a).isDisabled()) break;
            if (await kutular.nth(b).isDisabled()) continue;
            await kutular.nth(a).click(); await kutular.nth(b).click(); await p.waitForTimeout(30);
          }
        }
        await p.waitForTimeout(100);
      } else if (tur === 'kartlar') {
        const kartlar = p.locator('.oyuncu .kutu-izgara .kutu');
        const n = await kartlar.count();
        const bilinen = new Map();
        for (let g = 0; g < 80; g++) {
          if (await p.locator('.geri-bildirim').count()) break;
          const kapali = [];
          for (let k = 0; k < n; k++) if (!(await kartlar.nth(k).isDisabled()) && (await kartlar.nth(k).textContent()) === '❓') kapali.push(k);
          if (!kapali.length) break;
          const a = kapali[0];
          await kartlar.nth(a).click();
          const ya = await kartlar.nth(a).textContent();
          let b = kapali.slice(1)[Math.floor(rastgele() * (kapali.length - 1))];
          await kartlar.nth(b).click();
          await p.waitForTimeout(1000);
        }
      } else if (tur === 'cumle') {
        const cipler = p.locator('.oyuncu .cip');
        const n = await cipler.count();
        for (let k = 0; k < n; k++) { if (await cipler.nth(k).isVisible()) { try { await cipler.nth(k).click({ timeout: 500 }); } catch {} } }
        await altBirincil.click();
      } else if (tur === 'metin') {
        if (await p.locator('.oyuncu textarea.metin-alani').first().isDisabled()) { await altBirincil.click(); await p.waitForTimeout(40); continue; }
        await p.locator('.oyuncu textarea.metin-alani').first().fill('elma\nkitap\nsaat\nanahtar şemsiye suda yaşar solungaç');
        // serbest ya da liste
        await p.waitForTimeout(50);
        if (await altBirincil.isDisabled()) await p.locator('.oyuncu-alt .dugme').first().click(); else await altBirincil.click();
      } else if (tur === 'girdi') {
        const girdiler = p.locator('.oyuncu input.girdi');
        const n = await girdiler.count();
        for (let k = 0; k < n; k++) {
          if (await girdiler.nth(k).isDisabled()) continue;
          const t = await girdiler.nth(k).getAttribute('type');
          await girdiler.nth(k).fill(t === 'number' ? '8' : (rastgele() < dogru ? 'apple' : 'xyz'));
        }
        await p.waitForTimeout(50);
        if (await altBirincil.isDisabled()) {
          const oneriler = p.locator('.oyuncu .esnek .cip');
          for (let k = 0; k < 9; k++) await oneriler.first().click({ timeout: 800 }).catch(() => {});
        }
        await altBirincil.click();
      } else if (tur === 'sayac') {
        await p.locator('.oyuncu .adim-sayac .dugme.birincil').first().click();
        await p.locator('.oyuncu .cip').nth(5).click().catch(() => {});
        await altBirincil.click();
      } else if (tur === 'cip') {
        await p.locator('.oyuncu .cip').nth(3).click();
        await altBirincil.click();
      } else {
        if (await altBirincil.isDisabled()) {
          // ses dinleme gerektiren sayfa: ses düğmesine bas
          const sd = p.locator('.oyuncu .ses-dugme').first();
          if (await sd.count()) { await sd.click(); await p.waitForTimeout(300); }
          if (await altBirincil.isDisabled()) { await p.locator('.oyuncu-alt .dugme').first().click({ timeout: 800 }).catch(() => {}); }
        }
        if (!(await altBirincil.isDisabled())) await altBirincil.click(); 
      }
    } catch (e) {
      sonuc.push(`[${ad}:${tur}] eylem hatası: ${e.message.split('\n')[0]} @ ${ipucu}`);
      if (ekran) await p.screenshot({ path: `${klasor}/${ad}-hata-${i}.png` });
      return { bitti: false, adim: i, hata: e.message };
    }
    await p.waitForTimeout(40);
  }
  sonuc.push(`[${ad}] ${azami} adımda bitmedi`);
  return { bitti: false };
}
module.exports = { gez, kontrolEt };
