import * as THREE from "three";
import { EFaceTypes } from "../../enums/EFaceTypes";

export interface Glasses {
  id: string;
  name: string;
  file_path: string;
  preview_file_path: string;
  local: boolean;
  loaded: boolean;
  error: boolean;
  model: null | THREE.Object3D;
  faceTypes: Record<EFaceTypes, boolean> | null;
  options: {
    position: [x: number, y: number, z: number];
    rotation: [x: number, y: number, z: number];
    scale: [x: number, y: number, z: number];
  };
  glass_group: {
    name: string;
  };
  snapshot_options: {
    partsVisibility: Record<string, boolean> | null;
    position: [x: number, y: number, z: number];
    rotation: [x: number, y: number, z: number];
    scale: [x: number, y: number, z: number];
  };
}
