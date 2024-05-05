import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"
import ReactDOM from "react-dom"
import {
  ApiContextProvider,
  AppContextProvider,
  AuthUserContextProvider,
  ChallengeContextProvider,
  DeviceContextProvider,
  NotificationContextProvider,
  OrganisationContextProvider,
} from "./contexts"

if (process.env.REACT_APP_ENV === "production" && !process.env.REACT_APP_DEBUG) {
  console.log("SENTRY ON *******************************")
  Sentry.init({
    dsn: "https://4d2b0508124b476aa0e51f4e1ad787d6@o1089927.ingest.sentry.io/6105537",
    integrations: [new Integrations.BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.5,
  })
}

const App = () => {
  return (
    <DeviceContextProvider>
      <ApiContextProvider>
        <AuthUserContextProvider>
          <OrganisationContextProvider>
            <ChallengeContextProvider>
              <NotificationContextProvider>
                <AppContextProvider />
              </NotificationContextProvider>
            </ChallengeContextProvider>
          </OrganisationContextProvider>
        </AuthUserContextProvider>
      </ApiContextProvider>
    </DeviceContextProvider>
  )
}

const render = <App />

ReactDOM.render(render, document.getElementById("root"))
