import { useCallback } from "react";
import firebase from "firebase/app";

export function useLogin({ authProvider, setUser }) {
  return useCallback(() => {
    firebase
      .auth()
      .signInWithPopup(authProvider)
      .then(({ user }) => setUser(user));
  }, []);
}
