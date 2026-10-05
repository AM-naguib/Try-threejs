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
  BoxGeometry,
  LatheGeometry,
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

function superellipseRing(width, depth, count = 48, power = 4.8) {
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

function loftBody(slices, count = 48, power = 4.8) {
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
  positions.push(0, slices[0][0], 0);
  const topCenter = positions.length / 3;
  positions.push(0, slices.at(-1)[0], 0);

  for (let index = 0; index < count; index += 1) {
    const next = (index + 1) % count;
    indices.push(bottomCenter, next, index);

    const a = (slices.length - 1) * count + index;
    const b = (slices.length - 1) * count + next;
    indices.push(topCenter, a, b);
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

  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(
      [
        -0.455, 0.50, 0.252,
         0.455, 0.50, 0.252,
         0.395,-0.66, 0.252,
        -0.395,-0.66, 0.252,
      ],
      3,
    ),
  );

  // Exact UV window of the real label inside the 1280x1280 supplied photo.
  const uv = [
    429 / 1280, 1 - 382 / 1280,
    780 / 1280, 1 - 380 / 1280,
    753 / 1280, 1 - 910 / 1280,
    461 / 1280, 1 - 910 / 1280,
  ];
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geometry.setIndex([0, 2, 1, 0, 3, 2]);
  geometry.computeVertexNormals();
  return geometry;
}

const bodySlices = [
  [-0.90, 0.465, 0.205],
  [-0.86, 0.515, 0.220],
  [-0.78, 0.535, 0.225],
  [-0.58, 0.545, 0.232],
  [-0.20, 0.560, 0.238],
  [ 0.20, 0.575, 0.243],
  [ 0.40, 0.585, 0.245],
  [ 0.50, 0.555, 0.238],
  [ 0.58, 0.455, 0.220],
  [ 0.66, 0.335, 0.195],
  [ 0.72, 0.265, 0.170],
  [ 0.82, 0.245, 0.160],
];

const innerSlices = bodySlices
  .slice(0, -2)
  .map(([y, width, depth]) => [y + 0.015, width * 0.865, depth * 0.74]);

const glassMaterial = new MeshStandardMaterial({
  name: "Glass",
  color: 0xded8ce,
  transparent: true,
  opacity: 0.32,
  roughness: 0.09,
  side: DoubleSide,
});
const liquidMaterial = new MeshStandardMaterial({
  name: "DarkLiquid",
  color: 0x180c05,
  transparent: true,
  opacity: 0.86,
  roughness: 0.22,
  side: DoubleSide,
});
const goldMaterial = new MeshStandardMaterial({
  name: "Gold",
  color: 0xd5a23b,
  metalness: 0.97,
  roughness: 0.12,
});
const goldTopMaterial = new MeshStandardMaterial({
  name: "GoldTop",
  color: 0xf2c55f,
  metalness: 0.99,
  roughness: 0.07,
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
scene.name = "WAVE_Amber_Touch_60ml";

function add(mesh, name) {
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

add(new Mesh(loftBody(bodySlices), glassMaterial), "Bottle_Glass");
add(new Mesh(loftBody(innerSlices), liquidMaterial), "Bottle_Liquid");

const foot = new Mesh(new BoxGeometry(0.96, 0.12, 0.39), glassMaterial);
foot.position.y = -0.845;
add(foot, "Bottle_Foot");

const label = new Mesh(labelGeometry(), labelMaterial);
add(label, "Label_Front");

const neck = new Mesh(new CylinderGeometry(0.245, 0.245, 0.22, 64), goldMaterial);
neck.position.y = 0.91;
add(neck, "Neck_Gold");

const collarLow = new Mesh(new CylinderGeometry(0.305, 0.305, 0.055, 64), goldMaterial);
collarLow.position.y = 1.035;
add(collarLow, "Collar_Low");

const collarHigh = new Mesh(new CylinderGeometry(0.325, 0.325, 0.045, 64), goldMaterial);
collarHigh.position.y = 1.085;
add(collarHigh, "Collar_High");

const capProfile = [
  [0.305, 1.105],
  [0.345, 1.120],
  [0.375, 1.160],
  [0.395, 1.205],
  [0.400, 1.260],
  [0.382, 1.305],
  [0.414, 1.350],
  [0.422, 1.405],
  [0.405, 1.465],
  [0.374, 1.505],
  [0.390, 1.550],
  [0.382, 1.595],
  [0.345, 1.635],
  [0.315, 1.650],
].map(([radius, y]) => new Vector2(radius, y));

add(new Mesh(new LatheGeometry(capProfile, 72), capMaterial), "Cap_Black_Rippled");

const capRim = new Mesh(new CylinderGeometry(0.315, 0.315, 0.045, 72), goldMaterial);
capRim.position.y = 1.68;
add(capRim, "Cap_Gold_Rim");

const capTop = new Mesh(new CylinderGeometry(0.285, 0.285, 0.018, 72), goldTopMaterial);
capTop.position.y = 1.712;
add(capTop, "Cap_Gold_Top");

scene.userData = {
  model: "WAVE Amber Touch 60ml",
  format: "GLB",
  source: "front reference supplied by brand owner",
  geometry: "front silhouette traced from reference; depth inferred for web prototype",
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

console.log("Prepared public/models/amber-touch.glb and public/reference/amber-touch.webp");
