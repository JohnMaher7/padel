---
name: new-topic
description: Research, write and check one padel topic (situation) end to end, ready for the owner to check on a preview link. Use when asked to add, write or draft a topic, e.g. "/new-topic returning-serve".
---

# New topic: the content pipeline

Opus researches → drafts the words and the scene data → checks them → the owner checks a preview. Read `docs/decisions.md` first. The argument is the topic's slug, e.g. `when-to-take-the-net`.

Work on a branch named `topic/<slug>`, never on `main` (a push to `main` goes live).

## 1. Research

- Find at least four coaching sources: coaches' sites and federations over forums. Read each one; don't rely on search snippets.
- Write `docs/research/<slug>.md` the way `docs/research/returning-serve.md` does: the sources with links, a table of what they agree on and where it went on our page, and **where they differ and what we chose, and why**.
- Keep only advice that at least two sources give, or that one good source gives and nothing contradicts. Rules (serves, bounces, walls) come from a federation (LTA, FIP).
- Anchors are landmarks you can see on a real court (a glass join, a post, a line). Only use one when the court's dimensions back it up.

## 2. Write the words

All three are in our own words. Never copy a sentence, and never copy anybody's animation.

- `src/content/topics/<slug>.md`: `title`, `kind: situation`, a one-sentence `summary`, `draft: true`, `spot` (where it happens on our half, x 0–10, y 10–20), then 3–5 bullet points of advice for every level, each starting with a bold instruction.
- If the topic is a step in a path (`src/content/paths/*.yaml`), delete that step's `soon:` line. The topic's own title replaces it, and the build stops until the line is gone.
- A topic whose right play doesn't depend on the level (like "Where to stand") has one play: `<slug>.all.md` and `<slug>.all.ts`, and no tabs. Everything below that says "both levels" then means the one play.
- `src/content/plays/<slug>.beginner.md` and `.advanced.md`: `play` is the right play in a few words, and `shots` lists only shots from the launch set that this play actually uses. Then why it works, and a short "Watch out for" section. Beginner means keep the ball in play and take no risks; Advanced means take the initiative.

## 3. Write the scenes

- `src/scenes/<slug>.beginner.ts` and `.advanced.ts`, both listed in `src/scenes/index.ts`. Copy the shape of an existing scene.
- **Build them up shot by shot** with `npm run scene -- <slug> [from-to]`. Write the opening shot, run it, read where the ball goes, put the next hitter there, and repeat. `from-to` traces the ball, which is how you find where it can be hit.
- When one scene has to show several separate starts, make it a chaptered scene (`{ title, chapters }`, as in `where-to-stand.all.ts`). Write and report one chapter at a time with `npm run scene -- <slug>@2 [from-to]`; the report gives each time within the chapter and on the page, and the test page takes the page time.
- To show a landmark while a caption names it, add a `highlights` entry for the same stretch of time.
- A serve's opening shot has `serve: true`. The ball waits at `from` until the shot's `t`, so start the serve about a second in, which lets the viewer see the positions first.
- **Captions are headlines.** At 1× speed each one needs 0.5 s plus 0.25 s a word before the next one starts. Aim for 3–5 captions and five or six words each. Put the explanation in `detail`, which shows in the step list. The animation never waits for a caption.
- Put the decision moment where the viewer really has to choose, usually as the ball comes to "you", and have the caption that answers it start at the same time.

## 4. Check it yourself

- `npm run scene -- <slug>` reports no problems, and `npm run build` passes.
- **Look at every hit and bounce** at phone size (390×844) on `/test/<slug>.<level>?t=<time>`, with times taken from the scene report. See the memory note on screenshots. Look for players the ball passes through, rackets that don't reach, players standing where the text says they shouldn't, and a height chip that contradicts the words ("a low return" at 2 m).
- Look at `/situations/<slug>` at phone size too: the advice, both tabs and the step list.
- Read the words against the research notes. Every claim on the page should trace back to a row in the table.

## 5. Hand it to the owner

- Commit and push the branch. Cloudflare builds it at a preview address, and drafts show there, never on the live site. The build takes a minute or two; the address is on the Worker's Deployments page in the Cloudflare dashboard.
- Give the owner the preview link, the research file, and a short checklist: does each animation show what its steps say, is anything wrong for how padel is really played at their club, and does anything read awkwardly.
- The owner sets `draft: false`, or asks for changes. When it's published, merge the branch into `main`, which puts it live.
