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
import ThemeItem from "./ThemeItem"

export default () => {
  const match = useRouteMatch<any>()
  const { currentOrganisation } = useCurrentOrganisation()

  const { authUser } = useAuthUser()
  const history = useHistory()

  const module = useListener(
    (listener) =>
      Module.fetch({ organisationId: match.params.organisationId, id: match.params.moduleId }, { listener }),
    []
  )

  const onSelect = (selectedKeys, info) => {
    history.push(
      generatePath(ROUTES.THEME, {
        organisationId: match.params.organisationId,
        themeId: info.node.key,
      })
    )
  }

  const routes = [
    {
      path: generatePath(ROUTES.ORGANISATION, {
        organisationId: match.params.organisationId,
      }),
      breadcrumbName: currentOrganisation.name,
    },
    {
      path: generatePath(ROUTES.MODULES, {
        organisationId: match.params.organisationId,
      }),
      breadcrumbName: "Modules",
    },
    { breadcrumbName: module?.name },
  ]

  return (
    <PageContainer
      breadcrumb={routes}
      title={(module.themes?.length || 0) + " thèmes"}
      rightItem={<NewThemeModal module={module} />}
    >
      <List
        itemLayout="horizontal"
        dataSource={module.themes || []}
        renderItem={(theme) => <ThemeItem theme={theme} />}
      />
    </PageContainer>
  )
}

const NewThemeModal = ({ module }) => {
  const [showModal, setShowModal] = useState<any>(false)

  const onClose = () => {
    setShowModal(false)
  }
  return (
    <>
      <Button type="primary" onClick={() => setShowModal(true)}>
        Ajouter un thème
      </Button>
      <Modal
        title="Ajouter un theme"
        visible={showModal}
        destroyOnClose
        okButtonProps={{ hidden: true }}
        onCancel={onClose}
        footer={null}
      >
        <ThemeEdition onCreate={onClose} moduleId={module.id} />
      </Modal>
    </>
  )
}
