import { PlusCircleOutlined } from "@ant-design/icons"
import { QUESTION_TYPES_NAMES } from "@maracuja/shared/constants"
import { Button, Space } from "antd"
import { useState } from "react"
import { Modal } from "react-materialize"
import { QUESTION_TYPES } from "../../constants"
import { getQuestionTypePicto } from "../../screens/Helpers/QuestionTypeAssets"

export default ({ onAddContent, typePrimary }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleClickAdd = (item) => {
    onAddContent(item)
    setModalOpen(false)
  }

  return (
    <Modal
      options={{
        onOpenEnd: () => {
          setModalOpen(true)
        },
        onCloseEnd: () => {
          setModalOpen(false)
        },
      }}
      open={modalOpen}
      header="Choisissez le type de contenu à créer"
      trigger={
        <Button type={typePrimary ? "primary" : undefined} icon={<PlusCircleOutlined />}>
          Créer un contenu
        </Button>
      }
    >
      <Space direction="vertical">
        {Object.values(QUESTION_TYPES).map((questionType: string) => (
          <Button key={questionType} onClick={() => handleClickAdd(questionType)}>
            {getQuestionTypePicto(questionType)} <span>{QUESTION_TYPES_NAMES[questionType]}</span>
          </Button>
        ))}
      </Space>
    </Modal>
  )
}
