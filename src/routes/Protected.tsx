import {Navigate} from 'react-router-dom';
import {FC} from 'react';
import {firebaseAuth} from '../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';

interface Props {
  children: JSX.Element,
}

export const Protected: FC<Props> = ({children}) => {
  const [user] = useAuthState(firebaseAuth);

  if (user) {
    return children;
  }

  return <Navigate to="/sign-in" replace={true} />;
};
