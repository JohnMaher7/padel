// The court and the physics the engine plays by. Metres, seconds.

export const COURT = {
  width: 10,
  length: 20,
  net: 10,
  /** Net height at the centre (it's 0.92 m at the posts). */
  netHeight: 0.88,
  /** Service lines sit this far from the net. */
  service: 6.95,
  /** Glass runs this far along each side wall from each end; mesh fills the middle. */
  sideGlass: 4,
  /** A ball that reaches a wall above this height leaves the court. */
  wallHeight: 3,
} as const;

/**
 * How a surface returns the ball. `normal` is the share of the speed going
 * into the surface that comes back out; `along` is the share of the speed
 * along the surface that's kept. Because both horizontal directions on the
 * floor lose the same share, a floor bounce never changes the ball's heading.
 */
export interface Surface {
  normal: number;
  along: number;
}

export const PHYSICS = {
  gravity: 9.81,
  floor: { normal: 0.62, along: 0.7 } satisfies Surface,
  glass: { normal: 0.6, along: 0.9 } satisfies Surface,
  mesh: { normal: 0.3, along: 0.6 } satisfies Surface,
  /** After a floor bounce slower than this (m/s upwards), the ball rolls instead. */
  rollBelow: 1,
  /** How quickly a rolling ball slows down (m/s²). */
  rollFriction: 1.5,
} as const;

/** Rules the validator checks scenes against. */
export const LIMITS = {
  /** How far from a player's centre the ball can be at contact: past the body, within the drawn racket's reach. */
  reachMin: 0.35,
  reach: 1.2,
  /** Contact heights a player can actually hit at. */
  contactLow: 0.15,
  contactHigh: 3.2,
  /** How much a shot must clear the net by. */
  netClearance: 0.05,
  /** Top running speed (m/s). Faster than this looks like a glitch. */
  runSpeed: 7,
  /** Players keep this far from the walls and the net. */
  wallGap: 0.2,
  netGap: 0.3,
  /** A serve is hit at or below the waist. */
  serveHigh: 1.0,
  /** Reading time a caption needs on screen at 1× speed: a moment to notice it changed, then a quarter-second a word. */
  readBase: 0.5,
  readPerWord: 0.25,
} as const;
