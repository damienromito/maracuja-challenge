import { Challenge } from "@maracuja/shared/models"
import { Field, Form, Formik } from "formik"
import styled from "styled-components"
import "swiper/css/swiper.css"
import { useApp, useCurrentChallenge } from "../contexts"
import { Button, FormikErrorLabel, HelpLink, Title3 } from "./"

interface CodeChallengeFormProps {
  titleForm?: string
}
export default ({ titleForm }: CodeChallengeFormProps) => {
  const { setLoading } = useApp()
  const { setCurrentChallengeById } = useCurrentChallenge()

  const handleSelectChallenge = (challenge) => {
    setCurrentChallengeById(challenge.id)
  }

  const handleSubmitChallengeCode = async (values, { setSubmitting }) => {
    const challengeCode = values.challengeCode.toUpperCase().trim()

    const notExist = () => {
      setSubmitting(false)
      setLoading(false)
      alert("Ce code n'existe pas")
    }

    if (challengeCode.length < 2) {
      notExist()
      return
    }

    try {
      const challenge = await Challenge.fetchByCode({ challengeCode })
      if (!challenge) {
        notExist()
      } else {
        handleSelectChallenge(challenge)
      }
    } catch (error) {
      alert(
        "Une erreur est survenue, merci de verifier votre connexion internet ou contactez nous." + error.message ||
          error
      )
      setSubmitting(false)
      setLoading(false)
    }
  }

  return (
    <CodeContainer>
      <Formik initialValues={{ challengeCode: "" }} onSubmit={handleSubmitChallengeCode}>
        {({ errors, touched, dirty }) => {
          return (
            <Form>
              <Title3>{titleForm || "Rejoins un challenge privé"}</Title3>
              <Field
                style={{ textTransform: "uppercase" }}
                id="challenge-input"
                type="text"
                name="challengeCode"
                placeholder="Entre le code du challenge ici "
                data-test="input-code"
              />
              <FormikErrorLabel value="challengeCode" />
              <Button type="submit" data-test="button-submit-code" disabled={!dirty}>
                Aller au challenge
              </Button>
            </Form>
          )
        }}
      </Formik>
      <br />
      <br />
      <HelpLink label="landing" />
    </CodeContainer>
  )
}

const CodeContainer = styled.div`
  margin-top: 25px;
  text-align: center;
  padding: 20px 15px 15px 15px;
  padding-top: 5px;
  border-top: 1px solid ${(props) => props.theme.primary};

  #challenge-input {
    margin: 15px 0 10px;
  }
`
