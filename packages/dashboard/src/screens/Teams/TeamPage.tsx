import { ClubAvatar, TeamScoresDetail } from "@maracuja/shared/components"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Team } from "@maracuja/shared/models"
import { Button } from "antd"
import { Form, Formik } from "formik"
import M from "materialize-css"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { Tabs } from "react-materialize"
import Tab from "react-materialize/lib/Tab"
import { generatePath, Link, useHistory, useRouteMatch } from "react-router-dom"
import styled from "styled-components"
import CropImageField from "../../components/CropImageField"
import { ROUTES } from "../../constants"
import { useDashboard } from "../../contexts"
import TeamPlayersScoresTable from "./TeamPlayersScoresTable"

export default () => {
  const [item, setItem] = useState<any>(null)
  const match = useRouteMatch<any>()

  const { setLoading } = useDashboard()

  const { currentPhase, currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  let clubPhaseUserCount = 0

  useEffect(() => {
    initTeam()
  }, [])

  const initTeam = async () => {
    const data = await Team.fetch({ challengeId: currentChallenge.id, id: match.params.teamId })
    setItem(data)
  }

  const deleteImage = () => {
    Team.fetch({ challengeId: currentChallenge.id, id: item.id })
      .update({
        logo: null,
      })
      .then(() => {
        item.logo = null
        M.toast({ html: "Image supprimée" })
      })
  }

  const onSubmit = async (values) => {
    await item.update(values)
    M.toast({ html: "Image modifiée" })
  }

  const handleClickEdit = () => {
    history.push(generatePath(ROUTES.CHALLENGE_TEAM_EDITION, { challengeId: currentChallenge.id, teamId: item.id }))
  }

  const handleClickEditQuestions = () => {
    history.push(
      generatePath(ROUTES.CHALLENGE_QUESTIONSET_EDITOR, {
        challengeId: currentChallenge.id,
        questionSetId: item.icebreaker?.questionSetId,
      })
    )
  }

  const handleGeneratePlayersCards = async () => {
    setLoading(true)
    await item.generateCard()
    setLoading(false)
    M.toast({ html: "Carte générée" })
  }

  return !item ? null : (
    <>
      <div>
        <h3>
          {item.name} <Button onClick={handleClickEdit}>Modifier </Button>
        </h3>
        {item.createdAt && <p>Crée le {moment(item.createdAt).format("DD MMM YYYY à H:mm:ss")} </p>}

        <>
          {process.env.REACT_APP_FUNCTIONS_EMULATOR && (
            <button onClick={handleGeneratePlayersCards}>Generer les cartes joueurs </button>
          )}

          <p>
            <a
              href={`https://console.firebase.google.com/u/0/project/maracuja-english-challenge/firestore/data/~2Fchallenges~2F${currentChallenge.id}~2Fteams~2F${item.id}`}
              target="_blanck"
            >
              Voir sur Firebase
            </a>
          </p>

          <Formik onSubmit={onSubmit} initialValues={{ logo: { ...item.logo } || {} }}>
            <Form style={{ padding: 20 }}>
              <CropImageField
                name="logo.original"
                imageName="logo"
                folderName={`clubs/${item.id}`}
                size={{ width: 500, height: 500 }}
              />

              <button type="submit" className="">
                save image
              </button>
            </Form>
          </Formik>
        </>
        {item.image && (
          <button
            onClick={() => {
              deleteImage()
            }}
          >
            Supprimer l'image
          </button>
        )}

        <p>
          👕{item.playerCount || "0"} joueurs ({item.captainCount || "0"} captains - {item.refereeCount || "0"} recrues
          )
        </p>
        {item.city && (
          <p>
            <i className="left material-icons ">location_on</i> {item.city || ""}{" "}
            {item.zipCode || item.departmentCode || ""}
          </p>
        )}
        {item.department && (
          <p>
            {item.department.name} ({item.region && item.region.name})
          </p>
        )}
      </div>
      {item.icebreaker?.questionSetId && (
        <Button onClick={handleClickEditQuestions}>Icebreaker ({item.icebreaker.questionCount})</Button>
      )}

      <>
        <ScoresSumup>
          {currentChallenge.phases.length == 1 ? (
            <TeamScoresDetail team={item} phase={currentChallenge.phases[0]} />
          ) : (
            <Tabs>
              {currentChallenge.phases.map((phase) => {
                return (
                  <Tab title={phase.name} key={phase.id}>
                    <TeamScoresDetail team={item} phase={phase} />
                  </Tab>
                )
              })}
            </Tabs>
          )}
        </ScoresSumup>

        <TeamPlayersScoresTable team={item} />
      </>
    </>
  )
}

const Completion = ({ item, prefix = "" }) => {
  const completion = item.scores && item.scores.training ? Math.round(item.scores.training.score * 100) : 0
  if (completion == 0) {
    return (
      <>
        <i className="left material-icons gray-text">star_border</i> 0%
      </>
    )
  } else {
    return (
      <>
        {completion < 100 ? (
          <i className="left material-icons yellow-text">star_half</i>
        ) : (
          <i className="left material-icons green-text">star</i>
        )}
        {prefix}
        {completion}%
      </>
    )
  }
}

const ScoresSumup = styled.div`
  h4 {
    font-size: 30px;
  }
  h1 {
    font-size: 20px;
  }
`
