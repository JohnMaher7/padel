// The site's words. Each topic is a Markdown file, and each topic has one
// "play" per level, named like its scene:
//
//   src/content/topics/opponents-lob-you.md              general advice
//   src/content/plays/opponents-lob-you.beginner.md      the beginner play's words
//   src/scenes/opponents-lob-you.beginner.ts             the beginner play's animation
//
// src/lib/topics.ts checks that the three line up, so a missing play or scene
// fails the build.
//
// A path lists topics in order, like a playlist: src/content/paths/start-here.yaml.

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const topics = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['situation', 'shot']),
    /** One sentence under the title: the moment this topic is about. */
    summary: z.string(),
    /** Drafts show only in `npm run dev`. The owner sets this to false after checking the topic. */
    draft: z.boolean(),
    /** Where on our half of the court it happens, in metres (x 0–10, y 10–20), for the map on the home page. */
    spot: z.tuple([z.number().min(0).max(10), z.number().min(10).max(20)]).optional(),
  }),
});

const plays = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/plays',
    // Keep the file name as it is ("opponents-lob-you.beginner"), so it matches the scene's name.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    /** The right play at this level, in a few words. It's the heading of the tab. */
    play: z.string(),
    /** The shots this play uses, by name. Each links to its shot page once that page exists. */
    shots: z.array(z.string()).default([]),
    /** The animation to show. Leave it out to use the scene with the same name as this file. */
    scene: z.string().optional(),
  }),
});

/** src/lib/paths.ts checks that every step names a real topic, or has a "soon" name until it's written. */
const paths = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/paths' }),
  schema: z.object({
    title: z.string(),
    /** One sentence under the title on the home page. */
    summary: z.string(),
    steps: z
      .array(
        z.object({
          /** The topic's file name, without .md. */
          topic: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'a topic name is lower case words joined by hyphens'),
          /** The name to show until the topic is written. Delete it once the topic's file exists. */
          soon: z.string().optional(),
        }),
      )
      .min(2),
  }),
});

export const collections = { topics, plays, paths };
