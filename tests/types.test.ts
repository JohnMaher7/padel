// Mistakes the scene format refuses to compile. Each `@ts-expect-error` line
// fails the type check (and so the build) if the mistake ever becomes writable.

import { expect, it } from 'vitest';
import type { OpeningShot, Scene, Shot } from '../src/engine/types';

it('rejects impossible scenes at compile time', () => {
  // @ts-expect-error Only the opening shot says where the ball is; later shots take it from the physics.
  const later: Shot = { t: 2, by: 'opp1', from: [3, 3, 1], to: [3, 15], peak: 4 };

  // @ts-expect-error A shot has a peak or a flight time, never both.
  const both: Shot = { t: 2, by: 'opp1', to: [3, 15], peak: 4, flight: 1 };

  // @ts-expect-error The opening shot must say where the ball starts.
  const opening: OpeningShot = { t: 0, by: 'you', to: [3, 5], peak: 3 };

  // @ts-expect-error There are exactly four players, with these names.
  const who: Shot = { t: 2, by: 'coach', to: [3, 15], peak: 4 };

  // @ts-expect-error A scene needs at least one shot.
  const shots: Scene['shots'] = [];

  expect([later, both, opening, who, shots]).toHaveLength(5);
});
