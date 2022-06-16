import './admin-page.scss';
import { FC, useEffect } from 'react';
import storeAdmin, { StoreContextAdmin } from '../../services/store/AdminPage/storeAdmin';
import { SignOut } from '../../components/SignOut';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TopNavigationBar } from '../../components/TopNavigationBar';

export const AdminPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('new');
    }
  }, [location.pathname]);

  return (
    <StoreContextAdmin.Provider value={storeAdmin}>
      <div className="admin-page">
        <TopNavigationBar>
          <SignOut/>
        </TopNavigationBar>

        <Outlet/>
      </div>
    </StoreContextAdmin.Provider>
  );
};
