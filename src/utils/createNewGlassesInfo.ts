import {Glasses} from '../interfaces/consts/Glasses';

type CreateNewGlassesInfo = (file: File) => Omit<Glasses, 'id'>;

export const createNewGlassesInfo: CreateNewGlassesInfo = (file) => {
  const name = getFileNameWithoutExt(file);
  // const extension = file.name.slice(file.name.indexOf('.'));

  return {
    name,
    file_path: ``,
    preview_file_path: ``,
    local: false,
    loaded: false,
    error: false,
    model: null,
    options: {
      position: [0, 0, 0],
      rotation: [4.8, 0, 0],
      scale: [0.8, 0.8, 0.8],
    },
    glass_group: {
      name: '',
    },
    snapshot_options: {
      partsVisibility: null,
      position: [0, 0, 0],
      rotation: [4.8, 0, 0],
      scale: [0.8, 0.8, 0.8],
    },
  };
};

const getFileNameWithoutExt = (file: File) => {
  const fullNameWithExt = file.name.toString();

  return fullNameWithExt
    .replaceAll(' ', '_')
    .slice(0, fullNameWithExt.indexOf('.'));
};