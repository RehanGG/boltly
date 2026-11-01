import { describe, expect, it } from "vitest";
import { convertCase } from "./calc";

describe("convertCase", () => {
  it("converts to upper and lower case", () => {
    expect(convertCase("Hello World", "upper")).toBe("HELLO WORLD");
    expect(convertCase("Hello World", "lower")).toBe("hello world");
    expect(convertCase("straße", "upper")).toBe("STRASSE");
  });

  it("converts to title case and keeps small words lower", () => {
    expect(convertCase("the lord of the rings", "title")).toBe("The Lord of the Rings");
    expect(convertCase("a tale to remember", "title")).toBe("A Tale to Remember");
    expect(convertCase("WHAT TO DO IN", "title")).toBe("What to Do In");
    expect(convertCase("hello   world\nnext line", "title")).toBe("Hello   World\nNext Line");
  });

  it("converts to sentence case", () => {
    expect(convertCase("hELLO wORLD. tHIS is. a TEST!\nnew line", "sentence")).toBe(
      "Hello world. This is. A test!\nNew line",
    );
    expect(convertCase("i think i can. i did?", "sentence")).toBe("I think I can. I did?");
    expect(convertCase('  "quoted." next', "sentence")).toBe('  "quoted." Next');
  });

  it("converts to camelCase", () => {
    expect(convertCase("Hello World example", "camel")).toBe("helloWorldExample");
    expect(convertCase("some-kebab_case String", "camel")).toBe("someKebabCaseString");
    expect(convertCase("XMLHttpRequest", "camel")).toBe("xmlHttpRequest");
  });

  it("converts to snake_case and kebab-case", () => {
    expect(convertCase("Hello World example", "snake")).toBe("hello_world_example");
    expect(convertCase("helloWorldExample", "snake")).toBe("hello_world_example");
    expect(convertCase("Hello World example", "kebab")).toBe("hello-world-example");
    expect(convertCase("  lots   of -- spaces ", "kebab")).toBe("lots-of-spaces");
  });

  it("converts code-style cases line by line", () => {
    expect(convertCase("first name\nLast Name", "snake")).toBe("first_name\nlast_name");
  });

  it("keeps numbers and accented letters", () => {
    expect(convertCase("Version 2 beta", "snake")).toBe("version_2_beta");
    expect(convertCase("café in the lait", "title")).toBe("Café in the Lait");
  });

  it("returns an empty string for empty input in every mode", () => {
    for (const m of ["upper", "lower", "title", "sentence", "camel", "snake", "kebab"] as const) {
      expect(convertCase("", m)).toBe("");
    }
    expect(convertCase("   ", "camel")).toBe("");
  });
});
