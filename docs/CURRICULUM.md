# Rewind: Game Design & Agent Orchestration Curriculum

A living reference for Layo's project: learning game design, puzzle design and engineering by building a Braid-like rewind puzzle-platformer for the web, with coding agents doing most of the implementation and Layo acting as the foreman.

## Goals

- Learn **game design**: game feel, mechanics, puzzle design, level progression.
- Learn **engineering as a foreman**: architecture, writing specs, splitting work into agent-sized tasks, reviewing output, spotting bugs.
- Ship a polished, playable web game.
- End up able to plan any game and direct agents to build it.

## Roles

- **Layo (foreman/designer):** decides what the game is, writes or approves specs, designs puzzles, plays and reviews every build.
- **Claude (orchestrator/teacher):** teaches each concept, breaks specs into tasks, directs coding agents, explains decisions.
- **Coding agents:** implement tasks against specs and tests.

## The game

A 2D puzzle-platformer where the player can rewind time. Core reference: **Braid** (rewind; some objects immune to rewind). Movement feel reference: **Celeste** (coyote time, input buffering, tight controls). Each later world adds a new twist on time, as Braid's worlds do. Working title: *Rewind* (to be renamed).

Backup references if scope needs cutting: Snakebird (grid puzzles with undo), Baba Is You (rules as tiles).

## Tech stack

- **TypeScript**: best supported by coding agents; type errors catch agent mistakes early.
- **Vite**: instant hot reload for tuning feel.
- **PixiJS v8**: fast 2D rendering, WebGPU with WebGL fallback.
- **Our own small ECS** (entity component system): all game state as plain data, which makes rewind and agent tasks clean. Switch to a library like bitECS only if we outgrow it.
- **Vitest**: tests, especially proving rewind restores state exactly.
- Deploy to **itch.io**.

## Why ECS here

- Rewind = save and restore state. If all state lives in components, recording it is mechanical.
- A rewind-immune object is just a `TimeImmune` tag the rewind system skips.
- Each system (Input, Physics, Collision, Rewind, Render) is a small, testable unit an agent can own from a one-page spec.
- Data-oriented thinking (Blow, Muratori) matters more than ECS dogma.

## Curriculum

Each phase has a **design lesson**, a **puzzle lesson**, a **build**, and a **foreman skill**. A phase is done when its exit criteria pass.

### Phase 0: The loop

- Design: what a game loop is; fixed timestep.
- Puzzle: play Braid World 2; write notes on what each puzzle teaches.
- Build: project setup, fixed-timestep loop, a box on screen.
- Foreman: write the first spec and the project CLAUDE.md.
- Exit: box moves smoothly at any frame rate.

### Phase 1: Feel

- Design: game feel; Celeste physics write-up; coyote time and input buffering.
- Puzzle: how movement abilities define what puzzles are possible.
- Build: run, jump, variable jump height, coyote time, buffering.
- Foreman: define "done" with tweakable feel parameters.
- Exit: jumping feels good to Layo in blind side-by-side tweaks.

### Phase 2: Architecture

- Design: data-oriented design; Nystrom's Game Programming Patterns.
- Puzzle: the level as a teaching tool (introduce, test, twist).
- Build: our ECS, tilemaps, level loading from files.
- Foreman: split work into systems an agent can own.
- Exit: levels load from data; systems are independently tested.

### Phase 3: The mechanic (rewind)

- Design: Blow's method: ask the mechanic questions and listen to the answers.
- Puzzle: list 20 questions rewind raises; each is a possible puzzle.
- Build: record changed state each frame plus periodic snapshots; rewind and resume.
- Foreman: write tests proving rewind is exact.
- Exit: rewind 60 seconds and replay with zero drift.

### Phase 4: Puzzles

- Design: MDA framework; difficulty curves.
- Puzzle: design and playtest your first 8 levels; one idea per level.
- Build: time-immune objects, keys, doors, enemies, level editor basics.
- Foreman: review levels; turn playtest notes into tasks.
- Exit: a first-time player finishes world 1 without help.

### Phase 5: Depth

- Design: depth vs breadth; one mechanic explored fully.
- Puzzle: design a world around a new time rule.
- Build: second world with its new rule.
- Foreman: run parallel agents on separate features.
- Exit: two complete worlds.

### Phase 6: Polish

- Design: juice; accessibility.
- Puzzle: hint design and removing unfair puzzles.
- Build: audio, particles, UI, save system.
- Foreman: write and prioritise a polish backlog.
- Exit: feature freeze.

### Phase 7: Ship

- Design: iterating from player data.
- Build: publish on itch.io; collect feedback.
- Foreman: release checklist.
- Exit: game is live and playtested by strangers.

## Reading and watching list

- Jonathan Blow: "Truth in Game Design"; Braid implementation talk (GDC).
- Casey Muratori: Handmade Hero; "The Big OOPs" (2025).
- Maddy Thorson: Celeste and TowerFall physics article.
- Robert Nystrom: *Game Programming Patterns* (free online).
- "Juice It or Lose It" (GDC talk).
- Mark Brown: Game Maker's Toolkit (puzzle design videos).
- MDA framework paper; Jesse Schell, *The Art of Game Design*.
- Play: Braid, Celeste, Order of the Sinking Star.

## Progress log

| Date | Phase | What happened | Next step |
| --- | --- | --- | --- |
| 2026-11-03 | Planning | Chose rewind game, stack and curriculum | Start Phase 0 |

## Open decisions

- Final game name and visual style.
- What the twist in each world is (Phase 5).
