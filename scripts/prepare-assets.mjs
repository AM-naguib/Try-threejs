import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicReference = path.join(root, "public", "reference");
fs.mkdirSync(publicReference, { recursive: true });

const sourcePath = path.join(
  root,
  "assets",
  "reference",
  "amber-touch-reference.webp.b64",
);

const referenceB64 = fs.readFileSync(sourcePath, "utf8").trim();
const outputPath = path.join(publicReference, "amber-touch.webp");

fs.writeFileSync(outputPath, Buffer.from(referenceB64, "base64"));

console.log(
  "Prepared exact supplied Amber Touch front reference at public/reference/amber-touch.webp",
);
