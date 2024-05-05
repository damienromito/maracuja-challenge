import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Module } from "@maracuja/shared/models"
import { Button, Card, List, notification } from "antd"
import { generatePath, useHistory } from "react-router-dom"
import ROUTES from "../../constants/routes"

export default ({ module }) => {
  const history = useHistory()
  const handleOpenModule = (module) => {
    history.push(
      generatePath(ROUTES.MODULE, {
        organisationId: module.organisationId,
        moduleId: module.id,
      })
    )
  }

  const handleOnDelete = async (module) => {
    if (!window.confirm("Supprimer le module " + module.name)) return
    await Module.delete({ organisationId: module.organisationId, id: module.id })
    notification.open({ message: "Module supprimé" })
  }
  const handleOnEdit = async (module) => {
    const newName = window.prompt("Modifier le nom du module", module.name)
    if (!newName) return
    await Module.update({ organisationId: module.organisationId, id: module.id }, { name: newName })
    notification.open({ message: "Module modifié" })
  }
  return (
    <List.Item>
      <Card
        actions={[
          <Button type="primary" onClick={() => handleOpenModule(module)}>
            {module.themes?.length || 0} themes
          </Button>,

          <DeleteOutlined onClick={() => handleOnDelete(module)} />,
        ]}
      >
        <strong>{module.name}</strong>

        <EditOutlined onClick={() => handleOnEdit(module)} />
      </Card>
    </List.Item>
  )
}
