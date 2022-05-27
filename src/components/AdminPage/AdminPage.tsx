import React from "react";
import './admin-page.scss';
import {useContext} from 'react';
// @ts-ignore
import {StoreContext} from '../../store/Store';

export const AdminPage = () => {
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

  return (
    <div className="admin-page">
      <div className="admin-page__upload-area">
        Upload glass
      </div>

      <div className="admin-page__glasses-list">
        <div className="admin-page__glasses-item">
          <div className="admin-page__glasses-item-preview-container">
            <img
              alt={'1'}
              src="assets/Glasses/01/01 - preview.png"
              className="admin-page__glasses-item-preview-img"
            />
          </div>
          glass 1
        </div>

        <div className="admin-page__glasses-item">glass 1</div>
        <div className="admin-page__glasses-item">glass 1</div>
        <div className="admin-page__glasses-item">glass 1</div>
        <div className="admin-page__glasses-item">glass 1</div>
        <div className="admin-page__glasses-item">glass 1</div>
        <div className="admin-page__glasses-item">glass 1</div>
      </div>
    </div>
  );
};
