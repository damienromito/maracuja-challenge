import { useFormikContext } from "formik"
import React from "react"
import { CheckboxField, FormGroup } from "../../../components"
import FieldContainer from "../../../components/FormikFieldContainer"

export default () => {
  const formik = useFormikContext<any>()

  return (
    <>
      <FormGroup>
        <p>
          <CheckboxField name="lotteriesEnabled" label="Lotteries" />{" "}
        </p>
        {formik.values.lotteriesEnabled && (
          <>
            <FieldContainer name="lotteriesInfo.title" type="text" label="Titre de la suggestion" />
            <FieldContainer name="lotteriesInfo.description" type="text" label="Description de la suggestion" />
            <FieldContainer name="lotteriesInfo.rulesUrl" type="text" label="Lien du réglement" />
          </>
        )}
      </FormGroup>

      <FormGroup>
        <p>
          <CheckboxField name="surveysEnabled" label="Sondages" />{" "}
        </p>
      </FormGroup>
      <FormGroup>
        <p>
          <CheckboxField name="ideasBoxesEnabled" label="Boite à idées" />
        </p>
      </FormGroup>

      <FormGroup>
        <p>
          <CheckboxField name="icebreakerEnabled" label="Icebreaker" />
        </p>
        {formik.values.icebreakerEnabled && (
          <>
            <FieldContainer name="icebreaker.title" type="text" label="Titre de la suggestion" />
            <FieldContainer name="icebreaker.description" type="text" label="Description de la suggestion" />
          </>
        )}
      </FormGroup>

      <FormGroup>
        <p>
          <CheckboxField name="externalActivitiesEnabled" label="Activer les activités externes" />{" "}
        </p>
      </FormGroup>
    </>
  )
}
