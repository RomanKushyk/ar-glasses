import { Glasses } from '../../../interfaces/consts/Glasses';
import { action, makeObservable, observable } from 'mobx';
import { createContext } from 'react';
import {
  addGlassesToList,
  deleteGlassesFromList,
  editGlassesFromList,
  getGlassesList
} from '../../../api/firebase/store/glasses';
import {createNewGlassesInfo} from '../../../utils/createNewGlassesInfo';
import {downloadGlassesFromStorage, uploadGlassesToStorage} from '../../../api/firebase/storage/glasses';
import {getNameFromPath} from '../../../utils/getNameFromPath';

interface StoreGlasses {
  selected: undefined | string,
  temporary: Omit<Glasses, 'id'> | null
  list: Glasses[],
  modelFiles: {
    [name: string]: File,
  },
  previewFiles: {
    [name: string]: File,
  },
}

class Store {
  glasses: StoreGlasses = {
    selected: undefined,
    temporary: null,
    list: [],
    modelFiles: {},
    previewFiles: {},
  };

  acceptedFile: File | null = null;

  constructor () {
    makeObservable(this, {
      glasses: observable,
      loadGlassesList: action,
      setSelected: action,
      loadGlassesFiles: action,
      clearTemporary: action,

      addToGlassesList: action,
      editInGlassesList: action,
      deleteFromGlassesList: action,

      acceptedFile: observable,
      getFileFromUser: action,

      uploadGlassesToFirebase: action,
    })
  }

  async loadGlassesList () {
    const querySnapshot = await getGlassesList();

    this.glasses.list = [];
    querySnapshot.forEach((doc: any) => {
      this.glasses.list.push({
        id: doc.id,
        ...doc.data(),
      } as Glasses);
    })
  }

  setSelected (id: string) {
    this.glasses.selected = id;
    this.loadGlassesList();
  }

  loadGlassesFiles () {
    this.glasses.list.forEach(item => {
      downloadGlassesFromStorage(
        item.file_path,
        getNameFromPath(item.file_path),
      )
        .then(data => this.glasses.modelFiles[data.name] = data);

      downloadGlassesFromStorage(
        item.preview_file_path,
        `${getNameFromPath(item.preview_file_path)}`,
      )
        .then(data => this.glasses.previewFiles[data.name] = data);
    });
  }

  clearTemporary () {
    this.glasses.temporary = null;
  }

  async addToGlassesList (data: Omit<Glasses, 'id'>) {
    await addGlassesToList(data);
  }

  async editInGlassesList (id: string, data: Partial<Glasses>) {
    await editGlassesFromList(id, data);
  }

  async deleteFromGlassesList (id: string) {
    await deleteGlassesFromList(id);
  }

  getFileFromUser (file: File) {
    this.acceptedFile = file;
  }

  uploadGlassesToFirebase () {
    let glassesId: string | undefined;
    console.log('start');
    console.log(store.acceptedFile);

    if (this.acceptedFile) {
      this.glasses.temporary = createNewGlassesInfo(this.acceptedFile);
      addGlassesToList(this.glasses.temporary)
        .then(id => glassesId = id);
      console.log('added to list')

      uploadGlassesToStorage(
        this.acceptedFile,
        `${this.glasses.temporary.name}/${getNameFromPath(this.glasses.temporary.file_path)}`,
      )
        .then((url) => {
          console.log('uploaded')
          if (glassesId) {
            editGlassesFromList(glassesId, { loaded: true, file_path: url });
            console.log('edited')
          }

          this.clearTemporary();
          this.loadGlassesList();
        })
    }
  };
}

const store = new Store();
export const StoreContext = createContext(store);

export default store;
