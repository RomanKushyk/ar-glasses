import "./App.css";
import Webcam from "react-webcam";
import { useRef, useEffect, useState } from "react";
import * as faceMesh from "@mediapipe/face_mesh";

import "@tensorflow-models/face-detection";
import Scene from "./Scene.js";

import "@tensorflow/tfjs-backend-webgl";

import * as FaceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
function App() {
  const webcamRef = useRef(null);
  const appDivRef = useRef(null);

  const scene = new Scene();

  const runFacemesh = async () => {
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
        detectorConfig
      );
    } catch (e) {
      alert(e);
    }
    // const net = await facemesh.load();
    if(detector)
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

    if (!scene.created) {
      scene.setUp(appDivRef.current, webcamRef.current.video);
    }
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
