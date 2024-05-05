import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { IdeasBox, Survey } from "@maracuja/shared/models"
import { notification } from "antd"
import { nanoid } from "nanoid"
import { useState } from "react"
import { useHistory, useParams } from "react-router"
import { generatePath, useLocation } from "react-router-dom"
import { PageContainer } from "../../components"
import { ROUTES } from "../../constants"
import { useDashboard } from "../../contexts"
import SurveyForm, { SurveyFormValue } from "./components/SurveyForm"

const SurveyCreation = () => {
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  const { setLoading } = useDashboard()

  const handleClickCancel = async () => {
    const route = generatePath(ROUTES.CHALLENGE_SURVEYS, {
      challengeId: currentChallenge.id,
    })
    history.push(route)
  }

  const handleSubmitForm = async (values: SurveyFormValue) => {
    const payload = {
      name: values.name,
      preview: values.preview,
      startDate: values.startDate,
      endDate: values.endDate,
      formEditionUrl: values.formEditionUrl,
      formUrl: values.formUrl,
      authorizedTeams: values.authorizedTeams,
      prefilledPlayerIdField: values.prefilledPlayerIdField,
      actionButtonText: values.actionButtonText,
    }

    setLoading(true)
    const id = "survey_" + nanoid(8)
    await Survey.create({ challengeId: currentChallenge.id, id }, payload)
    notification.open({ message: `Sondage ${values.name} créée` })
    setLoading(false)

    handleClickCancel()
  }

  const routes = [
    {
      path: generatePath(ROUTES.CHALLENGE_IDEASBOXES, {
        challengeId: currentChallenge.id,
      }),
      breadcrumbName: "Sondages",
    },
    { breadcrumbName: "Nouveau sondage" },
  ]

  return (
    <PageContainer breadcrumb={routes} title={"Nouveau sondage"}>
      <SurveyForm onSubmit={handleSubmitForm} submitButtonText="Créer" />
    </PageContainer>
  )
}

export default SurveyCreation
