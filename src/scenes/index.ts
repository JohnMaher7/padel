// Every scene, by name. Add new scenes here so the tests and the report see them.

import type { ChapteredScene, Scene } from '../engine/types';
import ballOffTheBackGlassAdvanced from './ball-off-the-back-glass.advanced';
import ballOffTheBackGlassBeginner from './ball-off-the-back-glass.beginner';
import opponentsLobYouAdvanced from './opponents-lob-you.advanced';
import opponentsLobYouBeginner from './opponents-lob-you.beginner';
import returningServeAdvanced from './returning-serve.advanced';
import returningServeBeginner from './returning-serve.beginner';
import whereToStand from './where-to-stand.all';

export const scenes: Record<string, Scene | ChapteredScene> = {
  'ball-off-the-back-glass.beginner': ballOffTheBackGlassBeginner,
  'ball-off-the-back-glass.advanced': ballOffTheBackGlassAdvanced,
  'opponents-lob-you.beginner': opponentsLobYouBeginner,
  'opponents-lob-you.advanced': opponentsLobYouAdvanced,
  'returning-serve.beginner': returningServeBeginner,
  'returning-serve.advanced': returningServeAdvanced,
  'where-to-stand.all': whereToStand,
};
