import * as THREE from 'three';

export interface Glasses {
    id: number,
    file_path: string,
    loaded: boolean,
    error: boolean,
    model: undefined | THREE.model,
    options: {
        position: [x: number, y: number, z: number],
        scale: [x: number, y: number, z: number],
    },
    glass_group: {
        name: string,
    },
    snapshot_options: {
        bracketsName: string,
        position: [x: number, y: number, z: number],
        scale: [x: number, y: number, z: number],
        rotation: [x: number, y: number, z: number],
    },
}
