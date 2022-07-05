import { EGlassesType } from "../../enums/EGlassesType";

export const glassesTypesList: {
  name: EGlassesType;
  imgPath: string;
}[] = [
  {
    name: EGlassesType.all,
    imgPath: "assets/user/glasses-types/all.png",
  },
  {
    name: EGlassesType.sunglasses,
    imgPath: "assets/user/glasses-types/sunglasses.png",
  },
  {
    name: EGlassesType.eye,
    imgPath: "assets/user/glasses-types/eyeglasses.png",
  },
];
