import type { Scene } from '../engine/types';

// Beginner: block the serve back, low and cross-court, to the server's feet
// as they run in. Their volley has to go up, and the point starts even.
export default {
  title: 'Returning serve',
  duration: 5.0,

  // [t, x, y, facing]
  players: {
    you: [
      [0, 7.1, 18.3, 0], [1.9, 7.1, 18.3, 0], [2.2, 7.15, 18.35, 15],
      [2.5, 7.1, 18.3, 350], [3.8, 6.6, 17.6, 350], [5.0, 6.6, 17.6, 350],
    ],
    partner: [[0, 2.8, 18.0, 0], [2.4, 2.8, 18.0, 0], [4.0, 3.6, 17.3, 10], [5.0, 3.7, 17.2, 10]],
    opp1: [[0, 3.4, 1.6, 180], [1.1, 3.4, 1.6, 180], [2.95, 3.4, 6.7, 180], [5.0, 3.4, 6.8, 180]],
    opp2: [[0, 7.0, 7.0, 180], [2.4, 7.0, 7.0, 180], [3.4, 6.3, 7.2, 185], [5.0, 6.3, 7.2, 185]],
  },

  shots: [
    { t: 1.0, by: 'opp1', from: [3.9, 1.9, 0.75], to: [7.3, 16.3], peak: 1.6, serve: true },
    { t: 2.2, by: 'you', to: [3.7, 5.3], flight: 1.0 },
    { t: 3.12, by: 'opp1', to: [4.4, 15.4], peak: 2.8 },
  ],

  captions: [
    {
      t: 0,
      text: "They're serving to you.",
      detail: 'The server is at the back and their partner is at the net. Your partner stands back, level with you.',
    },
    {
      t: 2.0,
      text: 'Block it low to the server.',
      detail: "Racket back before it bounces, then a short, firm swing. Send it cross-court, low over the net, to land at the server's feet as they run in.",
    },
    { t: 4.0, text: 'Their volley has to go up.', detail: 'From down at their feet, they can only lift it back, soft. The point starts even, and nobody has given anything away.' },
  ],

  decision: { t: 2.0, prompt: 'The serve is coming to you. What do you do with it?' },
} satisfies Scene;
