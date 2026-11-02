// Browser-only image helpers. Everything stays in memory on the visitor's device.

// Gives the browser a chance to paint and handle clicks between heavy steps.
export const yieldToBrowser = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export const IMAGE_ERROR = "This image could not be opened. It may be damaged or in an unsupported format.";

// Decodes off the main thread. Passing a size makes the browser scale while decoding,
// which keeps memory low for very large photos.
export async function decodeImage(file: Blob, size?: { width: number; height: number }): Promise<ImageBitmap> {
  if (typeof createImageBitmap !== "function") {
    throw new Error("Your browser can't process images here. Try a recent version of Chrome, Firefox, Safari or Edge.");
  }
  if (size) {
    try {
      return await createImageBitmap(file, { resizeWidth: size.width, resizeHeight: size.height, resizeQuality: "high" });
    } catch {
      // Older browsers ignore or reject the resize options: decode at full size instead.
    }
  }
  try {
    return await createImageBitmap(file);
  } catch {
    throw new Error(IMAGE_ERROR);
  }
}

export function drawToCanvas(
  source: ImageBitmap,
  width: number,
  height: number,
  background?: string,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing surface for this image.");
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The image is too large for this browser to save. Try a smaller size."))),
      type,
      quality,
    );
  });
}

// Frees the canvas memory right away (large canvases can otherwise linger).
export function releaseCanvas(canvas: HTMLCanvasElement): void {
  canvas.width = 0;
  canvas.height = 0;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : IMAGE_ERROR;
}
