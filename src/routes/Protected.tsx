import { Outlet, useLocation } from 'react-router-dom';
import { FC } from 'react';
import { firebaseAuth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SignIn } from '../components/SignIn';

export const Protected: FC = () => {
  const [user] = useAuthState(firebaseAuth);
  const location = useLocation();

  return !!user ? (
    <Outlet />
  ) : (
    <SignIn/>
  );
};
