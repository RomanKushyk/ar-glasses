import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const fbxLoader = new FBXLoader();

export class GlassesController {
  constructor() {}

  glasses_loading_promise = undefined;

  _active_glass_id = undefined;

  set active_glass(id) {
    if (this._active_glass_id !== id) {
      this._active_glass_id = id;
      
      let glass = this.glasses_list.find((glass_state) => glass_state.id == id);

      this.glasses_loading_promise = new Promise((resolve, reject) => {
        fbxLoader
          .loadAsync(glass.file_path)
          .then((model) => {
            glass.model = model;
            glass.loaded = true;

            resolve(glass);
          })
          .catch((err) => {
            glass.error = err;
            reject(err);
          });
      });
    }
  }

  get active_glass() {
    return this.glasses_list.find(
      (glass_state) => glass_state.id == this._active_glass_id
    );
  }

  _glasses_list = [
    {
      id: 0,
      file_path: "assets/Glasses/01/01%20-%20Model.fbx",
      opacity: 0,
      visibility: false,
      loaded: false,
      error: false,
      model: undefined,
    },
  ];

  get glasses_list() {
    return this._glasses_list;
  }
}
