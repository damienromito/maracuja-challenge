import React from "react"
import { Formik, Form } from "formik"
import FieldContainer from "../../components/FormikFieldContainer"

const ItemForm = ({ item = {}, onSaveItem, onToggleEditMode = null, schema }) => {
  // DEFAULT VALUES
  if (!item) {
    Object.keys(schema.fields).map((key) => {
      const field = schema.fields[key]
      item[key] = field.default
      return true
    })
  }

  return (
    <Formik
      initialValues={item}
      onSubmit={(values) => {
        onSaveItem(values)
      }}
    >
      <Form>
        {Object.keys(schema.fields).map((key) => {
          const field = schema.fields[key]
          return <FieldContainer key={key} name={key} type="text" label={field.label} />
        })}

        <br />
        <br />
        <button type="submit" className="btn">
          Enregistrer
        </button>
        {onToggleEditMode && (
          <button onClick={onToggleEditMode} className="btn">
            Annuler
          </button>
        )}
        <br />
        <br />
      </Form>
    </Formik>
  )
}

export default ItemForm
