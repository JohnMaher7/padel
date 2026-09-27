import type { ChapteredScene, Scene } from '../engine/types';

// Where to stand at the start of a point: one chapter for each of the four
// ways a point starts. Each chapter opens with everyone between points, stops
// on "Where do you stand?", then walks them to their spots and plays the serve
// and a shot or two. "You" play on the right throughout.

/** Between points: each pair stands together in the middle of its half. */
const between = {
  you: [6.0, 15.2, 0],
  partner: [4.0, 15.2, 0],
  opp1: [4.0, 4.8, 180],
  opp2: [6.0, 4.8, 180],
} as const;

// ---- 1. You serve: the first point of a game, from the right --------------------------
const youServe: Scene = {
  title: 'You serve',
  duration: 8.0,

  // [t, x, y, facing]
  players: {
    you: [
      [0, ...between.you], [1.1, ...between.you], [2.7, 7.4, 17.6, 345], [4.95, 7.4, 17.6, 345],
      [6.95, 6.75, 13.95, 345], [8.0, 6.6, 13.4, 350],
    ],
    partner: [[0, ...between.partner], [1.1, ...between.partner], [2.6, 3.0, 12.0, 0], [8.0, 3.0, 12.0, 0]],
    opp1: [[0, ...between.opp1], [1.1, ...between.opp1], [2.7, 2.4, 1.8, 180], [5.2, 2.4, 1.8, 180], [6.15, 2.95, 2.4, 170], [8.0, 3.0, 2.6, 175]],
    opp2: [[0, ...between.opp2], [1.1, ...between.opp2], [2.7, 7.4, 1.9, 180], [8.0, 7.4, 1.9, 180]],
  },

  shots: [
    { t: 4.9, by: 'you', from: [7.87, 17.22, 0.8], to: [3.3, 5.0], peak: 1.6, serve: true },
    { t: 6.15, by: 'opp1', to: [7.1, 16.3], peak: 1.5 },
    { t: 6.95, by: 'you', to: [3.2, 3.2], peak: 1.5 },
  ],

  captions: [
    { t: 0, text: "You're serving.", detail: 'The first point of every game is served from the right, into the box diagonally across.' },
    { t: 1.1, text: 'Just behind the service line.', detail: 'In the middle of your half, so every part of the box you serve into is in reach.' },
    { t: 2.9, text: 'Partner: level with the second post.', detail: 'At the net in the other half, about 2 m back from it, a little towards the middle.' },
    { t: 4.9, text: 'Then follow your serve in.', detail: 'After a good serve, move up to join your partner at the net.' },
  ],
  decision: { t: 1.1, prompt: 'Where do you stand?' },
  highlights: [
    { t: 1.1, until: 2.9, landmark: 'service-line', end: 'near' },
    { t: 2.9, until: 4.9, landmark: 'second-post', end: 'near' },
  ],
};

// ---- 2. Your partner serves: from the left, as on any even point ------------------------
const partnerServes: Scene = {
  title: 'Your partner serves',
  duration: 7.8,

  players: {
    you: [[0, ...between.you], [1.6, ...between.you], [3.0, 7.0, 12.0, 0], [6.2, 7.0, 12.0, 0], [6.78, 7.45, 11.9, 355], [7.8, 7.3, 12.0, 350]],
    partner: [[0, ...between.partner], [1.6, ...between.partner], [3.1, 2.6, 17.6, 15], [4.95, 2.6, 17.6, 15], [7.8, 3.5, 14.4, 10]],
    opp1: [[0, ...between.opp1], [1.6, ...between.opp1], [3.1, 2.6, 1.9, 180], [6.9, 2.6, 1.9, 180], [7.8, 2.5, 3.2, 175]],
    opp2: [[0, ...between.opp2], [1.6, ...between.opp2], [3.1, 7.6, 1.8, 180], [5.3, 7.6, 1.8, 180], [6.15, 7.95, 2.35, 185], [7.8, 7.6, 3.2, 180]],
  },

  shots: [
    { t: 4.9, by: 'partner', from: [3.2, 17.5, 0.8], to: [6.7, 5.0], peak: 1.6, serve: true },
    { t: 6.15, by: 'opp2', to: [8.3, 15.6], peak: 1.3 },
    { t: 6.78, by: 'you', to: [3.0, 6.0], flight: 0.7 },
  ],

  captions: [
    { t: 0, text: 'Your partner is serving.', detail: 'Serves swap sides every point. This one is from the left, so you take the right.' },
    { t: 1.6, text: 'Level with the second post.', detail: 'At the net, about 2 m back from it. Count the net post as the first. Any closer and a lob gets over you.' },
    { t: 3.4, text: 'Cover the middle and your side.', detail: 'Stand a little in from the middle of your half. A return through the middle or down your side is yours to volley.' },
  ],
  decision: { t: 1.6, prompt: 'Where do you stand?' },
  highlights: [{ t: 1.6, until: 3.4, landmark: 'second-post', end: 'near' }],
};

// ---- 3. They serve to you ----------------------------------------------------------------
const theyServeToYou: Scene = {
  title: 'They serve to you',
  duration: 7.15,

  players: {
    you: [[0, ...between.you], [1.6, ...between.you], [3.1, 7.6, 18.2, 350], [6.2, 7.6, 18.2, 350], [7.15, 7.4, 17.5, 350]],
    partner: [[0, ...between.partner], [1.6, ...between.partner], [3.1, 2.4, 18.2, 10], [6.2, 2.4, 18.2, 10], [7.15, 2.6, 17.5, 10]],
    opp1: [[0, ...between.opp1], [1.6, ...between.opp1], [3.1, 2.6, 2.3, 160], [4.95, 2.6, 2.3, 160], [7.15, 3.9, 5.2, 175]],
    opp2: [[0, ...between.opp2], [1.6, ...between.opp2], [3.1, 7.0, 8.0, 180], [7.15, 7.0, 8.0, 180]],
  },

  shots: [
    { t: 4.9, by: 'opp1', from: [2.17, 2.72, 0.8], to: [7.2, 15.6], peak: 1.6, serve: true },
    { t: 6.1, by: 'you', to: [3.4, 5.8], flight: 1.0 },
  ],

  captions: [
    { t: 0, text: "They're serving to you.", detail: 'Their server is at the back and their partner is at the net.' },
    { t: 1.6, text: 'Level with the glass join.', detail: 'The join between the two side glass panels: 2 m from the back wall, about a metre behind your service line. Stand about 2 m in from the side glass.' },
    { t: 3.4, text: 'Partner: back, level with you.', detail: 'Not at the net. Level with each other, you can move up or back together once the point starts.' },
  ],
  decision: { t: 1.6, prompt: 'Where do you stand?' },
  highlights: [
    { t: 1.6, until: 3.4, landmark: 'glass-join', end: 'near' },
    { t: 3.4, until: 5.2, landmark: 'glass-join', end: 'near' },
  ],
};

// ---- 4. They serve to your partner ------------------------------------------------------
const theyServeToPartner: Scene = {
  title: 'They serve to your partner',
  duration: 8.6,

  players: {
    you: [[0, ...between.you], [1.8, ...between.you], [3.2, 7.6, 18.2, 350], [6.3, 7.6, 18.2, 350], [8.6, 7.0, 12.8, 355]],
    partner: [
      [0, ...between.partner], [1.8, ...between.partner], [3.2, 2.4, 18.2, 10], [5.3, 2.4, 18.2, 10],
      [6.1, 1.85, 18.1, 15], [6.4, 1.95, 17.8, 10], [8.6, 3.0, 12.8, 5],
    ],
    opp1: [[0, ...between.opp1], [1.8, ...between.opp1], [3.2, 3.0, 8.0, 180], [6.5, 3.0, 8.0, 180], [8.6, 3.4, 5.1, 170]],
    opp2: [[0, ...between.opp2], [1.8, ...between.opp2], [3.2, 7.4, 2.4, 200], [4.95, 7.4, 2.4, 200], [6.5, 6.9, 4.8, 185], [8.3, 8.5, 1.8, 160], [8.6, 8.75, 1.4, 165]],
  },

  shots: [
    { t: 4.9, by: 'opp2', from: [6.8, 2.45, 0.8], to: [2.9, 15.6], peak: 1.6, serve: true },
    { t: 6.1, by: 'partner', to: [7.2, 1.8], peak: 4.6 },
  ],

  captions: [
    { t: 0, text: "They're serving to your partner.", detail: 'This time their server is on the other side, and the serve goes to your partner.' },
    { t: 1.8, text: 'Back, level with your partner.', detail: 'At the glass join too, on your side of the court. Not at the net, where their net player can volley at your feet.' },
    { t: 3.6, text: 'Then move as a pair.', detail: 'Wherever the return goes, move up or back together. Never one at the net and one at the back.' },
  ],
  decision: { t: 1.8, prompt: 'Where do you stand?' },
  highlights: [{ t: 1.8, until: 3.6, landmark: 'glass-join', end: 'near' }],
};

export default {
  title: 'Where to stand at the start of a point',
  chapters: [youServe, partnerServes, theyServeToYou, theyServeToPartner],
} satisfies ChapteredScene;
