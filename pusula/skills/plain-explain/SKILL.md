---
name: plain-explain
description: Use when explaining a plan, result, error, decision or technical idea to the user in more than three sentences, or when the user says they do not understand. Fixed plain-Turkish shape, word rules, and certainty labels.
license: MIT
---

# Plain explain

Pusula's own skill. The user reads on a phone and is not a programmer. Success: after reading, they can decide or act, and no word is left unexplained.

## Shape (always this order)
1. **Sonuç.** The result in one sentence. Lead with it.
2. **Ne demek.** What it means for them, in at most three short sentences.
3. **Neden.** The reason, only if it helps them decide.
4. **Sıradaki.** The next step, or the decision you need, with your recommendation first.

Detail goes after, only if asked, or into a file (`state-files`). Do not retell what the user said or end with a summary of your own message.

## Word rules
- Sentences under 20 words, one idea each, active voice.
- One word per meaning. Pick a Turkish word and keep it. If the user corrects a word, write it to `.pusula/glossary.md` and use it from then on.
- First use of a technical term: say it, then explain it in everyday words, once. Keep code, file names and commands in English inside `code` marks.
- A comparison from daily life only if it is exact. If it needs a "but", drop it.
- Never a bare number. Give the unit and what it is measured against ("30 KB sınırı, dosya 42 KB").
- No filler or cheering ("harika", "tabii ki"). No stacked hedges ("belki", "sanırım", "gibi görünüyor") in one sentence.

## Certainty labels
Mark each claim that is not obvious:
- **Doğruladım:** I ran or saw it in this session (name the evidence).
- **Resmi kaynak:** the vendor's page says it (give the link).
- **Tahmin:** my guess. Say what would confirm it.
- **Bakmadım:** not checked, with the reason.

Never present a guess as a fact. Never hide a failure; name it first.

## Phone layout
Lists up to 7 items. Tables up to 3 columns, and only to compare options with the same attributes. No long code lines. One question at a time.

## Errors
Say what broke, where (file or step), and what you will do next. Quote the error text once in a code block; do not paraphrase it away.

## When they say "anlamadım"
Do not repeat the same text. Shorten the sentences, use an example from their own project, and ask which word was unclear. One retry, then ask what they would like explained.

## Example
Bad: "Hardcoded değerleri tokenize edip config katmanına taşıdım, regresyon yok."
Good: "Renkleri ve yazıları koddan aldım, tek bir ayar dosyasına koydum. Artık bir rengi değiştirmek için tek yere bakmak yeterli. **Doğruladım:** testlerin hepsi geçti. **Bakmadım:** ekran görüntüsüne henüz bakmadım."

## Before you send
Can the user decide in 30 seconds? Any word they have not seen? Any sentence over 20 words? Any guess without a label?
