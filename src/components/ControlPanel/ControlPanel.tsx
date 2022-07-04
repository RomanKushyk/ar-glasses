import "./control-panel.scss";
import { observer } from "mobx-react-lite";
import { useContext } from "react";

import { Store, StoreContext } from "../../services/store/app/store";
import { saveSnapshotFromCanvas } from "../../utils/createSnapshot/saveSnapshotFromCanvas";
import { EFacetypes } from "../../enums/EFacetypes";

const ControlPanel = observer(() => {
  const store: Store = useContext(StoreContext);
  const glasses: JSX.Element[] = [];
  let Inner: JSX.Element[] = [];

  store.glasses.list.forEach((element) => {
    glasses.push(
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
    );
  });

  if (Number.isNaN(store.facetype.type)) {
    Inner = [
      <span key={0}>
        Facetype detection{" "}
        {Math.round(
          (store.facetype.current_detections / store.facetype.detections) * 100
        )}
        %
      </span>,
    ];
  } else {
    Inner = [
      <div key={2} className="control-panel__tip">
        {EFacetypes[store.facetype.type]}
      </div>,
      <div key={0} className="control-panel__glasses">
        {glasses}
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
    ];
  }

  return <div className="control-panel">{Inner}</div>;
});

export default ControlPanel;
