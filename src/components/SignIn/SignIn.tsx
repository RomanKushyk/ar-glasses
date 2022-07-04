import "./sign-in.scss";

import { ChangeEvent, FormEvent, useState } from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../services/context/UserAuthContext";

export const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hasEmailError, setHasEmailError] = useState<boolean>(false);
  const [hasPasswordError, setHasPasswordError] = useState<boolean>(false);
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   signInWithEmailAndPassword(
  //     firebaseAuth,
  //     "rkushyk@qualium-systems.com",
  //     "1q2w3e4r"
  //   );
  // }, []); //! For develop!!!!
  //
  // if (user) {
  //   return <Navigate to="/admin" replace />;
  // }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    switch (name) {
      case "sign-in-email":
        setEmail(value);
        setHasEmailError(false);
        break;

      case "sign-in-password":
        setPassword(value);
        setHasPasswordError(false);
        break;

      default:
        break;
    }
  };

  const resetForm = () => {
    setEmail("");
    setHasEmailError(false);
    setPassword("");
    setHasPasswordError(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email && password) {
      try {
        await logIn(email, password);
        navigate("/admin");
      } catch (error: any) {
        console.error(error.message);
      }

      resetForm();
    }

    if (!email) {
      setHasEmailError(true);
    }

    if (!password) {
      setHasPasswordError(true);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await googleSignIn();
      navigate("/home");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <section className="sign-in">
      <div className="sign-in__container">
        <form className="sign-in__form" onSubmit={handleSubmit}>
          <input
            className={cn("sign-in__input", {
              "sign-in__input_error": hasEmailError,
            })}
            type="email"
            name="sign-in-email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
          />

          <input
            className={cn("sign-in__input", {
              "sign-in__input_error": hasPasswordError,
            })}
            type="password"
            name="sign-in-password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />

          <button className="sign-in__button sign-in__button_submit">
            Sign in
          </button>
        </form>

        <button className="sign-in__button" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </div>
    </section>
  );
};
