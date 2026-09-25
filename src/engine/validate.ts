// Checks a scene against the rules of padel and of believable movement.
// Every problem says when it happens and what to change, so whoever wrote
// the scene (usually the AI) can fix it without guessing. The test suite runs
// this on every scene, so a scene with a problem fails the build.

import { launchVelocity } from './ball';
import { COURT, LIMITS, PHYSICS } from './court';
import { PLAYER_IDS, playerAt, speedAt, teamOf, type Compiled } from './sample';

export interface Problem {
  /** When it happens, in seconds, if it happens at a moment. */
  t: number | null;
  message: string;
}

const m = (n: number) => n.toFixed(2);

export function validate({ scene, ball }: Compiled): Problem[] {
  const problems: Problem[] = [];
  const add = (t: number | null, message: string) => problems.push({ t, message });
  const { duration, shots, captions, decision } = scene;
  const during = (t: number) => t >= 0 && t < duration;

  // ---- Timing ---------------------------------------------------------------
  if (!(duration > 0)) add(null, 'The duration must be above 0 s.');
  if (!(decision.t > 0 && decision.t < duration))
    add(decision.t, `The decision moment must fall inside the scene (0–${duration} s).`);
  if (captions[0]?.t !== 0) add(captions[0]?.t ?? null, 'The first caption must start at 0 s.');
  captions.forEach((c, i) => {
    if (!c.text.trim()) add(c.t, `Caption ${i + 1} is empty.`);
    if (!during(c.t)) add(c.t, `Caption ${i + 1} starts outside the scene.`);
    if (i > 0 && c.t <= captions[i - 1]!.t) add(c.t, `Caption ${i + 1} starts before the one above it ends.`);
  });

  // ---- Players ----------------------------------------------------------------
  for (const id of PLAYER_IDS) {
    const keys = scene.players[id];
    if (keys[0]?.[0] !== 0) add(null, `${id}'s first keyframe must be at 0 s.`);
    const ownSide = teamOf(id) === 'us' ? 'near' : 'far';
    keys.forEach(([t, x, y], i) => {
      if (i > 0 && t <= keys[i - 1]![0]) add(t, `${id}'s keyframes are out of time order.`);
      if (x < LIMITS.wallGap || x > COURT.width - LIMITS.wallGap || y < LIMITS.wallGap || y > COURT.length - LIMITS.wallGap)
        add(t, `${id} is outside the court or touching a wall at (${m(x)}, ${m(y)}).`);
      const wrongSide = ownSide === 'near' ? y < COURT.net + LIMITS.netGap : y > COURT.net - LIMITS.netGap;
      if (wrongSide) add(t, `${id} is at the net or over it at y ${m(y)}. Keep them ${LIMITS.netGap} m back on their own side.`);
    });
    let fastest = { t: 0, speed: 0 };
    for (let t = 0; t <= duration; t += 0.02) {
      const speed = speedAt(scene, id, t);
      if (speed > fastest.speed) fastest = { t, speed };
    }
    if (fastest.speed > LIMITS.runSpeed)
      add(fastest.t, `${id} runs at ${m(fastest.speed)} m/s, faster than a player can (${LIMITS.runSpeed} m/s). Give them more time or less distance.`);
  }

  // ---- Shots ------------------------------------------------------------------
  shots.forEach((shot, i) => {
    const { t, by } = shot;
    const team = teamOf(by);
    const prev = shots[i - 1];
    if (!during(t)) add(t, `Shot ${i + 1} is outside the scene.`);
    if (prev && t <= prev.t) add(t, `Shot ${i + 1} comes before shot ${i}.`);
    if (prev && teamOf(prev.by) === team)
      add(t, `${by} hits right after their own team did. Shots must alternate between the teams.`);

    const hit = ball.events.find((e) => e.kind === 'hit' && e.shot === i);
    if (!hit) return;
    const [bx, by_, bh] = hit.at;

    const pose = playerAt(scene, by, t);
    const gap = Math.hypot(pose.x - bx, pose.y - by_);
    if (gap > LIMITS.reach || gap < LIMITS.reachMin)
      add(t, `${by} is ${m(gap)} m from the ball at contact; the ball is at (${m(bx)}, ${m(by_)}). Put them ${LIMITS.reachMin}–${LIMITS.reach} m from it, or change the shot's time.`);
    if (bh < LIMITS.contactLow || bh > LIMITS.contactHigh)
      add(t, `${by} hits the ball at ${m(bh)} m high; players reach ${LIMITS.contactLow}–${LIMITS.contactHigh} m. Change the shot's time.`);
    const onOwnSide = team === 'us' ? by_ > COURT.net : by_ < COURT.net;
    if (!onOwnSide) add(t, `${by} hits the ball on the other side of the net.`);

    if (shot.peak !== undefined && shot.peak <= bh + 0.1)
      add(t, `Shot ${i + 1} peaks at ${shot.peak} m but is hit from ${m(bh)} m. Raise the peak, or give a flight time instead for a flat or downward shot.`);
    if (shot.flight !== undefined && !(shot.flight > 0)) add(t, `Shot ${i + 1} needs a flight time above 0 s.`);

    const [lx, ly] = shot.to;
    const landsIn = lx > 0 && lx < COURT.width && (team === 'us' ? ly > 0 && ly < COURT.net : ly > COURT.net && ly < COURT.length);
    if (!landsIn) add(t, `Shot ${i + 1} lands at (${m(lx)}, ${m(ly)}), outside the other team's half.`);

    // Where the shot crosses the net, it must clear it.
    const v = launchVelocity(hit.at, shot);
    const u = v[1] === 0 ? -1 : (COURT.net - by_) / v[1];
    if (u > 0) {
      const h = bh + v[2] * u - (PHYSICS.gravity * u * u) / 2;
      if (h < COURT.netHeight + LIMITS.netClearance)
        add(t + u, `Shot ${i + 1} crosses the net only ${m(h)} m high (the net is ${COURT.netHeight} m). Raise its peak.`);
    }

    // The ball may bounce once on the floor before it's hit, never twice.
    if (prev) {
      const floors = ball.events.filter((e) => e.kind === 'floor' && e.t > prev.t && e.t < t);
      if (floors.length > 1)
        add(t, `The ball bounces twice (at ${m(floors[0]!.t)} s and ${m(floors[1]!.t)} s) before ${by} hits it. Hit it sooner.`);
    }
  });

  for (const e of ball.events) {
    if ((e.kind === 'glass' || e.kind === 'mesh') && e.at[2] > COURT.wallHeight)
      add(e.t, `The ball flies out over the ${e.wall} wall at ${m(e.at[2])} m high.`);
  }

  return problems.sort((a, b) => (a.t ?? -1) - (b.t ?? -1));
}

export function formatProblems(problems: Problem[]): string {
  return problems.map((p) => `${p.t === null ? '      ' : `${m(p.t).padStart(5)}s`}  ${p.message}`).join('\n');
}
