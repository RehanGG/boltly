// Pure helpers for the image tools: sizes, names and file checks.
export const MAX_FILE_BYTES = 50 * 1024 * 1024;
export const MAX_FILES = 20;

export const TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
};

export const WEB_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ANY_IMAGE_TYPES = [...WEB_IMAGE_TYPES, "image/gif", "image/bmp"];

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[i]}`;
}

// Positive when the new file is smaller.
export function percentSaved(before: number, after: number): number {
  if (!(before > 0)) return 0;
  return ((before - after) / before) * 100;
}

export interface FileInfo {
  name: string;
  type: string;
  size: number;
}

export function typeOf(file: FileInfo): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return TYPE_BY_EXTENSION[ext] ?? "";
}

export function typeLabel(types: string[]): string {
  const names: Record<string, string> = {
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "image/webp": "WebP",
    "image/gif": "GIF",
    "image/bmp": "BMP",
  };
  return types.map((t) => names[t] ?? t).join(", ");
}

// Returns a plain-language problem, or null when the file can be used.
export function checkImageFile(file: FileInfo, allowed: string[] = WEB_IMAGE_TYPES): string | null {
  if (file.size === 0) return `${file.name} is empty.`;
  if (!allowed.includes(typeOf(file))) {
    return `${file.name} is not a supported image. Use ${typeLabel(allowed)}.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return `${file.name} is larger than ${formatBytes(MAX_FILE_BYTES)}.`;
  }
  return null;
}

export function extensionFor(type: string): string {
  return { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[type] ?? "img";
}

function baseName(name: string): string {
  const clean = name.split(/[\\/]/).pop() ?? name;
  const dot = clean.lastIndexOf(".");
  return dot > 0 ? clean.slice(0, dot) : clean;
}

export function replaceExtension(name: string, ext: string): string {
  return `${baseName(name) || "image"}.${ext}`;
}

// "photo.png" -> "photo-compressed.png"
export function suffixedName(name: string, suffix: string, ext: string): string {
  return `${baseName(name) || "image"}-${suffix}.${ext}`;
}

// Adds files up to the limit and reports how many did not fit.
export function limitFiles<T>(incoming: T[], existingCount: number, max = MAX_FILES): { accepted: T[]; skipped: number } {
  const room = Math.max(0, max - existingCount);
  return { accepted: incoming.slice(0, room), skipped: Math.max(0, incoming.length - room) };
}
