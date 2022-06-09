import { Glasses } from '../../../interfaces/consts/Glasses';
import { action, makeObservable, observable } from 'mobx';
import { createContext } from 'react';
import {
  addGlassesToList,
  deleteGlassesFromList,
  editGlassesFromList,
  getGlassesList
} from '../../../api/firebase/store/glasses';
import { createNewGlassesInfo } from '../../../utils/createNewGlassesInfo';
import {
  deleteGlassesFromStorage,
  downloadGlassesFromStorage,
  uploadGlassesToStorage
} from '../../../api/firebase/storage/glasses';
import { getNameFromPath } from '../../../utils/getNameFromPath';

interface StoreGlasses {
  selected: undefined | Glasses,
  temporary: Omit<Glasses, 'id'> | null
  list: Glasses[],
  modelFiles: {
    [id: string]: File,
  },
  previewFiles: {
    [id: string]: File,
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
      loadAllGlassesFiles: action,
      clearTemporary: action,

      addToGlassesList: action,
      editInGlassesList: action,
      deleteFromGlassesList: action,

      acceptedFile: observable,
      getFileFromUser: action,

      uploadTemporaryToFirebase: action,
      deleteGlassesFromFirebase: action,
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
    this.glasses.selected = this.glasses.list
      .find(item => id === item.id);
  }

  loadAllGlassesFiles () {
    this.glasses.list.forEach(item => {
      downloadGlassesFromStorage(
        item.file_path,
        getNameFromPath(item.file_path),
      )
        .then(data => this.glasses.modelFiles[item.id] = data);

      downloadGlassesFromStorage(
        item.preview_file_path,
        `${getNameFromPath(item.preview_file_path)}`,
      )
        .then(data => this.glasses.previewFiles[item.id] = data);
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

  async uploadTemporaryToFirebase () {
    let glassesId: string | undefined;
    console.log('start');
    console.log(store.acceptedFile);

    if (this.acceptedFile) {
      this.glasses.temporary = createNewGlassesInfo(this.acceptedFile);
      await addGlassesToList(this.glasses.temporary)
        .then(id => glassesId = id);
      console.log('added to list')

      uploadGlassesToStorage(
        this.acceptedFile,
        `${glassesId}/${glassesId}_model.fbx`,
      )
        .then((url) => {
          console.log('uploaded')
          if (glassesId) {
            editGlassesFromList(glassesId, { loaded: true, file_path: url });
            console.log('edited')
          }

          this.clearTemporary();
          this.loadGlassesList();
          console.log('lost reloaded', this.glasses.list);
        })
    }
  }

  async deleteGlassesFromFirebase (item: Glasses) {
    await deleteGlassesFromStorage(item.file_path);

    if (item.preview_file_path.length) {
      await deleteGlassesFromStorage(item.preview_file_path);
    }

    await deleteGlassesFromList(item.id);

    await this.loadGlassesList();
    await this.loadAllGlassesFiles();
  }
}

const store = new Store();
export const StoreContext = createContext(store);

export default store;
