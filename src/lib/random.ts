// Secure random numbers from crypto.getRandomValues, never Math.random.
export type RandomSource = (array: Uint32Array) => Uint32Array;

const TWO_32 = 2 ** 32;
const TWO_53 = 2 ** 53;

const cryptoSource: RandomSource = (array) => {
  if (typeof globalThis.crypto?.getRandomValues !== "function") {
    throw new Error("Secure random numbers are not available in this browser.");
  }
  return globalThis.crypto.getRandomValues(array);
};

// A uniform integer from 0 up to (not including) maxExclusive, 1 <= maxExclusive <= 2^53.
// Values that would make some results more likely (modulo bias) are discarded and redrawn.
export function secureRandomInt(maxExclusive: number, source: RandomSource = cryptoSource): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > TWO_53) {
    throw new RangeError("maxExclusive must be a whole number from 1 to 2^53.");
  }
  if (maxExclusive === 1) return 0;

  if (maxExclusive <= TWO_32) {
    const limit = TWO_32 - (TWO_32 % maxExclusive);
    const buffer = new Uint32Array(1);
    for (;;) {
      const value = source(buffer)[0];
      if (value < limit) return value % maxExclusive;
    }
  }

  const limit = TWO_53 - (TWO_53 % maxExclusive);
  const buffer = new Uint32Array(2);
  for (;;) {
    source(buffer);
    const value = (buffer[0] & 0x1fffff) * TWO_32 + buffer[1]; // 53 random bits
    if (value < limit) return value % maxExclusive;
  }
}

export type RandomInt = (maxExclusive: number) => number;

// In-place Fisher-Yates shuffle.
export function shuffle<T>(items: T[], randomInt: RandomInt = secureRandomInt): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
