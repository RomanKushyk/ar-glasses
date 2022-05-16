import "./App.css";
import Webcam from "react-webcam";
import { useRef, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

import Scene from "./scene/Scene.js";
import runFacemesh from "./utils/tf_setup";

import ControlPanel from "./components/ControlPanel/ControlPanel";
import Store from "./store/Store.ts";

const scene = new Scene();
const store = new Store();

let refs = {
  webcamRef: null,
  appDivRef: null,
  cb: null,
};

runFacemesh(scene, refs, () => {
  store.updateReadyState(true);
});

const Preloader = observer(({ store }) => {
  return (
    <div
      className={"preloader " + (!store.ready ? "preloader_active" : "")}
    >Loading...</div>
  );
});

function App() {
  const webcamRef = useRef(null);
  const appDivRef = useRef(null);

  useEffect(() => {
    refs.appDivRef = appDivRef;
    refs.webcamRef = webcamRef;
  });

  const [glasses_state, updateGlassesState] = useState({
    active: undefined,
    list: [],
  });

  let changeActiveGlasses = (id) => {
    updateGlassesState({
      active: id,
      list: scene.glasses_controller.glasses_list,
    });
    scene.updateGlasses(id);
  };

  refs.cb = () => {
    updateGlassesState({
      active: scene.glasses_controller.glasses_list[0].id,
      list: scene.glasses_controller.glasses_list,
    });

    scene.updateGlasses(scene.glasses_controller.glasses_list[0].id);
  };

  return (
    <div className="App" ref={appDivRef}>
      <Preloader store={store} />
      <Webcam ref={webcamRef} className="webcam"></Webcam>
      <ControlPanel
        onGlassesClick={changeActiveGlasses}
        glasses={glasses_state.list}
        active_glasses={glasses_state.active}
      />
    </div>
  );
}

export default App;
