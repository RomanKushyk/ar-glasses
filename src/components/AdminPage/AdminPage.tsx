import React from "react";
import './admin-page.scss';
import {FC, useContext} from 'react';
import { FileUpload } from '../FileUpload';
import store, { StoreContextAdmin } from '../../services/store/AdminPage/storeAdmin';
import {GlassesList} from '../GlassesList';
import {useAuthState} from 'react-firebase-hooks/auth';
import {firebaseAuth} from '../../utils/firebase';
import {SignIn} from '../SignIn';
import {SignOut} from '../SignOut';
import {onAuthStateChanged} from 'firebase/auth';
import {Outlet} from 'react-router-dom';

export const AdminPage: FC = () => {
  return (
    <StoreContextAdmin.Provider value={store}>
      <div className="admin-page">
        <SignOut/>

        <FileUpload/>

        <GlassesList/>

        <Outlet/>
      </div>
    </StoreContextAdmin.Provider>
  );
};
