import { ROLES } from "@maracuja/shared/constants"
import { objectSubset } from "@maracuja/shared/helpers"
import { Field, Form, Formik } from "formik"
import moment from "moment"
import React, { useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import * as Yup from "yup"
// import { useHistory } from 'react-router-dom';
import { Button, CheckboxField, FormikErrorLabel, HelpLink, Modal, Popup, RegularLink, Text2 } from "../../components"
import { ROUTES } from "../../constants"
import { useApp } from "../../contexts"

const SignUpClubLicensePopup = ({ open, onClose, informations, onValidLicenseForm }) => {
  const [showForm, setShowForm] = useState(false)
  let user = informations.user
  const { logEvent, openAlert } = useApp()
  const history = useHistory()

  const formSchema = Yup.object().shape({
    // birthday: Yup.string().matches(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, 'Date de naissance incorrecte (jj/mm/aaaa)')
  })

  const onSubmit = (values) => {
    informations.user = updateUserFromValues(values)
    onValidLicenseForm(informations)
  }
  const updateUserFromValues = (values) => {
    const captainIndex = user.roles?.indexOf("CAPTAIN")
    if (captainIndex !== -1 && !values.isCaptain) {
      user.roles?.splice(0, 1)
    }
    user.birthday = moment(values.birthday, "DD/MM/YYYY").toDate()
    user.firstName = values.firstName
    user.updatedLicenseInfo = true
    return user
  }

  const handleModifyClub = (values) => {
    // ROUTES.SIGN_UP_CLUBPICKER
    user = updateUserFromValues(values)
    const state = { user: objectSubset(user, ["birthday", "firstName", "licenseNumber", "roles"]) }
    openAlert({
      title: "Modifier ton club",
      message: "Ton club n'est pas jour ? Nous allons corriger ça. ",
      buttons: [
        { text: "Annuler", role: "cancel" },
        {
          text: "Trouve ton club",
          handler: () => {
            logEvent("willModifyClub")
            history.push(ROUTES.SIGN_UP_CLUBPICKER, state)
          },
        },
      ],
    })
  }

  return (
    <Modal isOpen={open} onClose={onClose} closeButton title="Licence verifiée !">
      {showForm ? (
        <Formik
          initialValues={{
            firstName: user.firstName,
            isCaptain: user.roles?.includes(ROLES.CAPTAIN),
            birthday: moment(user.birthday).format("DD/MM/YYYY"),
          }}
          validationSchema={formSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, values }) => {
            return (
              <Form>
                {/* <Text2>Ton prénom : </Text2> */}
                {/* <Field className='lightBg' type='text' name='firstName' placeholder='Entre ton prénom' /> */}
                {user.firstName && <p>Prénom : {user.firstName}</p>}
                {/* <Text2>Ta date de naissance : </Text2> */}
                {/* <Field className='lightBg' type='text' name='birthday' placeholder='Entre ton date de naissance' /> */}
                {/* <FormikErrorLabel  value='birthday' /> */}
                <p>
                  Club : {informations.team.name}{" "}
                  <RegularLink lightBg inline onClick={() => handleModifyClub(values)}>
                    Modifier
                  </RegularLink>
                </p>

                {user.roles?.includes(ROLES.CAPTAIN) && (
                  <p>
                    <CheckboxField name="isCaptain" label="Je suis captain du club" style={{ margin: "25px 0" }} />
                  </p>
                )}
                <br />
                <HelpLink lightBg label="licenseInformationsModification" />
                <br />
                <Button type="submit">Ok</Button>
              </Form>
            )
          }}
        </Formik>
      ) : (
        <>
          <p>Prénom : {user.firstName}</p>
          {/* <p>Date de naissance : {moment(user.birthday).format('DD/MM/YYYY')}</p> */}
          <p>Club : {informations.team.name}</p>
          {user.roles?.includes(ROLES.CAPTAIN) && <p>Tu es captain du club</p>}
          <RegularLink
            lightBg
            onClick={() => {
              setShowForm(true)
              logEvent("signup_want_edit_data")
            }}
          >
            Ces informations ne sont pas correctes ?{" "}
          </RegularLink>
          <br />
          <Button onClick={() => onValidLicenseForm(informations)}>OK</Button>
        </>
      )}
    </Modal>
  )
}

export default SignUpClubLicensePopup
