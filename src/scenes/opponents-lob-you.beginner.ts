import type { Scene } from '../engine/types';

// Beginner: let the lob bounce and come off the back glass, then lob back
// and take the net again together.
export default {
  title: 'Opponents lob you',
  duration: 8.6,

  // [t, x, y, facing]
  players: {
    you: [
      [0, 3.0, 12.8, 0], [1.95, 3.0, 12.8, 0], [2.3, 2.85, 13.4, 200],
      [3.5, 1.5, 16.9, 190], [4.1, 1.4, 18.3, 120], [4.6, 1.45, 18.45, 40], [4.95, 1.45, 18.45, 35],
      [5.6, 2.2, 17.2, 0], [7.8, 3.0, 12.9, 0], [8.6, 3.0, 12.8, 0],
    ],
    partner: [
      [0, 6.8, 12.8, 0], [2.0, 6.8, 12.8, 0], [2.35, 6.8, 13.4, 170],
      [3.9, 6.5, 17.3, 175], [4.3, 6.4, 17.6, 0], [5.2, 6.4, 17.5, 0],
      [5.7, 6.5, 16.6, 0], [7.9, 6.9, 12.9, 0], [8.6, 7.0, 12.8, 0],
    ],
    opp1: [
      [0, 2.9, 1.9, 180], [1.5, 2.9, 1.9, 180], [1.8, 3.0, 2.4, 180],
      [3.9, 3.2, 7.3, 180], [5.2, 3.2, 7.4, 180], [5.6, 3.1, 6.7, 10],
      [7.4, 3.3, 2.6, 20], [8.1, 3.2, 2.2, 150], [8.6, 3.2, 2.2, 150],
    ],
    opp2: [
      [0, 7.8, 1.6, 180], [0.9, 7.5, 1.3, 180], [1.4, 7.5, 1.3, 180],
      [1.8, 7.4, 2.2, 180], [3.9, 6.8, 7.3, 180], [5.2, 6.8, 7.4, 180],
      [5.6, 6.9, 6.7, 350], [7.4, 8.0, 3.3, 345], [8.1, 8.2, 2.8, 165], [8.6, 8.2, 2.8, 165],
    ],
  },

  shots: [
    { t: 0, by: 'partner', from: [7.3, 12.4, 1.0], to: [7.0, 3.4], peak: 2.0 },
    { t: 1.35, by: 'opp2', to: [3.3, 17.5], peak: 7 },
    { t: 4.95, by: 'you', to: [6.9, 2.4], peak: 7 },
  ],

  captions: [
    { t: 0, text: "You're both at the net.", detail: "They're stuck at the back, so they lob it over your heads." },
    {
      t: 1.95,
      text: 'Run back together. Let it bounce.',
      detail: 'Turn and run back; your partner drops back with you, so there\'s no gap. Let it bounce and come off the back glass, where it slows down and drops to a comfortable height.',
    },
    { t: 4.2, text: 'Lob it back, high and deep.', detail: 'A high, deep lob sends them back to chase it.' },
    { t: 6.2, text: 'Move up together. Take the net back.', detail: 'While they chase it, walk back up to the net side by side.' },
  ],

  decision: { t: 1.95, prompt: 'The lob is going over you. What do you do?' },
} satisfies Scene;
