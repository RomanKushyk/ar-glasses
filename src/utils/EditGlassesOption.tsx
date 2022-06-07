import { Glasses } from '../interfaces/consts/Glasses';

export class EditGlassesOption {
  changePosition (glasses: Glasses, x: number, y: number, z: number) {
    glasses.options.position = [x, y, z];
  }

  changeScale (glasses: Glasses, x: number, y: number, z: number) {
    glasses.options.scale = [x, y, z];
  }

  changePositionForPreview(glasses: Glasses, x: number, y: number, z: number) {
    glasses.snapshot_options.position = [x, y, z];
  }

  changeScaleForPreview (glasses: Glasses, x: number, y: number, z: number) {
    glasses.snapshot_options.scale = [x, y, z];
  }

  changeRotationForPreview (glasses: Glasses, x: number, y: number, z: number) {
    glasses.snapshot_options.rotation = [x, y, z];
  }

  changePartVisibilityForPreview (glasses: Glasses, parts: { [name: string]: boolean }) {
    for (const key in parts) {
      const existingPart = glasses.snapshot_options.bracketsItemsNames
        .find(name => name === key);

      const existingPartIndex = glasses.snapshot_options.bracketsItemsNames
        .findIndex(name => name === key);

      if (parts[key]) {
        if (!existingPart) {
          glasses.snapshot_options.bracketsItemsNames.push(key);
        }
      } else {
        if (existingPartIndex) {
          glasses.snapshot_options.bracketsItemsNames
            .splice(existingPartIndex, 1);
        }
      }
    }
  }
}
