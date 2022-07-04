import "./App.scss";
import Webcam from "react-webcam";
import { useRef, useEffect } from "react";

import store, { StoreContext } from "./services/store/app/store";

import ControlPanel from "./components/ControlPanel/ControlPanel";
import Preloader from "./components/Preloader/Preloader";
import tensorflowSetUp from "./utils/tensorflow_setup/tensorflowSetUp";
import FacetypeGetter from "./utils/FacetypeGetter/FacetypeGetter";

// let TFSetupOptions = {
//   store: store,
//   webcamRef: null,
//   appDivRef: null,
//   cb: null,
// };

// runFacemesh(TFSetupOptions, () => {
//   store.updateReadyState(true);
// });

function App() {
  const webcamRef = useRef(null);
  const appDivRef = useRef(null);

  // useEffect(() => {
  //   signInWithEmailAndPassword(
  //     firebaseAuth,
  //     "rkushyk@qualium-systems.com",
  //     "1q2w3e4r"
  //   );
  // }, []); //! For develop!!!!

  // useEffect(() => {
  //   TFSetupOptions.appDivRef = appDivRef;
  //   TFSetupOptions.webcamRef = webcamRef;
  // });

  useEffect(() => {
    const initialize = async () => {
      if (store.tf.initiated) {
        return;
      }

      store.tf.initiated = true;

      let onCreate = async () => {
        await store.updateGlassesList();
        await store.loadGlassesFiles();
        store.updateReadyState(true);
      };

      await onCreate();

      await tensorflowSetUp({
        source: webcamRef,
        store: store,
        listeners: {
          onCreate: async () => {
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            await store.scene.setUpSize(
              document.body.offsetWidth,
              document.body.offsetHeight,
              videoWidth,
              videoHeight
            );

            await store.scene.setUpScene(
              appDivRef.current,
              webcamRef.current.video,
              store
            );

            await store.newActiveGlasses(store.glasses.list[0].id);
          },
          onDraw: async () => {
            if (!store.scene.created) {
              return;
            }

            if (store.tf.facedata && store.tf.facedata.length > 0) {
              await store.scene.drawScene(store.tf.facedata);

              if (Number.isNaN(store.facetype.type)) {
                let result = await FacetypeGetter(
                  store.tf.facedata[0].keypoints
                );
                await store.updateFacetype(result);
              }
            }
          },
        },
      });
    };

    initialize();
  });

  // TFSetupOptions.cb = async () => {
  //   await store.updateGlassesList();
  //   await store.loadGlassesFiles();
  //   await store.newActiveGlasses(store.glasses.list[0].id);
  //   store.updateReadyState(true);
  // };

  return (
    <div className="App" ref={appDivRef}>
      <Preloader store={store} />

      <Webcam ref={webcamRef} className="webcam" />

      <StoreContext.Provider value={store}>
        <ControlPanel />
      </StoreContext.Provider>
    </div>
  );
}

export default App;
