import { useRef, useEffect, useState } from "react";
import "./control-panel.css";

function App(props) {
  let glasses = [];

  props.glasses.forEach((element) => {
    glasses.push(
      <div
        key={element.id}
        onClick={() => {
          props.onGlassesClick(element.id);
        }}
        className={
          "control-panel__button" +
          (element.id == props.active_glasses
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
}

export default App;
