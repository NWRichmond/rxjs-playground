import React, { useRef, useContext, useEffect } from "react";
import { UserContext } from "~/context";

export default function UserWelcome() {
  const userWelcome = useRef(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (userWelcome?.current) {
      if (user) {
        userWelcome.current.textContent = `Yooo it's ${user.displayName}`;
      } else {
        userWelcome.current.textContent = "";
      }
    }
  }, [user, userWelcome]);

  return <p ref={userWelcome}></p>;
}
