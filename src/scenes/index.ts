// Every scene, by name. Add new scenes here so the tests and the report see them.

import type { Scene } from '../engine/types';
import opponentsLobYouAdvanced from './opponents-lob-you.advanced';
import opponentsLobYouBeginner from './opponents-lob-you.beginner';

export const scenes: Record<string, Scene> = {
  'opponents-lob-you.beginner': opponentsLobYouBeginner,
  'opponents-lob-you.advanced': opponentsLobYouAdvanced,
};
