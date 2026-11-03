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

_TODO (Layo)_

## Edge cases

_TODO (Layo)_

## Rewind interaction

_TODO (Layo)_

## Acceptance tests

_TODO (Layo)_

## Out of scope

_TODO (Layo)_
