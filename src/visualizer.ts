import { feed, type Purse } from './fixedStep';

// 1 coin = 1/720 s, so 30, 60 and 144 Hz frames are 24, 12 and 5 coins. A tick (1/60 s) is 12 coins.
const COINS_PER_SECOND = 720;
const TICK_COST = COINS_PER_SECOND / 60;
const RUN_SECONDS = 2;
const END = COINS_PER_SECOND * RUN_SECONDS;
const TOTAL_TICKS = 60 * RUN_SECONDS;

interface Lane {
  hz: number;
  frameCoins: number;
  nextFrame: number;
  frames: number;
  purse: Purse;
  drawn: number;
  say: string;
  flash: boolean;
  el: { cells: HTMLElement[]; say: HTMLElement; sim: HTMLElement; box: HTMLElement; stats: HTMLElement };
}

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const lanesEl = $('lanes');
const resultEl = $('result');
const interpEl = $<HTMLInputElement>('interp');
const speedEl = $<HTMLSelectElement>('speed');
const playEl = $('play');

function makeLane(hz: number): Lane {
  const frameCoins = COINS_PER_SECOND / hz;
  const root = document.createElement('div');
  root.className = 'lane';
  root.innerHTML = `
    <h2>${hz} Hz screen <span>${frameCoins} coins per visit</span></h2>
    <div class="purse">${'<div class="cell"></div>'.repeat(TICK_COST)}</div>
    <div class="say"></div>
    <div class="track"><div class="box sim"></div><div class="box"></div></div>
    <div class="stats"></div>`;
  lanesEl.appendChild(root);
  const boxes = root.querySelectorAll<HTMLElement>('.box');
  return {
    hz, frameCoins, nextFrame: frameCoins, frames: 0,
    purse: { coins: 0, ticks: 0 }, drawn: 0, say: 'Waiting for the first visit...', flash: false,
    el: {
      cells: [...root.querySelectorAll<HTMLElement>('.cell')],
      say: root.querySelector<HTMLElement>('.say')!,
      sim: boxes[0]!, box: boxes[1]!,
      stats: root.querySelector<HTMLElement>('.stats')!,
    },
  };
}

const lanes = [30, 60, 144].map(makeLane);
let clock = 0;
let playing = false;
let last = 0;

function reset() {
  clock = 0;
  for (const l of lanes) {
    l.nextFrame = l.frameCoins; l.frames = 0; l.purse = { coins: 0, ticks: 0 };
    l.drawn = 0; l.say = 'Waiting for the first visit...'; l.flash = false;
  }
  resultEl.classList.remove('show');
  render();
}

function visit(l: Lane) {
  const before = l.purse.coins;
  const { purse, bought } = feed(l.purse, l.frameCoins, TICK_COST);
  l.purse = purse;
  l.frames += 1;
  l.flash = bought > 0;
  // Interpolation draws between the previous tick and the current one, so it trails by one tick.
  l.drawn = interpEl.checked ? Math.max(0, purse.ticks - 1 + purse.coins / TICK_COST) : purse.ticks;
  l.say = `Visit ${l.frames}: purse ${before} + ${l.frameCoins} = ${before + l.frameCoins} -> bought ${bought} tick${bought === 1 ? '' : 's'}, ${purse.coins} left`;
}

function advanceTo(target: number) {
  const t = Math.min(target, END);
  for (const l of lanes) while (l.nextFrame <= t) { visit(l); l.nextFrame += l.frameCoins; }
  clock = t;
  if (clock >= END) { playing = false; showResult(); }
}

function stepFrame() {
  const next = Math.min(...lanes.map((l) => l.nextFrame));
  advanceTo(next);
}

function showResult() {
  const rows = lanes.map((l) => `${l.hz} Hz: <b>${l.purse.ticks}</b> ticks in ${l.frames} visits`).join('<br>');
  resultEl.innerHTML = `After ${RUN_SECONDS} seconds of real time:<br>${rows}<br>Different rhythm, same ${TOTAL_TICKS} ticks, same box position.`;
  resultEl.classList.add('show');
}

function render() {
  for (const l of lanes) {
    // Orange = coins still owed. Teal = coins that were just spent on a tick this visit.
    l.el.cells.forEach((c, i) => {
      c.className = 'cell' + (i < l.purse.coins ? ' on' : l.flash ? ' flash' : '');
    });
    l.el.say.textContent = l.say;
    l.el.sim.style.left = `${(l.purse.ticks / TOTAL_TICKS) * 100}%`;
    l.el.box.style.left = `${(l.drawn / TOTAL_TICKS) * 100}%`;
    l.el.stats.innerHTML = `<span>ticks: ${l.purse.ticks}</span><span>frames drawn: ${l.frames}</span>`;
  }
  playEl.textContent = playing ? 'Pause' : clock >= END ? 'Play again' : 'Play';
}

function loop(now: number) {
  if (playing) {
    advanceTo(clock + ((now - last) / 1000) * Number(speedEl.value));
    last = now;
    render();
    requestAnimationFrame(loop);
  }
}

playEl.addEventListener('click', () => {
  if (clock >= END) reset();
  playing = !playing;
  last = performance.now();
  if (playing) requestAnimationFrame(loop);
  render();
});
$('step').addEventListener('click', () => { playing = false; if (clock >= END) reset(); stepFrame(); render(); });
$('reset').addEventListener('click', () => { playing = false; reset(); });
reset();
