import React, { useEffect, useState } from "react"
import GameButtons from "./GameButtons"
import QuestionText from "./QuestionText"
import GameImageContainer from "./GameImageContainer"

export default ({ question, setCurrentAnswer, setIsCorrect }) => {
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([])
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<string[]>([])
  const [tempAnswer, setTempAnswer] = useState<any>("")

  useEffect(() => {
    if (!question) return

    initSelectedItems()
    setTempAnswer("")
  }, [question])

  useEffect(() => {
    checkTempAnswer()
  }, [tempAnswer])

  const checkTempAnswer = () => {
    let t = tempAnswer
    question.Blocks.forEach((b, i) => {
      t = t.replace(b.id, b.text)
      t = t.replace(question.Answers[i].id, question.Answers[i].text)
    })
    const isCorrect = t.split("|").reduce((p, n, i) => {
      return p && !!n && question.choices.indexOf(n) > -1
    }, true)

    if (!!tempAnswer && (!isCorrect || (isCorrect && tempAnswer.split("|").length === question.Blocks.length - 1))) {
      if (isCorrect) {
        setTempAnswer(
          tempAnswer +
            "|" +
            question.Blocks.filter((b) => tempAnswer.indexOf(b.id) === -1)[0].id +
            ";" +
            question.Answers.filter((b) => tempAnswer.indexOf(b.id) === -1)[0].id
        )
        initSelectedItems()
      }
      setCurrentAnswer(t)
      setIsCorrect(isCorrect)
    }
  }

  useEffect(() => {
    checkSelectedBlocks()
  }, [selectedBlockIds])

  const checkSelectedBlocks = () => {
    if (selectedBlockIds.length) {
      if (selectedAnswerIds.length === selectedBlockIds.length) {
        setTempAnswer((tempAnswer ? tempAnswer + "|" : tempAnswer) + selectedBlockIds[0] + ";" + selectedAnswerIds[0])
        initSelectedItems()
      }
    }
  }

  const initSelectedItems = () => {
    setSelectedAnswerIds([])
    setSelectedBlockIds([])
  }

  useEffect(() => {
    checkAnswer()
  }, [selectedAnswerIds])

  const checkAnswer = () => {
    if (selectedAnswerIds.length) {
      if (selectedAnswerIds.length === selectedBlockIds.length) {
        setTempAnswer((tempAnswer ? tempAnswer + "|" : tempAnswer) + selectedBlockIds[0] + ";" + selectedAnswerIds[0])
        setSelectedAnswerIds([])
        setSelectedBlockIds([])
      }
    }
  }

  const getButtonState = (block) => {
    let state = "regular"
    if (selectedBlockIds.includes(block.id)) {
      state = "selected"
    } else if (tempAnswer.indexOf(block.id) > -1) {
      state = "disabled"
    }
    return state
  }

  const getAnswerState = (block) => {
    let state = "regular"
    if (selectedAnswerIds.includes(block.id)) {
      state = "selected"
    } else if (tempAnswer.indexOf(block.id) > -1) {
      state = "disabled"
    }
    return state
  }

  const selectBlock = (blockId) => {
    const result = [blockId]
    setSelectedBlockIds(result)
  }

  const unselectBlock = (blockId) => {
    const result = selectedBlockIds.filter((id) => id !== blockId)
    setSelectedBlockIds(result)
  }

  const selectAnswer = (blockId) => {
    const result = [blockId]
    setSelectedAnswerIds(result)
  }

  const unselectAnswer = (blockId) => {
    const result = selectedAnswerIds.filter((id) => id !== blockId)
    setSelectedAnswerIds(result)
  }

  return (
    <div>
      <QuestionText id={question.id}>{question.text}</QuestionText>

      {question.image && <GameImageContainer image={question.image} />}
      <GameButtons
        items={question.Blocks}
        selectedBlockIds={selectedBlockIds}
        getState={getButtonState}
        selectBlock={selectBlock}
        unselectBlock={unselectBlock}
      />
      <p style={{ width: "100%", borderBottom: "1px dashed #A7D0FD", height: "1px" }} />
      <GameButtons
        items={question.Answers}
        selectedBlockIds={selectedAnswerIds}
        getState={getAnswerState}
        selectBlock={selectAnswer}
        unselectBlock={unselectAnswer}
      />
    </div>
  )
}
