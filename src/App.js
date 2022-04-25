import logo from './logo.svg';
import './App.css';

import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { useRef, useEffect } from 'react';
import { drawMesh } from './utilities';

import Scene from "./Scene.js";
import { ifft } from '@tensorflow/tfjs';

function App() {
  const webcamRef = useRef(null);
  const appDivRef = useRef(null);

  const scene = new Scene();

  useEffect(() => {
    if (!scene.created)
      scene.setUp(appDivRef.current)
  });

  const runFacemesh = async () => {
    const net = await facemesh.load()

    setInterval(() => {
      detect(net);
    }, 1)
  }

  const detect = async (net) => {
    if (typeof webcamRef.current == 'undefined'
      || webcamRef.current == null) {
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

    const face = await net.estimateFaces(video);

    if (scene.created && face.length > 0) {
      scene.drawScene(face)
    }
  }

  runFacemesh();

  return (
    <div className="App" ref={appDivRef}>
      <Webcam ref={webcamRef} className="webcam"></Webcam>
    </div>
  );
}

export default App;
