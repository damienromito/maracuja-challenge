import { CheckboxField } from "@maracuja/shared/components"
import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Challenge } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import React, { useMemo } from "react"
import { FormGroup } from "../../components"
import FieldContainer from "../../components/FormikFieldContainer"
import { useDashboard } from "../../contexts"
import DisplayDatePicker from "./Activities/DisplayDatePicker"

export default ({ challenge = undefined, onChallengeSaved, onToggleEditMode = undefined }) => {
  const { currentOrganisation } = useCurrentOrganisation()
  const { getChallengesHistory } = useCurrentChallenge()
  const { setLoading } = useDashboard()

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    const params = { ...values }
    if (currentOrganisation) {
      params.organisationId = currentOrganisation.id
    }
    const challenge = await Challenge.create(params)
    setSubmitting(false)
    setLoading(false)
    return onChallengeSaved(challenge.id)
  }

  const handleChangeCode = (e, props) => {
    const code = e.target.value.toUpperCase().trim()
    props.setFieldValue("code", code)
  }

  const challengesHistory = getChallengesHistory()

  const initValues = useMemo(() => {
    if (challenge) return challenge

    const defaultDate = new Date()
    defaultDate.setHours(6)
    defaultDate.setMinutes(0)
    return {
      name: "",
      code: "NOCODE",
      clubsGenerator: { count: 0 },
      organisationId: currentOrganisation.id,
      challengeIdToClone: null,
      startDate: defaultDate,
      startQuizDate: defaultDate,
      haveToUpdateCalendar: true,
    }
  }, [])
  return (
    <div>
      <Formik initialValues={initValues} enableReinitialize onSubmit={handleSubmit}>
        {(props) => {
          return (
            <Form style={{ padding: 20 }}>
              <FieldContainer name="name" type="text" label="Nom du challenge" />
              <DisplayDatePicker
                label="Date d'ouverture des inscriptions"
                name="startDate"
                dateFormat="d MMMM yyyy"
                showTimeSelect={false}
              />
              <DisplayDatePicker
                label="Date du début du challenge (1er quiz)"
                name="startQuizDate"
                dateFormat="d MMMM yyyy"
                showTimeSelect={false}
              />
              <FieldContainer
                name="code"
                type="text"
                label="Code pour acceder au challenge"
                onChange={(e) => handleChangeCode(e, props)}
              />
              <FieldContainer
                name="clubsGenerator.count"
                type="number"
                max={20}
                min={0}
                label="Nombre de clubs à générer"
              />

              <FieldContainer
                className="browser-default"
                component="select"
                name="challengeIdToClone"
                label="Copier les parametres d'un challenge existant (parmis les derniers challenges visités)"
              >
                <option value="">Aucun</option>
                {challengesHistory?.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.code})
                    </option>
                  )
                })}
              </FieldContainer>
              {props.values.challengeIdToClone && (
                <FormGroup>
                  <p>
                    Selectionner les éléments de{" "}
                    {challengesHistory.find((c) => c.id === props.values.challengeIdToClone).name} à cloner{" "}
                  </p>
                  <CheckboxField name="subCollectionsToClone.phases" label="Phases" />

                  <CheckboxField name="subCollectionsToClone.questionSets" label="Quiz" />
                  <CheckboxField name="subCollectionsToClone.lotteries" label="Lotteries" />
                  <CheckboxField name="subCollectionsToClone.surveys" label="Sondages" />
                  <CheckboxField name="subCollectionsToClone.externalActivities" label="Activités externes" />
                </FormGroup>
              )}

              {props.values.subCollectionsToClone?.questionSets && (
                <CheckboxField name="haveToUpdateCalendar" label="Mettre à jour les dates de quiz" />
              )}

              <button type="submit" className="btn grey darken-4" disabled={props.isSubmitting}>
                Créer
              </button>

              {onToggleEditMode && (
                <button onClick={onToggleEditMode} className="btn right grey darken-4">
                  Annuler
                </button>
              )}

              <br />
              <br />
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
