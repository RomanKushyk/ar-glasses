import { ref, uploadBytes, getBlob, deleteObject } from "firebase/storage";
import { firebaseStorage } from "../../../utils/firebase/firebase";

const BASE_PATH = "assets/glasses/";

export const downloadGlassesFromStorage = async (
  glassesPath: string,
  nameWithExt: string
) => {
  const storageRef = ref(firebaseStorage, glassesPath);
  const blob = await getBlob(storageRef);

  return new File([blob], nameWithExt, { type: "application/octet-stream" });
};

export const uploadGlassesToStorage = async (file: File, path: string) => {
  const storageRef = ref(firebaseStorage, BASE_PATH + path);
  const uploadTask = await uploadBytes(storageRef, file);
  return uploadTask.ref.fullPath;
};

export const deleteGlassesFromStorage = async (path: string) => {
  const storageRef = ref(firebaseStorage, path);

  deleteObject(storageRef);
};
