// Loads the topics and pairs each one with its plays and scenes. Anything that
// doesn't line up (a missing play, a play without a scene) stops the build,
// with a message that says which file to add or fix.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Scene } from '../engine/types';
import { scenes } from '../scenes';

export const LEVELS = ['beginner', 'advanced'] as const;
export type Level = (typeof LEVELS)[number];

/** What each level means. The level is the player's overall level, not theirs against the opponents. */
export const LEVEL_INFO: Record<Level, { name: string; aim: string }> = {
  beginner: { name: 'Beginner', aim: 'Keep the ball in play and take no risks.' },
  advanced: { name: 'Advanced', aim: 'Take the initiative whenever the ball lets you.' },
};

export interface Play {
  level: Level;
  entry: CollectionEntry<'plays'>;
  sceneName: string;
  scene: Scene;
}

export interface Topic {
  entry: CollectionEntry<'topics'>;
  url: string;
  plays: Record<Level, Play>;
}

/**
 * Drafts show while you work (`npm run dev`) and on the preview address Cloudflare builds for any
 * branch other than `main`, so a draft can be checked on a phone. Never in the build for the live
 * site. Cloudflare's builds set WORKERS_CI_BRANCH; a build without it counts as live.
 */
const branch = process.env.WORKERS_CI_BRANCH;
export const showDrafts = import.meta.env.DEV || (!!branch && branch !== 'main');

export async function getTopics(): Promise<Topic[]> {
  const [topics, plays] = await Promise.all([getCollection('topics'), getCollection('plays')]);
  const problems: string[] = [];

  for (const play of plays) {
    const topicId = play.id.slice(0, play.id.lastIndexOf('.'));
    const level = play.id.slice(topicId.length + 1);
    if (!(LEVELS as readonly string[]).includes(level))
      problems.push(`src/content/plays/${play.id}.md should end in .${LEVELS.join('.md or .')}.md.`);
    else if (!topics.some((t) => t.id === topicId))
      problems.push(`src/content/plays/${play.id}.md has no topic. Add src/content/topics/${topicId}.md.`);
  }

  const result: Topic[] = [];
  for (const entry of topics) {
    const found: Partial<Record<Level, Play>> = {};
    for (const level of LEVELS) {
      const id = `${entry.id}.${level}`;
      const play = plays.find((p) => p.id === id);
      if (!play) {
        problems.push(`"${entry.data.title}" has no ${level} play. Add src/content/plays/${id}.md.`);
        continue;
      }
      const sceneName = play.data.scene ?? id;
      const scene = scenes[sceneName];
      if (!scene) {
        problems.push(`src/content/plays/${id}.md needs the scene "${sceneName}", which isn't listed in src/scenes/index.ts.`);
        continue;
      }
      found[level] = { level, entry: play, sceneName, scene };
    }
    if (found.beginner && found.advanced && (showDrafts || !entry.data.draft))
      result.push({ entry, url: `/situations/${entry.id}`, plays: { beginner: found.beginner, advanced: found.advanced } });
  }

  if (problems.length) throw new Error(`The topics don't line up:\n- ${problems.join('\n- ')}`);
  return result.sort((a, b) => a.entry.data.title.localeCompare(b.entry.data.title));
}

/** The scenes that get a test page: every scene wherever drafts show, but only published topics' in the live site. */
export async function testSceneNames(): Promise<string[]> {
  if (showDrafts) return Object.keys(scenes);
  const topics = await getTopics();
  return topics.flatMap((topic) => LEVELS.map((level) => topic.plays[level].sceneName));
}
