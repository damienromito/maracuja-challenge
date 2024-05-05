import { PlusOutlined } from "@ant-design/icons"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Idea, IdeasBox } from "@maracuja/shared/models"
import { Button, List } from "antd"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { generatePath } from "react-router-dom"
import { PageContainer } from "../../components"
import { ROUTES } from "../../constants"
import { useDashboard } from "../../contexts"
import IdeasBoxItem from "./components/IdeasBoxItem"
import IdeasList from "./components/IdeasList"

const IdeasBoxes = () => {
  const [ideasBoxes, setIdeasBoxes] = useState<IdeasBox[] | undefined>(null)
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  useEffect(() => {
    const unsub = loadIdeasBoxes()
    return () => {
      unsub()
    }
  }, [])

  const loadIdeasBoxes = () => {
    return IdeasBox.fetchAll(
      { challengeId: currentChallenge.id },
      {
        listener: (objects) => {
          if (!objects) return
          setIdeasBoxes(objects)
        },
      }
    )
  }

  const handleAddIdeasBox = async () => {
    const route = generatePath(ROUTES.CHALLENGE_IDEASBOX_CREATION, {
      challengeId: currentChallenge.id,
    })
    history.push(route)
  }

  const routes = [{ breadcrumbName: "Boites à idées" }]

  return (
    <>
      <PageContainer breadcrumb={routes} title="💡 Boites à idées">
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAddIdeasBox}>
          Ajouter une boite à idée
        </Button>
        <List
          itemLayout="horizontal"
          dataSource={ideasBoxes || []}
          renderItem={(ideasBox: any) => <IdeasBoxItem ideasBox={ideasBox} />}
        />
        <IdeasFeed />
      </PageContainer>
    </>
  )
}
export default IdeasBoxes

const IdeasFeed = () => {
  const { challengeId } = useParams<{ challengeId: string }>()
  const { setLoading } = useDashboard()
  const [ideas, setIdeas] = useState<Idea[]>([])

  useEffect(() => {
    const unsubIdeas = loadIdeas()
    return () => {
      unsubIdeas()
    }
  }, [])

  const loadIdeas = () => {
    setLoading(true)
    return Idea.fetchAll(
      { challengeId: challengeId },
      {
        refHook: (ref) => ref.orderBy("createdAt", "desc").limit(10),
        listener: (objects) => {
          setLoading(false)
          if (!objects) return
          setIdeas(objects)
        },
      }
    )
  }

  return !ideas.length ? null : (
    <>
      <h5>Dernières idées</h5>
      <IdeasList ideas={ideas} />
    </>
  )
}
