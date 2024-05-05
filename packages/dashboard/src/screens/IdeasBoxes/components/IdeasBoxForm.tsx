import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Button } from "antd"
import { Form, Formik } from "formik"
import { useMemo } from "react"
import FieldContainer from "../../../components/FormikFieldContainer"
import { objectSubsetWithPlaceholder } from "../../../helpers"
import DatesField from "../../Challenges/Activities/DatesField"
import DisplayDatePicker from "../../Challenges/Activities/DisplayDatePicker"
import * as Yup from "yup"
import IdeasBox, { defaultIdeasBox } from "@maracuja/shared/models/IdeasBox"

export type IdeasBoxFormValue = typeof defaultIdeasBox

const formSchema = Yup.object().shape({
  name: Yup.string().required("Champs obligatoire"),
  description: Yup.string().required("Champs obligatoire"),
  phaseId: Yup.string().required("Champs obligatoire"),
})

interface IdeasBoxFormProps {
  ideasBox?: IdeasBox
  onSubmit?: (values: IdeasBoxFormValue) => void
  submitButtonText: string
}
const IdeasBoxForm = ({ ideasBox, onSubmit, submitButtonText }: IdeasBoxFormProps) => {
  const { currentChallenge } = useCurrentChallenge()

  const initialValues = useMemo(() => {
    if (ideasBox) return ideasBox
    defaultIdeasBox.startDate = currentChallenge.startDate
    defaultIdeasBox.endDate = currentChallenge.endDate
    defaultIdeasBox.phaseId = currentChallenge.phases[0].id
    return defaultIdeasBox
  }, [ideasBox])

  return (
    <Formik initialValues={initialValues} enableReinitialize onSubmit={onSubmit} validationSchema={formSchema}>
      <Form style={{ padding: 20 }}>
        <FieldContainer label="Titre" name="name" type="text" />
        <FieldContainer name="description" label="Description" component="textarea" />
        <DatesField>
          <DisplayDatePicker name="startDate" label="Date de début d'affichage" />
          <DisplayDatePicker name="endDate" label="date de fin d'affichage" />
        </DatesField>
        <FieldContainer
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
        </FieldContainer>

        <Button type="primary" htmlType="submit">
          {submitButtonText}
        </Button>
      </Form>
    </Formik>
  )
}

export default IdeasBoxForm
