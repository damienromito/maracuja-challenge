import { useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Theme } from "@maracuja/shared/models"
import { Content } from "antd/lib/layout/layout"
import React, { useEffect, useState } from "react"
import { generatePath, useRouteMatch } from "react-router-dom"
import styled from "styled-components"
import { PageBreadcrumb } from "../../components"
import AuthorTool from "../../components/AuthorTool"
import ROUTES from "../../constants/routes"

export default () => {
  const match = useRouteMatch<any>()
  const [theme, setTheme] = useState<any>(null)
  const { currentOrganisation } = useCurrentOrganisation()

  useEffect(() => {
    loadTheme()
    window.scrollTo(0, 0)
  }, [])

  const loadTheme = async () => {
    const object = await Theme.fetch({ organisationId: match.params.organisationId, id: match.params.themeId })
    setTheme(object)
  }

  const themesPath = generatePath(ROUTES.MODULE, {
    organisationId: match.params.organisationId,
    moduleId: theme?.module.id || "-",
  })
  const routes = [
    {
      path: generatePath(ROUTES.ORGANISATION, { organisationId: match.params.organisationId }),
      breadcrumbName: currentOrganisation.name,
    },
    { breadcrumbName: "Modules", path: generatePath(ROUTES.MODULES, { organisationId: match.params.organisationId }) },
    {
      breadcrumbName: theme?.module.name,
      path: themesPath,
    },
    { breadcrumbName: "Themes" },
    { breadcrumbName: theme?.name || "Theme" },
  ]

  const handleSaveQuestions = async ({ questions }) => {
    questions = questions.map((q) => {
      const newQ = { ...q }
      return newQ
    })
    await Theme.update({ organisationId: currentOrganisation.id, id: theme.id }, { questions: questions })
  }

  return (
    <>
      <PageBreadcrumb routes={routes} />
      {!theme ? null : (
        <PageContent>
          <AuthorTool
            questions={theme.questions || []}
            name={theme.name}
            themeId={theme.id}
            pickerEnabled={false}
            editionEnabled
            isLibrary
            onSave={handleSaveQuestions}
          />
        </PageContent>
      )}
    </>
  )
}

const PageContent = styled(Content)`
  margin-top: 16px;
`
