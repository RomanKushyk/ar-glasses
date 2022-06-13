import { saveFromUrl } from '../utils/saveFromUrl';
import { WebGLRenderer } from 'three';

type SaveSnapshotFromCanvas = (canvas: WebGLRenderer.domElement, video: HTMLVideoElement) => void;

export const saveSnapshotFromCanvas: SaveSnapshotFromCanvas = (canvas, video) => {
  let scale: number;
  const strMime = 'image/jpeg';

  const resulCanvas = document.createElement('canvas');
  resulCanvas.width = canvas.offsetWidth;
  resulCanvas.height = canvas.offsetHeight;

  const resultCanvasContext = resulCanvas.getContext('2d');

  if (video.width / video.height > canvas.offsetWidth / canvas.offsetHeight) {
    scale = canvas.offsetHeight / video.height;
  } else {
    scale = canvas.offsetWidth / video.width;
  }

  const scaledVideoWidth = scale * video.width;
  const scaledVideoHeight = scale * video.height;
  const offsetX = (canvas.offsetWidth - scaledVideoWidth) / 2;
  const correctedY = (canvas.offsetHeight - scaledVideoHeight) / 2;

  resultCanvasContext.drawImage(video, offsetX, correctedY, scaledVideoWidth, scaledVideoHeight);
  resultCanvasContext.drawImage(canvas, 0, 0, video.offsetWidth, video.offsetHeight);

  saveFromUrl(resulCanvas.toDataURL(strMime), 'snapshot.jpg');
};
