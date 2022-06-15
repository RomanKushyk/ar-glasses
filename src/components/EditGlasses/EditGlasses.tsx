import './edit-glasses.scss';

import cn from 'classnames';
import React, {ChangeEvent, FC, useContext, useEffect, useState} from 'react';
import { StoreContextAdmin } from '../../services/store/AdminPage/storeAdmin';
import { useParams } from 'react-router-dom';
import {EditGlassesOptions} from '../../utils/EditGlassesOptions';
import {observer} from 'mobx-react-lite';
import { previewSceneCanvas } from '../../scenes/AdminPage/PreviewScene/PreviewScene';

enum Input {
  name = 'Glasses name',
  positionX = 'positionX',
  positionY = 'positionY',
  positionZ = 'positionZ',
  rotationX = 'rotationX',
  rotationY = 'rotationY',
  rotationZ = 'rotationZ',
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
  prevThree = 'previewThree',
}

enum Option {
  position = 'Position',
  rotation = 'Rotation',
  scale = 'Scale',
  three = 'three',
  prevPosition = 'Preview position',
  prevRotate = 'Preview rotate',
  prevScale = 'Preview scale',
  prevThree = 'Preview three',
  prevSave = 'Sava preview image',
}

enum View {
  main = 'Main',
  preview = 'Preview',
}

export const EditGlasses: FC = observer(() => {
  const [previewIsSaved, setPreviewIsSaved] = useState(false);
  const [allChangesSaved, setAllChangesSaved] = useState(false);
  const store = useContext(StoreContextAdmin);
  const params = useParams();

  const [optionsBlockName, setOptionsBlockName] = useState<Option>(Option.prevScale);
  const [currentView, setCurrentView] = useState<View>(View.preview);
  const editor = new EditGlassesOptions();

  useEffect(() => {
    if (!params.glassesId) return;

    store.setSelected(params.glassesId);
    store.createScenes();
  }, [params]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!store.glasses.selected) return;

    const { name, id } = event.target;
    const value = event.target.value as unknown as number;

    if (name.startsWith('preview')) {
      setPreviewIsSaved(false);
    }

    setAllChangesSaved(false);

    switch (name) {
      case Input.name:
        editor.changeName(store.glasses.selected, event.target.value);
        break;

      case Input.positionX:
        editor.changePositionX(store.glasses.selected, value);
        break;

      case Input.positionY:
        editor.changePositionY(store.glasses.selected, value);
        break;

      case Input.positionZ:
        editor.changePositionZ(store.glasses.selected, value);
        break;

      case Input.rotationX:
        editor.changeRotationX(store.glasses.selected, value);
        break;

      case Input.rotationY:
        editor.changeRotationY(store.glasses.selected, value);
        break;

      case Input.rotationZ:
        editor.changeRotationZ(store.glasses.selected, value);
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

      case Input.prevThree:
        editor.changePartVisibilityForPreview(store.glasses.selected, id);
        break;

      default:
        break;
    }

    store.updateScenes();
  };

  const createNavigationPanel = (view: View) => {
    switch (view) {
      case View.main:
        return (
          <>
            <button
              className={cn(
                "params-container__button",
                "params-container__button_scale",
                {"params-container__button_selected": optionsBlockName === Option.scale}
              )}
              type="button"
              title={Option.scale}
              onClick={() => {
                setOptionsBlockName(Option.scale);
              }}
            />

            <button
              className={cn(
                "params-container__button",
                "params-container__button_position",
                {"params-container__button_selected": optionsBlockName === Option.position}
              )}
              type="button"
              title={Option.position}
              onClick={() => {
                setOptionsBlockName(Option.position);
              }}
            />

            <button
              className={cn(
                "params-container__button",
                "params-container__button_rotation",
                {"params-container__button_selected": optionsBlockName === Option.rotation}
              )}
              type="button"
              title={Option.rotation}
              onClick={() => {
                setOptionsBlockName(Option.rotation);
              }}
            />

            <button
              className={cn(
                "params-container__button",
                "params-container__button_three",
                {"params-container__button_selected": optionsBlockName === Option.three}
              )}
              type="button"
              title={Option.three}
              hidden={true} // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
              onClick={() => {
                setOptionsBlockName(Option.three);
              }}
            />
          </>
        );

      case View.preview:
        return (
          <>
            <button
              className={cn(
                "params-container__button",
                "params-container__button_scale",
                {"params-container__button_selected": optionsBlockName === Option.prevScale}
              )}
              type="button"
              title={Option.prevScale}
              onClick={() => {
                setOptionsBlockName(Option.prevScale)
              }}
            />

            <button
              className={cn(
                "params-container__button",
                "params-container__button_position",
                {"params-container__button_selected": optionsBlockName === Option.prevPosition}
              )}
              type="button"
              title={Option.prevPosition}
              onClick={() => {
                setOptionsBlockName(Option.prevPosition);
              }}
            />

            <button
              className={cn(
                "params-container__button",
                "params-container__button_rotation",
                {"params-container__button_selected": optionsBlockName === Option.prevRotate}
              )}
              type="button"
              title={Option.prevRotate}
              onClick={() => {
                setOptionsBlockName(Option.prevRotate);
              }}
            />

            <button
              className={cn(
                "params-container__button",
                "params-container__button_three",
                {"params-container__button_selected": optionsBlockName === Option.prevThree}
              )}
              type="button"
              title={Option.prevThree}
              onClick={() => {
                setOptionsBlockName(Option.prevThree);

              }}
            />

            <button
              className={cn(
                "params-container__button",
                "params-container__button_save-preview",
                { "params-container__button_completed": previewIsSaved }
              )}
              type="button"
              title={Option.prevSave}
              onClick={async () => {
                setPreviewIsSaved(false);
                await store.makePreviewPngAndUpload();
                setPreviewIsSaved(true);
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
    min: number,
    max: number,
    step: number,
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

  const createOptionBlock = (blockName: Option) => {
    if (!store.glasses.selected) return;

    const positionParams: [min: number, max: number, step: number] = [-50, 50, 0.01];
    const rotationParams: [min: number, max: number, step: number] = [0, 6.3, 0.01];
    const scaleParams: [min: number, max: number, step: number] = [0, 10, 0.01];
    const options = store.glasses.selected.options;
    const prevOptions = store.glasses.selected.snapshot_options;

    switch (blockName) {
      case Option.position:
        return [
          createInputBlock(
            Input.positionX,
            options.position[0],
            handleChange,
            ...positionParams
          ),
          createInputBlock(
            Input.positionY,
            options.position[1],
            handleChange,
            ...positionParams
          ),
          createInputBlock(
            Input.positionZ,
            options.position[2],
            handleChange,
            ...positionParams
          ),
        ];

      case Option.rotation:
        return [
          createInputBlock(
            Input.rotationX,
            options.rotation[0],
            handleChange,
            ...rotationParams
          ),
          createInputBlock(
            Input.rotationY,
            options.rotation[1],
            handleChange,
            ...rotationParams
          ),
          createInputBlock(
            Input.rotationZ,
            options.rotation[2],
            handleChange,
            ...rotationParams
          ),
        ];

      case Option.scale:
        return [
          createInputBlock(
            Input.scaleX,
            options.scale[0],
            handleChange,
            ...scaleParams
          ),
          createInputBlock(
            Input.scaleY,
            options.scale[1],
            handleChange,
            ...scaleParams
          ),
          createInputBlock(
            Input.scaleZ,
            options.scale[2],
            handleChange,
            ...scaleParams
          ),
        ];

      case Option.prevPosition:
        return [
          createInputBlock(
            Input.prevPositionX,
            prevOptions.position[0],
            handleChange,
            ...positionParams
          ),
          createInputBlock(
            Input.prevPositionY,
            prevOptions.position[1],
            handleChange,
            ...positionParams
          ),
          createInputBlock(
            Input.prevPositionZ,
            prevOptions.position[2],
            handleChange,
            ...positionParams
          ),
        ];

      case Option.prevRotate:
        return [
          createInputBlock(
            Input.prevRotateX,
            prevOptions.rotation[0],
            handleChange,
            ...rotationParams
          ),
          createInputBlock(Input.prevRotateY,
            prevOptions.rotation[1],
            handleChange,
            ...rotationParams,
          ),
          createInputBlock(
            Input.prevRotateZ,
            prevOptions.rotation[2],
            handleChange,
            ...rotationParams,
          ),
        ];

      case Option.prevScale:
        return [
          createInputBlock(
            Input.prevScaleX,
            prevOptions.scale[0],
            handleChange,
            ...scaleParams,
          ),
          createInputBlock(
            Input.prevScaleY,
            prevOptions.scale[1],
            handleChange,
            ...scaleParams,
          ),
          createInputBlock(
            Input.prevScaleZ,
            prevOptions.scale[2],
            handleChange,
            ...scaleParams,
          ),
        ];

      case Option.prevThree:
        if (!store.glasses.selected.snapshot_options.partsVisibility) return;

        const list = Object.entries(store.glasses.selected.snapshot_options.partsVisibility);

        return (
          <div
            className="params-container__param-item"
          >
            <div className="params-container__checkbox-container">
              {list.map(([name, value]) => (
                <label
                  key={name}
                  className="params-container__checkbox-label"
                >
                  <input
                    className="params-container__checkbox-input"
                    type="checkbox"
                    name={Input.prevThree}
                    id={name}
                    checked={value}
                    onChange={handleChange}
                  />

                  {name}
                </label>
              ))}
            </div>
          </div>
        )

      default:
        break;
    }
  };

  const handleSave = async () => {
    setAllChangesSaved(false);
    await store.saveChangesInTheSelectedToFirebase();
    setAllChangesSaved(true);
  };

  return (
    <section className="edit-glasses">
      <div className="edit-glasses__views-container">
        <div className="edit-glasses__top-panel">
          <input
            className="edit-glasses__input"
            type="text"
            name={Input.name}
            placeholder={Input.name}
            title={Input.name}
            value={store.glasses.selected?.name}
            onChange={handleChange}
          />

          <button
            className={cn(
              "edit-glasses__button",
              {"edit-glasses__button_completed": allChangesSaved},
            )}
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
          title={View.main}
          onClick={() => {
            setCurrentView(View.main);
            setOptionsBlockName(Option.position);
          }}
        >
        </div>

        <canvas
          className={cn(
            "edit-glasses__preview-scene",
            {"edit-glasses__preview-scene_selected": currentView === View.preview},
          )}
          ref={previewSceneCanvas}
          title={View.preview}
          onClick={() => {
            setCurrentView(View.preview);
            setOptionsBlockName(Option.prevPosition);
          }}
        >
        </canvas>
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
