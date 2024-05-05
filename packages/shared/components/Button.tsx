import React from 'react'
import styled from 'styled-components'
// import { IoIosArrowForward } from "react-icons/io";Ø

const ButtonContainer = styled.button`
  align-items: center ; 
  background: ${props => props.theme.secondary} ;
  border-radius : 30px;
  color: 'white' ;
  cursor: pointer;
  display : flex;
  font-family : "Chelsea Market";
  font-size : 18px;
  height : 58px;
  justify-content : center;
  margin-left: auto;
  margin-right: auto;
  max-width : 750px;
  padding: 0;
  text-align : center;
  text-transform : uppercase;
  width : 100%;

  span{
    width:100%;
    padding : 5px 15px;
    line-height: 23px;
  }
  svg {
    font-size: 30px;
    left: -15px;
    position: relative;
  }

  &.small{
    font-size:14px;
    height: 40px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 20px;
    padding-right: 20px;
    width: auto;
  }

  &:focus,&:active{
    background:${props => `${props.theme.secondary}80`};
  }

  &:disabled, &.disabled {
    background: ${props => props.theme.button.disabled};
    border-color : ${props => props.theme.button.disabled};
    color : ${props => props.theme.text.disabled};
    &:focus,&:active{
      background: ${props => props.theme.button.disabled};
    }
  }
 

  &.secondary {
    background: ${props => props.theme.button.secondary};
    &:focus,&:active{
      background: ${props => props.theme.button.secondaryActive} ;
    }
  }

  &.game {
    background: ${props => props.isCorrect ? props.theme.button.correct : props.theme.button.error};
    &:focus,&:active{
      background: ${props => props.isCorrect ? props.theme.button.correct : props.theme.button.error} ;
    }
  }

`

const Button = (props) => {
  return (
    <ButtonContainer {...props} type={`${props.button ? 'button' : ''}`} className={`${props.className || ''} ${props.small ? 'small' : ''} ${props.secondary ? 'secondary' : ''} ${props.game ? 'game' : ''}`}>
      <span>{props.children}</span>
    </ButtonContainer>
  )
}
export default Button
