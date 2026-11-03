// Components are plain data. Rewind saves and restores them; nothing else holds game state.

export interface Position {
  x: number;
  y: number;
}

export interface PreviousPosition {
  x: number;
  y: number;
}

export interface Velocity {
  dx: number;
  dy: number;
}

/** Game time, counted in ticks. A component so rewind can restore it. */
export interface Clock {
  tick: number;
}
