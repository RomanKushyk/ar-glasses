import {Glasses} from '../../../interfaces/consts/Glasses';
import {action, makeObservable, observable} from 'mobx';
import {glasses_list} from '../../../consts/glasses';
import {createContext} from 'react';

class Store {
  glasses: {
    selected: string | number | undefined,
    list: Glasses[],
  } = {
    selected: undefined,
    list: [],
  };

  uploadedFile: File | null = null;

  constructor () {
    makeObservable(this, {
      glasses: observable,
      updateList: action,
      setSelected: action,

      uploadedFile: observable,
      uploadFile: action,
    })
  }

  updateList () {
    this.glasses.list = glasses_list;
  }

  setSelected (id: number | string) {
    this.glasses.selected = id;
  }

  uploadFile (file: File) {
    this.uploadedFile = file;
  }
}

const store = new Store();
export const StoreContext = createContext(store);

export default store;
