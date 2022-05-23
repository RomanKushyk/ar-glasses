import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { glasses_list } from '../const/glasses.ts';

const fbxLoader = new FBXLoader();

export class GlassesController {
  constructor() {}

  glasses_list = glasses_list;
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
}
