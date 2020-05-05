import React from "react";
import styled from "styled-components";

const Raw = styled.div`
  padding: 0px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Content = styled.div`
  padding: 50px;
`;

export const ZeroPadding = ({ children }) => {
  return (
    <Raw>
      <Content>{children}</Content>
    </Raw>
  );
};
export default ZeroPadding;
