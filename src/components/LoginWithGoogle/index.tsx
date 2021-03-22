import React, { useContext, useCallback } from "react";
import firebase from "firebase/app";
import { UserContext } from "~/context";
import LoginButtonAsset from "./btn_google_signin_dark_pressed_web@2x.png";

export default function LoginWithGoogle() {
  const { user, setUser } = useContext(UserContext);
  const login = useCallback(() => {
    const authProvider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(authProvider)
      .then(({ user }) => setUser(user));
  }, []);

  const logout = useCallback(() => {
    firebase
      .auth()
      .signOut()
      .then(() => setUser(null));
  }, []);

  return !user ? (
    <img src={LoginButtonAsset} onClick={login} style={{ width: "200px" }} />
  ) : (
    <button onClick={logout}>Logout</button>
  );
}
