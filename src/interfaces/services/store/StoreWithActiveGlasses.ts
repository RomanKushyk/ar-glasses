import { Glasses } from "../../consts/Glasses";
import { Group } from "three";

export interface StoreWithActiveGlasses {
  glasses: {
    active_glasses: number | string | undefined;
    list: Glasses[];
    files: Record<string, Group>;
  };
}
