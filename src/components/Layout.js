import React from "react";
import { Context } from "@mdx-deck/gatsby-plugin/src/context";
import styled from "styled-components";

const SlideCounter = styled.span`
  display: none;
`;

export const Layout = ({ children }) => {
  return (
    <Context.Consumer>
      {(context) => (
        <SlideCounter id="slideCount">{context.slides.length}</SlideCounter>
      )}
    </Context.Consumer>
  );
};
export default Layout;
