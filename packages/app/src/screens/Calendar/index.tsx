import { IonContent } from "@ionic/react"
import { Icon } from "@maracuja/shared/components"
import "moment/locale/fr"
import { useEffect, useState } from "react"
import { Route, Switch, useHistory, useLocation } from "react-router-dom"
import { CurrentPhaseInfo, NavBar, TabMenu } from "../../components"
import { ROUTES } from "../../constants"
import { useCurrentChallenge } from "../../contexts"
import Months from "./Months"
import QuestionSets from "./QuestionSets"

const VIEW_TYPE = {
  MONTH: "month",
  QUIZ: "quiz",
}

export default () => {
  const { currentQuestionSet, getPreviousQuestionSet } = useCurrentChallenge()
  const history = useHistory()
  const location = useLocation<any>()

  const [viewType, setViewType] = useState("")
  const [defaultQuestionSetId, setDefaultQuestionSetId] = useState(
    currentQuestionSet?.id || getPreviousQuestionSet().id
  )

  useEffect(() => {
    setViewType(location.pathname === ROUTES.CALENDAR ? VIEW_TYPE.MONTH : VIEW_TYPE.QUIZ)
  }, [location.pathname])

  useEffect(() => {
    scrollToQuestionSet()
  }, [defaultQuestionSetId, viewType])

  const scrollToQuestionSet = () => {
    if (defaultQuestionSetId) {
      const yOffset = document.getElementById(defaultQuestionSetId)?.offsetTop - 100 || 0
      const content = document.querySelector("ion-content")
      content.scrollToPoint(0, yOffset, 0)
    }
  }

  const onClickHelp = () => {
    history.push(ROUTES.CHALLENGE_RULES)
  }

  const handleClickDay = ({ questionSetId }) => {
    handleToggleView(VIEW_TYPE.QUIZ)
    setDefaultQuestionSetId(questionSetId)
  }

  const handleToggleView = (type) => {
    setViewType(type)
    history.push(type === VIEW_TYPE.MONTH ? ROUTES.CALENDAR : ROUTES.CALENDAR_QUIZZES)
  }

  return (
    <>
      <NavBar title="Calendrier" leftAction={onClickHelp} leftIcon="help" />

      <CurrentPhaseInfo />
      <TabMenu
        tabsIds={[VIEW_TYPE.MONTH, VIEW_TYPE.QUIZ]}
        tabsContent={[<Icon name="mosaic" key={VIEW_TYPE.MONTH} />, <Icon name="list" key={VIEW_TYPE.QUIZ} />]}
        activeId={viewType}
        setActiveId={handleToggleView}
      />
      <IonContent>
        <Switch>
          <Route exact path={ROUTES.CALENDAR} render={() => <Months onClickDay={handleClickDay} />} />
          <Route exact path={ROUTES.CALENDAR_QUIZZES} component={QuestionSets} />
        </Switch>
      </IonContent>
    </>
  )
}
