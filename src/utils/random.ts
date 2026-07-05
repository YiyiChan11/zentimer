// ──────────────────────────────────────────────
// Random utilities
// ──────────────────────────────────────────────

/** Random integer in [min, max] inclusive */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Random float in [min, max) */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/** Pick a random element from an array */
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
