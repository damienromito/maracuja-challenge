import { IonContent, IonFooter } from "@ionic/react"
import { Ranking as RankingModel } from "@maracuja/shared/models"
import moment from "moment"
import { useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import styled from "styled-components"
import { NavBar, Text2, Text3 } from "../../components"
import TeamSuggestions from "../../components/TeamSuggestions"
import { ROUTES } from "../../constants"
import { useCurrentChallenge } from "../../contexts"
import { currentDate } from "../../utils/helpers"
import IdeasBoxSuggestion from "../Suggestions/IdeasBox"
import PreviousRanking from "./PreviousRanking"
import Ranking from "./Ranking"
import RankingHeader from "./RankingHeader"

export default () => {
  const { currentPhase, currentChallenge, currentTeam, currentRanking } = useCurrentChallenge()

  const match = useRouteMatch<any>()
  const history = useHistory()

  const [ranking, setRanking] = useState(null)
  const [isFocus, setIsFocus] = useState(false)

  useEffect(() => {
    if (currentRanking?.teams?.length > 20 && currentPhase.ranking?.focusedOnCurrentTeam) {
      setIsFocus(true)
    }
  }, [])

  useEffect(() => {
    if (currentTeam) {
      if (match.params.rankingId) {
        const r = loadRankingPage(match.params.rankingId)
        setRanking(r)
      } else {
        setRanking(currentRanking)
      }
    }
  }, [currentRanking, match.params])

  const loadRankingPage = async (rankingId) => {
    return await RankingModel.fetch({
      challengeId: currentChallenge.id,
      rankingId,
      phase: currentPhase,
      displayMaracujaTeam: currentChallenge.ranking.displayMaracujaTeam,
    })
  }

  const onClickHelp = () => {
    history.push(ROUTES.CHALLENGE_RULES)
  }

  return (
    <>
      <NavBar title="Classement" leftAction={() => onClickHelp()} leftIcon="help" />
      <TeamSuggestions />

      <PageContainer>
        <RankingHeader />

        {!currentChallenge.hideRanking ? (
          <>
            <RankingContainer>
              {currentPhase && ranking && (
                <>
                  {ranking.editedAt && (
                    <UpdatedInfo>Mis à jour {moment(ranking.editedAt).from(currentDate())}</UpdatedInfo>
                  )}
                  <Ranking
                    ranking={ranking}
                    phase={currentPhase}
                    isFocus={isFocus}
                    onClickUnFocus={() => setIsFocus(false)}
                  />
                </>
              )}

              <PreviousRanking />
            </RankingContainer>
          </>
        ) : (
          <div style={{ textAlign: "center", marginTop: 30, padding: 15 }}>
            <h3>Classement bientôt disponible...</h3>
            <br />
            <Text2 className="info-text">
              Le classement définitif est en cours de calcul. Il sera visible d'ici quelques minutes
            </Text2>
          </div>
        )}
      </PageContainer>
      <ActivitiesSuggestions />
    </>
  )
}

const UpdatedInfo = styled(Text3)`
  margin: 10px 0;
  text-align: center;
  color: ${(props) => props.theme.text.tertiary};
`

const PageContainer = styled(IonContent)`
  .info-text {
    color: ${(props) => props.theme.text.tertiary};
    padding: 10px 0;
    text-align: center;
  }
  /* .ranking{margin-top:20px} */
`
const RankingContainer = styled.div`
  background: ${(props) => props.theme.primary};
  margin-bottom: 15px;
  h2 {
    margin-top: 30px;
  }
  .ranking {
    margin-bottom: 15px;
  }
`

const ActivitiesSuggestions = () => {
  const { currentActivities, currentChallenge } = useCurrentChallenge()

  return (
    <>
      {currentChallenge.ranking?.displayActivities && (
        <IonFooter>
          <SuggestionsContainer>
            <IdeasBoxSuggestion ideasBox={currentChallenge.ideasBoxes.getCurrent()} />
          </SuggestionsContainer>
        </IonFooter>
      )}
    </>
  )
}

const SuggestionsContainer = styled.div`
  padding: 15px;
  text-align: center;
  background: ${(props) => props.theme.bg.info};
  color: ${(props) => props.theme.text.secondary};
  .name {
    color: ${(props) => props.theme.text.secondary};
  }
`
