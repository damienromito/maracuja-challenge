import { IonContent, IonPage } from "@ionic/react"
import ROLES from "@maracuja/shared/constants/roles"
import { objectSubset } from "@maracuja/shared/helpers"
import { IdeasBox } from "@maracuja/shared/models"
import { Field, Form, Formik } from "formik"
import { useLayoutEffect, useState } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"
import * as Yup from "yup"
import {
  Button,
  Container,
  FormikErrorLabel,
  HelpLink,
  Modal,
  NavBar,
  RegularLink,
  Text2,
  Title1,
} from "../../components"
import ROUTES from "../../constants/routes"
import { useApp, useCurrentChallenge } from "../../contexts"
import { size, styled } from "../../styles"

export default () => {
  const { currentPlayer, currentChallenge, currentTeam, currentActivities } = useCurrentChallenge()
  const { ideasBoxId } = useParams<any>()
  const { setLoading, openError } = useApp()
  const [helpPopupOpen, setHelpPopupOpen] = useState(false)
  const [sentIdea, setSentIdea] = useState(false)
  const [ideasBox, setIdeasBox] = useState(null)
  const history = useHistory()
  const location = useLocation<any>()

  useLayoutEffect(() => {
    if (!ideasBox) {
      const ib = currentChallenge.ideasBoxes.find((a) => a.id === ideasBoxId)
      setIdeasBox(ib)
    }
  }, [])

  const handleSubmitForm = async (values, { setSubmitting }) => {
    setLoading(true)
    const data = {
      challenge: objectSubset(currentChallenge, ["id", "name", "emailTemplateId"]),
      idea: values.idea,
      ideasBox: objectSubset(ideasBox, ["id", "phaseId", "name"]),
      team: objectSubset(currentTeam, ["id", "name"]),
      player: objectSubset(currentPlayer, ["id", "username", "firstName", "lastName"]),
      captainIds: currentTeam.captainIds(currentPlayer.hasRole(ROLES.CAPTAIN) ? currentPlayer.id : null),
    }
    try {
      await IdeasBox.participate(data)
      setSentIdea(values.idea)
    } catch (err) {
      console.log("UNCACHED ERROR", err)
      setSubmitting(false)
      openError(err)
    }
    setLoading(false)
    setSubmitting(false)
  }

  const onClose = () => {
    history.push(ROUTES.HOME)
  }

  return (
    ideasBox && (
      <IonPage>
        <NavBar rightIcon="close" rightAction={() => history.goBack()} title={ideasBox.name} />
        <IonContent>
          {!sentIdea ? (
            <PageContainer className="max-width-container">
              <Text2>
                <b>{location?.state?.activity?.info}</b>
              </Text2>
              <InstructionBlock>
                <Text2 dangerouslySetInnerHTML={{ __html: ideasBox.description }} />
                {/* <button onClick={() => setHelpPopupOpen(true)}>
                  Aide <i className="icon icon-help" />
                </button> */}
              </InstructionBlock>
              <Formik
                initialValues={{ userListValue: "" }}
                validationSchema={Yup.object().shape({
                  idea: Yup.string()
                    .required(
                      "Laisse au moins un petit quelque chose. Les idées les plus simples sont les meilleures !"
                    )
                    .min(15, "Un peu plus long quand même ! 🤗"),
                })}
                validateOnBlur={false}
                onSubmit={handleSubmitForm}
              >
                {(props) => {
                  const { errors, touched, isSubmitting, dirty } = props
                  return (
                    <Form>
                      <Field
                        autoFocus
                        type="email"
                        component="textarea"
                        name="idea"
                        placeholder={ideasBox.placeholder || "Décris ton idée"}
                      />
                      <FormikErrorLabel value="idea" />

                      <Button type="submit" disabled={!dirty || isSubmitting} className="ion-margin-vertical">
                        Envoyer
                      </Button>
                    </Form>
                  )
                }}
              </Formik>

              <Modal
                isOpen={helpPopupOpen}
                title="Propose une problématique !"
                validTextButton="Ok"
                onClose={() => setHelpPopupOpen(false)}
              >
                <Text2>
                  C’est en identifiant des problématiques que l’on va faire émerger de nouvelles idées à déposer sur la
                  plateforme EDF Pulse Studio.
                </Text2>

                {/* <ImageContainer style={{ maxWidth: 70 }} src={activityImage} /> */}
                <Text2>
                  <i>
                    “Si j’avais une heure pour résoudre un problème, je passerais 55 minutes à réfléchir au problème et
                    5 minutes à réfléchir à des solutions.”
                  </i>
                  <br />
                  <b>Albert Einstein</b>
                </Text2>

                <HelpLink lightBg label="ideas" />
              </Modal>
            </PageContainer>
          ) : (
            <PageContainer>
              <Text2>
                <b>{location?.state?.activity?.info}</b>
              </Text2>
              <Title1 style={{ marginTop: "30px" }}>Idée envoyée ✅</Title1>
              <Text2 style={{ textAlign: "center", margin: "20px 0" }}>
                <i>"{sentIdea}"</i>
              </Text2>
              <Text2 style={{ textAlign: "center", margin: "20px 0" }}>Tu recevras une confirmation par email.</Text2>
              <Button onClick={onClose}>Ok</Button>

              <RegularLink onClick={() => setSentIdea(null)}>Envoyer une autre idée</RegularLink>
            </PageContainer>
          )}
        </IonContent>
      </IonPage>
    )
  )
}

const PageContainer = styled(Container)`
  background: ${(props) => props.theme.primary};
  padding: 15px;
`

const InstructionBlock = styled.div<{ green?: boolean }>`
  display: flex;
  text-align: left;
  margin: 10px 0;
  p {
    flex: 1;
  }
  button {
    align-self: center;
    background: ${(props) => (props.green ? props.theme.icon.referee : props.theme.bg.info)};
    color: black;
    border-radius: ${size.borderRadius};
    padding: 3px 7px;
    margin-top: 3px;
    background: #89bcf7;
    width: fit-content;
    height: fit-content;
  }
`
