import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  text-align: left;
  margin: 20px auto;
  padding: 50px 100px;
`;
const Section = styled.div`
  font-size: 2rem;
  //   font-family: "Open Sans", sans-serif;
  letter-spacing: -1px;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-family: "Open sans", sans-serif;
  font-weight: 700;
  margin-bottom: 50px;
  padding: 0;
  text-align: left;

  flex: 1 1 auto;

  border-bottom: 0.5px solid white;
  &:after {
    contents: "..........";
    width: 100%;
  }
`;

export const TableOfContents = ({ title, data }) => {
  const activePoint = data.find((d) => d.active);
  const activeIndex = activePoint ? data.indexOf(activePoint) : 0;
  const allContents = data.slice(activeIndex);

  return (
    <Wrapper>
      <Title>{title || "Overview"}</Title>
      {allContents.map((d) => (
        <Section>{d.label}</Section>
      ))}
    </Wrapper>
  );
};

export default TableOfContents;
