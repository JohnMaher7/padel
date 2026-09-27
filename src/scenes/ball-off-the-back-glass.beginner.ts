import type { Scene } from '../engine/types';

// Beginner: a deep volley gets past you and comes off the back glass. Turn,
// give it room, let it drop, then lob it cross-court over the net player.
export default {
  title: 'Ball off the back glass',
  duration: 6.8,

  // [t, x, y, facing]
  players: {
    you: [
      [0, 6.8, 17.8, 0], [1.6, 6.8, 17.8, 0], [2.3, 6.8, 19.0, 45],
      [2.6, 6.95, 19.1, 40], [3.1, 7.75, 18.8, 345], [3.6, 7.6, 18.5, 350], [5.0, 6.8, 17.8, 0], [6.8, 6.8, 17.8, 0],
    ],
    partner: [[0, 3.2, 17.8, 0], [2.0, 3.2, 17.8, 0], [3.2, 3.6, 17.6, 10], [6.8, 3.6, 17.6, 10]],
    opp1: [[0, 3.3, 7.8, 180], [3.3, 3.3, 7.8, 180], [3.8, 3.3, 7.0, 20], [5.5, 3.3, 4.5, 10], [6.8, 3.0, 3.0, 170]],
    opp2: [[0, 6.8, 7.9, 180], [3.4, 6.8, 7.9, 180], [4.0, 6.7, 7.0, 350], [6.8, 6.4, 4.6, 340]],
  },

  shots: [
    { t: 0.8, by: 'opp2', from: [6.3, 8.25, 1.5], to: [7.9, 18.8], peak: 3.6 },
    { t: 3.1, by: 'you', to: [3.0, 2.4], peak: 7 },
  ],

  captions: [
    { t: 0, text: 'Both at the net.', detail: "They're both up at the net, and you're both back." },
    { t: 1.6, text: 'Give it room.', detail: "Turn side-on and back off out of its path, early, in small steps. For a fast ball, about level with the join in the side glass." },
    { t: 2.85, text: 'Then lob it, high and deep.', detail: 'Let it come off the glass and drop to about waist height. Lob cross-court, over the player at the net, to land between their service line and back glass.' },
    { t: 4.9, text: 'Back, level with your partner.', detail: "They have to turn and chase it. Get back to your spot beside your partner, ready for whatever comes back." },
  ],
  decision: { t: 1.6, prompt: "It's going past you, to the glass. What do you do?" },
  highlights: [{ t: 1.6, until: 2.85, landmark: 'glass-join', end: 'near' }],
} satisfies Scene;
