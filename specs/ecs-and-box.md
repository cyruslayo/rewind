# Spec: ECS and box

**Phase:** Phase 0 · **Status:** draft (Layo writing section by section) · **Owner:** agent

## Purpose

All game state (the box now; the player, crates and doors later) is stored as plain component data, so that rewind can later save and restore it exactly.

## Data

- **Entity:** just an ID (a row number). It holds no data and has no behaviour.
- **Components read:** `Position`, `Velocity`
- **Components written:** `PreviousPosition`, `Position`, `Clock`
- **New components** (all plain data):
  - `Position { x, y }`: where the box is after the latest tick.
  - `PreviousPosition { x, y }`: where it was after the tick before. A component, not renderer memory, so rewind restores it and the renderer never keeps hidden state.
  - `Velocity { dx, dy }`: change in position per tick. State, because it will change over time (gravity in Phase 1).
  - `Clock { tick }`: already built.
- **Config values:** starting box speed (pixels per tick). It is only the value the box is created with; afterwards the speed lives in `Velocity`.

## Behaviour

Systems live in one ordered list and run in that order on every tick. They own no state; they only read and write components.

1. **Clock system:** `Clock.tick += 1`. So during a tick, `Clock.tick` is the number of the tick now running (the first tick is tick 1) and every system in that tick sees the same value.
2. **Save-previous system:** for every entity with `Position` and `PreviousPosition`, copy `Position` into `PreviousPosition`.
3. **Movement system:** for every entity with `Position` and `Velocity`, add `dx` to `x` and `dy` to `y`.

Order matters: saving before moving keeps `PreviousPosition` one tick behind `Position`. Moving first would make them equal and kill interpolation.

Rendering is not part of the tick. Each frame it reads `PreviousPosition`, `Position` and the loop's `alpha`, and draws at `previous + (current - previous) * alpha`.

At start-up the box is created with `PreviousPosition` equal to `Position`, so the first frame doesn't streak.

## Edge cases

_TODO (Layo)_

## Rewind interaction

_TODO (Layo)_

## Acceptance tests

_TODO (Layo)_

## Out of scope

_TODO (Layo)_
