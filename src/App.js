import "./App.css";
import Webcam from "react-webcam"
import { useRef, useEffect, useState } from "react";

import Scene from "./Scene.js";
import runFacemesh from "./utils/tf_setup";

import ControlPanel from "./components/ControlPanel/ControlPanel";

const scene = new Scene();

function App() {
  const webcamRef = useRef(null);
  const appDivRef = useRef(null);

  const [glasses_state, updateGlassesState] = useState({
    active: undefined,
    list: [],
  });

  runFacemesh(scene, appDivRef, webcamRef, () => {
    updateGlassesState({
      active: scene.glasses_controller.glasses_list[0].id,
      list: scene.glasses_controller.glasses_list,
    });

    scene.updateGlasses(scene.glasses_controller.glasses_list[0].id);
  });

  let changeActiveGlasses = (id) => {
    updateGlassesState({
      active: id,
      list: scene.glasses_controller.glasses_list,
    });
    scene.updateGlasses(id);
  }

  return (
    <div className="App" ref={appDivRef}>
      <Webcam ref={webcamRef} className="webcam"></Webcam>
      <ControlPanel onGlassesClick={changeActiveGlasses} glasses={glasses_state.list} active_glasses={glasses_state.active} />
    </div>
  );
}

export default App;
