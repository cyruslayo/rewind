# Spec: Game loop

**Phase:** Phase 0 · **Status:** draft (Layo is writing it section by section) · **Owner:** agent

## Purpose

The loop makes the game run identically on every device, whether the screen is 30, 60 or 144 Hz, so that a jump that works on one device works on all of them. It also keeps the picture smooth by drawing between simulation steps.

## Data

- **Components read:** none (the loop reads no game data).
- **Components written:** `Clock { tick: number }`. The tick count is a component so rewind can restore it.
- **Not a component:** the purse (time owed). It measures real time, and rewind must never restore it. It stays in the loop driver.
- **Config values** (in the single config file): `ticksPerSecond` (60) and `maxFrameMs` (250).

## Behaviour

Each frame:

1. Work out the real time since the previous frame. Cap it at `maxFrameMs`.
2. Add that time to the purse.
3. While the purse holds at least one tick's worth of time: run one simulation tick, increase `Clock.tick` by 1, and take one tick's worth out of the purse.
4. Draw, placing things between their previous and current tick positions by the fraction left in the purse.

## Edge cases

Decided by Layo:

- **Hidden tab / long stall:** elapsed time per frame is capped at `maxFrameMs`. After a long absence the game continues as if only that much time passed (the tab acts as an automatic pause).
- **Zero or negative frame time:** treated as 0. The purse never goes below zero, and no ticks are bought on that frame.
- **Tick rate:** 60 ticks per second (`ticksPerSecond = 60`). Good for precision controls and phone memory; re-check with measurements in Phase 2.

## Rewind interaction

_To do._

## Acceptance tests

_To do._

## Out of scope

_To do._
