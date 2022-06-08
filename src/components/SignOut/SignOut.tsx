import './sign-out.scss'

import {firebaseAuth} from '../../utils/firebase';
import {FC} from 'react';

export const SignOut: FC = () => {
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
