import {firebaseAuth} from '../../utils/firebase';

export const SignOut = () => {
  return firebaseAuth.currentUser && (
    <button onClick={() => {firebaseAuth.signOut()}}>
      Sign out
    </button>
  );
};
