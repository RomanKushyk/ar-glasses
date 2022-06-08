import './admin-page.scss';
import {FC, useEffect} from 'react';
import store, { StoreContext } from '../../services/store/AdminPage/store';
import { SignOut } from '../../components/SignOut';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';

export const AdminPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('new');
    }
  }, [location.pathname]);

  return (
    <StoreContext.Provider value={store}>
      <div className="admin-page">
        <SignOut/>

        <Outlet/>
      </div>
    </StoreContext.Provider>
  );
};
