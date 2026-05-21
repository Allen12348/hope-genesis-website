export type OptimizedImageBlobs = {
  full: Blob;
  thumb: Blob;
  mimeType: string;
  width: number;
  height: number;
  fullSizeBytes: number;
  thumbSizeBytes: number;
};

const MAX_FULL_WIDTH = 1920;
const MAX_THUMB_WIDTH = 400;
const FULL_QUALITY = 0.82;
const THUMB_QUALITY = 0.78;

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image file"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image optimization failed"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

function drawResized(
  img: HTMLImageElement,
  maxWidth: number,
): { canvas: HTMLCanvasElement; width: number; height: number } {
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0, width, height);
  return { canvas, width, height };
}

function pickOutputMime(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const data = canvas.toDataURL("image/webp");
  return data.startsWith("data:image/webp") ? "image/webp" : "image/jpeg";
}

/**
 * Compress and resize an image in the browser before upload.
 * Produces a web-optimized full image and a square-ish thumbnail.
 */
export async function optimizeImageFile(file: File): Promise<OptimizedImageBlobs> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error("Image must be under 25 MB");
  }

  const img = await loadImageFromFile(file);
  const mimeType = pickOutputMime();
  const fullDraw = drawResized(img, MAX_FULL_WIDTH);
  const thumbDraw = drawResized(img, MAX_THUMB_WIDTH);

  const [full, thumb] = await Promise.all([
    canvasToBlob(fullDraw.canvas, mimeType, FULL_QUALITY),
    canvasToBlob(thumbDraw.canvas, mimeType, THUMB_QUALITY),
  ]);

  return {
    full,
    thumb,
    mimeType,
    width: fullDraw.width,
    height: fullDraw.height,
    fullSizeBytes: full.size,
    thumbSizeBytes: thumb.size,
  };
}
