import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseStore } from "../../../utils/firebase/firebase";
import { Glasses } from "../../../interfaces/consts/Glasses";

const PATH = "glasses";

export const getGlassesList = async () =>
  await getDocs(collection(firebaseStore, PATH));

export const addGlassesToList = async (data: Omit<Glasses, "id">) => {
  let id = undefined;

  try {
    const docRef = await addDoc(collection(firebaseStore, PATH), data);
    id = docRef.id;
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  return id;
};

export const editGlassesFromList = async (
  id: string | number,
  data: Partial<Glasses>
) => {
  id = typeof id == "number" ? id.toString() : id;

  const glassesRef = doc(firebaseStore, PATH, id);

  await updateDoc(glassesRef, data);
};

export const deleteGlassesFromList = async (id: string | number) => {
  id = typeof id == "number" ? id.toString() : id;
  await deleteDoc(doc(firebaseStore, PATH, id));
};
