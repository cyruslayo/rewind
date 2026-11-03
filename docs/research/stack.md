# Research: web 2D game stacks (Nov 2026)

Gathered by a research subagent on 2026-11-03. Agent-fit ratings are judgment, not benchmarks.

## Recommendation
TypeScript + PixiJS v8 + Vite (+ own ECS, or bitECS). Phaser 4 if you want prebuilt scenes/physics. Bevy only if you want Rust and accept slower compile loops and unmeasured WASM size.

## Options
- **PixiJS v8** — launched March 2024; still current in 2026. WebGPU backend alongside WebGL (not guaranteed faster in all cases). Vendor Bunnymark, 100k sprites: ~50 ms CPU (v7) vs ~15 ms (v8). Loads only the backend in use. https://pixijs.com/blog/pixi-v8-launches
- **Phaser 4** — released April 2026; rebuilt WebGL renderer; sources don't mention WebGPU. Vendor claims very large sprite counts in one draw call. v4 replaces v3's pipeline system, so older examples may mislead agents. https://github.com/phaserjs/phaser/releases/tag/v4.0.0
- **Rust + Bevy (WASM)** — 0.18 (Mar 2026), 0.19 (~Jun 2026). wgpu targets WebGPU; web builds reported to work. Strong compiler feedback, but frequent API changes. No verified WASM size figures. https://gamefromscratch.com/bevy-0-19-released/
- **Rust + macroquad** — 0.4.14; small API, maintenance uncertain. https://docs.rs/crate/macroquad/latest
- **C/C++/Odin + raylib** — raylib 5.5 improved web builds; raylib 6.0 adds software renderer. No WASM benchmarks found. https://raysan5.itch.io/raylib/devlog/835825/raylib-55-released
- **TS ECS libraries** — author-run benchmarks show bitECS fastest (~1.35 ns/entity vs Miniplex ~12 ns). Miniplex most ergonomic. At 2D scale, ECS choice is rarely the bottleneck. https://andymai.github.io/ecsia/guide/performance , https://elixr-games.github.io/elics/benchmarks.html

## WebGPU browser support
Chrome 113+, Firefox 140+ (147+ recommended), Safari on macOS/iOS 26 — verify with vendor notes. https://webo360solutions.com/blog/webgpu-browser-support

## Agent benchmarks
GameDevBench covers only Godot 4; says nothing about these stacks. https://arxiv.org/html/2602.11103
