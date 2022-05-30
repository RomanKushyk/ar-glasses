import "./App.scss";
import Webcam from "react-webcam";
import { useRef, useEffect, useState } from "react";

import runFacemesh from "./utils/tf_setup";
import store, { StoreContext } from "./services/store/app/store";

import ControlPanel from "./components/ControlPanel/ControlPanel";
import Preloader from "./components/Preloader/Preloader";

let TFSetupOptions = {
  store: store,
  webcamRef: null,
  appDivRef: null,
  cb: null,
};

runFacemesh(TFSetupOptions, () => {
  store.newReadyState(true);
});

function App() {
  const webcamRef = useRef(null);
  const appDivRef = useRef(null);

  useEffect(() => {
    TFSetupOptions.appDivRef = appDivRef;
    TFSetupOptions.webcamRef = webcamRef;
  });

  const [glasses_state, updateGlassesState] = useState({
    active: undefined,
    list: [],
  });

  TFSetupOptions.cb = async () => {
    store.updateGlassesList();
    store.newActiveGlasses(store.glasses.list[0].id);
    store.newReadyState(true);
  };

  return (
    <div className="App" ref={appDivRef}>
      <Preloader store={store} />

      <Webcam ref={webcamRef} className="webcam"/>

      <StoreContext.Provider value={store}>
        <ControlPanel />
      </StoreContext.Provider>
    </div>
  );
}

export default App;
