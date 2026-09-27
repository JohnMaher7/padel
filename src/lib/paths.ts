// Paths: topics in order, like a playlist (src/content/paths/<path>.yaml).
// A path adds no content. A step shows its topic's own title and summary once
// the topic is published, and "coming soon" until then.
//
// This file has no Astro imports, so the tests can run it directly.
// src/lib/topics.ts loads the files and calls it.

export interface PathData {
  title: string;
  summary: string;
  steps: readonly { topic: string; soon?: string | undefined }[];
}

/** A topic as the path sees it: every written topic, draft or not. */
export interface WrittenTopic {
  id: string;
  title: string;
}

/** A topic this build shows: published ones, plus drafts in `npm run dev` and on previews. */
export interface ShownTopic {
  url: string;
  summary: string;
  draft: boolean;
}

export interface PathStep {
  /** 1 for the first step. */
  n: number;
  topic: string;
  title: string;
  /** Set when the topic is shown in this build. Without it, the step is "coming soon" and isn't a link. */
  shown?: ShownTopic;
}

export interface Path {
  id: string;
  title: string;
  summary: string;
  steps: PathStep[];
}

/** Where a topic sits in a path, with the steps either side of it. */
export interface Place {
  path: Path;
  step: PathStep;
  prev?: PathStep | undefined;
  next?: PathStep | undefined;
}

/**
 * Turns a path file into its steps. Anything wrong goes into `problems`, each
 * message saying which line of which file to change.
 */
export function resolvePath(
  id: string,
  data: PathData,
  written: readonly WrittenTopic[],
  shown: ReadonlyMap<string, ShownTopic>,
  problems: string[],
): Path {
  const file = `src/content/paths/${id}.yaml`;
  const steps = data.steps.map(({ topic, soon }, i): PathStep => {
    const n = i + 1;
    const first = data.steps.findIndex((s) => s.topic === topic);
    if (first < i) problems.push(`${file}, step ${n}: "${topic}" is already step ${first + 1}. A topic appears once in a path.`);

    const found = written.find((t) => t.id === topic);
    if (found && soon !== undefined)
      problems.push(`${file}, step ${n}: "${topic}" is written now, so delete its "soon:" line. The topic's own title is used from now on.`);
    if (!found && soon === undefined)
      problems.push(
        `${file}, step ${n}: there's no topic called "${topic}". Fix the name to match a file in src/content/topics, or add a "soon:" line with the name to show until it's written.`,
      );

    const step: PathStep = { n, topic, title: found?.title ?? soon ?? topic };
    const live = shown.get(topic);
    if (live) step.shown = live;
    return step;
  });
  return { id, title: data.title, summary: data.summary, steps };
}

/** Where `topic` sits in `path`, or undefined if it isn't in it. */
export function placeIn(path: Path, topic: string): Place | undefined {
  const i = path.steps.findIndex((s) => s.topic === topic);
  if (i === -1) return undefined;
  return { path, step: path.steps[i]!, prev: path.steps[i - 1], next: path.steps[i + 1] };
}
