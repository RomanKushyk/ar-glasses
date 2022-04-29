import * as THREE from "three";
import { Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";

import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";

export default class Scene {
  created = false;
  ready = false;

  constructor() {}

  setUpSize(width, height, videoWidth, videoHeight) {
    this.width = width;
    this.height = height;
    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
  }

  async loadGlass() {
    const fbxLoader = new FBXLoader();
    const model = await fbxLoader.loadAsync(
      "assets/Glasses/01/01%20-%20Model.fbx"
    );

    return model;
  }

  setUp(parent) {
    this.camera = new THREE.PerspectiveCamera(
      1,
      this.width / this.height,
      0.01,
      500
    );
    this.camera.position.z = 40;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });

    this.canvas = this.renderer.domElement;

    parent.appendChild(this.canvas);

    this.setUpGlass().then(() => {
      this.ready = true;
    });

    this.created = true;
  }

  async setUpGlass() {
    this.glass = await this.loadGlass();

    this.glass.getObjectByName("User_Layer_01").children.forEach((child) => {
      child.material.visible = false;
    });

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0,
    });
    this.glass_wrapper = new THREE.Mesh(geometry, material);

    this.glass.position.y = 13;
    this.glass.position.z = -4.5;
    this.glass.position.x = -0.7;
    this.glass.scale.set(0.8, 0.8, 0.8);
    this.scene.add(this.glass_wrapper);
    this.glass_wrapper.add(this.glass);
  }

  target_points = {
    top: {
      x: 0,
      y: 0,
      z: 0,
    },
    left: {
      x: 0,
      y: 0,
      z: 0,
    },
    right: {
      x: 0,
      y: 0,
      z: 0,
    },
    bottom: {
      x: 0,
      y: 0,
      z: 0,
    },
  };

  normalize = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };

  normalize_vec(vec) {
    let scale;
    let _vec = new THREE.Vector3(vec.x, vec.y, vec.z);

    if (this.videoWidth / this.videoHeight > this.width / this.height) {
      scale = this.height / this.videoHeight;
    } else {
      scale = this.width / this.videoWidth;
    }

    let scaled_video_width = this.videoWidth * scale;
    let scaled_video_height = this.videoHeight * scale;

    _vec.x *= scale;
    _vec.y *= scale;

    _vec.x += (this.width - scaled_video_width) / 2;
    _vec.y += (this.height - scaled_video_height) / 2;

    _vec.x = this.normalize(
      (_vec.x / this.width) * 2 - 1,
      -1,
      1,
      -this.viewSize.width / 2,
      this.viewSize.width / 2
    );
    _vec.y = this.normalize(
      -(_vec.y / this.height) * 2 + 1,
      -1,
      1,
      -this.viewSize.height / 2,
      this.viewSize.height / 2
    );

    _vec.z = -_vec.z / (this.camera.position.z / 4);

    return _vec;
  }

  axis = {
    x: new Vector3(1, 0, 0),
    y: new Vector3(0, 1, 0),
    z: new Vector3(0, 0, 1),
  };

  drawGlass() {
    let gide_line_x = new THREE.Vector3()
      .copy(this.target_points.left)
      .sub(this.target_points.right)
      .normalize()
      .multiplyScalar(10);

    let gide_line_y = new THREE.Vector3()
      .copy(this.target_points.top)
      .sub(this.target_points.bottom)
      .normalize()
      .multiplyScalar(100000);

    let gide_line_z_x = new Vector3(gide_line_x.x, 0, gide_line_x.z);
    let y_rotation = gide_line_z_x.angleTo(this.axis.z) - Math.PI / 1.9;
    this.glass_wrapper.rotation.z = y_rotation;
    
    let gide_line_y_z = new Vector3(0, gide_line_y.y, gide_line_y.z);
    let x_rotation =
      -(this.target_points.top.z > this.target_points.bottom.z ? 1 : -1) *
        -gide_line_y_z.angleTo(this.axis.y) +
      Math.PI * 0.5;
    this.glass_wrapper.rotation.x = x_rotation;

    let gide_line_x_y = new Vector3(gide_line_x.x, gide_line_x.y, 0);
    let z_rotation =
      (this.target_points.left.y > this.target_points.right.y ? 1 : -1) *
        gide_line_x_y.angleTo(this.axis.x) +
      Math.PI;

    this.glass_wrapper.rotation.y = z_rotation;

    let left_for_scale = this.normalize_vec(this.target_points.left);
    let right_for_scale = this.normalize_vec(this.target_points.right);
    left_for_scale.z = 0;
    right_for_scale.z = 0;
    let scale =
      new THREE.Vector3().copy(left_for_scale).sub(right_for_scale).length() /
      15;

    let center = this.target_points.center_x;
    this.glass_wrapper.position.copy(center);
    this.glass_wrapper.scale.set(scale, scale, scale);
  }

  drawScene(predictions) {
    if (!this.ready || !predictions.length) {
      return;
    }

    this.target_points.top = predictions[0].keypoints[168];
    this.target_points.bottom = predictions[0].keypoints[164];
    this.target_points.left = predictions[0].keypoints[130];
    this.target_points.right = predictions[0].keypoints[359];

    this.target_points.center_x = this.normalize_vec(
      predictions[0].keypoints[168]
    );
    this.drawGlass();
  }

  get viewSize() {
    let distance = this.camera.position.z;
    let vFov = (this.camera.fov * Math.PI) / 180;
    let height;
    let width;

    height = 2 * Math.tan(vFov / 2) * distance;
    width = height * (this.width / this.height);
    return { width, height, vFov };
  }
}
