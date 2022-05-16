import { useRef, useEffect, useState } from "react";
import "./control-panel.css";
import { observer } from "mobx-react-lite";
import { useContext, createContext } from "react";

import {StoreContext} from "../../store/Store.ts";

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
        {element.id}
      </div>
    );
  });

  return (
    <div className="control-panel">
      <div className="control-panel__glasses">{glasses}</div>
      <div className="control-panel__button control-panel__screenshot">
        <i className="fa-solid fa-camera-retro"></i>
      </div>
    </div>
  );
});

export default ControlPanel;
