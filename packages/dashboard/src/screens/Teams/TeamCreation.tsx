import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Team } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import React, { useMemo } from "react"
import FieldContainer from "../../components/FormikFieldContainer"
import { useDashboard } from "../../contexts"
import { CheckboxField } from "@maracuja/shared/components"

export default ({ onSaveEnded }) => {
  const { currentChallenge, currentPhase } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()
  const { setLoading } = useDashboard()

  const handleSubmitForm = async (values) => {
    setLoading(true)
    try {
      await Team.create(
        { challengeId: currentChallenge.id, id: values.id },
        {
          organisationId: currentOrganisation.id,
          name: values.name,
          fromExistingClub: values.fromExistingClub,
          currentPhaseId: currentPhase?.id,
        }
      )
      onSaveEnded()
    } catch (error) {
      throw Error(error)
    } finally {
      setLoading(false)
    }
  }

  const initValues = useMemo(() => {
    const values = {
      id: "",
      name: "Aucun nom",
    }
    return values
  }, [])

  return (
    <>
      <Formik initialValues={initValues} enableReinitialize onSubmit={handleSubmitForm}>
        {(props) => {
          return (
            <Form style={{ padding: 20 }}>
              <p>
                <CheckboxField name="fromExistingClub" label="A partir d'un club existant" />{" "}
              </p>
              {!props.values.fromExistingClub && <FieldContainer label="Nom de l'équipe" name="name" type="text" />}

              <FieldContainer
                label="Identifiant (laisser vide pour le generer automatiquement)"
                name="id"
                type="text"
              />

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
