import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import {
  ApiContextProvider,
  ChallengeContextProvider,
  AuthUserContextProvider,
  OrganisationContextProvider,
} from "@maracuja/shared/contexts"
import { DashboardContextProvider } from "./contexts"
import { ThemeProvider } from "styled-components"
import { defaultTheme } from "./styles/themes"
// import * as serviceWorker from './serviceWorker'
console.log("[env]", process.env)

ReactDOM.render(
  <ApiContextProvider>
    <AuthUserContextProvider>
      <OrganisationContextProvider>
        <ChallengeContextProvider>
          <ThemeProvider theme={defaultTheme}>
            <DashboardContextProvider />
          </ThemeProvider>
        </ChallengeContextProvider>
      </OrganisationContextProvider>
    </AuthUserContextProvider>
  </ApiContextProvider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
