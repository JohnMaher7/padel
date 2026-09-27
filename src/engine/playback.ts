// The playback clock. A GSAP timeline keeps time and handles play, pause,
// seeking, half speed and the stop at each decision moment. Nothing is tweened:
// on every tick the renderer asks the sampling functions where everything is
// at the timeline's current time, and draws that.

import { gsap } from 'gsap';

export interface PlaybackState {
  t: number;
  playing: boolean;
  atDecision: boolean;
  ended: boolean;
  speed: number;
}

export class Playback {
  private readonly tl: gsap.core.Timeline;
  private atDecision = false;
  private readonly listeners = new Set<(s: PlaybackState) => void>();

  /** `decisions` are the times it stops at: one per chapter. */
  constructor(
    readonly duration: number,
    decisions: readonly number[],
  ) {
    this.tl = gsap.timeline({ paused: true, onUpdate: () => this.emit(), onComplete: () => this.emit() });
    this.tl.to({}, { duration }); // an empty tween sets the timeline's length
    for (const t of decisions)
      this.tl.addPause(t, () => {
        this.atDecision = true;
        this.emit();
      });
  }

  state(): PlaybackState {
    const t = this.tl.time();
    const ended = t >= this.duration;
    return { t, playing: !this.tl.paused() && !ended, atDecision: this.atDecision, ended, speed: this.tl.timeScale() };
  }

  /** Calls `fn` now and on every change. Returns a function that unsubscribes. */
  on(fn: (s: PlaybackState) => void): () => void {
    this.listeners.add(fn);
    fn(this.state());
    return () => this.listeners.delete(fn);
  }

  play() {
    if (this.state().ended) return this.replay();
    this.atDecision = false;
    this.tl.play();
    this.emit();
  }

  pause() {
    this.tl.pause();
    this.emit();
  }

  toggle() {
    if (this.state().playing) this.pause();
    else this.play();
  }

  replay() {
    this.atDecision = false;
    this.tl.restart();
    this.emit();
  }

  setSpeed(speed: number) {
    this.tl.timeScale(speed);
    this.emit();
  }

  /** Jump to time t, keeping play or pause. Jumping back before a decision means it stops there again. */
  seek(t: number) {
    const wasPlaying = this.state().playing;
    this.atDecision = false;
    this.tl.pause();
    this.tl.seek(Math.min(Math.max(t, 0), this.duration), true);
    if (wasPlaying) this.tl.play();
    this.emit();
  }

  destroy() {
    this.tl.kill();
    this.listeners.clear();
  }

  private emit() {
    const s = this.state();
    this.listeners.forEach((fn) => fn(s));
  }
}
