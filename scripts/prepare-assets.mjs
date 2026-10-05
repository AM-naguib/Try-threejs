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

  // Label corners traced from the supplied 1536×1536 product photo.
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(
      [
        -0.452,  0.755, 0.252,
         0.452,  0.755, 0.252,
         0.366, -0.647, 0.252,
        -0.366, -0.647, 0.252,
      ],
      3,
    ),
  );

  // UVs point directly into the real label in the supplied product photo.
  const uv = [
    536 / 1536, 1 - 451 / 1536,
    963 / 1536, 1 - 451 / 1536,
    923 / 1536, 1 - 1115 / 1536,
    577 / 1536, 1 - 1115 / 1536,
  ];
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geometry.setIndex([0, 2, 1, 0, 3, 2]);
  geometry.computeVertexNormals();
  return geometry;
}

const depthForWidth = (width) => 0.18 + 0.065 * (width / 0.585);

// Front silhouette widths below were measured row-by-row from the supplied photo.
// y=0.82 maps to image row 420; y=-0.90 maps to image row 1235.
const tracedBody = [
  [ 0.8200, 0.2380],
  [ 0.7989, 0.2920],
  [ 0.7778, 0.3872],
  [ 0.7567, 0.4633],
  [ 0.7356, 0.5300],
  [ 0.7145, 0.5765],
  [ 0.6934, 0.5850],
  [ 0.6512, 0.5829],
  [ 0.5245, 0.5744],
  [ 0.3557, 0.5607],
  [ 0.1869, 0.5480],
  [ 0.0180, 0.5332],
  [-0.1508, 0.5194],
  [-0.3196, 0.5046],
  [-0.4885, 0.4898],
  [-0.6573, 0.4771],
  [-0.7839, 0.4665],
  [-0.8261, 0.4591],
  [-0.8472, 0.4549],
  [-0.8683, 0.4443],
  [-0.8894, 0.4009],
  [-0.9000, 0.2846],
];

const bodySlices = tracedBody.map(([y, width]) => [
  y,
  width,
  depthForWidth(width),
]);

const innerSlices = bodySlices
  .filter(([y]) => y <= 0.70)
  .map(([y, width, depth]) => [y + 0.018, width * 0.865, depth * 0.73]);

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

// Internal base slab adds the heavy-glass look without changing the traced outer silhouette.
const foot = new Mesh(new BoxGeometry(0.70, 0.075, 0.31), glassMaterial);
foot.position.y = -0.815;
add(foot, "Bottle_Foot");

const label = new Mesh(labelGeometry(), labelMaterial);
add(label, "Label_Front");

// Gold neck/collar silhouette traced from image rows 420→345.
const neckProfile = [
  [0.2380, 0.840],
  [0.2380, 0.895],
  [0.2700, 0.950],
  [0.2980, 1.050],
  [0.3060, 1.100],
].map(([radius, y]) => new Vector2(radius, y));
add(new Mesh(new LatheGeometry(neckProfile, 72), goldMaterial), "Neck_Gold");

// Black cap radii are directly normalized from rows 345→145 of the supplied photo.
const capProfile = [
  [0.3634, 1.1000],
  [0.3735, 1.1275],
  [0.3848, 1.1687],
  [0.3835, 1.2100],
  [0.3974, 1.2512],
  [0.4162, 1.2925],
  [0.4200, 1.3337],
  [0.4137, 1.3750],
  [0.4049, 1.4162],
  [0.4024, 1.4575],
  [0.3823, 1.4987],
  [0.3785, 1.5400],
  [0.3596, 1.5812],
  [0.3420, 1.6225],
  [0.3207, 1.6500],
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
  geometry: "front body/cap silhouette and label UVs measured from the 1536px reference; depth inferred for web prototype",
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
