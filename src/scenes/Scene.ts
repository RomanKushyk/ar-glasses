import * as THREE from "three";
import { Mesh, Vector3 } from "three";
import { GlassesController } from "../controllers/GlassesController";
import { Glasses } from "../interfaces/consts/Glasses";
import { Face, Keypoint } from "@tensorflow-models/face-detection";
import { StoreWithActiveGlasses } from "../interfaces/services/store/StoreWithActiveGlasses";
import store from "../services/store/app/store";

interface TargetPoints {
  top: Keypoint;
  left: Keypoint;
  right: Keypoint;
  bottom: Keypoint;
  center_x: THREE.Vector3 | undefined;
}

export default class Scene {
  private width: number | undefined;
  private height: number | undefined;
  private videoWidth: number | undefined;
  private videoHeight: number | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private scene: THREE.Scene | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private head_wrapper:
    | THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>
    | undefined;
  private glasses_wrapper: THREE.Object3D<THREE.Event> | undefined;
  private glasses_state: Glasses | undefined;
  private glasses: THREE.Object3D<THREE.Event> | undefined;
  private video_material: THREE.ShaderMaterial | undefined;
  private video_texture: THREE.VideoTexture | THREE.CanvasTexture | undefined;
  private head:
    | THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
    | undefined;
  private store: StoreWithActiveGlasses | undefined;
  private cutPlane:
    | THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
    | undefined;
  private headGridInitialized: boolean = false;
  private pointsMaterial: THREE.PointsMaterial | undefined;
  private clock: THREE.Clock | undefined;

  video: HTMLVideoElement | HTMLCanvasElement | undefined;
  canvas: HTMLCanvasElement | undefined;
  created = false;
  ready = false;

  setUpSize(
    width: number,
    height: number,
    videoWidth: number,
    videoHeight: number
  ) {
    this.width = width;
    this.height = height;
    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
  }

  glasses_controller = new GlassesController();

  setUpScene(
    parent: HTMLElement,
    video: HTMLVideoElement | HTMLCanvasElement,
    store: StoreWithActiveGlasses
  ) {
    if (!this.width || !this.height) return;

    this.video = video;
    this.camera = new THREE.PerspectiveCamera(
      1,
      this.width / this.height,
      0.01,
      500
    );
    this.camera.position.z = 40;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(this.width, this.height);

    this.canvas = this.renderer.domElement;

    parent.appendChild(this.canvas);
    this.created = true;

    this.store = store;

    let initialInstallationOfModels = async () => {
      this.setUpVideoMaterial();
      this.setUpHeadWrapper();
      await this.setUpHead();

      this.ready = true;
    };

    initialInstallationOfModels();
  }

  private setUpHeadWrapper() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0,
    });

    this.head_wrapper = new THREE.Mesh(geometry, material);

    if (!this.scene) return;

    this.scene.add(this.head_wrapper);

    this.glasses_wrapper = new THREE.Object3D();
    this.head_wrapper.add(this.glasses_wrapper);
  }

  private async updateGlasses(id: number | string) {
    if (!this.glasses_wrapper) return;

    this.glasses_controller.active_glass_id = id;

    if (
      this.glasses_controller.active_glass &&
      !this.glasses_controller.active_glass.loaded
    )
      await this.glasses_controller.glasses_loading_promise;

    this.glasses_wrapper.children.forEach((glasses) => {
      glasses.visible = false;
    });

    this.glasses_wrapper.traverse((element) => {
      if (element instanceof THREE.Mesh && element.material) {
        if (element.material.length) {
          for (let i = 0; i < element.material.length; ++i) {
            element.material[i].dispose();
          }
        } else {
          element.material.dispose();
        }
      }
      if (element instanceof THREE.Mesh && element.geometry)
        element.geometry.dispose();
    });

    if (!this.renderer) return;
    this.renderer.renderLists.dispose();

    this.glasses_state = this.glasses_controller.active_glass;

    let compute_glasses_name = (id: string | number) => "glasses_" + id;

    if (!this.glasses_state || !this.glasses_state.model) return;
    if (
      !this.glasses_wrapper.getObjectByName(
        compute_glasses_name(this.glasses_state.id)
      )
    ) {
      this.glasses = this.glasses_state.model;
      this.glasses
        .getObjectByName(this.glasses_state.glass_group.name)
        ?.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.material) {
            obj.material.opacity = 0.5;
          }
        });

      this.glasses.position.set(...this.glasses_state.options.position);
      this.glasses.scale.set(...this.glasses_state.options.scale);
      this.glasses.rotation.set(...this.glasses_state.options.rotation);
      this.glasses.name = compute_glasses_name(this.glasses_state.id);
      this.glasses_wrapper.add(this.glasses);
    } else {
      this.glasses = this.glasses_wrapper.getObjectByName(
        compute_glasses_name(this.glasses_state.id)
      );

      const glasses = this.glasses_wrapper.getObjectByName(
        compute_glasses_name(this.glasses_state.id)
      );

      if (glasses) {
        glasses.visible = true;
      }
    }
  }

  private target_points: TargetPoints = {
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
    center_x: undefined,
  };

  private normalize = (
    num: number,
    in_min: number,
    in_max: number,
    out_min: number,
    out_max: number
  ) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };

  private normalize_vec(vec: Keypoint) {
    if (
      !this.videoWidth ||
      !this.videoHeight ||
      !this.width ||
      !this.height ||
      !this.camera ||
      !this.viewSize
    )
      return;

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

  private axis: {
    x: THREE.Vector3;
    y: THREE.Vector3;
    z: THREE.Vector3;
  } = {
    x: new Vector3(1, 0, 0),
    y: new Vector3(0, 1, 0),
    z: new Vector3(0, 0, 1),
  };

  private gide_lines: {
    x: THREE.Vector3;
    y: THREE.Vector3;
    z_x: THREE.Vector3;
    y_z: THREE.Vector3;
    x_y: THREE.Vector3;
  } = {
    x: new THREE.Vector3(),
    y: new THREE.Vector3(),
    z_x: new THREE.Vector3(),
    y_z: new THREE.Vector3(),
    x_y: new THREE.Vector3(),
  };

  private drawGlass() {
    if (
      !this.head_wrapper ||
      !this.target_points.top.z ||
      !this.target_points.bottom.z
    )
      return;

    this.gide_lines.x
      .copy(this.target_points.left as THREE.Vector3)
      .sub(this.target_points.right as THREE.Vector3)
      .normalize()
      .multiplyScalar(10);

    this.gide_lines.y
      .copy(this.target_points.top as THREE.Vector3)
      .sub(this.target_points.bottom as THREE.Vector3)
      .normalize()
      .multiplyScalar(100000);

    this.gide_lines.z_x.x = this.gide_lines.x.x;
    this.gide_lines.z_x.y = 0;
    this.gide_lines.z_x.z = this.gide_lines.x.z;
    this.head_wrapper.rotation.z =
      this.gide_lines.z_x.angleTo(this.axis.z) - Math.PI / 1.9;

    this.gide_lines.y_z.x = 0;
    this.gide_lines.y_z.y = this.gide_lines.y.y;
    this.gide_lines.y_z.z = this.gide_lines.y.z;
    this.head_wrapper.rotation.x =
      -(this.target_points.top.z > this.target_points.bottom.z ? 1 : -1) *
        -this.gide_lines.y_z.angleTo(this.axis.y) +
      Math.PI * 0.5;

    this.gide_lines.x_y.x = this.gide_lines.x.x;
    this.gide_lines.x_y.y = this.gide_lines.x.y;
    this.gide_lines.x_y.z = 0;
    this.head_wrapper.rotation.y =
      (this.target_points.left.y > this.target_points.right.y ? 1 : -1) *
        this.gide_lines.x_y.angleTo(this.axis.x) +
      Math.PI;

    let left_for_scale = this.normalize_vec(this.target_points.left);
    let right_for_scale = this.normalize_vec(this.target_points.right);

    if (!left_for_scale || !right_for_scale) return;

    left_for_scale.z = 0;
    right_for_scale.z = 0;

    let scale =
      new THREE.Vector3().copy(left_for_scale).sub(right_for_scale).length() /
      15;

    this.head_wrapper.scale.set(scale, scale, scale);

    if (!this.target_points.center_x) return;

    let center = this.target_points.center_x;
    this.head_wrapper.position.copy(center);
  }

  private setUpVideoMaterial() {
    if (!this.video) return;

    if (this.video instanceof HTMLVideoElement)
      this.video_texture = new THREE.VideoTexture(this.video);
    if (this.video instanceof HTMLCanvasElement)
      this.video_texture = new THREE.CanvasTexture(this.video);
    this.video_material = new THREE.ShaderMaterial({
      uniforms: {
        // @ts-ignore
        txt: this.video_texture,
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
          vec4 helper = mix(vec4(1., 1., 1., 1.), color, 0.5);
          gl_FragColor = color;
        }
      `,
    });
  }

  private async setUpHead() {
    if (!this.video_material || !this.head_wrapper) return;
    this.cutPlane = new Mesh(
      new THREE.PlaneGeometry(50, 50),
      this.video_material
    );

    this.cutPlane.scale.set(2, 2, 2.2);
    this.cutPlane.rotateX(-Math.PI / 2 - Math.PI / 24);
    this.cutPlane.rotateY(Math.PI);

    this.cutPlane.position.z = -100;

    this.clock = new THREE.Clock();
    this.pointsMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.4,
      alphaTest: 0.5,
    });

    const pointsGeometry = new THREE.BufferGeometry().setFromPoints([]);

    this.head = new THREE.Points(pointsGeometry, this.pointsMaterial);

    this.head.name = "head grid";

    this.scene?.add(this.head);
    this.head_wrapper.add(this.cutPlane);
  }

  drawScene(predictions: Face[]) {
    if (!this.store) return;

    if (
      this.store.glasses.active_glasses &&
      this.store.glasses.active_glasses !== this.glasses_state?.id
    ) {
      this.updateGlasses(this.store.glasses.active_glasses);
    }

    if (
      !this.ready ||
      !predictions.length ||
      !this.renderer ||
      !this.scene ||
      !this.camera
    )
      return;

    this.renderer.render(this.scene, this.camera);

    let keypoints = predictions[0].keypoints;

    if (!this.headGridInitialized) {
      if (
        Number.isNaN(store.facetype.type) &&
        !document.location.href.includes("admin")
      ) {
        this.updateHead(predictions);
        this.updateHeadGridColor(predictions);
      } else {
        if (this.head?.name && this.cutPlane) {
          const head = this.scene.getObjectByName(this.head?.name);

          if (head) {
            this.scene.remove(head);
            this.cutPlane.position.z = -20;
            this.headGridInitialized = true;
          }
        }
      }
    }

    this.target_points.top = keypoints[168];
    this.target_points.bottom = keypoints[164];
    this.target_points.left = keypoints[130];
    this.target_points.right = keypoints[359];

    this.target_points.center_x = this.normalize_vec(keypoints[168]);

    this.drawGlass();
  }

  updateHead(predictions: Face[]) {
    if (!this.head) return;

    let points: Vector3[] = [];

    predictions[0].keypoints.forEach((p: Keypoint) => {
      points.push(this.normalize_vec(p) as Vector3);
    });

    this.head.geometry.setFromPoints(points);
  }

  updateHeadGridColor(predictions: Face[]) {
    if (!this.head) return;

    const particles = predictions[0].keypoints.length;
    const waveSize = 0.04;
    const waveSpeed = 8;
    const colors = [];

    const color = new THREE.Color();

    if (!this.clock) return;
    const elapsedTime = this.clock?.getElapsedTime();

    for (let i = 0; i < particles; i++) {
      const y = predictions[0].keypoints[i].y;

      let vx = 0;
      let vy = Math.sin(-y * waveSize + elapsedTime * waveSpeed);
      let vz = 0;

      if (vy < 0.5) {
        vx = 1;
        vy = 1;
        vz = 1;
      }

      color.setRGB(vx, vy, vz);
      colors.push(color.r, color.g, color.b);
    }

    this.head.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
  }

  updateModelPositionAndScale(glasses: Glasses) {
    if (!this.glasses) return;

    this.glasses.position.set(...glasses.options.position);
    this.glasses.scale.set(...glasses.options.scale);
    this.glasses.rotation.set(...glasses.options.rotation);
  }

  updateCanvasSize(
    width: number,
    height: number,
    videoWidth: number,
    videoHeight: number
  ) {
    if (!this.renderer) return;
    this.renderer.domElement.width = width;
    this.renderer.domElement.height = height;

    this.renderer?.setSize(width, height);

    if (this.camera) {
      this.camera.aspect = width / height;
    }
  }

  private get viewSize() {
    if (!this.camera || !this.width || !this.height) return undefined;

    let distance = this.camera.position.z;
    let vFov = (this.camera.fov * Math.PI) / 180;
    let height;
    let width;

    height = 2 * Math.tan(vFov / 2) * distance;
    width = height * (this.width / this.height);
    return { width, height, vFov };
  }
}
