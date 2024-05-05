import { Title1 } from "@maracuja/shared/components"
import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { objectSubsetWithDefault } from "@maracuja/shared/helpers"
import { Activity, Event, ExternalActivity, IdeasBox, Lottery, Survey } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import { nanoid } from "nanoid"
import React, { useLayoutEffect, useMemo, useRef, useState } from "react"
import Container from "react-materialize/lib/Container"
import { useHistory, useParams } from "react-router"
import { generatePath, useLocation } from "react-router-dom"
import { FormButton } from "../../../components"
import FieldContainer from "../../../components/FormikFieldContainer"
import { ROUTES } from "../../../constants"
import DatesField from "./DatesField"
import DisplayDatePicker from "./DisplayDatePicker"
import EventForm from "./EventForm"
import ExternalActivityForm from "./ExternalActivityForm"
import LotteryForm from "./LotteryForm"

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const { activityId } = useParams<any>()
  const history = useHistory()
  const location = useLocation<any>()
  const [activity, setActivity] = useState<any>(null)
  const types = useRef([
    { id: ACTIVITY_TYPES.EXTERNAL, name: "Activité externe" },
    { id: ACTIVITY_TYPES.EVENT, name: "Événement" },
    { id: ACTIVITY_TYPES.LOTTERY, name: "Lotterie" },
  ])
  const generatedId = useRef(nanoid(8))
  const currentId = activityId || generatedId.current

  useLayoutEffect(() => {
    if (!activity) {
      if (activityId) {
        fetchActivity()
      } else if (location?.state?.defaultValues) {
        setActivity(location?.state?.defaultValues)
      }
    }
  }, [])

  const fetchActivity = async () => {
    const currentActivity = currentChallenge.activities.find((element) => element.id === activityId)
    if (currentActivity) {
      const challengeId = currentChallenge.id
      let a
      switch (currentActivity.type) {
        case ACTIVITY_TYPES.EVENT:
          a = await Event.fetch({ challengeId, id: activityId })
          break
        case ACTIVITY_TYPES.IDEAS_BOX:
          a = await IdeasBox.fetch({ challengeId, id: activityId })
          break
        case ACTIVITY_TYPES.LOTTERY:
          a = await Lottery.fetch({ challengeId, id: activityId })
          break

        case ACTIVITY_TYPES.EXTERNAL:
          a = await ExternalActivity.fetch({ challengeId, id: activityId })
          break
      }
      setActivity(a)
    }
  }

  const loadInitialValues = useMemo(() => {
    let specificInitialValues = {}
    switch (activity?.type) {
      case ACTIVITY_TYPES.EVENT:
        specificInitialValues = Event.getDefaultValues()
        break
      case ACTIVITY_TYPES.LOTTERY:
        specificInitialValues = Lottery.getDefaultValues()
        break
      case ACTIVITY_TYPES.EXTERNAL:
        specificInitialValues = ExternalActivity.getDefaultValues()
        break

      default:
        specificInitialValues = {}
        break
    }

    const values = {
      ...objectSubsetWithDefault(activity, specificInitialValues),
      ...objectSubsetWithDefault(activity, {
        description: "",
        endDate: new Date(),
        name: "",
        phaseId: "",
        startDate: new Date(),
        type: "",
      }),
    }

    return values
  }, [activity])

  const handleClickDeleteActivity = async () => {
    if (window.confirm("Supprimer cette activité ?")) {
      activity.challengeId = currentChallenge.id
      await activity.delete()

      handleClickCancelActivity()
    }
  }

  const handleClickCancelActivity = async () => {
    const route = generatePath(ROUTES.CHALLENGE_ACTIVITIES, {
      challengeId: currentChallenge.id,
    })
    history.push(route)
  }

  const handleClickDuplicate = ({ activity }) => {
    const newActivity = Object.assign({}, activity)
    newActivity.startDate = incrementDate(newActivity.startDate)
    newActivity.endDate = incrementDate(newActivity.endDate)
    newActivity.drawDate && (newActivity.drawDate = incrementDate(newActivity.drawDate))
    delete newActivity.winners
    const route = generatePath(ROUTES.CHALLENGE_ACTIVITY_CREATION, {
      challengeId: currentChallenge.id,
    })
    history.push(route, { defaultValues: newActivity })
  }

  const incrementDate = (date) => {
    const sDate = new Date(date)
    sDate.setDate(sDate.getDate() + 1)
    return sDate
  }

  const handleSubmitForm = async (values, e) => {
    if (values) {
      if (!activityId) {
        const params = {
          challengeId: currentChallenge.id,
          activityType: values.type,
          activityId: currentId,
          data: { ...values },
        }
        await Activity.create(params)
      } else {
        await activity.update({ ...values })
      }
      handleClickCancelActivity()
    }
    history.push(`/challenges/${currentChallenge.id}/activities`)
  }

  return (
    <>
      <Container>
        <Title1>Activité</Title1>
        <Formik initialValues={loadInitialValues} enableReinitialize onSubmit={handleSubmitForm}>
          {(formik) => {
            return (
              <Form style={{ padding: 20 }}>
                <FieldContainer
                  component="select"
                  className="browser-default"
                  name="type"
                  label="Type"
                  disabled={formik.values.type && activityId}
                >
                  <option value="none">Sélectionnez un type</option>
                  {types.current.map((type) => {
                    return (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    )
                  })}
                </FieldContainer>
                <FieldContainer label="Nom" name="name" type="text" />
                <DatesField>
                  <DisplayDatePicker name="startDate" label="Date de début d'affichage" />
                  <DisplayDatePicker name="endDate" label="date de fin d'affichage" />
                </DatesField>
                <FieldContainer
                  component="select"
                  className="browser-default"
                  name="phaseId"
                  label="Comptabilisé pour la phase..."
                >
                  <option value="none">Sélectionnez une phase</option>
                  {currentChallenge.phases.map((phase) => {
                    return (
                      <option key={phase.id} value={phase.id}>
                        {phase.name}
                      </option>
                    )
                  })}
                </FieldContainer>

                <br />
                {formik.values.type === ACTIVITY_TYPES.EVENT && <EventForm currentId={currentId} />}
                {formik.values.type === ACTIVITY_TYPES.EXTERNAL && (
                  <ExternalActivityForm activity={activity} currentId={currentId} />
                )}

                {activity && formik.values.type === ACTIVITY_TYPES.LOTTERY && (
                  <LotteryForm activity={activity} currentId={currentId} />
                )}
                <br />
                <br />
                <FormButton disabled={!formik.values.type} type="submit" style={{ marginRight: 20 }}>
                  {!activityId ? "Créer" : "Enregistrer"}
                </FormButton>
                {!activityId ? (
                  <FormButton disabled={!formik.values.type} type="button" onClick={handleClickCancelActivity} red>
                    Annuler
                  </FormButton>
                ) : (
                  <>
                    <FormButton disabled={!formik.values.type} type="button" onClick={handleClickDeleteActivity} red>
                      Supprimer
                    </FormButton>
                    &nbsp;
                    <FormButton onClick={() => handleClickDuplicate({ activity })}>Dupliquer</FormButton>
                  </>
                )}
              </Form>
            )
          }}
        </Formik>
      </Container>
    </>
  )
}
