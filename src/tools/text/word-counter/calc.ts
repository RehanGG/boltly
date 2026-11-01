export interface TextStats {
  words: number;
  characters: number; // Unicode characters including spaces
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingSeconds: number; // at 200 words per minute
  speakingSeconds: number; // at 130 words per minute
}

export const READING_WPM = 200;
export const SPEAKING_WPM = 130;

// A sentence ends at . ! or ? followed by a space or the end of the text,
// so decimals such as 3.14 do not split a sentence.
export function countText(text: string): TextStats {
  const words = text.match(/\S+/g)?.length ?? 0;
  const sentences =
    text.trim() === "" ? 0 : text.split(/[.!?]+(?:\s+|$)/).filter((s) => s.trim() !== "").length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim() !== "").length;
  return {
    words,
    characters: Array.from(text).length,
    charactersNoSpaces: Array.from(text.replace(/\s/g, "")).length,
    sentences,
    paragraphs,
    readingSeconds: Math.round((words / READING_WPM) * 60),
    speakingSeconds: Math.round((words / SPEAKING_WPM) * 60),
  };
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0 sec";
  if (seconds < 60) return `${seconds} sec`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m} min` : `${m} min ${s} sec`;
}
