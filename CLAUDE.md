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
- Puzzle design is taught in **every** phase (Layo designs levels on paper early, even before the mechanic exists).
- Platforms: desktop browsers (keyboard + gamepad) and mobile browsers (on-screen touch controls).
- v1.0 = World 1 (8 levels). World 2 ships later as an update.
- Layo has ~3-5 hours a week; keep sessions to ~2 hours and phases small.

## Stack

- TypeScript (strict) + Vite + PixiJS v8 (WebGPU with WebGL fallback)
- Our own small ECS (~150 lines), present from Phase 0. All game state is plain component data. Only switch to bitECS if we outgrow it.
- Vitest for tests, especially tests proving rewind restores state exactly and level solution replays.
- LDtk for level editing (we load its JSON; no home-made editor).
- GitHub Actions: typecheck + tests on every push; auto-deploy a playable preview.
- Deploy to itch.io.

## Architecture rules

- All game state lives in components (plain data). No hidden state in systems, closures or Pixi objects; rendering reads components, never the other way round.
- Fixed-timestep simulation, decoupled from rendering. Simulation must be deterministic so rewind and replay have zero drift.
- Systems are small and independently testable: Input, Physics, Collision, Rewind, Render, etc. Each gets a one-page spec in `specs/` before an agent builds it.
- Rewind-immune objects use a `TimeImmune` tag component that the Rewind system skips.
- Feel parameters (jump height, gravity, coyote frames, buffer frames) live in one tweakable config file.
- Input is read through **actions** (`left`, `right`, `jump`, `rewind`), never raw keys, so keyboard, gamepad and touch share one path.
- No `Math.random`, `Date.now()` or `performance.now()` inside the simulation. Use a seeded RNG whose state is a component.
- Positions are integers with sub-pixel remainders (Celeste/TowerFall style).
- Rewind starts as a full snapshot per tick; switch to delta storage only if measured memory demands it.
- Levels are LDtk data, and each level ships a recorded solution replay that CI checks.
- Review every agent diff with `docs/templates/review-checklist.md`; every bug fix gets a regression test.

## How we work

1. Each phase in `docs/CURRICULUM.md` has a design lesson, a puzzle lesson, a build, a foreman skill, measurable exit criteria and an estimate. Follow the session shape described there.
2. Teach the lesson briefly, then have Layo write or approve a spec in `specs/` (start from `specs/_TEMPLATE.md`).
3. Break the spec into tasks; delegate to subagents where it helps; review their output against the spec and tests.
4. Layo plays the build and signs off on exit criteria.
5. **Update the progress log** at the bottom of `docs/CURRICULUM.md` at the end of every session.

Keep Layo engaged: explain *why*, ask Layo to make design calls, and show how to spot when an agent's work is wrong.

## Current status

Planning done and refined (2026-11-03). **Next: Phase 0 — Loop & skeleton**: project setup, minimal ECS, fixed-timestep loop with a box entity, input actions, debug overlay, CI and an auto-deployed preview playable on laptop and phone. Layo writes the first spec and learns git basics, and plays Braid World 2, noting what each puzzle teaches.
