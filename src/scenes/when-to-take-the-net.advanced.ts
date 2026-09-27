import type { Scene } from '../engine/types';

// Advanced: a ball comes off your back glass while they're tight on the net.
// Drop a chiquita at the diagonal player's feet, move in together as it dips,
// split step as they lift it, then volley it early and close in to the net.
export default {
  title: 'When to take the net',
  duration: 8.4,

  // [t, x, y, facing]
  players: {
    you: [
      [0, 7.3, 18.2, 0], [1.5, 7.3, 18.2, 0], [2.3, 6.4, 18.9, 120], [2.7, 6.4, 18.9, 120], [3.1, 7.25, 18.95, 345],
      [3.75, 7.35, 18.4, 350], [4.4, 7.0, 16.3, 0], [4.5, 7.0, 16.3, 0], [5.3, 6.1, 13.45, 345],
      [6.6, 6.8, 12.0, 0], [8.4, 6.8, 12.0, 0],
    ],
    partner: [
      [0, 2.7, 18.2, 0], [3.75, 2.7, 18.2, 0], [4.4, 3.0, 16.3, 0], [4.5, 3.0, 16.3, 0],
      [5.3, 3.2, 13.5, 0], [6.6, 3.4, 12.0, 0], [7.0, 3.7, 12.05, 10], [8.4, 3.5, 12.0, 0],
    ],
    opp1: [
      [0, 3.0, 7.6, 180], [3.7, 3.0, 7.6, 180], [4.3, 3.5, 7.0, 185], [4.7, 3.5, 7.0, 180],
      [6.2, 3.2, 6.8, 180], [8.4, 2.7, 4.1, 190],
    ],
    opp2: [
      [0, 7.0, 7.6, 180], [5.35, 7.0, 7.6, 180], [5.9, 6.25, 6.45, 175], [6.3, 6.25, 6.45, 180],
      [8.4, 6.6, 5.0, 180],
    ],
  },

  shots: [
    { t: 0.9, by: 'opp1', from: [3.5, 8.1, 1.1], to: [6.8, 17.6], peak: 3.1 },
    { t: 3.1, by: 'you', to: [3.2, 8.0], peak: 2.2 },
    { t: 4.4, by: 'opp1', to: [6.4, 15.4], peak: 2.1 },
    { t: 5.3, by: 'you', to: [5.6, 7.5], flight: 0.55 },
    { t: 6.0, by: 'opp2', to: [4.0, 13.9], peak: 2.3 },
    { t: 7.0, by: 'partner', to: [4.7, 2.5], flight: 0.9 },
  ],

  captions: [
    {
      t: 0,
      text: "They're tight on the net.",
      detail: "Both of them are up close to the net, and you're both back. Their volley comes off your back glass at a comfortable height.",
    },
    {
      t: 1.75,
      text: 'Drop a chiquita at their feet.',
      detail:
        'Soft and low, just over the net, dipping at the feet of the player on the diagonal. From down there, they can only lift it.',
    },
    {
      t: 3.75,
      text: 'Go in together, fast.',
      detail:
        "It's dropping at their feet, so it has worked. Move in side by side. A chiquita buys less time than a lob: stop the moment they're about to hit and split step, wherever you've got to. Here, that's just inside the service line. Had it sat up, you'd have stayed back.",
    },
    {
      t: 5.25,
      text: 'Volley it early.',
      detail: "Their ball has to come up. Don't wait where you stopped: keep coming, take it in the air, and send it down through the middle.",
    },
    {
      t: 6.5,
      text: 'Close in to the second post.',
      detail: "Finish the move together, level with the second post, about 2 m from the net. Their next ball is another defensive one, and you're both there to volley it.",
    },
  ],

  decision: { t: 3.75, prompt: "It's dipping towards their feet. Stay back, or go in?" },
  highlights: [{ t: 6.5, until: 8.4, landmark: 'second-post', end: 'near' }],
} satisfies Scene;
