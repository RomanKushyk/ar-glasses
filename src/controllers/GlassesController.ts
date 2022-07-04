import { Group } from "three";
import { Glasses } from "../interfaces/consts/Glasses";

export class GlassesController {
  glasses_list: Glasses[] = [];
  glasses_files: Record<string, Group> = {};
  glasses_loading_promise: Promise<unknown> | undefined = undefined;

  _active_glass_id: string | number | undefined = undefined;

  loadGlassesList(list: Glasses[]) {
    this.glasses_list = list;
  }

  loadGlassesFiles(files: Record<string, Group>) {
    this.glasses_files = files;
  }

  set active_glass_id(id: string | number) {
    if (this._active_glass_id !== id) {
      this._active_glass_id = id;
      let glass = this.glasses_list.find(
        (glass_state) => glass_state.id === id
      );

      this.glasses_loading_promise = new Promise<void>(
        async (resolve, reject) => {
          if (glass && !glass.loaded) {
            glass.model = this.glasses_files[id];

            glass.loaded = true;
          }

          resolve();
        }
      );
    }
  }

  get active_glass(): Glasses | undefined {
    if (this._active_glass_id === undefined) {
      return undefined;
    }

    return this.glasses_list.find(
      (glass_state) => glass_state.id === this._active_glass_id
    );
  }
}
