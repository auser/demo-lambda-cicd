import React from "react";
import { Image as MdxImage } from "mdx-deck";
import styled from "styled-components";

const RawImage = styled(MdxImage)`
  border: 1px solid red;
`;
export const Image = ({ children, className, ...rest }) => (
  <RawImage {...rest}>
    <div className="image">{children}</div>
  </RawImage>
);

export default Image;
