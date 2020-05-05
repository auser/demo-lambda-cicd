import React from "react";
import { Head } from "mdx-deck";
import { Context } from "@mdx-deck/gatsby-plugin/src/context";
import styled from "styled-components";
import { space, width } from "styled-system";
export const Root = styled.div`
  width: ${width},
  height: "70vh",
  background-color: green;
`;

export const Center = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.span`
  font-size: 50px;
  ${space}
`;

const Subtitle = styled.span`
  font-size: 40px;
  color: #fdaa4c;
  ${space}
`;

const MeName = styled.span`
  font-size: 30px;
  color: #25d7fd;
  ${space}
`;

export const Cover = ({ title, subtitle, author = "Ari Lerner" }) => (
  <Context.Consumer>
    {(context) => (
      <Root>
        <Head>
          <title>{title}</title>
        </Head>
        <Center>
          <Title mt={20}>{title}</Title>
          <Subtitle mt={10}>{subtitle}</Subtitle>
          <MeName mt={100}>{author}</MeName>
        </Center>
      </Root>
    )}
  </Context.Consumer>
);
