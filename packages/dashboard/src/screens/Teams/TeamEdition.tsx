import { Form, Formik } from "formik"
import React, { useEffect, useMemo, useState } from "react"
import { CheckboxField, FormButton } from "../../components"
import CropImageField from "../../components/CropImageField"
import FieldContainer from "../../components/FormikFieldContainer"
import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { getGeoFromZipCode } from "../../utils/clubs"
import { Team } from "@maracuja/shared/models"
import { useRouteMatch, useHistory } from "react-router-dom"
import M from "materialize-css"

export default ({ onSaveItem, onToggleEditMode, regions, departments, tribes }) => {
  const { currentChallenge } = useCurrentChallenge()
  const [team, setTeam] = useState<any>(null)
  const match = useRouteMatch<any>()
  const history = useHistory()

  useEffect(() => {
    initTeam()
  }, [])

  const initTeam = async () => {
    const data = await Team.fetch({ challengeId: currentChallenge.id, id: match.params.teamId })
    setTeam(data)
  }

  const handleSubmitForm = async (values) => {
    await team.update({ name: values.name })
    M.toast({ html: "Equipe modifiée" })
  }

  const handleClickDelete = async () => {
    if (window.confirm("Supprimer cette équipe ? (le club restera en base)")) {
      await team.delete()
    }
    history.goBack()
  }
  if (!team) return null
  return (
    <>
      <Formik
        initialValues={{
          name: team.name || "Aucun nom",
        }}
        enableReinitialize
        onSubmit={handleSubmitForm}
      >
        <Form style={{ padding: 20 }}>
          <FieldContainer label="Nom de l'équipe" name="name" type="text" />

          <button className="btn grey darken-4" type="submit">
            Enregistrer
          </button>
          <br />
          <br />
          <FormButton type="button" onClick={handleClickDelete} red>
            Supprimer
          </FormButton>

          {onToggleEditMode && (
            <button className="btn right grey darken-4" onClick={onToggleEditMode}>
              Annuler
            </button>
          )}
        </Form>
      </Formik>
    </>
  )
}
