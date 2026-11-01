import { describe, expect, it } from "vitest";
import { countText, formatDuration } from "./calc";

describe("countText", () => {
  it("counts a simple paragraph", () => {
    const r = countText("Hello world. How are you? Fine!");
    expect(r.words).toBe(6);
    expect(r.sentences).toBe(3);
    expect(r.paragraphs).toBe(1);
    expect(r.characters).toBe(31);
    expect(r.charactersNoSpaces).toBe(26);
  });

  it("returns zeros for empty and whitespace-only text", () => {
    for (const text of ["", "   ", "\n\n \t"]) {
      expect(countText(text)).toEqual({
        words: 0,
        characters: Array.from(text).length,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingSeconds: 0,
        speakingSeconds: 0,
      });
    }
  });

  it("counts paragraphs separated by blank lines", () => {
    expect(countText("One.\n\nTwo.\n  \nThree.").paragraphs).toBe(3);
    expect(countText("Line one\nline two").paragraphs).toBe(1);
  });

  it("does not split sentences on decimals or repeated punctuation", () => {
    expect(countText("Pi is 3.14 today.").sentences).toBe(1);
    expect(countText("Wait... what?!").sentences).toBe(2);
  });

  it("counts text without ending punctuation as one sentence", () => {
    expect(countText("No punctuation here").sentences).toBe(1);
  });

  it("counts emoji and accented letters as single characters", () => {
    expect(countText("héllo 👍").characters).toBe(7);
  });

  it("treats hyphenated words and tabs as expected", () => {
    expect(countText("well-known\tfact").words).toBe(2);
  });

  it("estimates reading time at 200 words per minute", () => {
    const r = countText(Array(400).fill("word").join(" "));
    expect(r.words).toBe(400);
    expect(r.readingSeconds).toBe(120);
    expect(formatDuration(r.readingSeconds)).toBe("2 min");
  });

  it("handles very long text without crashing", () => {
    const r = countText("word ".repeat(200000));
    expect(r.words).toBe(200000);
  });
});

describe("formatDuration", () => {
  it("formats seconds and minutes", () => {
    expect(formatDuration(0)).toBe("0 sec");
    expect(formatDuration(45)).toBe("45 sec");
    expect(formatDuration(60)).toBe("1 min");
    expect(formatDuration(95)).toBe("1 min 35 sec");
  });
});
