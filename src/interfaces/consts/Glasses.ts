import * as THREE from 'three';

export interface Glasses {
    id: string | number,
    name: string,
    file_path: string,
    preview_file_path: string,
    loaded: boolean,
    error: boolean,
    model: null | THREE.Object3D,
    options: {
        position: [x: number, y: number, z: number],
        scale: [x: number, y: number, z: number],
    },
    glass_group: {
        name: string,
    },
    snapshot_options: {
        bracketsItemsNames: string[],
        position: [x: number, y: number, z: number],
        scale: [x: number, y: number, z: number],
        rotation: [x: number, y: number, z: number],
    },
}
