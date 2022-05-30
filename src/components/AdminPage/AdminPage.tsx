import React from "react";
import './admin-page.scss';
import { FC } from 'react';
import { FileUpload } from '../FileUpload';
import store, { StoreContext } from '../../services/store/AdminPage/store';
import {GlassesList} from '../GlassesList';

export const AdminPage: FC = () => {
  return (
    <StoreContext.Provider value={store}>
      <div className="admin-page">
        <FileUpload/>

        <GlassesList/>
      </div>
    </StoreContext.Provider>
  );
};
