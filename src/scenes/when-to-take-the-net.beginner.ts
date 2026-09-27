import type { Scene } from '../engine/types';

// Beginner: lob high, deep and cross-court. Only once it's clearly over them
// do you both walk up to the second post, stop as they hit, and volley their
// reply back deep.
export default {
  title: 'When to take the net',
  duration: 8.4,

  // [t, x, y, facing]
  players: {
    you: [
      [0, 7.3, 18.0, 0], [1.5, 7.3, 18.0, 0], [2.0, 7.05, 18.3, 350], [2.5, 7.05, 18.3, 350],
      [3.0, 7.2, 18.1, 0], [3.5, 7.2, 18.1, 0], [5.3, 6.85, 12.0, 0], [6.5, 6.85, 12.0, 0],
      [6.85, 6.5, 12.0, 350], [7.4, 6.7, 12.0, 0], [8.4, 6.7, 12.0, 0],
    ],
    partner: [[0, 2.7, 18.0, 0], [3.5, 2.7, 18.0, 0], [5.3, 3.2, 12.0, 0], [8.4, 3.2, 12.0, 0]],
    opp1: [
      [0, 3.0, 7.8, 180], [2.4, 3.0, 7.8, 180], [2.8, 2.9, 7.3, 20], [5.0, 1.9, 2.6, 30],
      [5.4, 1.85, 2.4, 160], [6.3, 2.5, 2.9, 175], [7.5, 3.0, 3.0, 180], [8.4, 3.5, 1.7, 200],
    ],
    opp2: [
      [0, 7.0, 7.8, 180], [2.5, 7.0, 7.8, 180], [2.9, 7.0, 7.3, 350], [5.0, 6.8, 3.4, 0],
      [5.5, 6.8, 3.2, 180], [8.4, 6.5, 3.2, 180],
    ],
  },

  shots: [
    { t: 0.4, by: 'opp2', from: [6.6, 8.3, 1.1], to: [7.5, 16.3], peak: 2.6 },
    { t: 2.1, by: 'you', to: [2.8, 1.6], peak: 7 },
    { t: 5.6, by: 'opp1', to: [6.8, 13.4], peak: 3.4 },
    { t: 6.85, by: 'you', to: [4.6, 2.8], flight: 1.0 },
  ],

  captions: [
    {
      t: 0,
      text: "They're up. You're back.",
      detail: "Both of them are at the net, and you're both back, level with the join in the side glass. Their volley comes to you.",
    },
    {
      t: 1.5,
      text: 'Lob it high, deep, cross-court.',
      detail:
        'Over the player on the diagonal. Cross-court is the longest line, so it gives you the most room for error and the longest time in the air. Aim for it to land beyond their service line, before their back glass.',
    },
    {
      t: 3.5,
      text: 'Go up together.',
      detail:
        "It's over them, and they have to turn and chase it. That's your time: walk up side by side, level with each other, so there's no gap down the middle. Had the lob dropped short, you'd both have stayed back.",
    },
    {
      t: 4.75,
      text: 'Stop level with the second post.',
      detail:
        "About 2 m from the net: count the net post as the first. Stop as they're about to hit, with a small hop (a split step), so you can move either way. Closer than this, a lob gets over you.",
    },
    {
      t: 6.75,
      text: 'Volley it deep. Keep the net.',
      detail:
        "Getting to the net isn't the same as winning the point. Send their ball back deep and stay where you are. Finish only an easy ball, and if they lob you well, go back together and start again.",
    },
  ],

  decision: { t: 3.5, prompt: 'Your lob has beaten them. Stay back, or go up?' },
  highlights: [
    { t: 1.5, until: 3.5, landmark: 'service-line', end: 'far' },
    { t: 4.75, until: 6.75, landmark: 'second-post', end: 'near' },
  ],
} satisfies Scene;
