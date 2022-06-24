import { glasses_list } from "../consts/glasses.ts";
import { getGlassesList } from "../api/firebase/store/glasses";
import store from "../services/store/app/store";

export class GlassesController {
  glasses_list = [];
  glasses_loading_promise = undefined;

  _active_glass_id = undefined;

  async loadGlassesList() {
    this.glasses_list = glasses_list;

    const querySnapshot = await getGlassesList();

    querySnapshot.forEach((doc) => {
      this.glasses_list.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    this.glasses_list.sort((item1, item2) => {
      if (item1.local || item2.local) {
        return 0;
      }

      return item1.name.localeCompare(item2.name);
    });
  }

  set active_glass(id) {
    if (this._active_glass_id !== id) {
      this._active_glass_id = id;
      let glass = this.glasses_list.find(
        (glass_state) => glass_state.id === id
      );

      this.glasses_loading_promise = new Promise(async (resolve, reject) => {
        if (!glass.loaded) {
          glass.model = store.glasses.files[id];

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
