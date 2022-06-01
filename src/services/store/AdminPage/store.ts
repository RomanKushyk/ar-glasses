import {Glasses} from '../../../interfaces/consts/Glasses';
import {action, makeObservable, observable} from 'mobx';
import {createContext} from 'react';
import {addGlasses, deleteGlasses, editGlasses, getGlassesList} from '../../../api/glasses';

class Store {
  glasses: {
    selected: string | number | undefined,
    list: Glasses[],
  } = {
    selected: undefined,
    list: [],
  };

  acceptedFile: File | null = null;

  constructor () {
    makeObservable(this, {
      glasses: observable,
      loadGlassesList: action,
      setSelected: action,

      acceptedFile: observable,
      uploadFile: action,
    })
  }

  async loadGlassesList () {
    const querySnapshot = await getGlassesList();

    this.glasses.list = [];
    querySnapshot.forEach(doc => {
      this.glasses.list.push({
        id: doc.id,
        ...doc.data(),
      } as Glasses);
    })
  }

  setSelected (id: number | string) {
    this.glasses.selected = id;
    this.loadGlassesList();
  }

  uploadFile (file: File) {
    this.acceptedFile = file;
  }
}

const store = new Store();
export const StoreContext = createContext(store);

export default store;
