import { describe, expect, it } from 'vitest';
import { COINS_PER_SECOND, maxFrameCoins, tickCost } from './config';
import type { Purse } from './fixedStep';
import { advance } from './loop';

const START: Purse = { coins: 0, ticks: 0 };

function runSeconds(hz: number, seconds: number) {
  const frameCoins = COINS_PER_SECOND / hz;
  let purse = START;
  let ran = 0;
  for (let f = 0; f < hz * seconds; f++) {
    const r = advance(purse, frameCoins);
    purse = r.purse;
    ran += r.ticksToRun;
  }
  return { purse, ran };
}

describe('advance (one loop frame)', () => {
  it('runs exactly 600 ticks in 10 s at 30, 60 and 144 Hz, with the same leftover purse', () => {
    const [a, b, c] = [30, 60, 144].map((hz) => runSeconds(hz, 10));
    const results = [a, b, c];
    for (const r of results) {
      expect(r?.ran).toBe(600);
      expect(r?.purse.ticks).toBe(600);
    }
    expect(b?.purse).toEqual(a?.purse);
    expect(c?.purse).toEqual(a?.purse);
  });

  it('caps a single 10-second frame at 15 ticks and leaves a valid purse', () => {
    const r = advance(START, 10 * COINS_PER_SECOND);
    expect(r.ticksToRun).toBeLessThanOrEqual(15);
    expect(r.ticksToRun).toBe(15);
    expect(r.purse.ticks).toBe(15);
    expect(r.purse.coins).toBeGreaterThanOrEqual(0);
    expect(r.purse.coins).toBeLessThan(tickCost);
    expect(maxFrameCoins).toBe(180); // guards the 15 above against config drift
  });

  it('runs 0 ticks for a negative frame and never lowers or negates the purse', () => {
    const empty = advance(START, -50);
    expect(empty.ticksToRun).toBe(0);
    expect(empty.purse).toEqual(START);

    const held: Purse = { coins: 7, ticks: 3 };
    const r = advance(held, -1000);
    expect(r.ticksToRun).toBe(0);
    expect(r.purse.coins).toBe(7);
    expect(r.purse.coins).toBeGreaterThanOrEqual(0);
    expect(r.purse.ticks).toBe(3);
  });

  it('alpha is 0 on an exact tick boundary and 0.5 for 6 leftover coins', () => {
    expect(advance(START, tickCost).alpha).toBe(0);
    expect(advance(START, 6).alpha).toBe(0.5);
    expect(advance({ coins: 3, ticks: 0 }, 3).alpha).toBe(0.5);
  });

  it('alpha is always in [0, 1)', () => {
    let purse = START;
    for (const c of [0, 1, 5, 11, 12, 13, 24, 100, 180, 999, -5, 7]) {
      const r = advance(purse, c);
      purse = r.purse;
      expect(r.alpha).toBeGreaterThanOrEqual(0);
      expect(r.alpha).toBeLessThan(1);
    }
  });
});
