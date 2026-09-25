# Padel tactics site

Animated padel tactics and shot library. Before any product, content or architecture work, read `docs/decisions.md`; it holds every settled decision, the milestone order and what's deferred. Change a decision there, never only in chat.

## Learning pages

The owner is learning to build with AI, and the learning pages are how that happens: Claude builds, and each page teaches. At the end of every milestone (see the table in `docs/decisions.md`), write one page to `learn/NN-short-slug.html`:

- It's a self-contained HTML file. `learn/` is gitignored, so the pages stay on the owner's laptop.
- Teach the **transferable** lesson (useful on any future AI-built project), illustrated with what happened in this project.
- Curate the few things that matter. Each one gets a concrete analogy and a real example from our session, so it sticks and can be re-applied.
- End with a short, optional "re-apply it" exercise and a few recall questions with hidden answers.
- Update the milestone's status in `docs/decisions.md`.

## Conventions

- Scenes are **sheet music**: typed data files played by the shared engine. Write scene data, never hand-made animated SVG files.
- Write a scene against `npm run scene -- <name> [from-to]`, which prints the hits and bounces the engine works out. A scene is done when `npm run build` passes **and** you've looked at every hit and bounce on `/test/<name>?t=<time>` at phone size. The rules can't tell whether a scene reads well.
- Content can reuse good coaching advice but is always reworded in our own words; nobody's animation is copied.
