import type { Scene } from '../engine/types';

// Advanced: the same ball off the back glass. Instead of lobbing, play a soft
// chiquita cross-court to the net player's feet, and move in together while
// their volley floats up.
export default {
  title: 'Ball off the back glass',
  duration: 6.6,

  // [t, x, y, facing]
  players: {
    you: [
      [0, 6.8, 17.8, 0], [1.6, 6.8, 17.8, 0], [2.3, 6.8, 19.0, 45],
      [2.6, 6.95, 19.1, 40], [3.1, 7.75, 18.8, 345], [3.5, 7.6, 18.4, 350], [5.35, 6.1, 14.9, 345], [6.6, 6.0, 14.2, 350],
    ],
    partner: [[0, 3.2, 17.8, 0], [2.0, 3.2, 17.8, 0], [3.2, 3.6, 17.6, 10], [3.6, 3.6, 17.5, 5], [5.35, 3.9, 15.0, 5], [6.6, 4.0, 14.3, 5]],
    opp1: [[0, 3.3, 7.8, 180], [3.4, 3.3, 7.8, 180], [4.15, 3.65, 8.35, 170], [6.6, 3.5, 7.9, 175]],
    opp2: [[0, 6.8, 7.9, 180], [6.6, 6.8, 7.9, 180]],
  },

  shots: [
    { t: 0.8, by: 'opp2', from: [6.3, 8.25, 1.5], to: [7.9, 18.8], peak: 3.6 },
    { t: 3.1, by: 'you', to: [3.9, 8.1], peak: 2.0 },
    { t: 4.15, by: 'opp1', to: [5.8, 15.6], peak: 2.6 },
    { t: 5.35, by: 'you', to: [5.0, 3.4], flight: 1.0 },
  ],

  captions: [
    { t: 0, text: 'Both at the net.', detail: "They're both up at the net, and you're both back." },
    { t: 1.6, text: 'Give it room.', detail: 'The same read as always: turn side-on and back off out of its path, then step into it as it comes out.' },
    { t: 2.85, text: 'A soft chiquita, to their feet.', detail: 'It has come out between knee and waist height. Play it soft and low, cross-court, so it dips at the feet of the net player diagonally across, on their backhand side.' },
    { t: 4.85, text: 'Their volley goes up. Move in together.', detail: 'From down at their feet they can only lift it. Move in side by side while it floats back, and volley it.' },
  ],
  decision: { t: 2.85, prompt: "It's coming off the glass, and they're both at the net. What do you play?" },
  highlights: [{ t: 1.6, until: 2.85, landmark: 'glass-join', end: 'near' }],
} satisfies Scene;
