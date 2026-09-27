// The "Broadcast" look (chosen in milestone 2): a drone camera over a real
// indoor court. Blue turf, glass and mesh walls, athletes seen from above,
// and a TV-style caption bar under the court.
//
// The renderer only draws. Where everything is comes from sample.ts and the
// ball path; when it is comes from the Playback clock.

import { gsap } from 'gsap';
import type { BallEvent } from '../ball';
import { COURT, LANDMARKS } from '../court';
import type { Playback, PlaybackState } from '../playback';
import {
  ballPosition,
  captionAt,
  chapterAt,
  clamp,
  PLAYER_IDS,
  playerAt,
  recentEvents,
  serveBall,
  speedAt,
  swingAngle,
  swingAt,
  teamOf,
  type Chapter,
  type Compiled,
  type Timeline,
} from '../sample';
import type { Highlight, PlayerId } from '../types';
import { html, set, setText, svg } from './dom';
import './broadcast.css';

const U = 10; // SVG units per metre
const FIG = 1.25; // figures are drawn a little larger than life so they read on a phone
const PAD = 9; // space around the court for the walls
/** The ball's shadow shifts this far (per metre of height) down and right: light from behind the far-left corner. */
const SHADOW = { dx: 0.34, dy: 0.2 };
/** In a figure's own drawing: the racket shoulder and the centre of the racket head. */
const SHOULDER = [2.8, 0.1] as const;
const RACKET = [4.15, -5.6] as const;

/** Landmark highlights. A colour of their own: orange is our team and yellow is the decision. */
const MARK = '#7ef4ff';

const TEAM = {
  us: { shirt: '#ff7a2f', edge: '#a8420c', rim: '#ffb27e' },
  them: { shirt: '#eef1f4', edge: '#8795a3', rim: '#8fd3ff' },
};
const LOOK: Record<PlayerId, { hair: string; skin: string }> = {
  you: { hair: '#3a2a20', skin: '#d9a07a' },
  partner: { hair: '#c79c5e', skin: '#f0c7a4' },
  opp1: { hair: '#1c1c1e', skin: '#8d5a3b' },
  opp2: { hair: '#6a3b22', skin: '#e6b692' },
};
const ICON = {
  play: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>',
  replay: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor"/></svg>',
};

const deg = (rad: number) => (rad * 180) / Math.PI;
const wrap180 = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;

let mounted = 0;

export function mountBroadcast(root: HTMLElement, tl: Timeline, playback: Playback) {
  const id = `sp${++mounted}`; // keeps SVG ids unique when a page shows several scenes
  const W = COURT.width * U;
  const L = COURT.length * U;

  const player = html('div', { class: 'sp' }, root);
  const frame = html('div', { class: 'sp-frame' }, player);
  const s = svg(
    'svg',
    { viewBox: `${-PAD} ${-PAD} ${W + 2 * PAD} ${L + 2 * PAD}`, role: 'img', 'aria-label': `Top-down animation of a padel point: ${tl.title}` },
    frame,
  );

  // ---- Court ------------------------------------------------------------------
  const defs = svg('defs', {}, s);
  const mesh = svg('pattern', { id: `${id}-mesh`, width: 1.5, height: 1.5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
  svg('rect', { width: 1.5, height: 1.5, fill: '#0e1c2b' }, mesh);
  svg('path', { d: 'M0 0V1.5M0 0H1.5', stroke: '#7d93a8', 'stroke-width': 0.22, fill: 'none' }, mesh);
  const netPattern = svg('pattern', { id: `${id}-net`, width: 0.9, height: 0.9, patternUnits: 'userSpaceOnUse' }, defs);
  svg('rect', { width: 0.9, height: 0.9, fill: '#1b2633' }, netPattern);
  svg('path', { d: 'M0 0H.9M0 0V.9', stroke: '#c9d3dc', 'stroke-width': 0.16, fill: 'none' }, netPattern);
  const floorClip = svg('clipPath', { id: `${id}-floor` }, defs);
  svg('rect', { x: 0, y: 0, width: W, height: L }, floorClip);

  svg('rect', { x: -PAD, y: -PAD, width: W + 2 * PAD, height: L + 2 * PAD, fill: '#13243a' }, s);
  for (let i = 0; i < COURT.length / 2; i++) svg('rect', { x: 0, y: i * 2 * U, width: W, height: 2 * U, fill: i % 2 ? '#2a6aae' : '#2663a4' }, s);
  const lines = svg('g', { stroke: '#f4f7fa', 'stroke-width': 0.55, fill: 'none', opacity: 0.92 }, s);
  const s1 = (COURT.net - COURT.service) * U;
  const s2 = (COURT.net + COURT.service) * U;
  svg('path', { d: `M0 ${s1}H${W}M0 ${s2}H${W}M${W / 2} ${s1}V${s2}` }, lines);

  // Walls: glass at both ends and along the first 4 m of each side, mesh in between.
  const G = COURT.sideGlass * U;
  const walls = svg('g', {}, s);
  for (const x of [-1.6, W]) svg('rect', { x, y: G, width: 1.6, height: L - 2 * G, fill: `url(#${id}-mesh)` }, walls);
  const glass = svg('g', { fill: '#bfe9ff', 'fill-opacity': 0.34, stroke: '#e8f8ff', 'stroke-width': 0.35 }, walls);
  svg('rect', { x: -2.4, y: -2.4, width: W + 4.8, height: 2.4 }, glass);
  svg('rect', { x: -2.4, y: L, width: W + 4.8, height: 2.4 }, glass);
  for (const x of [-2.4, W]) for (const y of [0, L - G]) svg('rect', { x, y, width: 2.4, height: G }, glass);
  const joints = svg('g', { fill: '#0a1420' }, walls);
  for (let x = 0; x <= W; x += 2 * U) for (const y of [-2.4, L]) svg('rect', { x: x - 0.5, y, width: 1, height: 2.4 }, joints);
  for (const x of [-2.4, W]) for (const y of [2 * U, G, L - G, L - 2 * U]) svg('rect', { x, y: y - 0.5, width: 2.4, height: 1 }, joints);
  const shine = svg('g', { stroke: '#ffffff', 'stroke-width': 0.3, opacity: 0.45, 'stroke-linecap': 'round' }, walls);
  for (let x = 4; x < W; x += 2 * U) {
    svg('path', { d: `M${x} -0.6l3 -1.3M${x + 2.5} -0.5l1.6 -.7` }, shine);
    svg('path', { d: `M${x + 6} ${L + 1.9}l3 -1.3M${x + 8.5} ${L + 1.9}l1.6 -.7` }, shine);
  }

  // Posts hold up the side fence. They're landmarks a player can line up with.
  const N = COURT.net * U;
  const posts = svg('g', { fill: '#8d9db0', stroke: '#1d2a38', 'stroke-width': 0.25 }, walls);
  for (const x of [-2.2, W - 0.2])
    for (const d of COURT.posts) for (const y of [N - d * U, N + d * U]) svg('rect', { x, y: y - 0.6, width: 2.4, height: 1.2, rx: 0.3 }, posts);

  // Net, with its shadow on the turf.
  svg('rect', { x: 0, y: N + 0.6, width: W, height: 2.2, fill: '#000', opacity: 0.16, 'clip-path': `url(#${id}-floor)`, transform: 'translate(1.2 0)' }, s);
  svg('rect', { x: -1, y: N - 0.7, width: W + 2, height: 1.4, fill: `url(#${id}-net)` }, s);
  svg('line', { x1: -1, y1: N - 0.65, x2: W + 1, y2: N - 0.65, stroke: '#ffffff', 'stroke-width': 0.5 }, s);
  for (const x of [-2.6, W + 0.6]) svg('rect', { x, y: N - 1.4, width: 2, height: 2.8, rx: 0.4, fill: '#0a1420', stroke: '#546577', 'stroke-width': 0.3 }, s);

  // ---- Layers, bottom to top ---------------------------------------------------
  const markLayer = svg('g', {}, s);
  const shadowLayer = svg('g', { 'clip-path': `url(#${id}-floor)` }, s);
  const ringLayer = svg('g', {}, s);
  const fxLayer = svg('g', {}, s);
  const bodyLayer = svg('g', {}, s);
  const ballLayer = svg('g', {}, s);
  const hudLayer = svg('g', { 'font-family': '"Barlow Condensed", system-ui, sans-serif', 'font-weight': 700 }, s);

  // ---- Landmark highlights ------------------------------------------------------
  // A line across the court at the landmark's distance from the net, and a ring on it at each side
  // wall, so the viewer sees what to line up with. Drawn once for each landmark the scene uses.
  const marks = new Map<string, SVGGElement>();
  const markKey = (h: Highlight) => `${h.end} ${h.landmark}`;
  for (const { scene } of tl.chapters)
    for (const h of scene.highlights ?? []) {
      const key = markKey(h);
      if (marks.has(key)) continue;
      const d = LANDMARKS[h.landmark];
      const y = (h.end === 'near' ? COURT.net + d : COURT.net - d) * U;
      const g = svg('g', { style: 'display:none' }, markLayer);
      if (h.landmark === 'service-line') {
        svg('line', { x1: 0, y1: y, x2: W, y2: y, stroke: MARK, 'stroke-width': 1.6, opacity: 0.35 }, g);
        svg('line', { x1: 0, y1: y, x2: W, y2: y, stroke: MARK, 'stroke-width': 0.6 }, g);
      } else {
        svg('line', { x1: 0, y1: y, x2: W, y2: y, stroke: MARK, 'stroke-width': 0.45, 'stroke-dasharray': '2.2 1.6' }, g);
        for (const x of [-1, W + 1]) {
          svg('circle', { cx: x, cy: y, r: 3.4, fill: MARK, 'fill-opacity': 0.22, stroke: MARK, 'stroke-width': 0.5 }, g);
        }
      }
      marks.set(key, g);
    }

  // ---- Players ------------------------------------------------------------------
  // At contact the racket points straight at the ball, whichever way the player faces.
  const aimsOf = ({ scene, ball }: Compiled) => scene.shots.map((shot, i) => {
    const hit = ball.events.find((e) => e.kind === 'hit' && e.shot === i);
    if (!hit) return 0;
    const p = playerAt(scene, shot.by, shot.t);
    const dx = ((hit.at[0] - p.x) * U) / FIG;
    const dy = ((hit.at[1] - p.y) * U) / FIG;
    const r = (-p.facing * Math.PI) / 180;
    const fx = dx * Math.cos(r) - dy * Math.sin(r);
    const fy = dx * Math.sin(r) + dy * Math.cos(r);
    const toBall = Math.atan2(fy - SHOULDER[1], fx - SHOULDER[0]);
    const racket = Math.atan2(RACKET[1] - SHOULDER[1], RACKET[0] - SHOULDER[0]);
    return clamp(wrap180(deg(toBall - racket)), -150, 110);
  });
  const aims = tl.chapters.map(aimsOf);

  function figure(pid: PlayerId) {
    const team = TEAM[teamOf(pid)];
    const look = LOOK[pid];
    const shadow = svg('ellipse', { rx: 5.5, ry: 3.1, fill: '#000', opacity: 0.26 }, shadowLayer);
    const g = svg('g', {}, bodyLayer);
    const legs = [-1.25, 1.25].map((x) => ({
      x,
      leg: svg('line', { x1: x, y1: 0.3, x2: x, y2: 0.3, stroke: '#1b2430', 'stroke-width': 1.35, 'stroke-linecap': 'round' }, g),
      foot: svg('ellipse', { rx: 0.8, ry: 1.2, fill: '#f7f7f7', stroke: '#9aa4ae', 'stroke-width': 0.2 }, g),
    }));
    svg('path', { d: 'M-2.8 0.1Q-3.8 -1 -3.1 -2.2', stroke: look.skin, 'stroke-width': 1.1, fill: 'none', 'stroke-linecap': 'round' }, g);
    svg('ellipse', { cx: 0, cy: 0.25, rx: 3.3, ry: 1.9, fill: team.shirt, stroke: team.edge, 'stroke-width': 0.35 }, g);
    const arm = svg('g', {}, g);
    svg('path', { d: 'M2.8 0.1Q3.9 -1 3.5 -2.3', stroke: look.skin, 'stroke-width': 1.1, fill: 'none', 'stroke-linecap': 'round' }, arm);
    svg('line', { x1: 3.5, y1: -2.3, x2: 3.85, y2: -3.7, stroke: '#1a1f25', 'stroke-width': 0.7, 'stroke-linecap': 'round' }, arm);
    svg('ellipse', { cx: RACKET[0], cy: RACKET[1], rx: 1.95, ry: 2.35, fill: '#222a34', stroke: team.rim, 'stroke-width': 0.45 }, arm);
    svg('ellipse', { cx: RACKET[0], cy: RACKET[1] - 0.1, rx: 1.25, ry: 1.6, fill: '#34404e' }, arm);
    svg('circle', { cx: 0, cy: 0.1, r: 1.75, fill: look.hair }, g);
    svg('ellipse', { cx: 0, cy: -1.1, rx: 1.1, ry: 0.55, fill: look.skin }, g);
    if (teamOf(pid) === 'us') svg('circle', { cx: 0, cy: 0.1, r: 1.55, fill: 'none', stroke: '#ffffff', 'stroke-width': 0.35, opacity: 0.9 }, g);

    let you: { ring: SVGCircleElement; tag: SVGGElement } | null = null;
    if (pid === 'you') {
      const ring = svg('circle', { r: 7, fill: 'none', stroke: '#ffd400', 'stroke-width': 0.55 }, ringLayer);
      const tag = svg('g', {}, hudLayer);
      svg('rect', { x: -5, y: -3, width: 10, height: 4.4, rx: 0.8, fill: '#ffd400' }, tag);
      svg('path', { d: 'M-1 1.4L0 2.6L1 1.4z', fill: '#ffd400' }, tag);
      svg('text', { x: 0, y: 0.35, 'text-anchor': 'middle', 'font-size': 3.3, fill: '#111', 'letter-spacing': 0.2 }, tag).textContent = 'YOU';
      you = { ring, tag };
    }

    return (c: Chapter, ci: number, t: number, now: number, decide: boolean) => {
      const { scene } = c;
      const p = playerAt(scene, pid, t);
      const X = p.x * U;
      const Y = p.y * U;
      g.setAttribute('transform', `translate(${X} ${Y}) rotate(${p.facing}) scale(${FIG})`);
      shadow.setAttribute('transform', `translate(${X + 2.9} ${Y + 1.75}) rotate(30)`);
      const stride = clamp(speedAt(scene, pid, t) / 3.2, 0, 1);
      const phase = t * Math.PI * 2 * 2.3;
      legs.forEach((l, i) => {
        const o = Math.sin(phase) * stride * 2.4 * (i ? -1 : 1);
        l.leg.setAttribute('y2', String(0.3 + o));
        set(l.foot, { cx: l.x, cy: 0.3 + o + Math.sign(o) * 0.5 });
      });
      const swing = swingAt(scene, pid, t);
      const angle = swing ? swingAngle(swing.phase, aims[ci]?.[swing.shot] ?? 0) : 0;
      arm.setAttribute('transform', `rotate(${angle} ${SHOULDER[0]} ${SHOULDER[1]})`);
      if (you) {
        const r = decide ? 7 + 1.8 * (0.5 + 0.5 * Math.sin(now / 180)) : 7;
        set(you.ring, { cx: X, cy: Y, r, opacity: decide ? 1 : 0.75 });
        you.tag.setAttribute('transform', `translate(${X} ${Y - 12})`);
      }
    };
  }
  const figures = PLAYER_IDS.map(figure);

  // ---- Ball -----------------------------------------------------------------------
  const ballShadow = svg('ellipse', { rx: 1.5, ry: 1.1, fill: '#000' }, shadowLayer);
  const trail = svg('polyline', { fill: 'none', stroke: '#eaf55a', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.35 }, ballLayer);
  const ballDot = svg('circle', { r: 1.5, fill: '#e4f23a', stroke: '#5f6b00', 'stroke-width': 0.3 }, ballLayer);
  const ballShine = svg('circle', { r: 0.5, fill: '#ffffff', opacity: 0.7 }, ballLayer);
  const heightChip = svg('g', {}, hudLayer);
  svg('rect', { x: 0, y: -2.6, width: 11, height: 4.2, rx: 0.7, fill: '#060a0f', opacity: 0.85 }, heightChip);
  const heightText = svg('text', { x: 5.5, y: 0.5, 'text-anchor': 'middle', 'font-size': 3, fill: '#eaf55a' }, heightChip);

  // ---- Effects: bounce rings, glass flashes, racket hits ------------------------------
  const fxPool = Array.from({ length: 4 }, () => svg('ellipse', { fill: 'none', stroke: '#ffffff' }, fxLayer));
  const decideRing = svg('circle', { r: 4, fill: 'none', stroke: '#ffd400', 'stroke-width': 0.5, 'stroke-dasharray': '1.4 1' }, hudLayer);

  function drawEffect(el: SVGEllipseElement, e: (BallEvent & { age: number }) | undefined) {
    if (!e) return el.style.setProperty('display', 'none');
    el.style.removeProperty('display');
    const f = e.age / 0.6;
    const fade = 1 - f;
    if (e.kind === 'glass' || e.kind === 'mesh') {
      // The flash sits on the wall itself, just outside the floor.
      const out = 1.2;
      const sideWall = e.wall === 'left' || e.wall === 'right';
      const cx = e.wall === 'left' ? -out : e.wall === 'right' ? W + out : e.at[0] * U;
      const cy = e.wall === 'far' ? -out : e.wall === 'near' ? L + out : e.at[1] * U;
      const long = 2 + f * 12;
      const short = 1.2 + f * 0.6;
      const strength = e.kind === 'glass' ? 1 : 0.5;
      set(el, {
        cx, cy,
        rx: sideWall ? short : long, ry: sideWall ? long : short,
        fill: '#eafcff', 'fill-opacity': 0.8 * fade * strength,
        'stroke-width': 0.4, 'stroke-opacity': fade * strength,
      });
    } else {
      const grow = e.kind === 'hit' ? 6 : 9;
      set(el, {
        cx: e.at[0] * U, cy: e.at[1] * U,
        rx: 1.2 + f * grow, ry: 1.2 + f * grow,
        fill: 'none', 'stroke-width': e.kind === 'hit' ? 0.5 : 0.4, 'stroke-opacity': 0.9 * fade,
      });
    }
  }

  // ---- Caption bar and controls --------------------------------------------------------
  const cap = html('div', { class: 'sp-cap', 'aria-live': 'polite' }, player);
  const capStep = html('div', { class: 'sp-cap-step' }, cap);
  const capText = html('div', { class: 'sp-cap-text' }, cap);
  const controls = html('div', { class: 'sp-ctrl' }, player);
  const playButton = html('button', { type: 'button', class: 'sp-play', 'aria-label': 'Play' }, controls);
  const replayButton = html('button', { type: 'button', 'aria-label': 'Replay' }, controls);
  replayButton.innerHTML = ICON.replay;
  const track = html('div', { class: 'sp-track', role: 'slider', tabindex: 0, 'aria-label': 'Position in the scene', 'aria-valuemin': 0, 'aria-valuemax': tl.duration }, controls);
  const fill = html('div', { class: 'sp-fill' }, track);
  const at = (t: number) => `${(t / tl.duration) * 100}%`;
  for (const c of tl.chapters.slice(1)) html('div', { class: 'sp-split' }, track).style.left = at(c.start);
  for (const d of tl.decisions) html('div', { class: 'sp-mark', title: 'Decision moment' }, track).style.left = at(d.t);
  const time = html('span', { class: 'sp-time' }, controls);
  const speedButton = html('button', { type: 'button', 'aria-pressed': 'false', 'aria-label': 'Half speed' }, controls, '0.5×');

  // A chaptered scene gets a button per chapter, so a viewer can jump to theirs in one tap.
  const chapterList = tl.chaptered ? html('div', { class: 'sp-chapters', role: 'group', 'aria-label': 'Chapters' }, player) : null;
  const chapterButtons = chapterList
    ? tl.chapters.map((c, i) => {
        const b = html('button', { type: 'button' }, chapterList);
        html('span', { class: 'sp-chapter-n' }, b, String(i + 1));
        html('span', {}, b, c.scene.title);
        b.onclick = () => {
          playback.seek(c.start);
          playback.play();
        };
        return b;
      })
    : [];

  const tapCourt = () => playback.toggle();
  frame.addEventListener('click', tapCourt);
  playButton.onclick = () => playback.toggle();
  replayButton.onclick = () => playback.replay();
  speedButton.onclick = () => playback.setSpeed(playback.state().speed === 1 ? 0.5 : 1);
  track.onclick = (e) => {
    const r = track.getBoundingClientRect();
    playback.seek(((e.clientX - r.left) / r.width) * tl.duration);
  };
  track.onkeydown = (e) => {
    const step = { ArrowLeft: -0.5, ArrowDown: -0.5, ArrowRight: 0.5, ArrowUp: 0.5 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    playback.seek(playback.state().t + step);
  };

  // ---- Drawing ---------------------------------------------------------------------------
  let lastPlayKey = '';
  let marking = false;
  function draw(st: PlaybackState, now: number) {
    const { chapter: c, index: ci, local: t } = chapterAt(tl, st.t);
    figures.forEach((f) => f(c, ci, t, now, st.atDecision));

    // Landmarks fade in and out, and pulse gently while they're named.
    marking = false;
    const lit = new Map<string, number>();
    for (const h of c.scene.highlights ?? []) {
      const fade = clamp((t - h.t) / 0.25, 0, 1) * clamp((h.until - t) / 0.25, 0, 1);
      if (fade > 0) lit.set(markKey(h), Math.max(lit.get(markKey(h)) ?? 0, fade));
    }
    marks.forEach((g, key) => {
      const fade = lit.get(key) ?? 0;
      g.style.display = fade > 0 ? '' : 'none';
      if (fade > 0) g.setAttribute('opacity', String(fade * (0.75 + 0.25 * Math.sin(now / 200))));
      marking ||= fade > 0;
    });

    const [x, y, h] = ballPosition(c, t);
    const k = 1 + h * 0.07; // nearer the camera looks bigger
    const bx = x * U;
    const by = y * U;
    set(ballDot, { cx: bx, cy: by, r: 1.5 * k });
    set(ballShine, { cx: bx - 0.5 * k, cy: by - 0.5 * k, r: 0.45 * k });
    set(ballShadow, { cx: (x + h * SHADOW.dx) * U, cy: (y + h * SHADOW.dy) * U, opacity: clamp(0.45 - h * 0.03, 0.18, 0.45) });
    const points: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const [tx, ty] = ballPosition(c, Math.max(0, t - i * 0.022));
      points.push(`${tx * U},${ty * U}`);
    }
    // No trail while the server is carrying the ball to their spot.
    set(trail, { points: points.join(' '), 'stroke-width': 1.1 * k, display: serveBall(c.scene, t)?.inHand ? 'none' : 'inline' });
    heightChip.style.display = h > 2.2 ? '' : 'none';
    heightChip.setAttribute('transform', `translate(${bx + 3} ${by - 3})`);
    setText(heightText, `${h.toFixed(1)} m`);

    const events = recentEvents(c.ball, t);
    fxPool.forEach((el, i) => drawEffect(el, events[i]));

    decideRing.style.display = st.atDecision ? '' : 'none';
    if (st.atDecision) set(decideRing, { cx: bx, cy: by, r: 4 + 1.2 * Math.sin(now / 180) });

    cap.classList.toggle('decide', st.atDecision);
    const chapterName = tl.chaptered ? `${c.scene.title} · ` : '';
    if (st.atDecision) {
      setText(capStep, tl.chaptered ? `${chapterName}Decision` : 'Decision · tap to see');
      setText(capText, c.scene.decision.prompt);
    } else {
      const caption = captionAt(c.scene, t);
      setText(capStep, `${chapterName}Step ${caption.index + 1} of ${c.scene.captions.length}`);
      setText(capText, caption.text);
    }
    chapterButtons.forEach((b, i) => (i === ci ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));

    const playKey = st.atDecision ? 'go' : st.playing ? 'pause' : 'play';
    if (playKey !== lastPlayKey) {
      lastPlayKey = playKey;
      playButton.classList.toggle('go', playKey === 'go');
      playButton.innerHTML = playKey === 'go' ? `${ICON.play}Continue` : ICON[playKey];
      playButton.setAttribute('aria-label', { go: 'Continue', pause: 'Pause', play: 'Play' }[playKey]);
    }
    fill.style.width = at(st.t);
    track.setAttribute('aria-valuenow', st.t.toFixed(1));
    track.setAttribute('aria-valuetext', `${st.t.toFixed(1)} seconds`);
    setText(time, `${st.t.toFixed(1)}s`);
    speedButton.setAttribute('aria-pressed', st.speed === 1 ? 'false' : 'true');
  }

  // Draw once per frame, and only when something changed (or the decision prompt or a landmark is pulsing).
  let dirty = true;
  const off = playback.on(() => (dirty = true));
  const tick = () => {
    const st = playback.state();
    if (!dirty && !st.atDecision && !marking) return;
    dirty = false;
    draw(st, performance.now());
  };
  gsap.ticker.add(tick);
  tick();

  return {
    destroy() {
      gsap.ticker.remove(tick);
      off();
      frame.removeEventListener('click', tapCourt);
      player.remove();
    },
  };
}
