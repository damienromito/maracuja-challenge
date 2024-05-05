import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Survey } from "@maracuja/shared/models"
import { Button, notification } from "antd"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { generatePath } from "react-router-dom"
import { PageContainer } from "../../components"
import { ROUTES } from "../../constants"
import { useDashboard } from "../../contexts"
import SurveyForm, { SurveyFormValue } from "./components/SurveyForm"

const SurveyEdition = () => {
  const { currentChallenge } = useCurrentChallenge()
  const { surveyId } = useParams<any>()
  const history = useHistory()
  const { setLoading } = useDashboard()
  const [survey, setSurvey] = useState<any>(null)

  useEffect(() => {
    const unsub = loadSurvey()
    return () => {
      unsub()
    }
  }, [])

  const loadSurvey = () => {
    setLoading(true)
    return Survey.fetch(
      { challengeId: currentChallenge.id, id: surveyId },
      {
        listener: (objects) => {
          setLoading(false)
          setSurvey(objects)
        },
      }
    )
  }

  const handleDelete = async () => {
    if (window.confirm("Supprimer ce sondage ?")) {
      survey.challengeId = currentChallenge.id
      await survey.delete()
      notification.open({ message: "Sondage supprimée" })
      handleCancel()
    }
  }

  const handleCancel = async () => {
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
    await Survey.update({ challengeId: currentChallenge.id, id: surveyId }, payload)
    notification.open({ message: "Sondage modifié" })
    handleCancel()
  }

  const routes = [
    {
      path: generatePath(ROUTES.CHALLENGE_SURVEYS, {
        challengeId: currentChallenge.id,
      }),
      breadcrumbName: "Sondages",
    },
    { breadcrumbName: survey?.name },
  ]

  return (
    <PageContainer breadcrumb={routes} title={survey?.name}>
      <SurveyForm onSubmit={handleSubmitForm} survey={survey} submitButtonText="Enregistrer" />
      <Button type="primary" onClick={handleDelete} danger>
        Supprimer
      </Button>
    </PageContainer>
  )
}

export default SurveyEdition
