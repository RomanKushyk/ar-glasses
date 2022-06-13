import NN from "./nn/NN.js";
let facetype_recognition_preset = require("./presets/facetype_recognition.json");

let nn = new NN();

let facetype = [];

nn.Upload(facetype_recognition_preset);

let results = [];

enum _EFacetype {
  Square = 1,
  Round = 2,
  Oval = 3,
  Rectangle = 4,
  Triangle = 5,
  Heart = 6,
}

export interface IFacelines {
  h1: number;
  h2: number;
  h3: number;
  v1: number;
  a4: number;
  a3: number;
  a2: number;
}

export default (data: IFacelines): _EFacetype => {
  let { h1, h2, h3, v1, a4, a3, a2 } = data;

  let ratios = [
    [h1 / v1],
    [h2 / v1],
    [h3 / v1],
    [h1 / h2],
    [h3 / h2],
    [a4],
    [a3],
    [a2],
  ];

  let result = nn.Activation(ratios).map((i) => i[0]);

  result = result.indexOf(Math.max(...result));

  facetype.push(result);

  if (facetype.length == 300) {
    let typelist = [0, 0, 0, 0, 0, 0];
    facetype.forEach((v) => {
      for (let i in typelist) {
        if (v == i) {
          typelist[i] += 1;
        }
      }
    });

    let facetype_index = typelist.indexOf(Math.max(...typelist));

    console.log(_EFacetype[facetype_index + 1])

    facetype = [];
  }

  return _EFacetype.Heart;
};
