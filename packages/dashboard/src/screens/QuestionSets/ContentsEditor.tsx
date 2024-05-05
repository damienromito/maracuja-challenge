import { USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { QuestionSet } from "@maracuja/shared/models"
import { Content } from "antd/lib/layout/layout"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouteMatch } from "react-router-dom"
import { generatePath } from "react-router-dom/cjs/react-router-dom.min"
import styled from "styled-components"
import { PageBreadcrumb } from "../../components"
import AuthorTool from "../../components/AuthorTool"
import { ROUTES } from "../../constants"
import { useDashboard } from "../../contexts"
import { QuestionSetRecommandations } from "./QuestionSetRecommandations"

export default (props) => {
  const { currentChallenge, currentQuestionSets } = useCurrentChallenge()
  const match = useRouteMatch<any>()
  const { questionSetId } = useParams<any>()
  const { setMenuCollapsed } = useDashboard()
  const { authUser } = useAuthUser()

  const [questionSet, setQuestionSet] = useState<any>(null)

  useEffect(() => {
    loadQuestionSet()
    // setMenuCollapsed(true)
    window.scrollTo(0, 0)
  }, [questionSetId])

  const loadQuestionSet = async () => {
    const object = await QuestionSet.fetch({
      challengeId: currentChallenge.id,
      id: match.params.questionSetId,
    })
    setQuestionSet(object)
  }

  const routes = useMemo(() => {
    const questionsSetsItems = currentQuestionSets?.map(
      (questionSet) => {
        return {
          path: generatePath(ROUTES.CHALLENGE_QUESTIONSET_EDITOR, {
            challengeId: currentChallenge.id,
            questionSetId: questionSet.id,
          }),
          breadcrumbName: questionSet.name + " (" + questionSet.questionCount + ")",
        }
      },
      [currentQuestionSets]
    )

    return [
      {
        path: generatePath(ROUTES.CHALLENGE, {
          challengeId: match.params.challengeId,
        }),
        breadcrumbName: currentChallenge.name,
      },
      {
        breadcrumbName: "Calendrier",
        path: generatePath(ROUTES.CHALLENGE_CALENDAR, {
          challengeId: match.params.challengeId,
        }),
      },
      {
        breadcrumbName: questionSet?.name,
        children: questionsSetsItems,
      },
    ]
  }, [questionSet])

  const handleSaveQuestionSet = async ({ questions }) => {
    const newQuestions = questions.map((q) => Object.assign({}, q))
    return QuestionSet.update(
      {
        challengeId: currentChallenge.id,
        id: match.params.questionSetId,
      },
      { questions: newQuestions }
    )
  }

  return (
    <>
      <PageBreadcrumb routes={routes} />
      <PageContent>
        {!questionSet ? null : (
          <AuthorTool
            questions={questionSet.questions || []}
            name={questionSet.name}
            // questionSetId={questionSet.id}
            pickerEnabled
            quickDelete
            editionEnabled={!!authUser.hasRole(USER_ROLES.SUPER_ADMIN)}
            activityType={questionSet.activityType}
            onSave={handleSaveQuestionSet}
            questionSetInfo={<QuestionSetRecommandations questionSet={questionSet} />}
          />
        )}
      </PageContent>
    </>
  )
}

const PageContent = styled(Content)`
  margin-top: 16px;
`
