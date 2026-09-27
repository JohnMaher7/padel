import type { Scene } from '../engine/types';

// Advanced: the first volley goes deep down the middle, which pulls both
// opponents in. Their soft reply comes back to you, and the second volley is
// angled into the side they left empty, short and wide into their side mesh.
export default {
  title: 'Hitting down the middle',
  duration: 6.4,

  // [t, x, y, facing]
  players: {
    you: [
      [0, 7.0, 12.2, 0], [2.0, 7.0, 12.2, 0], [2.4, 7.0, 12.2, 350],
      [3.6, 6.55, 12.3, 350], [5.08, 6.55, 12.3, 340], [5.5, 6.5, 12.3, 330], [6.4, 6.5, 12.3, 330],
    ],
    partner: [[0, 3.0, 12.2, 0], [2.2, 3.0, 12.2, 0], [3.6, 3.6, 12.3, 10], [6.4, 3.6, 12.3, 10]],
    opp1: [
      [0, 3.4, 1.9, 180], [1.3, 3.4, 1.9, 180], [2.2, 3.5, 2.0, 170],
      [3.0, 4.2, 2.1, 160], [3.7, 4.2, 2.1, 160], [4.6, 4.3, 2.0, 175],
      [5.3, 4.3, 2.0, 175], [5.5, 4.2, 2.1, 230], [6.4, 2.85, 2.9, 245],
    ],
    opp2: [
      [0, 7.0, 1.8, 180], [2.2, 7.0, 1.8, 180], [3.3, 6.3, 1.3, 200],
      [3.65, 5.45, 1.35, 190], [4.6, 5.8, 2.0, 180], [5.3, 5.8, 2.0, 180],
      [6.0, 5.6, 2.2, 230], [6.4, 5.6, 2.2, 230],
    ],
  },

  shots: [
    { t: 1.1, by: 'opp1', from: [2.9, 2.2, 0.9], to: [8.85, 14.55], peak: 2.1 },
    { t: 2.0, by: 'you', to: [5.7, 2.6], flight: 1.0 },
    { t: 3.65, by: 'opp2', to: [6.1, 13.4], peak: 3.4 },
    { t: 5.08, by: 'you', to: [1.2, 6.5], flight: 0.6 },
  ],

  captions: [
    {
      t: 0,
      text: "You've both taken the net.",
      detail: "They're both at the back, and their drive is coming to you at chest height. It's not one to put away.",
    },
    {
      t: 1.75,
      text: 'First, deep down the middle.',
      detail: 'The safe ball comes first. Follow the centre line and land it just past their service line, unhurried, so it dies at their back glass.',
    },
    {
      t: 3.5,
      text: 'They both close in.',
      detail: 'Neither is sure whose it is, so both move towards the middle. Their reply is soft and central, and both sides of their court are now empty.',
    },
    {
      t: 5.0,
      text: 'Now angle it into the gap.',
      detail: 'A backhand volley, short and wide cross-court, into the side they left. It lands a few metres past the net and runs on into their side mesh. The nearest of them is deep in the middle, about 5 m away.',
    },
  ],

  decision: { t: 5.0, prompt: "They're both in the middle. Where now?" },
} satisfies Scene;
