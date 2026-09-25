// The step-by-step list under an animation. It's built from the scene's own
// captions, so the words under the court can't drift from what it shows.

import type { Scene } from '../engine/types';

/** One line of the list: a caption, or the decision moment. */
export type Step = { kind: 'caption'; n: number; t: number; text: string } | { kind: 'decision'; t: number; text: string };

/** The scene's captions in order, with the decision moment placed where the animation stops for it. */
export function stepsOf(scene: Scene): Step[] {
  const steps: Step[] = scene.captions.map((c, i) => ({ kind: 'caption', n: i + 1, t: c.t, text: c.text }));
  const at = steps.findIndex((s) => s.t >= scene.decision.t);
  steps.splice(at === -1 ? steps.length : at, 0, { kind: 'decision', t: scene.decision.t, text: scene.decision.prompt });
  return steps;
}
