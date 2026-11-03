// One frame of the loop, as a pure function: purse in, purse out. No clock, no random, no Pixi/DOM.
// The driver (which owns the real clock) turns elapsed ms into coins and calls this once per frame.

import { maxFrameCoins, tickCost } from './config';
import { feed, type Purse } from './fixedStep';

export interface Advance {
  purse: Purse;
  ticksToRun: number;
  /** How far we are between the last tick and the next, in [0, 1). Used for interpolated drawing. */
  alpha: number;
}

export function advance(purse: Purse, frameCoins: number): Advance {
  const coins = Math.max(0, frameCoins);
  const { purse: next, bought } = feed(purse, coins, tickCost, maxFrameCoins);
  return { purse: next, ticksToRun: bought, alpha: next.coins / tickCost };
}
