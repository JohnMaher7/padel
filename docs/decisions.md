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
- Stack: **Astro** (static site) + **GSAP** (animation timelines) + **TypeScript** (scene format is type-checked, so a broken scene fails the build) + **Cloudflare Pages** (hosting, auto-deploys from GitHub).
- A static site for now. A server gets added only if the marketplace or coach listings arrive.

### Engine and scene format (settled in milestone 3, 2026-09-25)

- **A scene says only what a coach would draw:** each player's route (keyframes of time, position and facing), the shots, the captions and the decision moment. A shot says who hits, when, where the ball first lands, and either how high it peaks or how long it flies. **Only the opening shot says where the ball starts.** After that, the ball is wherever physics has carried it, and the hitter has to be there. The format lives in `src/engine/types.ts`.
- **The engine works out the ball's whole path**: gravity in the air, then floor, glass and mesh bounces, then rolling. A floor bounce never changes the ball's heading. A wall reverses only the motion going into it. The physics numbers are in `src/engine/court.ts`.
- **Mistakes are blocked in two layers.** The type check rejects shapes that make no sense (a `from` on a later shot, a peak *and* a flight time, a fifth player). The validator (`src/engine/validate.ts`) rejects scenes that break padel or look fake: a hitter more than 1.2 m from the ball, a ball that bounces twice before it's hit, a shot into the net or out, the same team hitting twice, players running faster than 7 m/s or crossing the net, captions out of order. Every problem message says when it happens and what to change. Both layers run in `npm run build`, so a broken scene can't deploy.
- For now, **a ball that flies out over the walls is an error.** Relax this when a scene needs a smash that goes out of the court.
- Captions have only a start time; each one runs until the next. So gaps and overlaps can't be written.
- The four players are always `you`, `partner`, `opp1` and `opp2`. The name sets the team.
- **GSAP is the playback clock**, not the animator. Its timeline handles play, pause, seek, 0.5× and the stop at the decision moment. On every frame the renderer asks the engine where everything is at the timeline's time and draws that. Nothing is tweened.
- At contact the racket points at the ball, whichever way the player faces, so every hit visibly connects.
- Scenes live in `src/scenes/<topic>.<level>.ts` and are listed in `src/scenes/index.ts`. Each one gets a test page at `/test/<topic>.<level>`, and `?t=4.1` freezes it at a moment. `npm run scene` prints every hit and bounce the engine worked out, where each hitter stands, and any problems.

## Shot pages at launch

Written step-by-step technique + embedded YouTube coach clips, set to start at the relevant moment. Side-view animated technique figures come later, once the court animations are polished.

## Launch set

Build **"Opponents lob you"** fully end to end first, then the rest:

- Situations: Returning serve, Opponents lob you, When to take the net, Ball off the back glass, Both teams at the net, Hitting down the middle.
- Shots: Lob, Volley, Bandeja, Chiquita.

## Milestones

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Design settled | done 2026-09-24 |
| 2 | Visual style: 3 options of one scene (including player figures); owner picks | done 2026-09-24 (chose A, "Broadcast") |
| 3 | Animation engine + scene data format, with "Opponents lob you" playing on a test page | done 2026-09-25 |
| 4 | Astro site skeleton with the first topic page and tabs | |
| 5 | Deploy to Cloudflare (`*.pages.dev`) | |
| 6 | Content pipeline: Opus researches → drafts text + scene data → preview → owner checks | |
| 7 | Launch set of 10 topics, then choose a name and domain | |

The engine (3) comes before the site (4) on purpose: the animation is the riskiest and most important part, so it gets proven first.

## Open issues

- **"Opponents lob you" has no Advanced scene yet.** Milestone 4's Advanced tab needs one. Its coaching goes through the normal content check: researched, reworded, and checked by the owner.
- **The owner hasn't yet watched the milestone 3 version of the beginner scene.** The coaching is unchanged, but the timings moved slightly now that physics sets them: the lob is hit at 1.35 s and the decision stop is at 1.95 s.

### Resolved

- **The ball swerved at bounces.** Spotted by the owner in the milestone 2 prototype on 2026-09-24 and fixed in milestone 3 on 2026-09-25. At 3.6 s the lob left a bounce on a heading 17° off the one it came in on, so it looked as if it had deflected off the players. *Cause:* the scene data placed every bounce by hand. *Fix:* scenes now describe only the shots, and the engine works out the bounces. A test checks every bounce in every scene: a floor bounce keeps the heading, and a wall reverses only the motion into it.

## Deferred (decided: not now)

- **How the site makes money.** Candidates: affiliate gear links (no Amazon.ie, so Amazon.co.uk/.de or EU padel shops), and coach listings. A flat listing fee avoids the booking and payment work that a commission would need.
- **Second-hand gear marketplace.** A two-sided cold-start problem plus payments, fraud and consumer law. Revisit once there's traffic.
- Email list, analytics, name and domain, a Spanish version, AI-generated video.
