import './admin-page.scss';
import { FC } from 'react';
import store, { StoreContext } from '../../services/store/AdminPage/store';
import { SignOut } from '../../components/SignOut';
import { Outlet } from 'react-router-dom';

export const AdminPage: FC = () => {
  return (
    <StoreContext.Provider value={store}>
      <div className="admin-page">
        <SignOut/>

        <Outlet/>
      </div>
    </StoreContext.Provider>
  );
};
