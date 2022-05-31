import {Glasses} from '../interfaces/consts/Glasses';
import store from '../services/store/AdminPage/store';

type CreateNewGlassesInfo = (file: File, name: string) => Glasses;

export const createNewGlassesInfo: CreateNewGlassesInfo = (file, name = '') => {
  const id = store.glasses.list[store.glasses.list.length - 1].id + 1;
  let newName = name;
  const extension = file.name.slice(file.name.indexOf('.'));
  const path = '';

  if (!newName.length) {
    newName = getFileNameWithoutExt(file);
  }

  return {
    id,
    name: newName,
    file_path: `${path}${newName}${extension}`,
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
