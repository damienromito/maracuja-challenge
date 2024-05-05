import { ORGA_ROLES, USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Player } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import styled from "styled-components"
import FieldContainer from "../../components/FormikFieldContainer"
import { useDashboard } from "../../contexts"
import Games from "../Games"
import moment from "moment"

export default (props) => {
  const { currentPhase, currentChallenge, currentQuestionSet } = useCurrentChallenge()
  const history = useHistory()
  const { authUser } = useAuthUser()
  const { currentMember, currentOrganisation } = useCurrentOrganisation()
  const [lastPlayers, setLastPlayers] = useState<any>()

  const { stats } = useDashboard()

  useEffect(() => {
    loadLastPlayers()
  }, [])

  const loadLastPlayers = () => {
    return Player.fetchAll(
      { challengeId: currentChallenge.id },
      {
        refHook: (ref) => ref.orderBy("createdAt", "desc").limit(3),
        listener: (items) => {
          setLastPlayers(items)
        },
      }
    )
  }

  const submitPlayerSearch = (values) => {
    const email = values.email.toLowerCase()
    return Player.fetchFirst({
      challengeId: currentChallenge.id,
      refHook: (ref) => ref.where("email", "==", email),
    }).then((player) => {
      if (player) {
        history.push(`/challenges/${currentChallenge.id}/players/${player.id}`)
      } else {
        alert("Aucun utilisateur reférencé")
      }
    })
  }

  const submitPlayerSearchLicense = (values) => {
    const licenseNumber = values.licenseNumber.toUpperCase().trim()
    return Player.fetchFirst({
      challengeId: currentChallenge.id,
      refHook: (ref) => ref.where("licenseNumber", "==", licenseNumber),
    }).then((player) => {
      if (player) {
        history.push(`/challenges/${currentChallenge.id}/players/${player.id}`)
      } else {
        alert("Aucun utilisateur reférencé")
      }
    })
  }
  let currentQuestionSetStats
  if (currentQuestionSet) {
    currentQuestionSetStats =
      stats?.games?.[currentQuestionSet.phase.id]?.[`${currentQuestionSet.type}s`]?.[currentQuestionSet.id]
  }
  return (
    currentChallenge && (
      <Container>
        {currentChallenge.image && <img src={currentChallenge.image} style={{ width: 150, marginTop: 20 }} />}
        <h4>
          {currentChallenge.name} <br />
          <i style={{ color: "#999" }}> {currentChallenge.code}</i>
        </h4>

        {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
          <>
            <div className="row">
              <Formik initialValues={{ email: "" }} onSubmit={submitPlayerSearch}>
                <Form style={{ padding: 5, width: "100%", display: "block" }}>
                  <FieldContainer name="email" type="text" placeholder="Recherche joueur par email" />
                  {/* <button type="submit" className="btn grey darken-4">Rechercher</button> */}
                </Form>
              </Formik>
            </div>
            {currentOrganisation.id === "ffe" && (
              <div className="row">
                <Formik initialValues={{ licenseNumber: "" }} onSubmit={submitPlayerSearchLicense}>
                  <Form style={{ padding: 5, width: "100%", display: "block" }}>
                    <FieldContainer
                      name="licenseNumber"
                      type="text"
                      placeholder="Recherche joueur par numéro de license"
                    />
                    {/* <button type="submit" className="btn grey darken-4">Rechercher</button> */}
                  </Form>
                </Formik>
              </div>
            )}
          </>
        )}

        <div className="row">
          <div className="col s12 m4 l4">
            <h5>{(stats && stats?.teamCount) || 0} </h5>
            <Link to={`/challenges/${currentChallenge.id}/teams`}>ÉQUIPES</Link>
            <ul />

            {stats?.icebreaker && (
              <p>
                👬 {stats.icebreaker.quizCount} équipes sur l'icebreaker ({stats.icebreaker.questionCount} questions
                créées et {stats.icebreakerGames.uniqueCount} participants ){" "}
              </p>
            )}
          </div>
          <div className="col s12 m4 l4">
            <h5>{stats?.playerCount || 0} </h5>
            <Link to={`/challenges/${currentChallenge.id}/players`}>JOUEURS</Link>
            {stats?.captainCount && (
              <p>
                ✊ {stats.captainCount} {currentChallenge.wording?.captains}{" "}
              </p>
            )}
            {stats?.refereeCount && (
              <p>
                🤓 {stats.refereeCount} {currentChallenge.wording?.referees}{" "}
              </p>
            )}
            {stats?.avatars && <p>📸 {stats.avatars.uniqueCount} photos de joueur créées </p>}
            {/* {stats?.notifications &&
              <p>{stats.notifications.emails?.subscriberCount} inscrits aux emails </p>} */}
            <ul>
              {lastPlayers &&
                lastPlayers.map((player) => (
                  <li key={player.id}>
                    {moment(player.createdAt).format("DD/MM H:mm ")}
                    <Link to={`/challenges/${currentChallenge.id}/players/${player.id}`}>
                      {player.username} ({player.club.name})
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="col s12 m4 l4">
            <h5>{stats?.gameCount || 0} </h5>
            PARTIES
            {stats?.ideaCount && <p>{stats.ideaCount} idées </p>}
            <p>💪 {stats?.trainingCount || 0} entrainements </p>
            <p>⭐️ {stats?.contestCount || 0} épreuves </p>
            <p>🤔 {stats?.debriefingCount || 0} debriefings </p>
            {stats?.eventCount && <p>{stats.eventCount} inscription à un evenement </p>}
          </div>
        </div>

        {currentMember.hasRole(ORGA_ROLES.ADMIN) && (
          <>
            <h3>{currentPhase ? currentPhase.name : "Aucune phase"} en cours </h3>
            {currentQuestionSet && (
              <div>
                <p>Quiz en cours : {currentQuestionSet.name}</p>
                <p>
                  {currentQuestionSetStats?._uniqueCount} participants (totalisant {currentQuestionSetStats?._count}{" "}
                  parties)
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
