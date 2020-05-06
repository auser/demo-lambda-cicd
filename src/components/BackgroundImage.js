// import React from "react";
import styled from "styled-components";

export const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  opacity: ${({ opacity }) => opacity || 0};
`;

export default BackgroundImage;
