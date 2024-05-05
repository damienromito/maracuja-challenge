import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { IdeasBox } from "@maracuja/shared/models"
import { Button, notification } from "antd"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { generatePath } from "react-router-dom"
import { PageContainer } from "../../components"
import { ROUTES } from "../../constants"
import { useDashboard } from "../../contexts"
import IdeasBoxForm, { IdeasBoxFormValue } from "./components/IdeasBoxForm"

const IdeasBoxEditions = () => {
  const { currentChallenge } = useCurrentChallenge()
  const { ideasBoxId } = useParams<any>()
  const history = useHistory()
  const { setLoading } = useDashboard()
  const [ideasBox, setIdeasBox] = useState<any>(null)

  useEffect(() => {
    const unsub = loadIdeasBox()
    return () => {
      unsub()
    }
  }, [])

  const loadIdeasBox = () => {
    setLoading(true)
    return IdeasBox.fetch(
      { challengeId: currentChallenge.id, id: ideasBoxId },
      {
        listener: (objects) => {
          setLoading(false)
          setIdeasBox(objects)
        },
      }
    )
  }

  const handleDelete = async () => {
    if (window.confirm("Supprimer cette activité ?")) {
      ideasBox.challengeId = currentChallenge.id
      await ideasBox.delete()
      notification.open({ message: "Boite à idée supprimée" })
      handleCancel()
    }
  }

  const handleCancel = async () => {
    const route = generatePath(ROUTES.CHALLENGE_IDEASBOXES, {
      challengeId: currentChallenge.id,
    })
    history.push(route)
  }

  const handleSubmitForm = async (values: IdeasBoxFormValue) => {
    await IdeasBox.update({ challengeId: currentChallenge.id, id: ideasBoxId }, { ...values })
    notification.open({ message: "Boite à idée modifiée" })
    handleCancel()
  }

  const routes = [
    {
      path: generatePath(ROUTES.CHALLENGE_IDEASBOXES, {
        challengeId: currentChallenge.id,
      }),
      breadcrumbName: "Boites à idées",
    },
    { breadcrumbName: ideasBox?.name },
  ]

  return (
    <PageContainer breadcrumb={routes} title={ideasBox?.name}>
      <IdeasBoxForm onSubmit={handleSubmitForm} ideasBox={ideasBox} submitButtonText="Enregistrer" />
      <Button type="primary" onClick={handleDelete} danger>
        Supprimer
      </Button>
    </PageContainer>
  )
}

export default IdeasBoxEditions
