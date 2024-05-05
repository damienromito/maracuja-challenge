import { EditFilled } from "@ant-design/icons"
import { ACTIVITY_TYPES, GENERATED_NOTIFICATION_TYPES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { Activity, QuestionSet } from "@maracuja/shared/models"
import { Button, Col, List, Row, Space, Tag, Tooltip } from "antd"
import M from "materialize-css"
import moment from "moment"
import { generatePath, useHistory } from "react-router-dom"
import { ConfirmModal } from "../../components"
import { QUESTION_TYPES, ROUTES, USER_ROLES } from "../../constants"
import { useDashboard } from "../../contexts"
import { QuestionSetRecommandations } from "./QuestionSetRecommandations"

interface QuestionSetItemProps {
  phase: any
  item: any
}
export default ({ phase, item }: QuestionSetItemProps) => {
  const { currentChallenge, currentQuestionSet } = useCurrentChallenge()
  const history = useHistory()
  const { stats, setLoading } = useDashboard()
  const phaseStats = stats?.games?.[item.phase.id]
  const quizStats = phaseStats?.[`${item.type}s`]?.[item.id]
  const { authUser } = useAuthUser()

  const onDeleteItem = () => {
    QuestionSet.delete({ challengeId: currentChallenge.id, id: item.id })

    M.toast({ html: "Quiz supprimé !" })
  }
  // const handleSendDailyReport = async () => {
  //   setLoading(true)
  //   await currentChallenge.sendDailyReportToCaptains({
  //     contestId: item.id,
  //     phaseId: item.phase.id,
  //   })
  //   setLoading(false)
  //   M.toast({ html: "Rapport envoyé aux capitaines !" })
  // }

  const handleClickEdit = () => {
    history.push(
      generatePath(ROUTES.CHALLENGE_QUESTION_SET_FORM, {
        challengeId: currentChallenge.id,
        questionSetId: item.id,
      }),
      { phase }
    )
  }

  const handleEditContent = () => {
    const route = generatePath(ROUTES.CHALLENGE_QUESTIONSET_EDITOR, {
      challengeId: currentChallenge.id,
      questionSetId: item.id,
    })
    history.push(route)
  }

  const isOver = item.endDate < new Date()
  return (
    <>
      <List.Item id={item.id} key={item.id}>
        <Row gutter={16} style={{ width: "100%" }}>
          <Col span={8}>
            <h3>{item.name}</h3>
            {currentQuestionSet?.id === item.id && <Tag color="green">En cours</Tag>}
            {item.type === ACTIVITY_TYPES.CONTEST && (
              <Space>
                <span>
                  {Activity.getTypeLabel({ type: item.type })}
                  {item.questionCountMax ? " à " + item.questionCountMax + " points" : ""}
                </span>
                <span> ⌛️ {item.duration || 0}" max</span>
              </Space>
            )}

            {item.audienceRestricted && <p>{item.authorizedTeams.join("'")}</p>}
            <p>
              <span className="blue-grey-text darken-1">
                {moment(item.startDate).format("ddd D MMM H:mm")} - {moment(item.endDate).format("ddd D MMM H:mm")}{" "}
              </span>
            </p>
            {item.startDate < new Date() && (
              <>
                <span>
                  👕 {quizStats?._uniqueCount || 0} participants{" "}
                  {item.type === ACTIVITY_TYPES.TRAINING && `(${quizStats?._count || 0} entrainements)`}
                </span>
                {item.type === ACTIVITY_TYPES.CONTEST && (
                  <span> 🤔 {phaseStats?.debriefings?.[item.id]?._uniqueCount || 0} joueurs debriefés</span>
                )}
              </>
            )}
          </Col>

          <Col span={8}>
            <Space direction="vertical">
              {<QuestionSetNotifications questionSet={item} />}
              {item.type === ACTIVITY_TYPES.CONTEST && isOver && (
                <>
                  {item.emailReportSent ? (
                    <Tag color="yellow">📩 Rapport capitaine envoyé</Tag>
                  ) : (
                    <Tag color="red">Rapport capitaine en attente</Tag>
                  )}
                </>
              )}
            </Space>
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Space direction="vertical">
              <Button type="primary" onClick={handleEditContent} icon={<EditFilled />}>
                {item.questionCount || item.questions?.length || 0} contenus
              </Button>
              <QuestionSetRecommandations questionSet={item} hideIfCompliant />
              {item.disabled === true && (
                <>
                  <br />
                  {item.questions?.filter((q) => q.type === QUESTION_TYPES.CARD).length || 0} cartes mémos
                  <br />
                  {item.questions?.filter((q) => !q.validated).length || 0} contenus à relire
                </>
              )}

              {/* <a href={`${window.testUrl}/games/test/questionSet/${item.id}`} target='_blank' className='btn green'><i className='tiny material-icons '>play_arrow</i></a> */}

              {/* <a href={`https://challenge.maracuja.ac/games/test/questionSet/${item.id}`} target="_blank"className="btn green"><i className="tiny material-icons ">play_arrow</i></a> */}

              <Space direction="horizontal">
                <Button onClick={handleClickEdit}>
                  <i className="tiny material-icons ">settings</i>
                </Button>
                {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
                  <ConfirmModal
                    confirmAction={onDeleteItem}
                    trigger={
                      <Button>
                        <i className="tiny material-icons ">delete</i>
                      </Button>
                    }
                    title={`Supprimer le quiz ${item.name} ?`}
                  />
                )}
              </Space>
            </Space>
          </Col>
        </Row>
      </List.Item>
      {item.type === ACTIVITY_TYPES.CONTEST && (
        <List.Item>
          <Row>
            <Col span={12}>
              <h3>🤔 Debriefing ({item.name})</h3>

              <p>
                <span className="blue-grey-text darken-1">
                  {moment(item.endDate).format("ddd D MMM H:mm")} jusqu'au quiz suivant
                </span>
              </p>
              {item.startDate < new Date() && (
                <span> 🤔 {phaseStats?.debriefings?.[item.id]?._uniqueCount || 0} joueurs debriefés</span>
              )}
            </Col>
          </Row>
        </List.Item>
      )}
    </>
  )
}

const QuestionSetNotifications = ({ questionSet }) => {
  const { currentChallenge, currentQuestionSet } = useCurrentChallenge()
  const history = useHistory()

  const handleOpen = (notification) => {
    const path = generatePath(ROUTES.CHALLENGE_NOTIFICATION, {
      notificationId: notification.id,
      challengeId: currentChallenge.id,
    })
    history.push(path)
  }

  if (!questionSet.generatedNotifications) return null

  let generatedNotifications = []
  Object.keys(questionSet.generatedNotifications).forEach((notificationType) => {
    const notification = { ...questionSet.generatedNotifications[notificationType] }
    if (!notification.id) return null
    notification.type = notificationType
    notification.scheduledDate = notification.scheduledDate?.toDate() || new Date()
    generatedNotifications.push(notification)
  })
  generatedNotifications = generatedNotifications.sort((a, b) => a.scheduledDate - b.scheduledDate)

  return (
    <>
      {generatedNotifications.map((notification) => {
        let label
        let sendDate = moment(notification.scheduledDate).format("HH:mm")
        let sendDateDetail = moment(notification.scheduledDate).format("D/MM HH:mm")
        if (notification.type === GENERATED_NOTIFICATION_TYPES.START) {
          sendDate += " 🏁"
          label = sendDateDetail + " = Notification envoyée pour l'ouverture du quiz"
        } else if (notification.type === GENERATED_NOTIFICATION_TYPES.DEBRIEFING) {
          sendDate += " 🤔"
          label = sendDateDetail + " = Notification envoyée pour debriefer"
        } else if (notification.type === GENERATED_NOTIFICATION_TYPES.WAKE_UP) {
          sendDate += " 😴"
          label = sendDateDetail + " = Notification envoyée aux joueurs endormis"
        } else if (notification.type === GENERATED_NOTIFICATION_TYPES.CAPTAIN) {
          sendDate += " ✊"
          label = sendDateDetail + " = Notification envoyée aux capitaines"
        }

        const sent = notification.scheduledDate > new Date()
        return (
          <Tooltip title={label} key={notification.type}>
            <Tag onClick={() => handleOpen(notification)} color={sent ? "gray" : "yellow"}>
              🔔 {sendDate} {!notification.id && "⚠️"}
            </Tag>
          </Tooltip>
        )
      })}
    </>
  )
}
