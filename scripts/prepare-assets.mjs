import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicReference = path.join(root, "public", "reference");
fs.mkdirSync(publicReference, { recursive: true });

const sourcePath = path.join(
  root,
  "assets",
  "reference",
  "amber-touch-reference.webp.b64",
);

const sourceBuffer = Buffer.from(
  fs.readFileSync(sourcePath, "utf8").trim(),
  "base64",
);

const fullReferencePath = path.join(publicReference, "amber-touch.webp");
fs.writeFileSync(fullReferencePath, sourceBuffer);

// Exact crop used throughout the project. It matches the supplied 1536×1536
// source and produces a 625×1188 bottle-only working canvas.
const crop = {
  left: 429,
  top: 84,
  width: 625,
  height: 1188,
};

const { data, info } = await sharp(sourceBuffer)
  .ensureAlpha()
  .extract(crop)
  .raw()
  .toBuffer({ resolveWithObject: true });

const width = info.width;
const height = info.height;
const channels = info.channels;
const pixelCount = width * height;

// Build a background candidate mask from near-white, low-chroma pixels.
const candidate = new Uint8Array(pixelCount);
for (let i = 0; i < pixelCount; i += 1) {
  const offset = i * channels;
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const chroma = max - min;

  candidate[i] = min >= 236 && chroma <= 20 ? 1 : 0;
}

// Flood-fill only white pixels connected to the crop border. This preserves
// bright label text and enclosed highlights instead of deleting all whites.
const background = new Uint8Array(pixelCount);
const queue = new Uint32Array(pixelCount);
let head = 0;
let tail = 0;

function enqueue(index) {
  if (!candidate[index] || background[index]) return;
  background[index] = 1;
  queue[tail] = index;
  tail += 1;
}

for (let x = 0; x < width; x += 1) {
  enqueue(x);
  enqueue((height - 1) * width + x);
}

for (let y = 0; y < height; y += 1) {
  enqueue(y * width);
  enqueue(y * width + width - 1);
}

while (head < tail) {
  const index = queue[head];
  head += 1;

  const x = index % width;
  const y = Math.floor(index / width);

  if (x > 0) enqueue(index - 1);
  if (x + 1 < width) enqueue(index + 1);
  if (y > 0) enqueue(index - width);
  if (y + 1 < height) enqueue(index + width);
}

// Start from a hard connectivity mask, then feather only the outer edge.
const hardMask = Buffer.alloc(pixelCount);
for (let i = 0; i < pixelCount; i += 1) {
  hardMask[i] = background[i] ? 0 : 255;
}

const featheredMask = await sharp(hardMask, {
  raw: { width, height, channels: 1 },
})
  .blur(0.65)
  .raw()
  .toBuffer();

const rgba = Buffer.alloc(pixelCount * 4);

for (let i = 0; i < pixelCount; i += 1) {
  const src = i * channels;
  const dst = i * 4;
  const alpha = featheredMask[i] / 255;

  if (alpha <= 0.001) {
    rgba[dst] = 0;
    rgba[dst + 1] = 0;
    rgba[dst + 2] = 0;
    rgba[dst + 3] = 0;
    continue;
  }

  // Remove the original white studio matte from semi-transparent edge pixels.
  // This avoids the white fringe produced by runtime chroma-keying.
  const unmatte = (channel) =>
    Math.max(
      0,
      Math.min(255, Math.round((channel - 255 * (1 - alpha)) / alpha)),
    );

  rgba[dst] = alpha < 0.995 ? unmatte(data[src]) : data[src];
  rgba[dst + 1] = alpha < 0.995 ? unmatte(data[src + 1]) : data[src + 1];
  rgba[dst + 2] = alpha < 0.995 ? unmatte(data[src + 2]) : data[src + 2];
  rgba[dst + 3] = Math.round(alpha * 255);
}

const cutoutPath = path.join(publicReference, "amber-touch-cutout.webp");

await sharp(rgba, {
  raw: { width, height, channels: 4 },
})
  .webp({
    quality: 95,
    alphaQuality: 100,
    smartSubsample: true,
    effort: 6,
  })
  .toFile(cutoutPath);

console.log(
  "Prepared exact Amber Touch reference and offline transparent cutout:",
  cutoutPath,
);
