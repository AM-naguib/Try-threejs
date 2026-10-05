import fs from "node:fs";
import path from "node:path";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Uint32BufferAttribute,
  Scene,
  Mesh,
  MeshStandardMaterial,
  CylinderGeometry,
  Vector2,
  DoubleSide,
} from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const root = process.cwd();
const publicModels = path.join(root, "public", "models");
const publicReference = path.join(root, "public", "reference");
fs.mkdirSync(publicModels, { recursive: true });
fs.mkdirSync(publicReference, { recursive: true });

const referenceB64 = fs
  .readFileSync(path.join(root, "assets", "reference", "amber-touch-reference.webp.b64"), "utf8")
  .trim();
fs.writeFileSync(
  path.join(publicReference, "amber-touch.webp"),
  Buffer.from(referenceB64, "base64"),
);

class NodeFileReader {
  result = null;
  onload = null;
  onloadend = null;
  onerror = null;

  readAsArrayBuffer(blob) {
    blob
      .arrayBuffer()
      .then((value) => {
        this.result = value;
        this.onload?.({ target: this });
        this.onloadend?.({ target: this });
      })
      .catch((error) => this.onerror?.(error));
  }

  readAsDataURL(blob) {
    blob
      .arrayBuffer()
      .then((value) => {
        const base64 = Buffer.from(value).toString("base64");
        this.result = `data:${blob.type || "application/octet-stream"};base64,${base64}`;
        this.onload?.({ target: this });
        this.onloadend?.({ target: this });
      })
      .catch((error) => this.onerror?.(error));
  }
}

globalThis.FileReader ??= NodeFileReader;

/**
 * Geometry v2 is photo-traced from the latest supplied straight-on reference.
 * Pixel measurements below come from the 1536 x 1536 source and are normalized
 * into model space. The depth is the only inferred dimension because no side
 * photograph/CAD exists yet.
 */
const IMAGE_TOP = 120;
const IMAGE_BOTTOM = 1235;
const MODEL_TOP = 1.62;
const MODEL_BOTTOM = -0.90;
const MAX_BODY_PIXEL_WIDTH = 553;
const MAX_BODY_HALF_WIDTH = 0.625;

const xScale = MAX_BODY_HALF_WIDTH / (MAX_BODY_PIXEL_WIDTH / 2);
const yScale = (MODEL_TOP - MODEL_BOTTOM) / (IMAGE_BOTTOM - IMAGE_TOP);

function modelY(imageY) {
  return MODEL_TOP - (imageY - IMAGE_TOP) * yScale;
}

function halfWidth(pixelWidth) {
  return (pixelWidth / 2) * xScale;
}

function superellipseRing(width, depth, count = 64, power = 5.4) {
  const ring = [];
  for (let index = 0; index < count; index += 1) {
    const theta = (index / count) * Math.PI * 2;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const x = width * Math.sign(c || 1) * Math.pow(Math.abs(c), 2 / power);
    const z = depth * Math.sign(s || 1) * Math.pow(Math.abs(s), 2 / power);
    ring.push([x, z]);
  }
  return ring;
}

function loftBody(slices, count = 64, power = 5.4) {
  const positions = [];
  const indices = [];

  for (const [y, width, depth] of slices) {
    for (const [x, z] of superellipseRing(width, depth, count, power)) {
      positions.push(x, y, z);
    }
  }

  for (let slice = 0; slice < slices.length - 1; slice += 1) {
    for (let index = 0; index < count; index += 1) {
      const next = (index + 1) % count;
      const a = slice * count + index;
      const b = slice * count + next;
      const c = (slice + 1) * count + next;
      const d = (slice + 1) * count + index;
      indices.push(a, b, c, a, c, d);
    }
  }

  const bottomCenter = positions.length / 3;
  positions.push(0, slices.at(-1)[0], 0);
  const topCenter = positions.length / 3;
  positions.push(0, slices[0][0], 0);

  for (let index = 0; index < count; index += 1) {
    const next = (index + 1) % count;

    const topA = index;
    const topB = next;
    indices.push(topCenter, topB, topA);

    const bottomA = (slices.length - 1) * count + index;
    const bottomB = (slices.length - 1) * count + next;
    indices.push(bottomCenter, bottomA, bottomB);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(new Uint32BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function labelGeometry() {
  const geometry = new BufferGeometry();

  // Label border measured from the supplied reference. The top is wider than
  // the bottom exactly as it appears on the bottle.
  const topY = modelY(455);
  const bottomY = modelY(1112);
  const z = 0.244;

  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(
      [
        -0.485, topY, z,
         0.485, topY, z,
         0.415, bottomY, z,
        -0.415, bottomY, z,
      ],
      3,
    ),
  );

  // Normalized UVs from the latest 1536px reference; resolution-independent.
  const uv = [
    527 / 1536, 1 - 462 / 1536,
    956 / 1536, 1 - 447 / 1536,
    932 / 1536, 1 - 1112 / 1536,
    565 / 1536, 1 - 1112 / 1536,
  ];
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geometry.setIndex([0, 2, 1, 0, 3, 2]);
  geometry.computeVertexNormals();
  return geometry;
}

// Width profile measured directly from the product photo. It captures the
// sharp shoulder flare, long tapered body and heavy rounded base.
const bodyMeasurements = [
  [430, 276],
  [440, 366],
  [450, 438],
  [460, 501],
  [470, 545],
  [480, 553],
  [500, 551],
  [540, 546],
  [580, 540],
  [640, 530],
  [720, 518],
  [800, 504],
  [900, 487],
  [1000, 470],
  [1100, 454],
  [1180, 441],
  [1210, 430],
  [1230, 420],
];

const bodySlices = bodyMeasurements.map(([imageY, pixelWidth]) => {
  const width = halfWidth(pixelWidth);
  // Depth is inferred from common 60ml bottle proportions and follows the
  // front-width taper without exaggerating the side profile.
  const depth = 0.235 * Math.pow(width / MAX_BODY_HALF_WIDTH, 0.55);
  return [modelY(imageY), width, depth];
});

const innerSlices = bodySlices
  .filter(([y]) => y < modelY(475) && y > modelY(1190))
  .map(([y, width, depth]) => [
    y - 0.015,
    width * 0.86,
    depth * 0.72,
  ]);

// The black cap is rotationally symmetric enough for a lathe. Every radius
// below is measured from the actual front silhouette instead of artist-guessing
// stacked bands.
const capMeasurements = [
  [140, 240],
  [150, 265],
  [160, 278],
  [170, 286],
  [180, 298],
  [190, 303],
  [200, 304],
  [210, 314],
  [220, 323],
  [230, 322],
  [240, 325],
  [250, 332],
  [260, 334],
  [270, 333],
  [280, 327],
  [290, 316],
  [300, 306],
  [310, 305],
  [320, 306],
  [330, 302],
  [340, 293],
  [350, 285],
];

const capProfile = capMeasurements.map(
  ([imageY, pixelWidth]) => new Vector2(halfWidth(pixelWidth), modelY(imageY)),
);

const glassMaterial = new MeshStandardMaterial({
  name: "Glass",
  color: 0xe4ddd2,
  transparent: true,
  opacity: 0.34,
  roughness: 0.08,
  side: DoubleSide,
});
const liquidMaterial = new MeshStandardMaterial({
  name: "DarkLiquid",
  color: 0x160b05,
  transparent: true,
  opacity: 0.86,
  roughness: 0.22,
  side: DoubleSide,
});
const goldMaterial = new MeshStandardMaterial({
  name: "Gold",
  color: 0xd5a23b,
  metalness: 0.97,
  roughness: 0.11,
});
const goldTopMaterial = new MeshStandardMaterial({
  name: "GoldTop",
  color: 0xf2c55f,
  metalness: 0.99,
  roughness: 0.065,
});
const capMaterial = new MeshStandardMaterial({
  name: "BlackCap",
  color: 0x080808,
  metalness: 0.05,
  roughness: 0.38,
});
const labelMaterial = new MeshStandardMaterial({
  name: "LabelPlaceholder",
  color: 0x080808,
  roughness: 0.48,
  side: DoubleSide,
});

const scene = new Scene();
scene.name = "WAVE_Amber_Touch_60ml_v2";

function add(mesh, name) {
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

add(new Mesh(loftBody(bodySlices), glassMaterial), "Bottle_Glass");
add(new Mesh(loftBody(innerSlices), liquidMaterial), "Bottle_Liquid");

const label = new Mesh(labelGeometry(), labelMaterial);
add(label, "Label_Front");

// Gold neck and lower cap ring: dimensions taken from the reference width
// profile between y=350 and y=425.
const neckHeight = modelY(380) - modelY(425);
const neck = new Mesh(
  new CylinderGeometry(halfWidth(225), halfWidth(225), neckHeight, 72),
  goldMaterial,
);
neck.position.y = (modelY(380) + modelY(425)) / 2;
add(neck, "Neck_Gold");

const lowerRingHeight = modelY(350) - modelY(380);
const lowerRing = new Mesh(
  new CylinderGeometry(halfWidth(285), halfWidth(279), lowerRingHeight, 72),
  goldMaterial,
);
lowerRing.position.y = (modelY(350) + modelY(380)) / 2;
add(lowerRing, "Collar_Low");

const shoulderCollar = new Mesh(
  new CylinderGeometry(halfWidth(255), halfWidth(225), 0.045, 72),
  goldMaterial,
);
shoulderCollar.position.y = modelY(382);
add(shoulderCollar, "Collar_High");

add(
  new Mesh(
    new LatheGeometry(capProfile, 96),
    capMaterial,
  ),
  "Cap_Black_Rippled",
);

// Thin gold plate visible at the very top of the cap.
const topDisc = new Mesh(
  new CylinderGeometry(halfWidth(278), halfWidth(240), modelY(120) - modelY(140), 96),
  goldTopMaterial,
);
topDisc.position.y = (modelY(120) + modelY(140)) / 2;
add(topDisc, "Cap_Gold_Top");

// Gold rim immediately under the black cap.
const capRim = new Mesh(
  new CylinderGeometry(halfWidth(285), halfWidth(275), 0.045, 96),
  goldMaterial,
);
capRim.position.y = modelY(352);
add(capRim, "Cap_Gold_Rim");

scene.userData = {
  model: "WAVE Amber Touch 60ml",
  format: "GLB",
  version: 2,
  source: "latest straight-on product reference supplied by brand owner",
  geometry: "front silhouette measured from photo; depth inferred for web prototype",
  note: "GLB is the canonical web model asset for the project",
};

const exporter = new GLTFExporter();
const arrayBuffer = await new Promise((resolve, reject) => {
  exporter.parse(scene, resolve, reject, {
    binary: true,
    onlyVisible: true,
    trs: false,
  });
});

fs.writeFileSync(
  path.join(publicModels, "amber-touch.glb"),
  Buffer.from(arrayBuffer),
);

console.log("Prepared corrected v2 public/models/amber-touch.glb and reference texture");
