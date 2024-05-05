import { DownOutlined } from "@ant-design/icons"
import { useAuthUser, useCurrentOrganisation, useCurrentChallenge } from "@maracuja/shared/contexts"
import { Module, OrganisationSettings, Theme, ChallengeSettings } from "@maracuja/shared/models"
import { Avatar, Button, List, Modal, Select, Tabs, Tree } from "antd"
import { Content } from "antd/lib/layout/layout"
import M from "materialize-css"
import React, { useEffect, useState } from "react"

import { generatePath, useHistory, useRouteMatch, Route, Switch } from "react-router-dom"
import styled from "styled-components"
import { PageBreadcrumb } from "../../components"
import { USER_ROLES } from "../../constants"
import ROUTES from "../../constants/routes"
import StaffPicker from "./StaffPicker"
import { useDashboard } from "../../contexts"
const { TabPane } = Tabs
export default () => {
  const match = useRouteMatch<any>()

  const { challengeSettings } = useDashboard()
  const history = useHistory()
  const { currentOrganisation, setCurrentOrganisationById } = useCurrentOrganisation()
  const { currentChallenge } = useCurrentChallenge()

  // const onSelect = (selectedKeys, info) => {
  //   history.push(
  //     generatePath(ROUTES.THEME, {
  //       organisationId: match.params.organisationId,
  //       themeId: info.node.key,
  //     })
  //   )
  // }

  const routes = [
    {
      path: generatePath(ROUTES.ORGANISATION, {
        organisationId: currentOrganisation.id,
      }),
      breadcrumbName: currentOrganisation.name,
    },
    {
      path: generatePath(ROUTES.CHALLENGE, {
        challengeId: currentChallenge.id,
      }),
      breadcrumbName: currentChallenge.name,
    },
    { breadcrumbName: "Configuration" },
  ]

  const onChange = (key) => {
    const path = generatePath(ROUTES.CHALLENGE_SETTINGS, {
      challengeId: currentChallenge.id,
      settingId: key,
    })
    history.push(path)
  }

  return (
    <>
      <PageBreadcrumb routes={routes} />
      <PageContent>
        <h4>Configuration : {currentChallenge.name}</h4>

        <div className="card-container">
          <StaffPicker staff={challengeSettings?.staff} />
        </div>
        {/* <Tabs
            type="card"
            defaultActiveKey={match.params.settingId}
            onChange={onChange}
          >
            <TabPane tab="General" key="general">
              <p>Content of Tab Pane 1</p>
              <p>Content of Tab Pane 1</p>
              <p>Content of Tab Pane 1</p>
            </TabPane> 
          </Tabs> */}
      </PageContent>
    </>
  )
}

const PageContent = styled(Content)`
  background-color: #fff;
  padding: 16px;
`
