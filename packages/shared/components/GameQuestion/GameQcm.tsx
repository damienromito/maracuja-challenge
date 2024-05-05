import React, { useEffect, useState } from "react"
import GameButtons from "./GameButtons"
import GameCopyright from "./GameCopyright"
import QuestionText from "./QuestionText"
import GameImageContainer from "./GameImageContainer"

// const ImageContainer = styled.div`
//   margin: 0 0 15px 0;
//   img{
//     max-width:100%;
//     max-height: 200px;
//     border-radius: 8px;
//   }
// `

const GameQcm = ({ question, handleCanAnswer, setCurrentAnswer, images = false, setIsCorrect }) => {
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedBlockIds([])
  }, [question.Blocks])

  useEffect(() => {
    // CHECK ANSWER
    updateAnswerState()
    checkAnswer()
  }, [selectedBlockIds])

  const updateAnswerState = () => {
    const canAnswer = !(selectedBlockIds.length < 1)
    handleCanAnswer(canAnswer)
  }

  const checkAnswer = () => {
    const currentAnswers = selectedBlockIds.map((id) => {
      const answerBlock = question.Blocks.find((block) => block.id === id)
      return answerBlock.text
    })

    let isCorrect = question.Answers?.length === currentAnswers.length
    if (isCorrect) {
      currentAnswers.some((answer) => {
        isCorrect = question.Answers.includes(answer)
        if (!isCorrect) {
          return true
        }
      })
    }

    setCurrentAnswer(currentAnswers.join("|"))
    setIsCorrect(isCorrect)
  }

  const getButtonState = (block) => {
    let state = "regular"
    if (selectedBlockIds.includes(block.id || block)) {
      state = "selected"
    }
    return state
  }

  const selectBlock = (blockId) => {
    const result = selectedBlockIds.concat(blockId)
    setSelectedBlockIds(result)
  }
  const unselectBlock = (blockId) => {
    const result = selectedBlockIds.filter((id) => id !== blockId)
    setSelectedBlockIds(result)
  }

  return (
    <div>
      {question.image && <GameImageContainer image={question.image} />}

      <QuestionText>{question.text}</QuestionText>
      <GameButtons
        items={question.Blocks}
        selectedBlockIds={selectedBlockIds}
        getState={getButtonState}
        selectBlock={selectBlock}
        unselectBlock={unselectBlock}
        images={images}
        style={{
          marginBottom: "10px",
          justifyContent: images ? "center" : "unset",
        }}
      />

      {question.copyright && <GameCopyright text={question.copyright} />}
    </div>
  )
}

export default GameQcm
