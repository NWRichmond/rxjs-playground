import React, { useState } from "react";

import { useFirebase, useClickstream } from "~/hooks";
import { Header, Canvas } from "~/components";
import { UserContext } from "~/context";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [clickDuration, setClickDuration] = useState(0);

  useClickstream({ user, setClickCount, setClickDuration });
  useFirebase(); // initialize Firebase

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header clickCount={clickCount} clickDuration={clickDuration} />
      <Canvas />
    </UserContext.Provider>
  );
}
