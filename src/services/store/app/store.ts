import { action, makeObservable, observable } from "mobx";
import Scene from "../../../scenes/Scene";
import { createContext } from "react";
import IFacetype from "../../../interfaces/Facetype";
import { Glasses } from '../../../interfaces/consts/Glasses';

class Store {
  ready: boolean = false;
  scene: Scene = new Scene();
  facetype: IFacetype = {
    type: NaN,
    current_detections: 0,
    detections: 1,
  };
  glasses: {
    active_glasses: undefined | number;
    list: Array<Glasses>;
  } = {
    active_glasses: undefined,
    list: [],
  };

  constructor() {
    makeObservable(this, {
      ready: observable,
      newReadyState: action,

      facetype: observable,
      updateFacetype: action,

      glasses: observable,
      updateGlassesList: action,
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

  updateGlassesList() {
    this.glasses.list = this.scene.glasses_controller.glasses_list;
  }

  async newActiveGlasses(id: number) {
    this.glasses.active_glasses = id;
    await this.scene.updateGlasses(id);
  }
}
const store = new Store();
const StoreContext = createContext(store);
export { StoreContext };

export default store;
