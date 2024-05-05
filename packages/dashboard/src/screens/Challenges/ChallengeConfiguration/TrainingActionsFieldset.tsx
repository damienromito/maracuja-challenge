import { FieldArray, useFormikContext } from "formik"
import DatePicker from "react-datepicker"
import { FormGroup } from "../../../components"
import FieldContainer from "../../../components/FormikFieldContainer"

const TrainingActionsFieldset = () => {
  const formik = useFormikContext<any>()
  const fieldName = "trainingActions.dates"

  return (
    <FormGroup>
      <h5>Dates des actions de formation</h5>

      <FieldContainer name="trainingActions.label" type="text" label="Libellé (ex : Formation)" />
      <FieldContainer
        name="trainingActions.name"
        type="text"
        label="Nom de la formation (ex : Accompagnement au changement)"
      />
      {/* @ts-ignore */}
      <FieldArray
        name={fieldName}
        render={(arrayHelpers) => {
          const dates = formik.values.trainingActions?.dates || []
          return (
            <div>
              {dates?.length > 0 ? (
                <>
                  {dates.map((optin, index) => (
                    <div key={`key${index}`} style={{ borderTop: "1px solid white" }}>
                      <DatePicker
                        dateFormat="dd MMMM yyyy H:mm"
                        locale="fr"
                        name={`${fieldName}.${index}`}
                        onChange={(val) => formik.setFieldValue(`${fieldName}.${index}`, val)}
                        selected={dates[index]}
                        showTimeSelect
                        value={dates[index]}
                      />

                      <button
                        type="button"
                        style={{ marginTop: "15px", display: "block" }}
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    style={{ marginTop: "30px" }}
                    onClick={() => {
                      arrayHelpers.insert(dates.length, "")
                    }}
                  >
                    Ajouter un date
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    style={{ marginTop: "30px" }}
                    onClick={() => {
                      arrayHelpers.insert(dates.length, "")
                    }}
                  >
                    Créer une date
                  </button>
                </>
              )}
            </div>
          )
        }}
      />
    </FormGroup>
  )
}

export default TrainingActionsFieldset
