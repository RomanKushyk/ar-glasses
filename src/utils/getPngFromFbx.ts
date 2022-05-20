import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';

export const getPngFromFbx = (filePath: string, position: number[], scale: number[]) => {
  return new Promise(async (resolve: any, reject: any) => {
    const strMime = 'image/png';
    const sizes = {
      width: 640,
      height: 260,
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        18,
        sizes.width/sizes.height,
        0.1,
        37,
    );
    camera.position.set(0, 14, 40);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    document.body.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    document.body.append(renderer.domElement);

    const fbxLoader = new FBXLoader();
    let object = await fbxLoader.loadAsync(filePath);

    object.position.set(...position);
    object.scale.set(...scale);
    object.rotation.set(4.8, 0, 0);
    scene.add(object);

    renderer.render(scene, camera);

    requestAnimationFrame(() => {
      resolve(canvas.toDataURL(strMime));
      console.log(canvas);
    });
  });
};
