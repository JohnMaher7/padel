// Loads the topics and pairs each one with its plays and scenes. Anything that
// doesn't line up (a missing play, a play without a scene) stops the build,
// with a message that says which file to add or fix.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { ChapteredScene, Scene } from '../engine/types';
import { scenes } from '../scenes';
import { placeIn, resolvePath, type Path, type Place, type ShownTopic } from './paths';

export const LEVELS = ['beginner', 'advanced'] as const;
export type Level = (typeof LEVELS)[number];
/** A play is for one level, or for every level: a topic whose right play doesn't depend on the level has a single play. */
export type PlayLevel = Level | 'all';

/** What each level means. The level is the player's overall level, not theirs against the opponents. */
export const LEVEL_INFO: Record<PlayLevel, { name: string; aim: string }> = {
  beginner: { name: 'Beginner', aim: 'Keep the ball in play and take no risks.' },
  advanced: { name: 'Advanced', aim: 'Take the initiative whenever the ball lets you.' },
  all: { name: 'Every level', aim: 'The same at every level.' },
};

export interface Play {
  level: PlayLevel;
  entry: CollectionEntry<'plays'>;
  sceneName: string;
  scene: Scene | ChapteredScene;
  /** The shots it uses, each with a link once its page is shown. */
  shots: ShotLink[];
}

export interface ShotLink {
  title: string;
  url?: string | undefined;
}

export interface Shot {
  entry: CollectionEntry<'shots'>;
  url: string;
}

/** The shot pages this build shows: published ones, plus drafts wherever drafts show. */
export async function getShots(): Promise<Shot[]> {
  const shots = await getCollection('shots');
  return shots
    .filter((s) => showDrafts || !s.data.draft)
    .map((entry) => ({ entry, url: `/shots/${entry.id}` }))
    .sort((a, b) => a.entry.data.title.localeCompare(b.entry.data.title));
}

export interface Topic {
  entry: CollectionEntry<'topics'>;
  url: string;
  /** One play for every level, or a Beginner play and an Advanced play, in that order. */
  plays: Play[];
}

/**
 * Drafts show while you work (`npm run dev`) and on the preview address Cloudflare builds for any
 * branch other than `main`, so a draft can be checked on a phone. Never in the build for the live
 * site. Cloudflare's builds set WORKERS_CI_BRANCH; a build without it counts as live.
 */
const branch = process.env.WORKERS_CI_BRANCH;
export const showDrafts = import.meta.env.DEV || (!!branch && branch !== 'main');

export async function getTopics(): Promise<Topic[]> {
  const [topics, plays, shotFiles, shown] = await Promise.all([getCollection('topics'), getCollection('plays'), getCollection('shots'), getShots()]);
  const problems: string[] = [];

  // A play names its shots by title. Every name must have a shot file; it's a link once that page is shown.
  const shotsOf = (play: CollectionEntry<'plays'>): ShotLink[] =>
    play.data.shots.map((name) => {
      const same = (title: string) => title.toLowerCase() === name.toLowerCase();
      const file = shotFiles.find((s) => same(s.data.title));
      if (!file)
        problems.push(
          `src/content/plays/${play.id}.md names the shot "${name}", which has no page. Use one of: ${shotFiles.map((s) => s.data.title).join(', ')}.`,
        );
      return { title: file?.data.title ?? name, url: shown.find((s) => same(s.entry.data.title))?.url };
    });

  for (const play of plays) {
    const topicId = play.id.slice(0, play.id.lastIndexOf('.'));
    const level = play.id.slice(topicId.length + 1);
    if (![...LEVELS, 'all'].includes(level))
      problems.push(`src/content/plays/${play.id}.md should end in .beginner.md, .advanced.md, or .all.md for one play for every level.`);
    else if (!topics.some((t) => t.id === topicId))
      problems.push(`src/content/plays/${play.id}.md has no topic. Add src/content/topics/${topicId}.md.`);
  }

  const result: Topic[] = [];
  for (const entry of topics) {
    const has = (level: PlayLevel) => plays.some((p) => p.id === `${entry.id}.${level}`);
    let levels: readonly PlayLevel[] = LEVELS;
    if (has('all')) {
      levels = ['all'];
      if (LEVELS.some(has))
        problems.push(
          `"${entry.data.title}" has a play for every level (src/content/plays/${entry.id}.all.md) and a play for one level. Keep one or the other.`,
        );
    }
    const found: Play[] = [];
    for (const level of levels) {
      const id = `${entry.id}.${level}`;
      const play = plays.find((p) => p.id === id);
      if (!play) {
        problems.push(`"${entry.data.title}" has no ${level} play. Add src/content/plays/${id}.md, or ${entry.id}.all.md for one play for every level.`);
        continue;
      }
      const sceneName = play.data.scene ?? id;
      const scene = scenes[sceneName];
      if (!scene) {
        problems.push(`src/content/plays/${id}.md needs the scene "${sceneName}", which isn't listed in src/scenes/index.ts.`);
        continue;
      }
      found.push({ level, entry: play, sceneName, scene, shots: shotsOf(play) });
    }
    if (found.length === levels.length && (showDrafts || !entry.data.draft)) result.push({ entry, url: `/situations/${entry.id}`, plays: found });
  }

  if (problems.length) throw new Error(`The topics don't line up:\n- ${problems.join('\n- ')}`);
  return result.sort((a, b) => a.entry.data.title.localeCompare(b.entry.data.title));
}

/** Every play that uses a shot, for the "Used in" list on the shot's page. */
export function playsUsing(topics: readonly Topic[], shot: Shot): { topic: Topic; play: Play }[] {
  return topics.flatMap((topic) => topic.plays.filter((play) => play.shots.some((s) => s.url === shot.url)).map((play) => ({ topic, play })));
}

/** The scenes that get a test page: every scene wherever drafts show, but only published topics' in the live site. */
export async function testSceneNames(): Promise<string[]> {
  if (showDrafts) return Object.keys(scenes);
  const topics = await getTopics();
  return topics.flatMap((topic) => topic.plays.map((play) => play.sceneName));
}

/** Every path, with each step linked to its topic if this build shows it. A path that names a missing topic stops the build. */
export async function getPaths(): Promise<Path[]> {
  const [entries, shown, files] = await Promise.all([getCollection('topics'), getTopics(), getCollection('paths')]);
  const written = entries.map((e) => ({ id: e.id, title: e.data.title }));
  const live = new Map<string, ShownTopic>(
    shown.map((t) => [t.entry.id, { url: t.url, summary: t.entry.data.summary, draft: t.entry.data.draft }]),
  );
  const problems: string[] = [];
  const paths = files.map((file) => resolvePath(file.id, file.data, written, live, problems));
  if (problems.length) throw new Error(`The paths don't line up:\n- ${problems.join('\n- ')}`);
  return paths;
}

/** Every path a topic is in, and where it sits in each. */
export function placesOf(paths: readonly Path[], topic: string): Place[] {
  return paths.flatMap((path) => placeIn(path, topic) ?? []);
}
