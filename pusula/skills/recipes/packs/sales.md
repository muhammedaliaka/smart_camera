# Pack: Sales (pricing, launch, listing a product)

Read when the task prices a product, plans a discount, prepares a release on a store, or writes a sales or outreach plan. Facts read 2026-10-26 on the pages named. Labels: [official], [secondary], [reasoning], [unverified]. Money, prices, contracts and messages to customers are the user's decisions: propose, never apply (AGENTS.md: spending money and sending are irreversible).

## Sources first
- Steam pricing: https://partner.steamgames.com/doc/store/pricing. Steam Direct: https://partner.steamgames.com/steamdirect. Release process: https://partner.steamgames.com/doc/store/releasing. [official]
- Other stores, read 2026-10-26 through a page summarizer; re-read the page before a money decision. itch.io, https://itch.io/docs/creators/payments: default share 10%, the seller may set 0% to 100%; PayPal and Stripe take about $0.30 + 2.9% per payment; in Payouts mode funds arrive 7 days after purchase, minimum payout $5.00. [official] Apple, https://developer.apple.com/app-store/small-business-program/: 15% on paid apps and in-app purchases when proceeds were up to $1M last year and this year; the standard rate is not on that page. [official] Google Play, https://support.google.com/googleplay/android-developer/answer/112622: most markets 15% on the first $1M a year, 30% above, 15% for auto-renewing subscriptions; Australia, EEA, Japan, UK and US have a different split (10% + 5% billing fee on the first $1M); the summary was unclear, read the table. [official] Epic Games Store (Epic's forum announcement of 2025-06-03 and its Developer Portal Epic First Run page; the store's own page returns 403): 100% of the first $1M net revenue per product per calendar year on payments Epic processes (resets each 1 January), then 88/12; no application needed. Epic First Run, an opt-in exclusivity program, pays 100% for the first six months. Unreal Engine games: see `unreal.md` for the engine royalty. [official]

## Steam facts (as read)
- Fee: $100 per product, non-refundable but recouped from payments once the product reaches $1,000 adjusted gross revenue. Revenue share is **not** stated on that page: do not quote a percentage without reading the current agreement. [official]
- Order: sign paperwork, pay the fee, bank/tax/identity checks (the page says 15-30 days), build the page, pass review (1-5 days), wait 30 days after paying before the first release, keep a public "coming soon" page for at least two weeks. [official]
- Release page: store presence review typically 3-5 business days, submit at least 7 days before going live; releases are manual, nothing releases itself; "Release App" stamps the release time as now. [official]
- Price rules: base price at least the $0.99 tier equivalent; no price change within 30 days of release (except launch pricing errors); 37 currencies in 4 region groups; a missing currency makes the game unavailable there; regional methods are exchange rate, purchasing power, or multi-variable; price reviews take usually 1-2 business days. [official]
- Discount rules: none within 30 days of release or of a launch discount ending; a price increase in any currency starts a 30-day cooldown; maximum discount depends on the base tier ($0.99 tier up to 50%, $1.99 up to 75%, $4.99 up to 90%). Launch discount is allowed at first release. [official]

## Traps
1. A price typo in one currency can make the game unavailable or too cheap; review catches not every error. Re-read the whole table before saving. [official]
2. Raising a price near a planned discount blocks the discount for 30 days. Order the plan: price first, discount after. [official]
3. Early Access exit: price changes within 30 days of exit can stop the launch discount. [official]
4. Taxes, bank account name (must match legal ID) and business bank account for companies are real blockers: start early. [official]
5. Sales emails and cold outreach are marketing email: see `packs/marketing.md` for the consent and opt-out items. Outreach to a publisher or press is still sending: wait for a named yes. [reasoning]
6. Invented figures (conversion, revenue forecasts). Mark every number as sourced, user-given, or "assumption". [reasoning]

## Checks
- A dated checklist from today to release using the day counts above, each row with its source.
- Price table: one row per currency, no empty cells, minimum respected, discount ceilings checked against the tier.
- Forecasts show their inputs and say "assumption" where nothing is sourced.

## Done when
The plan file has the dated checklist, the price table is complete, every number has a source label, and no price, message or payment was sent or changed.
