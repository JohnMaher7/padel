// The engine's front door: give it an element and a scene, and it plays.

import { Playback } from './playback';
import { mountBroadcast } from './render/broadcast';
import { timeline } from './sample';
import type { ChapteredScene, Scene } from './types';
import { check, formatProblems } from './validate';

export type { ChapteredScene, Scene } from './types';

export interface PlaySceneOptions {
  /** Start playing once the scene scrolls into view. Ignored when the viewer prefers reduced motion. */
  autoplay?: boolean;
}

export function playScene(root: HTMLElement, scene: Scene | ChapteredScene, { autoplay = true }: PlaySceneOptions = {}) {
  if (import.meta.env.DEV) {
    const problems = check(scene);
    if (problems.length) console.warn(`Scene "${scene.title}" has problems:\n${formatProblems(problems)}`);
  }
  const tl = timeline(scene);
  const playback = new Playback(
    tl.duration,
    tl.decisions.map((d) => d.t),
  );
  const view = mountBroadcast(root, tl, playback);

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
    timeline: tl,
    destroy() {
      observer?.disconnect();
      view.destroy();
      playback.destroy();
    },
  };
}
