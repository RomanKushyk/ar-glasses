import { Glasses } from "../interfaces/consts/Glasses";

export class EditGlassesOptions {
  changeName(glasses: Glasses, name: string) {
    glasses.name = name;
  }

  changePositionX(glasses: Glasses, x: number) {
    glasses.options.position[0] = x;
  }

  changePositionY(glasses: Glasses, y: number) {
    glasses.options.position[1] = y;
  }

  changePositionZ(glasses: Glasses, z: number) {
    glasses.options.position[2] = z;
  }

  changeRotationX(glasses: Glasses, x: number) {
    glasses.options.rotation[0] = x;
  }

  changeRotationY(glasses: Glasses, y: number) {
    glasses.options.rotation[1] = y;
  }

  changeRotationZ(glasses: Glasses, z: number) {
    glasses.options.rotation[2] = z;
  }

  changeScaleX(glasses: Glasses, x: number) {
    glasses.options.scale[0] = x;
  }

  changeScaleY(glasses: Glasses, y: number) {
    glasses.options.scale[1] = y;
  }

  changeScaleZ(glasses: Glasses, z: number) {
    glasses.options.scale[2] = z;
  }

  changePreviewPositionX(glasses: Glasses, x: number) {
    glasses.snapshot_options.position[0] = x;
  }

  changePreviewPositionY(glasses: Glasses, y: number) {
    glasses.snapshot_options.position[1] = y;
  }

  changePreviewPositionZ(glasses: Glasses, z: number) {
    glasses.snapshot_options.position[2] = z;
  }

  changePreviewScaleX(glasses: Glasses, x: number) {
    glasses.snapshot_options.scale[0] = x;
  }

  changePreviewScaleY(glasses: Glasses, y: number) {
    glasses.snapshot_options.scale[1] = y;
  }

  changePreviewScaleZ(glasses: Glasses, z: number) {
    glasses.snapshot_options.scale[2] = z;
  }

  changePreviewRotationX(glasses: Glasses, x: number) {
    glasses.snapshot_options.rotation[0] = x;
  }

  changePreviewRotationY(glasses: Glasses, y: number) {
    glasses.snapshot_options.rotation[1] = y;
  }

  changeRotationPreviewZ(glasses: Glasses, z: number) {
    glasses.snapshot_options.rotation[2] = z;
  }

  changePartVisibilityForPreview(glasses: Glasses, part: string) {
    if (!glasses.snapshot_options.partsVisibility) return;

    glasses.snapshot_options.partsVisibility[part] =
      !glasses.snapshot_options.partsVisibility[part];
  }
}
