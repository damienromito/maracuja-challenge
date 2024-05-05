import { PlusOutlined } from "@ant-design/icons"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import Survey from "@maracuja/shared/models/Survey"
import { Button, List } from "antd"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { generatePath } from "react-router-dom"
import { PageContainer } from "../../components"
import { ROUTES } from "../../constants"
import SurveyItem from "./components/SurveyItem"

const Surveys = () => {
  const [surveys, setSurveys] = useState<Survey[] | undefined>(null)
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  useEffect(() => {
    const unsub = loadSurveys()
    return () => {
      unsub()
    }
  }, [])

  const loadSurveys = () => {
    return Survey.fetchAll(
      { challengeId: currentChallenge.id },
      {
        listener: (objects) => {
          if (!objects) return
          setSurveys(objects)
        },
      }
    )
  }

  const handleAddSurvey = async () => {
    const route = generatePath(ROUTES.CHALLENGE_SURVEY_CREATION, {
      challengeId: currentChallenge.id,
    })
    history.push(route)
  }

  const routes = [{ breadcrumbName: "Sondages" }]

  return (
    <>
      <PageContainer breadcrumb={routes} title="📊 Sondages">
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAddSurvey}>
          Ajouter un sondage
        </Button>
        <List
          itemLayout="horizontal"
          dataSource={surveys || []}
          renderItem={(survey: Survey) => <SurveyItem survey={survey} />}
        />
      </PageContainer>
    </>
  )
}
export default Surveys
