import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons"
import { useAuthUser, useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Module, OrganisationSettings, Theme } from "@maracuja/shared/models"
import { Button, List, Modal, notification, Tree } from "antd"
import M from "materialize-css"
import { useEffect, useState } from "react"
import { generatePath, useHistory, useRouteMatch } from "react-router-dom"
import { PageContainer } from "../../components"
import { USER_ROLES } from "../../constants"
import ROUTES from "../../constants/routes"
import useListener from "../../hooks/useListener"
import SpreadSheetSyncMenu from "../Calendar/SpreadSheetSyncMenu"
import ModuleEdition from "./ModuleEdition"
import ThemeEdition from "./ThemeEdition"

export default ({ theme }) => {
  const match = useRouteMatch<any>()

  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()

  const { authUser } = useAuthUser()

  const handleOpen = (theme) => {
    const route = generatePath(ROUTES.THEME, {
      organisationId: match.params.organisationId,
      moduleId: match.params.moduleId,
      themeId: theme.id,
    })
    history.push(route)
  }

  const handleDelete = async (theme) => {
    if (!window.confirm("Supprimer le theme " + theme.name)) return
    await Theme.delete({ organisationId: match.params.organisationId, id: theme.id })
    notification.open({ message: "Module supprimé" })
  }

  const handleEdit = async (theme) => {
    const newName = window.prompt("Modifier le nom du theme", theme.name)
    if (!newName) return
    await Theme.update({ organisationId: match.params.organisationId, id: theme.id }, { name: newName })
    notification.open({ message: `Le theme modifié` })
  }

  const getActions = ({ theme }) => {
    const actions = []
    actions.push(
      <Button type="primary" onClick={() => handleOpen(theme)}>
        {theme.questionCount || 0} contenus
      </Button>
    )
    actions.push(
      <Button onClick={() => handleEdit(theme)}>
        <EditOutlined />
      </Button>
    )
    actions.push(
      <Button onClick={() => handleDelete(theme)}>
        <DeleteOutlined />
      </Button>
    )

    return actions
  }

  return (
    <List.Item actions={getActions({ theme })}>
      <List.Item.Meta title={theme.name} />
    </List.Item>
  )
}
