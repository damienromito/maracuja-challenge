import React from 'react'
import styled from 'styled-components'

const Container = styled.p`
  font-size : 13px;
  line-height: 16px;
`

const Text3 = (props) => {
  return (
    <Container {...props} className={`${props.className} text-3`}>
      {props.children}
    </Container>
  )
}

export default Text3
