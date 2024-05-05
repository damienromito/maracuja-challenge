import { DownOutlined } from "@ant-design/icons"
import { useAuthUser, useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Module, OrganisationSettings, Theme } from "@maracuja/shared/models"
import { Button, Card, List, Modal, Tree } from "antd"
import M from "materialize-css"
import { useEffect, useState } from "react"
import { generatePath, useHistory, useRouteMatch } from "react-router-dom"
import { PageContainer } from "../../components"
import { USER_ROLES } from "../../constants"
import ROUTES from "../../constants/routes"
import useListener from "../../hooks/useListener"
import SpreadSheetSyncMenu from "../Calendar/SpreadSheetSyncMenu"
import ModuleEdition from "./ModuleEdition"
import ModuleItem from "./ModuleItem"
import ModuleList from "./ModuleList"
import ThemeEdition from "./ThemeEdition"

export default () => {
  const match = useRouteMatch<any>()
  const { authUser } = useAuthUser()

  const history = useHistory()
  const { currentOrganisation, setCurrentOrganisationById } = useCurrentOrganisation()
  const { setCurrentChallengeById } = useCurrentChallenge()

  useEffect(() => {
    if (currentOrganisation.id !== match.params.organisationId) {
      setCurrentOrganisationById(match.params.organisationId)
      setCurrentChallengeById(null)
    }
  }, [currentOrganisation])

  const settings = useListener((listener) =>
    OrganisationSettings.fetch(
      { organisationId: match.params.organisationId, id: "general" },
      {
        listener,
      }
    )
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
    { breadcrumbName: "Modules" },
  ]

  const handleSaveQuestionSetToExport = async ({ questionSet, questionsToUpdate }) => {
    return Theme.update(
      { organisationId: currentOrganisation.id, id: questionSet.id },
      { questions: questionsToUpdate }
    ).then(() => {
      M.toast({
        html: `Question du theme ${questionSet.id} bien importées !`,
      })
    })
  }
  const handleFetchQuestionSetToImport = async (questionSetId) => {
    const questionSets = await Theme.fetchAll({
      organisationId: currentOrganisation.id,
    })
    return questionSets
  }

  const handleGoToSettings = () => {
    history.push(
      generatePath(ROUTES.ORGANISATION_SETTINGS, {
        organisationId: currentOrganisation.id,
      })
    )
  }

  const Header = () => {
    return (
      <>
        {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
          <>
            {settings?.themes?.spreadsheetUrl ? (
              <SpreadSheetSyncMenu
                onFetchQuestionSets={handleFetchQuestionSetToImport}
                onSaveQuestionSet={handleSaveQuestionSetToExport}
                sheetUrl={settings?.themes?.spreadsheetUrl}
              />
            ) : (
              <Button onClick={handleGoToSettings} type="link">
                Lier un fichier google sheet pour pouvoir sauvegarder les contenus
              </Button>
            )}
          </>
        )}
      </>
    )
  }
  return (
    <PageContainer
      breadcrumb={routes}
      header={<Header />}
      title="Modules de contenus"
      rightItem={authUser.hasRole(USER_ROLES.SUPER_ADMIN) && <NewModuleModal />}
    >
      <ModuleList />

      <section>
        <h6>💡 Comment créer du contenu engageant ?</h6>
        <p>Voici une compilation des conseils de nos experts en didactique et pédagogie :</p>
        <Button
          type="dashed"
          href="https://docs.google.com/presentation/d/1etVoLE8pwJvCdiWfvCb1so1NHbXdj4hO38GOxI01MeM/edit?usp=sharing"
          target="_blank"
          block={false}
        >
          Guide à la création de contenu
        </Button>
      </section>
    </PageContainer>
  )
}

const NewModuleModal = () => {
  const [showModal, setShowModal] = useState<any>(false)

  const onClose = () => {
    setShowModal(false)
  }
  return (
    <>
      <Button type="primary" onClick={() => setShowModal(true)}>
        Ajouter un module
      </Button>
      <Modal
        title="Nouveau module"
        visible={showModal}
        destroyOnClose
        okButtonProps={{ hidden: true }}
        onCancel={onClose}
        footer={null}
      >
        <ModuleEdition onCreate={onClose} />
      </Modal>
    </>
  )
}

const NewThemeModal = ({ module }) => {
  const [showModal, setShowModal] = useState<any>(false)

  const onClose = () => {
    setShowModal(false)
  }
  return (
    <>
      <Button type="link" onClick={() => setShowModal(true)}>
        Ajouter un thème au module {module.name}
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
