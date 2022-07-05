import { ESex } from "../../enums/ESex";

export const sexList: {
  name: ESex;
  imgPath: string;
}[] = [
  {
    name: ESex.male,
    imgPath: "assets/user/sex/man.png",
  },
  {
    name: ESex.female,
    imgPath: "assets/user/sex/woman.png",
  },
];
