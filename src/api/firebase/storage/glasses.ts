import {getBytes, ref, uploadBytes} from 'firebase/storage';
import {firebaseStorage} from '../../../utils/firebase';

const BASE_PATH = 'assets/glasses/';

export const downloadGlassesFromStorage = (glassesPath: string) => {
  const storageRef = ref(firebaseStorage, glassesPath);

  return getBytes(storageRef);
};

export const uploadGlassesToStorage = async (file: File, path: string) => {
  const storageRef = ref(firebaseStorage, BASE_PATH + path);

  await uploadBytes(storageRef, file).then((snapshot) => {
    console.log(snapshot);
  });
};
