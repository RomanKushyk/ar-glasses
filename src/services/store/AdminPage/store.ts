import { Glasses } from "../../../interfaces/consts/Glasses";
import { action, makeObservable, observable } from "mobx";
import { createContext } from "react";
import {
  addGlassesToList,
  deleteGlassesFromList,
  editGlassesFromList,
  getGlassesList,
} from "../../../api/firebase/store/glasses";
import { User } from "@firebase/auth";
import { firebaseAuth } from "../../../utils/firebase";

interface StoreGlasses {
  selected: undefined | string;
  temporary: Omit<Glasses, "id"> | null;
  list: Glasses[];
  modelFiles: {
    [name: string]: File;
  };
  previewFiles: {
    [name: string]: File;
  };
}

class Store {
  glasses: {
    selected: string | number | undefined;
    temporary: null;
    modelFiles: {
      [id: string]: File;
    };
    previewFiles: {
      [id: string]: File;
    };
    list: Glasses[];
  } = {
    selected: undefined,
    temporary: null,
    list: [],
    modelFiles: {},
    previewFiles: {},
  };

  acceptedFile: File | null = null;

  constructor() {
    makeObservable(this, {
      glasses: observable,
      loadGlassesList: action,
      setSelected: action,

      acceptedFile: observable,
      uploadFile: action,
    });
  }

  async loadGlassesList() {
    const querySnapshot = await getGlassesList();

    this.glasses.list = [];
    querySnapshot.forEach((doc) => {
      this.glasses.list.push({
        id: doc.id,
        ...doc.data(),
      } as Glasses);
    });
  }

  setSelected(id: number | string) {
    this.glasses.selected = id;
    this.loadGlassesList();
  }

  uploadFile(file: File) {
    this.acceptedFile = file;
  }
}

const store = new Store();
export const StoreContext = createContext(store);

export default store;
