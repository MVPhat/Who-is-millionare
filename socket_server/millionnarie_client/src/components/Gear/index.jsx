import React from "react";

import styled from "styled-components";

const Gear = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  margin: auto;
  background: white;
  border-radius: 50%;
  animation-name: spin;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  box-shadow: none;
`;

const Center = styled.div`
  position: absolute;
  // top: 10px;
  // left: 10px;
  z-index: 10;
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  box-shadow: none;
`;

const Tooth = styled.div`
  position: absolute;
  top: -25px;
  left: 75px;
  z-index: 1;
  width: 45px;
  height: 40px;
  background: #f75e25;
  box-shadow: none;
  &:nth-child(2) {
    transform: rotate(45deg);
  }
  &:nth-child(3) {
    transform: rotate(90deg);
  }
  &:nth-child(4) {
    transform: rotate(135deg);
  }
`;

const GearIcon = () => {
  return (
    <Gear>
      <Center />
      <Tooth />
      <Tooth />
      <Tooth />
      <Tooth />
    </Gear>
  );
};

export default GearIcon;
