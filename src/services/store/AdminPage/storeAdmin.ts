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
import { deleteGlassesFromStorage, uploadGlassesToStorage } from '../../../api/firebase/storage/glasses';
import { PreviewScene } from '../../../scenes/AdminPage/PreviewScene/PreviewScene';
import { getPngFromFbx } from '../../../utils/getPngFromFbx';
import { getDownloadURL, ref} from 'firebase/storage';
import { firebaseStorage } from '../../../utils/firebase';
import { Group } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import {glasses_list} from '../../../consts/glasses';

interface StoreGlasses {
  selected: undefined | Glasses,
  temporary: Omit<Glasses, 'id'> | null,
  list: Glasses[],
  modelFiles: {
    [id: string]: Group,      //файли підгружаються з мережі
  },
  filesReady: boolean,
  saveAborted: boolean,
  saved: boolean,
  savePngAborted: boolean,
  pngSaved: boolean,
}

class StoreAdmin {
  glasses: StoreGlasses = {
    selected: undefined,
    temporary: null,
    list: [],
    modelFiles: {},
    filesReady: false,
    saveAborted: false,
    saved: false,
    savePngAborted: false,
    pngSaved: false,
  };

  acceptedFile: File | null = null;
  previewScene: null | PreviewScene = null;

  constructor () {
    makeObservable(this, {
      glasses: observable,
      loadGlassesList: action,
      clearIndicators: action,
      setSelected: action,
      saveChangesInTheSelectedToFirebase: action,
      loadAllGlassesFiles: action,
      clearTemporary: action,

      acceptedFile: observable,
      getFileFromUser: action,

      previewScene: observable,
      makePreviewPngAndUpload: action,

      uploadTemporaryToFirebase: action,
      deleteGlassesFromFirebase: action,
    })
  }

  async loadGlassesList () {
    const querySnapshot = await getGlassesList();

    this.glasses.list = [];
    glasses_list.forEach(item => {
      this.glasses.list.push(JSON.parse(JSON.stringify(item)));
    })

    querySnapshot.forEach(doc => {
      this.glasses.list.push({
        id: doc.id,
        ...doc.data(),
      } as Glasses);
    });

    this.glasses.list.sort((item1, item2) => {
      if (item1.local || item2.local) {
        return 0;
      }

      return item1.name.localeCompare(item2.name)
    });

    this.clearIndicators();
  }

  clearIndicators () {
    this.glasses.saved = false;
    this.glasses.saveAborted = false;
    this.glasses.pngSaved = false;
    this.glasses.savePngAborted = false;
  }

  setSelected (id: number | string) {
    this.glasses.selected = this.glasses.list
      .find(item => id === item.id);
  }

  async saveChangesInTheSelectedToFirebase () {
    this.clearIndicators();

    if (!this.glasses.selected || this.glasses.selected.local) {
      this.glasses.saveAborted = true;

      return;
    }

    const { id, ...data } = this.glasses.selected;

    await editGlassesFromList(id, data);

    this.glasses.saved = true;
  }

  async loadAllGlassesFiles () {
    this.glasses.filesReady = false;

    const fbxLoader = new FBXLoader();

    for (const item of this.glasses.list) {
      switch (item.local) {
        case true:
          this.glasses.modelFiles[item.id] = await fbxLoader.loadAsync(item.file_path);
          break;

        default:
          const url = await getDownloadURL(ref(firebaseStorage, item.file_path));
          this.glasses.modelFiles[item.id] = await fbxLoader.loadAsync(url);
          break
      }
    }

    this.glasses.filesReady = true;
  }

  clearTemporary () {
    this.glasses.temporary = null;
  }

  getFileFromUser (file: File) {
    this.acceptedFile = file;
  }

  async makePreviewPngAndUpload () {
    this.clearIndicators();

    if (!this.glasses.selected || this.glasses.selected.local) {
      this.glasses.savePngAborted = true;

      return;
    }

    await this.saveChangesInTheSelectedToFirebase();

    const modelUrl = await getDownloadURL(ref(firebaseStorage, this.glasses.selected.file_path));
    const data = await getPngFromFbx(this.glasses.selected, modelUrl) as string;
    const res = await fetch(data);
    const blob = await res.blob();
    const file = new File([blob], "File name",{ type: "image/png" })
    const previewPath = await uploadGlassesToStorage(
      file,
      `${this.glasses.selected.id}/${this.glasses.selected.id}_preview.png`,
    );
    const previewUrl = await getDownloadURL(ref(firebaseStorage, previewPath));

    await editGlassesFromList(this.glasses.selected.id, { preview_file_path: previewUrl });
    await this.loadGlassesList();
    this.setSelected(this.glasses.selected.id);

    this.glasses.pngSaved = true;
  }

  async uploadTemporaryToFirebase () {
    if (!this.acceptedFile) return;

    let glassesId: string | undefined;

    this.glasses.temporary = createNewGlassesInfo(this.acceptedFile);
    await addGlassesToList(this.glasses.temporary)
      .then(id => glassesId = id);

    const url = await uploadGlassesToStorage(
      this.acceptedFile,
      `${glassesId}/${glassesId}_model.fbx`,
    );

    if (glassesId) {
      await editGlassesFromList(glassesId, { file_path: url });
    }

    this.clearTemporary();
    await this.loadGlassesList();
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

const storeAdmin = new StoreAdmin();
export const StoreContextAdmin = createContext(storeAdmin);

export default storeAdmin;
