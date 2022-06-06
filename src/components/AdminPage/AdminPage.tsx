import './admin-page.scss';
import {FC, useContext} from 'react';
import { FileUpload } from '../FileUpload';
import store, { StoreContext } from '../../services/store/AdminPage/store';
import {GlassesList} from '../GlassesList';
import {useAuthState} from 'react-firebase-hooks/auth';
import {firebaseAuth} from '../../utils/firebase';
import {SignIn} from '../SignIn';
import {SignOut} from '../SignOut';
import {onAuthStateChanged} from 'firebase/auth';
import {Outlet} from 'react-router-dom';

export const AdminPage: FC = () => {
  return (
    <StoreContext.Provider value={store}>
      <div className="admin-page">
        <SignOut/>

        <FileUpload/>

        <GlassesList/>

        <Outlet/>
      </div>
    </StoreContext.Provider>
  );
};
