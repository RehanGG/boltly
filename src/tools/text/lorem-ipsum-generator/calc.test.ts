import { describe, expect, it } from "vitest";
import { generateLorem, MAX_COUNT, OPENING, type LoremInput } from "./calc";

const base: LoremInput = { unit: "paragraphs", count: 3, startWithLorem: true, seed: 1 };
const ok = (i: Partial<LoremInput> = {}) => {
  const r = generateLorem({ ...base, ...i });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};
const wordCount = (s: string) => s.match(/\S+/g)?.length ?? 0;

describe("generateLorem", () => {
  it("makes the requested number of paragraphs", () => {
    const text = ok({ count: 4 });
    expect(text.split("\n\n")).toHaveLength(4);
    expect(text.startsWith(OPENING)).toBe(true);
  });

  it("makes the requested number of sentences", () => {
    const text = ok({ unit: "sentences", count: 7 });
    expect(text.match(/\./g)).toHaveLength(7);
    expect(text.startsWith(OPENING)).toBe(true);
  });

  it("makes exactly the requested number of words", () => {
    for (const count of [1, 3, 8, 9, 50, 1000]) {
      expect(wordCount(ok({ unit: "words", count }))).toBe(count);
    }
    expect(ok({ unit: "words", count: 5 })).toBe("Lorem ipsum dolor sit amet.");
    expect(ok({ unit: "words", count: 1 })).toBe("Lorem.");
  });

  it("can skip the classic opening", () => {
    const text = ok({ startWithLorem: false, count: 5 });
    expect(text.startsWith("Lorem ipsum dolor sit amet, consectetur")).toBe(false);
  });

  it("gives the same text for the same seed and different text for another", () => {
    expect(ok({ seed: 5 })).toBe(ok({ seed: 5 }));
    expect(ok({ seed: 5 })).not.toBe(ok({ seed: 6 }));
  });

  it("starts every sentence with a capital letter and only uses Latin words", () => {
    const text = ok({ unit: "sentences", count: 30, startWithLorem: false, seed: 9 });
    for (const s of text.split(/(?<=\.) /)) expect(s).toMatch(/^[A-Z]/);
    expect(text).toMatch(/^[A-Za-z ,.]+$/);
  });

  it("accepts the largest allowed amounts", () => {
    expect(ok({ unit: "paragraphs", count: MAX_COUNT.paragraphs }).split("\n\n")).toHaveLength(50);
    expect(wordCount(ok({ unit: "words", count: MAX_COUNT.words }))).toBe(5000);
  });

  it("rejects empty, zero, negative, fractional and too-large counts", () => {
    for (const count of [NaN, 0, -3, 2.5, 51, Infinity]) {
      expect(generateLorem({ ...base, count })).toMatchObject({ ok: false, field: "count" });
    }
    expect(generateLorem({ ...base, unit: "words", count: 5001 }).ok).toBe(false);
    expect(generateLorem({ ...base, unit: "sentences", count: 201 }).ok).toBe(false);
  });
});
