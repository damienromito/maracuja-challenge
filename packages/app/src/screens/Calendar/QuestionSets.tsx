import { ACTIVITY_TYPES, QUESTION_TYPES, USER_ROLES } from "@maracuja/shared/constants"
import moment from "moment"
import "moment/locale/fr"
import { Fragment } from "react"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { PlayButton, QuestionSetIcon, Text3, Title3, TitleDate, TrainingButton } from "../../components"
import PhaseListItem from "../../components/PhaseListItem"
import { useAuthUser, useCurrentChallenge } from "../../contexts"
import DebriefingItem from "./DebriefingItem"
import DebriefingItemSmall from "./DebriefingItemSmall"

export default () => {
  const { authUser } = useAuthUser()
  const history = useHistory()
  const { currentQuestionSets, currentChallenge, currentQuestionSet } = useCurrentChallenge()

  const onClickIcon = (questionSet) => {
    if (authUser.hasRole(USER_ROLES.ADMIN)) {
      history.push(`/${questionSet.type}s/${questionSet.id}/intro`)
    }
  }

  const getQuizPeriod = (item) => {
    let periodString
    if (moment(item.startDate).isSame(item.endDate, "day")) {
      periodString = moment(item.startDate).format("dddd D MMM H:mm")
      periodString += "-" + moment(item.endDate).format("H:mm")
    } else {
      periodString = moment(item.startDate).format("D MMM H:mm")
      periodString += " - " + moment(item.endDate).format("D MMM H:mm")
    }
    return periodString
  }

  let incrementedPhaseId

  return !currentQuestionSets
    ? null
    : currentQuestionSets.map((item) => {
        let itemPhase
        if (incrementedPhaseId !== item.phase.id) {
          incrementedPhaseId = item.phase.id
          itemPhase = currentChallenge.phases.find((p) => p.id === incrementedPhaseId)
        }
        const isTrainingAction = currentChallenge.isTrainingActionDate(item.startDate)
        return (
          <Fragment key={item.id}>
            {itemPhase && <PhaseListItem phase={itemPhase} />}
            <QuestionSetItemWrapper id={item.id} item={item} currentQuestionSetId={currentQuestionSet?.id}>
              {item.audienceRestricted ? (
                <ClubQuestionSetIcon className="icon icon-team" hasPlayed={item.hasPlayed} />
              ) : (
                <QuestionSetIcon questionSet={item} large onClick={() => onClickIcon(item)} />
              )}

              <TitleDate style={{ marginTop: 10 }}> {getQuizPeriod(item)} </TitleDate>
              {isTrainingAction && (
                <TrainingActionIcon>{currentChallenge.trainingActions?.label || "Formation"}</TrainingActionIcon>
              )}
              <Title3 style={{ display: "block", margin: "auto" }}>{item.name}</Title3>
              {item.audienceRestricted && (
                <>
                  <Text3 style={{ marginTop: 4 }}> Quiz pour {currentChallenge.wording.yourTribe} uniquement </Text3>
                  <Text3 style={{ marginTop: 4 }}> {item.questionCount} questions </Text3>
                </>
              )}

              {item.type === ACTIVITY_TYPES.TRAINING && (
                <>
                  {item.hasPlayed && <Text3 className="text-white">Entrainé à {item.getProgression(true)}</Text3>}
                  {item.getIsActive() && <TrainingButton training={item} />}
                  <Text3 className="text-tertiary">{item.getAvaibilityString()}</Text3>
                </>
              )}

              {item.type === ACTIVITY_TYPES.CONTEST && (
                <>
                  {item.getIsActive() && <PlayButton questionSet={item} />}
                  <Text3 className="text-tertiary">{item.getAvaibilityString()}</Text3>

                  {item.hasPlayed && !item.debriefingDisabled ? (
                    !item.getIsActive() || currentChallenge.debriefing?.enabledDuringContest ? (
                      // currentDebriefingContest?.id === item.id ? (
                      <DebriefingItem contest={item} />
                    ) : (
                      <DebriefingItemSmall contest={item} />
                    )
                  ) : null}
                </>
              )}
            </QuestionSetItemWrapper>
          </Fragment>
        )
      })
}

const TrainingActionIcon = styled.div`
  background: white;
  margin: auto;
  padding: 0 5px;
  color: black;
  position: relative;
`

const ClubQuestionSetIcon = styled.i<{ hasPlayed?: boolean }>`
  &:before {
    font-size: 60px;
    color: ${(props) => (props.hasPlayed ? props.theme.icon.completed : props.theme.icon.disabled)};
  }
`
const QuestionSetItemWrapper = styled.div<{ item: any; currentQuestionSetId?: string }>`
  border-bottom: 2px dashed ${(props) => props.theme.bg.secondary};
  padding: 35px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => (props.item.id === props.currentQuestionSetId ? props.theme.bg.active : "inherit")};
  h3 {
    padding-top: 5px;
    display: inline-block;
    max-width: 350px;
  }
  button {
    max-width: 350px;
    margin: 10px auto;
  }
  .title-date {
    margin-top: 5px;
    color: ${(props) => props.theme.text.tertiary};
  }
  .question-set-icon {
    width: 100%;
  }
`
