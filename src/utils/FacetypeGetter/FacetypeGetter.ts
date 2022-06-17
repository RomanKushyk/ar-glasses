import { EFacetypes } from "../../enums/EFacetypes.js";
import NN from "./nn/NN.js";
import { Vector3 } from "three";
import IFacetype from "../../interfaces/Facetype.js";
let facetype_recognition_preset = require("./presets/facetype_recognition_result.json");

let nn = new NN();

let detections: any[] = [];
const DETECTIONS = 600;

let trainee = [];

nn.Upload(facetype_recognition_preset);

export interface IFacelines {
  h1: number;
  h2: number;
  h3: number;
  v1: number;
  a4: number;
  a3: number;
  a2: number;
}

export default (keypoints: any): IFacetype => {
  let getLengthFromIndexedPoints = (i1: number, i2: number): number => {
    return new Vector3().copy(keypoints[i1]).sub(keypoints[i2]).length();
  };

  let getAngleFromIndexedPoints = (
    i1: number,
    i2: number,
    i3: number
  ): number => {
    return new Vector3()
      .copy(keypoints[i1])
      .sub(keypoints[i2])
      .normalize()
      .angleTo(
        new Vector3().copy(keypoints[i2]).sub(keypoints[i3]).normalize()
      );
  };

  let facedata = {
    L1: 0,
    L2: 0,
    L3: 0,
    L4: 0,
    L5: 0,
    L6: 0,
    L7: 0,

    R1: 0, // L1 / L2
    R2: 0, // L1 / L3
    R3: 0, // L4 / L3
    R4: 0, // L5 / L3
    R5: 0, // L7 / L6
    R6: 0, // L7 / L3

    A1: 0,
    A2: 0,
    A3: 0,
    A4: 0,
    A5: 0,
  };


  facedata.L1 = getLengthFromIndexedPoints(151, 168);
  facedata.L2 = getLengthFromIndexedPoints(70, 300);
  facedata.L3 = getLengthFromIndexedPoints(151, 175);
  facedata.L4 = getLengthFromIndexedPoints(123, 352);
  facedata.L5 = getLengthFromIndexedPoints(214, 434);
  facedata.L6 = getLengthFromIndexedPoints(17, 175);
  facedata.L7 = getLengthFromIndexedPoints(32, 262);

  facedata.R1 = facedata.L1 / facedata.L2;
  facedata.R2 = facedata.L1 / facedata.L3;
  facedata.R3 = facedata.L4 / facedata.L3;
  facedata.R4 = facedata.L5 / facedata.L3;
  facedata.R5 = facedata.L7 / facedata.L6;
  facedata.R6 = facedata.L7 / facedata.L3;

  facedata.A1 = getAngleFromIndexedPoints(175, 262, 434);
  facedata.A2 = getAngleFromIndexedPoints(262, 434, 352);
  facedata.A3 = getAngleFromIndexedPoints(434, 352, 300);
  facedata.A4 = getAngleFromIndexedPoints(352, 300, 151);
  facedata.A5 = getAngleFromIndexedPoints(151, 252, 175);

  let parsed_facedata = [
    [facedata.R1],
    [facedata.R2],
    [facedata.R3],
    [facedata.R4],
    [facedata.R5],
    [facedata.R6],
    [facedata.A1],
    [facedata.A2],
    [facedata.A3],
    [facedata.A4],
    [facedata.A5],
  ]

  let result = nn.Activation(parsed_facedata).map((i: any) => i[0]);

  result = result.indexOf(Math.max(...result));

  detections.push(result);

  let facetype_index = NaN;

  if (detections.length == DETECTIONS) {
    let typelist = [0, 0, 0, 0, 0, 0];
    detections.forEach((v) => {
      for (let i in typelist) {
        if (v == i) {
          typelist[i] += 1;
        }
      }
    });

    facetype_index = typelist.indexOf(Math.max(...typelist));

    detections = [];
  }

  return {
    type: facetype_index,
    current_detections: detections.length,
    detections: DETECTIONS,
  };
};
