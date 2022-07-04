import "./sign-out.scss";

import { FC } from "react";
import { useUserAuth } from "../../services/context/UserAuthContext";
import { useNavigate } from "react-router-dom";

export const SignOut: FC = () => {
  const { logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return localStorage.getItem("isAuthorized") ? (
    <button
      className="sign-out-button top-navigation-bar__sign-out-button"
      onClick={handleSignOut}
    >
      Sign out
    </button>
  ) : null;
};
