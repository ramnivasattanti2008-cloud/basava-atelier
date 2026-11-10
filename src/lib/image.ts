const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

export const acceptedImageTypes = ACCEPTED.join(",");

export class ImageError extends Error {}

/**
 * Reads an image file and returns a downscaled JPEG data URL.
 * Reference images stay in the visitor's browser in this demo, so they are
 * shrunk to keep within localStorage limits.
 */
export async function fileToDataUrl(file: File, maxSide = 1100, quality = 0.82): Promise<string> {
  if (!ACCEPTED.includes(file.type)) throw new ImageError("Please choose a JPG, PNG or WebP image.");
  if (file.size > MAX_BYTES) throw new ImageError("That image is larger than 10 MB. Please choose a smaller one.");

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new ImageError("That file could not be read as an image."));
      el.src = objectUrl;
    });
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ImageError("This browser could not process the image.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
