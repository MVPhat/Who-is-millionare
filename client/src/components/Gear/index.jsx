import React from "react";

import styled from "styled-components";

const Gear = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: auto;
  background: #fff;
  border-radius: 50%;
  animation-name: spin;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  box-shadow: none;
`;

const Center = styled.div`
  position: absolute;
  top: 50px;
  left: 50px;
  z-index: 10;
  width: 100px;
  height: 100px;
  background: #198;
  border-radius: 50%;
  box-shadow: none;
`;

const Tooth = styled.div`
  position: absolute;
  top: -25px;
  left: 75px;
  z-index: 1;
  width: 45px;
  height: 250px;
  background: #fff;
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
