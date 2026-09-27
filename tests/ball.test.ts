import { describe, expect, it } from 'vitest';
import { ballAt, ballPath, ballVelocityAt, type BallPath } from '../src/engine/ball';
import { COURT, PHYSICS } from '../src/engine/court';
import { isChaptered } from '../src/engine/sample';
import type { Scene } from '../src/engine/types';
import { scenes } from '../src/scenes';

const still = (x: number, y: number) => [[0, x, y, 0]] as const;
const players = { you: still(3, 13), partner: still(7, 13), opp1: still(3, 7), opp2: still(7, 7) };

function sceneWith(shots: Scene['shots'], duration = 6): Scene {
  return { title: 'test', duration, players, shots, captions: [{ t: 0, text: 'x' }], decision: { t: 1, prompt: 'x' } };
}

const heading = (v: readonly number[]) => Math.atan2(v[0]!, -v[1]!);
const before = (p: BallPath, t: number) => ballVelocityAt(p, t - 1e-6);
const after = (p: BallPath, t: number) => ballVelocityAt(p, t + 1e-6);

describe('a shot', () => {
  it('lands where it says, after rising to its peak', () => {
    const path = ballPath(sceneWith([{ t: 0, by: 'you', from: [3, 13, 1], to: [6, 3], peak: 4 }]));
    const land = path.events.find((e) => e.kind === 'floor')!;
    expect(land.at[0]).toBeCloseTo(6, 6);
    expect(land.at[1]).toBeCloseTo(3, 6);
    const top = Math.max(...Array.from({ length: 400 }, (_, i) => ballAt(path, (i / 400) * land.t)[2]));
    expect(top).toBeCloseTo(4, 2);
  });

  it('can be given a flight time instead of a peak', () => {
    const path = ballPath(sceneWith([{ t: 0.5, by: 'you', from: [3, 13, 2.5], to: [5, 4], flight: 0.8 }]));
    const land = path.events.find((e) => e.kind === 'floor')!;
    expect(land.t).toBeCloseTo(1.3, 9);
    expect(land.at[1]).toBeCloseTo(4, 6);
  });

  it('starts from wherever the previous shot left the ball', () => {
    const scene = sceneWith([
      { t: 0, by: 'you', from: [3, 13, 1], to: [3, 5], peak: 2 },
      { t: 1.4, by: 'opp1', to: [5, 16], peak: 5 },
    ]);
    const path = ballPath(scene);
    const hit = path.events.find((e) => e.kind === 'hit' && e.shot === 1)!;
    expect(hit.at).toEqual(ballAt(path, 1.4 - 1e-9).map((c) => expect.closeTo(c, 6)));
  });
});

// These are the guarantees that fix the milestone 2 "swerve" bug.
describe('bounces, in every scene', () => {
  // A chaptered scene's chapters each have their own ball path.
  const all = Object.entries(scenes).flatMap(([name, s]) =>
    isChaptered(s) ? s.chapters.map((scene, i) => [`${name}, chapter ${i + 1}`, scene] as const) : [[name, s] as const],
  );
  for (const [name, scene] of all) {
    const path = ballPath(scene);

    it(`${name}: a floor bounce never changes the ball's heading`, () => {
      for (const e of path.events.filter((e) => e.kind === 'floor')) {
        expect(heading(after(path, e.t))).toBeCloseTo(heading(before(path, e.t)), 9);
      }
    });

    it(`${name}: a wall reverses only the motion into it`, () => {
      for (const e of path.events) {
        if (e.kind !== 'glass' && e.kind !== 'mesh') continue;
        const [n, along] = e.wall === 'left' || e.wall === 'right' ? [0, 1] : [1, 0];
        const [v0, v1] = [before(path, e.t), after(path, e.t)];
        expect(Math.sign(v1[n]!)).toBe(-Math.sign(v0[n]!));
        expect(Math.sign(v1[along]!)).toBe(Math.sign(v0[along]!));
        // Mesh deadens the ball more than glass does.
        expect(Math.abs(v1[n]!)).toBeCloseTo(Math.abs(v0[n]!) * PHYSICS[e.kind].normal, 9);
      }
    });

    it(`${name}: the ball stays inside the court and never jumps`, () => {
      let last = ballAt(path, 0);
      for (let t = 0; t <= scene.duration; t += 0.005) {
        const p = ballAt(path, t);
        expect(p[0]).toBeGreaterThanOrEqual(-1e-9);
        expect(p[0]).toBeLessThanOrEqual(COURT.width + 1e-9);
        expect(p[1]).toBeGreaterThanOrEqual(-1e-9);
        expect(p[1]).toBeLessThanOrEqual(COURT.length + 1e-9);
        expect(p[2]).toBeGreaterThanOrEqual(-1e-9);
        expect(Math.hypot(p[0] - last[0], p[1] - last[1], p[2] - last[2])).toBeLessThan(0.1);
        last = p;
      }
    });
  }
});

describe('a ball that runs out of bounce', () => {
  it('rolls, slows down and stops', () => {
    const path = ballPath(sceneWith([{ t: 0, by: 'you', from: [5, 13, 0.5], to: [5, 8], peak: 0.7 }], 12));
    const end = ballAt(path, 12);
    expect(end[2]).toBe(0);
    expect(ballAt(path, 11.9)).toEqual(end);
  });
});
