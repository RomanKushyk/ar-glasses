import {Glasses} from '../interfaces/consts/Glasses';
import store from '../services/store/AdminPage/store';

type CreateNewGlassesInfo = (file: File) => Omit<Glasses, 'id'>;

export const createNewGlassesInfo: CreateNewGlassesInfo = (file) => {
  const name = getFileNameWithoutExt(file);
  // const extension = file.name.slice(file.name.indexOf('.'));

  return {
    name,
    file_path: ``,
    preview_file_path: ``,
    loaded: false,
    error: false,
    model: undefined,
    options: {
      position: [0, 0, 0],
      scale: [0, 0, 0],
    },
    glass_group: {
      name: ''
    },
    snapshot_options: {
      bracketsItemsNames: [],
      position: [0, 0, 0],
      scale: [0, 0, 0],
      rotation: [0, 0, 0],
    },
  };
};

const getFileNameWithoutExt = (file: File) => {
  const fullNameWithExt = file.name;

  return fullNameWithExt
    .replaceAll(' ', '_')
    .slice(0, fullNameWithExt.indexOf('.'));
};
