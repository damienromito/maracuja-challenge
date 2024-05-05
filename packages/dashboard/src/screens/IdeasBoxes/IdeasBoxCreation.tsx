import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { IdeasBox } from "@maracuja/shared/models"
import { notification } from "antd"
import { nanoid } from "nanoid"
import { useState } from "react"
import { useHistory, useParams } from "react-router"
import { generatePath, useLocation } from "react-router-dom"
import { PageContainer } from "../../components"
import { ROUTES } from "../../constants"
import { useDashboard } from "../../contexts"
import IdeasBoxForm, { IdeasBoxFormValue } from "./components/IdeasBoxForm"

const IdeasBoxCreation = () => {
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  const { setLoading } = useDashboard()

  const handleClickCancel = async () => {
    const route = generatePath(ROUTES.CHALLENGE_IDEASBOXES, {
      challengeId: currentChallenge.id,
    })
    history.push(route)
  }

  const handleSubmitForm = async (values: IdeasBoxFormValue) => {
    setLoading(true)
    const id = "ideasBox_" + nanoid(8)
    await IdeasBox.create({ challengeId: currentChallenge.id, id }, { ...values })
    notification.open({ message: `Boite à idée ${values.name} créée` })
    setLoading(false)

    handleClickCancel()
  }

  const routes = [
    {
      path: generatePath(ROUTES.CHALLENGE_IDEASBOXES, {
        challengeId: currentChallenge.id,
      }),
      breadcrumbName: "Boites à idées",
    },
    { breadcrumbName: "Nouvelle boite à idées" },
  ]

  return (
    <PageContainer breadcrumb={routes} title={"Nouvelle boite à idée"}>
      <IdeasBoxForm onSubmit={handleSubmitForm} submitButtonText="Créer" />
    </PageContainer>
  )
}

export default IdeasBoxCreation
