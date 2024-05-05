import React from 'react'
import styled from 'styled-components'

const TitleDateContainer = styled.p`
  text-transform : uppercase;
  font-weight: normal;
  font-size : 14px;
  line-height : 20px;
`

const TitleDate = (props) => {
  return (
    <TitleDateContainer {...props} className='title-date'>
      {props.children}
    </TitleDateContainer>
  )
}

export default TitleDate
