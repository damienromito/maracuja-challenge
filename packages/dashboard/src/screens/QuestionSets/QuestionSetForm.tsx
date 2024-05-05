import { ACTIVITY_TYPES, GENERATED_NOTIFICATION_TYPES, USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { objectSubset } from "@maracuja/shared/helpers"
import { QuestionSet } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import M from "materialize-css"
import React, { useEffect, useMemo, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { generatePath, Link, useHistory, useLocation, useParams } from "react-router-dom"
import { CheckboxField, FormGroup, SimpleFieldArray } from "../../components"
import FieldContainer from "../../components/FormikFieldContainer"
import { ROUTES } from "../../constants"
import { generateId } from "../../helpers"

export default ({ phase, onToggleConfigMode = null, nextStartDate, nextEndDate, onSubmited }) => {
  const [item, setItem] = useState<any>({})
  const { currentChallenge } = useCurrentChallenge()
  const { questionSetId, challengeId } = useParams<any>()
  const location = useLocation<any>()
  const history = useHistory()
  const { authUser } = useAuthUser()

  useEffect(() => {
    if (questionSetId) {
      const unsubscribe = loadQuestionSet()
      return () => {
        unsubscribe()
      }
    }
  }, [questionSetId])

  const loadQuestionSet = () => {
    return QuestionSet.fetch(
      { challengeId, id: questionSetId },
      {
        listener: (questionSet) => {
          setItem(questionSet)
        },
      }
    )
  }

  const handleSubmit = async (values) => {
    if (values.authorizedTeams?.length > 0) {
      values.audienceRestricted = true
    }
    values.challengeId = currentChallenge.id
    if (values.type === ACTIVITY_TYPES.TRAINING) values.duration = 0
    if (item.id) {
      await QuestionSet.update({ challengeId, id: item.id }, values)
      M.toast({ html: "Quiz sauvegardé !" })
      history.goBack()
    } else {
      const id = generateId(`${values.type}${values.name}`)
      await QuestionSet.create({ challengeId, id }, values)
      M.toast({ html: "Quiz crée !" })
      onSubmited && onSubmited()
    }

    // M.toast({ html: `Quiz ${oldId ? 'edited' : 'created'} !` })
  }

  const initValues = useMemo(() => {
    const defaultGeneratedNotifications = {
      start: { delay: currentChallenge.notifications?.generated.start.delay || 0 },
      captain: { delay: currentChallenge.notifications?.generated.captain?.delay || 0 },
      wakeUp: { delay: currentChallenge.notifications?.generated.wakeUp.delay || 0 },
      debriefing: {
        delay: currentChallenge.notifications?.generated.debriefing.delay || 0,
      },
    }

    const values = {
      name: item.name || "",
      description: item.description || "", // Entraine-toi pour te préparer aux épreuves à venir ! 😉
      type: item.type || ACTIVITY_TYPES.TRAINING,
      startDate: item.startDate || nextStartDate,
      endDate: item.endDate || nextEndDate,
      phaseId: item.phaseId || phase?.id || location.state?.phase?.id,
      disabled: item.disabled || false,
      debriefingDisabled: item.debriefingDisabled || false,
      generatedNotifications: item.generatedNotifications || defaultGeneratedNotifications,
      recommendations: item.recommendations || {
        cards: { min: 0, max: 0 },
        questions: { min: 0, max: 0 },
      },
      // COMPETITION
      duration: item.duration || 0,
      phase: item.phase || objectSubset(phase || location.state?.phase || {}, ["id", "type", "name"]) || "",
      questionCountMax: item.questionCountMax || 0,
      authorizedTeams: item.authorizedTeams || [],
      disableQuestionsRandomization: item.disableQuestionsRandomization || false,
      isOnboarding: item.isOnboarding || false,
      isFinal: item.isFinal || false,
    }

    return values
  }, [item])

  const handlePhaseChange = (e, setFieldValue) => {
    const newPhaseId = e.target.value
    const newPhase = currentChallenge.phases.find((p) => p.id === newPhaseId)
    // const choiceCountValue = e.target.value
    setFieldValue("phase", objectSubset(newPhase, ["id", "name", "type"]))
    setFieldValue("phaseId", newPhaseId)
  }

  const handleStartDateChange = (value, setFieldValue, endDate) => {
    setFieldValue("startDate", value)
    if (value > endDate) {
      const newDate = new Date(value)
      newDate.setHours(endDate.getHours())
      setFieldValue("endDate", newDate)
    }
  }

  return (
    <>
      {questionSetId && (
        <>
          <h4>{item.name}</h4>
          <p>ID : {item.id || "NC"}</p>
          <Link
            to={generatePath(ROUTES.CHALLENGE_QUESTIONSET_EDITOR, {
              challengeId: currentChallenge.id,
              questionSetId,
            })}
            className="btn green"
          >
            <i className="tiny material-icons left ">edit</i>
            {item.questionCount || item.questions?.length} questions
          </Link>
        </>
      )}
      {item.audienceRestricted && <p>{item.authorizedTeams.join("'")}</p>}

      <Formik enableReinitialize initialValues={initValues} onSubmit={handleSubmit}>
        {(props) => {
          const { values, setFieldValue } = props
          return (
            <Form style={{ padding: 20 }}>
              <FieldContainer name="name" type="text" label="Nom du Quiz" />
              <FieldContainer
                component="select"
                className="browser-default"
                name="type"
                label="Type de quiz"
                value={values.type}
              >
                <option key="training" value="training">
                  Entrainement
                </option>
                <option key="contest" value="contest">
                  Epreuve
                </option>
              </FieldContainer>
              {values.type === ACTIVITY_TYPES.TRAINING && (
                <CheckboxField name="isOnboarding" label="Quiz de bienvenue" />
              )}
              {values.type === ACTIVITY_TYPES.CONTEST && <CheckboxField name="isFinal" label="Quiz final" />}
              {currentChallenge.phases.length > 1 && (
                <FieldContainer
                  component="select"
                  className="browser-default"
                  value={values.phaseId}
                  label="Changer le quiz de phase"
                  onChange={(e) => handlePhaseChange(e, setFieldValue)}
                >
                  {currentChallenge.phases.map((phase) => {
                    ;<option key="none" value={null}>
                      Selectionnez une phase
                    </option>
                    return (
                      <option key={phase.id} value={phase.id}>
                        {phase.name}
                      </option>
                    )
                  })}
                </FieldContainer>
              )}
              <div>
                <p>Date de début et de fin du quiz : </p>
                <DatePicker
                  name="startDate"
                  value={values.startDate}
                  showTimeSelect
                  selected={values.startDate}
                  locale="fr"
                  dateFormat="d MMMM yyyy H:mm"
                  onChange={(val) => handleStartDateChange(val, setFieldValue, values.endDate)}
                />
                <DatePicker
                  name="endDate"
                  value={values.endDate}
                  showTimeSelect
                  selected={values.endDate}
                  locale="fr"
                  dateFormat="d MMMM yyyy H:mm"
                  onChange={(val) => setFieldValue("endDate", val)}
                />
              </div>
              {/* <FieldContainer name='themeCode' type='text' label='Code du theme (Qui sera appliqué aux id des questions créées)' placeholder='exemple : "CE" pour connaissances équestres' /> */}
              <FieldContainer name="description" type="text" label="Description" value={values.description} />
              {(values.type === ACTIVITY_TYPES.CONTEST || values.duration > 0) && (
                <FieldContainer type="number" name="duration" label="Durée du quiz (en secondes)" />
              )}
              {values.type === ACTIVITY_TYPES.CONTEST && (
                <>
                  {/* <CheckboxField name='displayBadge' label='Ce quiz est le quiz final' /> */}
                  <FieldContainer type="number" name="questionCountMax" label="Nombre de questions Max" />
                  <p>
                    <CheckboxField
                      name="disableQuestionsRandomization"
                      label="Respecter l'odre d'affichage des questions"
                    />
                  </p>
                  <p>
                    <CheckboxField name="debriefingDisabled" label="Désactiver le debriefing" />{" "}
                  </p>
                </>
              )}
              <FormGroup>
                <p>Notifications générée : </p>
                <FieldContainer
                  name={`generatedNotifications.${GENERATED_NOTIFICATION_TYPES.START}.delay`}
                  type="number"
                  label="Délais des notifications envoyées au lancement d'un quiz (ex : '2' pour 2h apres le debut)"
                />
                <FieldContainer
                  name={`generatedNotifications.${GENERATED_NOTIFICATION_TYPES.WAKE_UP}.delay`}
                  type="number"
                  label="Délais des notifications envoyées aux joueurs endormis (ex : '-2' pour -2h avant la fin du quiz)"
                />
                <FieldContainer
                  name={`generatedNotifications.${GENERATED_NOTIFICATION_TYPES.CAPTAIN}.delay`}
                  type="number"
                  label="Délais des notifications envoyées aux capitaines"
                />

                {values.type === ACTIVITY_TYPES.CONTEST && (
                  <FieldContainer
                    name={`generatedNotifications.${GENERATED_NOTIFICATION_TYPES.DEBRIEFING}.delay`}
                    type="number"
                    label="Délai des notifications envoyées lorsque le debriefing est disponible (ex : '2' pour 2h apres la fin d'une épreuve)"
                  />
                )}
              </FormGroup>
              {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
                <>
                  <FormGroup>
                    <p>Recommandation pour l'auteur : </p>
                    {values.type === ACTIVITY_TYPES.TRAINING && (
                      <>
                        <FieldContainer
                          type="number"
                          name="recommendations.cards.min"
                          label="Nombre de cartes minimum"
                        />
                        {values.recommendations.cards.min > 0 && (
                          <FieldContainer
                            type="number"
                            name="recommendations.cards.max"
                            label="Nombre de cartes max (laisser 0 pour ne pas en definir)"
                          />
                        )}
                      </>
                    )}
                    <FieldContainer
                      type="number"
                      name="recommendations.questions.min"
                      label="Nombre de questions minimum"
                    />
                    {values.recommendations.questions.min > 0 && (
                      <FieldContainer
                        type="number"
                        name="recommendations.questions.max"
                        label="Nombre de questions maximum (laisser 0 pour ne pas en definir)"
                      />
                    )}
                  </FormGroup>

                  {/* <p><CheckboxField name="hideSolutions" label="Masquer les bonnes réponses" /> </p> */}
                  {/* <p><CheckboxField name="randomQuestions" label="Ordre des questions aléatoire" /> </p> */}

                  {/* <p><CheckboxField name="multipleGames" label="Plusieurs parties autorisées" /> </p> */}
                  <SimpleFieldArray
                    name="authorizedTeams"
                    label="Audience limitée : Ajouter l'Id des équipes à autoriser (laisser vide pour ne pas limiter l'accès)"
                  />
                  <p>
                    <CheckboxField name="disabled" label="Désactiver le quiz" />
                  </p>
                </>
              )}
              <button type="submit" className="btn blue-grey">
                Enregistrer
              </button>
              {onToggleConfigMode && (
                <button onClick={onToggleConfigMode} className="btn right blue-grey">
                  Annuler
                </button>
              )}
              {/* <DisplayFormikState {...props} />  */}
            </Form>
          )
        }}
      </Formik>
    </>
  )
}
