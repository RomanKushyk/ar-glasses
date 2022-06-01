import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import {firebaseStore} from '../utils/firebase';
import {Glasses} from '../interfaces/consts/Glasses';

const PATH = 'glasses';

export const getGlassesList = async () => (
  await getDocs(collection(firebaseStore, PATH))
);

export const addGlasses = async (data: Omit<Glasses, 'id'>) => {
  try {
    const docRef = await addDoc(collection(firebaseStore, PATH), data);

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const editGlasses = async (id: string, data: Partial<Glasses>) => {
  const glassesRef = doc(firebaseStore, PATH, id);

  Object.entries(data).forEach(entry => {})
  await updateDoc(glassesRef, data);
};

export const deleteGlasses = async (id: string) => {
  await deleteDoc(doc(firebaseStore, PATH, id));
};
