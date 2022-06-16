import * as faceMesh from "@mediapipe/face_mesh";
import "@tensorflow-models/face-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as FaceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import FacetypeGetter from "./FacetypeGetter/FacetypeGetter";

const detect = async (detector, store, appDivRef, webcamRef, cb) => {
  if (typeof webcamRef.current == "undefined" || webcamRef.current == null) {
    return;
  }

  if (webcamRef.current.video.readyState !== 4) {
    return;
  }

  const video = webcamRef.current.video;
  const videoWidth = webcamRef.current.video.videoWidth;
  const videoHeight = webcamRef.current.video.videoHeight;

  webcamRef.current.video.width = videoWidth;
  webcamRef.current.video.height = videoHeight;

  const face = await detector.estimateFaces(video);

  store.scene.setUpSize(
    document.body.offsetWidth,
    document.body.offsetHeight,
    videoWidth,
    videoHeight
  );

  if (!store.scene.created) {
    store.scene.setUpScene(appDivRef.current, webcamRef.current.video);
    cb();
  }

  if (store.scene.created && face.length > 0) {
    store.scene.drawScene(face);

    if (Number.isNaN(store.facetype.type)) {
      let result = FacetypeGetter(face[0].keypoints);
      store.updateFacetype(result);
    }
  }
};

export default async (refs) => {
  const model = FaceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  let detector;

  const detectorConfig = {
    runtime: "tfjs",
    refineLandmarks: false,
    triangulateMesh: false,
    maxFaces: 1,
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`,
  };

  try {
    detector = await FaceLandmarksDetection.createDetector(
      model,
      detectorConfig,
    );
  } catch (e) {
    console.error(e);
  }

  let draw = () => {
    if (refs.appDivRef && refs.webcamRef && refs.cb && detector)
      detect(detector, refs.store, refs.appDivRef, refs.webcamRef, refs.cb);
    requestAnimationFrame(draw);
  };
  draw();
};
