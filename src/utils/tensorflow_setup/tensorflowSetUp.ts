import React from "react";
import * as faceMesh from "@mediapipe/face_mesh";
import "@tensorflow-models/face-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as FaceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { IStoreForTF } from "../../interfaces/services/store/StoreForTF";

const detect = async (options: {
  detector: FaceLandmarksDetection.FaceLandmarksDetector;
  source:
    | React.MutableRefObject<Webcam>
    | {
        current: undefined | HTMLCanvasElement;
      };
  store: IStoreForTF;
  listeners: {
    onDraw: () => void;
  };
}) => {
  let source: HTMLCanvasElement | HTMLVideoElement;
  let result: any;

  if (!options.source.current) {
    return;
  }

  if (
    options.source.current instanceof Webcam &&
    (!options.source.current.video ||
      options.source.current.video.readyState !== 4)
  ) {
    return;
  }

  if (
    options.source.current instanceof Webcam &&
    options.source.current.video &&
    options.source.current
  ) {
    source = options.source.current.video;
    result = await options.detector.estimateFaces(source);
  }

  if (options.source.current instanceof HTMLCanvasElement) {
    source = options.source.current;
    result = await options.detector.estimateFaces(source);
  }

  options.store.tf.facedata = result;

  options.listeners.onDraw();
};

const tensorflowSetUp = async (options: {
  source:
    | React.MutableRefObject<Webcam>
    | {
        current: undefined | HTMLCanvasElement;
      };
  store: IStoreForTF;
  listeners: {
    onCreate: () => void;
    onDraw: () => void;
  };
}) => {
  const model = FaceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;

  const detectorConfig = {
    runtime: "mediapipe" as "mediapipe",
    refineLandmarks: false,
    triangulateMesh: false,
    maxFaces: 1,
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`,
  };

  let detector: FaceLandmarksDetection.FaceLandmarksDetector | undefined;

  try {
    detector = await FaceLandmarksDetection.createDetector(
      model,
      detectorConfig
    );
  } catch (e) {
    console.error(e);
  }

  let first = true;

  let draw = async () => {
    window.requestAnimationFrame(draw);

    if (!detector) return;

    await detect({
      detector,
      store: options.store,
      source: options.source,
      listeners: options.listeners,
    });

    if (first) {
      options.listeners.onCreate();
      first = false;
    }
  };

  draw();
};

export default tensorflowSetUp;
