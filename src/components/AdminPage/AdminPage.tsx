import React from "react";
import './admin-page.scss';
import { useState} from 'react';
import {glasses_list} from '../../consts/glasses';
import {FileUpload} from '../FileUpload';
import store, {StoreContext} from '../../services/store/AdminPage/store';
import {observer} from 'mobx-react-lite';

export const AdminPage = observer(() => {
  let glasses: JSX.Element[] = [];
  console.log(store.glasses.list)

  store.glasses.list.forEach((element) => {
    glasses.push(
      <div
        key={element.id}
        onClick={() => {
          store.setSelected(element.id);
          console.log(store.glasses.selected)
        }}
        className={
          "admin-page__glasses-item" +
          (element.id === store.glasses.selected
            ? " admin-page__glasses-item_active"
            : "")
        }
      >
        <div className="admin-page__glasses-item-preview-container">
          <img
            alt={element.id.toString()}
            src={element.preview_file_path}
            className="admin-page__glasses-item-preview-img"
          />
        </div>
        {element.name}
      </div>
    );
  });

  return (
    <StoreContext.Provider value={store}>
      <div className="admin-page">
        <FileUpload/>

        <section className="admin-page__glasses-list">
          {glasses}
        </section>
      </div>
    </StoreContext.Provider>
  );
});
