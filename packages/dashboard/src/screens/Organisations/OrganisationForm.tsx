import { useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Organisation } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import FieldContainer from "../../components/FormikFieldContainer"
import { useDashboard } from "../../contexts"
import { generateId } from "../../helpers"

export default ({ challenge = null, onCreated, onToggleEditMode = null }) => {
  const { currentOrganisation } = useCurrentOrganisation()
  const { setLoading } = useDashboard()

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    const params: any = { name: values.name }
    if (currentOrganisation) {
      params.organisationId = currentOrganisation.id
    }
    params.settings = { general: {} }
    const id = generateId(values.name)
    await Organisation.create({ id }, params)
    setSubmitting(false)
    setLoading(false)
    return onCreated(id)
  }

  return (
    <div>
      <Formik
        initialValues={
          challenge || {
            name: "",
          }
        }
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Form style={{ padding: 20 }}>
            <FieldContainer name="name" type="text" label="Nom de l'organisation" />
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
        )}
      </Formik>
    </div>
  )
}
