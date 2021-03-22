import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

export function useFirebase() {
  const [features, setFeatures] = useState(null);
  useEffect(() => {
    try {
      const app = !firebase.apps.length
        ? firebase.initializeApp({
            apiKey: import.meta.env.VITE_API_KEY as string,
            authDomain: import.meta.env.VITE_AUTH_DOMAIN as string,
            projectId: import.meta.env.VITE_PROJECT_ID as string,
            storageBucket: import.meta.env.VITE_STORAGE_BUCKET as string,
            messagingSenderId: import.meta.env
              .VITE_MESSAGING_SENDER_ID as string,
            appId: import.meta.env.VITE_APP_ID as string,
            measurementId: import.meta.env.VITE_MEASUREMENT_ID as string,
          })
        : firebase.app();

      let features = [
        "auth",
        "database",
        "firestore",
        "functions",
        "messaging",
        "storage",
        "analytics",
        "remoteConfig",
        "performance",
      ].filter((feature) => typeof app[feature] === "function");

      setFeatures(features.join(", "));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { features, db: firebase.apps.length ? firebase.firestore() : null };
}
