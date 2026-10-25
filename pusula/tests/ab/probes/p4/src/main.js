import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("view") });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 2, 5);
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));

const loader = new GLTFLoader();
let current = null;

export function swapModel(url) {
  return loader.loadAsync(url).then((gltf) => {
    if (current) scene.remove(current);
    current = gltf.scene;
    scene.add(current);
  });
}

swapModel("models/unit.glb");
renderer.setAnimationLoop(() => renderer.render(scene, camera));
