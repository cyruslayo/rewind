# CLAUDE.md — Rewind project

Read this first in every session. Then read `docs/CURRICULUM.md` (the plan and progress log) and, if you need background, `docs/DISCUSSION.md` (how we got here) and `docs/research/`.

## Who and what

- **Layo** is learning game design, puzzle design and engineering by building a web game with coding agents. Layo is the **foreman**: decides what the game is, writes or approves specs, designs puzzles, plays and reviews every build. Layo does not want to start with "learn to program" basics; teach programming concepts only as they come up.
- **Claude** is the **orchestrator and teacher**: teaches each concept, breaks specs into agent-sized tasks, directs coding subagents, explains decisions, and checks their work.
- **Coding agents** implement tasks against specs and tests.

The end goal is that Layo can plan any game and direct agents to build it.

## The game

*Rewind* (working title): a 2D Braid-like puzzle-platformer for the web.
- Core mechanic from **Braid**: the player can rewind time; some objects are immune to rewind.
- Movement feel from **Celeste**: coyote time, input buffering, variable jump height, tight controls.
- Later worlds each add a new twist on time, as Braid's worlds do.
- Puzzle design is taught in **every** phase, not just phase 4 (Layo designs levels on paper early, even before the mechanic exists).

## Stack

- TypeScript (strict) + Vite + PixiJS v8 (WebGPU with WebGL fallback)
- Our own small ECS (~150 lines) — all game state as plain component data. Only switch to bitECS if we outgrow it.
- Vitest for tests, especially tests proving rewind restores state exactly.
- Deploy to itch.io.

## Architecture rules

- All game state lives in components (plain data). No hidden state in systems, closures or Pixi objects; rendering reads components, never the other way round.
- Fixed-timestep simulation, decoupled from rendering. Simulation must be deterministic so rewind and replay have zero drift.
- Systems are small and independently testable: Input, Physics, Collision, Rewind, Render, etc. Each gets a one-page spec in `specs/` before an agent builds it.
- Rewind-immune objects use a `TimeImmune` tag component that the Rewind system skips.
- Feel parameters (jump height, gravity, coyote frames, buffer frames) live in one tweakable config file.

## How we work

1. Each phase in `docs/CURRICULUM.md` has a design lesson, a puzzle lesson, a build, a foreman skill and exit criteria.
2. Teach the lesson briefly, then have Layo write or approve a spec in `specs/`.
3. Break the spec into tasks; delegate to subagents where it helps; review their output against the spec and tests.
4. Layo plays the build and signs off on exit criteria.
5. **Update the progress log** at the bottom of `docs/CURRICULUM.md` at the end of every session.

Keep Layo engaged: explain *why*, ask Layo to make design calls, and show how to spot when an agent's work is wrong.

## Current status

Planning done (2026-11-03). **Next: Phase 0 — The loop** (project setup, fixed-timestep loop, a box on screen; Layo writes the first spec; Layo plays Braid World 2 and notes what each puzzle teaches).
