import { CheckboxField } from "@maracuja/shared/components"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Form, Formik, useFormikContext } from "formik"
import React, { useEffect, useMemo } from "react"
import { useParams } from "react-router"
import * as Yup from "yup"
import FieldContainer from "../../FormikFieldContainer"
import ThemeField from "../../ThemeField"

export default ({
  children,
  initialValues,
  yupRules = {},
  onSubmit,
  currentQuestion,
  hideQuestionTitle = false,
  negativeVersion = null,
}) => {
  const { currentChallenge } = useCurrentChallenge()
  const { themeId } = useParams<any>()

  const initValues = useMemo(() => {
    const values = {
      ...initialValues,
      id: currentQuestion.id || "",
      copyright: currentQuestion.copyright || "", // '©',
      comment: currentQuestion.comment || "",
      commentClient: currentQuestion.commentClient || "",
      validated: currentQuestion.validated || false,
      validatedClient: currentQuestion.validatedClient || false,
      level: currentQuestion.level || 0,
      themeId: themeId || currentQuestion.themeId || null,
      hasChallengeVariation: currentQuestion.hasChallengeVariation || false,
    }
    if (!hideQuestionTitle) {
      values.text = currentQuestion.text || ""
      if (currentChallenge?.quiz.questionsHaveNegativeVersion) {
        values.textNegative = currentQuestion.textNegative || ""
      }
    }
    return values
  }, [currentQuestion])

  // const formSchema = Yup.object().shape({
  //   ...yupRules,
  //   text: Yup.string().required('Champs obligatoire')
  //   // password: Yup.string().required('Et le mot de passe ?').min(6, 'Trop court ! 6 caractères minimum.'),
  //   // email: Yup.string().required('L\'email n\'est pas correct').matches(/^[A-Z0-9._%+-]+@(?!yopmail.com)[A-Z0-9.-]+\.[A-Z]{2,8}$/i, 'L\'email n\'est pas correct')
  // })

  const formSchema = useMemo(() => {
    const schema: any = {
      ...yupRules,
      text: Yup.string().required("Champs obligatoire"),
      // level: Yup.number().min(0, 'Champs obligatoire')

      // password: Yup.string().required('Et le mot de passe ?').min(6, 'Trop court ! 6 caractères minimum.'),
      // email: Yup.string().required('L\'email n\'est pas correct').matches(/^[A-Z0-9._%+-]+@(?!yopmail.com)[A-Z0-9.-]+\.[A-Z]{2,8}$/i, 'L\'email n\'est pas correct')
    }
    if (currentChallenge?.referralEnabled) {
      schema.level = Yup.mixed().oneOf(["1", "2", "3", "4", "5"], "Un niveau doit être renseigné")
    }

    return Yup.object().shape(schema)
  }, [currentQuestion])

  return (
    <Formik enableReinitialize onSubmit={onSubmit} initialValues={initValues} validationSchema={formSchema}>
      {(props) => {
        const { errors, touched, values } = props

        return (
          <Form>
            {Object.keys(errors).length ? (
              <p style={{ color: "red", marginTop: -14, position: "absolute", fontSize: 12 }}>
                ⚠️ Des champs sont incorrects
              </p>
            ) : null}
            {!hideQuestionTitle && (
              <FieldContainer errors={errors} touched={touched} name="text" type="text" label="Titre de la question" />
            )}
            {negativeVersion && currentChallenge?.quiz.questionsHaveNegativeVersion && (
              <FieldContainer
                errors={errors}
                touched={touched}
                name="textNegative"
                type="text"
                label="Question sous la forme négative (les réponses seront inversées)"
              />
            )}
            {children(props)}
            <FieldContainer
              errors={errors}
              touched={touched}
              name="copyright"
              type="url"
              label="Copyright de la question (©)"
            />
            {!themeId && <ThemeField />}
            <FieldContainer className="browser-default" component="select" name="level" label="Difficulté">
              <option value={0}>Non défini</option>
              <option value={1}>Niveau 1 {currentChallenge?.referralEnabled && "(et pour les filleuls)"}</option>
              <option value={2}>Niveau 2</option>
              <option value={3}>Niveau 3</option>
            </FieldContainer>
            {/* <FieldContainer errors={errors} touched={touched} name='id' type='text' label='Id de la question' /> */}
            <p style={{ width: "100%", textAlign: "center" }}>------ Vérification du contenu ------</p>
            <CheckboxField
              name="validated"
              label="Relu et validé "
              onChange={(e) => {
                props.setFieldValue("comment", "")
                props.handleChange(e)
              }}
            />
            {!values.validated && <FieldContainer name="comment" label="Commentaire" component="textarea" />}
            {values.validated && (
              <>
                <p style={{ width: "100%", textAlign: "center" }}>------ Validation client ------</p>

                <CheckboxField
                  name="validatedClient"
                  label="Relu et validé"
                  onChange={(e) => {
                    props.setFieldValue("commentClient", "")
                    props.handleChange(e)
                  }}
                />
                {!values.validatedClient && (
                  <FieldContainer name="commentClient" label="Commentaire" component="textarea" />
                )}
              </>
            )}
            <CheckboxField
              name="hasChallengeVariation"
              label="Challenge Variation (Le contenu doit être adapté à chaque challenge)"
            />
            <br /> <br />
            <MyAutoSavingComponent />
          </Form>
        )
      }}
    </Formik>
  )
}

const MyAutoSavingComponent = () => {
  const formik = useFormikContext<any>()

  useEffect(() => {
    // use your own equality test or react-fast-compare because they are probably different objects
    if (formik.values !== formik.initialValues) {
      formik.submitForm() // or onSubmit if you want to do validations before submitting
    }
  }, [formik.values])
  // not listening for initialValues, because even if they are updated you probably don't want to autosave.
  return null
}
