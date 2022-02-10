import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();
// Helpers

const radians = (degrees) => {
  return (degrees * Math.PI) / 180;
};

const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const map = (value, start1, stop1, start2, stop2) => {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

function getRandomGeometry() {
  return geometries[Math.floor(Math.random() * Math.floor(geometries.length))];
}

function getMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
// Grid Elements

class Box {
  constructor() {
    this.geom = new THREE.BoxBufferGeometry(1, 1, 1);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
  }
}

class Cone {
  constructor() {
    this.geom = new THREE.ConeBufferGeometry(0.3, 0.5, 32);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = radians(-180);
  }
}

class Tourus {
  constructor() {
    this.geom = new THREE.TorusBufferGeometry(0.3, 0.12, 30, 200);
    this.rotationX = radians(90);
    this.rotationY = 0;
    this.rotationZ = 0;
  }
}
// setup

const raycaster = new THREE.Raycaster();
const gutter = { size: 1 };
const meshes = [];
const grid = { cols: 14, rows: 6 };
const mouse3D = new THREE.Vector2();
const geometries = [new Box(), new Tourus(), new Cone()];

window.addEventListener(
  "mousemove",
  (e) => {
    mouse3D.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse3D.y = -(e.clientY / window.innerHeight) * 2 + 1;
  },
  { passive: true }
);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects


// Materials
const groupMesh = new THREE.Object3D();
const meshParams = {
  color: "#ff00ff",
  metalness: 0.58,
  emissive: "#000000",
  roughness: 0.18,
};

const material = new THREE.MeshPhysicalMaterial(meshParams);

for (let row = 0; row < grid.rows; row++) {
  meshes[row] = [];

  for (let col = 0; col < grid.columns; col++) {
    const geometry = getRandomGeometry();
    const mesh = getMesh(geometry.geom, material);
    mesh.position.set(col + col * gutter.size, 0, row + row * gutter.size);
    mesh.rotation.x = geometry.rotationX;
    mesh.rotation.y = geometry.rotationY;
    mesh.rotation.z = geometry.rotationZ;

    // store the initial rotation values of each element so we can animate back
    mesh.initialRotation = {
      x: mesh.rotation.x,
      y: mesh.rotation.y,
      z: mesh.rotation.z,
    };

    groupMesh.add(mesh);
    mesh[row][col] = mesh;
  }
}

const centerX = (grid.cols - 1 + (grid.cols - 1) * gutter.size) * 0.5;
const centerZ = (grid.rows - 1 + (grid.rows - 1) * gutter.size) * 0.5;

groupMesh.position.set(centerX, 0, -centerZ);
scene.add(groupMesh);

// Mesh

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 1);
camera.position.x = 0;
camera.position.y = 65;
camera.position.z = 0;
camera.rotation.x = -1.57;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
