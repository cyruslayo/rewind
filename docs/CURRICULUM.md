# Rewind: Game Design & Agent Orchestration Curriculum

A living reference for Layo's project: learning game design, puzzle design and engineering by building a Braid-like rewind puzzle-platformer for the web, with coding agents doing most of the implementation and Layo acting as the foreman.

Refined 2026-11-03 (see "Plan refinement" in `DISCUSSION.md` for what changed and why).

## Goals

- Learn **game design**: game feel, mechanics, puzzle design, level progression.
- Learn **engineering as a foreman**: architecture, writing specs, splitting work into agent-sized tasks, reviewing output, spotting bugs.
- Ship a polished, playable web game that works on desktop and mobile.
- End up able to plan any game and direct agents to build it.

## Roles

- **Layo (foreman/designer):** decides what the game is, writes or approves specs, designs puzzles, plays and reviews every build.
- **Claude (orchestrator/teacher):** teaches each concept, breaks specs into tasks, directs coding agents, explains decisions.
- **Coding agents:** implement tasks against specs and tests.

## The game

A 2D puzzle-platformer where the player can rewind time. Core reference: **Braid** (rewind; some objects immune to rewind). Movement feel reference: **Celeste** (coyote time, input buffering, tight controls). Each later world adds a new twist on time, as Braid's worlds do. Working title: *Rewind* (to be renamed).

- **Platforms:** desktop browsers (keyboard, gamepad) and mobile browsers (on-screen touch controls).
- **v1.0 scope:** World 1 (8 levels). World 2 ships later as an update.

Backup references if scope needs cutting: Snakebird (grid puzzles with undo), Baba Is You (rules as tiles).

## Tech stack

- **TypeScript (strict)**: best supported by coding agents; type errors catch agent mistakes early.
- **Vite**: instant hot reload for tuning feel.
- **PixiJS v8**: fast 2D rendering, WebGPU with WebGL fallback.
- **Our own small ECS** (entity component system): all game state as plain data, which makes rewind and agent tasks clean. Switch to a library like bitECS only if we outgrow it.
- **Vitest**: tests, especially proving rewind restores state exactly and that every level is still solvable.
- **LDtk**: free level editor; we load its JSON instead of building our own editor.
- **GitHub Actions**: typecheck + tests on every push; deploy a playable build automatically.
- Deploy to **itch.io** (preview builds from Phase 0; public release in Phase 6).

## Why ECS here

- Rewind = save and restore state. If all state lives in components, recording it is mechanical.
- A rewind-immune object is just a `TimeImmune` tag the rewind system skips.
- Each system (Input, Physics, Collision, Rewind, Render) is a small, testable unit an agent can own from a one-page spec.
- Data-oriented thinking (Blow, Muratori) matters more than ECS dogma.
- This is why the ECS exists **from Phase 0**: writing movement first and moving it into components later would mean a rewrite, and rewind only works if no state is hidden outside components.

## Working rules (all phases)

- **Simplest correct version first; optimise only after measuring.** Example: rewind starts as a full snapshot every tick, and becomes delta storage only if memory measurements say so.
- **Input goes through actions** (`left`, `right`, `jump`, `rewind`), never raw keys, so keyboard, gamepad and touch all plug into the same place.
- **Determinism inside the simulation:** fixed timestep, no `Math.random` (use a seeded RNG whose state is a component), no wall-clock time. Snapshot rewind does not need determinism across machines, but replay tests do need it within one engine.
- **Every bug fix gets a regression test.** Every level gets a recorded solution replay that CI runs.
- **Every build is deployed**, so Layo can play it on a laptop and a phone from a link.
- **Every agent diff is reviewed** with `docs/templates/review-checklist.md` before it is merged.

## Session shape (~2 hours; 2 sessions a week at 3-5 h/week)

1. **Lesson** (15 min): Claude teaches the concept for the current step.
2. **Spec** (20-30 min): Layo writes or approves a one-page spec from `specs/_TEMPLATE.md`.
3. **Build** (30-45 min): Claude breaks the spec into tasks and directs agents.
4. **Review** (15-20 min): Claude and Layo read the diff together against the checklist.
5. **Play** (10-15 min): Layo plays the deployed build and makes design calls.
6. **Log** (5 min): update the progress log below.

## Curriculum

Each phase has a **design lesson**, a **puzzle lesson**, a **build**, a **foreman skill**, **exit criteria** and an **estimate** (weeks at 3-5 h/week). Every exit criterion is either an automated test or a clear yes/no that Layo signs off. A phase is done when all of its exit criteria pass.

### Phase 0: Loop & skeleton

- **Design:** what a game loop is; fixed timestep with render interpolation (Fiedler, "Fix Your Timestep"; Nystrom, "Game Loop").
- **Puzzle:** play Braid World 2; for each puzzle, write what it teaches and what the "aha" is.
- **Build:**
  - Vite + TypeScript strict + PixiJS v8 project.
  - Minimal ECS (entities, component stores, ordered system list); the box is an entity.
  - Fixed 60 Hz simulation, decoupled from rendering, with interpolation.
  - Input mapped to actions; keyboard first.
  - Debug overlay (FPS, tick count, entity count).
  - GitHub Actions: typecheck + Vitest on every push; auto-deploy a preview build (itch.io via butler, or GitHub Pages).
- **Foreman:** write the first spec using the template; git basics (branch, commit, read a diff and a pull request).
- **Exit:**
  - Test: the same inputs give an identical box position after 600 ticks whether frames arrive at 30, 60 or 144 Hz.
  - CI is green.
  - Layo plays the deployed link on a laptop **and** a phone; the box moves smoothly on both.
- **Est.:** 2-3 weeks.

### Phase 1: Feel

- **Design:** game feel; Celeste & TowerFall physics write-up; coyote time, input buffering, corner correction.
- **Puzzle:** how movement abilities define what puzzles are possible; design 3 levels on paper using only run and jump, and write what each one teaches.
- **Build:**
  - Integer positions with sub-pixel remainders (Thorson's approach); AABB collision against a hardcoded tile grid.
  - Run, jump, variable jump height, coyote time, input buffering, corner correction.
  - All feel parameters in one `feel.ts` config, with a live tweak panel in debug builds.
  - Choose the internal resolution (e.g. 320×180 with integer scaling); it fixes pixel size for art and for phone screens.
- **Foreman:** define "done" as parameters plus acceptance tests (e.g. "jump pressed 4 frames before landing still jumps").
- **Exit:**
  - Unit tests prove the coyote and buffer frame windows exactly (works on frame N, fails on frame N+1).
  - Layo blind-tests 3 presets, picks one, and records the values in the progress log.
- **Est.:** 3-4 weeks.

### Phase 2: Rewind prototype

The core mechanic comes early: if rewind feels wrong or is technically shaky, we want to find out now, not after building levels.

- **Design:** Blow's method: ask the mechanic questions and listen to the answers ("Truth in Game Design").
- **Puzzle:** list 20 questions rewind raises (e.g. "what if a platform keeps moving while you rewind?"); mark which ones are puzzle seeds.
- **Build:**
  - Simplest correct version: a full world snapshot every tick in a ring buffer (~60 seconds).
  - Hold `rewind` to step back through time; release to resume from that point (the future is discarded).
  - A world-state hash function.
  - Input record and replay harness (also used later for level solution tests).
- **Foreman:** write the tests that prove rewind is exact; learn what a "drift" bug looks like and how a hash catches it.
- **Exit:**
  - Test: during a scripted 60-second run, rewinding to any tick N gives exactly the hash recorded at N.
  - Test: replaying the recorded inputs from tick 0 reproduces the final hash.
  - Snapshot memory use is measured on desktop and phone and written in the progress log.
  - Layo plays it and answers: does rewinding feel good? (yes/no + notes)
- **Est.:** 3-4 weeks.

### Phase 3: Levels & architecture

- **Design:** data-oriented design; Nystrom's *Game Programming Patterns*; Muratori's "The Big OOPs" (draw boundaries around systems).
- **Puzzle:** the level as a teaching tool (introduce, test, twist); turn 2 paper levels from Phases 1-2 into real levels.
- **Build:**
  - Tilemap rendering, camera, restart, level transitions.
  - Levels authored in LDtk and loaded from its JSON (no home-made editor).
  - Every level ships with a recorded **solution replay**; CI checks it still reaches the exit.
- **Foreman:** split work into systems an agent can own; run the first two agents in parallel (e.g. LDtk loader and tilemap renderer) against a shared interface.
- **Exit:**
  - Layo builds 2 levels in LDtk, and the game loads them.
  - Each level's solution replay passes in CI.
  - Each system has its own tests that run without the renderer.
- **Est.:** 4-5 weeks.

### Phase 4: Time-immune objects & world mechanics

- **Design:** MDA framework (mechanics, dynamics, aesthetics); designing rules that create interesting dynamics.
- **Puzzle:** for each new object, write how it interacts with rewind; Layo decides the paradox rules (e.g. what happens when an immune key opens a door and the door is rewound).
- **Build:**
  - `TimeImmune` tag plus a clear visual language for immune objects.
  - Keys, doors, simple enemies, hazards; death prompts a rewind (as in Braid).
  - Delta or changed-only rewind storage **only if** Phase 2's measurements show memory is a problem.
- **Foreman:** write specs where the hard part is the edge cases; review whether agent tests actually cover them.
- **Exit:**
  - Every mechanic has tests, including at least one test of how it behaves under rewind.
  - Memory stays within the Phase 2 budget on a phone.
- **Est.:** 5-6 weeks.

### Phase 5: World 1 + touch & gamepad

- **Design:** difficulty curves; one idea per level; playtesting without helping.
- **Puzzle:** design and playtest 8 levels, one idea each; cut or rework any level that doesn't teach something.
- **Build:**
  - The 8 levels, each with a solution replay.
  - On-screen touch controls (multitouch, left/right/jump/rewind), responsive scaling and safe areas for phones.
  - Gamepad support.
  - Level select; progress saved in localStorage.
- **Foreman:** run playtests with `docs/templates/playtest-notes.md`; turn notes into prioritised tasks.
- **Exit:**
  - 3 first-time players (at least one on a phone) finish World 1 without help.
  - All 8 solution replays pass in CI.
- **Est.:** 6-8 weeks.

### Phase 6: Polish & ship v1.0

- **Design:** juice ("Juice It or Lose It"); accessibility; iterating from player data.
- **Puzzle:** hint design; removing unfair puzzles.
- **Build:**
  - Audio, particles, screen shake, UI, title screen.
  - Accessibility: control remapping, reduced-motion option, immune objects marked by more than colour.
  - Publish on itch.io (desktop and mobile).
- **Foreman:** write and prioritise a polish backlog; write and follow a release checklist; declare feature freeze.
- **Exit:**
  - The game is live on itch.io.
  - Feedback from strangers is collected and logged.
- **Est.:** 4-6 weeks.

### Phase 7: World 2 (post-launch update)

- **Design:** depth vs breadth; one mechanic explored fully.
- **Puzzle:** design a world around a new time rule.
- **Build:** the new rule and the World 2 levels, each with a solution replay.
- **Foreman:** run parallel agents on separate features; keep World 1's replays green.
- **Exit:** World 2 is shipped as an update, and World 1 still passes all of its tests.
- **Est.:** 6-8 weeks.

### Phase 8: Capstone: foreman solo

- **Design:** scoping a game from scratch.
- **Build:** none; Layo writes a full plan for a *different* small game (e.g. Snakebird-like): pitch, systems, specs, phases, exit criteria.
- **Foreman:** Claude only reviews; Layo makes every call.
- **Exit:** a plan Layo could hand to agents tomorrow.
- **Est.:** 1-2 weeks.

## Timeline

| Phase | Est. (weeks) | Running total |
| --- | --- | --- |
| 0 Loop & skeleton | 2-3 | 2-3 |
| 1 Feel | 3-4 | 5-7 |
| 2 Rewind prototype | 3-4 | 8-11 |
| 3 Levels & architecture | 4-5 | 12-16 |
| 4 Time-immune & mechanics | 5-6 | 17-22 |
| 5 World 1 + touch & gamepad | 6-8 | 23-30 |
| 6 Polish & ship v1.0 | 4-6 | **27-36 (v1.0, ~7-9 months)** |
| 7 World 2 | 6-8 | 33-44 |
| 8 Capstone | 1-2 | 34-46 |

These are estimates; we re-check them at the end of each phase and log the actual time.

## Risks & cuts

- **If time slips**, cut in this order: World 2 → enemies → gamepad. Touch stays, because mobile is a launch platform.
- **Touch controls are the hardest feel problem** for a precision platformer; budget playtest time on phones in Phase 5.
- **Rewind memory on phones**: measured in Phase 2, re-checked in Phase 4.
- **Agent drift from the architecture** (hidden state outside components): caught by the review checklist and by rewind hash tests.

## Reading and watching list

- Jonathan Blow: "Truth in Game Design"; Braid implementation talk (GDC).
- Casey Muratori: Handmade Hero; "The Big OOPs" (2025).
- Glenn Fiedler: "Fix Your Timestep!" — https://gafferongames.com/post/fix_your_timestep/
- Maddy Thorson: Celeste and TowerFall physics article.
- Robert Nystrom: *Game Programming Patterns* (free online).
- LDtk documentation — https://ldtk.io/docs/
- "Juice It or Lose It" (GDC talk).
- Mark Brown: Game Maker's Toolkit (puzzle design videos).
- MDA framework paper; Jesse Schell, *The Art of Game Design*.
- Play: Braid, Celeste, Order of the Sinking Star.

## Templates

- `specs/_TEMPLATE.md`: one-page spec for a system or feature.
- `docs/templates/review-checklist.md`: what to check in an agent's diff.
- `docs/templates/playtest-notes.md`: how to run and record a playtest.

## Open decisions

| Decision | Decide by |
| --- | --- |
| Internal resolution and pixel scale | Phase 1 |
| Paradox rules for immune objects | Phase 4 |
| Final game name and visual style | Phase 5 |
| World 2's time rule | Phase 7 |

## Progress log

| Date | Phase | What happened | Next step |
| --- | --- | --- | --- |
| 2026-11-03 | Planning | Chose rewind game, stack and curriculum | Start Phase 0 |
| 2026-11-03 | Planning | Plan refined: ECS from Phase 0, rewind moved to Phase 2, measurable exits, LDtk, CI/deploy, touch + gamepad, v1.0 = World 1, estimates at 3-5 h/week | Start Phase 0 |
| 2026-11-03 | 0 | Walking skeleton (Vite + TS + Pixi) live on GitHub Pages with CI. Loop lesson (fixed timestep, accumulator/purse, interpolation, stall cap) taught with a coins analogy and a loop visualizer page. `feed` (purse) built with 6 tests. Layo wrote and approved `specs/game-loop.md` section by section. Layo's pace: needs one question at a time, concrete examples before abstractions. | Build the loop driver + `Clock` component against the spec; then ECS/box spec; Layo to play Braid World 2 and note each puzzle's lesson |
| 2026-11-03 | 0 | Game loop built as 3 agent-sized tasks (config + `Clock`; pure `advance()` with cap, negative-time rule and `alpha`; `requestAnimationFrame` driver + demo box). 11 tests pass; mutation check (removed cap, removed clamp, broke alpha) was caught each time by one test. Reviewed with the checklist; Layo signed off: smooth on laptop and phone. Review lessons: judge "scope creep" by asking whether the spec's behaviour breaks without the change (stopping Pixi's ticker is required, not creep); the spec's "not a component" exemption covers real-time bookkeeping only, not game state. **Logged deviations to fix:** `state` in `main.ts` is a module-level object holding game state (temporary, ECS spec must replace it); `BOX_SPEED_PX_PER_TICK` is a magic number in `main.ts`; `COINS_PER_SECOND = 720` is a third config value the spec did not list; Pixi's own ticker is stopped and `app.render()` is called from our loop. | ECS + box spec, written section by section by Layo; Layo to play Braid World 2 |
| 2026-11-03 | 0 | Taught what an ECS is (entity = row ID, component = column of plain data, system = stateless function). Layo wrote and approved `specs/ecs-and-box.md` section by section. Decisions: state as plain data for rewind is the purpose; `PreviousPosition` is a component (not renderer memory, not derived from velocity); `Velocity` is a component (state), with starting speed from config; order per tick is Clock, save-previous, move, wrap; the simulation owns the wrap (and resets `PreviousPosition`); a snapshot holds component values, the entity set and the next-ID counter; tests compare the entire world across 30/60/144 Hz. Wrong answers worth re-teaching: derived previous position (C) fails when a wall stops the box; renderer memory (A) is hidden state; speed as a config constant (A) is a tuning value, not state. Open: Layo hasn't explicitly confirmed the wrap keeps overshoot; defaults for `worldWidth` and speed left to the agent. | Break ECS spec into agent tasks (ECS core + world export/restore; components + systems; render system + main.ts replacing the demo); review with checklist; Layo plays; then input-actions spec. Layo still to play Braid World 2 |
| 2026-11-03 | 0 | ECS + box built in three tasks: world export/restore, four ordered simulation systems, and renderer/main wiring. New tests cover exact snapshots, tick order, overshoot wrap, missing Velocity, full-world equality at 30/60/144 Hz, and interpolation. CI typecheck/tests/build passed. A deliberate +1 error in save-previous failed two tests; the correct code was restored. The browser build still needs Layo's laptop and phone play sign-off. | Layo plays the deployed box on laptop and phone and confirms smooth movement and no wrap streak; then write the input-actions spec section by section. Braid World 2 notes remain open. |
