const moment = require("moment-timezone")
const admin = require("firebase-admin")
const { successResponse } = require("../../utils/response")
const { objectSubset } = require("../../utils")
const { getChallenge } = require("../../utils/challenges")
const db = admin.firestore()

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const { Phase, QuestionSet } = require("../../models")

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, phaseId, newStartDay = "2022-12-01" } = data

  const phase = await Phase.fetch({ challengeId, id: phaseId })
  const oldDate = phase.startDate

  const newDate = moment(newStartDay, "YYYY-MM-DD").toDate()
  // newDate.setHours(12)
  // const oldDate = moment(phase.startDate, 'YYYY-MM-DD').tz('Europe/Paris').toDate()

  // oldDate.setHours(12)
  const daysDiff = moment(newDate).diff(oldDate, "days")
  phase.challengeId = challengeId
  await phase.update({
    challengeId,
    startDate: moveDate(phase.startDate, daysDiff),
    endDate: moveDate(phase.endDate, daysDiff),
  })
  console.log("START PHASE", moveDate(phase.startDate, daysDiff))

  // MOVE QUESTIONSETS
  const questionSets = await QuestionSet.fetchAll(
    { challengeId },
    {
      refHook: (ref) => ref.where("phase.id", "==", phaseId),
    }
  )
  const promises = questionSets.map((questionSet) => {
    questionSet.challengeId = challengeId
    return questionSet.update({
      challengeId,
      startDate: moveDate(questionSet.startDate, daysDiff),
      endDate: moveDate(questionSet.endDate, daysDiff),
    })
  })
  await Promise.all(promises)

  return successResponse()
})

const moveDate = (date, daysDiff) => {
  const hours = moment(date).tz("Europe/Paris").get("hours") // Sinon probleme avec decalage horaire !
  const minutes = date.getMinutes()
  date.setHours(12)
  date.setDate(date.getDate() + daysDiff)
  date = moment(date).tz("Europe/Paris").set("hour", hours).toDate()
  date.setMinutes(minutes)
  return date
}
