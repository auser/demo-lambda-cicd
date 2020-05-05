// import React from "react";
import styled from "styled-components";

const SimpleButtonWrapper = styled.button`
  background: #f5f5f5;
  display: -webkit-box;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  border: 0;
  margin: 50px;
`;
export const SimpleButton = styled.button`
  display: inline-block;
  padding: 1em 2em;
  color: #fff;
  font-size: 1em;
  line-height: 1em;
  font-family: sans-serif;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  background-color: #666;
  border-radius: 2em;
  user-select: none;
  border: 0;
`;
export const FancyButton = styled(SimpleButtonWrapper)`
  width: 300px;
  height: 100px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  background: linear-gradient(-45deg, #338aff, #3cf0c5);
  background-size: 600%;
`;

export const ActionButton = styled.button`
  padding: 1rem;
  text-transform: uppercase;
  color: #fafafa;
  background-color: green;
  border: none;
  border-radius: 3px;
  box-shadow: 1px 1px 10px rgba(50, 50, 50, 0.4);
  transition: 0.3s all ease;
  letter-spacing: 0.1rem;
  font-size: 0.85rem;
  position: relative;
  top: 0;
  right: 0;
  padding-left: 2.5rem;

  &:after,
  &:before {
    position: absolute;
    font-family: "Barrio", sans-serif;
    font-weight: bold;
    font-size: 1rem;
    color: darken($green, 20%);
    transition: 0.3s all ease;
  }

  &:before {
    content: "_";
    position: absolute;
    left: 1.4rem;
    top: 0.9rem;
  }

  &:after {
    content: ">";
    position: absolute;
    left: 0.8rem;
    top: 1rem;
  }

  &:hover {
    box-shadow: 1px 1px 20px rgba(150, 150, 150, 0.2);
    top: -0.1rem;
    right: -0.1rem;
    cursor: pointer;

    &:before {
      content: "_";
      position: absolute;
      left: 0.8rem;
      top: 0.7rem;
      transform: translateY(-1px);
    }

    &:after {
      content: ">";
      position: absolute;
      left: 1.1rem;
      top: 1rem;
    }
  }
`;
