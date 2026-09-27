import { describe, expect, it } from 'vitest';
import { ballAt } from '../src/engine/ball';
import { chapterAt, compile, serveBall, timeline } from '../src/engine/sample';
import type { ChapteredScene, Scene } from '../src/engine/types';
import { check } from '../src/engine/validate';
import { stepKeyAt, stepsOf } from '../src/lib/steps';
import lob from '../src/scenes/opponents-lob-you.beginner';
import serve from '../src/scenes/returning-serve.beginner';

// Two real scenes back to back. The players end the lob scene nowhere near where they start the serve scene.
const both: ChapteredScene = { title: 'Two chapters', chapters: [{ ...lob, title: 'The lob' }, { ...serve, title: 'The serve' }] };

describe('a chaptered scene', () => {
  const tl = timeline(both);

  it('plays its chapters back to back, on one clock', () => {
    expect(tl.duration).toBeCloseTo(lob.duration + serve.duration, 9);
    expect(tl.chapters.map((c) => c.start)).toEqual([0, lob.duration]);
    expect(tl.decisions.map((d) => d.t)).toEqual([lob.decision.t, lob.duration + serve.decision.t]);
  });

  it('has begun the next chapter at the moment the last one ends', () => {
    expect(chapterAt(tl, lob.duration - 0.01)).toMatchObject({ index: 0 });
    expect(chapterAt(tl, lob.duration)).toMatchObject({ index: 1, local: 0 });
  });

  it('is checked chapter by chapter, so the reset between chapters is never "running too fast"', () => {
    expect(check(both)).toEqual([]);
  });

  it("says which chapter a problem is in, with the time inside that chapter", () => {
    const late = { ...serve, title: 'Late', decision: { ...serve.decision, t: 99 } };
    const problems = check({ ...both, chapters: [both.chapters[0], late] });
    expect(problems).toContainEqual(expect.objectContaining({ chapter: 2, t: 99 }));
  });

  it('needs every chapter to have a title', () => {
    const untitled = check({ ...both, chapters: [both.chapters[0], { ...serve, title: ' ' }] });
    expect(untitled.map((p) => p.message).join('\n')).toMatch(/chapter needs a title/);
  });
});

describe("a chaptered scene's step list", () => {
  const steps = stepsOf(both);

  it('has a heading for each chapter, and numbers each chapter\'s steps from 1', () => {
    const outline = steps.map((s) => (s.kind === 'chapter' ? `#${s.n}` : s.kind === 'decision' ? 'decision' : s.n));
    expect(outline).toEqual(['#1', 1, 'decision', 2, 3, 4, '#2', 1, 'decision', 2, 3]);
  });

  it('jumps to a chapter from its heading', () => {
    const second = steps.find((s) => s.kind === 'chapter' && s.n === 2)!;
    expect(second.seek).toBe(lob.duration);
  });

  it("replays a decision from a moment before it, but never from the chapter before", () => {
    const early = { ...serve, title: 'Early', decision: { ...serve.decision, t: 0.2 } };
    const decision = stepsOf({ ...both, chapters: [both.chapters[0], early] }).findLast((s) => s.kind === 'decision')!;
    expect(decision.seek).toBe(lob.duration);
  });

  it('marks the step that is playing, by the same keys', () => {
    const tl = timeline(both);
    const keys = new Set(steps.map((s) => s.key));
    for (const t of [0, 1, lob.duration + 0.5, lob.duration + 4.5]) expect(keys.has(stepKeyAt(tl, t, false))).toBe(true);
    expect(stepKeyAt(tl, tl.decisions[1]!.t, true)).toBe('1.decision');
  });
});

describe('highlights', () => {
  it('must end after they start, inside the scene', () => {
    const lit: Scene = { ...lob, highlights: [{ t: 2, until: 1, landmark: 'glass-join', end: 'near' }] };
    expect(check(lit).map((p) => p.message).join('\n')).toMatch(/Highlight 1 \(the near glass-join\)/);
  });
});

describe('before a serve', () => {
  const s = serve.shots[0];

  it("the ball is in the server's hand, then dropped", () => {
    expect(serveBall(serve, 0)).toMatchObject({ inHand: true });
    expect(serveBall(serve, s.t - 0.1)).toMatchObject({ inHand: false });
    expect(serveBall(serve, s.t)).toBeNull();
  });

  it('bounces once and meets the racket at the contact point', () => {
    const heights = Array.from({ length: 80 }, (_, i) => serveBall(serve, s.t - 0.8 + i * 0.01)!.at[2]);
    expect(Math.min(...heights)).toBeCloseTo(0, 1);
    const end = serveBall(serve, s.t - 1e-6)!.at;
    expect(end.map((c) => c)).toEqual(ballAt(compile(serve).ball, s.t).map((c) => expect.closeTo(c, 2)));
  });
});
