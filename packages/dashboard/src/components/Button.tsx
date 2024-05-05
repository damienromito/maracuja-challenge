import React from "react"
import styled from "styled-components"
import { boolean } from "yup"
// import { IoIosArrowForward } from "react-icons/io";

const ButtonContainer = styled.button<{ isCorrect: boolean }>`
  display: flex;
  text-align: center;
  color: "white";
  align-items: center;
  justify-content: center;
  height: 58px;
  width: 100%;
  padding: 0;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 30px;
  text-transform: uppercase;
  font-family: "Chelsea Market";
  font-size: 18px;
  cursor: pointer;
  background: ${(props) => props.theme.button.primary};

  span {
    width: 100%;
  }
  svg {
    position: relative;
    left: -15px;
    font-size: 30px;
  }

  &.small {
    height: 40px;
    width: auto;
    margin-left: auto;
    margin-right: auto;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 14px;
  }

  &:focus,
  &:active {
    background: ${(props) => props.theme.button.primaryActive};
  }

  &:disabled,
  &.disabled {
    color: ${(props) => props.theme.text.disabled};
    background: ${(props) => props.theme.button.disabled};
    border-color: ${(props) => props.theme.button.disabled};
    &:focus,
    &:active {
      background: ${(props) => props.theme.button.disabled};
    }
  }

  &.secondary {
    background: ${(props) => props.theme.button.secondary};
    &:focus,
    &:active {
      background: ${(props) => props.theme.button.secondaryActive};
    }
  }

  &.game {
    background: ${(props) => (props.isCorrect ? props.theme.button.correct : props.theme.button.error)};
    &:focus,
    &:active {
      background: ${(props) => (props.isCorrect ? props.theme.button.correct : props.theme.button.error)};
    }
  }
`

const Button = (props) => {
  return (
    <ButtonContainer
      {...props}
      className={`${props.className || ""} ${props.small ? "small" : ""} ${props.secondary ? "secondary" : ""} ${
        props.game ? "game" : ""
      }`}
    >
      <span>{props.children}</span>
    </ButtonContainer>
  )
}
export default Button
