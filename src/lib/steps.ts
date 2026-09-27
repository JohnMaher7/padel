// The step-by-step list under an animation. It's built from the scene's own
// captions, so the words under the court can't drift from what it shows. A
// chaptered scene's list has a heading for each chapter, to jump straight to it.

import { captionAt, chapterAt, timeline, type Timeline } from '../engine/sample';
import type { ChapteredScene, Scene } from '../engine/types';

/**
 * One line of the list: a chapter's heading, a caption (with its fuller explanation, if it has one),
 * or the decision moment. `key` matches `stepKeyAt`; `seek` is where tapping the line plays from.
 * Times are on the whole animation's clock.
 */
export type Step =
  | { kind: 'chapter'; key: string; n: number; t: number; seek: number; text: string }
  | { kind: 'caption'; key: string; n: number; t: number; seek: number; text: string; detail?: string | undefined }
  | { kind: 'decision'; key: string; t: number; seek: number; text: string };

/** The captions in order, each chapter's decision placed where the animation stops for it. */
export function stepsOf(s: Scene | ChapteredScene): Step[] {
  const tl = timeline(s);
  return tl.chapters.flatMap(({ scene, start }, ci) => {
    const steps: Step[] = scene.captions.map((c, i) => ({
      kind: 'caption',
      key: `${ci}.${i}`,
      n: i + 1,
      t: start + c.t,
      // Just after the caption appears, so it shows; a chapter's first caption from the chapter's start.
      seek: c.t === 0 ? start : start + c.t + 0.01,
      text: c.text,
      detail: c.detail,
    }));
    const { decision } = scene;
    const at = steps.findIndex((x) => x.t >= start + decision.t);
    steps.splice(at === -1 ? steps.length : at, 0, {
      kind: 'decision',
      key: `${ci}.decision`,
      t: start + decision.t,
      // A moment before the stop, so the viewer sees what leads up to it.
      seek: start + Math.max(0, decision.t - 0.4),
      text: decision.prompt,
    });
    if (tl.chaptered) steps.unshift({ kind: 'chapter', key: `${ci}`, n: ci + 1, t: start, seek: start, text: scene.title });
    return steps;
  });
}

/** The key of the step playing at time t, to mark it in the list. */
export function stepKeyAt(tl: Timeline, t: number, atDecision: boolean): string {
  const { chapter, index, local } = chapterAt(tl, t);
  return atDecision ? `${index}.decision` : `${index}.${captionAt(chapter.scene, local).index}`;
}
