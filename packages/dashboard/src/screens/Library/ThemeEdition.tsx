import { useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Module, Theme } from "@maracuja/shared/models"
import { Button } from "antd"
import { Form, Formik } from "formik"
import React from "react"
import FieldContainer from "../../components/FormikFieldContainer"
import { useDashboard } from "../../contexts"

export default ({ onCreate, moduleId }) => {
  const { currentOrganisation } = useCurrentOrganisation()
  const { setLoading } = useDashboard()

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    const params = {
      name: values.name,
      organisationId: currentOrganisation.id,
      moduleId,
    }
    setSubmitting(false)
    await Theme.create(params)
    setLoading(false)
    onCreate()
  }

  return (
    <Formik
      initialValues={{ name: "" }}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {(props) => (
        <Form style={{ padding: 20 }}>
          <FieldContainer name="name" type="text" label="Nom du Theme" />
          <Button
            htmlType="submit"
            className="btn "
            disabled={props.isSubmitting}
          >
            Créer
          </Button>
          <br />
          <br />
        </Form>
      )}
    </Formik>
  )
}
