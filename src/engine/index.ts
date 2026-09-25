// The engine's front door: give it an element and a scene, and it plays.

import { Playback } from './playback';
import { mountBroadcast } from './render/broadcast';
import { compile } from './sample';
import type { Scene } from './types';
import { formatProblems, validate } from './validate';

export type { Scene } from './types';

export interface PlaySceneOptions {
  /** Start playing once the scene scrolls into view. Ignored when the viewer prefers reduced motion. */
  autoplay?: boolean;
}

export function playScene(root: HTMLElement, scene: Scene, { autoplay = true }: PlaySceneOptions = {}) {
  const compiled = compile(scene);
  if (import.meta.env.DEV) {
    const problems = validate(compiled);
    if (problems.length) console.warn(`Scene "${scene.title}" has problems:\n${formatProblems(problems)}`);
  }
  const playback = new Playback(scene.duration, scene.decision.t);
  const view = mountBroadcast(root, compiled, playback);

  let observer: IntersectionObserver | undefined;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (autoplay && !reduceMotion) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer?.disconnect();
        setTimeout(() => playback.play(), 500);
      },
      { threshold: 0.6 },
    );
    observer.observe(root);
  }

  return {
    playback,
    destroy() {
      observer?.disconnect();
      view.destroy();
      playback.destroy();
    },
  };
}
