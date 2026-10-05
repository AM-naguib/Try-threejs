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

const sourceMeta = await sharp(sourceBuffer).metadata();
if (!sourceMeta.width || !sourceMeta.height) {
  throw new Error("Could not read Amber Touch reference dimensions");
}

// Bottle crop bounds measured from the approved reference.
const cropRatios = {
  left: 429 / 1536,
  top: 84 / 1536,
  right: 1054 / 1536,
  bottom: 1272 / 1536,
};

const left = Math.round(sourceMeta.width * cropRatios.left);
const top = Math.round(sourceMeta.height * cropRatios.top);
const right = Math.round(sourceMeta.width * cropRatios.right);
const bottom = Math.round(sourceMeta.height * cropRatios.bottom);

const crop = {
  left,
  top,
  width: Math.max(1, Math.min(sourceMeta.width - left, right - left)),
  height: Math.max(1, Math.min(sourceMeta.height - top, bottom - top)),
};

// Outer silhouette traced from the approved transparent bottle asset.
// Keeping this as one continuous mask is intentional: transparent glass and
// bright reflections inside the bottle must never be mistaken for background.
const silhouette = [
  [215, 46],
  [169, 70],
  [141, 167],
  [152, 235],
  [172, 290],
  [199, 305],
  [200, 338],
  [50, 379],
  [35, 396],
  [101, 1109],
  [113, 1137],
  [148, 1149],
  [513, 1146],
  [534, 1134],
  [541, 1102],
  [588, 390],
  [541, 368],
  [424, 339],
  [424, 301],
  [452, 282],
  [459, 218],
  [475, 196],
  [472, 139],
  [431, 58],
  [394, 42],
  [337, 35],
].map(([x, y]) => [
  (x / 625) * crop.width,
  (y / 1188) * crop.height,
]);

const points = silhouette
  .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
  .join(" ");

const maskSvg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${crop.width}" height="${crop.height}" viewBox="0 0 ${crop.width} ${crop.height}">
    <polygon points="${points}" fill="white"/>
  </svg>
`);

const cutoutPath = path.join(publicReference, "amber-touch-cutout.png");

await sharp(sourceBuffer)
  .extract(crop)
  .ensureAlpha()
  .composite([{ input: maskSvg, blend: "dest-in" }])
  .png({
    compressionLevel: 9,
    adaptiveFiltering: true,
  })
  .toFile(cutoutPath);

console.log(
  "Prepared Amber Touch transparent PNG with a continuous silhouette mask:",
  cutoutPath,
);
