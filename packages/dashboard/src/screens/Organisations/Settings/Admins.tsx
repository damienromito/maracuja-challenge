import React, { useEffect, useState } from "react"
import { useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Form, Formik, useFormikContext } from "formik"
import { Button, notification } from "antd"
import { FormGroup } from "../../../components"
import FieldContainer from "../../../components/FormikFieldContainer"
import { Organisation, User } from "@maracuja/shared/models"
import { CheckboxField } from "@maracuja/shared/components"
import { USER_ROLES } from "@maracuja/shared/constants"
import { useDashboard } from "../../../contexts"

export default () => {
  const { currentOrganisation } = useCurrentOrganisation()
  const { setLoading } = useDashboard()
  // const formik = useFormikContext<any>()
  const [admins, setAdmins] = useState<any>([])

  useEffect(() => {
    const unsub = loadAdmins()
    return () => {
      unsub()
    }
  }, [])

  const loadAdmins = () => {
    return currentOrganisation.fetchAdmins({
      listener: (objects) => {
        if (objects) {
          setAdmins(objects)
        }
      },
    })
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      await currentOrganisation.addAdmin({
        email: values.email.trim().toLowerCase(),
        firstName: values.firstName,
        role: USER_ROLES.AUTHOR,
      })
      notification.open({
        message: "Un email a été envoyé à l'auteur : " + values.email,
      })
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h6>Admins/Auteurs</h6>
      <ul>
        {admins?.map((admin) => {
          return (
            <li key={admin.id}>
              - {admin.username} ({admin.id})
            </li>
          )
        })}
      </ul>
      <h4>Ajouter un admin</h4>
      <Formik initialValues={{ email: "", firstName: "" }} onSubmit={handleSubmit}>
        <Form style={{ padding: 20 }}>
          <FieldContainer name="email" type="email" label="Email de la personne à ajouter" />
          <FieldContainer name="firstName" type="text" label="Prénom de la personne à ajouter" />

          <Button type="default" htmlType="submit">
            Ajouter un auteur
          </Button>
        </Form>
      </Formik>
    </>
  )
}
