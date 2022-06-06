import './sign-out.scss'

import {firebaseAuth} from '../../utils/firebase';
import {FC} from 'react';
import {useNavigate} from 'react-router-dom';

export const SignOut: FC = () => {
  const navigate = useNavigate();

  return firebaseAuth.currentUser && (
    <div className="sign-out admin-page__sign-out">
      <button
        className="sign-out__button"
        onClick={() => {
          firebaseAuth.signOut();
        }}
      >
        Sign out
      </button>
    </div>
  );
};
