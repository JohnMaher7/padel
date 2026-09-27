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
// A shot (src/content/shots/bandeja.md) is written technique plus coaching
// clips; the plays that use it link to it.

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

const shots = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/shots' }),
  schema: z.object({
    /** The shot's name, as plays write it in their `shots` list. */
    title: z.string(),
    /** One sentence under the title: what the shot is for. */
    summary: z.string(),
    /** Drafts show only in `npm run dev` and on previews. The owner sets this to false after checking the page. */
    draft: z.boolean(),
    /** Coaching clips on YouTube, each starting at the moment that shows the technique. */
    clips: z
      .array(
        z.object({
          youtube: z.string().regex(/^[A-Za-z0-9_-]{11}$/, 'a YouTube video id is the 11 characters after "v=" in its address'),
          /** Seconds into the video where the relevant moment starts, and optionally where it ends. */
          start: z.number().int().min(0),
          end: z.number().int().positive().optional(),
          /** What the clip shows, in our words. */
          title: z.string(),
          /** Whose video it is, credited under the clip. */
          channel: z.string(),
        }),
      )
      .default([]),
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

export const collections = { topics, plays, paths, shots };
