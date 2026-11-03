# Spec: ECS and box

**Phase:** Phase 0 · **Status:** built and signed off by Layo (2026-11-03; smooth on laptop and phone, no wrap streak) · **Owner:** agent

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
- **Config values:** `worldWidth`, and starting box speed (pixels per tick). The speed is only the value the box is created with; afterwards the speed lives in `Velocity`.

## Behaviour

Systems live in one ordered list and run in that order on every tick. They own no state; they only read and write components.

1. **Clock system:** `Clock.tick += 1`. So during a tick, `Clock.tick` is the number of the tick now running (the first tick is tick 1) and every system in that tick sees the same value.
2. **Save-previous system:** for every entity with `Position` and `PreviousPosition`, copy `Position` into `PreviousPosition`.
3. **Movement system:** for every entity with `Position` and `Velocity`, add `dx` to `x` and `dy` to `y`.
4. **Wrap system:** see Edge cases.

Order matters: saving before moving keeps `PreviousPosition` one tick behind `Position`. Moving first would make them equal and kill interpolation.

Rendering is not part of the tick. Each frame it reads `PreviousPosition`, `Position` and the loop's `alpha`, and draws at `previous + (current - previous) * alpha`.

At start-up the box is created with `PreviousPosition` equal to `Position`, so the first frame doesn't streak.

## Edge cases

Decided by Layo:

- **Leaving the world:** the simulation owns the wrap, not the renderer. A `worldWidth` value lives in the config file. A **Wrap system** runs after Movement: for every entity with `Position` and `PreviousPosition`, if `x >= worldWidth`, set `x = x - worldWidth` and set `PreviousPosition.x` to the same value. Resetting `PreviousPosition` stops interpolation drawing a streak across the screen for one frame. (Only the right edge is needed for now, since the box only moves right.)
- Layo confirmed the wrap keeps the overshoot.

Other rules:

- An entity missing a component a system needs is skipped by that system. It is not an error.

## Rewind interaction

- A snapshot must hold, for the whole world: the **values of every component**, **which entities exist**, and the **next-entity-ID counter**. So an entity destroyed after the snapshot comes back, one created after it disappears, and the next new entity gets the same ID it got the first time.
- The ECS therefore keeps the entity set and the ID counter as plain data it can export and restore, and it keeps no state anywhere else. Systems are stateless.
- `TimeImmune` is not needed yet. The Rewind system (Phase 2) will skip entities with that tag; nothing in this spec prevents it.
- Not restored by rewind: the purse and anything else that measures real time (see game-loop spec).
- The Phase 2 rewind system is not built here, but the world must be exportable and restorable as plain data so it can be.

## Acceptance tests

- [x] Test: after 10 simulated seconds (600 ticks) driven through the loop at 30, 60 and 144 Hz, the **entire world** is identical: every component of every entity, the entity set and `Clock.tick`. (Comparing only `Position.x` would miss a wrong `PreviousPosition`.)
- [x] Test: one tick on a box with `Position.x = 100`, `Velocity.dx = 4` leaves `PreviousPosition.x = 100` and `Position.x = 104` (save-previous runs before movement).
- [x] Test: when `Position.x` reaches `worldWidth`, the Wrap system sets `Position.x = x - worldWidth` and `PreviousPosition.x` to the same value.
- [x] Test: an entity with `Position` but no `Velocity` is not moved and causes no error.
- [x] Test: export the world, run some ticks (creating and destroying an entity along the way), restore the export: all component values, the entity set and the next-ID counter equal the export.
- [x] Layo's check while playing: the box moves smoothly and wraps at the edge with no streak across the screen, on both a laptop and a phone (deployed link).

## Out of scope

- Reading input (`left`, `right`, `jump`, `rewind`) and the input system.
- The debug overlay (FPS, tick count, entity count).
- The rewind system itself (Phase 2); this spec only keeps the world exportable and restorable.
- Collision and tile grids, gravity, jumping (Phase 1).
- Integer positions with sub-pixel remainders (Phase 1; the box may use plain numbers for now).
- Concrete numbers for `worldWidth` and starting speed: the agent picks sensible defaults in the config file and Layo tunes them by playing.
