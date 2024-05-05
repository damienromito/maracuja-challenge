import { CheckboxField } from "@maracuja/shared/components"
import { ACTIVITY_TYPES, NOTIFICATION_AUDIENCES, NOTIFICATION_TEMPLATE_TYPES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { splitValueByComma } from "@maracuja/shared/helpers"
import { Notification } from "@maracuja/shared/models"
import { Button } from "antd"
import firebase from "firebase/app"
import "firebase/firestore"
import { Form, Formik, useFormikContext } from "formik"
import M from "materialize-css"
import React, { useEffect, useMemo, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { generatePath } from "react-router-dom/cjs/react-router-dom.min"
// import { updateExpression } from '@babel/types';
import FieldContainer from "../../../components/FormikFieldContainer"
import { ROUTES } from "../../../constants"
import { useDashboard } from "../../../contexts"
import { objectFromSnap, objectSubsetWithPlaceholder } from "../../../helpers"
import DisplayDatePicker from "../../Challenges/Activities/DisplayDatePicker"
import NotificationTemplatePicker from "./../NotificationTemplatePicker"
import QuestionSetField from "./QuestionSetField"
import TemplateTypeEmail from "./TemplateTypeEmail"
import TemplateTypeNotification from "./TemplateTypeNotification"

export default () => {
  const { currentChallenge, currentQuestionSets, currentPhase } = useCurrentChallenge()
  const { setLoading } = useDashboard()
  const { authUser } = useAuthUser()
  const { notificationId, challengeId } = useParams<any>()
  const [notification, setNotification] = useState<any>()
  const history = useHistory()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    if (notificationId === "new") {
      setNotification({})
    } else {
      const notif = await Notification.fetch({ challengeId, id: notificationId })
      setNotification(notif)
    }
  }

  const handleTest = async () => {
    await Notification.setForAnimation({ ...notification, testUserId: authUser.id })
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    let params = {
      ...values,
      challengeId: currentChallenge.id,
    }
    if (params.phaseId === "none") {
      delete params.phaseId
    }
    // if (values.audience === NOTIFICATION_AUDIENCES.TEAMS) {
    if (params.teamIds.length) {
      params = splitValueByComma(params, "teamIds")
    }
    // params.teamIds = params.teamIds.split(',')
    // } else if (values.audience === NOTIFICATION_AUDIENCES.PLAYERS) {
    // params.playerIds = params.playerIds.split(',')
    if (params.playerIds.length) {
      params = splitValueByComma(params, "playerIds")
    }
    // }

    let confirmMessage =
      "Envoyer la notification ? \n" + `Audience : ${params.audience} \n` + `Challenge : ${params.challengeId} \n`
    if (
      params.audience === NOTIFICATION_AUDIENCES.ASLEEP ||
      params.audience === NOTIFICATION_AUDIENCES.ALREADY_PLAYED
    ) {
      if (!params.questionSetId || !params.questionSetPhaseId) {
        alert("selectionnez le quiz concerné !")
        return
      }

      let questionSetId = params.questionSetId
      let quizType
      if (questionSetId.startsWith(DEBRIEFING_PREFIX)) {
        questionSetId = questionSetId.slice(DEBRIEFING_PREFIX.length)
        quizType = ACTIVITY_TYPES.DEBRIEFING
      } else {
        quizType = currentChallenge.questionSets[questionSetId].type
      }

      confirmMessage += `Quiz : ${questionSetId} \n`
      params.questionSetType = quizType
      params.questionSetId = questionSetId
      values.questionSetType = quizType
    }

    confirmMessage += `Titre : ${params.template.title} \n` + `Message : ${params.template.message} \n`

    if (!params.sendLater && window.confirm(confirmMessage)) {
      await saveNotification(params)
    } else if (params.sendLater) {
      await saveNotification(params)
    }
    setLoading(false)
    setSubmitting(false)
  }

  const saveNotification = async (params) => {
    setLoading(true)

    const stats = await Notification.setForAnimation(params)

    setLoading(false)
    if (params.sendLater) {
      M.toast({ html: "Notification créée" })
    } else if (stats) {
      const statMessage =
        "Notification envoyée !  \n" +
        `${stats.sandboxMode ? "****** MODE TEST (rien n'a été envoyé) *****\n" : ""}` +
        "Statistique d'envoie :\n" +
        `Total : ${stats.totalDelivery}\n` +
        `(Push : ${stats.pushDelivery}  - Email : ${stats.emailDelivery}) \n` +
        `Non delivré : ${stats.notAcceptNotifCount} \n` +
        `indefini : ${stats.undefinedCount} \n`
      alert(statMessage)
    }
    history.push(generatePath(ROUTES.CHALLENGE_NOTIFICATIONS, { challengeId: currentChallenge.id }))
  }

  function validateTeamIds(value, values) {
    let error
    if (!value && values.audience === "none") {
      error = "Les IDs des teams doivent être renseignés"
    }
    return error
  }

  const handleDelete = async () => {
    await notification.delete()
    M.toast({ html: "Notification supprimée" })
    history.goBack()
    // history.push(generatePath(ROUTES.CHALLENGE_NOTIFICATIONS, { challengeId: currentChallenge.id }))
  }
  const handleInitialValues = useMemo(() => {
    if (!notification) return
    const defaultDate = new Date()
    defaultDate.setHours(defaultDate.getHours() + 1)

    if (notification.questionSetType === ACTIVITY_TYPES.DEBRIEFING) {
      notification.questionSetId = DEBRIEFING_PREFIX + notification.questionSetId
    }

    const values: any = objectSubsetWithPlaceholder(notification, {
      id: "",
      sendLater: false,
      scheduledDate: defaultDate,
      audience: NOTIFICATION_AUDIENCES.ALL,
      questionSetId: "",
      questionSetType: "",
      questionSetPhaseId: currentPhase?.id || "",
      analyticsLabel: "",
      phaseId: "",
      additionalPlayersIds: false,
      redirectionPersonalized: false,
      template: {
        title: "",
        message: "",
        redirect: "/",
        type: NOTIFICATION_TEMPLATE_TYPES.NOTIFICATION,
      },
    })

    values.playerIds = notification.playerIds?.join(",") || []
    values.teamIds = notification.teamIds?.join(",") || []

    // switch (values.audience) {
    //   case 'teams':
    //     values.teamIds = ''
    //     break
    //   case 'asleep':
    //     values.questionSetPhaseId = ''
    //     values.questionSetId = ''
    //     break

    //   default:
    //     break
    // }

    return values
  }, [notification])

  return !notification ? null : (
    <Formik
      initialValues={handleInitialValues}
      // enableReinitialize
      // validationSchema={formValidationSchema}
      onSubmit={handleSubmit}
    >
      {(props) => {
        const { values, setFieldValue, isSubmitting } = props
        return (
          <Form style={{ padding: 20 }}>
            <AudienceField />
            <QuestionSetPhaseIdField />
            {values.audience !== NOTIFICATION_AUDIENCES.WHITELIST &&
              values.audience !== NOTIFICATION_AUDIENCES.TEAMS &&
              currentChallenge.phases.length > 1 && (
                <FieldContainer
                  component="select"
                  className="browser-default"
                  name="phaseId"
                  label="Envoyez aux joueurs pouvant jouer dans une phase spécifique"
                >
                  <option value="none">Sélectionnez une phase (optionel)</option>
                  {currentChallenge.phases.map((phase) => {
                    return (
                      <option key={phase.id} value={phase.id}>
                        {phase.name}
                      </option>
                    )
                  })}
                </FieldContainer>
              )}

            {values.audience === "teams" && (
              <FieldContainer
                name="teamIds"
                type="text"
                validate={(v) => validateTeamIds(v, values)}
                label="❗️ ID des teams"
              />
            )}

            <CheckboxField name="additionalPlayersIds" label="Envoyer à une liste de joueur supplémentaires" />
            <PlayerIdsField />

            <h4>Contenu de la notification</h4>
            {values.audience === NOTIFICATION_AUDIENCES.WHITELIST}
            <TemplateTypeSelect />
            {values.template.type === NOTIFICATION_TEMPLATE_TYPES.NOTIFICATION && <TemplateTypeNotification />}
            {values.template.type === NOTIFICATION_TEMPLATE_TYPES.EMAIL && <TemplateTypeEmail />}
            {/* <FieldContainer component='select' className='browser-default' name='audience' label='Audience'>
          <option value='players'>Emails si notifs desactivées</option>
          <option value='all'>Push Notif seulement (pas email)</option>
          <option value='captains'>Email seulement</option>

        </FieldContainer> */}

            <p>
              <CheckboxField name="sendLater" label="Envoyer plus tard" />{" "}
            </p>
            {values.sendLater && (
              <>
                <DisplayDatePicker name="scheduledDate" label="Programmer l'envoie" />
                <button type="submit" disabled={isSubmitting} className="btn grey darken-4">
                  Enregistrer
                </button>{" "}
                <br />
              </>
            )}
            {!values.sendLater && (
              <button type="submit" disabled={isSubmitting} className="btn grey darken-4">
                Envoyer
              </button>
            )}
            <br />
            <button className="btn red darken-4" type="button" onClick={handleDelete}>
              Supprimer
            </button>
            <Button onClick={handleTest}>Tester</Button>
          </Form>
        )
      }}
    </Formik>
  )
}

const PlayerIdsField = () => {
  const { currentChallenge, currentQuestionSets, currentPhase } = useCurrentChallenge()

  const { values, setFieldValue } = useFormikContext<any>()
  const [adminPlayers, setAdminPlayers] = useState<any>([])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    await loadAdminPlayers()
  }

  const loadAdminPlayers = () => {
    return firebase
      .firestore()
      .collection("users")
      .where("roles", "array-contains", "SUPER_ADMIN")
      .get()
      .then((snap) => {
        const array = []
        snap.docs.forEach((doc) => {
          const player = objectFromSnap(doc)
          array.push(player)
        })
        setAdminPlayers(array)
      })
  }

  const addAdminToPlayerList = (setFieldValue, playerId = null, values = null) => {
    let adminIdList
    if (!playerId) {
      adminIdList = adminPlayers.map((player) => player.id).join(",")
    } else {
      adminIdList = values.playerIds.length === 0 ? playerId : values.playerIds + "," + playerId
    }
    setFieldValue("playerIds", adminIdList)
  }

  return (
    (values.additionalPlayersIds || values.audience === NOTIFICATION_AUDIENCES.PLAYERS) && (
      <>
        <FieldContainer
          name="playerIds"
          label="Joueurs"
          placeholder="Ids des joueurs séparé par une virgule"
          component="textarea"
          rows={5}
          cols={30}
          style={{ width: "100%", height: "100px" }}
        />
        {adminPlayers && (
          <p>
            <a style={{ textDecoration: "underline" }} onClick={() => addAdminToPlayerList(setFieldValue)}>
              Ajouter tous les admins
            </a>
            (
            {adminPlayers.map((player) => {
              if (values.playerIds?.includes(player.id)) {
                return (
                  <span key={player.id}>
                    {player.username || player.firstName} ({player.fcmToken ? "📱" : "@"}),{" "}
                  </span>
                )
              } else {
                return (
                  <a key={player.id} onClick={() => addAdminToPlayerList(setFieldValue, player.id, values)}>
                    {player.username || player.firstName} ({player.fcmToken ? "📱" : "@"}),{" "}
                  </a>
                )
              }
            })}
            )
          </p>
        )}
      </>
    )
  )
}
const QuestionSetPhaseIdField = () => {
  const { currentChallenge, currentQuestionSets, currentPhase } = useCurrentChallenge()

  const { values, setFieldValue } = useFormikContext<any>()

  return (
    (values.audience === NOTIFICATION_AUDIENCES.ASLEEP ||
      values.audience === NOTIFICATION_AUDIENCES.ALREADY_PLAYED) && (
      <>
        {currentChallenge.phases.length > 1 && (
          <FieldContainer
            component="select"
            className="browser-default"
            name="questionSetPhaseId"
            label="Selectionnez la phase contenu le quiz souhaité"
          >
            <option value="none">❗️Sélectionnez une phase </option>
            {currentChallenge.phases.map((phase) => {
              return (
                <option key={phase.id} value={phase.id}>
                  {phase.name}
                </option>
              )
            })}
          </FieldContainer>
        )}
        {values.questionSetPhaseId && <QuestionSetField questionSetPhaseId={values.questionSetPhaseId} />}
      </>
    )
  )
}

const AudienceField = () => {
  return (
    <>
      <h4>Selection de l'audience</h4>
      <FieldContainer component="select" className="browser-default" name="audience" label="Audience">
        {/* <option value="none">Tokens de test</option> */}
        <option value={NOTIFICATION_AUDIENCES.PLAYERS}>Liste de joueurs uniquement (par id)</option>
        <option value={NOTIFICATION_AUDIENCES.ALL}>Tout le monde</option>
        <option value={NOTIFICATION_AUDIENCES.WHITELIST}>Liste blanche (Participants non inscrits)</option>
        <option value={NOTIFICATION_AUDIENCES.CAPTAINS}>Captains</option>
        <option value={NOTIFICATION_AUDIENCES.REFEREES}>Recrues</option>
        <option value={NOTIFICATION_AUDIENCES.REFERERS}>Parrains</option>
        <option value={NOTIFICATION_AUDIENCES.TEAMS}>Equipes (par id)</option>
        <option value={NOTIFICATION_AUDIENCES.ASLEEP}>Joueurs endormis (par quiz)</option>
        <option value={NOTIFICATION_AUDIENCES.ALREADY_PLAYED}>Joueurs ayant déjà joués (par quiz)</option>
      </FieldContainer>
    </>
  )
}

const TemplateTypeSelect = () => {
  return (
    <>
      <h4>Selection de le type de template</h4>
      <FieldContainer component="select" className="browser-default" name="template.type" label="Type de template">
        <option value={NOTIFICATION_TEMPLATE_TYPES.NOTIFICATION}>Notification</option>
        <option value={NOTIFICATION_TEMPLATE_TYPES.EMAIL}>Email</option>
        {/* <option value={NOTIFICATION_TEMPLATE_TYPES.SMS}>SMS</option> */}
      </FieldContainer>
    </>
  )
}

const DEBRIEFING_PREFIX = "debriefing_"
