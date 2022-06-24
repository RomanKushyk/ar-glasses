import "./sign-out.scss";

import { firebaseAuth } from "../../utils/firebase";
import { FC } from "react";

export const SignOut: FC = () => {
  return (
    firebaseAuth.currentUser && (
      <button
        className="sign-out-button top-navigation-bar__sign-out-button"
        onClick={() => {
          firebaseAuth.signOut();
        }}
      >
        Sign out
      </button>
    )
  );
};
