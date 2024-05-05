import { ORGA_ROLES, USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Player } from "@maracuja/shared/models"
import { Col, Row } from "antd"
import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import styled from "styled-components"
import { useDashboard } from "../../contexts"
import Games from "../Games"
import TeamsScores from "../Teams/TeamsScores"
import { useParams } from "react-router"

export default (props) => {
  const { currentPhase, currentChallenge, currentQuestionSet, setCurrentChallengeById } = useCurrentChallenge()
  const history = useHistory()
  const { authUser } = useAuthUser()
  const { currentMember, currentOrganisation } = useCurrentOrganisation()
  const { stats } = useDashboard()
  const params = useParams<any>()
  useEffect(() => {
    if (currentChallenge.id !== params.challengeId) {
      setCurrentChallengeById(params.challengeId)
    }
  }, [])

  let currentQuestionSetStats
  if (currentQuestionSet) {
    currentQuestionSetStats =
      stats?.games?.[currentQuestionSet.phase.id]?.[`${currentQuestionSet.type}s`]?.[currentQuestionSet.id]
  }
  return (
    currentChallenge && (
      <Container>
        {currentChallenge.image && <img src={currentChallenge.image} style={{ width: 100, marginTop: 15 }} />}
        <h6>
          {currentChallenge.name} <br />
          <i style={{ color: "#999" }}> {currentChallenge.code}</i> <br />
          {currentChallenge.editionName && <strong> {currentChallenge.editionName}</strong>}
        </h6>
        {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
          <p>
            <a
              href={`https://console.firebase.google.com/u/0/project/maracuja-english-challenge/firestore/data/~2Fchallenges~2F${currentChallenge.id}`}
              target="_blanck"
            >
              Voir sur Firebase
            </a>
          </p>
        )}

        {stats && (
          <Row>
            <Col span={8}>
              <h5>{stats?.playerCount || 0} </h5>
              <p>JOUEURS</p>
              <p>📊 {stats?.playersEngagement ? Math.round(stats?.playersEngagement * 100) : 0}% engagement</p>
              {!!stats?.captainCount && (
                <p>
                  ✊ {stats.captainCount || 0} {currentChallenge.wording?.captains}{" "}
                </p>
              )}
              {stats?.refereeCount && (
                <p>
                  🤓 {stats.refereeCount || 0} {currentChallenge.wording?.referees}{" "}
                </p>
              )}
            </Col>
            <Col span={8}>
              <h5>{stats?.teamCount || 0} </h5>
              <p style={{ textTransform: "uppercase" }}>{currentChallenge.wording?.tribes}</p>
              {stats?.avatars && <p>📸 {stats.avatars.uniqueCount || 0} avatars ajoutés </p>}
              {stats?.icebreaker && (
                <p>
                  👬 icebreaker : {stats.icebreaker.questionCount || 0} questions créées (
                  {stats.icebreakerGames?.uniqueCount || 0} participants)
                </p>
              )}
              {currentChallenge.ideasBoxesEnabled && <p>💡 {stats.ideaCount || 0} idées déposées</p>}
            </Col>
            <Col span={8}>
              <h5>{stats?.gameCount || 0}</h5>
              <p>PARTIES</p>

              <p>💪 {stats?.trainingCount || 0} entrainements </p>
              <p>⭐️ {stats?.contestCount || 0} épreuves </p>
              <p>🤔 {stats?.debriefingCount || 0} debriefings </p>
              {stats?.eventCount && <p>{stats.eventCount} inscription à un evenement </p>}
            </Col>
          </Row>
        )}
        <br />
        <br />
        <TeamsScores />
        <br />
        <br />
        {currentMember.hasRole(ORGA_ROLES.ADMIN) && (
          <>
            <h5>{currentPhase ? currentPhase.name : "Aucune phase"} en cours </h5>
            {currentQuestionSet && (
              <div>
                <p>Quiz en cours : {currentQuestionSet.name}</p>
                <p>
                  {currentQuestionSetStats?._uniqueCount || 0} participants (totalisant{" "}
                  {currentQuestionSetStats?._count || 0} parties)
                </p>
              </div>
            )}

            <p />
            <Games limit={10} titleVisible={false} challengeId={currentChallenge.id} />
          </>
        )}
      </Container>
    )
  )
}

const Container = styled.div`
  text-align: center;
`
