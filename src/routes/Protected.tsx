import {Navigate, useLocation, Outlet} from 'react-router-dom';
import {FC} from 'react';
import {firebaseAuth} from '../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';

export const Protected: FC = () => {
  const [user] = useAuthState(firebaseAuth);
  const location = useLocation();

  return !!user ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" replace state={{ from: location.state }} />
  );
};
