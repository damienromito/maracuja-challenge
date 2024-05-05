import "firebase/firestore"
import moment from "moment"
import { callApi } from "../helpers"
import FirebaseObject from "./FirebaseObject"
import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import Question from "./Question"

class QuestionSet extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/questionSets`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/questionSets`
  }

  constructor(data) {
    super(data)
    Object.assign(this, data)
    this.startDate = FirebaseObject.handleDateFromApi(data.startDate)
    this.endDate = FirebaseObject.handleDateFromApi(data.endDate)
    this.startedAt = FirebaseObject.handleDateFromApi(data.startedAt)

    if (this.questions) {
      this.questions = data.questions.map((q) => new Question(q))
    }


  }

  getIfDebriefingIsNeeded() {
    return this.hasPlayed && this._stats?.score < this._stats?.questionCount
  }

  getDebriefingProgression(percent = false) {
    const progression = this._stats?.debriefingProgression || 0.0
    return percent ? Math.round(progression * 100) + "%" : progression
  }

  getProgression(stringFormat = false) {
    const progression = this._stats?.progression || 0.0
    return stringFormat ? Math.round(progression * 100) + "%" : progression
  }

  // CONTEST
  getScore(stringFormat = false) {
    const score = this._stats?.score
    return stringFormat ? score + " POINTS" : score
  }

  getIsActive() {
    const now = new Date()
    if (this.startDate > now) return false
    if (this.type === ACTIVITY_TYPES.CONTEST && this.endDate < now) return false
    return true
  }

  getAvaibilityString() {
    const getOverString = () => {
      const overString = this.type === ACTIVITY_TYPES.TRAINING ? "terminé" : "terminée"
      return `${overString} ${moment(this.endDate).from(now)}`
    }

    const now = new Date()
    if (this.startDate < now && this.endDate > now) {
      this.active = true
      return getOverString()
    } else {
      this.active = false
      if (this.startDate > now) {
        return "disponible " + moment(this.startDate).from(now)
      } else {
        return getOverString()
      }
    }
  }

  static create({ id, challengeId }, data) {
    delete data.id
    data.challengeId = challengeId
    return super.create({ id, challengeId }, data)
  }

  static fetchAllWithoutIcebreaker({ challengeId }) {
    return this.fetchAll(
      { challengeId },
      {
        refHook: (ref) => ref.where("type", "!=", "icebreaker"),
      }
    )
  }

  static fetchTrainingsAndContests({ challengeId }, options) {
    return this.fetchAll(
      { challengeId },
      {
        listener: options.listener,
        refHook: (ref) => ref.where("type", "in", ["training", "contest"]).orderBy("startDate", "asc"),
      }
    )
  }

  static async startContest(params) {
    // params = { challengeId, questionSetId, playerId, testMode, deviceId }
    const data = await callApi("apiContestStart", params)
    if (data.questionSet) {
      data.questionSet = new QuestionSet(data.questionSet)
    }
    return data
  }

  static async startTraining(params) {
    // params = { challengeId, questionSetId, playerId, testMode, deviceId }
    const data = await callApi("apiTrainingStart", params)
    if (!data.error) {
      data.questionSet = new QuestionSet(data.questionSet)
    }
    return data
  }

  static async startIcebreaker(params) {
    // params = { challengeId, questionSetId, playerId, testMode, deviceId }
    const data = await callApi("apiIcebreakerStart", params)
    if (!data.error) {
      data.questionSet = new QuestionSet(data.questionSet)
    }
    return data
  }


  static async startDebfriefing(params: StartDebfriefingProps) {
    // params = { challengeId, questionSetId, playerId }
    const data = await callApi("apiDebriefingStart", params)

    if (!data.error) {
      data.questionSet = new QuestionSet(data.questionSet)
    }
    return data
  }
}

export default QuestionSet

export interface StartDebfriefingProps {
  challengeId: boolean,
  questionSetId: boolean,
  playerId: boolean,
  testMode: boolean,
  keepProgression: boolean,
  deviceId?: string
  contestId?: string
}
