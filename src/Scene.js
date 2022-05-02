import * as THREE from "three";
import { Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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

  setUp(parent, video) {
    this.video = video;
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
    
    this.canvas = this.renderer.domElement;
    
    parent.appendChild(this.canvas);
    
    this.setUpGlass().then(async () => {
      await this.setUpHead();

      this.ready = true;
    });
    
    this.created = true;
  }

  async setUpGlass() {
    this.glass = await this.loadGlass();

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

  gide_lines = {
    x: new THREE.Vector3(),
    y: new THREE.Vector3(),
    z_x: new THREE.Vector3(),
    y_z: new THREE.Vector3(),
    x_y: new THREE.Vector3(),
  };

  drawGlass() {
    this.gide_lines.x
      .copy(this.target_points.left)
      .sub(this.target_points.right)
      .normalize()
      .multiplyScalar(10);

    this.gide_lines.y
      .copy(this.target_points.top)
      .sub(this.target_points.bottom)
      .normalize()
      .multiplyScalar(100000);

    this.gide_lines.z_x.x = this.gide_lines.x.x;
    this.gide_lines.z_x.y = 0;
    this.gide_lines.z_x.z = this.gide_lines.x.z;
    this.glass_wrapper.rotation.z =
      this.gide_lines.z_x.angleTo(this.axis.z) - Math.PI / 1.9;

    this.gide_lines.y_z.x = 0;
    this.gide_lines.y_z.y = this.gide_lines.y.y;
    this.gide_lines.y_z.z = this.gide_lines.y.z;
    this.glass_wrapper.rotation.x =
      -(this.target_points.top.z > this.target_points.bottom.z ? 1 : -1) *
        -this.gide_lines.y_z.angleTo(this.axis.y) +
      Math.PI * 0.5;

    this.gide_lines.x_y.x = this.gide_lines.x.x;
    this.gide_lines.x_y.y = this.gide_lines.x.y;
    this.gide_lines.x_y.z = 0;
    this.glass_wrapper.rotation.y =
      (this.target_points.left.y > this.target_points.right.y ? 1 : -1) *
        this.gide_lines.x_y.angleTo(this.axis.x) +
      Math.PI;

    let left_for_scale = this.normalize_vec(this.target_points.left);
    let right_for_scale = this.normalize_vec(this.target_points.right);
    left_for_scale.z = 0;
    right_for_scale.z = 0;
    let scale =
      new THREE.Vector3().copy(left_for_scale).sub(right_for_scale).length() /
      15;
    this.glass_wrapper.scale.set(scale, scale, scale);

    let center = this.target_points.center_x;
    this.glass_wrapper.position.copy(center);
  }

  async setUpHead() {
    const loader = new GLTFLoader();
    const model = await loader.loadAsync("./assets/head.glb");

    this.head = model.scene.children[0];

    const texture = new THREE.VideoTexture(this.video);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        txt: texture,
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_PointSize = 8.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D txt;
        void main() {
          vec4 color = texture2D(txt, vUv);
          gl_FragColor = color;
        }
      `,
    });

    this.head.material = material;

    this.head.scale.set(2.1, 2, 2);
    this.head.rotateX(-Math.PI / 2 - Math.PI / 24);
    this.head.rotateY(Math.PI);

    this.head.translateX(0.5);
    this.head.translateZ(3.5);
    // this.head.translateY(-30);

    this.glass.add(this.head);
  }

  drawScene(predictions) {
    if (!this.ready || !predictions.length) {
      return;
    }
    this.renderer.render(this.scene, this.camera);

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
