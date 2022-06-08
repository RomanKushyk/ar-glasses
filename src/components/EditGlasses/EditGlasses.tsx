import './edit-glasses.scss';

import {ChangeEvent, FC, useContext, useEffect, useState} from 'react';
import { StoreContext } from '../../services/store/AdminPage/store';
import {useParams} from 'react-router-dom';
import {EditGlassesOptions} from '../../utils/EditGlassesOptions';

enum Input {
  positionX = 'positionX',
  positionY = 'positionY',
  positionZ = 'positionZ',
  scaleX = 'scaleX',
  scaleY = 'scaleY',
  scaleZ = 'scaleZ',
  prevPositionX = 'positionX',
  prevPositionY = 'positionY',
  prevPositionZ = 'positionZ',
  prevRotateX = 'rotateX',
  prevRotateY = 'rotateY',
  prevRotateZ = 'rotateZ',
  prevScaleX = 'scaleX',
  prevScaleY = 'scaleY',
  prevScaleZ = 'scaleZ',
}

enum Option {
  position = 'Position',
  scale = 'Scale',
  prevPosition = 'Preview position',
  prevRotate = 'Preview rotate',
  prevScale = 'Preview scale',
}

export const EditGlasses: FC = () => {
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [positionZ, setPositionZ] = useState<number>(0);
  const [scaleX, setScaleX] = useState<number>(0);
  const [scaleY, setScaleY] = useState<number>(0);
  const [scaleZ, setScaleZ] = useState<number>(0);
  const [prevPositionX, setPrevPositionX] = useState<number>(0);
  const [prevPositionY, setPrevPositionY] = useState<number>(0);
  const [prevPositionZ, setPrevPositionZ] = useState<number>(0);
  const [prevRotateX, setPrevRotateX] = useState<number>(0);
  const [prevRotateY, setPrevRotateY] = useState<number>(0);
  const [prevRotateZ, setPrevRotateZ] = useState<number>(0);
  const [prevScaleX, setPrevScaleX] = useState<number>(0);
  const [prevScaleY, setPrevScaleY] = useState<number>(0);
  const [prevScaleZ, setPrevScaleZ] = useState<number>(0);

  const [optionBlockName, setOptionBlockName] = useState<Option>(Option.position);

  const store = useContext(StoreContext);
  const params = useParams();
  const glassesEditor = new EditGlassesOptions(); //!!!!! чому я його не використав
  const currentGlasses = store.glasses.list
    .find(item => params.glassesId === item.id);

  useEffect(() => {
    if (currentGlasses) {
      setPositionX(currentGlasses.options.position[0]);
      setPositionY(currentGlasses.options.position[1]);
      setPositionZ(currentGlasses.options.position[2]);

      setScaleX(currentGlasses.options.scale[0]);
      setScaleY(currentGlasses.options.scale[1]);
      setScaleZ(currentGlasses.options.scale[2]);

      setPrevPositionX(currentGlasses.snapshot_options.position[0]);
      setPrevPositionY(currentGlasses.snapshot_options.position[1]);
      setPrevPositionZ(currentGlasses.snapshot_options.position[2]);

      setPrevRotateX(currentGlasses.snapshot_options.rotation[0]);
      setPrevRotateY(currentGlasses.snapshot_options.rotation[1]);
      setPrevRotateZ(currentGlasses.snapshot_options.rotation[2]);

      setPrevScaleX(currentGlasses.snapshot_options.scale[0]);
      setPrevScaleY(currentGlasses.snapshot_options.scale[1]);
      setPrevScaleZ(currentGlasses.snapshot_options.scale[2]);

      // glassesEditor.changePosition(currentGlasses, positionX, positionY, positionZ);
    }
  }, [currentGlasses]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numValue = +value;

    switch (name) {
      case Input.positionX:
        if (!isNaN(numValue) || value.slice(1) === '.') {
          setPositionX(numValue);
        }
        break;

      case Input.positionY:
        if (!isNaN(numValue)) {
          setPositionY(numValue);
        }
        break;

      case Input.positionZ:
        if (!isNaN(numValue)) {
          setPositionZ(numValue);
        }
        break;

      case Input.scaleX:
        if (!isNaN(numValue)) {
          setScaleX(numValue);
        }
        break;

      case Input.scaleY:
        if (!isNaN(numValue)) {
          setScaleY(numValue);
        }
        break;

      case Input.scaleZ:
        if (!isNaN(numValue)) {
          setScaleZ(numValue);
        }
        break;

      case Input.prevPositionX:
        if (!isNaN(numValue)) {
          setPrevPositionX(numValue);
        }
        break;

      case Input.prevPositionY:
        if (!isNaN(numValue)) {
          setPrevPositionY(numValue);
        }
        break;

      case Input.prevPositionZ:
        if (!isNaN(numValue)) {
          setPrevPositionZ(numValue);
        }
        break;

      case Input.prevRotateX:
        if (!isNaN(numValue)) {
          setPrevRotateX(numValue);
        }
        break;

      case Input.prevRotateY:
        if (!isNaN(numValue)) {
          setPrevRotateY(numValue);
        }
        break;

      case Input.prevRotateZ:
        if (!isNaN(numValue)) {
          setPrevRotateZ(numValue);
        }
        break;

      case Input.prevScaleX:
        if (!isNaN(numValue)) {
          setPrevScaleX(numValue);
        }
        break;

      case Input.prevScaleY:
        if (!isNaN(numValue)) {
          setPrevScaleY(numValue);
        }
        break;

      case Input.prevScaleZ:
        if (!isNaN(numValue)) {
          setPrevScaleZ(numValue);
        }
        break;
    }
  };

  const createInputBlock = (
    name: string,
    value: number,
    callback: (event: ChangeEvent<HTMLInputElement>) => void,
  ) => {
    return (
      <div
        className="params-container__param-item"
        key={name}
      >
            <span className="params-container__param-title">
            {name.slice(-1) + ':'}
          </span>

        <div className="params-container__inputs-container">
          <input
            className="params-container__range-input"
            type="range"
            name={name}
            min={0}
            max={100}
            value={value}
            onChange={callback}
          />

          <input
            className="params-container__additional-input"
            type="text"
            name={name}
            value={value}
            onChange={callback}
          />
        </div>
      </div>
    );
  };

  const createOptionBlock = (blockName: Option) => {
    switch (blockName) {
      case Option.position:
        return [
        createInputBlock(Input.positionX, positionX, handleChange),
        createInputBlock(Input.positionY, positionY, handleChange),
        createInputBlock(Input.positionZ, positionZ, handleChange),
          ];

      case Option.scale:
        return [
          createInputBlock(Input.scaleX, scaleX, handleChange),
          createInputBlock(Input.scaleY, scaleY, handleChange),
          createInputBlock(Input.scaleZ, scaleZ, handleChange),
        ];

      case Option.prevPosition:
        return [
          createInputBlock(Input.prevPositionX, prevPositionX, handleChange),
          createInputBlock(Input.prevPositionY, prevPositionY, handleChange),
          createInputBlock(Input.prevPositionZ, prevPositionZ, handleChange),
        ];

      case Option.prevRotate:
        return [
          createInputBlock(Input.prevRotateX, prevRotateX, handleChange),
          createInputBlock(Input.prevRotateY, prevRotateY, handleChange),
          createInputBlock(Input.prevRotateZ, prevRotateZ, handleChange),
        ];

      case Option.prevScale:
        return [
          createInputBlock(Input.prevScaleX, prevScaleX, handleChange),
          createInputBlock(Input.prevScaleY, prevScaleY, handleChange),
          createInputBlock(Input.prevScaleZ, prevScaleZ, handleChange),
        ];
    }
  };

  return (
    <section className="edit-glasses">
      <div className="edit-glasses__views-container">
        <div className="edit-glasses__top-panel">
          <input
            className="edit-glasses__input"
            type="text"
            name="glasses-name"
            placeholder="Glasses name"
            // value={}
            // onChange={}
          />

          <button
            className="edit-glasses__button"
            // onClick={() => {}}
          >Save</button>
        </div>

        <div className="edit-glasses__scene">
        </div>

        <div className="edit-glasses__preview-scene">
        </div>
      </div>

      <div className="edit-glasses__params-container params-container">
        <div className="params-container__params-list">
          <span className="params-container__title">
            {optionBlockName + ':'}
          </span>

          {createOptionBlock(optionBlockName)}
        </div>

        <div className="params-container__navigation-panel">
          <button
            className="params-container__button params-container__button_scale"
            type="button"
            title="Scale"
            onClick={() => {
              setOptionBlockName(Option.scale)
            }}
          />

          <button
            className="params-container__button params-container__button_position"
            type="button"
            title="Position"
            onClick={() => {
              setOptionBlockName(Option.position)
            }}
          />

          <button
            className="params-container__button params-container__button_rotate"
            type="button"
            title="Rotate"
            onClick={() => {
              //setOptionBlockName(Option.rotate) //додати обертання в єнами і в головний тип
            }}
          />

          <button
            className="params-container__button params-container__button_three"
            type="button"
            title="Three"
            // onClick={}
          />
        </div>
      </div>
    </section>
  );
};
