import React from "react";
import styled, { css } from "styled-components";

const parentWidthBase = "0.8";
const parentWidth = css`calc(${parentWidthBase} * 100vw)`;
const dotWidth = "25px";
const lineHeight = "5px";
const dotBorderWidth = "3px";
const baseFontSize = "18px";
const activeFontSize = "24px";
const dotBorderColor = "#FA3B7D";
const activeDotColor = "#83D87F";
const completedDotColor = "#3B84F6";

const TimelineWrapper = styled.div`
  width: 100%;
  height: 20%;
  font-size: ${baseFontSize};
  margin-top: 80px;
`;

const TimelineContainer = styled.div`
  height: ${lineHeight};
  width: ${parentWidth};
  background: white;
  border-radius: 5px;
  margin: 0 auto;
  position: relative;
  top: 50%;
`;

const TimelinePoint = styled.div`
  width: ${dotWidth};
  height: ${dotWidth};
  background: ${dotBorderColor};
  border-radius: 15px;
  position: absolute;
  top: calc(
    ${dotWidth} / 2 - (${dotWidth} - ${lineHeight} + ${dotBorderWidth})
  );
  border: ${dotBorderWidth} solid white;
  left: ${({ totalCount, idx }) =>
    idx === totalCount - 1 ? 100 : (idx / (totalCount - 1)) * 100}%;

  ${({ activeIndex, idx }) =>
    activeIndex > idx &&
    `
    background: ${completedDotColor};
    `}

  ${({ activeIndex, idx }) =>
    activeIndex === idx &&
    `
    font-size: ${activeFontSize};
    background: ${activeDotColor};
    &::after {
      content: "▲";
      width: ${dotWidth};
      height: ${dotWidth};
      position: absolute;
      top: ${dotWidth};
      left: calc(-${dotBorderWidth}/2);
      }
    `}
`;

const TimelineLabel = styled.span`
  position: absolute;
  width: 70px;
  top: calc(-${dotWidth} * 2 - ${dotWidth});
  text-indent: calc(-${dotWidth} / 2 + ${dotBorderWidth});
  left: 0;
  font-size: 0.8em;
  transform: translateX(-${dotBorderWidth}) rotateZ(-45deg);
`;

export const Timeline = ({ data }) => {
  const totalCount = data.length;
  const activePoint = data.find((d) => d.active);
  const activeIndex = activePoint ? data.indexOf(activePoint) : 0;

  const pointData = (idx) => ({
    activeIndex,
    key: idx,
    idx,
    totalCount,
  });
  return (
    <TimelineWrapper>
      <TimelineContainer>
        {data.map((d, idx) => (
          <TimelinePoint {...pointData(idx)}>
            <TimelineLabel>{d.label}</TimelineLabel>
          </TimelinePoint>
        ))}
      </TimelineContainer>
    </TimelineWrapper>
  );
};

export default Timeline;
