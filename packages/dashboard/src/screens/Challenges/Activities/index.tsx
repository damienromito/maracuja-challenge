import { Title1 } from "@maracuja/shared/components"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import React from "react"
import Container from "react-materialize/lib/Container"
import { useHistory } from "react-router"
import { generatePath } from "react-router-dom"
import { ROUTES } from "../../../constants"
import { Cell, FormButton } from "../../../components"
import { Activity } from "@maracuja/shared/models"
import { ACTIVITY_TYPES, USER_ROLES } from "@maracuja/shared/constants"
import { Button, Space } from "antd"

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  const { authUser } = useAuthUser()

  const handleClickAddActivity = async () => {
    const route = generatePath(ROUTES.CHALLENGE_ACTIVITY_CREATION, { challengeId: currentChallenge.id })
    history.push(route)
  }

  const handleClickEditActivity = ({ activityId }) => {
    const route = generatePath(ROUTES.CHALLENGE_ACTIVITY_EDITION, { challengeId: currentChallenge.id, activityId })
    history.push(route)
  }

  const handleGoToForm = (activity) => {
    window.open(activity.formEditionUrl, "_blank")
  }

  return (
    <>
      <Container>
        <Title1>Calendrier des activités</Title1>
        <FormButton style={{ marginBottom: 10 }} onClick={handleClickAddActivity}>
          Ajouter une activité
        </FormButton>
        {currentChallenge.activities?.map((activity, index) => {
          return (
            <Cell key={index}>
              <Cell.Content>
                <Cell.Line>
                  <Cell.Title>{activity.name}</Cell.Title>
                  <Cell.Tag>{Activity.getTypeLabel({ type: activity.type })}</Cell.Tag>
                </Cell.Line>
                <Cell.Subtitle>⌛️ {activity.periodString}</Cell.Subtitle>
                {activity.phaseId && (
                  <Cell.Subtitle>
                    🗓 {currentChallenge.phases.find((p) => p.id === activity.phaseId)?.name}
                  </Cell.Subtitle>
                )}
              </Cell.Content>
              <Cell.Actions>
                <Space>
                  {activity.type === ACTIVITY_TYPES.SURVEY && activity.formEditionUrl && (
                    <Button onClick={() => handleGoToForm(activity)}>Voir Google Form</Button>
                  )}
                  {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
                    <Button type="primary" onClick={() => handleClickEditActivity({ activityId: activity.id })}>
                      Configurer
                    </Button>
                  )}
                </Space>
              </Cell.Actions>
            </Cell>
          )
        })}
      </Container>
    </>
  )
}
