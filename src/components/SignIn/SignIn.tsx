import {getAuth, signInWithPopup} from 'firebase/auth';
import firebase from 'firebase/compat';
import {GoogleAuthProvider} from 'firebase/auth';
import {firebaseAuth} from '../../utils/firebase';

export const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = firebaseAuth;
    signInWithPopup(auth, provider)
  };

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
};
