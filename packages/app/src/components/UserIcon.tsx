
import { Icon } from '@maracuja/shared/components'
import React from 'react'
import styled from 'styled-components'

export default (props) => {
  return <Wrapper {...props}><Icon opacity={props.opacity} name={props.name} width={props.size} height={props.size} /></Wrapper>
}

const Wrapper = styled.div`
  display: flex;
  margin-right : 10px;
  width: 40px;
  justify-content: center;
  align-items: center;
`
