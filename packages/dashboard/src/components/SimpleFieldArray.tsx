import { FieldArray, useFormikContext } from "formik"
import React from "react"
import FieldContainer from "./FormikFieldContainer"
import FormGroup from "./FormGroup"

export default ({ name, label }) => {
  const formik = useFormikContext<any>()
  return (
    <FormGroup>
      <p>{label}</p>
      {/* @ts-ignore */}
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <div>
            {formik.values[name] && formik.values[name].length > 0 ? (
              <>
                {formik.values[name].map((optin, index) => (
                  <div key={`key${index}`} style={{ borderTop: "1px solid white" }}>
                    <FieldContainer
                      name={`${name}.${index}`}
                      type="text"
                      label="Valeur"
                      placeholder="Entrez la valeur"
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
                    arrayHelpers.insert(formik.values[name].length, "")
                  }}
                >
                  Ajouter une valeur{" "}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  style={{ marginTop: "30px" }}
                  onClick={() => {
                    arrayHelpers.insert(formik.values[name].length, "")
                  }}
                >
                  Ajouter des valeurs
                </button>
              </>
            )}
          </div>
        )}
      />
    </FormGroup>
  )
}
