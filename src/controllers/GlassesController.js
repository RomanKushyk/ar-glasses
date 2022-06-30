import { glasses_list } from "../consts/glasses.ts";
import { getGlassesList } from "../api/firebase/store/glasses";
import store from "../services/store/app/store";
import { Group } from "three";

export class GlassesController {
  glasses_list = [];
  glasses_files = {};
  glasses_loading_promise = undefined;

  _active_glass_id = undefined;

  loadGlassesList(list) {
    this.glasses_list = list;
  }

  loadGlassesFiles(files) {
    this.glasses_files = files;
  }

  set active_glass(id) {
    if (this._active_glass_id !== id) {
      this._active_glass_id = id;
      let glass = this.glasses_list.find(
        (glass_state) => glass_state.id === id
      );

      this.glasses_loading_promise = new Promise(async (resolve, reject) => {
        if (!glass.loaded) {
          glass.model = this.glasses_files[id];

          glass.loaded = true;
        }

        resolve();
      });
    }
  }

  get active_glass() {
    if (this._active_glass_id === undefined) {
      return undefined;
    }

    return this.glasses_list.find(
      (glass_state) => glass_state.id === this._active_glass_id
    );
  }
}
