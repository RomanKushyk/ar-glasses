import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

let loader = new OBJLoader();

export default (ref: React.RefObject<HTMLDivElement>) => {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(300, 300);
  ref.current?.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.mouseButtons = {
	LEFT: THREE.MOUSE.ROTATE,
	MIDDLE: THREE.MOUSE.DOLLY,
	RIGHT: THREE.MOUSE.PAN
}

  //controls.update() must be called after any manual changes to the camera's transform
  camera.position.set(0, 20, 100);
  controls.update();

  loader.load("/assets/admin/face.obj", (fbx) => {
    fbx.scale.set(120, 120, 120)
    scene.add(fbx);
  });

  let light_1 = new THREE.PointLight(0xffffff, 1);

  light_1.position.set(50, 50, 50);

  scene.add(light_1);

  function animate() {
      
      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update();
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
  }

  animate();

  return renderer.domElement;
};
