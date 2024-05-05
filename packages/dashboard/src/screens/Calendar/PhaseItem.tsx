import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { Phase, QuestionSet } from "@maracuja/shared/models"
import M from "materialize-css"
import { useEffect, useState } from "react"
import { USER_ROLES } from "../../constants"
import { useDashboard } from "../../contexts"
import QuestionSetForm from "../QuestionSets/QuestionSetForm"
import QuestionSetItem from "../QuestionSets/QuestionSetItem"
import PhaseForm from "./PhaseForm"
import moment from "moment"
import { Button, Col, Divider, List, Modal, Row, Space } from "antd"
import { PageContainer } from "../../components"
import { DeleteFilled, EditFilled, FileAddFilled, PlusCircleFilled } from "@ant-design/icons"

export default ({ phase }) => {
  const { currentChallenge } = useCurrentChallenge()
  const { authUser } = useAuthUser()
  const [nextEndDate, setNextEndDate] = useState<any>(phase.endDate)
  const [nextStartDate, setNextStartDate] = useState<any>(phase.startDate)
  const [questionSets, setQuestionSets] = useState<any>([])
  const { setLoading } = useDashboard()

  useEffect(() => {
    const unsub = loadQuestionSets()
    return () => {
      unsub()
    }
  }, [])

  useEffect(() => {
    if (questionSets?.length) {
      initNextDate()
    }
  }, [questionSets])

  const loadQuestionSets = () => {
    return QuestionSet.fetchAll(
      { challengeId: currentChallenge.id },
      {
        refHook: (ref) => {
          return ref
            .orderBy("startDate", "asc")
            .where("type", "in", [ACTIVITY_TYPES.TRAINING, ACTIVITY_TYPES.CONTEST])
            .where("phase.id", "==", phase.id)
        },
        listener: (items) => {
          setQuestionSets(items)
          setLoading(false)
        },
      }
    )
  }

  const initNextDate = () => {
    const lastItem = questionSets[questionSets.length - 1]
    const sDate = new Date(lastItem.startDate.getTime()) // clone date
    sDate.setDate(sDate.getDate() + 1)
    setNextStartDate(sDate)
    const eDate = new Date(lastItem.endDate.getTime()) // clone date
    eDate.setDate(eDate.getDate() + 1)
    setNextEndDate(eDate)
  }

  return (
    <>
      <Divider orientation="left">Phase : {phase.name}</Divider>
      <Space>
        {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
          <>
            <EditPhaseButton phase={phase} />
            <DeletePhaseButton phase={phase} />
            <AddQuizButton phase={phase} nextStartDate={nextStartDate} nextEndDate={nextEndDate} />
          </>
        )}
      </Space>

      <p>{phase.periodString}</p>
      {questionSets?.length > 0 && <QuizList questionSets={questionSets} phase={phase} />}
    </>
  )
}

const DeletePhaseButton = ({ phase }) => {
  const { currentChallenge } = useCurrentChallenge()

  const handleDeleteItem = async () => {
    if (!window.confirm("Supprimer la phase ? (" + phase.id + ")")) {
      return
    }
    await Phase.delete({ challengeId: currentChallenge.id, id: phase.id })
    M.toast({ html: "Phase supprimée !" })
  }
  return <Button onClick={handleDeleteItem} icon={<DeleteFilled />}></Button>
}

const EditPhaseButton = ({ phase }) => {
  const [isModalOpen, setIsModalOpen] = useState<any>(false)

  return (
    <>
      <Button type="primary" icon={<EditFilled />} onClick={() => setIsModalOpen(true)} />
      <Modal title="Modifier la phase de jeu" open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        {phase && <PhaseForm item={phase} onSubmited={() => setIsModalOpen(false)} />}
      </Modal>
    </>
  )
}
const AddQuizButton = ({ nextStartDate, nextEndDate, phase }) => {
  const [isModalNewQuizOpen, setIsModalNewQuizOpen] = useState<any>(false)

  return (
    <>
      <Button type="primary" icon={<PlusCircleFilled />} onClick={() => setIsModalNewQuizOpen(true)}>
        Ajouter un quiz
      </Button>
      <Modal title="Nouveau quiz" open={isModalNewQuizOpen} onCancel={() => setIsModalNewQuizOpen(false)}>
        <QuestionSetForm
          phase={phase}
          nextStartDate={nextStartDate}
          nextEndDate={nextEndDate}
          onSubmited={() => setIsModalNewQuizOpen(false)}
        />{" "}
      </Modal>
    </>
  )
}

const QuizList = ({ questionSets, phase }) => {
  const { currentChallenge } = useCurrentChallenge()

  const trainingDate = currentChallenge.trainingActions?.dates[0]
  let lastEndDate = currentChallenge.startDate
  return (
    <List>
      {questionSets?.map((qs, index) => {
        if (index > 0) {
          lastEndDate = questionSets[index - 1].endDate
        }
        return (
          <>
            {lastEndDate < trainingDate && qs.startDate > trainingDate && (
              <List.Item>
                <Row style={{ width: "100%" }}>
                  <Col span={24}>
                    <h3>🗓 {currentChallenge.trainingActions.label}</h3>
                    <span className="blue-grey-text darken-1">{moment(trainingDate).format("ddd D MMM")}</span>
                  </Col>
                </Row>
              </List.Item>
            )}

            <QuestionSetItem item={qs} key={qs.id} phase={phase} />
          </>
        )
      })}
    </List>
  )
}
