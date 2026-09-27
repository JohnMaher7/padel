# Research: a name and a domain

Researched 2026-09-27 for milestone 7, part 5. Nothing has been bought or registered. The owner chooses; this file gives the options, what the lookups returned, and the costs in euro against the cheaper options.

What we're naming: a phone-first library of padel positioning, taught in 30-second top-down scenes that stop and ask you to decide. English, international audience. Hosted free on Cloudflare Workers; the domain's DNS will move to Cloudflare.

**How availability was checked** (all on 2026-09-27, about 12:30 UTC):

- `.com`: RDAP at Verisign, the `.com` registry (`https://rdap.verisign.com/com/v1/domain/<name>.com`). rdap.org rate-limited us after about 10 lookups, and WebFetch got a 403 from it, so the lookups went straight to the registries with curl/Python.
- `.app`: RDAP at Google Registry (`https://pubapi.registry.google/rdap/domain/<name>.app`).
- `.ie` and `.io`: these have no RDAP service listed (rdap.org answers "No RDAP service is available for this resource", which does **not** mean free), so they were checked by WHOIS on port 43 at `whois.weare.ie` and `whois.nic.io`.
- "404" or "Not found" means no registration exists, so the name can be registered at the normal price. It doesn't rule out a registry "premium" price on `.app`; the registrar's search shows that at checkout.
- A trademark database search (EUIPO/TMview) could not be run automatically. Before buying, spend two minutes on [TMview](https://www.tmdn.org/tmview/) with the chosen name.

## Candidate names

| Name | Domain(s) checked | Availability (what the lookup said) | Clashes found | Notes |
|---|---|---|---|---|
| **Padel Positions** | padelpositions.com, .ie, .app, .io | All free. .com: RDAP 404. .ie: "Not found". .app: RDAP 404 "not found". .io: "Domain not found." | No business uses it. The phrase appears in guide titles (e.g. Simple Padel's "guide to positions in padel"). The singular padelposition.com was registered 2025-06-05 (GoDaddy); no site answers. | Plain and descriptive; says exactly what the site teaches, and it's something people search for. Too generic to trademark. |
| **Standpoint Padel** | standpointpadel.com, .ie, .app, .io | All free (.com RDAP 404; .ie "Not found"; .app RDAP 404; .io "Domain not found.") | None found. Unrelated "Point Padel Club" (Texas) and "Padel Point Club" (El Paso). | A pun on "where you stand"; a real word, easy to say. Long to type (15 letters). |
| **Tiny Court** | tinycourt.com, .ie, .app, .io | All free (same results as above) | None in padel. There's a "Tiny Tennis" phone game and Portico's "MINI" padel court for kids. | Brandable and short. It suggests the animated court, but "padel" isn't in the name, so it needs a strapline. |
| Padel Scenes | padelscenes.com, .ie, .app, .io | All free | "The Padel Scene" clothing brand (thepadelsceneclothing.com) | "Scenes" is our internal word. To outsiders it reads as "the padel scene", the social scene. |
| Padel Decisions | padeldecisions.com, .ie, .app, .io | All free | PadelDecide (padeldecide.com, registered 2026-07-18): a Spanish site on choosing gear. Padel Smarts uses "test your decisions" in its copy. | Clear, but it sits in a crowded word space (see "Worth knowing"). |
| Thinking Padel | thinkingpadel.com, .ie, .app, .io | All free | Think Padel, a club in Belgrade (thinkpadel.rs) | Says "tactics", not "positioning". |
| Padel in 30 | padelin30.com, .ie, .app, .io | All free | "Padel 30" booking app and club (France); "Thirty30 Padel" scoring format | Spoken, it's unclear whether to type "30" or "thirty". |
| Birdseye Padel | birdseyepadel.com, .ie, .app, .io | All free | Birds Eye, the frozen-food brand; many clubs post "bird's-eye view" drone clips | Spelling is ambiguous (birdseye / birds-eye / bird's eye). |
| Four on Court | fouroncourt.com, .ie, .app, .io | All free (.app hit a 429 the first time; the retry gave RDAP 404) | None found | "Four" or "4"? Typed, "fouroncourt" reads oddly. |
| Padel Chalk | padelchalk.com, .ie, .app, .io | All free | **Chalk Padel**, a real three-court club in Pewsey, Wiltshire (chalkpadel.co.uk, on Playtomic) | Its name reversed. Avoid. |
| Court Chess | courtchess.com, .ie, .app, .io | All free | **Padel Chess** (padelchess.me): padel tactics puzzles, claims 41,000+ users; padelchess.com was registered 2025-10-25 | Too close to a direct competitor. Avoid. |
| Padel Tactics (working name) | padeltactics.com, .ie, .app, .io | .com **taken**: registered 2018-04-14 at Dynadot, parked on a Dynadot "For Sale" page (price hidden behind a browser check). .app **taken**: registered 2026-08-22 at OVH. .io **taken**: registered 2026-08-22 at OVH. .ie free ("Not found"). | "Padel Tactics" iOS app (Marti Ferret); "Padel Tactic", a company in Ourense, Spain; "Padel – All My Tactics" app | Only .ie is left, and the name is crowded. Drop it. |

**Also checked, `.com` taken:** padelplaybook, padelmoves, padelsense, padelboard, padelwise, padelmap, padelgrid, padelmind, padelpath, padelpause, padelplays (registered 2026), padeliq, padelbrain, padelposition, padelogic, padellogic, padelcue (2026), padelthink, padeltactic, padelcraft (2026), padelsmarts (2026-08-21, live), padelplan, padelspace, courtwise, glasswise, courtmap, courtsense, secondpost, wheretostand (registered 2026-09-23 at Cloudflare, four days before this check).

**Also free, not shortlisted:** padelpositioning.com, padelreads.com, padelshapes.com, padelfromabove.com, topdownpadel.com, padelgeometry.com, padelplacement.com, tacticspadel.com, pistawise.com, padelnous.com, yourmovepadel.com.

**Worth knowing:** the "decide what to do in a real situation" idea already has at least two players: **Padel Chess** (puzzles, claims 41k users) and **Padel Smarts** (padelsmarts.com, registered August 2026: "Play through real situations, test your decisions"). Names built on *chess*, *smart*, *IQ* or *decide* would blur into them. What sets us apart is *positioning* and *animation*, which is an argument for "Positions" or "Standpoint".

## Costs

Rate: **1 EUR = 1.1403 USD** (ECB reference rate, 25 Sep 2026), so $1 = €0.877. Irish registrars quote prices ex VAT, and **23% Irish VAT has been added** below. The US registrars (Cloudflare, Porkbun, Namecheap) show prices without VAT. Cloudflare's sales-tax page lists no EU country, and Namecheap has historically not charged EU VAT. Confirm at checkout; the worst case is +23%.

| Registrar | TLD | First year € | Renewal € | Notes |
|---|---|---|---|---|
| **Cloudflare** | .com | **9.17** ($10.46) | **9.80** ($11.17) from 1 Nov 2026 | At cost (registry + $0.20 ICANN fee, no markup). Verisign raises the `.com` wholesale price from $10.26 to $10.97 on 1 Nov 2026. Free WHOIS redaction. Must use Cloudflare nameservers (which we want anyway). Up to 10 years at once. |
| Cloudflare | .app | 12.45 ($14.20) | 12.45 | At cost |
| Cloudflare | .io | 28.06 ($32.00) | 43.85 ($50.00) | Renewal jumps |
| Cloudflare | .ie | not offered | – | Not on Cloudflare's TLD list (supported ccTLDs include .uk, .co, .me, .us, but not .ie) |
| Porkbun | .com | 9.72 ($11.08) | 9.72 today; likely ~10.34 after 1 Nov | Free WHOIS privacy. Doesn't sell .ie. |
| Porkbun | .app / .io | 7.67 / 24.66 | 13.09 / 45.43 | First-year promos |
| Namecheap | .com | 10.07 ($11.28 + $0.20 ICANN) | 16.38 ($18.48 + $0.20) | Free privacy. Doesn't sell .ie ("Unsupported TLD"). Prices from domainoffer.net because Namecheap blocks automated fetches. |
| Blacknight (Irish) | .com | 9.83 (€7.99 promo + VAT) | 24.59 (€19.99 + VAT) | Renewal is 2.5× the first year |
| Blacknight | .ie | 7.37 (€5.99 promo + VAT) | 45.50 (€36.99 + VAT) | Accredited .ie registrar |
| LetsHost (Irish) | .com | 6.14 (€4.99 + VAT) | 32.58 (€26.49 + VAT) | Cheapest first year, then the dearest |
| LetsHost | .ie | 4.29 (€3.49 + VAT) | 57.80 (€46.99 + VAT) | Same pattern |
| Maxer (Irish) | .ie | 22.74 (€18.49 + VAT) | 23.97 (€19.49 + VAT) | No promo, but the cheapest .ie over time (renewal per iedomaincompare.ie, checked 10 Sep 2026) |

**Five years of a `.com`, at today's prices:** Cloudflare ≈ €48, Porkbun ≈ €51, Namecheap ≈ €76, Blacknight ≈ €108, LetsHost ≈ €136. Verisign may raise the wholesale price by up to 7% in each remaining contract year, which moves every registrar's price.
**Five years of a `.ie`:** Maxer ≈ €119, Blacknight ≈ €189, LetsHost ≈ €235.

**Small print:**

- **Promo trap:** the cheap first years (LetsHost, Blacknight, Porkbun .app/.io, Cloudflare .io) jump at renewal. Compare renewal prices, not first-year ones.
- **Transfer lock:** a new `.com`/`.app`/`.io` can't be moved to another registrar for 60 days after registration (an ICANN rule), or for 60 days after a change of owner.
- **Cloudflare Registrar:** the domain must keep Cloudflare nameservers while it's registered there. Auto-renew runs about 30 days before expiry.
- **WHOIS privacy:** free at Cloudflare (redacted by default), Porkbun and Namecheap. For `.ie`, individuals aren't shown in WHOIS (GDPR).
- **`.io`** belongs to the British Indian Ocean Territory. The UK–Mauritius treaty on the Chagos Islands (signed 22 May 2025) isn't ratified and `.io` works normally, but if the country code is ever withdrawn, ICANN's retirement process takes at least five years.
- **Search:** Google treats `.ie` as a strong signal that a site is *for Ireland*. It treats `.io` (and `.me`, `.tv`) as generic, like `.com`. For an international audience, `.ie` works against us.

## The .ie rules

- **You need a real connection to the island of Ireland, plus proof of identity.** For an individual, one document usually covers both: an Irish passport, an Irish/UK driving licence or an Irish/NI bank statement with an address on the island, a college ID, a Public Services Card, or a Revenue letter showing your PPS number. A utility bill also needs photo ID.
- A **sole trader** also shows a commercial identity (business name registration, Irish VAT number, tax clearance certificate or a trademark).
- There has been **no "claim to the name"** since 21 March 2018: any free name can be registered, first come, first served.
- Sold **only through accredited .ie registrars** (Blacknight, LetsHost, Maxer, Register365 and others). Cloudflare, Porkbun and Namecheap can't sell it. Applications are usually processed within 3 hours on weekdays.
- **Late renewal costs extra:** since 1 Aug 2025, a `.ie` more than 45 days overdue goes into redemption, with a restore fee of €48 + VAT (€59.04).
- A `.ie` bought elsewhere can still point its nameservers at Cloudflare, so the Worker setup is the same.

## Does the custom domain cost anything on Cloudflare?

**No. The domain is the only cost.**

- A Worker **Custom Domain** needs an active Cloudflare zone (the domain's nameservers pointed at Cloudflare) and a Worker. Cloudflare creates the DNS record and the certificate itself. The docs list no charge, and the Free plan zone is €0.
- **Requests to static assets are free and unlimited**, on the Free plan too. The 100,000 requests/day Free limit applies to requests that run Worker code, and this site is static files.
- Serve `www` as a second Custom Domain, or redirect it to the bare domain. Either way it's free.

## Recommendation

All three picks cost the same, because the cheapest way to hold any `.com` is Cloudflare Registrar, and it also makes the DNS move a non-step: the domain is born on Cloudflare's nameservers, ready to attach to the Worker.

| # | Pick | Domain | Year 1 | Every year after |
|---|---|---|---|---|
| 1 | **Padel Positions** | padelpositions.com at Cloudflare | **€9.17** if bought before 1 Nov 2026 | **€9.80** |
| 2 | **Standpoint Padel** | standpointpadel.com at Cloudflare | €9.17 | €9.80 |
| 3 | **Tiny Court** (strapline: "padel positioning in 30-second scenes") | tinycourt.com at Cloudflare | €9.17 | €9.80 |

1. **Padel Positions**: says what the site is in two words people already search for, is easy to say at the club, and has all four endings free. Its weakness: it's generic, so it can't be trademarked, and some typos will land on padelposition.com.
2. **Standpoint Padel**: our tagline in one word ("won by where you stand"), and more ownable than #1. It's longer to type.
3. **Tiny Court**: the most brandable and memorable. It describes the animated court but doesn't say "padel", so it relies on a strapline.

**The cheaper alternatives, and when paying more is worth it:**

- **Nothing is cheaper per year** for a `.com` than Cloudflare. LetsHost is €3 cheaper in year one (€6.14), then €32.58 a year. The only cheaper route is **€0**: keep `padel.johnmaher0.workers.dev`, at the cost of a forgettable address and a `noindex` site.
- **Buy before 1 Nov 2026** to get the $10.46 price. Prepaying several years locks the old wholesale price, but it saves only about €0.63 a year, so one year is fine.
- **Paying more, with an Irish signal:** add the matching `.ie` at Maxer (≈ €24/yr) and redirect it to the `.com`, for about €34 a year in total. It's not worth it for an international site, because Google reads `.ie` as Ireland-targeted. `.app` (€12.45) or `.io` (€28 rising to €44) add nothing that `.com` doesn't.
- **Paying more at an Irish registrar** (Blacknight .com, €24.59 a year from year two) buys local support and an Irish invoice, but the DNS still has to move to Cloudflare.

## Sources

Availability:

1. Verisign `.com` RDAP: https://rdap.verisign.com/com/v1/domain/padelpositions.com (same URL pattern for each name)
2. Google Registry `.app` RDAP: https://pubapi.registry.google/rdap/domain/padelpositions.app
3. rdap.org bootstrap (no RDAP for `.ie`/`.io`): https://rdap.org/domain/google.ie
4. `.ie` WHOIS: `whois.weare.ie` port 43. `.io` WHOIS: `whois.nic.io` port 43.

Prices and rules:

5. ECB euro reference rates, 25 Sep 2026: https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml
6. Cloudflare TLD policies (supported TLDs): https://www.cloudflare.com/tld-policies/
7. Cloudflare Registrar prices tracker (updated 2026-09-27): https://cfdomainpricing.com/
8. Cloudflare Registrar FAQ: https://developers.cloudflare.com/registrar/faq/
9. Cloudflare WHOIS redaction: https://developers.cloudflare.com/registrar/account-options/whois-redaction/
10. Cloudflare, register a domain (term up to 10 years): https://developers.cloudflare.com/registrar/get-started/register-domain/
11. Cloudflare sales tax: https://developers.cloudflare.com/billing/understand/sales-tax/
12. Verisign `.com` price rise, Domain Name Wire, 23 Apr 2026: https://domainnamewire.com/2026/04/23/breaking-verisign-raising-wholesale-com-prices/
13. Porkbun pricing API: https://api.porkbun.com/api/json/v3/pricing/get and https://porkbun.com/tld/com
14. Namecheap `.com` prices (checked 27 Sep 2026): https://domainoffer.net/tld/com/namecheap
15. Namecheap doesn't sell `.ie`: https://bmcgee.ie/posts/2022/11/irish-tlds-are-a-bit-different/
16. Blacknight price list: https://www.blacknight.com/price-list/
17. LetsHost prices: https://www.letshost.ie/domain-name-registration/domain-pricing/
18. Maxer `.ie`: https://www.maxer.com/iedomains
19. `.ie` price comparison (10 Sep 2026): https://iedomaincompare.ie/
20. `.ie` redemption fee from 1 Aug 2025: https://billing.letshost.ie/index.php?rp=%2Fannouncements%2F25
21. .IE documents required: https://www.weare.ie/document-requirements/
22. .IE FAQ: https://www.weare.ie/frequently-asked-questions/
23. .IE liberalisation (no claim to the name since 2018): https://www.weare.ie/liberalisation/
24. Google on ccTLDs and generic ccTLDs: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
25. ICANN on the Chagos Archipelago and `.io`: https://www.icann.org/en/blogs/details/the-chagos-archipelago-and-the-io-domain-14-11-2024-en
26. Workers pricing (static assets free and unlimited): https://developers.cloudflare.com/workers/platform/pricing/
27. Workers Custom Domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/

Clashes:

28. Padel Chess: https://www.padelchess.me/
29. Padel Smarts: https://padelsmarts.com/
30. "Padel Tactics" iOS app: https://apps.apple.com/in/app/padel-tactics/id6747597860
31. Padel Tactic (Ourense): https://tracxn.com/d/companies/padel-tactic/__HwYVQtICnOnzRr6jj9EBpfRZQqJw1EUYAtPJAwbOj4Y
32. Chalk Padel: https://www.chalkpadel.co.uk/
33. The Padel Scene: https://www.thepadelsceneclothing.com/
34. Think Padel: https://thinkpadel.rs/
35. Padel 30 app: https://apps.apple.com/kw/app/padel-30/id6746756218 and Thirty30 Padel: https://www.thirty30padel.com
36. PadelDecide: https://padeldecide.com/
37. Portico MINI padel court: https://www.porticosport.com/mini
38. Simple Padel, positions guide: https://simplepadel.com/ultimate-guide-to-positions-in-padel/
