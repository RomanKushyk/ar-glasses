import * as THREE from 'three';

export interface Glasses {
    id: number,
    name: string,
    file_path: string,
    preview_file_path: string,
    loaded: boolean,
    error: boolean,
    model: undefined | THREE.Object3D,
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
