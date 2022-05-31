import firebase from 'firebase/compat';
import {firebaseAuth} from '../../utils/firebase';

export const signIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebaseAuth.signInWithPopup(provider);
  };

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
};
