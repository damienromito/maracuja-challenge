import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Button } from "antd"
import { Form, Formik, useFormik, useFormikContext } from "formik"
import { useMemo, useState } from "react"
import FieldContainer from "../../../components/FormikFieldContainer"
import { objectSubsetWithPlaceholder } from "../../../helpers"
import DatesField from "../../Challenges/Activities/DatesField"
import DisplayDatePicker from "../../Challenges/Activities/DisplayDatePicker"
import * as Yup from "yup"
import { Survey } from "@maracuja/shared/models"
import { CheckboxField, SimpleFieldArray } from "../../../components"

export type SurveyFormValue = typeof defaultSurvey

interface SurveyFormProps {
  survey?: Survey
  onSubmit?: (values: SurveyFormValue) => void
  submitButtonText: string
}
const SurveyForm = ({ survey, onSubmit, submitButtonText }: SurveyFormProps) => {
  const { currentChallenge } = useCurrentChallenge()

  const initialValues = useMemo(() => {
    if (survey) return surveyToFormValue(survey)
    defaultSurvey.startDate = currentChallenge.startDate
    defaultSurvey.endDate = currentChallenge.endDate
    // defaultSurvey.phaseId = currentChallenge.phases[0].id
    return defaultSurvey
  }, [survey])

  return (
    <Formik initialValues={initialValues} enableReinitialize onSubmit={onSubmit} validationSchema={formSchema}>
      {(props) => (
        <Form style={{ padding: 20 }}>
          <section>
            <FieldContainer label="Titre" name="name" type="text" />
            <DatesField>
              <DisplayDatePicker name="startDate" label="Date de début d'affichage" />
              <DisplayDatePicker name="endDate" label="date de fin d'affichage" />
            </DatesField>
            {/* <FieldContainer
          component="select"
          className="browser-default"
          name="phaseId"
          label="Comptabilisé pour la phase..."
        >
          {currentChallenge.phases.map((phase) => {
            return (
              <option key={phase.id} value={phase.id}>
                {phase.name}
              </option>
            )
          })}
        </FieldContainer> */}
            <FieldContainer
              name="preview"
              type="text"
              component="textarea"
              label="Aperçu de la description de l'activité (Afficher sur la suggestion)"
            />
            <FieldContainer label="Lien pour editer le Google Form (Copier l'url)" name="formEditionUrl" type="text" />
            <FieldContainer
              label='Lien Google Form (Aller dans "Envoyer> Envoyer via> copier le lien)'
              name="formUrl"
              type="text"
            />
            <CheckboxField name="isAnonyme" label="Le sondage est anonyme" />
            {!props.values.isAnonyme && (
              <FieldContainer
                name="prefilledPlayerIdField"
                label=" Identifiant du champs à préremplir avec le player Id (Comment ? : Dans google form, ajouter un champs en bas du formulaire > cliquez sur les 3 petits points en haut > Obtenir le lien > entrez 'code' dans le champs > obtenir le lien > copier le code XXXX dans &entry.XXXX=code )"
                type="text"
              />
            )}
            <FieldContainer name="actionButtonText" label="Texte du bouton d'action" type="text" />
            {/* <FieldContainer name='authorizedTeams' label="Audience limitée : Id des équipes séparé par une virgule (laisser vide pour ne pas limiter l'accès)" type='text' /> */}
            <CheckboxField name="hasLimitedAudience" label="Limiter à certaines équipes" />
            {props.values.hasLimitedAudience && (
              <SimpleFieldArray
                name="authorizedTeams"
                label="Audience limitée : Ajouter l'Id des équipes à autoriser (laisser vide pour ne pas limiter l'accès)"
              />
            )}
          </section>
          <footer>
            <Button type="primary" htmlType="submit">
              {submitButtonText}
            </Button>
          </footer>
        </Form>
      )}
    </Formik>
  )
}

export default SurveyForm

const surveyToFormValue = (survey: Survey): SurveyFormValue => {
  return {
    name: survey.name,
    preview: survey.preview,
    startDate: survey.startDate,
    endDate: survey.endDate,
    formEditionUrl: survey.formEditionUrl,
    formUrl: survey.formUrl,
    authorizedTeams: survey.authorizedTeams,
    prefilledPlayerIdField: survey.prefilledPlayerIdField,
    actionButtonText: survey.actionButtonText,
    isAnonyme: !survey.prefilledPlayerIdField,
    hasLimitedAudience: !!survey.authorizedTeams,
  }
}

const defaultSurvey = {
  // phaseId: new Date() as Date,
  actionButtonText: "Participer" as string,
  authorizedTeams: null as string[],
  endDate: new Date() as Date,
  formEditionUrl: "" as string,
  formUrl: "" as string,
  hasLimitedAudience: false as boolean,
  isAnonyme: true as boolean,
  name: "Sondage" as string,
  prefilledPlayerIdField: null as number | undefined,
  preview:    "Comment c'était ? Aidez-nous à améliorer les futurs challenges en répondant à ces 5 questions ! (1 min) 🙏" as string, // prettier-ignore
  startDate: new Date() as Date,
}

const formSchema = Yup.object().shape({
  name: Yup.string().required("Champs obligatoire"),
  preview: Yup.string().required("Champs obligatoire"),
  formUrl: Yup.string().required("Champs obligatoire"),
  formEditionUrl: Yup.string().required("Champs obligatoire"),
  // phaseId: Yup.string().required("Champs obligatoire"),
})
