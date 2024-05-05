import { Idea, IdeasBox } from "@maracuja/shared/models"
import { Divider } from "antd"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { generatePath } from "react-router-dom"
import { PageContainer } from "../../components"
import { ROUTES } from "../../constants"
import { useDashboard } from "../../contexts"
import IdeasList from "./components/IdeasList"

const IdeasBoxDetails = () => {
  const { ideasBoxId, challengeId } = useParams<{ ideasBoxId: string; challengeId: string }>()
  const { setLoading } = useDashboard()
  const [ideasBox, setIdeasBox] = useState<IdeasBox>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])

  useEffect(() => {
    const unsubIdeasBoxes = loadIdeasBox()
    return () => {
      unsubIdeasBoxes()
    }
  }, [])

  const loadIdeasBox = () => {
    setLoading(true)
    return IdeasBox.fetch(
      { challengeId: challengeId, id: ideasBoxId },
      {
        listener: (objects) => {
          setLoading(false)
          if (!objects) return
          setIdeasBox(objects)
        },
      }
    )
  }

  useEffect(() => {
    if (ideasBox) {
      const unsubIdeas = loadIdeas()
      return () => {
        unsubIdeas()
      }
    }
  }, [ideasBox])

  const loadIdeas = () => {
    setLoading(true)
    return Idea.fetchAll(
      { challengeId: challengeId },
      {
        refHook: (ref) => ref.where("ideasBox.id", "==", ideasBox.id),
        listener: (objects) => {
          setIdeas(objects)
          setLoading(false)
        },
      }
    )
  }

  const routes = [
    {
      path: generatePath(ROUTES.CHALLENGE_IDEASBOXES, {
        challengeId: challengeId,
      }),
      breadcrumbName: "Boites à idées",
    },
    { breadcrumbName: ideasBox?.name },
  ]

  return !ideasBox ? null : (
    <PageContainer breadcrumb={routes} title={ideasBox?.name}>
      <p>{ideasBox.description}</p>
      <Divider orientation="left" plain>
        Idées
      </Divider>
      <IdeasList ideas={ideas} />
    </PageContainer>
  )
}

export default IdeasBoxDetails
