import { createContext, FC, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { firebaseAuth } from "../../utils/firebase/firebase";

interface UserAuthContextInterface {
  user: User | null | {};
  logIn: (email: string, password: string) => void;
  logOut: () => void;
  googleSignIn: () => void;
}

const userAuthContext = createContext<UserAuthContextInterface>({
  user: {},
  logIn: () => {},
  logOut: () => {},
  googleSignIn: () => {},
});

interface UserAuthContextProviderInterface {
  children: JSX.Element;
}

export const UserAuthContextProvider: FC<UserAuthContextProviderInterface> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null | {}>({});

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const logOut = () => {
    return signOut(firebaseAuth);
  };

  const googleSignIn = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(firebaseAuth, googleAuthProvider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider value={{ user, logIn, logOut, googleSignIn }}>
      {children}
    </userAuthContext.Provider>
  );
};

export function useUserAuth() {
  return useContext(userAuthContext);
}
