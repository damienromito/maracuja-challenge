import { Form, Formik } from "formik"
import { useEffect } from "react"
import FieldContainer from "../../components/FormikFieldContainer"

const DEFAULTITEM = { name: "" }

const TribeForm = ({ item, onSaveItem, onToggleEditMode = null }) => {
  const onSave = (values) => {
    values.id = item
      ? item.id
      : values.name
          .replace(/( |')/g, "_")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")

    return onSaveItem(values)
  }

  return (
    <div>
      <Formik initialValues={item || DEFAULTITEM} enableReinitialize onSubmit={onSave}>
        <Form style={{ padding: 20 }}>
          <FieldContainer name="name" type="text" label="Nom de la tribu" />

          <br />
          <br />
          <button type="submit" className="btn grey darken-4">
            Enregistrer
          </button>

          {onToggleEditMode && (
            <button onClick={onToggleEditMode} className="btn right grey darken-4">
              Annuler
            </button>
          )}

          <br />
          <br />
        </Form>
      </Formik>
    </div>
  )
}

export default TribeForm
