import { action, makeObservable, observable } from "mobx";
import Scene from "../../../scenes/Scene";
import { createContext } from "react";
import IFacetype from "../../../interfaces/Facetype";
import { Glasses } from "../../../interfaces/consts/Glasses";
import { Group } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { getDownloadURL, ref } from "firebase/storage";
import { firebaseStorage } from "../../../utils/firebase/firebase";
import { IStoreForTF } from "../../../interfaces/services/store/StoreForTF";
import { StoreWithActiveGlasses } from "../../../interfaces/services/store/StoreWithActiveGlasses";
import { getGlassesList } from "../../../api/firebase/store/glasses";
import { glasses_list } from "../../../consts/glasses";

class Store implements IStoreForTF, StoreWithActiveGlasses {
  ready: boolean = false;
  scene: Scene = new Scene();
  tf: {
    facedata: any;
    initiated: boolean;
  } = {
    facedata: undefined,
    initiated: false,
  };

  facetype: IFacetype = {
    type: NaN,
    current_detections: 0,
    detections: 1,
  };

  glasses: {
    active_glasses: undefined | number | string;
    list: Array<Glasses>;
    files: Record<string, Group>;
  } = {
    active_glasses: undefined,
    list: [],
    files: {},
  };

  constructor() {
    makeObservable(this, {
      ready: observable,
      updateReadyState: action,

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

  updateReadyState(ready: boolean) {
    this.ready = ready;
  }

  async updateGlassesList() {
    const querySnapshot = await getGlassesList();

    this.glasses.list = [];
    glasses_list.forEach((item) => {
      this.glasses.list.push(JSON.parse(JSON.stringify(item)));
    });

    querySnapshot.forEach((doc) => {
      this.glasses.list.push({
        id: doc.id,
        ...doc.data(),
      } as Glasses);
    });

    this.glasses.list.sort((item1, item2) => {
      if (item1.local || item2.local) {
        return 0;
      }

      return item1.name.localeCompare(item2.name);
    });

    this.scene.glasses_controller.loadGlassesList(this.glasses.list);
  }

  async loadGlassesFiles() {
    const fbxLoader = new FBXLoader();

    for (const item of this.glasses.list) {
      switch (item.local) {
        case true:
          this.glasses.files[item.id] = await fbxLoader.loadAsync(
            document.location.origin + "/" + item.file_path
          );
          break;

        default:
          const url = await getDownloadURL(
            ref(firebaseStorage, item.file_path)
          );
          this.glasses.files[item.id] = await fbxLoader.loadAsync(url);
      }
    }

    this.scene.glasses_controller.loadGlassesFiles(this.glasses.files);
  }

  newActiveGlasses(id: number | string) {
    this.glasses.active_glasses = id;
  }
}

const store = new Store();
const StoreContext = createContext(store);
export { StoreContext };
export { Store };

export default store;
