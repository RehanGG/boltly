import { secureRandomInt, shuffle, type RandomInt } from "@/lib/random";
import { validate, type Calc } from "@/lib/validate";

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 128;

export const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
export const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const NUMBERS = "0123456789";
export const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";
export const AMBIGUOUS = "Il1O0o"; // easy to confuse when read aloud or printed

export interface PasswordOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

export const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
};

export function characterSets(options: PasswordOptions): string[] {
  const strip = (set: string) =>
    options.excludeAmbiguous ? [...set].filter((c) => !AMBIGUOUS.includes(c)).join("") : set;
  const sets: string[] = [];
  if (options.lowercase) sets.push(strip(LOWERCASE));
  if (options.uppercase) sets.push(strip(UPPERCASE));
  if (options.numbers) sets.push(strip(NUMBERS));
  if (options.symbols) sets.push(strip(SYMBOLS));
  return sets;
}

// One character from every chosen set, the rest from all of them, then shuffled.
// Every pick uses crypto.getRandomValues (via secureRandomInt), never Math.random.
export function generatePassword(
  options: PasswordOptions,
  randomInt: RandomInt = secureRandomInt,
): Calc<string> {
  const bad = validate([["length", "Length", options.length, { min: MIN_LENGTH, max: MAX_LENGTH, integer: true }]]);
  if (bad) return bad;
  const sets = characterSets(options);
  if (sets.length === 0) {
    return { ok: false, field: "sets", error: "Choose at least one type of character." };
  }

  const pool = sets.join("");
  const chars = sets.map((set) => set[randomInt(set.length)]);
  while (chars.length < options.length) chars.push(pool[randomInt(pool.length)]);
  return { ok: true, value: shuffle(chars, randomInt).join("") };
}

export type StrengthLabel = "Weak" | "Fair" | "Strong" | "Very strong";

export interface Strength {
  bits: number;
  label: StrengthLabel;
  percent: number; // for the meter, 0 to 100
}

// Estimated entropy: length × log2(size of the character pool).
export function passwordStrength(options: PasswordOptions): Strength {
  const poolSize = characterSets(options).join("").length;
  const bits = poolSize > 1 ? options.length * Math.log2(poolSize) : 0;
  const label: StrengthLabel = bits < 40 ? "Weak" : bits < 60 ? "Fair" : bits < 80 ? "Strong" : "Very strong";
  return { bits, label, percent: Math.max(5, Math.min(100, (bits / 100) * 100)) };
}
