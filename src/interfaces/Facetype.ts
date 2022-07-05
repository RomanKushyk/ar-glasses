import { EFaceTypes } from "../enums/EFaceTypes";

export default interface IFacetype {
  type: EFaceTypes;
  current_detections: number;
  detections: number;
}
