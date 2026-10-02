/** A tiny deterministic PRNG (mulberry32). Same seed -> same sequence, so data-driven failures reproduce. */
export interface Random {
  next(): number;
  int(minInclusive: number, maxInclusive: number): number;
  pick<T>(items: readonly T[]): T;
}

export function seededRandom(seed: number): Random {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int(min, max) {
      if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
        throw new RangeError(`invalid range ${min}..${max}`);
      }
      return min + Math.floor(next() * (max - min + 1));
    },
    pick(items) {
      if (items.length === 0) throw new RangeError('cannot pick from an empty list');
      return items[Math.floor(next() * items.length)] as (typeof items)[number];
    },
  };
}

/** Seed from DEMO_SEED when set (to replay a run), otherwise from the clock. */
export function seedFromEnv(env: NodeJS.ProcessEnv = process.env): number {
  const fromEnv = Number(env.DEMO_SEED);
  return Number.isInteger(fromEnv) && fromEnv > 0 ? fromEnv : Date.now() % 2147483647;
}
