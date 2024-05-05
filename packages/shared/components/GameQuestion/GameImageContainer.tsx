
import React from 'react'
import styled from 'styled-components'

const ImageContainer = styled.div`
  margin: 15px 0;
  min-height: 150px;
  img{
    max-width: 100%;
    max-height: 400px;
    border-radius: 8px;
  }
`

export default ({ image }) => {
  return (
    <ImageContainer>
      <img src={image} />
    </ImageContainer>
  )
}
