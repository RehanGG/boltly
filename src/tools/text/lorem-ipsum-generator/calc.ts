import { validate, type Calc } from "@/lib/validate";

export type LoremUnit = "paragraphs" | "sentences" | "words";

export interface LoremInput {
  unit: LoremUnit;
  count: number;
  startWithLorem: boolean;
  seed: number; // same seed, same text; "Generate again" changes it
}

export const MAX_COUNT: Record<LoremUnit, number> = { paragraphs: 50, sentences: 200, words: 5000 };

export const OPENING = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore " +
  "magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo " +
  "consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint " +
  "occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum curabitur " +
  "pretium tincidunt lacus nunc pulvinar sapien ligula vestibulum rhoncus maecenas faucibus mollis interdum " +
  "porta gravida feugiat donec sollicitudin molestie malesuada praesent commodo cursus magna vel scelerisque"
).split(" ");

// Small seeded random number generator (mulberry32), so output is repeatable.
function makeRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function pickWords(rand: () => number, n: number): string[] {
  return Array.from({ length: n }, () => WORDS[Math.floor(rand() * WORDS.length)]);
}

function sentence(rand: () => number): string {
  const n = 6 + Math.floor(rand() * 9); // 6 to 14 words
  const words = pickWords(rand, n);
  if (n > 8 && rand() < 0.6) {
    const at = Math.floor(n / 2) - 1 + Math.floor(rand() * 3);
    words[at] += ",";
  }
  return `${capitalize(words.join(" "))}.`;
}

function paragraph(rand: () => number, first: boolean, startWithLorem: boolean): string {
  const n = 3 + Math.floor(rand() * 4); // 3 to 6 sentences
  const sentences = Array.from({ length: n }, () => sentence(rand));
  if (first && startWithLorem) sentences[0] = OPENING;
  return sentences.join(" ");
}

export function generateLorem(input: LoremInput): Calc<string> {
  const { unit, count, startWithLorem, seed } = input;
  const bad = validate([["count", "Amount", count, { min: 1, max: MAX_COUNT[unit], integer: true }]]);
  if (bad) return bad;

  const rand = makeRandom(seed);
  if (unit === "paragraphs") {
    const paragraphs = Array.from({ length: count }, (_, i) => paragraph(rand, i === 0, startWithLorem));
    return { ok: true, value: paragraphs.join("\n\n") };
  }
  if (unit === "sentences") {
    const sentences = Array.from({ length: count }, () => sentence(rand));
    if (startWithLorem) sentences[0] = OPENING;
    return { ok: true, value: sentences.join(" ") };
  }
  const opening = OPENING.replace(/[,.]/g, "").toLowerCase().split(" ");
  const words = startWithLorem
    ? [...opening, ...pickWords(rand, Math.max(0, count - opening.length))].slice(0, count)
    : pickWords(rand, count);
  return { ok: true, value: `${capitalize(words.join(" "))}.` };
}
