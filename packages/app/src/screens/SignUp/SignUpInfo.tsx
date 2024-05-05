import { IonContent, IonDatetime, IonPage } from "@ionic/react"
import { Field, Form, Formik } from "formik"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import * as Yup from "yup"
import {
  Button,
  CheckboxField,
  Container,
  FormikErrorLabel,
  FormikFieldContainer,
  NavBar,
  Spinner,
} from "../../components"
import RadioGroupField from "../../components/RadioGroupField"
import ROUTES from "../../constants/routes"
import { useAuthUser, useCurrentChallenge } from "../../contexts"
import { currentDate } from "../../utils/helpers"

let INITIAL_VALUES = null

let displayedOptins = []
export default () => {
  const { authUser } = useAuthUser()
  const { currentPlayer, currentChallenge } = useCurrentChallenge()
  const history = useHistory()

  const [formSchema, setFormSchema] = useState(false)
  const [loading, setLoading] = useState(false)

  let formInput = null

  useEffect(() => {
    if (formInput) {
      formInput.focus()
    }
  }, [formInput])

  useEffect(() => {
    initForm()
  }, [])

  const initForm = () => {
    INITIAL_VALUES = {
      optinCgu: currentPlayer.optinCgu || false,
    }
    const YupObject: any = {}

    if (currentChallenge.cguLink) {
      YupObject.optinCgu = Yup.bool().oneOf([true], "Tu dois accepter les conditions avant de jouer.")
    }

    if (!currentPlayer.email) {
      INITIAL_VALUES.email = ""
      YupObject.email = Yup.string().notRequired().email("L'email n'est pas correct")
    }

    // if (currentPlayer.hasRole(PLAYER_ROLES.REFEREE)) {
    //   INITIAL_VALUES.optinDiscoverFFE = false
    // }

    displayedOptins = []

    if (currentChallenge.optins) {
      currentChallenge.optins.forEach((optin) => {
        if (currentPlayer[optin.id] != null || !optin.type) return
        if (optin.role && !currentPlayer.hasRole(optin.role)) return
        if (optin.type === "radio") {
          INITIAL_VALUES[optin.id] = ""
          if (optin.required) {
            YupObject[optin.id] = Yup.string().required(optin.requiredLabel || "Tu dois cocher une case")
          }
        } else if (optin.type === "checkbox") {
          INITIAL_VALUES[optin.id] = false
          if (optin.required) {
            YupObject[optin.id] = Yup.bool().oneOf([true], optin.requiredLabel || "Tu dois cocher ce champs")
          }
        } else if (optin.type === "text") {
          INITIAL_VALUES[optin.id] = ""
          if (optin.required) {
            YupObject[optin.id] = Yup.string().required(optin.requiredLabel || "Champs requis")
          }
        }
        displayedOptins.push(optin)
      })
    }

    const playerInfos = currentChallenge.playerInfos
    if (playerInfos) {
      if (playerInfos.birthday && !currentPlayer.birthday) {
        INITIAL_VALUES.birthday = currentPlayer.birthday || null
        if (!currentPlayer.optinParentApproval && INITIAL_VALUES.birthday) {
          const yearsOld = moment().diff(INITIAL_VALUES.birthday, "years")
          INITIAL_VALUES.optinParentApproval = yearsOld >= 13
        } else {
          INITIAL_VALUES.optinParentApproval = currentPlayer.optinParentApproval || false
        }
        YupObject.birthday = Yup.mixed().required("Entre ta date de naissance")
        YupObject.optinParentApproval = Yup.bool().oneOf(
          [true],
          "Tu dois avoir l'accord de tes parents pour participer"
        )
      }
      if (playerInfos.firstname) {
        INITIAL_VALUES.firstname = currentPlayer.firstname || ""
      }
    }

    setFormSchema(Yup.object().shape(YupObject))
  }

  const onSubmit = async (values, setSubmitting) => {
    setLoading(true)
    setSubmitting(true)

    const data = Object.assign({}, values)
    if (data.email) {
      data.email = data.email.trim()
    }

    await currentPlayer.update(data)

    history.push(ROUTES.ONBOARDING_WELCOME)
  }

  const handleDateFieldChange = (timeString, setFieldValue) => {
    const time = currentDate(timeString)
    setFieldValue("birthday", time)

    if (moment().diff(time, "years") >= 13) {
      setFieldValue("optinParentApproval", true)
    }
  }

  return (
    <IonPage>
      <IonContent>
        {loading ? (
          <Spinner />
        ) : (
          formSchema && (
            <>
              <NavBar title="Informations" />
              <Wrapper className="max-width-container">
                <Formik
                  enableReinitialize
                  initialValues={INITIAL_VALUES}
                  validationSchema={formSchema}
                  onSubmit={(values, { setSubmitting }) => onSubmit(values, setSubmitting)}
                >
                  {(props) => {
                    const { errors, touched, isSubmitting, setFieldValue, values } = props
                    return !values ? null : (
                      <Form>
                        {values.firstname && (
                          <Field
                            innerRef={(input) => {
                              formInput = input
                            }}
                            type="text"
                            name="firstname"
                            placeholder="Ton prénom"
                            style={currentPlayer.firstname ? { display: "none" } : { marginBottom: 10 }}
                          />
                        )}
                        {values.email && (
                          <>
                            <Field
                              innerRef={(input) => {
                                formInput = input
                              }}
                              type="text"
                              name="email"
                              placeholder="Ton adresse email"
                            />
                            <FormikErrorLabel value="email" />
                          </>
                        )}
                        {(values.birthday === null || values.birthday) && (
                          <>
                            <IonDatetime
                              displayFormat="DD/MM/YYYY"
                              pickerFormat="DD MMMM YYYY"
                              monthNames="Janvier,Fevrier,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre"
                              placeholder="Ta date de naissance"
                              cancelText="Annuler"
                              doneText="Valider"
                              value={values.birthday?.toISOString()}
                              name="birthday"
                              min="1920"
                              onIonChange={(e) => handleDateFieldChange(e.detail.value, setFieldValue)}
                            />
                            <FormikErrorLabel value="birthday" />
                          </>
                        )}
                        <CheckboxContainer>
                          {((values.birthday && moment().diff(values.birthday, "years") < 13) ||
                            (!currentPlayer.optinParentApproval &&
                              currentPlayer.birthday &&
                              moment().diff(currentPlayer.birthday, "years") < 13)) && (
                            <>
                              <CheckboxField
                                key="optinParentApproval"
                                name="optinParentApproval"
                                style={currentPlayer.optinParentApproval ? { display: "none" } : {}}
                                label="En cochant cette case, je certifie sur l'honneur disposer de l'accord parental ou d'un tuteur légal pour pouvoir accéder aux services du présent site."
                              />
                              <FormikErrorLabel value="optinParentApproval" />
                            </>
                          )}

                          {displayedOptins?.map((optin) => {
                            return (
                              <div key={optin.id} style={{ margin: "15px 0" }}>
                                {optin.type === "radio" && (
                                  <RadioGroupField
                                    errors={errors}
                                    touched={touched}
                                    name={optin.id}
                                    label={optin.label}
                                    buttons={optin.buttons}
                                  />
                                )}
                                {optin.type === "checkbox" && (
                                  <CheckboxField
                                    name={optin.id}
                                    style={currentPlayer[optin.id] ? { display: "none" } : {}}
                                    label={optin.label}
                                  />
                                )}
                                {optin.type === "text" && (
                                  <FormikFieldContainer
                                    name={optin.id}
                                    style={currentPlayer[optin.id] ? { display: "none" } : {}}
                                    placeholder={optin.label}
                                  />
                                )}

                                {optin.requiredLabel && <FormikErrorLabel key={`error-${optin.id}`} value={optin.id} />}
                              </div>
                            )
                          })}

                          {currentChallenge.cguLink && !currentPlayer.optinCgu && (
                            <div>
                              <CheckboxHTMLContainer>
                                <Field id="optinCgu" type="checkbox" name="optinCgu" />
                                <label htmlFor="optinCgu">
                                  En t’inscrivant, tu reconnais avoir pris connaissance et acceptes{" "}
                                  <a href={currentChallenge.cguLink} target="_blank" rel="noreferrer">
                                    les conditions générales d’utilisation
                                  </a>
                                  &nbsp;
                                  {currentChallenge.privacyLink && currentChallenge.privacyLink !== "" && (
                                    <>
                                      et la{" "}
                                      <a href={currentChallenge.privacyLink} target="_blank" rel="noreferrer">
                                        {" "}
                                        politique de confidentialité
                                      </a>
                                      &nbsp;
                                    </>
                                  )}
                                  du Challenge "{currentChallenge.name}"
                                </label>
                              </CheckboxHTMLContainer>
                              <FormikErrorLabel value="optinCgu" />
                            </div>
                          )}
                        </CheckboxContainer>
                        <Button type="submit" disabled={isSubmitting}>
                          Rejoindre mon {currentChallenge.wording.tribe || "club"}
                        </Button>
                      </Form>
                    )
                  }}
                </Formik>
              </Wrapper>
            </>
          )
        )}
      </IonContent>
    </IonPage>
  )
}

const Wrapper = styled(Container)`
  padding-top: 25px;
`
const CheckboxContainer = styled.div`
  margin: 15px 0;
  font-size: 15px;
  line-height: 22px;
  /* input {
    display:inline;
    margin-right:6px;
    width: 21px;
    height: 17px;
  } */
  label {
    display: inline;
    margin-right: 10px;
  }
`

const CheckboxHTMLContainer = styled.div`
  a {
    text-decoration: underline;
  }
`
