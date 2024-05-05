import React, { useEffect, useRef, useState } from "react"
import { IonContent } from "@ionic/react"
import styled from "styled-components"
import GameActionBar from "./GameActionBar"
import GameCard from "./GameCard"
import GamePairing from "./GamePairing"
import GameQcm from "./GameQcm"
import GameWordsSelector from "./GameSequencing"
import { QUESTION_TYPES } from "../../constants"
import { Game } from "../../models"

// Game Question v1.0

export default ({
  question,
  options = null,
  onValideAnswer = undefined,
  onNextQuestion = undefined,
  onRetry = undefined,
}) => {
  const {
    isLastWarmUpQuestion,
    randomizeChoices,
    displaySolution = true,
    canDisplayNegativeChoices,
  } = options || { displaySolution: true, randomizeChoices: true }

  const [activeQuestion, setActiveQuestion] = useState<any>(undefined)
  const [answered, setAnswered] = useState<any>(false)
  const [canAnswer, setCanAnswer] = useState<any>(false)
  const [isCorrect, setIsCorrect] = useState<any>(false)
  const [animatedAnswer, setAnimatedAnswer] = useState<any>(false)
  const [currentAnswer, setCurrentAnswer] = useState<any>(undefined)

  useEffect(() => {
    if (question) {
      initQuestion()
    }
  }, [question])

  const initQuestion = () => {
    setCurrentAnswer(undefined)
    setIsCorrect(false)
    setAnimatedAnswer(false)
    setCanAnswer(false)
    setAnswered(false)
    const builtQuestion = Game.buildQuestion(question, randomizeChoices, canDisplayNegativeChoices)
    setActiveQuestion(builtQuestion)
  }

  useEffect(() => {
    if (currentAnswer && activeQuestion?.type === QUESTION_TYPES.PAIRING) {
      handleAnswered()
    }
  }, [currentAnswer])

  const handleAnswered = () => {
    onValideAnswer && onValideAnswer(currentAnswer, isCorrect)
    if (activeQuestion?.type === "card") {
      handleNext()
    }
    if (displaySolution) {
      setAnswered(true)
      setCanAnswer(false)
    } else {
      setCanAnswer(false)
      setAnimatedAnswer(true)
      setTimeout(() => {
        handleNext()
      }, 1200)
    }
  }

  const handleNext = (index = undefined) => {
    if (onNextQuestion) {
      onNextQuestion(index)
    } else {
      initQuestion()
    }
  }

  const myCardRef = useRef(null)
  const getQuestionComponent = (question) => {
    if (question.type === QUESTION_TYPES.SEQUENCING) {
      return (
        <GameWordsSelector
          currentQuestion={question}
          handleCanAnswer={setCanAnswer}
          setIsCorrect={setIsCorrect}
          setCurrentAnswer={setCurrentAnswer}
        />
      )
    } else if (question.type === QUESTION_TYPES.MCQTEXT) {
      return (
        <GameQcm
          question={question}
          handleCanAnswer={setCanAnswer}
          setIsCorrect={setIsCorrect}
          setCurrentAnswer={setCurrentAnswer}
        />
      )
    } else if (question.type === QUESTION_TYPES.PAIRING) {
      return <GamePairing question={question} setIsCorrect={setIsCorrect} setCurrentAnswer={setCurrentAnswer} />
    } else if (question.type === QUESTION_TYPES.MCQIMAGES) {
      return (
        <GameQcm
          question={question}
          images
          handleCanAnswer={setCanAnswer}
          setIsCorrect={setIsCorrect}
          setCurrentAnswer={setCurrentAnswer}
        />
      )
    } else if (question.type === QUESTION_TYPES.CARD) {
      return (
        <GameCard
          scrollToTop={scrollToTop}
          question={question}
          handleCanAnswer={setCanAnswer}
          setIsCorrect={setIsCorrect}
          setCurrentAnswer={setCurrentAnswer}
        />
      )
    }
  }

  const scrollToTop = () => {
    if (myCardRef?.current) {
      myCardRef.current.scrollToTop()
    }
  }

  return !activeQuestion ? null : (
    <>
      <Wrapper ref={myCardRef} disableEvents={answered} animatedAnswer={animatedAnswer} isCorrect={isCorrect}>
        <GameContainer>{getQuestionComponent(activeQuestion)}</GameContainer>
      </Wrapper>
      <GameActionBar
        answered={answered}
        canAnswer={canAnswer}
        solution={displaySolution ? activeQuestion.solution : null}
        onAnswered={handleAnswered}
        onNextQuestion={handleNext}
        isCorrect={isCorrect}
        onRetry={onRetry}
        isLastWarmUpQuestion={isLastWarmUpQuestion}
      />
    </>
  )
}

interface WrapperProps {
  disableEvents: boolean
  animatedAnswer: boolean
  isCorrect: boolean
}
const Wrapper = styled(IonContent)<WrapperProps>`
  min-width: 300px;
  min-height: 350px;
  pointer-events: ${(props) => (props.disableEvents ? "none" : "unset")};
  --background: ${(props) =>
    props.animatedAnswer
      ? props.isCorrect
        ? props.theme.bg.correct
        : props.theme.bg.error
      : props.theme.bg.game}!important;
`
const GameContainer = styled.div`
  max-width: 720px;
  margin-right: auto;
  margin-left: auto;
  padding: 16px 16px 150px 16px;
  text-align: center;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  min-width: 220px;
  color: #2c322d;
  justify-content: space-between;
  font-family: "Open Sans", arial;
  strong {
    font-weight: 700;
  }
`
