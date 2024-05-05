import React, { CSSProperties } from "react"
import styled from "styled-components"
import GameOption from "./GameOption"

const Container = styled.div`
  display: flex;
  margin-top: 15px;
  flex-wrap: wrap;
`

const GameButtons = ({
  items,
  selectedBlockIds,
  selectBlock,
  getState,
  unselectBlock,
  style = {},
  images = false,
  onClickButton = undefined,
}) => {
  return !items ? null : (
    <Container style={style}>
      {items.map((block, index) => {
        return (
          <GameOption
            key={`gameoption1-${index}`}
            block={block}
            images={images}
            selectedBlockIds={selectedBlockIds}
            selectBlock={selectBlock}
            getState={getState}
            onClickButton={onClickButton}
            unselectBlock={unselectBlock}
          />
        )
      })}
    </Container>
  )
}

export default GameButtons
