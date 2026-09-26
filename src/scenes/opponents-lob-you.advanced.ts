import type { Scene } from '../engine/types';

// Advanced: the same lob as the beginner scene, but it will drop around the
// service line. Instead of giving up the net, take it in the air with a
// bandeja, deep, and step straight back in.
export default {
  title: 'Opponents lob you',
  duration: 7.8,

  // [t, x, y, facing]
  players: {
    you: [
      [0, 3.0, 12.8, 0], [1.95, 3.0, 12.8, 0], [2.35, 3.0, 13.4, 80],
      [3.2, 3.2, 16.2, 75], [3.42, 3.25, 16.3, 60], [3.7, 3.25, 16.1, 20],
      [5.0, 3.0, 13.1, 0], [7.8, 3.0, 12.9, 0],
    ],
    partner: [
      [0, 6.8, 12.8, 0], [2.0, 6.8, 12.8, 0], [2.6, 6.4, 13.5, 340],
      [3.5, 6.1, 13.7, 345], [4.6, 6.2, 12.9, 0], [7.8, 6.2, 12.9, 0],
    ],
    opp1: [
      [0, 2.9, 1.9, 180], [1.5, 2.9, 1.9, 180], [1.8, 3.0, 2.4, 180],
      [3.3, 3.1, 4.8, 180], [3.7, 3.1, 4.6, 180], [4.8, 2.9, 2.8, 170], [6.1, 2.9, 2.8, 170],
      [7.0, 2.2, 4.1, 215], [7.8, 2.2, 4.1, 215],
    ],
    opp2: [
      [0, 7.8, 1.6, 180], [0.9, 7.5, 1.3, 180], [1.4, 7.5, 1.3, 180],
      [1.8, 7.4, 2.2, 180], [3.3, 7.0, 4.6, 180], [3.7, 6.9, 4.4, 180],
      [4.8, 7.35, 1.1, 330], [4.95, 7.35, 1.1, 330], [5.6, 7.0, 2.2, 180], [7.8, 7.0, 2.4, 180],
    ],
  },

  shots: [
    { t: 0, by: 'partner', from: [7.3, 12.4, 1.0], to: [7.0, 3.4], peak: 2.0 },
    { t: 1.35, by: 'opp2', to: [3.3, 17.5], peak: 7 },
    { t: 3.42, by: 'you', to: [6.0, 2.4], flight: 1.0 },
    { t: 4.95, by: 'opp2', to: [5.2, 15.8], peak: 2.6 },
    { t: 5.98, by: 'partner', to: [1.1, 7.2], flight: 0.55 },
  ],

  captions: [
    { t: 0, text: "You're both at the net.", detail: "They're stuck at the back, so they lob it over your heads." },
    {
      t: 1.95,
      text: 'Shuffle back. Take it with a bandeja.',
      detail: "It won't go deep. Turn side-on, shuffle back, and take it above your head before the service line. Aim deep, not hard: a bandeja isn't meant to win the point, just to keep you at the net.",
    },
    { t: 4.2, text: 'Step straight back in.', detail: 'Move in while they dig it out of the corner, so your partner isn\'t left at the net alone.' },
    { t: 5.7, text: 'Their reply is soft. Finish it.', detail: "You're both at the net again, so your partner can put it away." },
  ],

  decision: { t: 1.95, prompt: 'The lob is going over you. What do you do?' },
} satisfies Scene;
