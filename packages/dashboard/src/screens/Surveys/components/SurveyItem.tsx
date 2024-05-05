import { USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { getPeriodString } from "@maracuja/shared/helpers"
import { IdeasBox, Survey } from "@maracuja/shared/models"
import { Button, List } from "antd"
import { useHistory } from "react-router"
import { generatePath } from "react-router-dom"
import { ROUTES } from "../../../constants"
import { useDashboard } from "../../../contexts"

const SurveyItem = ({ survey }: { survey: Survey }) => {
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()

  const { authUser } = useAuthUser()
  const handleEdit = (survey: Survey) => {
    const route = generatePath(ROUTES.CHALLENGE_SURVEY_EDITION, {
      challengeId: currentChallenge.id,
      surveyId: survey.id,
    })
    history.push(route)
  }
  const handleGoToForm = (survey) => {
    window.open(survey.formEditionUrl, "_blank")
  }

  const getActions = (survey: Survey) => {
    const actions = []
    if (authUser.hasRole(USER_ROLES.SUPER_ADMIN)) {
      actions.push(<Button onClick={() => handleEdit(survey)}>Configurer</Button>)
    }
    if (survey.formEditionUrl) {
      actions.push(<Button onClick={() => handleGoToForm(survey)}>Voir Google Form</Button>)
    }
    return actions
  }

  return (
    <List.Item actions={getActions(survey)}>
      <List.Item.Meta
        title={survey.name}
        description={
          <>
            <p>🗓 {getPeriodString(survey)}</p>
            {/* <p>🏁 Phase {currentChallenge.phases.find((p) => p.id === survey.phaseId)?.name}</p> */}
          </>
        }
      />
    </List.Item>
  )
}

export default SurveyItem
