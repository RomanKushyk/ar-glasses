import './admin-page.scss';
import { FC } from 'react';
import { FileUpload } from '../FileUpload';
import store, { StoreContext } from '../../services/store/AdminPage/store';
import {GlassesList} from '../GlassesList';
import {useAuthState} from 'react-firebase-hooks/auth';
import {firebaseAuth} from '../../utils/firebase';
import {SignIn} from '../SignIn';
import {SignOut} from '../SignOut';

export const AdminPage: FC = () => {
  const [user] = useAuthState(firebaseAuth);

  return (
    <StoreContext.Provider value={store}>
      <div className="admin-page">
        {
          !user
            ? <SignIn/>
            : <>
              <SignOut/>

              <FileUpload/>

              <GlassesList/>
            </>
        }
      </div>
    </StoreContext.Provider>
  );
};
