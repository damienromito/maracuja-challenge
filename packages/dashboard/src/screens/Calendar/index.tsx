import { PlusCircleFilled } from "@ant-design/icons"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { QuestionSet } from "@maracuja/shared/models"
import { Button, Modal } from "antd"
import M from "materialize-css"
import { useEffect, useState } from "react"
import { PageContainer } from "../../components"
import { USER_ROLES } from "../../constants"
import { useDashboard } from "../../contexts"
import PhaseForm from "./PhaseForm"
import PhaseItem from "./PhaseItem"
import SpreadSheetSyncMenu from "./SpreadSheetSyncMenu"

export default () => {
  const { currentChallenge, currentQuestionSets, getPreviousQuestionSet, currentQuestionSet } = useCurrentChallenge()
  const { authUser } = useAuthUser()

  const { setLoading } = useDashboard()
  const [defaultQuestionSetId] = useState<any>(currentQuestionSet?.id || getPreviousQuestionSet().id)

  useEffect(() => {
    scrollToQuestionSet()
  }, [defaultQuestionSetId])

  const scrollToQuestionSet = () => {
    if (defaultQuestionSetId) {
      const yOffset = document.getElementById(defaultQuestionSetId)?.offsetTop - 100 || 0
      window.scrollTo(0, yOffset)
    }
  }

  const handleSaveQuestionSetToExport = async ({ questionSet, questionsToUpdate }) => {
    return QuestionSet.update(
      { challengeId: currentChallenge.id, id: questionSet.id },
      { questions: questionsToUpdate }
    )
      .then(() => {
        M.toast({
          html: `QuestionSets ${questionSet.id} dans la phase ${questionSet.phase.id} bien importé !`,
        })
        setLoading(false)
      })
      .catch((error) => {})
  }
  const handleFetchQuestionSetToImport = async (questionSetId) => {
    const questionSets = await QuestionSet.fetchAllWithoutIcebreaker({
      challengeId: currentChallenge.id,
    })
    return questionSets
  }

  const routes = [{ breadcrumbName: "Calendrier" }]

  return (
    <PageContainer
      title="Calendrier"
      breadcrumb={routes}
      rightItem={authUser.hasRole(USER_ROLES.SUPER_ADMIN) && <AddPhaseButton />}
      header={
        <>
          <SpreadSheetSyncMenu
            onFetchQuestionSets={handleFetchQuestionSetToImport}
            onSaveQuestionSet={handleSaveQuestionSetToExport}
            sheetUrl={currentChallenge.calendar?.spreadsheetUrl}
            disabled={!currentChallenge.questionSets}
          />
        </>
      }
    >
      {currentChallenge.phases && Array.isArray(currentChallenge.phases) ? (
        <>
          {currentChallenge.phases.map((item) => {
            // const qs = currentQuestionSets?.filter((qs) => qs.phaseId === item.id)
            return <PhaseItem phase={item} key={item.id} />
          })}
        </>
      ) : (
        <p>Ajouter au moins une phase de jeu </p>
      )}
    </PageContainer>
  )
}

const AddPhaseButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<any>(false)

  return (
    <>
      <Button type="primary" danger icon={<PlusCircleFilled />} onClick={() => setIsModalOpen(true)}>
        Ajouter une phase de jeu
      </Button>
      <Modal footer={null} open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        <PhaseForm onSubmited={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}
