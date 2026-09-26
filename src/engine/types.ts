// The scene format: the "sheet music" that the engine plays.
//
// Units are metres and seconds. The court is drawn top-down and upright:
//   x: 0 (left wall) → 10 (right wall)
//   y: 0 (far back glass, the opponents' end) → 20 (near back glass, our end). Net at y = 10.
//   h: height above the floor.
//   facing: degrees clockwise from "up the screen" (0 = towards the far wall).
//
// A scene describes only what a coach would draw: where the players go, and
// the shots (who hits, when, where the ball first lands, how high it goes).
// The engine works out the rest of the ball's path, including every bounce,
// so a ball that swerves off the floor or the glass can't be written at all.

/** Always four players. `you` and `partner` play from the near end (y > 10). */
export type PlayerId = 'you' | 'partner' | 'opp1' | 'opp2';

export type Vec2 = readonly [x: number, y: number];
export type Vec3 = readonly [x: number, y: number, h: number];

/** One point on a player's route. Repeat the same position at a later time to stand still. */
export type Keyframe = readonly [t: number, x: number, y: number, facing: number];

/** How a shot flies: give the top of its arc, or how long it takes to land. Never both. */
type Flight =
  | { /** Highest point of the arc, in metres. Must be above the contact point. */ peak: number; flight?: never }
  | { /** Seconds from contact to the first bounce. Use it for flat or downward shots. */ flight: number; peak?: never };

interface ShotBase {
  /** Moment of contact, in seconds. */
  t: number;
  by: PlayerId;
  /** Where the ball first lands, on the other side of the net. */
  to: Vec2;
}

/**
 * Every shot after the first. There's no `from`: the ball is wherever its
 * flight has carried it at time `t`, and the hitter has to be there.
 */
export type Shot = ShotBase & Flight & { from?: never };

/** The first shot of a scene is the only one that says where the ball starts. */
export type OpeningShot = ShotBase &
  Flight & {
    from: Vec3;
    /** It's a serve: hit underarm from behind the service line, into the service box diagonally across. The validator checks it. */
    serve?: boolean;
  };

/**
 * A caption shows from its time until the next caption starts (the last one runs to the end).
 * It's a headline, short enough to read while the action carries on; the validator checks it has the time.
 */
export interface Caption {
  t: number;
  text: string;
  /** The fuller explanation. It shows in the step list under the animation, not in the caption bar. */
  detail?: string;
}

export interface Scene {
  /** Used as the animation's accessible name. */
  title: string;
  duration: number;
  players: Record<PlayerId, readonly Keyframe[]>;
  shots: readonly [OpeningShot, ...Shot[]];
  captions: readonly Caption[];
  /** The animation stops here, shows the prompt, and waits for a tap. */
  decision: { t: number; prompt: string };
}
