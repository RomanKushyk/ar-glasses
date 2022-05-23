import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {glasses_list} from '../const/glasses';

type Glasses = typeof glasses_list[1];


export const getPngFromFbx = (glasses: Glasses) => {
  return new Promise(async (resolve: any, reject: any) => {
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
    // renderer.setClearColor(0x808080, 0.5);
    document.body.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    document.body.append(renderer.domElement); // !!!

    const fbxLoader = new FBXLoader();
    let object = await fbxLoader.loadAsync(glasses.file_path);

    object.position.set(...glasses.snapshot_options.position);
    object.scale.set(...glasses.snapshot_options.scale);
    object.rotation.set(...glasses.snapshot_options.rotation);
    object.getObjectByName(glasses.snapshot_options.bracketsName)
        .traverse((obj) => {
          if (obj.visible) {
            obj.visible = false;
          }
        });
    console.log(object);
    scene.add(object);

    renderer.render(scene, camera);

    requestAnimationFrame(() => {
      resolve(canvas.toDataURL(strMime));
    });
  });
};
