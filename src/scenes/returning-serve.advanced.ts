import type { Scene } from '../engine/types';

// Advanced: lob the return high and deep, cross-court over the server as they
// run in. While they turn and chase it, both of you take the net.
export default {
  title: 'Returning serve',
  duration: 8.0,

  // [t, x, y, facing]
  players: {
    you: [
      [0, 7.1, 18.3, 0], [1.9, 7.1, 18.3, 0], [2.2, 7.15, 18.35, 15],
      [2.5, 7.1, 18.2, 0], [4.7, 6.8, 13.0, 0], [8.0, 6.7, 12.9, 0],
    ],
    partner: [[0, 2.8, 16.8, 0], [2.4, 2.8, 16.8, 0], [4.4, 3.2, 12.9, 0], [5.9, 3.3, 12.9, 0], [6.7, 3.7, 13.1, 350], [8.0, 3.7, 13.1, 350]],
    opp1: [
      [0, 3.4, 1.6, 180], [1.1, 3.4, 1.6, 180], [2.45, 3.4, 4.7, 180],
      [2.8, 3.3, 4.4, 330], [4.3, 1.3, 3.3, 20], [5.1, 0.95, 2.9, 40],
      [5.6, 0.95, 2.9, 160], [6.6, 2.7, 3.4, 180], [8.0, 3.0, 3.4, 180],
    ],
    opp2: [[0, 7.0, 7.0, 180], [2.4, 7.0, 7.0, 180], [4.0, 6.7, 4.8, 190], [8.0, 6.7, 4.8, 190]],
  },

  shots: [
    { t: 1.0, by: 'opp1', from: [3.9, 1.9, 0.75], to: [7.3, 16.3], peak: 1.6, serve: true },
    { t: 2.2, by: 'you', to: [3.0, 2.2], peak: 6.5 },
    { t: 5.6, by: 'opp1', to: [4.6, 14.2], peak: 3.5 },
    { t: 6.9, by: 'partner', to: [5.1, 3.4], flight: 0.7 },
  ],

  captions: [
    {
      t: 0,
      text: "They're serving to you.",
      detail: 'The server is at the back and their partner is at the net. Your partner waits on the service line, ready to move up.',
    },
    {
      t: 2.0,
      text: 'Lob it over the server, deep.',
      detail: 'The server is running in to join their partner. Send it high and cross-court, over their head, to land between their service line and the back glass.',
    },
    { t: 4.0, text: 'Run in together. Take the net.', detail: 'While they turn and chase it, you both move up. One shot has swapped the teams round.' },
    { t: 6.0, text: 'Their reply is soft. Volley it.', detail: "Off their back glass, the best they can do is a slow, high ball. You're the team at the net now." },
  ],

  decision: { t: 2.0, prompt: 'The serve is coming to you. What do you do with it?' },
} satisfies Scene;
