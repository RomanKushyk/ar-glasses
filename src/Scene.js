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
      45,
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
    console.log("Started!");
  }

  async setUpGlass() {
    this.glass = await this.loadGlass();

    this.glass.getObjectByName("User_Layer_01").children.forEach((child) => {
      child.material.visible = false;
    });

    this.scene.add(this.glass);
  }

  target_points = {
    top: [],
    left: [],
    right: [],
    bottom: [],
  };

  normalize = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };

  normalize_vec(vec) {
    let scale;

    if (this.videoWidth / this.videoHeight > this.width / this.height) {
      scale = this.height / this.videoHeight;
    } else {
      scale = this.width / this.videoWidth;
    }

    let scaled_video_width = this.videoWidth * scale;
    let scaled_video_height = this.videoHeight * scale;

    vec[0] *= scale;
    vec[1] *= scale;

    vec[0] += (this.width - scaled_video_width) / 2;
    vec[1] += (this.height - scaled_video_height) / 2;

    vec[0] = this.normalize(
      (vec[0] / this.width) * 2 - 1,
      -1,
      1,
      -this.viewSize.width / 2,
      this.viewSize.width / 2
    );
    vec[1] = this.normalize(
      -(vec[1] / this.height) * 2 + 1,
      -1,
      1,
      -this.viewSize.height / 2,
      this.viewSize.height / 2
    );

    vec[2] = -vec[2] / (this.camera.position.z / 4);

    return vec;
  }

  drawGlass(predictions) {
    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        // console.log(prediction)
        this.target_points.top = prediction.annotations.midwayBetweenEyes[0];
        this.target_points.bottom = prediction.annotations.noseBottom[0];
        this.target_points.left = this.normalize_vec(
          prediction.annotations.leftEyeLower0[0]
        );
        this.target_points.right = this.normalize_vec(
          prediction.annotations.rightEyeLower0[0]
        );

        this.target_points.center_x = this.normalize_vec(
          prediction.annotations.noseTip[0]
        );

        let gide_line_x = new THREE.Vector3(
          this.target_points.right[0] - this.target_points.left[0],
          this.target_points.left[1] - this.target_points.right[1],
          this.target_points.left[2] - this.target_points.right[2]
        )
          .normalize()
          .multiplyScalar(10);

        let gide_line_y = new THREE.Vector3(
          this.target_points.top[0] - this.target_points.bottom[0],
          this.target_points.top[1] - this.target_points.bottom[1],
          this.target_points.top[2] - this.target_points.bottom[2]
        )
          .normalize()
          .multiplyScalar(100000);

        let axis_y = new Vector3(0, 1, 0);
        let gide_line_y_z = new Vector3(0, gide_line_y.y, gide_line_y.z);
        let x_rotation =
          -(this.target_points.top[2] > this.target_points.bottom[2] ? 1 : -1) *
            (Math.PI - gide_line_y_z.angleTo(axis_y)) +
          Math.PI * 0.5;
        this.glass.rotation.x += (x_rotation - this.glass.rotation.x) / 4;

        let axis_z = new Vector3(0, 0, 1);
        let gide_line_z_x = new Vector3(gide_line_x.x, 0, gide_line_x.z);
        let y_rotation = gide_line_z_x.angleTo(axis_z) - Math.PI / 1.9;
        this.glass.rotation.z +=
          (y_rotation + Math.PI - this.glass.rotation.z) / 4;

        let axis_x = new Vector3(1, 0, 0);
        let gide_line_x_y = new Vector3(gide_line_x.x, gide_line_x.y, 0);
        let z_rotation =
          -(this.target_points.left[1] > this.target_points.right[1] ? -1 : 1) *
          (Math.PI - gide_line_x_y.angleTo(axis_x)) + Math.PI;

        this.glass.rotation.y += (z_rotation - this.glass.rotation.y) / 4;

        let scale =
          new THREE.Vector3()
            .copy(new Vector3(...this.target_points.left))
            .sub(new Vector3(...this.target_points.right))
            .length() / 15;
        let center = new THREE.Vector3()
          .copy(new Vector3(...this.target_points.left))
          .add(new Vector3(...this.target_points.right))
          .multiplyScalar(0.5);
        this.glass.position.copy(center);
        this.glass.translateY(4 + 3 * (this.width / this.height));
        this.glass.translateZ(-(2 + 0.5 * (this.width / this.height)));
        this.glass.scale.set(scale, scale, scale);
      });
    }
  }

  drawScene(predictions) {
    if (!this.ready) {
      return;
    }
    this.drawGlass(predictions);
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
