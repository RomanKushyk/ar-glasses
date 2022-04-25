import * as THREE from 'three';

export default class Scene {
    created = false;
    target = null;
    geometry = new THREE.BufferGeometry();
    material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    constructor() { }

    setUp(parent) {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.z = 40;

        this.scene = new THREE.Scene();

        this.setUpTarget()

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, });
        this.renderer.setSize(640, 480);
        this.renderer.setAnimationLoop(() => {
            this.renderer.render(this.scene, this.camera);
        });

        parent.appendChild(this.renderer.domElement);

        this.created = true;
    }

    setUpTarget() {
        this.target = new THREE.Line(this.geometry, this.material);
        this.scene.add(this.target);
    }

    drawScene(predictions) {
        let normalize = (num, in_min, in_max, out_min, out_max) => {
            return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
        }

        if (predictions.length > 0) {
            predictions.forEach(prediction => {
                const keypoints = [
                    ...prediction.annotations.leftEyeLower1,
                    ...prediction.annotations.leftEyeUpper0,
                    ...prediction.annotations.leftEyeUpper1,
                    ...prediction.annotations.leftEyeLower0,
                    ...prediction.annotations.midwayBetweenEyes,
                    ...prediction.annotations.rightEyeLower0,
                    ...prediction.annotations.rightEyeLower1,
                    ...prediction.annotations.rightEyeUpper0,
                    ...prediction.annotations.rightEyeUpper2,
                ];

                const result = [];

                for (let i = 0; i < keypoints.length; i++) {
                    let x = normalize((keypoints[i][0] / 640) * 2 - 1, -1,
                        1,
                        -this.viewSize.width / 2,
                        this.viewSize.width / 2);

                    let y = normalize(-(keypoints[i][1] / 480) * 2 + 1, -1,
                        1,
                        -this.viewSize.height / 2,
                        this.viewSize.height / 2);

                    result.push(x);
                    result.push(y);
                    result.push(-keypoints[i][2] / this.camera.position.z);
                }

                this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(result), 3));

                this.target.geometry.attributes.position.needsUpdate = true;

                this.target.matrixAutoUpdate = false;
                this.target.updateMatrix();

            });
        }
    }

    get viewSize() {
        let distance = this.camera.position.z
        let vFov = (this.camera.fov * Math.PI) / 180
        let height = 2 * Math.tan(vFov / 2) * distance
        let width = height * (640 / 480)
        return { width, height, vFov }
    }
}