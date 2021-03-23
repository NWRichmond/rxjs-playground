import React from "react";
import styled from "styled-components";
import { LoginWithGoogle, UserWelcome } from "~/components";

const Section = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
  background-color: #1f1f1f;
  color: white;
  height: 9em;
  width: 100%;
`;

const Profile = styled.div`
  display: flex;
  align-items: stretch;
  width: 30vw;
  justify-content: space-between;
`;

export default function Header({ clickCount, clickDuration }) {
  return (
    <Section>
      <div>
        <h1>RxJS Demo</h1>
        <h2>
          <div>Canvas Strokes: {clickCount}</div>
          <div>Last Stroke Duration: {clickDuration}s</div>
        </h2>
      </div>
      <Profile>
        <UserWelcome />
        <LoginWithGoogle />
      </Profile>
    </Section>
  );
}
