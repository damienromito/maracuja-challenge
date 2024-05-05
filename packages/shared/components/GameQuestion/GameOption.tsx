import React, { useEffect, useState } from "react"
import GameButton from "./GameButton"

const optionState = {
  regular: { background: "#FFF", color: "#000" },
  selected: { background: "#A7D0FD", color: "#000" },
  error: { background: "#D0021B", color: "#000" },
  correct: { background: "#7CC247", color: "#000" },
  disabled: { background: "#D1D1D1", color: "#000" },
}

const GameOption = ({ images, block, selectedBlockIds, getState, selectBlock, unselectBlock, onClickButton }) => {
  const isSelected = selectedBlockIds.includes(block.id)

  const [currentStyle, setCurrentStyle] = useState<any>(optionState.regular)
  useEffect(() => {
    const currentState = getState(block)
    setCurrentStyle(optionState[currentState])
  }, [selectedBlockIds])

  const onClick = () => {
    if (getState(block) === "disabled") return

    if (!isSelected) {
      selectBlock(block.id)
      onClickButton && onClickButton(block.id, true)
    } else {
      unselectBlock(block.id)
      onClickButton && onClickButton(block.id, false)
    }
  }

  return (
    <GameButton
      onClickButton={() => onClick()}
      currentStyle={currentStyle}
      isSelected={isSelected}
      images={images}
      block={block}
    />
  )
}

export default GameOption
