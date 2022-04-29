import "./App.css";
import Webcam from "react-webcam";
import { useRef, useEffect, useState } from "react";
import * as faceMesh from "@mediapipe/face_mesh";
import '@tensorflow-models/face-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import * as FaceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import Scene from "./Scene.js";

tfjsWasm.setWasmPaths(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${
        tfjsWasm.version_wasm}/dist/`);




function App() {
  const webcamRef = useRef(null);
  const appDivRef = useRef(null);

  const scene = new Scene();

  const runFacemesh = async () => {
    const model = FaceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;

    const detectorConfig = {
      runtime: "tfjs", // or 'tfjs'
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`,
    };

    const detector = await FaceLandmarksDetection.createDetector(
      model,
      detectorConfig
    );
    // const net = await facemesh.load();

    setInterval(() => {
      detect(detector);
    }, 1);
  };

  const detect = async (detector) => {
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

    scene.setUpSize(
      document.body.offsetWidth,
      document.body.offsetHeight,
      videoWidth,
      videoHeight
    );

    if (!scene.created) scene.setUp(appDivRef.current);
    if (scene.created && face.length > 0) {
      scene.drawScene(face);
    }
  };

  runFacemesh();

  return (
    <div className="App" ref={appDivRef}>
      <Webcam ref={webcamRef} className="webcam"></Webcam>
    </div>
  );
}

export default App;
