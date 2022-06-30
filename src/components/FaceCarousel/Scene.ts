import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

let loader = new OBJLoader();

export class SampleFaceScene {
  private width: number | undefined;
  private height: number | undefined;
  private videoWidth: number | undefined;
  private videoHeight: number | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private scene: THREE.Scene | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private controls: OrbitControls | undefined;
  private light1: THREE.PointLight | undefined;
  private light2: THREE.PointLight | undefined;

  private loader: OBJLoader = new OBJLoader();

  setUpSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setUpScene(parent: HTMLElement) {
    if (!this.width || !this.height) return;

    this.camera = new THREE.PerspectiveCamera(
      1,
      this.width / this.height,
      0.01,
      500
    );
    this.camera.position.set(0, 20, 100);

    this.light1 = new THREE.PointLight(0xfcbfa9, 1);
    this.light1.position.set(50, 50, 50);
    this.scene?.add(this.light1);

    this.light2 = new THREE.PointLight(0xfce6a9, 1);
    this.light2.position.set(-50, 50, 50);
    this.scene?.add(this.light2);

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);

    parent.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    this.controls.update();

    this.loader.load("/assets/admin/face.obj", (model) => {
      model.scale.set(120, 120, 120);
      this.scene?.add(model);
    });
  }

  draw() {
    if (!this.controls || !this.renderer || !this.scene || !this.camera) return;
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.draw);
  }

  get DomElement() {
    return this.renderer?.domElement;
  }
}

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
    RIGHT: THREE.MOUSE.PAN,
  };

  //controls.update() must be called after any manual changes to the camera's transform
  camera.position.set(0, 20, 100);
  controls.update();

  loader.load("/assets/admin/face.obj", (fbx) => {
    fbx.scale.set(120, 120, 120);
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
