import { EFacetypes } from "../enums/EFacetypes";

export default interface IFacetype {
    type: EFacetypes;
    current_detections: number;
    detections: number;
  }