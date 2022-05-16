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

      this.glasses_loading_promise = new Promise(async (resolve, reject) => {
        if (!glass.loaded) {
          glass.model = await fbxLoader
            .loadAsync(glass.file_path)
            .catch((err) => {
              glass.error = err;
              reject(err);
            });

          glass.loaded = true;
        }

        resolve();
      });
    }
  }

  get active_glass() {
    if (this._active_glass_id == undefined) {
      return undefined;
    }

    return this.glasses_list.find(
      (glass_state) => glass_state.id == this._active_glass_id
    );
  }

  glasses_list = [
    {
      id: 0,
      file_path: "assets/Glasses/01/01%20-%20Model.fbx",
      loaded: false,
      error: false,
      model: undefined,
      options: {
        position: [-0.7, 12, -4.5],
        scale: [0.8, 0.8, 0.8],
      },
      glass_group: {
        name: "Default"
      }
    },
    {
      id: 1,
      file_path: "assets/Glasses/02/02%20-%20Model.fbx",
      loaded: false,
      error: false,
      model: undefined,
      options: {
        position: [-0, 7, 0],
        scale: [0.41, 0.41, 0.41],
      },
      glass_group: {
        name: 'Lights'
      }
    },
  ];
}
