// @ts-ignore
import { saveFromUrl } from "./saveFromUrl.ts";

type SaveSnapshotFromCanvas = (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement
) => void;

export const saveSnapshotFromCanvas: SaveSnapshotFromCanvas = (
  canvas,
  video
) => {
  let scale: number;
  const strMime = "image/jpeg";

  const resulCanvas = document.createElement("canvas");
  resulCanvas.width = canvas.offsetWidth;
  resulCanvas.height = canvas.offsetHeight;

  const resultCanvasContext = resulCanvas.getContext("2d");

  if (
    video.videoWidth / video.videoHeight >
    canvas.offsetWidth / canvas.offsetHeight
  ) {
    scale = canvas.offsetHeight / video.videoHeight;
  } else {
    scale = canvas.offsetWidth / video.videoWidth;
  }

  const scaledVideoWidth = scale * video.videoWidth;
  const scaledVideoHeight = scale * video.videoHeight;
  const offsetX = (canvas.offsetWidth - scaledVideoWidth) / 2;
  const offsetY = (canvas.offsetHeight - scaledVideoHeight) / 2;

  resultCanvasContext?.drawImage(
    video,
    offsetX,
    offsetY,
    scaledVideoWidth,
    scaledVideoHeight
  );
  resultCanvasContext?.drawImage(
    canvas,
    0,
    0,
    video.offsetWidth,
    video.offsetHeight
  );

  saveFromUrl(resulCanvas.toDataURL(strMime), "snapshot.jpg");
};
