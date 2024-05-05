import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Form, Formik } from "formik"
import M from "materialize-css"
import React, { useMemo } from "react"
import { Tab, Tabs } from "react-materialize"
import styled from "styled-components"
import { objectSubsetWithPlaceholder } from "../../../helpers"
import TabActivities from "./Activities"
import ChallengeConfigAppUpdate from "./AppUpdate"
import ChallengeConfigTabAudience from "./Audience"
import challengeDefaultValues from "./challengeDefaultValues"
import ChallengeConfigTabGeneral from "./General"
import ChallengeConfigTabNotifications from "./Notifications"
import ChallengeConfigOnboarding from "./Onboarding"
import ChallengeConfigTabRules from "./Rules"
import ChallengeConfigTabSharing from "./Sharing"
import ChallengeConfigTabWording from "./Wording"

const Container = styled.div``
const ChallengeConfiguration = () => {
  const { currentChallenge } = useCurrentChallenge()

  // const [faq, setFaq] = useState<any>(null)

  const onSave = (values) => {
    const updatedData = { ...values }
    if (Array.isArray(updatedData.modules)) {
      delete updatedData.modules
    }
    return currentChallenge.update(updatedData).then(() => {
      M.toast({ html: "Challenge modifié !" })
    })
  }

  const initValues = useMemo(() => {
    const values = { ...objectSubsetWithPlaceholder(currentChallenge, challengeDefaultValues) }
    return values
  }, [])

  return (
    <Container>
      <h3>Configuration : {currentChallenge.name}</h3>

      <Formik initialValues={initValues} onSubmit={onSave}>
        <Form style={{ padding: 20 }}>
          <p>
            {" "}
            <button type="submit" className="btn grey darken-4">
              Enregistrer
            </button>
          </p>

          <Tabs>
            <Tab title="General">
              <ChallengeConfigTabGeneral />
            </Tab>
            <Tab title="Audience">
              <ChallengeConfigTabAudience />
            </Tab>
            <Tab title="Wording">
              <ChallengeConfigTabWording />
            </Tab>
            <Tab title="Règles">
              <ChallengeConfigTabRules />
            </Tab>
            <Tab title="Activités">
              <TabActivities />
            </Tab>
            <Tab title="Onboarding">
              <ChallengeConfigOnboarding />
            </Tab>
            <Tab title="Notifs">
              <ChallengeConfigTabNotifications />
            </Tab>
            <Tab title="Sharing">
              <ChallengeConfigTabSharing />
            </Tab>
            <Tab title="Mise à jour app">
              <ChallengeConfigAppUpdate />
            </Tab>
          </Tabs>
          <br />
          <br />
          <p>
            {" "}
            <button type="submit" className="btn grey darken-4">
              Enregistrer
            </button>
          </p>
        </Form>
      </Formik>
    </Container>
  )
}

export default ChallengeConfiguration
