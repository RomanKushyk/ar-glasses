import React, { ChangeEvent } from "react";

export const createInputsBlock = (
  name: string,
  value: number = 0,
  callback: (event: ChangeEvent<HTMLInputElement>) => void,
  min: number = 0,
  max: number = 0,
  step: number = 0
) => {
  return (
    <div className="params-container__param-item" key={name}>
      <span className="params-container__param-title">
        {name.slice(-1) + ":"}
      </span>

      <div className="params-container__inputs-container">
        <input
          className="params-container__range-input"
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={callback}
        />

        <input
          className="params-container__additional-input"
          type="number"
          min={min}
          max={max}
          step={step}
          name={name}
          value={value}
          onChange={callback}
        />
      </div>
    </div>
  );
};
