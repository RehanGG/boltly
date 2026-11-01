export type CaseMode = "upper" | "lower" | "title" | "sentence" | "camel" | "snake" | "kebab";

export const CASE_MODES: { value: CaseMode; label: string }[] = [
  { value: "upper", label: "UPPER CASE" },
  { value: "lower", label: "lower case" },
  { value: "title", label: "Title Case" },
  { value: "sentence", label: "Sentence case" },
  { value: "camel", label: "camelCase" },
  { value: "snake", label: "snake_case" },
  { value: "kebab", label: "kebab-case" },
];

// Short words stay lower case in a title unless they are first or last.
const SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "up",
]);

function capitalize(word: string): string {
  return word.replace(/\p{L}/u, (c) => c.toUpperCase());
}

function titleCase(text: string): string {
  const tokens = text.split(/(\s+)/);
  const wordIndexes = tokens.map((t, i) => (/\S/.test(t) ? i : -1)).filter((i) => i >= 0);
  const first = wordIndexes[0];
  const last = wordIndexes[wordIndexes.length - 1];
  return tokens
    .map((token, i) => {
      if (!/\S/.test(token)) return token;
      const lower = token.toLowerCase();
      const bare = lower.replace(/[^\p{L}\p{N}]/gu, "");
      return i !== first && i !== last && SMALL_WORDS.has(bare) ? lower : capitalize(lower);
    })
    .join("");
}

function sentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*|[.!?]["')\]]*\s+|\n+\s*)(\p{L})/gu, (_m, before: string, letter: string) => before + letter.toUpperCase())
    .replace(/\bi\b/g, "I");
}

// Splits "someKebab_case-String" or "XMLHttpRequest" into separate words.
function words(line: string): string[] {
  return line
    .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, "$1 $2")
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

// camelCase, snake_case and kebab-case are applied to each line separately,
// so a list of names converts line by line.
function perLine(text: string, convert: (w: string[]) => string): string {
  return text.split("\n").map((line) => convert(words(line))).join("\n");
}

export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return titleCase(text);
    case "sentence":
      return sentenceCase(text);
    case "camel":
      return perLine(text, (w) =>
        w.map((x, i) => (i === 0 ? x.toLowerCase() : capitalize(x.toLowerCase()))).join(""),
      );
    case "snake":
      return perLine(text, (w) => w.map((x) => x.toLowerCase()).join("_"));
    case "kebab":
      return perLine(text, (w) => w.map((x) => x.toLowerCase()).join("-"));
  }
}
