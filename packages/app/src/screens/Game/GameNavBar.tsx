import { IonHeader, IonToolbar } from "@ionic/react"
import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import React, { useEffect, useState } from "react"
import { Container, ProgressBar } from "../../components"
import { useApp } from "../../contexts"
import { styled } from "../../styles"

const BarContainer = styled(Container)`
  display: flex;
  background: #fff;
  align-items: center;
  flex-direction: column;
  padding: 20px 15px 0;
  height: 70px;
  .info {
    width: 100%;
    display: flex;
    position: "relative";
    margin-bottom: 5px;
    button {
      color: black;
      font-size: 30px;
    }
    .timer {
      flex: 1;
      margin-top: -5px;
    }

    .hideSolutions {
      font-size: 12px;
      width: 80px;
      line-height: 16px;
      align-self: center;
    }
  }
`

export default ({
  duration,
  correctCount,
  questionSetType,
  currentQuestionIndex,
  questionCount,
  showQuitModal,
  timer,
}) => {
  const [animatePoints, setAnimatePoints] = useState(false)
  const { setStatusBarLight } = useApp()
  const percent = (currentQuestionIndex / questionCount) * 100

  useEffect(() => {
    setStatusBarLight(false)
    return () => {
      setStatusBarLight(true)
    }
  }, [])

  useEffect(() => {
    if (correctCount) {
      setAnimatePoints(true)
      setTimeout(() => {
        setAnimatePoints(false)
      }, 1000)
    }
  }, [correctCount])

  return (
    <IonHeader no-shadow>
      <IonToolbar>
        <BarContainer>
          <div className="info">
            <button
              onClick={() => {
                showQuitModal()
              }}
              className="icon icon-close"
            />
            {questionSetType === ACTIVITY_TYPES.CONTEST ? (
              <>
                <ScoreCounter>
                  {/* <strong > + 1 </strong> */}
                  {animatePoints && <strong> + 1 </strong>}
                  <span>{correctCount} pts</span>
                </ScoreCounter>
                <Timer timer={timer} />
              </>
            ) : (
              <ProgressBar percent={percent} style={{ marginLeft: 14 }} />
            )}
          </div>
        </BarContainer>
      </IonToolbar>
    </IonHeader>
  )
}

const ScoreCounter = styled.div`
  font-size: 20px;
  padding-top: 2px;
  position: absolute;
  right: 15px;
  line-height: 40px;

  strong {
    color: #7cc247;
    top: -17px;
    position: absolute;
  }
  span {
    color: black;
    font-weight: bold;
  }
`
const TimerContainer = styled.div`
  font-size: 20px;
  color: black; /*${(props) => props.theme.primary};*/
  &:before {
    font-size: 24px;
    top: 5px;
    position: relative;
  }
  &.countdown.timer {
    text-align: center;
    font-size: 40px;
    padding-right: 63px;
  }
`
const Timer = ({ timer }) => {
  const [timeString, setTimeString] = useState("0:00")

  useEffect(() => {
    let isCancelled = false
    timer.addEventListener("secondsUpdated", function (e) {
      const timeValues = timer.getTimeValues()
      let seconds = timeValues.seconds
      seconds = seconds < 10 ? "0" + seconds : seconds
      const mins = timeValues.minutes
      const timeToDisplay = mins + ":" + seconds
      !isCancelled && setTimeString(timeToDisplay)
    })

    return () => {
      isCancelled = true
      timer.removeEventListener("secondsUpdated")
    }
  }, [])

  return <TimerContainer className="timer countdown">{timeString}</TimerContainer>
}
