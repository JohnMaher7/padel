import { describe, expect, it } from 'vitest';
import { placeIn, resolvePath, type PathData, type ShownTopic } from '../src/lib/paths';

const data: PathData = {
  title: 'Start here',
  summary: 'One point, start to finish.',
  steps: [{ topic: 'where-to-stand', soon: 'Where to stand' }, { topic: 'returning-serve' }, { topic: 'opponents-lob-you' }],
};
const written = [
  { id: 'returning-serve', title: 'Returning serve' },
  { id: 'opponents-lob-you', title: 'Opponents lob you' },
];
const live = (id: string, draft = false): [string, ShownTopic] => [id, { url: `/situations/${id}`, summary: `About ${id}.`, draft }];
/** Both written topics are shown, as in the live site once both are published. */
const shown = new Map([live('returning-serve'), live('opponents-lob-you')]);

function resolve(d: PathData = data, w = written, s: ReadonlyMap<string, ShownTopic> = shown) {
  const problems: string[] = [];
  return { path: resolvePath('start-here', d, w, s, problems), problems };
}

describe('a path', () => {
  it("links each shown step to its topic, with the topic's own title and summary", () => {
    const { path, problems } = resolve();
    expect(problems).toEqual([]);
    expect(path.steps[1]).toEqual({ n: 2, topic: 'returning-serve', title: 'Returning serve', shown: shown.get('returning-serve') });
  });

  it('shows a step that is not written yet as coming soon, under its "soon" name', () => {
    const step = resolve().path.steps[0]!;
    expect(step.title).toBe('Where to stand');
    expect(step.shown).toBeUndefined();
  });

  it('shows a written topic that this build hides (a draft on the live site) as coming soon, under its own title', () => {
    const step = resolve(data, written, new Map([live('opponents-lob-you')])).path.steps[1]!;
    expect(step.title).toBe('Returning serve');
    expect(step.shown).toBeUndefined();
  });

  it('knows where a topic sits, and the steps either side', () => {
    const place = placeIn(resolve().path, 'returning-serve')!;
    expect([place.prev?.n, place.step.n, place.next?.n]).toEqual([1, 2, 3]);
    expect(placeIn(resolve().path, 'opponents-lob-you')!.next).toBeUndefined();
    expect(placeIn(resolve().path, 'bandeja')).toBeUndefined();
  });
});

describe('the path checks catch', () => {
  const messages = (d: PathData) => resolve(d).problems.join('\n');
  const withSteps = (steps: PathData['steps']): PathData => ({ ...data, steps });

  it('a topic name that matches no file (a typo), unless it has a "soon" name', () => {
    expect(messages(withSteps([{ topic: 'returning-serv' }, { topic: 'opponents-lob-you' }]))).toMatch(
      /step 1: there's no topic called "returning-serv"/,
    );
  });

  it('a "soon" line left behind once the topic is written', () => {
    expect(messages(withSteps([{ topic: 'returning-serve', soon: 'Returning' }, { topic: 'opponents-lob-you' }]))).toMatch(
      /step 1: "returning-serve" is written now, so delete its "soon:" line/,
    );
  });

  it('the same topic twice, naming the step it first appears at', () => {
    const steps = [{ topic: 'returning-serve' }, { topic: 'opponents-lob-you' }, { topic: 'returning-serve' }, { topic: 'opponents-lob-you' }];
    expect(messages(withSteps(steps))).toMatch(/step 4: "opponents-lob-you" is already step 2/);
  });
});
