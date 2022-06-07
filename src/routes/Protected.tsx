import { useLocation, Outlet } from 'react-router-dom';
import { FC } from 'react';
import { firebaseAuth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SignIn } from '../components/SignIn';

export const Protected: FC = () => {
  const [user] = useAuthState(firebaseAuth);
  const location = useLocation();
  console.log('user', user, !!user);
  console.log('nav', location);

  return !!user ? (
    <Outlet />
  ) : (
    <SignIn/>
  );
};
