
import React, { Fragment } from 'react'

import styled, { keyframes } from 'styled-components'

const rotation = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(359deg);}
`
const Wrapper = styled.div`
  background-color : rgba(0,0,0,.3);
  width : 100%;
  height : 100%;
  z-index: 9999999;
  position: fixed;
`

const LoadingMessage = styled.p`
  text-align:center;
  text-align: center;
  margin: 30px 0 ;
  position:fixed;
  width:100%;
  top : 0;
  color: ${props => props.theme.text.tertiary};
`

const Spinner = styled.div`
  position: absolute;
  left: calc(50% - 30px );
  top: calc(50% - 30px );
  height:60px;
  width:60px;
  margin:0px auto;
  animation: ${rotation} 1s infinite linear;
  border-left:6px solid rgba(255,255,255,.15);
  border-right:6px solid rgba(255,255,255,.15);
  border-bottom:6px solid rgba(255,255,255,.15);
  border-top:6px solid rgba(255,255,255,.8);
  border-radius:100%; 
  z-index : 1000;
`

const SpinnerContainer = (props) => {
  return (
    <Wrapper>
      {props.text &&
        <LoadingMessage>{props.text}</LoadingMessage>}
      <Spinner />
    </Wrapper>
  )
}

export default SpinnerContainer
