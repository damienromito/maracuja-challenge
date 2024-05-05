import React from 'react'
import styled from 'styled-components'

const Container = styled.p`
  font-size : 15px;
  line-height: 22px;
  /* display: inline-block; */
  &.ellipsis{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow:hidden;
    width: 99%;
  }
  
`

const Text2 = (props) => {
  const { style, children, className } = props
  return (
    <Container {...props} style={style} className={`${className || ''} text-2 `}>
      {children}
    </Container>
  )
}

export default Text2
