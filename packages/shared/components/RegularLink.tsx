import React from 'react'
import styled from 'styled-components'

export default (props) => {
  return (
    <Container {...props} className='regular-link'>
      {props.children}
    </Container>
  )
}

const Container = styled.a`
  color : ${props => props.lightBg ? props.theme.bg.secondary : props.theme.text.tertiary} !important;
  text-decoration: underline;
  cursor:pointer;
  font-size:15px;
  display: ${props => props.inline ? 'inline' : 'block'};
  text-align:center;
  width:${props => props.inline ? 'inherit' : '100%'};
  padding: ${props => props.inline ? '0' : '8px 0'};

  &[disabled] {   
    opacity: 0.5 ;
  }
  
`
