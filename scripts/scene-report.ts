// Prints what the engine works out for a scene: every hit and bounce, where
// each player is at each hit, and any problems. Use it while writing scenes.
//
//   npm run scene                                  (every scene)
//   npm run scene -- opponents-lob-you             (scenes whose name contains this)
//   npm run scene -- opponents-lob-you 3.6-5.6     (also track the ball between two times)
//   npm run scene -- where-to-stand@2 1.0-2.5      (only chapter 2 of a chaptered scene)
//
// In a chaptered scene, `t` is the time within the chapter, as the scene file
// writes it, and `page` is the time on the whole animation, for /test/<name>?t=.

import { ballAt, ballVelocityAt } from '../src/engine/ball';
import { playerAt, timeline, type Chapter } from '../src/engine/sample';
import { check, formatProblems } from '../src/engine/validate';
import { scenes } from '../src/scenes';

const [filter = '', only] = (process.argv[2] ?? '').split('@');
const [trackFrom, trackTo] = (process.argv[3] ?? '').split('-').map(Number);
const f = (n: number) => n.toFixed(2).padStart(6);
let failed = false;

function report({ scene, ball, start }: Chapter, chaptered: boolean) {
  const page = (t: number) => (chaptered ? f(start + t) : '');
  console.log(`     t${chaptered ? '    page' : ''}  event         x      y      h   speed  heading`);
  for (const e of ball.events) {
    const [vx, vy] = ballVelocityAt(ball, e.t + 1e-6);
    const heading = (Math.atan2(vx, -vy) * 180) / Math.PI;
    const label = e.kind === 'hit' ? `hit ${e.by}` : e.kind === 'floor' ? 'floor' : `${e.kind} ${e.wall}`;
    console.log(`${f(e.t)}${page(e.t)}  ${label.padEnd(12)}${f(e.at[0])} ${f(e.at[1])} ${f(e.at[2])} ${f(Math.hypot(vx, vy))} ${f(heading)}°`);
    if (e.kind === 'hit') {
      const p = playerAt(scene, e.by, e.t);
      console.log(`${' '.repeat(chaptered ? 16 : 8)}${e.by} stands at (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`);
    }
  }
  const end = ballAt(ball, scene.duration);
  console.log(`${f(scene.duration)}${page(scene.duration)}  end         ${f(end[0])} ${f(end[1])} ${f(end[2])}`);
  if (trackFrom !== undefined && trackTo !== undefined && trackTo > trackFrom) {
    console.log(`\n     t${chaptered ? '    page' : ''}  ball          x      y      h`);
    for (let t = trackFrom; t <= trackTo + 1e-9; t += 0.05) {
      const [x, y, h] = ballAt(ball, t);
      console.log(`${f(t)}${page(t)}${' '.repeat(14)}${f(x)} ${f(y)} ${f(h)}`);
    }
  }
}

for (const [name, scene] of Object.entries(scenes)) {
  if (!name.includes(filter)) continue;
  const tl = timeline(scene);
  console.log(`\n${name}  (${tl.duration.toFixed(2)} s)`);
  tl.chapters.forEach((chapter, i) => {
    if (only && Number(only) !== i + 1) return;
    if (tl.chaptered) console.log(`\nchapter ${i + 1}: ${chapter.scene.title}  (${chapter.start.toFixed(2)}–${chapter.end.toFixed(2)} s on the page)`);
    console.log('');
    report(chapter, tl.chaptered);
  });
  const problems = check(scene);
  if (problems.length) {
    failed = true;
    console.log(`\n${problems.length} problem(s):\n${formatProblems(problems)}`);
  } else console.log('\nNo problems.');
}

process.exit(failed ? 1 : 0);
