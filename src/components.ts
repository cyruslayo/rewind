// Components are plain data. Rewind saves and restores them; nothing else holds game state.

/** Game time, counted in ticks. A component so rewind can restore it. */
export interface Clock {
  tick: number;
}
