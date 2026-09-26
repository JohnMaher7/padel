# Decisions

The single source of truth for what this project is and why. Settled in a grilling session on 2026-09-24. When a decision changes, edit it here and note the date.

## Purpose

- A **learning-first** project that may earn money, run at 5–10 hrs/week.
- The owner wants to *understand* what is built, not just own it. Every milestone ends with a learning page (see `CLAUDE.md`).

## Product

A library of padel tactics and shots, taught through animated SVG scenes. It's written in English, and the owner is based in Ireland, so money, legal matters and prices are in euro.

- **Situations**: the "chess of padel" (e.g. "Opponents lob you").
- **Shots**: how and when to play each one (e.g. bandeja).
- Situation pages link to the shots they use; shot pages link back to the situations they're used in.
- Every topic page: **general advice** for all levels, then a **Beginner** tab ("keep the ball in play, low-risk") and an **Advanced** tab ("be aggressive"). Each tab gets its own animation where the right play differs. The level is the player's overall level; there is no "your level vs opponent level" grid.
- **Content sourcing**: Opus researches coaching advice online. Good advice can be reused freely, but it's always reworded in our own words and nobody's animation is copied. The owner checks each topic before it goes live.
- **Draft flag**: each topic has `draft: true | false`. Drafts render locally only; the owner flips the flag after checking.

### Paths: "Start here" is the front door (chosen 2026-09-26)

The owner raised this at the start of milestone 6: a home page that only says "pick a moment" leaves a newcomer with no idea where to start.

- **Topics are songs and paths are playlists.** A path is one file listing topics in order. It adds no content, and a topic is never copied into a path. The library stays, and each topic still stands on its own, because search visitors land straight on a topic page.
- **"Start here" follows one point from start to finish**, not a difficulty curve:
  1. Where to stand at the start of a point (see below)
  2. Returning serve
  3. Ball off the back glass
  4. When to take the net
  5. Hitting down the middle
  6. Opponents lob you

  This is the pitch: "a padel point in six moments".
- **Every topic in a path shows where it sits**, e.g. "Start here · 5 of 6", with previous/next links and a link to step 1. That strip is what turns someone arriving from Google into a path follower.
- **The home page leads with "New to padel? Start here"**, with the court map and the list below it as "or jump to a moment".
- **Progress ticks:** a topic counts as watched once its animation reaches the end. The tick is kept in the browser, like the level choice, so no accounts are needed.
- A later **"Next level"** path picks up Both teams at the net, serving formations and the Advanced tabs.
- **Positioning:** padel is won by where you stand, not how hard you hit. Most coaching on YouTube is technique in long videos. Ours is positioning, in 30-second scenes that stop and ask you to decide.

### "Where to stand at the start of a point" (chosen 2026-09-26)

- **One animation with no tabs**, for every level, so there's nothing to tap before you learn. It has four short chapters: you serve, your partner serves, they serve to you, they serve to your partner. Each chapter makes clear who's serving and which player is you. It then plays the serve and the first shot or two while everyone moves to their spot.
- **Each chapter stops on "Where do you stand?"** before the players move. That's the site's usual decision moment, once per chapter. (Claude's proposal; the owner can drop it.)
- **Anchors:** landmarks you can see on a real court are highlighted on the drawn court as the caption mentions them. The owner's examples: at the net, stand in line with the second post; to return, stand by the joint in the side glass. Research checks every anchor against coaching sources and the court's dimensions before we use it, because post spacing varies between court makers.
- **What the engine needs:** chapters, where the ball and the players reset between them and the progress bar and the steps list mark each one, so a viewer can jump to theirs in one tap. It also needs a decision moment per chapter, highlighted landmarks, the mesh posts drawn on the court, and a topic that has one play for all levels.
- Advanced serving formations (Australian, I-formation) will be a separate topic later.
- **Milestone 6 proves the pipeline on "Returning serve" first**, because it uses the current format. "Where to stand" comes next, with its engine changes, so we don't try two new things at once.

### Platform: a website for phone and laptop (chosen 2026-09-25)

The owner weighed three options at the start of milestone 4 and chose a website that works on both phone and laptop.

- **Designed for the phone first.** Most visitors will be on a phone, at the club or just before a match. The laptop gets its own layout rather than a stretched phone column: the court stays in view on the right while you read on the left.
- **Why a website:** a tactics library is found through search, and Google can index a web page but can't see inside an app. A link shared in a club WhatsApp group opens straight away, with nothing to install. There's one codebase, and a `git push` puts it live.
- **Not chosen: a phone-only site.** It saves very little work, and on a laptop it would look unfinished. The owner also reviews every topic on a laptop.
- **Not chosen, for now: an app.** It would mean two app stores, a review before every content fix, and probably rebuilding the engine. Revisit only if we need something only an app gives, such as push notifications or offline use at the club. Even then, start by making the site installable, or by wrapping it, rather than rewriting it.

## Animations

- **Top-down, vertical court** that fits a phone held upright.
- **Animated player figures**, not dots. Their design is part of the visual style below.
- The ball has a **shadow**; when ball and shadow separate, the ball is high, which shows lobs.
- The glass walls are drawn so **wall bounces** are visible.
- Captions are timed to the action. The animation **pauses automatically at the decision moment** and resumes when the viewer taps.
- Controls: play/pause, replay, 0.5× speed.
- **The quality bar is high.** Unclear or ugly scenes mean users don't return.

### Visual style: "Broadcast" (chosen 2026-09-24)

The owner picked option A of three in milestone 2: a drone camera over a real indoor court.

- **Court**: blue turf in faint 2 m bands, white service lines, a net that casts a shadow. Glass at both ends and along the first 4 m of each side, with panel joints and reflections. Mesh in between.
- **Players**: top-down athletes with head, shoulders, arms and a racket that swings on each shot. Their legs stride when they run, and each one casts a shadow. They're drawn at 1.25× life size so they're easy to see on a phone. Our team wears orange and the opponents wear white. "You" gets a yellow YOU tag and a ring on the ground.
- **Ball**: yellow with a short motion trail. Its shadow falls down and to the right, and the higher the ball, the further apart the two are. During lobs a chip shows the height ("5.8 m"). A floor bounce shows as a ring and a glass hit as a flash on the glass.
- **Captions** sit in a TV-style bar *under* the court, never over it, so they can't hide the action. The bar shows "Step n of N". At the decision moment it turns yellow and the play button becomes "Continue".
- **Controls**: play/pause, replay, 0.5×, and a progress bar with a mark at the decision moment.
- Not chosen: B "Tactics board" (magnets, marker trails, a numbered step list) and C "Illustrated" (cartoon characters, speech bubbles). All three are kept on the `prototype/visual-style` branch for reference.

## Architecture

- **Sheet music, not recordings.** Each scene is a small **data file** (player routes, shots, captions over time). One shared engine plays any scene. The AI writes scene data, never whole animated SVG files.
- Stack: **Astro** (static site) + **GSAP** (animation timelines) + **TypeScript** (scene format is type-checked, so a broken scene fails the build) + **Cloudflare** (hosting, auto-deploys from GitHub). The plan said Cloudflare Pages; milestone 5 chose Cloudflare Workers instead (see Hosting).
- A static site for now. A server gets added only if the marketplace or coach listings arrive.

### Engine and scene format (settled in milestone 3, 2026-09-25)

- **A scene says only what a coach would draw:** each player's route (keyframes of time, position and facing), the shots, the captions and the decision moment. A shot says who hits, when, where the ball first lands, and either how high it peaks or how long it flies. **Only the opening shot says where the ball starts.** After that, the ball is wherever physics has carried it, and the hitter has to be there. The format lives in `src/engine/types.ts`.
- **The engine works out the ball's whole path**: gravity in the air, then floor, glass and mesh bounces, then rolling. A floor bounce never changes the ball's heading. A wall reverses only the motion going into it. The physics numbers are in `src/engine/court.ts`.
- **Mistakes are blocked in two layers.** The type check rejects shapes that make no sense (a `from` on a later shot, a peak *and* a flight time, a fifth player). The validator (`src/engine/validate.ts`) rejects scenes that break padel or look fake: a hitter more than 1.2 m from the ball, a ball that bounces twice before it's hit, a shot into the net or out, the same team hitting twice, players running faster than 7 m/s or crossing the net, captions out of order. Every problem message says when it happens and what to change. Both layers run in `npm run build`, so a broken scene can't deploy.
- For now, **a ball that flies out over the walls is an error.** Relax this when a scene needs a smash that goes out of the court.
- Captions have only a start time; each one runs until the next. So gaps and overlaps can't be written.
- **Captions are headlines, and each one gets time to be read (chosen 2026-09-26).** At 1× speed a caption stays on screen for at least 0.5 s plus 0.25 s per word, so a 6-word caption needs 2 s. **The animation never waits for a caption**; only the decision moment stops it. When a caption doesn't fit, shorten it, merge it with a neighbour or drop it, since the action often says it already. The longer explanation goes in the step's detail, which shows in the steps list under the animation rather than in the bar. The validator will check this. Both current scenes break the rule (the Advanced lob gives 16 words 0.8 s), so milestone 6 re-cuts their captions.
- The four players are always `you`, `partner`, `opp1` and `opp2`. The name sets the team.
- **GSAP is the playback clock**, not the animator. Its timeline handles play, pause, seek, 0.5× and the stop at the decision moment. On every frame the renderer asks the engine where everything is at the timeline's time and draws that. Nothing is tweened.
- At contact the racket points at the ball, whichever way the player faces, so every hit visibly connects.
- Scenes live in `src/scenes/<topic>.<level>.ts` and are listed in `src/scenes/index.ts`. Each one gets a test page at `/test/<topic>.<level>`, and `?t=4.1` freezes it at a moment. The live site has test pages only for published topics, so a draft's animation can't leak out through them. `npm run scene` prints every hit and bounce the engine worked out, where each hitter stands, and any problems.

### Site structure (settled in milestone 4, 2026-09-25)

- **Words live in Markdown, named like the scenes.** For each topic:
  - `src/content/topics/<topic>.md` holds the general advice.
  - `src/content/plays/<topic>.<level>.md` holds each level's play.
  - `src/scenes/<topic>.<level>.ts` holds each level's animation.

  `src/lib/topics.ts` checks that they line up, so a missing play or scene stops the build and says which file to add.
- **URLs**: situations live at `/situations/<topic>`. Shots will live at `/shots/<topic>` once they're written. Until then, a play lists its shots by name without a link.
- **Drafts** are built only by `npm run dev`, and each carries a yellow note saying how to publish it. `npm run build` leaves them out entirely, so a draft can't reach the live site. (The repo on GitHub is public, though, so anyone can read a draft's Markdown there.)
- **The level remembers itself.** The reader's choice of Beginner or Advanced is kept in their browser and applies on every topic. `#advanced` on a link opens that tab.
- **The steps under each animation are its captions**, taken from the scene data rather than written twice. The list follows the animation, and tapping a step plays from there. The list is also the text version of the animation.
- **Home page**: a map of our half of the court, with each situation pinned where it starts (`spot` in the topic's Markdown), beside a plain list of the situations.
- **Site look**: the court itself. Text sits on "line white" paper, and animations sit on blue turf. The Beginner/Advanced switch is drawn as the two service boxes. Orange only ever means your team, and yellow only ever means the decision. Type is Barlow Condensed for headings and Barlow for text, as in the scene player. Dark mode follows the phone's setting.
- **Working name**: "Padel tactics", set in one place (`src/site.ts`) until the name is chosen in milestone 7.

### Hosting (settled in milestone 5, 2026-09-26)

- **Cloudflare Workers, not Cloudflare Pages.** The plan said Pages. When we came to deploy, Cloudflare's docs were steering new projects to Workers, which now serves plain files too. Pages still works, but new features go to Workers. For a static site both are free and behave the same. Workers is also where server code would go if the marketplace or coach listings ever arrive, so starting there avoids a move later. What it costs us: the address has the account name in it, as in `padel.johnmaher0.workers.dev`, where Pages would have given the shorter `padel.pages.dev`. And a custom domain needs its DNS run by Cloudflare (free).
- **No server code.** Cloudflare hands out the files that `npm run build` writes to `dist/`, and `dist/404.html` for pages that don't exist. `wrangler.jsonc` says so and names the Worker `padel`, the same as the dashboard. (It said `padel-tactics` at first. Cloudflare's builds quietly swapped in the dashboard's name, although one of its docs pages says a mismatch fails the build. A deploy from the laptop wouldn't be swapped, so it would have made a second Worker.)
- **Live at https://padel.johnmaher0.workers.dev** since 2026-09-26.
- **`main` is the live site.** A push to `main` builds and deploys it. Cloudflare doesn't report build results to GitHub, so a failed build shows only on the Worker's **Deployments** page in the Cloudflare dashboard. Any other branch gets its own preview address, so work can be checked on a phone before it goes live. (Until milestone 5, all the work was on the branch `claude/elegant-einstein-4x90jy`.)
- **The build is the gate.** Cloudflare runs `npm run build`, which runs the type check, the tests and the validator before it builds anything. If any of them fails, nothing deploys, and the live site stays on the last good version.
- **The settings live in the repo**, not only in the dashboard: `wrangler.jsonc` says how to serve the site, `.node-version` sets Node 24 (as on the laptop), and `public/_headers` sets the response headers. The dashboard holds only the build command (`npm run build`) and the branch.
- **Hidden from search engines until the name and domain are chosen.** `public/_headers` sends `X-Robots-Tag: noindex` with every page, so Google doesn't list a temporary address that would later have to be moved. The site can still be shared by link.
- **Addresses have no trailing slash** (`/situations/opponents-lob-you`). Astro writes each page as a `.html` file, so Cloudflare serves that address directly, and `/situations/opponents-lob-you/` redirects to it. With the default `index.html` folders, every tap on a topic cost a redirect first.
- **It costs €0.** Cloudflare's free plan allows unlimited visits to static files and 3,000 build minutes a month (a build takes a minute or two), and it allows commercial sites. A public GitHub repo is free. Not chosen: Vercel's free plan, which forbids commercial use, and GitHub Pages, which isn't meant for a site that makes money. The first real cost is the domain in milestone 7. Workers' paid plan ($5 a month) would only be needed for server code beyond the free allowance.
- **When the domain arrives (milestone 7):** move the domain's DNS to Cloudflare, attach the domain to the Worker, delete the noindex rule from `public/_headers`, and turn off or redirect the `workers.dev` address.

## Shot pages at launch

Written step-by-step technique + embedded YouTube coach clips, set to start at the relevant moment. Side-view animated technique figures come later, once the court animations are polished.

## Launch set

Build **"Opponents lob you"** fully end to end first, then the rest:

- Situations: the six "Start here" topics: Where to stand at the start of a point, Returning serve, Ball off the back glass, When to take the net, Hitting down the middle, Opponents lob you. (Both teams at the net was replaced on 2026-09-26 and moved to the "Next level" path.)
- Shots: Lob, Volley, Bandeja, Chiquita.

## Milestones

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Design settled | done 2026-09-24 |
| 2 | Visual style: 3 options of one scene (including player figures); owner picks | done 2026-09-24 (chose A, "Broadcast") |
| 3 | Animation engine + scene data format, with "Opponents lob you" playing on a test page | done 2026-09-25 |
| 4 | Astro site skeleton with the first topic page and tabs | done 2026-09-25 (phone + laptop site; first topic published) |
| 5 | Deploy to Cloudflare (`*.workers.dev`; planned as `*.pages.dev`) | done 2026-09-26 (live at `padel.johnmaher0.workers.dev`) |
| 6 | Content pipeline: Opus researches → drafts text + scene data → preview → owner checks | |
| 7 | Launch set of 10 topics, then choose a name and domain | |

The engine (3) comes before the site (4) on purpose: the animation is the riskiest and most important part, so it gets proven first.

## Open issues

- **Short laptop screens lose the fixed court.** On a laptop window under 740 px tall, the court panel scrolls with the page instead of staying in view, because the whole player wouldn't fit.

### Resolved

- **"Opponents lob you" signed off.** Milestone 4 added its Advanced play: the same lob as the Beginner scene, taken in the air with a bandeja from just in front of the service line to keep the net. The coaching was researched and reworded (The Padel School, padel-rules.com, Padel Point, Minter Dial). The owner set `draft: false` on 2026-09-25.
- **The ball swerved at bounces.** Spotted by the owner in the milestone 2 prototype on 2026-09-24 and fixed in milestone 3 on 2026-09-25. At 3.6 s the lob left a bounce on a heading 17° off the one it came in on, so it looked as if it had deflected off the players. *Cause:* the scene data placed every bounce by hand. *Fix:* scenes now describe only the shots, and the engine works out the bounces. A test checks every bounce in every scene: a floor bounce keeps the heading, and a wall reverses only the motion into it.

## Deferred (decided: not now)

- **How the site makes money.** Candidates: affiliate gear links (no Amazon.ie, so Amazon.co.uk/.de or EU padel shops), and coach listings. A flat listing fee avoids the booking and payment work that a commission would need.
- **Second-hand gear marketplace.** A two-sided cold-start problem plus payments, fraud and consumer law. Revisit once there's traffic.
- Email list, analytics, name and domain, a Spanish version, AI-generated video.
- **Voiceover** (looked at on 2026-09-26, trial deferred). It's feasible. The captions are the script, and a build script sends each one to a cloud text-to-speech service (Google, Azure or OpenAI; Azure has Irish-English voices) and commits the MP3s. The whole launch set comes to about 10,000 characters, which the free tiers cover. Not chosen: the browser's built-in voice (robotic, and different on every phone), ElevenLabs (the most human, but about €5 a month for commercial use), and recording the owner's voice (every caption change means re-recording). Voice would be off by default behind a speaker button that remembers its setting, because phones at the club are in public. It would be muted at 0.5×. The caption timing rule above already gives each line enough time to be spoken. When it's picked up, trial it on one scene first.
