import React from "react";
import styled from "styled-components";
import { fontSize } from "styled-system";

export const Root = styled.div`
  display: flex;
  font-size: ${fontSize}px;
`;

const ThanksText = styled.span`
  font-size: 50px;
  color: #ffffff;
`;

export const Center = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Thanks = () => (
  <Root>
    <Center>
      <ThanksText>Thanks!</ThanksText>
    </Center>
  </Root>
);
