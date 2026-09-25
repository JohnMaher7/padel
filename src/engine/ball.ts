// Works out the ball's whole path from a scene's shots.
//
// Each shot launches the ball so that it lands where the shot says, as high
// as the shot says. From there the ball just follows physics: gravity in the
// air, bounces off the floor and walls, rolling once it runs out of bounce.
// The next shot takes the ball from wherever that leaves it.

import { COURT, PHYSICS, type Surface } from './court';
import type { OpeningShot, PlayerId, Scene, Shot, Vec3 } from './types';

export type Wall = 'left' | 'right' | 'far' | 'near';

export type BallEvent =
  | { kind: 'hit'; t: number; at: Vec3; by: PlayerId; shot: number }
  | { kind: 'floor'; t: number; at: Vec3 }
  | { kind: 'glass' | 'mesh'; t: number; at: Vec3; wall: Wall };

/** A stretch of the path with constant acceleration: p = p0 + v0·u + ½·a·u², where u = t − t0. */
export interface Segment {
  t0: number;
  t1: number;
  p0: Vec3;
  v0: Vec3;
  a: Vec3;
}

export interface BallPath {
  segments: Segment[];
  events: BallEvent[];
}

type V3 = [number, number, number];

/** The velocity that sends the ball from `from` to land on `shot.to` with the shot's peak or flight time. */
export function launchVelocity(from: Vec3, shot: Shot | OpeningShot): V3 {
  const g = PHYSICS.gravity;
  const [x0, y0, h0] = from;
  let up: number, time: number;
  if (shot.peak !== undefined) {
    // A peak below the contact point can't be flown; the validator reports it.
    const peak = Math.max(shot.peak, h0);
    up = Math.sqrt(2 * g * (peak - h0));
    time = up / g + Math.sqrt((2 * peak) / g);
  } else {
    time = shot.flight;
    up = (g * time) / 2 - h0 / time;
  }
  return [(shot.to[0] - x0) / time, (shot.to[1] - y0) / time, up];
}

export function ballPath(scene: Scene): BallPath {
  const path: BallPath = { segments: [], events: [] };
  const { shots } = scene;
  let p: V3 = [...shots[0].from];
  shots.forEach((shot, i) => {
    if (i > 0) p = [...ballAt(path, shot.t)];
    const v = launchVelocity(p, shot);
    path.events.push({ kind: 'hit', t: shot.t, at: [...p], by: shot.by, shot: i });
    fly(path, shot.t, p, v, shots[i + 1]?.t ?? scene.duration);
  });
  return path;
}

/** Where the ball is at time t. Before the first shot it waits at the contact point. */
export function ballAt(path: BallPath, t: number): Vec3 {
  const seg = segmentAt(path, t);
  return seg ? positionIn(seg, clampTime(seg, t)) : [0, 0, 0];
}

export function ballVelocityAt(path: BallPath, t: number): Vec3 {
  const seg = segmentAt(path, t);
  return seg ? velocityIn(seg, clampTime(seg, t)) : [0, 0, 0];
}

function segmentAt(path: BallPath, t: number): Segment | undefined {
  return path.segments.find((s) => t <= s.t1) ?? path.segments[path.segments.length - 1];
}

const clampTime = (s: Segment, t: number) => Math.min(Math.max(t, s.t0), s.t1);

function positionIn(s: Segment, t: number): V3 {
  const u = t - s.t0;
  return [0, 1, 2].map((i) => s.p0[i]! + s.v0[i]! * u + (s.a[i]! * u * u) / 2) as V3;
}

function velocityIn(s: Segment, t: number): V3 {
  const u = t - s.t0;
  return [0, 1, 2].map((i) => s.v0[i]! + s.a[i]! * u) as V3;
}

type Contact = { surface: 'floor' } | { surface: 'wall'; wall: Wall } | { surface: 'stop' };

/** Follow the ball from (t, p, v) until tEnd, adding segments and bounce events to the path. */
function fly(path: BallPath, t: number, p: V3, v: V3, tEnd: number) {
  let mode: 'air' | 'roll' | 'rest' = 'air';
  // A guard against endless tiny bounces; real scenes use a handful.
  for (let step = 0; step < 200 && t < tEnd; step++) {
    const a = acceleration(mode, v);
    let u = Infinity;
    let contact = { surface: 'stop' } as Contact;
    const consider = (du: number, c: Contact) => {
      if (du < u) [u, contact] = [du, c];
    };
    if (mode === 'air') consider(reach(p[2], v[2], a[2], 0, -1), { surface: 'floor' });
    if (mode !== 'rest') {
      consider(reach(p[0], v[0], a[0], 0, -1), { surface: 'wall', wall: 'left' });
      consider(reach(p[0], v[0], a[0], COURT.width, 1), { surface: 'wall', wall: 'right' });
      consider(reach(p[1], v[1], a[1], 0, -1), { surface: 'wall', wall: 'far' });
      consider(reach(p[1], v[1], a[1], COURT.length, 1), { surface: 'wall', wall: 'near' });
    }
    if (mode === 'roll') consider(Math.hypot(v[0], v[1]) / PHYSICS.rollFriction, { surface: 'stop' });

    const t1 = Math.min(t + u, tEnd);
    const seg: Segment = { t0: t, t1, p0: [...p], v0: [...v], a };
    path.segments.push(seg);
    if (t + u >= tEnd) return;

    p = positionIn(seg, t1);
    v = velocityIn(seg, t1);
    t = t1;
    if (contact.surface === 'floor') {
      p[2] = 0;
      v = bounce(v, 2, PHYSICS.floor);
      path.events.push({ kind: 'floor', t, at: [...p] });
      if (v[2] < PHYSICS.rollBelow) [v[2], mode] = [0, 'roll'];
    } else if (contact.surface === 'wall') {
      const axis = contact.wall === 'left' || contact.wall === 'right' ? 0 : 1;
      p[axis] = { left: 0, right: COURT.width, far: 0, near: COURT.length }[contact.wall];
      const mesh = axis === 0 && p[1] > COURT.sideGlass && p[1] < COURT.length - COURT.sideGlass;
      v = bounce(v, axis, mesh ? PHYSICS.mesh : PHYSICS.glass);
      path.events.push({ kind: mesh ? 'mesh' : 'glass', t, at: [...p], wall: contact.wall });
    } else {
      [v, mode] = [[0, 0, 0], 'rest'];
    }
  }
}

function acceleration(mode: 'air' | 'roll' | 'rest', v: V3): V3 {
  if (mode === 'air') return [0, 0, -PHYSICS.gravity];
  const speed = Math.hypot(v[0], v[1]);
  if (mode === 'rest' || speed === 0) return [0, 0, 0];
  return [(-PHYSICS.rollFriction * v[0]) / speed, (-PHYSICS.rollFriction * v[1]) / speed, 0];
}

/**
 * Bounce off a surface whose normal is `axis`. Only the motion into the
 * surface reverses; the motion along it carries on, a little slower.
 */
function bounce(v: V3, axis: number, s: Surface): V3 {
  return v.map((c, i) => (i === axis ? -c * s.normal : c * s.along)) as V3;
}

/**
 * The earliest time u ≥ 0 at which c0 + v·u + ½·a·u² reaches `target` while
 * moving in direction `dir` (+1 or −1). Infinity if it never does.
 */
function reach(c0: number, v: number, a: number, target: number, dir: 1 | -1): number {
  const A = a / 2;
  const C = c0 - target;
  let roots: number[];
  if (Math.abs(A) < 1e-12) roots = Math.abs(v) < 1e-12 ? [] : [-C / v];
  else {
    const disc = v * v - 4 * A * C;
    if (disc < 0) return Infinity;
    const s = Math.sqrt(disc);
    roots = [(-v - s) / (2 * A), (-v + s) / (2 * A)];
  }
  let best = Infinity;
  for (const u of roots) if (u >= 0 && (v + a * u) * dir > 0 && u < best) best = u;
  return best;
}
