import './edit-glasses.scss';

import cn from 'classnames';
import {ChangeEvent, FC, useContext, useEffect, useState} from 'react';
import { StoreContext } from '../../services/store/AdminPage/store';
import {useNavigate, useParams} from 'react-router-dom';
import {EditGlassesOptions} from '../../utils/EditGlassesOptions';
import {observer} from 'mobx-react-lite';
import {editGlassesFromList} from '../../api/firebase/store/glasses';

enum Input {
  positionX = 'positionX',
  positionY = 'positionY',
  positionZ = 'positionZ',
  scaleX = 'scaleX',
  scaleY = 'scaleY',
  scaleZ = 'scaleZ',
  prevPositionX = 'previewPositionX',
  prevPositionY = 'previewPositionY',
  prevPositionZ = 'previewPositionZ',
  prevRotateX = 'previewRotateX',
  prevRotateY = 'previewRotateY',
  prevRotateZ = 'previewRotateZ',
  prevScaleX = 'previewScaleX',
  prevScaleY = 'previewScaleY',
  prevScaleZ = 'previewScaleZ',
}

enum Option {
  position = 'Position',
  scale = 'Scale',
  three = 'three',
  prevPosition = 'Preview position',
  prevRotate = 'Preview rotate',
  prevScale = 'Preview scale',
  prevThree = 'Preview three',
}

enum View {
  main = 'Main',
  preview = 'Preview',
}

export const EditGlasses: FC = observer(() => {
  const store = useContext(StoreContext);
  const params = useParams();
  const navigate = useNavigate();

  const [optionsBlockName, setOptionsBlockName] = useState<Option>(Option.prevPosition);
  const [currentView, setCurrentView] = useState<View>(View.preview);
  const editor = new EditGlassesOptions();

  useEffect(() => {
    if (params.glassesId) {
      store.setSelected(params.glassesId)
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const value = event.target.value as unknown as number;

    if (store.glasses.selected) {
      switch (name) {
        case Input.positionX:
          editor.changePositionX(store.glasses.selected, value);
          break;

        case Input.positionY:
          editor.changePositionY(store.glasses.selected, value);
          break;

        case Input.positionZ:
          editor.changePositionZ(store.glasses.selected, value);
          break;

        case Input.scaleX:
          editor.changeScaleX(store.glasses.selected, value);
          break;

        case Input.scaleY:
          editor.changeScaleY(store.glasses.selected, value);
          break;

        case Input.scaleZ:
          editor.changeScaleZ(store.glasses.selected, value);
          break;

        case Input.prevPositionX:
          editor.changePreviewPositionX(store.glasses.selected, value);
          break;

        case Input.prevPositionY:
          editor.changePreviewPositionY(store.glasses.selected, value);
          break;

        case Input.prevPositionZ:
          editor.changePreviewPositionZ(store.glasses.selected, value);
          break;

        case Input.prevRotateX:
          editor.changePreviewRotationX(store.glasses.selected, value);
          break;

        case Input.prevRotateY:
          editor.changePreviewRotationY(store.glasses.selected, value);
          break;

        case Input.prevRotateZ:
          editor.changeRotationPreviewZ(store.glasses.selected, value);
          break;

        case Input.prevScaleX:
          editor.changePreviewScaleX(store.glasses.selected, value);
          break;

        case Input.prevScaleY:
          editor.changePreviewScaleY(store.glasses.selected, value);
          break;

        case Input.prevScaleZ:
          editor.changePreviewScaleZ(store.glasses.selected, value);
          break;

        default:
          break;
      }
    }
  };

  const createNavigationPanel = (view: View) => {
    switch (view) {
      case View.main:
        return (
          <>
            <button
              className="params-container__button params-container__button_scale"
              type="button"
              title="Scale"
              onClick={() => {
                setOptionsBlockName(Option.scale)
              }}
            />

            <button
              className="params-container__button params-container__button_position"
              type="button"
              title="Position"
              onClick={() => {
                setOptionsBlockName(Option.position)
              }}
            />

            <button
              className="params-container__button params-container__button_three"
              type="button"
              title="Three"
              onClick={() => {
                setOptionsBlockName(Option.three)
              }}
            />
          </>
        );

      case View.preview:
        return (
          <>
            <button
              className="params-container__button params-container__button_scale"
              type="button"
              title="Scale"
              onClick={() => {
                setOptionsBlockName(Option.prevScale)
              }}
            />

            <button
              className="params-container__button params-container__button_position"
              type="button"
              title="Position"
              onClick={() => {
                setOptionsBlockName(Option.prevPosition)
              }}
            />

            <button
              className="params-container__button params-container__button_rotate"
              type="button"
              title="Rotate"
              onClick={() => {
                setOptionsBlockName(Option.prevRotate)
              }}
            />

            <button
              className="params-container__button params-container__button_three"
              type="button"
              title="Three"
              onClick={() => {
                setOptionsBlockName(Option.prevThree)
              }}
            />
          </>
        );
    }
  }

  const createInputBlock = (
    name: string,
    value: number,
    callback: (event: ChangeEvent<HTMLInputElement>) => void,
  ) => {
    const inputMin = -50;
    const inputMax = 50;
    const inputStep = 0.01;

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
            min={inputMin}
            max={inputMax}
            step={inputStep}
            value={value}
            onChange={callback}
          />

          <input
            className="params-container__additional-input"
            type="number"
            min={inputMin}
            max={inputMax}
            step={inputStep}
            name={name}
            value={value}
            onChange={callback}
          />
        </div>
      </div>
    );
  };

  const createOptionBlock = (blockName: Option) => {
    if (store.glasses.selected) {
      const options = store.glasses.selected.options;
      const prevOptions = store.glasses.selected.snapshot_options;

      switch (blockName) {
        case Option.position:
          return [
            createInputBlock(Input.positionX, options.position[0], handleChange),
            createInputBlock(Input.positionY, options.position[1], handleChange),
            createInputBlock(Input.positionZ, options.position[2], handleChange),
          ];

        case Option.scale:
          return [
            createInputBlock(Input.scaleX, options.scale[0], handleChange),
            createInputBlock(Input.scaleY, options.scale[1], handleChange),
            createInputBlock(Input.scaleZ, options.scale[2], handleChange),
          ];

        case Option.prevPosition:
          return [
            createInputBlock(Input.prevPositionX, prevOptions.position[0], handleChange),
            createInputBlock(Input.prevPositionY, prevOptions.position[1], handleChange),
            createInputBlock(Input.prevPositionZ, prevOptions.position[2], handleChange),
          ];

        case Option.prevRotate:
          return [
            createInputBlock(Input.prevRotateX, prevOptions.rotation[0], handleChange),
            createInputBlock(Input.prevRotateY, prevOptions.rotation[1], handleChange),
            createInputBlock(Input.prevRotateZ, prevOptions.rotation[2], handleChange),
          ];

        case Option.prevScale:
          return [
            createInputBlock(Input.prevScaleX, prevOptions.scale[0], handleChange),
            createInputBlock(Input.prevScaleY, prevOptions.scale[1], handleChange),
            createInputBlock(Input.prevScaleZ, prevOptions.scale[2], handleChange),
          ];

        default:
          break;
      }
    }
  };

  const handleSave = async () => {
    if (store.glasses.selected) {
      const { id, ...data } = store.glasses.selected;

      await editGlassesFromList(id, data);
      navigate('../new');
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
            value={store.glasses.selected?.name}
            onChange={event => {
              if (store.glasses.selected) {
                editor.changeName(store.glasses.selected, event.target.value);
              }
            }}
          />

          <button
            className="edit-glasses__button"
            onClick={() => {
              handleSave();
            }}
          >Save</button>
        </div>

        <div
          className={cn(
            "edit-glasses__scene",
            {"edit-glasses__scene_selected": currentView === View.main},
          )}
          onClick={() => {
            setCurrentView(View.main);
          }}
        >
        </div>

        <div
          className={cn(
            "edit-glasses__preview-scene",
            {"edit-glasses__preview-scene_selected": currentView === View.preview},
          )}
          onClick={() => {
            setCurrentView(View.preview);
          }}
        >
        </div>
      </div>

      <div className="edit-glasses__params-container params-container">
        <div className="params-container__params-list">
          <span className="params-container__title">
            {optionsBlockName + ':'}
          </span>

          {createOptionBlock(optionsBlockName)}
        </div>

        <div className="params-container__navigation-panel">
          {createNavigationPanel(currentView)}
        </div>
      </div>
    </section>
  );
});
