import React, { useState } from "react";

import { useFirebase } from "~/hooks";
import { LoginWithGoogle, UserWelcome } from "~/components";
import { UserContext } from "~/context";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  useFirebase(); // initialize Firebase

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <LoginWithGoogle />
      <UserWelcome />
      <p className="welcome">Let's Get Clickstreamy!</p>
    </UserContext.Provider>
  );
}
