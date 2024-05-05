import { useCurrentOrganisation } from "@maracuja/shared/contexts"
import { OrganisationSettings } from "@maracuja/shared/models"
import { notification } from "antd"
import { Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { FormGroup } from "../../../components"
import FieldContainer from "../../../components/FormikFieldContainer"

export default () => {
  const { currentOrganisation } = useCurrentOrganisation()
  // const formik = useFormikContext<any>()
  const [general, setGeneral] = useState<any>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    return OrganisationSettings.fetch(
      { organisationId: currentOrganisation.id, id: "general" },
      {
        listener: (objects) => {
          setGeneral(objects)
        },
      }
    )
  }

  const handleSubmit = (values) => {
    const updatedData = { ...values }

    return OrganisationSettings.update({ organisationId: currentOrganisation.id, id: "general" }, updatedData).then(
      () => {
        notification.open({ message: "Configuration enregistrée" })
      }
    )
  }

  return !general ? null : (
    <>
      <Formik initialValues={{ themes: general.themes || { spreadsheetUrl: "" } }} onSubmit={handleSubmit}>
        <Form style={{ padding: 20 }}>
          <FormGroup>
            <h5>Contenus</h5>

            <FieldContainer name="themes.spreadsheetUrl" type="text" label="Url Google Spread Sheet" />
            {/* {formik.values.themes.spreadsheetUrl &&
              <p><a href={formik.values.themes.spreadsheetUrl}`} target='_blank' rel='noreferrer'>Aller au SpreadSheet</a></p>}
            <span>ℹ️ Ajouter cet email aux personnes pouvant editer le document : google-sheets-maracuja@maracuja-english-challenge.iam.gserviceaccount.com</span> */}
          </FormGroup>

          <br />
          <br />
          {/* <Button onClick={onSu} >Enregistrer</Button> */}
          <p>
            {" "}
            <button type="submit" className="btn">
              Enregistrer
            </button>
          </p>
        </Form>
      </Formik>
    </>
  )
}
