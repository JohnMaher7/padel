# Decisions

The single source of truth for what this project is, what's settled and what's next. When a decision changes, edit it here and note the date. History lives in git and in the learning pages, not here.

## Next: milestone 7

Milestone 7 turns the site into an organised library and completes the launch set. Do the parts in this order. Each topic goes through the `new-topic` skill on its own branch, gets checked by the owner on the preview, and is merged to `main`.

1. **The organised library** (see "Start here" below). A path file, the path strip on each topic, and a home page that leads with "Start here". Build it first, so that every new topic lands in its place. Steps that aren't published yet show as "coming soon" and aren't links. *Built on 2026-09-27 on the branch `library/start-here`. It merges to `main` once the owner has checked it on the preview.*
2. **Engine work for "Where to stand"** (see its section): chapters, a decision moment per chapter, highlighted landmarks, mesh posts drawn on the court, and a topic with one play for all levels. Then write the topic.
3. **The rest of Start here**, in path order: Ball off the back glass, When to take the net, Hitting down the middle.
4. **The shot pages**: Lob, Volley, Bandeja, Chiquita (see "Shot pages").
5. **A name and a domain.** The owner chooses. Give the costs in euro against the cheaper options. Then: move the domain's DNS to Cloudflare, attach the domain to the Worker, delete the noindex rule from `public/_headers`, and redirect the `workers.dev` address. The working name, "Padel tactics", is set only in `src/site.ts`.

Published so far: **Opponents lob you** and **Returning serve**.

## Purpose

- A **learning-first** project that may earn money, run at 5–10 hours a week. The owner wants to understand what's built. Every milestone ends with a learning page (see `CLAUDE.md`).
- In English. The owner is in Ireland, so prices and legal matters are in euro.

## Product

A library of padel tactics and shots, taught through short top-down animations that stop and ask you to decide.

- **Positioning:** padel is won by where you stand, not how hard you hit. Most coaching on YouTube is technique in long videos. Ours is positioning, in 30-second scenes.
- **Situations** are the "chess of padel" (e.g. "Opponents lob you"). **Shots** cover how and when to play each one (e.g. bandeja). Situations link to the shots they use, and shots link back.
- **A situation page** has general advice for every level, then a **Beginner** tab (keep the ball in play, take no risks) and an **Advanced** tab (take the initiative), each with its own animation. The level is the player's overall level. The exception is "Where to stand", which has one play for all levels.
- **Content** is researched by Claude from coaching sources and always reworded in our own words. Nobody's animation is copied. The owner checks every topic before it goes live.
- **A website, designed for the phone first** (chosen 2026-09-25). A tactics library is found through search and shared in club WhatsApp groups, and both need a web page. A laptop gets its own layout, with the court fixed on the right. An app isn't planned. If something ever needs one (offline use, notifications), make the site installable first.

### "Start here": the front door (chosen 2026-09-26)

- **Topics are songs, and a path is a playlist.** A path is one file listing topics in order (`src/content/paths/<path>.yaml`). It adds no content and never copies a topic. Each topic still stands on its own, because search visitors land straight on it.
- **A step that isn't written yet** has a `soon:` name in the path file and shows as "coming soon", without a link. Once the topic's file exists, its own title is used and the `soon:` line has to go; the build stops until it does. A draft topic shows as coming soon on the live site and as a link on previews.
- **Start here follows one point from start to finish** ("a padel point in six moments"):
  1. Where to stand at the start of a point
  2. Returning serve
  3. Ball off the back glass
  4. When to take the net
  5. Hitting down the middle
  6. Opponents lob you
- **Each topic in a path shows where it sits**, e.g. "Start here · 5 of 6", with previous and next links and a link to step 1. That's what turns a search visitor into someone following the path. As built (2026-09-27), the strip at the top says where you are: the position, and a bar for each step that links to it once it's published and fills in once it's watched. The end of the page says where to go: the next step, then links to the previous step, step 1 and all the steps.
- **The home page leads with "New to padel? Start here".** The steps are stops on a line, and a button leads to the first published one. The court map and the list come after it, as "or jump to a moment".
- **Progress ticks:** a topic counts as watched once either level's animation plays to the end. Jumping to the end while it's paused doesn't count. The tick is kept in the browser, like the level choice, so there are no accounts. Once some steps are ticked, the home page's button becomes "Carry on with step n", the first published step not yet watched.
- A later **"Next level"** path will hold Both teams at the net, serving formations (Australian, I-formation) and the Advanced tabs.

### "Where to stand at the start of a point" (chosen 2026-09-26)

- **One animation with no tabs**, in four short chapters: you serve, your partner serves, they serve to you, they serve to your partner. Each chapter makes clear who's serving and which player is you. It then plays the serve and a shot or two while everyone moves to their spot.
- **Each chapter stops on "Where do you stand?"** before the players move.
- **Anchors:** landmarks you can see on a real court are highlighted as the caption names them. The owner's examples are standing in line with the second post at the net, and by the join in the side glass to return. Research must confirm every anchor, because post spacing varies between court makers. The glass join is 2 m from the back wall and is already drawn. The mesh posts aren't drawn yet.
- **What the engine needs:**
  - **Chapters.** The ball and the players reset between them, and the progress bar and the step list mark each one, so a viewer can jump to theirs in one tap. The validator must allow the jump at a reset, when it would otherwise report it as running too fast.
  - A decision moment per chapter.
  - Timed landmark highlights.
  - Mesh posts drawn on the court.
  - A topic with a single play.

## Look and animation

The visual style is "Broadcast" (chosen 2026-09-24): a drone camera over a real indoor court.

- **Court:** a vertical, top-down court that fits a phone held upright. Blue turf, white lines, and a net with a shadow. Glass at both ends and along the first 4 m of each side, with panel joints. Mesh in between.
- **Players:** top-down athletes, drawn at 1.25× life size, with striding legs and a racket that swings at each hit and points at the ball at contact. Our team wears orange and the opponents wear white. "You" has a yellow YOU tag and a ring.
- **Ball:** yellow, with a trail and a shadow. The further the shadow is from the ball, the higher the ball. Above 2.2 m a chip shows its height. A floor bounce shows as a ring, and a glass hit as a flash.
- **Caption bar** under the court, never over it, showing "Step n of N". At the decision moment the animation stops, the bar turns yellow, and play becomes "Continue".
- **Controls:** play and pause, replay, 0.5×, and a progress bar with the decision marked.
- **Site look:** the court itself. Text sits on "line white" paper and animations on blue turf. The level switch is drawn as the two service boxes. Orange only ever means your team, and yellow only ever means the decision. Turf blue also marks how far along a path you are. Headings are in Barlow Condensed and text in Barlow. Dark mode follows the phone's setting.
- **The quality bar is high.** Unclear or ugly scenes mean people don't come back.

## How it's built

The stack is **Astro** (a static site), **GSAP** (the playback clock only), **TypeScript** and **Cloudflare Workers**. There's no server code. One gets added only if coach listings or a marketplace ever arrive.

### Scenes are sheet music

- A scene is a **data file**, `src/scenes/<topic>.<level>.ts`, listed in `src/scenes/index.ts`. One shared engine plays every scene. Never write animated SVG by hand.
- **A scene says only what a coach would draw:**
  - each player's route (keyframes of time, x, y and facing);
  - the shots: who hits, when, where the ball first lands, and either its `peak` or its `flight` time;
  - the captions;
  - the decision moment.

  Only the opening shot has `from`. After that the ball is wherever physics carries it, and the hitter has to be there. The format is in `src/engine/types.ts`.
- **The engine works out the ball's path**, including every floor, glass and mesh bounce. The physics numbers are in `src/engine/court.ts`.
- **The players** are always `you`, `partner`, `opp1` and `opp2`. The name sets the team, and our team plays at the near end (y > 10).
- **Captions are headlines** (chosen 2026-09-26). At 1× speed each one needs 0.5 s plus 0.25 s a word before the next one starts. The last caption is exempt, because it stays up after the end. The animation never waits for a caption, and only the decision moment stops it. Put the explanation in the caption's `detail`, which shows in the step list under the animation.
- **Serves:** an opening shot with `serve: true` is checked against the LTA rules. It has to be hit at or below 1 m, from behind the service line, and land in the box diagonally across. It mustn't bounce into the mesh before the glass, and the return has to let it bounce. The ball waits at `from` until the serve's time.
- **Mistakes fail the build.** The type check rejects shapes that make no sense. The validator (`src/engine/validate.ts`) rejects scenes that break padel or look fake, and every message says when it happens and what to change. It checks:
  - reach: the ball must be 0.35–1.2 m from the hitter;
  - two bounces before a hit;
  - a shot into the net or out;
  - the same team hitting twice;
  - running faster than 7 m/s, or crossing the net;
  - caption order and reading time;
  - the serve rules above;
  - a ball flying out over the walls. Relax this only when a scene needs a smash that goes out.
- **Tools:** `npm run scene -- <name> [from-to]` prints every hit and bounce, where each hitter stands, and any problems. `/test/<name>?t=4.1` freezes a scene at a moment. A scene is done only when someone has looked at every hit and bounce at phone size, because the rules can't tell whether it reads well.

### Site structure

- **Each topic is three kinds of file:**
  - `src/content/topics/<topic>.md`: the advice, plus `title`, `summary`, `draft`, and `spot` (where it happens on the home page map);
  - `src/content/plays/<topic>.<level>.md`: each level's play;
  - `src/scenes/<topic>.<level>.ts`: each level's animation.

  `src/lib/topics.ts` stops the build if these don't line up.
- **A path** is one more file, `src/content/paths/<path>.yaml`, and `src/lib/paths.ts` stops the build if it names a topic that doesn't exist, keeps a `soon:` line for one that does, or lists a topic twice.
- **URLs:** situations are at `/situations/<topic>`, and shots will be at `/shots/<topic>`. There's no trailing slash. Until shot pages exist, a play names its shots without linking them.
- **Drafts** (`draft: true`) show in `npm run dev` and on a branch's preview address, never on the live site. `src/lib/topics.ts` decides this from `WORKERS_CI_BRANCH`, and a build without it counts as live. Test pages exist only for scenes that can be shown. The repo is public, so anyone can read a draft's Markdown on GitHub.
- **The level is remembered** in the reader's browser across topics, and `#advanced` on a link opens that tab.
- **The step list is built from the scene's captions**, so it can't drift from the animation. Tapping a step plays from there. It's also the text version of the animation.

### Hosting (chosen 2026-09-26)

- **Live at https://padel.johnmaher0.workers.dev.** A push to `main` deploys it. Any other branch gets a preview address at `<branch>-padel.johnmaher0.workers.dev`. Build results show on the branch's pull request and on the Worker's **Deployments** page in the Cloudflare dashboard.
- **The build is the gate.** `npm run build` runs the type check, the tests and the validator. If any of them fails, nothing deploys, and the site stays on the last good version.
- **The settings live in the repo:**
  - `wrangler.jsonc` serves `dist/`, shows `404.html` for missing pages, and names the Worker `padel`, which must match the dashboard. It also holds `"previews": {}`, without which branch previews fail at the upload step.
  - `.node-version` sets Node 24.
  - `public/_headers` sends `noindex` until the domain is chosen.
- **It costs €0.** The free plan allows unlimited visits to static files and commercial use. The first real cost is the domain.

## Content pipeline (chosen 2026-09-26)

The recipe is `.claude/skills/new-topic/SKILL.md`, run as `/new-topic <slug>`. It has five steps:

1. **Research** at least four sources, each read in full, and write the notes in `docs/research/<slug>.md`. They record what the sources agree on, where each point went, and **where the sources differ and what we chose**. Advice needs two sources, or one good source and no contradiction. Rules come from a federation.
2. **Write the words** as a draft.
3. **Write the scenes** shot by shot against `npm run scene`.
4. **Claude checks** every hit and bounce at phone size, and every claim against the notes.
5. **The owner checks** the branch preview on a phone. Then set `draft: false` and merge to `main`.

Use one branch per topic (`topic/<slug>`). When a run teaches something new, update the recipe.

## Shot pages

Shot pages give written step-by-step technique plus embedded YouTube coaching clips, each set to start at the relevant moment. Side-view technique animations come later.

## Milestones

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Design settled | done 2026-09-24 |
| 2 | Visual style: three options; the owner picks | done 2026-09-24 ("Broadcast") |
| 3 | Animation engine and scene format | done 2026-09-25 |
| 4 | Site skeleton, with the first topic page and tabs | done 2026-09-25 |
| 5 | Deploy to Cloudflare | done 2026-09-26 |
| 6 | Content pipeline, proven on "Returning serve" | done 2026-09-26 |
| 7 | Organised library, the launch set (6 situations and 4 shots), then a name and domain | next; see the top of this file |

## Open issues

- **Short laptop screens lose the fixed court.** On a laptop window under 740 px tall, the court panel scrolls with the page.

## Deferred (decided: not now)

- **Making money:** affiliate gear links (Amazon.co.uk or .de, or EU padel shops, since there's no Amazon.ie) and coach listings for a flat fee.
- **A second-hand gear marketplace:** revisit once there's traffic.
- **Voiceover** (looked into on 2026-09-26). It's feasible and costs about €0 with cloud text-to-speech: the captions are the script, and the MP3s are generated and committed. It would be off by default behind a speaker button, and muted at 0.5×. Trial it on one scene first.
- An email list, analytics, a Spanish version, AI-generated video.
