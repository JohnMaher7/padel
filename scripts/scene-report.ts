// Prints what the engine works out for a scene: every hit and bounce, where
// each player is at each hit, and any problems. Use it while writing scenes.
//
//   npm run scene                                  (every scene)
//   npm run scene -- opponents-lob-you             (scenes whose name contains this)
//   npm run scene -- opponents-lob-you 3.6-5.6     (also track the ball between two times)

import { ballAt, ballVelocityAt } from '../src/engine/ball';
import { compile, playerAt } from '../src/engine/sample';
import { formatProblems, validate } from '../src/engine/validate';
import { scenes } from '../src/scenes';

const filter = process.argv[2] ?? '';
const [trackFrom, trackTo] = (process.argv[3] ?? '').split('-').map(Number);
const f = (n: number) => n.toFixed(2).padStart(6);
let failed = false;

for (const [name, scene] of Object.entries(scenes)) {
  if (!name.includes(filter)) continue;
  const c = compile(scene);
  console.log(`\n${name}  (${scene.duration} s)\n`);
  console.log('     t  event         x      y      h   speed  heading');
  for (const e of c.ball.events) {
    const [vx, vy] = ballVelocityAt(c.ball, e.t + 1e-6);
    const heading = (Math.atan2(vx, -vy) * 180) / Math.PI;
    const label = e.kind === 'hit' ? `hit ${e.by}` : e.kind === 'floor' ? 'floor' : `${e.kind} ${e.wall}`;
    console.log(`${f(e.t)}  ${label.padEnd(12)}${f(e.at[0])} ${f(e.at[1])} ${f(e.at[2])} ${f(Math.hypot(vx, vy))} ${f(heading)}°`);
    if (e.kind === 'hit') {
      const p = playerAt(scene, e.by, e.t);
      console.log(`${' '.repeat(8)}${e.by} stands at (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`);
    }
  }
  const end = ballAt(c.ball, scene.duration);
  console.log(`${f(scene.duration)}  end         ${f(end[0])} ${f(end[1])} ${f(end[2])}`);
  if (trackFrom !== undefined && trackTo !== undefined && trackTo > trackFrom) {
    console.log('\n     t  ball          x      y      h');
    for (let t = trackFrom; t <= trackTo + 1e-9; t += 0.05) {
      const [x, y, h] = ballAt(c.ball, t);
      console.log(`${f(t)}${' '.repeat(14)}${f(x)} ${f(y)} ${f(h)}`);
    }
  }
  const problems = validate(c);
  if (problems.length) {
    failed = true;
    console.log(`\n${problems.length} problem(s):\n${formatProblems(problems)}`);
  } else console.log('\nNo problems.');
}

process.exit(failed ? 1 : 0);
