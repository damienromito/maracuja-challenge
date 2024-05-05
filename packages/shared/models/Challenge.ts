import { ACTIVITY_TYPES } from "../constants"
import { getPeriodString, mapToArray } from "../helpers"
import Activity from "./Activity"
import Event from "./Event"
import ExternalActivity from "./ExternalActivity"
import Lottery from "./Lottery"
import Survey from "./Survey"
import moment from "moment"
import "moment/locale/fr"
import { Icebreaker, IdeasBox } from "@maracuja/shared/models"
import { callApi } from "@maracuja/shared/helpers"
import { fetchRef } from "../api/helpers"
import FirebaseObject from "./FirebaseObject"
import firebase from "firebase/app"
import Module from "./Module"
import PeriodArray from "./PeriodArray"
import { PhasePreview } from "./Phase"

export interface ChallengePreview {
  id: string
  name: string
  startDate: Date
  phases: PhasePreview[]
}

class Challenge extends FirebaseObject {
  nextChallenge?: ChallengePreview
  phases?: any
  name: string
  image: string
  playersAvatarWithoutBackground: boolean
  team: any
  sharing: any
  startDate?: any
  endDate?: any
  modules?: any
  trainingActions?: any
  ideasBoxes?: IdeasBox[]
  surveys?: Survey[]
  activities?: any
  periodString?: any
  topPlayersEnabled?: any
  topPlayers?: any
  wording?: any
  referralEnabled?: any
  coach?: any
  questionSets?: any

  static collectionPath() {
    return "challenges"
  }
  collectionPath() {
    return "challenges"
  }

  constructor(data: any) {
    super(data)
    if (data) {
      Object.assign(this, data)
      this.phases = data.phases ? buildPhases({ phasesData: data.phases }) : []
      this.startDate = data.startDate?.toDate()
      this.endDate = data.endDate?.toDate()
      if (data.modules) {
        this.modules = mapToArray(data.modules, {
          toArray: true,
          initializer: (o: any) => new Module(o),
        })
      }
      if (this.trainingActions?.dates) {
        this.trainingActions.dates = this.trainingActions.dates.map((date: any) => date.toDate())
      }
      this.ideasBoxes = PeriodArray.buildFromMap(data.ideasBoxes, {
        childrenInitializer: (o: any) => new IdeasBox(o),
      })
      this.surveys = PeriodArray.buildFromMap(data.surveys, {
        childrenInitializer: (o: any) => new Survey(o),
      })
      this.activities = buildActivities(data)
      if (!this.periodString) {
        if (moment(this.startDate).isSame(this.endDate, "month")) {
          this.periodString = moment(this.startDate).format("D")
          this.periodString += "-" + moment(this.endDate).format("D MMM")
        } else {
          this.periodString = moment(this.startDate).format("D MMM")
          this.periodString += " - " + moment(this.endDate).format("D MMM")
        }
      }

      if (this.topPlayersEnabled) {
        let text = `Les ${this.topPlayers.members} meilleurs ${this.wording.players} `
        if (this.referralEnabled) text += `et les ${this.topPlayers.referees} meilleures ${this.wording.referees} `
        text += `comptent pour le score ${this.wording.ofTheTribe} ! \n\r`
        if (this.referralEnabled) text += `Les ${this.wording.referees} peuvent rapporter jusqu\'à 5 points par quiz.`
        this.topPlayers.rules = text
      }
    }
  }

  getActivity({ collectionName, id }: any) {
    if (["contests", "trainings"].includes(collectionName)) {
      return this.questionSets?.[id]
    }
    /* @ts-ignore */
    return this[collectionName][id]
  }

  isTrainingActionDate(date: any) {
    let isTrainingActionDate = false
    this.trainingActions?.dates?.forEach((taDate: any) => {
      if (moment(taDate).isSame(date, "days")) {
        isTrainingActionDate = true
      }
    })
    return isTrainingActionDate
  }

  getPossibleQuestionSetCount() {
    let possibleQuizCount = 0
    this.questionSets &&
      Object.keys(this.questionSets).forEach((key) => {
        const item = this.questionSets[key]
        const endDate = item.endDate?.toDate()
        if (endDate && !item.audienceRestricted && endDate > new Date()) {
          possibleQuizCount++
        }
      })
    return possibleQuizCount
  }

  getLastPhase() {
    return this.phases[this.phases.length - 1]
  }

  getCurrentScoreForTeam(team: any) {
    const currentPhase = this.getCurrentPhase()
    return team.scoreForPhase({
      phaseId: currentPhase?.id ?? this.getPreviousPhase()?.id,
      metric: "score",
    })
  }

  getCurrentPhase() {
    const now = new Date()
    return this.phases.find((phase: any) => phase.startDate < now && phase.endDate > now)
  }

  getPreviousPhase() {
    const now = new Date()
    let i = this.phases.length
    let latestPhase
    for (i; i > 0; i--) {
      const phase = this.phases[i - 1]
      if (phase.endDate < now) {
        latestPhase = phase
        break
      }
    }
    return latestPhase
  }

  getNextPhase() {
    const now = new Date()
    let nextPhase
    for (let i = 0; i < this.phases.length; i++) {
      const phase = this.phases[i]
      if (phase.startDate > now) {
        nextPhase = phase
        break
      }
    }
    return nextPhase
  }

  checkReferralCode({ code }: { code: string }) {
    return callApi("apiReferralCodeCheck", { challengeId: this.id, code })
  }

  checkPlayerLicense({ licenseNumber }: { licenseNumber: string }) {
    return callApi("apiPlayersLicenseCheck", {
      challengeId: this.id,
      licenseNumber,
    })
  }

  fetchReferralCode() {
    return callApi("apiReferralGetCode", { challengeId: this.id })
  }

  getCoachContact() {
    return callApi("apiChallengesCoachGetContact", { coach: this.coach })
  }

  checkPlayerInWhiteList({ email }: { email: string }) {
    return callApi("apiPlayersWhitelistCheckV2", {
      challengeId: this.id,
      email,
    })
  }

  delete() {
    return callApi("apiChallengesDelete", {
      challengeId: this.id,
    })
  }

  sendAdminReport({ testEmail }: any = {}) {
    return callApi("apiChallengesSendAdminReport", {
      challengeId: this.id,
      testEmail,
    })
  }

  // sendDailyReportToCaptains({ contestId, phaseId }) {
  //   return callApi("apiChallengesSendDailyReport", {
  //     challengeId: this.id,
  //     contestId,
  //     phaseId,
  //   })
  // }

  static async create(params: any) {
    params.startDate = params.startDate.toISOString()
    params.startQuizDate = params.startQuizDate.toISOString()
    const challengeId = await callApi("apiChallengesCreate", params)
    return challengeId
  }

  static async fetchByCode({ challengeCode }: { challengeCode: string }) {
    const challenges = await super.fetchAll({}, { refHook: (ref: any) => ref.where("code", "==", challengeCode) })
    if (challenges.length > 0) {
      return challenges[0]
    }
  }

  static fetch(documentParams: { id: string }, options?: any) {
    return super.fetch(documentParams, options)
  }
  static fetchAllCurrentPreview({ listener }: any) {
    const ref = firebase.firestore().collection("stats").doc("currentChallengesPreview")
    return fetchRef(ref, { listener })
  }

  static fetchPublicChallenges(listener: any) {
    return firebase
      .firestore()
      .collection("stats")
      .doc("publicChallenges")
      .onSnapshot((snap) => {
        const challengesObject = snap.data()
        if (!challengesObject) return null
        const challenges = Object.keys(challengesObject)
          .map((challengeId) => {
            const data = {
              ...challengesObject[challengeId],
              id: challengeId,
            }
            return new Challenge(data)
          })
          .sort((a, b) => b.startDate - a.startDate)
        return listener(challenges)
      })
  }
}

const sortedPeriodicData = (dataToSorted: any) => {
  dataToSorted.sort((a: any, b: any) => a.startDate - b.startDate)
  const dataSorted = dataToSorted.map((item: any) => {
    item.periodString = getPeriodString(item)
    return item
  })
  return dataSorted
}

const buildPhases = ({ phasesData }: any) => {
  if (!Array.isArray(phasesData)) {
    const arrayOfFieldsToChange = ["startDate", "endDate"]
    phasesData = Object.keys(phasesData)
      .map((key) => {
        const item = phasesData[key]
        arrayOfFieldsToChange.forEach((element) => {
          item[element] = item[element]?.toDate?.() || item[element]
        })
        return {
          ...item,
          id: key,
        }
      })
      .sort((a, b) => a.startDate - b.startDate)

    phasesData.map((item: any) => {
      item.periodString = getPeriodString(item)

      return item
    })
  }

  return phasesData
}

// getCurrentIdeasBox () {
//   return {}
// }

const buildActivities = (data: any) => {
  // eventsData = convertTimestampToDateOnMapField({ mapData: eventsData, arrayOfFieldsToChange: ['eventStartDate', 'eventEndDate'] })

  let activitiesData = {
    ...data.events,
    ...data.lotteries,
    ...data.externalActivities,
    ...data.surveys,
  }
  // activitiesData = convertTimestampToDateOnMapField({ mapData: activitiesData, arrayOfFieldsToChange: ['startDate', 'endDate'] })
  // activitiesData = mapPeriodicDataToArray({ mapData: activitiesData })
  activitiesData = Object.keys(activitiesData).map((key) => {
    let item = activitiesData[key]
    switch (item.type) {
      case ACTIVITY_TYPES.EVENT:
        item = new Event(item)
        break
      case ACTIVITY_TYPES.LOTTERY:
        item = new Lottery(item)
        break
      case ACTIVITY_TYPES.EXTERNAL:
        item = new ExternalActivity(item)
        break
      case ACTIVITY_TYPES.SURVEY:
        item = new Survey(item)
        break
      case ACTIVITY_TYPES.ICEBREAKER:
        item = new Icebreaker(item)
        break
      default:
        item = new Activity(item)
        break
    }
    return {
      ...item,
      id: key,
    }
  })
  activitiesData = sortedPeriodicData(activitiesData)
  return activitiesData
}

export default Challenge
