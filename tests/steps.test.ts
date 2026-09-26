import { describe, expect, it } from 'vitest';
import type { Scene } from '../src/engine/types';
import { stepsOf } from '../src/lib/steps';
import lob from '../src/scenes/opponents-lob-you.beginner';

const summary = (scene: Scene) => stepsOf(scene).map((s) => (s.kind === 'decision' ? 'decision' : s.n));

describe('the step list', () => {
  it('puts the decision where the animation stops, before the caption that answers it', () => {
    // The lob scene stops at 1.95 s, the moment its second caption starts.
    expect(summary(lob)).toEqual([1, 'decision', 2, 3, 4]);
  });

  it('keeps the caption numbers the player shows ("Step 3 of 4")', () => {
    const numbers = stepsOf(lob).flatMap((s) => (s.kind === 'caption' ? [s.n] : []));
    expect(numbers).toEqual([1, 2, 3, 4]);
  });

  it("carries each caption's detail, for the list only", () => {
    const first = stepsOf(lob)[0]!;
    expect(first.kind === 'caption' && first.detail).toMatch(/stuck at the back/);
  });

  it('puts the decision last when it comes after every caption', () => {
    const late = { ...lob, decision: { ...lob.decision, t: 8 } } as Scene;
    expect(summary(late).at(-1)).toBe('decision');
  });
});
