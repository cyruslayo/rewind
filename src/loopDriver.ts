// The ONLY file allowed to read real time (the rAF timestamp). Owns the purse (real-time
// bookkeeping, deliberately NOT a component: rewind must never restore it).

import { COINS_PER_SECOND } from './config';
import { advance } from './loop';
import type { Purse } from './fixedStep';

export interface LoopCallbacks {
  /** Run one fixed simulation tick. */
  onTick: () => void;
  /** Draw once; alpha in [0, 1) is how far we are between the last tick and the next. */
  onRender: (alpha: number) => void;
}

export function startLoop({ onTick, onRender }: LoopCallbacks): () => void {
  let purse: Purse = { coins: 0, ticks: 0 };
  let firstTimestamp: number | null = null;
  let coinsSoFar = 0;
  let handle = 0;
  let running = true;

  const frame = (timestampMs: number): void => {
    if (!running) return;

    // First frame has elapsed 0. Convert CUMULATIVE time to coins so per-frame rounding never drifts.
    if (firstTimestamp === null) firstTimestamp = timestampMs;
    const totalCoins = Math.round(((timestampMs - firstTimestamp) * COINS_PER_SECOND) / 1000);
    const frameCoins = totalCoins - coinsSoFar;
    coinsSoFar = totalCoins;

    const result = advance(purse, frameCoins);
    purse = result.purse;
    for (let i = 0; i < result.ticksToRun; i++) onTick();
    onRender(result.alpha);

    handle = requestAnimationFrame(frame);
  };

  handle = requestAnimationFrame(frame);

  return () => {
    running = false;
    cancelAnimationFrame(handle);
  };
}
