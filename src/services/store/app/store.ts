import { action, makeObservable, observable } from "mobx";
import Scene from "../../../scenes/Scene";
import { createContext } from "react";
import IFacetype from "../../../interfaces/Facetype";
import { Glasses } from '../../../interfaces/consts/Glasses';
import {Group} from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {getDownloadURL, ref} from 'firebase/storage';
import {firebaseStorage} from '../../../utils/firebase';

class Store {
  ready: boolean = false;
  scene: Scene = new Scene();
  facetype: IFacetype = {
    type: NaN,
    current_detections: 0,
    detections: 1,
  };
  glasses: {
    active_glasses: undefined | number | string;
    list: Array<Glasses>;
    files: {
      [id: string]: Group,      //файли підгружаються з мережі
    },
  } = {
    active_glasses: undefined,
    list: [],
    files: {},
  };

  constructor() {
    makeObservable(this, {
      ready: observable,
      newReadyState: action,

      facetype: observable,
      updateFacetype: action,

      glasses: observable,
      updateGlassesList: action,
      loadGlassesFiles: action,
      newActiveGlasses: action,
    });
  }

  updateFacetype(facetype: IFacetype) {
    this.facetype.type = facetype.type;
    this.facetype.current_detections = facetype.current_detections;
    this.facetype.detections = facetype.detections;
  }

  newReadyState(ready: boolean) {
    this.ready = ready;
  }

  async updateGlassesList() {
    await this.scene.glasses_controller.loadGlassesList()
    this.glasses.list = this.scene.glasses_controller.glasses_list;
  }

  async loadGlassesFiles() {
    const fbxLoader = new FBXLoader();

    for (const item of this.glasses.list) {
      switch (item.local) {
        case true:
          this.glasses.files[item.id] = await fbxLoader.loadAsync(item.file_path);
          break;

        default:
          const url = await getDownloadURL(ref(firebaseStorage, item.file_path));
          this.glasses.files[item.id] = await fbxLoader.loadAsync(url);
      }
    }
  }

  newActiveGlasses(id: number | string) {
    this.glasses.active_glasses = id;
  }
}
const store = new Store();
const StoreContext = createContext(store);
export { StoreContext };

export default store;
