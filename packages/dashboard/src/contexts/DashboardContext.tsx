import { RoleBasedSwitch } from "@maracuja/shared/components"
import { useAuthUser, useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Layout } from "antd"
import React, { createContext, useContext, useState } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import styled from "styled-components"
import { Spinner } from "../components"
import useStats from "../hooks/useStats"
import SideMenu from "../layouts/SideMenu"
import routes from "../screens/App/router"
import GlobalStyles from "../styles/global-styles"
import useChallengeSettings from "../hooks/useChallengeSettings"
import useListener from "../hooks/useListener"
import { OrganisationSettings } from "@maracuja/shared/models"

const { Footer } = Layout

declare global {
  interface Window {
    testUrl: string
  }
}

window.testUrl =
  window.location.origin === "http://localhost:3000"
    ? "http://localhost:3001"
    : "https://english-challenge-test.firebaseapp.com/"

const DashboardContextProvider = () => {
  const { currentChallengeLoading, currentChallenge } = useCurrentChallenge()
  const { currentOrganisationLoading, currentOrganisation } = useCurrentOrganisation()
  const { authUserLoading, authUser } = useAuthUser()
  const [loading, setLoading] = useState<any>(false)
  const stats = useStats({ challengeId: currentChallenge?.id })
  const challengeSettings = useChallengeSettings({ challengeId: currentChallenge?.id })
  const [menuCollapsed, setMenuCollapsed] = useState<any>(false)

  const organisationSettings = useListener(
    (listener) => {
      if (!currentOrganisation) return

      return OrganisationSettings.fetch(
        { organisationId: currentOrganisation.id, id: "general" },
        {
          listener,
        }
      )
    },
    null,
    [currentOrganisation?.id]
  )

  return (
    <DashboardContext.Provider
      value={{
        loading,
        setLoading,
        setMenuCollapsed,
        stats,
        challengeSettings,
        organisationSettings,
      }}
    >
      <AppPage>
        <GlobalStyles />
        {loading && <Spinner />}

        {currentChallengeLoading || authUserLoading || currentOrganisationLoading ? (
          <Spinner />
        ) : (
          <Router>
            <Layout hasSider>
              {/* <Navigation routes={routes} /> */}
              {authUser && <SideMenu collapsed={menuCollapsed} setCollapsed={setMenuCollapsed} />}

              <Wrapper className="site-layout">
                <RoleBasedSwitch routes={routes} />
                <Footer style={{ textAlign: "center" }}>Maracuja ©2022</Footer>
              </Wrapper>
            </Layout>
          </Router>
        )}
      </AppPage>
    </DashboardContext.Provider>
  )
}

const DashboardContext = createContext<any>(null)

const useDashboard = () => useContext(DashboardContext)

export { useDashboard, DashboardContextProvider }

const AppPage = styled.div`
  color: black;
`
const Wrapper = styled(Layout)`
  padding: 16px;
  margin-left: 200px;
`
