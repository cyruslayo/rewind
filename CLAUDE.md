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

## How to teach Layo (learned in Phase 0)

- Layo is a software engineer but new to game development and game design. Don't water things down: explain the concept and the abstraction before any math or jargon.
- Go **one question at a time**. Show a finished worked example first, then ask a single question with 2-3 choices and ask for Layo's reasoning. Correct plainly when wrong and explain the slip; "I don't know" is a valid answer and tells you what to re-teach.
- Use concrete whole-number examples. Shared analogies: the **purse of coins** (time owed; a tick costs 12 coins, 1 coin = 1/720 s) and the **diary** (a frame is a glance at the wall clock, a tick is a fixed-size diary entry, the cap limits how much you catch up at once).
- Keep **tick** (a fixed step of game time) and **frame** (a screen redraw) clearly separate; they were mixed up before. Introduce new terms (e.g. refresh rate) before using them.
- Write specs section by section from `specs/_TEMPLATE.md`, with Layo making each decision; assemble the answers into the file and have Layo approve it.
- Commit and push often (a hook checks for uncommitted changes). Develop on the branch named in the session instructions so the Pages deploy keeps working.

## Current status

Phase 0 in progress (2026-11-03). Done: walking skeleton, CI + Pages deploy, signed-off game loop, and ECS + box implementation with world export/restore, ordered systems and interpolated rendering. The ECS build passed typecheck, 21 tests and build; a deliberate save-previous mutation failed two tests and was restored. **Awaiting Layo's laptop and phone sign-off** for smooth movement and no streak at the wrap. Next: input-actions spec section by section, then debug overlay spec and remaining Phase 0 exit criteria. Layo also plays Braid World 2, noting each puzzle's lesson.
