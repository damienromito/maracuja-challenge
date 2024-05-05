import PageBreadcrumb from "./PageBreadcrumb"
import { useEffect, useState, ReactNode, useMemo } from "react"
import styled from "styled-components"
import { Content } from "antd/lib/layout/layout"
import { useCurrentOrganisation, useCurrentChallenge } from "@maracuja/shared/contexts"
import { generatePath } from "react-router-dom/cjs/react-router-dom.min"
import { ROUTES } from "../constants"
import { useRouteMatch } from "react-router-dom"

interface PageContainerProps {
  breadcrumb?: any[]
  header?: ReactNode
  children?: ReactNode
  title?: string
  rightItem?: ReactNode
}
export default ({ breadcrumb, header, children, title, rightItem }: PageContainerProps) => {
  const { currentChallenge } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()
  const { params } = useRouteMatch<any>()

  const routes = useMemo(() => {
    if (!breadcrumb) return undefined
    const result = []
    const challengeId = params.challengeId
    if (challengeId) {
      result.push({
        path: generatePath(ROUTES.ORGANISATION, {
          organisationId: currentOrganisation.id,
        }),
        breadcrumbName: currentOrganisation.name,
      })
      result.push({
        path: generatePath(ROUTES.CHALLENGE, {
          challengeId,
        }),
        breadcrumbName: currentChallenge.name,
      })
    }
    return result.concat(breadcrumb)
  }, [breadcrumb])

  return (
    <>
      {routes && <PageBreadcrumb routes={routes} />}
      {header && header}
      <PageContent>
        {title && (
          <h2>
            {title} {rightItem}
          </h2>
        )}
        {/* {rightItem && <RightItem>{rightItem}</RightItem>} */}
        {children}
      </PageContent>
    </>
  )
}

const PageContent = styled(Content)`
  background-color: #fff;
  padding: 16px;
  display: flex;
  gap: 16px;
  flex-direction: column;
`
// const RightItem = styled(Content)`
//   background-color: #fff;
//   padding: 16px;
//   display: flex;
//   gap: 16px;
//   flex-direction: column;
// `
