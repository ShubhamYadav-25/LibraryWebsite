export const gradients = [
  "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500",
  "bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500",
  "bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500",
  "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500",
  "bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500",

  "bg-gradient-to-br from-red-500 via-pink-500 to-fuchsia-500",
  "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500",
  "bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500",
  "bg-gradient-to-br from-orange-500 via-yellow-500 to-red-500",

  "bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-500",
  "bg-gradient-to-tr from-pink-500 via-rose-500 to-red-500",
  "bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-500",
];

// Simple seeded PRNG (mulberry32) — auditable and deterministic, avoiding Math.random()
function createPRNG(seed) {
  let s = Math.trunc(seed);
  return function () {
    s = Math.trunc(s + 0x6d2b79f5);
    s = (s >>> 0) - (s >>> 31) * 2 ** 31; // 32-bit signed wrap
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const prng = createPRNG(Date.now());

export function getRandomGradientClass() {
  return gradients[Math.floor(prng() * gradients.length)];
}