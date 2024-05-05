import { IonFooter, IonToolbar } from "@ionic/react"
import React, { useMemo } from "react"
import Button from "../Button"
import RegularLink from "../RegularLink"
import Title3 from "../Title3"
import styled from "styled-components"

const Wrapper = styled(IonFooter)`
  width: 100%;
  bottom: 0;
  position: absolute;

  color: #2c322d;
  min-width: 300px;
  background: white;
  ion-toolbar {
    --background: transparent;
    color: black;
  }
`

const Container = styled("div")`
  padding: 20px 15px 15px 15px;
`
const ContinueButton = styled(Button)`
  color: white;
  border: 0;
  background: ${(props) => (props.isCorrect ? props.theme.button.correct : props.theme.button.error)};
`
const ValidationButton = styled(Button)`
  color: white;
  border: 0;
  background: ${(props) => props.theme.secondary};
`

export default ({
  answered,
  canAnswer,
  isCorrect,
  solution,
  onAnswered,
  onNextQuestion,
  isLastWarmUpQuestion,
  onRetry,
  isNegative,
}) => {
  const handleContinueGame = () => {
    onNextQuestion && onNextQuestion()
  }

  const handleStartCompet = () => {
    onRetry()
  }
  const handleRetryWarmUp = () => {
    onNextQuestion && onNextQuestion(0)
  }

  const displaySolutions = useMemo(() => {
    if (!solution) return null
    const solutions = solution.split("|")
    if (solutions.length > 1) {
      let content = "Bonnes réponses :"
      content += "<ul>"
      content += solutions.reduce((result, solution) => result + "<li> - " + solution + "</li>", "")
      content += "<ul>"
      return content
    } else {
      return "Bonne réponse : <br/>" + solution
    }
  }, [solution])

  return canAnswer ? (
    <Wrapper style={{ color: "black" }}>
      <IonToolbar>
        <Container>
          {isLastWarmUpQuestion ? (
            <>
              <Title3>Échauffement terminée</Title3>
              <ValidationButton onClick={handleStartCompet}>Revenir au quiz</ValidationButton>
              <RegularLink lightBg onClick={handleRetryWarmUp}>
                Refaire l'échauffement
              </RegularLink>
            </>
          ) : (
            <ValidationButton data-test="button-validation" onClick={onAnswered}>
              Valider
            </ValidationButton>
          )}
        </Container>
      </IonToolbar>
    </Wrapper>
  ) : !(answered && solution) ? null : (
    <Wrapper style={{ textAlign: "center", background: !isCorrect ? "#FFD0CD" : "#E6FFD3" }}>
      <IonToolbar>
        <Container>
          {isCorrect ? (
            <div style={{ fontSize: 18, color: "#7CC247", fontWeight: "bold", padding: "0px 0 5px 0" }}>
              Ta réponse est correcte ! 😎
            </div>
          ) : (
            <div style={{ color: "black" }}>
              <div style={{ fontSize: 18, color: "#D0021B", fontWeight: "bold", padding: "0px 0 5px 0" }}>
                Mauvaise réponse ! 😭
              </div>
              <div style={{ paddingBottom: 10 }} dangerouslySetInnerHTML={{ __html: displaySolutions }} />
            </div>
          )}

          <ContinueButton game onClick={handleContinueGame} isCorrect={isCorrect}>
            Continuer
          </ContinueButton>
        </Container>
      </IonToolbar>
    </Wrapper>
  )
}
