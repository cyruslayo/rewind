// The single tweakable config file (see CLAUDE.md). No magic numbers elsewhere.

export const config = {
  /** Simulation steps per second of game time. */
  ticksPerSecond: 60,
  /** Longest real time (ms) one frame may add to the purse; longer stalls are capped. */
  maxFrameMs: 250,
  /** Logical width of the box world, independent of screen pixel width. */
  worldWidth: 320,
  /** Initial horizontal velocity in logical pixels per tick. */
  startingBoxSpeedPxPerTick: 2,
  /** Visual side length of the demo box in logical pixels. */
  boxSize: 32,
} as const;

/**
 * Unit of the purse: 1 coin = 1/720 s. 720 divides evenly by 30, 60 and 144,
 * so common screen refresh rates give whole-number frame lengths.
 */
export const COINS_PER_SECOND = 720;

/** Coins one tick costs (12 at 60 ticks/s). */
export const tickCost = COINS_PER_SECOND / config.ticksPerSecond;

/** Most coins one frame may add to the purse (180 at 250 ms). */
export const maxFrameCoins = Math.floor((config.maxFrameMs * COINS_PER_SECOND) / 1000);
