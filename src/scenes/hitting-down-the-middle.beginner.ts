import type { Scene } from '../engine/types';

// Beginner: at the net, volley deep down the middle. Both opponents turn to
// it, one takes it late, and the reply comes back through the middle, where
// your partner (forehand in the middle) sends it deep down the middle again.
export default {
  title: 'Hitting down the middle',
  duration: 6.4,

  // [t, x, y, facing]
  players: {
    you: [[0, 7.0, 12.2, 0], [2.0, 7.0, 12.2, 0], [2.4, 7.0, 12.2, 350], [3.6, 6.4, 12.3, 350], [6.4, 6.4, 12.3, 350]],
    partner: [[0, 3.0, 12.2, 0], [2.2, 3.0, 12.2, 0], [3.6, 3.7, 12.3, 10], [6.4, 3.7, 12.3, 10]],
    opp1: [
      [0, 3.4, 1.9, 180], [1.3, 3.4, 1.9, 180], [2.2, 3.5, 2.0, 170],
      [3.0, 4.3, 2.1, 160], [3.7, 4.3, 2.1, 160], [4.8, 3.3, 2.3, 175],
      [5.1, 3.3, 2.3, 175], [6.2, 4.2, 2.0, 160], [6.4, 4.2, 2.0, 160],
    ],
    opp2: [
      [0, 7.0, 1.8, 180], [2.2, 7.0, 1.8, 180], [3.3, 6.3, 1.3, 200],
      [3.6, 5.5, 1.2, 190], [4.8, 6.6, 2.1, 180], [5.1, 6.6, 2.1, 180],
      [6.2, 6.3, 1.5, 200], [6.4, 6.3, 1.5, 200],
    ],
  },

  shots: [
    { t: 1.1, by: 'opp1', from: [2.9, 2.2, 0.9], to: [8.85, 14.55], peak: 2.1 },
    { t: 2.0, by: 'you', to: [5.7, 2.6], flight: 1.0 },
    { t: 3.6, by: 'opp2', to: [4.1, 13.4], peak: 2.6 },
    { t: 4.8, by: 'partner', to: [5.2, 2.7], flight: 1.0 },
  ],

  captions: [
    {
      t: 0,
      text: "You've both taken the net.",
      detail: "They're both at the back, and their drive is coming to you at chest height. It's not one to put away.",
    },
    {
      t: 1.8,
      text: 'Deep, down the middle.',
      detail: "Follow the centre line and land it just past their service line. Keep it unhurried, so it's dying by the time it reaches their back glass. It's the biggest target on the court, 5 m from both side walls.",
    },
    {
      t: 3.3,
      text: 'They both hesitate.',
      detail: 'Whose is it? Both of them turn to it, one checks, and the other takes it late, off the glass.',
    },
    {
      t: 4.55,
      text: 'It comes back through the middle.',
      detail: "From the middle of their court there's little angle to find, so the reply comes back to where you're both waiting. You each moved a step in. Your partner has the forehand in the middle, so it's theirs: deep down the middle again.",
    },
  ],

  decision: { t: 1.8, prompt: "It's coming to you at the net. Where do you aim?" },
} satisfies Scene;
