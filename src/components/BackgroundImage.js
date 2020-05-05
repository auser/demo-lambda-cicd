import React from "react";

export const BackgroundImage = ({ src, opacity, alt }) => (
  <img
    alt={alt || "src"}
    src={src}
    css={{
      position: "absolute",
      top: 0,
      left: 0,
      height: "100vh",
      width: "100vw",
      opacity: opacity,
    }}
  />
);

export default BackgroundImage;
