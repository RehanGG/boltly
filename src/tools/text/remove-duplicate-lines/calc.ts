export type SortMode = "none" | "asc" | "desc";

export interface DedupeOptions {
  ignoreCase: boolean;
  trim: boolean; // trim spaces from every line before comparing and output
  removeEmpty: boolean;
  sort: SortMode;
}

export interface DedupeResult {
  text: string;
  originalCount: number;
  uniqueCount: number;
  duplicatesRemoved: number;
  emptyRemoved: number;
}

// Keeps the first copy of each line. A single line break at the very end of the
// text is not counted as an empty line.
export function removeDuplicateLines(input: string, options: DedupeOptions): DedupeResult {
  if (input === "") {
    return { text: "", originalCount: 0, uniqueCount: 0, duplicatesRemoved: 0, emptyRemoved: 0 };
  }
  const lines = input.split(/\r?\n/);
  if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();

  const seen = new Set<string>();
  const kept: string[] = [];
  let duplicatesRemoved = 0;
  let emptyRemoved = 0;

  for (const raw of lines) {
    const line = options.trim ? raw.trim() : raw;
    if (line === "" && options.removeEmpty) {
      emptyRemoved++;
      continue;
    }
    const key = options.ignoreCase ? line.toLowerCase() : line;
    if (seen.has(key)) {
      duplicatesRemoved++;
    } else {
      seen.add(key);
      kept.push(line);
    }
  }

  if (options.sort !== "none") {
    kept.sort((a, b) => a.localeCompare(b, "en"));
    if (options.sort === "desc") kept.reverse();
  }

  return {
    text: kept.join("\n"),
    originalCount: lines.length,
    uniqueCount: kept.length,
    duplicatesRemoved,
    emptyRemoved,
  };
}
