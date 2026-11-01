import { describe, expect, it } from "vitest";
import { addRecent, parseRecent } from "./recent";

describe("recent tools", () => {
  it("parses stored values safely", () => {
    expect(parseRecent(null)).toEqual([]);
    expect(parseRecent("not json")).toEqual([]);
    expect(parseRecent('{"a":1}')).toEqual([]);
    expect(parseRecent('["a",1,"b"]')).toEqual(["a", "b"]);
  });

  it("puts the newest first and removes duplicates", () => {
    expect(addRecent(["a", "b", "c"], "b")).toEqual(["b", "a", "c"]);
  });

  it("keeps only the last 4", () => {
    expect(addRecent(["a", "b", "c", "d"], "e")).toEqual(["e", "a", "b", "c"]);
  });
});
