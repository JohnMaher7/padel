// Where everything is at time t. Every function here is a pure function of
// (scene, t), so seeking, replaying and slow motion all come for free: the
// renderer just asks "what does the court look like at 4.2 s?"

import { ballAt, ballPath, type BallEvent, type BallPath } from './ball';
import { PHYSICS } from './court';
import type { ChapteredScene, Keyframe, PlayerId, Scene, Vec3 } from './types';

export const PLAYER_IDS: readonly PlayerId[] = ['you', 'partner', 'opp1', 'opp2'];

export const teamOf = (id: PlayerId) => (id === 'you' || id === 'partner' ? 'us' : 'them');

/** A scene plus the ball path the engine worked out for it. */
export interface Compiled {
  scene: Scene;
  ball: BallPath;
}

export function compile(scene: Scene): Compiled {
  return { scene, ball: ballPath(scene) };
}

/** A chapter placed on the whole animation's clock. */
export interface Chapter extends Compiled {
  start: number;
  end: number;
}

/** What the player plays: a scene, or a chaptered scene's chapters back to back. A plain scene is a single chapter. */
export interface Timeline {
  title: string;
  duration: number;
  /** False for a plain scene: its one chapter has no title to show. */
  chaptered: boolean;
  chapters: Chapter[];
  /** Every decision moment, on the whole clock. */
  decisions: { t: number; prompt: string }[];
}

export const isChaptered = (s: Scene | ChapteredScene): s is ChapteredScene => 'chapters' in s;

export function timeline(s: Scene | ChapteredScene): Timeline {
  let start = 0;
  const chapters = (isChaptered(s) ? s.chapters : [s]).map((scene): Chapter => {
    const chapter = { ...compile(scene), start, end: start + scene.duration };
    start = chapter.end;
    return chapter;
  });
  const decisions = chapters.map(({ scene, start }) => ({ t: start + scene.decision.t, prompt: scene.decision.prompt }));
  return { title: s.title, duration: start, chaptered: isChaptered(s), chapters, decisions };
}

/** The chapter playing at time t, and the time within it. At the moment one chapter ends, the next has begun. */
export function chapterAt(tl: Timeline, t: number): { chapter: Chapter; index: number; local: number } {
  let index = 0;
  while (index + 1 < tl.chapters.length && t >= tl.chapters[index + 1]!.start) index++;
  const chapter = tl.chapters[index]!;
  return { chapter, index, local: t - chapter.start };
}

const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const smooth = (f: number) => f * f * (3 - 2 * f);

export interface PlayerPose {
  x: number;
  y: number;
  facing: number;
}

/**
 * A smooth route through the keyframes (cubic Hermite). Where a player stands
 * still the curve's slope is zero, so they ease into and out of every stop.
 */
export function playerAt(scene: Scene, id: PlayerId, t: number): PlayerPose {
  const k = scene.players[id];
  const first = k[0]!;
  const last = k[k.length - 1]!;
  if (t <= first[0]) return { x: first[1], y: first[2], facing: first[3] };
  if (t >= last[0]) return { x: last[1], y: last[2], facing: last[3] };
  let i = 0;
  while (k[i + 1]![0] < t) i++;
  const a = k[i]!;
  const b = k[i + 1]!;
  const span = b[0] - a[0];
  const f = (t - a[0]) / span;
  const still = (p: Keyframe | undefined, q: Keyframe | undefined) =>
    !p || !q || (Math.abs(p[1] - q[1]) < 1e-6 && Math.abs(p[2] - q[2]) < 1e-6);
  const slope = (j: number, c: 1 | 2) => {
    const p = k[j - 1];
    const n = k[j + 1];
    if (!p || !n || still(p, k[j]) || still(k[j], n)) return 0;
    return (n[c] - p[c]) / (n[0] - p[0]);
  };
  const hermite = (c: 1 | 2) => {
    const m0 = slope(i, c) * span;
    const m1 = slope(i + 1, c) * span;
    const f2 = f * f;
    const f3 = f2 * f;
    return (2 * f3 - 3 * f2 + 1) * a[c] + (f3 - 2 * f2 + f) * m0 + (-2 * f3 + 3 * f2) * b[c] + (f3 - f2) * m1;
  };
  const turn = ((((b[3] - a[3] + 540) % 360) + 360) % 360) - 180; // the shorter way round
  const turned = smooth(clamp(f * 2.2, 0, 1)); // players turn quickly, then run
  return { x: hermite(1), y: hermite(2), facing: a[3] + turn * turned };
}

/** Running speed in m/s, used for leg strides and the speed check. */
export function speedAt(scene: Scene, id: PlayerId, t: number): number {
  const a = playerAt(scene, id, t - 0.03);
  const b = playerAt(scene, id, t + 0.03);
  return Math.hypot(b.x - a.x, b.y - a.y) / 0.06;
}

const BACKSWING = 0.35;
const FOLLOW_THROUGH = 0.3;

/**
 * Whether a player is swinging at time t, and at which shot. The phase runs
 * from −1 (start of the backswing) through 0 (contact) to 1 (end of the
 * follow-through).
 */
export function swingAt(scene: Scene, id: PlayerId, t: number): { phase: number; shot: number } | null {
  for (const [shot, s] of scene.shots.entries()) {
    if (s.by !== id) continue;
    const u = t - s.t;
    if (u > -BACKSWING && u < FOLLOW_THROUGH) return { phase: u < 0 ? u / BACKSWING : u / FOLLOW_THROUGH, shot };
  }
  return null;
}

/**
 * Racket angle for a swing phase, in degrees clockwise from the resting
 * racket. `aim` is the angle that points the racket at the ball at contact;
 * the backswing starts well behind it and the follow-through ends well past it.
 */
export function swingAngle(phase: number, aim: number): number {
  const keys: [number, number][] = [
    [-1, 0],
    [-0.5, aim + 84],
    [0, aim],
    [0.5, aim - 83],
    [1, 0],
  ];
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, a0] = keys[i]!;
    const [p1, a1] = keys[i + 1]!;
    if (phase <= p1) return lerp(a0, a1, smooth(clamp((phase - p0) / (p1 - p0), 0, 1)));
  }
  return 0;
}

export function captionAt(scene: Scene, t: number): { index: number; text: string } {
  const c = scene.captions;
  let index = 0;
  while (index + 1 < c.length && c[index + 1]!.t <= t) index++;
  return { index, text: c[index]?.text ?? '' };
}

/** Ball events (hits and bounces) from the last `window` seconds, with their age. */
export function recentEvents(ball: BallPath, t: number, window = 0.6): (BallEvent & { age: number })[] {
  return ball.events.filter((e) => t >= e.t && t - e.t < window).map((e) => ({ ...e, age: t - e.t }));
}

/** How long before a serve the server drops the ball, so it bounces once and rises to meet the racket. */
const SERVE_DROP = 0.8;
const HAND_HEIGHT = 1.0;
/** The free hand, in metres, in the player's own frame (x to their right, y behind them). Matches the drawn left arm. */
const HAND = [-0.39, -0.28] as const;

/**
 * Where the ball is before a serve: in the server's free hand while they walk
 * to their spot, then dropped to bounce once and rise to the contact point.
 * Null once the serve is hit, or if the scene doesn't start with a serve.
 */
export function serveBall(scene: Scene, t: number): { at: Vec3; inHand: boolean } | null {
  const serve = scene.shots[0];
  if (!serve.serve || t >= serve.t) return null;
  const hand = (u: number): [number, number] => {
    const p = playerAt(scene, serve.by, u);
    const r = (p.facing * Math.PI) / 180;
    return [p.x + HAND[0] * Math.cos(r) - HAND[1] * Math.sin(r), p.y + HAND[0] * Math.sin(r) + HAND[1] * Math.cos(r)];
  };
  const drop = serve.t - SERVE_DROP;
  if (t <= drop) return { at: [...hand(t), HAND_HEIGHT], inHand: true };

  const g = PHYSICS.gravity;
  const [hx, hy] = hand(drop);
  const [fx, fy, fh] = serve.from;
  const u = t - drop;
  const fall = Math.sqrt((2 * HAND_HEIGHT) / g);
  let h: number;
  if (u < fall) h = HAND_HEIGHT - (g * u * u) / 2;
  else {
    // The bounce sends it up just fast enough to reach the contact height as the racket arrives.
    const rise = SERVE_DROP - fall;
    const up = (fh + (g * rise * rise) / 2) / rise;
    const w = u - fall;
    h = up * w - (g * w * w) / 2;
  }
  const f = u / SERVE_DROP;
  return { at: [hx + (fx - hx) * f, hy + (fy - hy) * f, Math.max(0, h)], inHand: false };
}

/** Where the ball is at time t, including in the server's hand before a serve. */
export function ballPosition({ scene, ball }: Compiled, t: number): Vec3 {
  return serveBall(scene, t)?.at ?? ballAt(ball, t);
}
