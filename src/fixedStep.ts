// The "purse" from the lesson. Pure data in, pure data out: no clock, no random, no Pixi.
// Time is measured in whole "coins" (any integer unit); a tick costs `tickCost` coins.

export interface Purse {
  coins: number; // time owed but not yet spent
  ticks: number; // total simulation ticks bought so far
}

export interface FeedResult {
  purse: Purse;
  bought: number; // ticks bought during this one call (one screen frame)
}

/**
 * Add the coins that passed since the last frame, then buy as many whole ticks as we can afford.
 * `maxCoins` caps a single frame's intake so a long stall can't trigger a "spiral of death".
 */
export function feed(
  purse: Purse,
  coins: number,
  tickCost: number,
  maxCoins = Number.POSITIVE_INFINITY,
): FeedResult {
  let owed = purse.coins + Math.min(coins, maxCoins);
  let ticks = purse.ticks;
  let bought = 0;
  while (owed >= tickCost) {
    owed -= tickCost;
    ticks += 1;
    bought += 1;
  }
  return { purse: { coins: owed, ticks }, bought };
}
