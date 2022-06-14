import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import React from 'react';
import {ref} from 'firebase/storage';
import {firebaseStorage} from '../../../utils/firebase';
import { getDownloadURL } from 'firebase/storage';

export const previewSceneCanvas/*: LegacyRef<HTMLCanvasElement>*/ = React.createRef(); // ref

export class PreviewScene {
  async createScene (glasses) {
    this.sizes = {
      width: previewSceneCanvas.current.offsetWidth,
      height: previewSceneCanvas.current.offsetHeight,
    };

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      1000,
    );
    this.camera.position.set(0, 14, 40);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      canvas: previewSceneCanvas.current/* as HTMLCanvasElement*/,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);

    this.fbxLoader = new FBXLoader();
    const url = await getDownloadURL(ref(firebaseStorage, glasses.file_path));
    this.object = await this.fbxLoader.loadAsync(url);
    this.scene.add(this.object);
  }

  updatePosition (glasses) {
    if (!this.object) return

    this.object.position.set(...glasses.snapshot_options.position);
    this.object.scale.set(...glasses.snapshot_options.scale);
    this.object.rotation.set(...glasses.snapshot_options.rotation);
    glasses.snapshot_options.bracketsItemsNames.forEach((name) => {
      this.object.getObjectByName(name)
        ?.traverse((obj => {
          if (obj.visible) {
            obj.visible = false;
          }
        }))
    });

    this.renderer.render(this.scene, this.camera);
  }
}
