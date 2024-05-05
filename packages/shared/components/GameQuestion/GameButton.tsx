import React from "react"
import styled from "styled-components"

interface ContainerProps {
  currentState: any
  images: boolean
  isSelected: boolean
}
const Container = styled.div<ContainerProps>`
  max-width: ${(props) => (props.images ? "35%" : "inherit")};
  color: ${(props) => props.currentState.color};
  background: ${(props) => props.currentState.background};
  border: ${(props) => (props.isSelected ? "1px solid" + props.currentState.background : "1px solid #c6c6c6")};
  padding: 14px;
  margin: 0px 10px 15px 0px;
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
  font-weight: bold;
`
const GameButton = ({ images, block, currentStyle, isSelected, onClickButton }) => {
  return (
    <Container
      onClick={() => onClickButton()}
      id={`unselected-block-${block.id}`}
      currentState={currentStyle}
      isSelected={isSelected}
      className="game-option"
      images={images}
    >
      {images ? <ImageOption text={block.text} url={block.image} /> : <span>{block.text}</span>}
    </Container>
  )
}

export default GameButton

const ImageContainer = styled.div`
  text-align: center;
  p {
    font-size: 12px;
  }
  img {
    max-width: 100%;
  }
  @media (max-width: 480px) {
    img {
      max-width: 100%;
    }
  }
`

const ImageOption = ({ text, url }) => {
  return (
    <ImageContainer>
      {url ? <img src={url} /> : null}
      <p>{text}</p>
    </ImageContainer>
  )
}
