import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Team } from "@maracuja/shared/models"
import { Form, Formik, useFormikContext } from "formik"
import React, { useMemo } from "react"
import FieldContainer from "../../components/FormikFieldContainer"
import { useDashboard } from "../../contexts"
import { CheckboxField } from "@maracuja/shared/components"

export default ({ onSaveEnded }) => {
  const { currentChallenge, currentPhase } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()
  const { setLoading } = useDashboard()
  const formik = useFormikContext<any>()

  const handleSubmitForm = async (values) => {
    setLoading(true)
    try {
      await Team.generate({
        clubsCount: values.clubsCount,
        namingType: values.namingType,
        challengeId: currentChallenge.id,
        organisationId: currentOrganisation.id,
        haveToCreateMaracujaTeam: values.haveToCreateMaracujaTeam,
      })
      onSaveEnded()
    } catch (error) {
      throw Error(error)
    } finally {
      setLoading(false)
    }
  }

  const initValues = useMemo(() => {
    const values = {
      namingType: "random",
      clubsCount: 1,
      haveToCreateMaracujaTeam: true,
    }
    return values
  }, [])

  return (
    <>
      <Formik initialValues={initValues} enableReinitialize onSubmit={handleSubmitForm}>
        {(props) => {
          return (
            <Form style={{ padding: 20 }}>
              <FieldContainer
                component="select"
                className="browser-default"
                name="namingType"
                label="Nom des clubs"
                // value={formik.values.namingType}
              >
                <option key="random" value="random">
                  Aleatoire (Les Determinés, Les Inouïs,...)
                </option>
                <option key="unamed" value="unamed">
                  Aucun nom (Équipe 1, Équipe 2, ...)
                </option>
              </FieldContainer>

              <FieldContainer label="Nombre d'équipe" name="clubsCount" max={12} min={0} type="number" />

              <p>
                <CheckboxField name="haveToCreateMaracujaTeam" label="Créer l'équipe Maracuja en plus" />
              </p>

              <button className="btn grey darken-4" type="submit">
                Créer
              </button>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}
