import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Glasses } from '../interfaces/consts/Glasses';
import {getDownloadURL, ref} from 'firebase/storage';
import {firebaseStorage} from './firebase';

export const getPngFromFbx = (glasses: Glasses, URL?: string) => {
  return new Promise(async (resolve: any, reject: any) => {
      let path = glasses.file_path;

    if (URL) {
      path = await getDownloadURL(ref(firebaseStorage, glasses.file_path));
    }
    const strMime = 'image/png';
    const sizes = {
      width: 640,
      height: 640,
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        sizes.width/sizes.height,
        0.1,
        1000,
    );
    camera.position.set(0, 14, 40);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    const canvas = renderer.domElement;
    document.body.appendChild(canvas); // !!!

    const fbxLoader = new FBXLoader();
    let object = await fbxLoader.loadAsync(path);

    object.position.set(...glasses.snapshot_options.position);
    object.scale.set(...glasses.snapshot_options.scale);
    object.rotation.set(...glasses.snapshot_options.rotation);

    if (glasses.snapshot_options.partsVisibility) {
      const parts = Object.entries(glasses.snapshot_options.partsVisibility);

      parts.forEach(([name, value]) => {
        const item = object.getObjectByName(name);

        if (item) {
          item.traverse(element => {
            element.visible = value;
          })
        }
      });
    }
    scene.add(object);

    renderer.render(scene, camera);

    requestAnimationFrame(() => {
      resolve(canvas.toDataURL(strMime));
      document.body.removeChild(canvas);
    });
  });
};
