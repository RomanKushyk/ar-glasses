import { useRef, useEffect, useState, Fragment } from "react";
import "./control-panel.scss";
import { observer } from "mobx-react-lite";
import { useContext, createContext } from "react";

import { StoreContext } from "../../store/Store.ts";
import { saveSnapshotFromCanvas } from "../../utils/saveSnapshotFromCanvas.ts";
import { EFacetypes } from "enums/EFacetypes";

const ControlPanel = observer(() => {
  const store = useContext(StoreContext);
  let glasses = [];

  store.glasses.list.forEach((element) => {
    glasses.push(
      <div
        key={element.id}
        onClick={() => {
          store.newActiveGlasses(element.id);
        }}
        className={
          "control-panel__button" +
          (element.id == store.glasses.active_glasses
            ? " control-panel__button_active"
            : "")
        }
      >
        <img
          alt={element.id.toString()}
          src={element.preview_file_path}
          className="control-panel__img-preview"
        />
      </div>
    );
  });

  let Inner = [];

  if (Number.isNaN(store.facetype.type)) {
    Inner = [
      <span key={0}>
        Facetype detection{" "}
        {Math.round((store.facetype.current_detections / store.facetype.detections) * 100)}%
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
          saveSnapshotFromCanvas(store.scene.canvas, store.scene.video);
        }}
      >
        <i className="fa-solid fa-camera-retro"></i>
      </div>,
    ];
  }

  return <div className="control-panel">{Inner}</div>;
});

export default ControlPanel;
