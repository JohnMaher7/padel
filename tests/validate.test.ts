import { describe, expect, it } from 'vitest';
import type { Scene, Shot } from '../src/engine/types';
import { compile } from '../src/engine/sample';
import { check, formatProblems, validate } from '../src/engine/validate';
import { scenes } from '../src/scenes';
import lob from '../src/scenes/opponents-lob-you.beginner';
import serve from '../src/scenes/returning-serve.beginner';

describe('every scene', () => {
  for (const [name, scene] of Object.entries(scenes)) {
    it(`${name} has no problems`, () => {
      const problems = check(scene);
      expect(problems, formatProblems(problems)).toEqual([]);
    });
  }
});

/** The lob scene with one thing changed. */
const broken = (change: (s: Scene) => Scene) => validate(compile(change(structuredClone(lob) as Scene)));
const messages = (change: (s: Scene) => Scene) => broken(change).map((p) => p.message).join('\n');
const withShot = (i: number, patch: Partial<Shot>) => (s: Scene): Scene => ({
  ...s,
  shots: s.shots.map((shot, j) => (j === i ? { ...shot, ...patch } : shot)) as unknown as Scene['shots'],
});

describe('the validator catches', () => {
  it('a hitter who is nowhere near the ball', () => {
    expect(messages(withShot(1, { t: 1.1 }))).toMatch(
      /opp2 is .* m from the ball at contact/,
    );
  });

  it('a ball that bounces twice before it is hit', () => {
    expect(messages(withShot(1, { t: 2.4 }))).toMatch(
      /bounces twice/,
    );
  });

  it('a shot into the net', () => {
    expect(messages(withShot(0, { to: [7, 9.5], peak: 1.2 }))).toMatch(
      /crosses the net only/,
    );
  });

  it('a shot that lands out', () => {
    expect(messages(withShot(0, { to: [7, 11] }))).toMatch(
      /outside the other team's half/,
    );
  });

  it('two shots in a row by the same team', () => {
    expect(messages((s) => withShot(2, { by: 'opp2' })(withShot(1, { by: 'opp1' })(s)))).toMatch(
      /must alternate/,
    );
  });

  it('a player who runs impossibly fast', () => {
    expect(messages((s) => ({ ...s, players: { ...s.players, partner: [[0, 6.8, 12.8, 0], [0.5, 6.8, 19, 0]] } }))).toMatch(
      /partner runs at/,
    );
  });

  it('a player over the net', () => {
    expect(messages((s) => ({ ...s, players: { ...s.players, opp1: [[0, 3, 1.9, 180], [3, 3, 11, 180]] } }))).toMatch(
      /opp1 is at the net or over it/,
    );
  });

  it('a lob so high it flies out over the back glass', () => {
    expect(messages((s) => withShot(1, { peak: 12, to: [3.3, 18] })({ ...s, shots: [s.shots[0], s.shots[1]!] }))).toMatch(
      /flies out over the near wall/,
    );
  });

  it('captions that start out of order', () => {
    expect(messages((s) => ({ ...s, captions: [s.captions[0]!, { t: 5, text: 'a' }, { t: 3, text: 'b' }] }))).toMatch(
      /Caption 3 starts before/,
    );
  });

  it('a caption with too little time to read', () => {
    expect(messages((s) => ({ ...s, captions: [s.captions[0]!, { t: 1, text: 'Six words is too many here.' }, { t: 1.5, text: 'b' }] }))).toMatch(
      /Caption 2 .* is on screen for 0.50 s, but 6 words need 2.00 s/,
    );
  });

  it('but never the last caption, which stays up after the end', () => {
    expect(messages((s) => ({ ...s, captions: [...s.captions, { t: 8.5, text: 'A long closing line, still readable after the end.' }] }))).toBe('');
  });

  it('a decision moment outside the scene', () => {
    expect(messages((s) => ({ ...s, decision: { ...s.decision, t: 20 } }))).toMatch(/decision moment/);
  });
});

/** The serve scene with its serve changed. */
const serving = (patch: Partial<Scene['shots'][0]>) => {
  const s = structuredClone(serve) as Scene;
  const shots = [{ ...s.shots[0], ...patch }, ...s.shots.slice(1)] as unknown as Scene['shots'];
  return validate(compile({ ...s, shots })).map((p) => p.message).join('\n');
};

describe('the validator catches a serve', () => {
  it('from in front of the service line', () => {
    expect(serving({ from: [3.9, 3.6, 0.75] })).toMatch(/in front of the service line/);
  });

  it('hit above the waist', () => {
    expect(serving({ from: [3.9, 1.9, 1.4] })).toMatch(/at or below the waist/);
  });

  it('that lands outside the box diagonally across', () => {
    expect(serving({ to: [3, 16.3] })).toMatch(/outside the service box/);
  });

  it('that bounces into the mesh', () => {
    expect(serving({ to: [9.4, 14.5] })).toMatch(/into the mesh/);
  });
});
