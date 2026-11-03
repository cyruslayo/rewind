import { describe, expect, it } from 'vitest';
import { feed, type Purse } from './fixedStep';

// Unit: 1 coin = 1/720 s. 720 is divisible by 30, 60 and 144, so every frame length is a whole number.
const COINS_PER_SECOND = 720;
const TICK_COST = COINS_PER_SECOND / 60; // 12

function run(hz: number, seconds: number): Purse {
  const frameCoins = COINS_PER_SECOND / hz;
  let purse: Purse = { coins: 0, ticks: 0 };
  for (let f = 0; f < hz * seconds; f++) purse = feed(purse, frameCoins, TICK_COST).purse;
  return purse;
}

describe('feed (fixed timestep purse)', () => {
  it('buys no tick until the purse can afford one', () => {
    expect(feed({ coins: 0, ticks: 0 }, 11, 12)).toEqual({ purse: { coins: 11, ticks: 0 }, bought: 0 });
  });

  it('buys exactly at the boundary (works at 12 coins, not at 11)', () => {
    expect(feed({ coins: 0, ticks: 0 }, 12, 12).bought).toBe(1);
  });

  it('keeps the leftover for the next frame', () => {
    expect(feed({ coins: 10, ticks: 3 }, 5, 12)).toEqual({ purse: { coins: 3, ticks: 4 }, bought: 1 });
  });

  it('buys several ticks in one frame on a slow screen', () => {
    expect(feed({ coins: 0, ticks: 0 }, 24, 12).bought).toBe(2);
  });

  it('caps one frame\'s intake (spiral-of-death guard)', () => {
    expect(feed({ coins: 0, ticks: 0 }, 10_000, 12, 36).bought).toBe(3);
  });

  it('gives the same tick count after 10 seconds at 30, 60 and 144 Hz', () => {
    for (const hz of [30, 60, 144]) {
      expect(run(hz, 10)).toEqual({ coins: 0, ticks: 600 });
    }
  });
});
