import React, { Fragment, useEffect, useState } from "react"
import GameImageContainer from "./GameImageContainer"
import QuestionText from "./QuestionText"

const GameWordsSelector = ({ currentQuestion, handleCanAnswer, setCurrentAnswer, setIsCorrect }) => {
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([])
  const [question, setQuestion] = useState<any>(currentQuestion)

  useEffect(() => {
    setSelectedBlockIds([])
    setQuestion(currentQuestion)
  }, [currentQuestion])

  useEffect(() => {
    // CHECK ANSWER
    const canAnswer = !(selectedBlockIds.length < question.Blocks.length)
    handleCanAnswer(canAnswer)
    const response = selectedBlockIds.map((id) => question.Blocks.find((block) => block.id === id).text).join("|")

    const isCorrect = question.solutions === response
    setCurrentAnswer(response)
    // var res = response === this.state.question.fields.Answers
    setIsCorrect(isCorrect)
  }, [selectedBlockIds])

  const selectBlock = (blockId) => {
    const result = selectedBlockIds.concat(blockId)
    setSelectedBlockIds(result)
  }

  const unselectBlock = (blockId) => {
    const result = selectedBlockIds.filter((id) => id !== blockId)
    setSelectedBlockIds(result)
  }
  return (
    question && (
      <>
        {question.image && <GameImageContainer image={question.image} />}
        <div>
          <QuestionText>{question.text}</QuestionText>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              visibility: "hidden",
              marginBottom: 10,
            }}
          >
            {selectedBlockIds
              .map((blockId) => question.Blocks.find((b) => b.id === blockId))
              .map((block) => (
                <div
                  key={block.id}
                  style={{
                    background: "#A7D0FD",
                    color: "black",
                    padding: 10,
                    margin: "5px 5px 5px 0",
                    cursor: "pointer",
                    userSelect: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    showMovingBlock(block.id, false)
                    unselectBlock(block.id)
                  }}
                  id={`selected-block-${block.id}`}
                >
                  {block.text}
                </div>
              ))}
          </div>

          <div style={{ width: "100%", borderBottom: "1px dashed #A7D0FD", height: "1px" }} />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              height: "10px ",
              marginTop: "10px",
            }}
          >
            {question.Blocks.map((block) => {
              const isSelected = selectedBlockIds.includes(block.id)
              return (
                <div
                  key={block.id}
                  style={{
                    background: isSelected ? "#D1D1D1" : "white",
                    color: isSelected ? "#AAAAAA" : "black",
                    padding: 10,
                    margin: "5px 5px 5px 0",
                    cursor: "pointer",
                    userSelect: "none",
                    border: isSelected ? "1px solid #D1D1D1" : "1px solid #c6c6c6",
                    borderRadius: "8px",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    if (!isSelected) {
                      showMovingBlock(block.id, true)
                      selectBlock(block.id)
                    }
                  }}
                  id={`unselected-block-${block.id}`}
                >
                  {block.text}
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  )
}

export default GameWordsSelector

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const showMovingBlock = async (id, isBeingSelected) => {
  const startTime = Date.now()
  const duration = 100
  while (!document.getElementById(`selected-block-${id}`) || !document.getElementById(`unselected-block-${id}`)) {
    await sleep(0)
  }
  let startEl = document.getElementById(`selected-block-${id}`)
  let endEl = document.getElementById(`unselected-block-${id}`)
  if (isBeingSelected) [startEl, endEl] = [endEl, startEl]
  const [{ x: startX, y: startY }, { x: endX, y: endY }] = [startEl, endEl].map((e) => e.getBoundingClientRect())
  const [dx, dy] = [endX - startX, endY - startY]
  endEl.style.visibility = "hidden"

  const movingBlock = document.createElement("div")
  movingBlock.textContent = startEl.textContent
  movingBlock.style.position = "absolute"
  movingBlock.style.left = startX + "px"
  movingBlock.style.top = startY + "px"
  movingBlock.style.padding = "10px"
  movingBlock.style.background = "white"
  document.body.appendChild(movingBlock)
  ;(function moveBlock() {
    const now = Date.now()
    if (now >= startTime + duration) {
      endEl.style.visibility = "initial"
      return movingBlock.parentNode.removeChild(movingBlock)
    }
    const percentage = (now - startTime) / duration
    const x = startX + dx * percentage
    const y = startY + dy * percentage
    movingBlock.style.left = x + "px"
    movingBlock.style.top = y + "px"
    requestAnimationFrame(moveBlock)
  })()
}

const optionState = {
  regular: { background: "#FFF", color: "#000" },
  selected: { background: "#A7D0FD", color: "#000" },
  error: { background: "#D0021B", color: "#000" },
  correct: { background: "#7CC247", color: "#000" },
  disabled: { background: "#D1D1D1", color: "#000" },
}
