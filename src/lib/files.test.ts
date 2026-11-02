import { describe, expect, it } from "vitest";
import {
  ANY_IMAGE_TYPES,
  checkImageFile,
  formatBytes,
  limitFiles,
  MAX_FILE_BYTES,
  percentSaved,
  replaceExtension,
  suffixedName,
  typeOf,
} from "./files";

describe("formatBytes", () => {
  it("formats sizes in B, KB, MB and GB", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024)).toBe("1.00 KB");
    expect(formatBytes(1536)).toBe("1.50 KB");
    expect(formatBytes(10 * 1024 * 1024)).toBe("10.0 MB");
    expect(formatBytes(2.5 * 1024 * 1024)).toBe("2.50 MB");
    expect(formatBytes(3 * 1024 ** 3)).toBe("3.00 GB");
  });

  it("does not crash on bad numbers", () => {
    expect(formatBytes(-5)).toBe("0 B");
    expect(formatBytes(NaN)).toBe("0 B");
    expect(formatBytes(Infinity)).toBe("0 B");
  });
});

describe("percentSaved", () => {
  it("is the share removed", () => {
    expect(percentSaved(1000, 250)).toBe(75);
    expect(percentSaved(1000, 1000)).toBe(0);
  });
  it("is negative when the file grew and 0 for an empty original", () => {
    expect(percentSaved(1000, 1500)).toBe(-50);
    expect(percentSaved(0, 100)).toBe(0);
  });
});

describe("checkImageFile", () => {
  const file = (name: string, type: string, size = 1000) => ({ name, type, size });

  it("accepts JPG, PNG and WebP", () => {
    expect(checkImageFile(file("a.jpg", "image/jpeg"))).toBeNull();
    expect(checkImageFile(file("a.png", "image/png"))).toBeNull();
    expect(checkImageFile(file("a.webp", "image/webp"))).toBeNull();
  });

  it("falls back to the extension when the browser gives no type", () => {
    expect(typeOf(file("PHOTO.JPG", ""))).toBe("image/jpeg");
    expect(checkImageFile(file("photo.png", ""))).toBeNull();
  });

  it("rejects unsupported, empty and oversized files with a clear message", () => {
    expect(checkImageFile(file("doc.pdf", "application/pdf"))).toBe("doc.pdf is not a supported image. Use JPG, PNG, WebP.");
    expect(checkImageFile(file("a.gif", "image/gif"))).not.toBeNull();
    expect(checkImageFile(file("a.gif", "image/gif"), ANY_IMAGE_TYPES)).toBeNull();
    expect(checkImageFile(file("a.jpg", "image/jpeg", 0))).toBe("a.jpg is empty.");
    expect(checkImageFile(file("big.jpg", "image/jpeg", MAX_FILE_BYTES + 1))).toBe("big.jpg is larger than 50.0 MB.");
    expect(checkImageFile(file("big.jpg", "image/jpeg", MAX_FILE_BYTES))).toBeNull();
  });

  it("accepts a 10 MB photo", () => {
    expect(checkImageFile(file("photo.jpg", "image/jpeg", 12 * 1024 * 1024))).toBeNull();
  });
});

describe("file names", () => {
  it("replaces and adds extensions", () => {
    expect(replaceExtension("My.Photo.PNG", "jpg")).toBe("My.Photo.jpg");
    expect(replaceExtension("noext", "webp")).toBe("noext.webp");
    expect(replaceExtension("C:\\pics\\cat.jpeg", "png")).toBe("cat.png");
    expect(replaceExtension("", "png")).toBe("image.png");
    expect(replaceExtension(".hidden", "png")).toBe(".hidden.png");
  });
  it("adds a suffix before the extension", () => {
    expect(suffixedName("photo.png", "compressed", "png")).toBe("photo-compressed.png");
    expect(suffixedName("a/b/photo.jpeg", "800x600", "jpg")).toBe("photo-800x600.jpg");
  });
});

describe("limitFiles", () => {
  it("keeps files up to the maximum and counts the rest", () => {
    expect(limitFiles([1, 2, 3, 4], 0, 3)).toEqual({ accepted: [1, 2, 3], skipped: 1 });
    expect(limitFiles([1, 2], 3, 3)).toEqual({ accepted: [], skipped: 2 });
    expect(limitFiles([], 0, 3)).toEqual({ accepted: [], skipped: 0 });
  });
});
