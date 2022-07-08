import "./control-panel.scss";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";

import { Store, StoreContext } from "../../services/store/app/store";
import { saveSnapshotFromCanvas } from "../../utils/createSnapshot/saveSnapshotFromCanvas";
import { EFaceTypes } from "../../enums/EFaceTypes";
import { Glasses } from "../../interfaces/consts/Glasses";

const ControlPanel = observer(() => {
  const store: Store = useContext(StoreContext);
  const [glassesBlocksList, setGlassesBlockList] = useState<JSX.Element[]>([]);
  const [Inner, setInner] = useState<JSX.Element[]>([]);
  const [visibleGlassesList, setVisibleGlassesList] = useState<Glasses[]>(
    store.glasses.list
  );

  useEffect(() => {
    setVisibleGlassesList(
      store.glasses.list.filter(
        (element) => element.faceTypes && element.faceTypes[store.facetype.type]
      )
    );
  }, [store.facetype.type, store.glasses.list]);

  useEffect(() => {
    if (
      !store.glasses.initialized &&
      !Number.isNaN(store.facetype.type) &&
      visibleGlassesList.length
    ) {
      store.newActiveGlasses(visibleGlassesList[0].id);
      store.glasses.initialized = true;
    }
  }, [store.glasses.initialized, store.facetype.type, visibleGlassesList]);

  useEffect(() => {
    setGlassesBlockList(
      visibleGlassesList.map((element) => (
        <div
          key={element.id}
          onClick={() => {
            store.newActiveGlasses(element.id);
          }}
          className={
            "control-panel__button" +
            (element.id === store.glasses.active_glasses
              ? " control-panel__button_active"
              : "")
          }
        >
          <img
            alt=""
            src={element.preview_file_path}
            className="control-panel__img-preview"
          />
        </div>
      ))
    );
  }, [visibleGlassesList]);

  useEffect(() => {
    if (Number.isNaN(store.facetype.type)) {
      setInner([
        <span key={0}>
          Facetype detection{" "}
          {Math.round(
            (store.facetype.current_detections / store.facetype.detections) *
              100
          )}
          %
        </span>,
      ]);
    } else {
      setInner([
        <div key={2} className="control-panel__tip">
          {EFaceTypes[store.facetype.type]}
        </div>,
        <div key={0} className="control-panel__glasses">
          {glassesBlocksList}
        </div>,
        <div
          key={1}
          className="control-panel__button control-panel__screenshot"
          onClick={() => {
            if (
              store.scene.canvas &&
              store.scene.video instanceof HTMLVideoElement
            ) {
              saveSnapshotFromCanvas(store.scene.canvas, store.scene.video);
            } else {
              console.error(
                "canvas type is",
                store.scene.canvas instanceof HTMLCanvasElement
              );
              console.error(
                "video type is",
                store.scene.video instanceof HTMLVideoElement
              );
            }
          }}
        >
          <i className="fa-solid fa-camera-retro"></i>
        </div>,
      ]);
    }
  }, [
    glassesBlocksList,
    store.facetype.current_detections,
    store.facetype.detections,
    store.facetype.type,
    store.scene.canvas,
    store.scene.video,
  ]);

  return <div className="control-panel">{Inner}</div>;
});

export default ControlPanel;
