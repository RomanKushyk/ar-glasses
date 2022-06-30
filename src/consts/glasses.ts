import { Glasses } from "../interfaces/consts/Glasses";

export const glasses_list: Glasses[] = [
  {
    id: "0",
    name: "1",
    file_path: "assets/Glasses/01/01 - Model.fbx",
    preview_file_path: "assets/Glasses/01/01 - preview.png",
    local: true,
    loaded: false,
    error: false,
    model: null,
    options: {
      position: [-0.7, 12, -4.5],
      rotation: [0, 0, 0],
      scale: [0.8, 0.8, 0.8],
    },
    glass_group: {
      name: "Default",
    },
    snapshot_options: {
      partsVisibility: null,
      position: [-0.7, 12, -4.5],
      rotation: [4.8, 0, 0],
      scale: [0.8, 0.8, 0.8],
    },
  },
  {
    id: "1",
    name: "2",
    file_path: "assets/Glasses/02/02 - Model.fbx",
    preview_file_path: "assets/Glasses/02/02 - preview.png",
    local: true,
    loaded: false,
    error: false,
    model: null,
    options: {
      position: [-0.5, 7.5, -1],
      rotation: [0, 0, 0],
      scale: [0.41, 0.41, 0.41],
    },
    glass_group: {
      name: "Lights",
    },
    snapshot_options: {
      partsVisibility: null,
      position: [-0.5, 14, -1],
      scale: [0.41, 0.41, 0.41],
      rotation: [4.6, 0, 0],
    },
  },
];
