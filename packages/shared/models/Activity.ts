import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import FirebaseObject from "./FirebaseObject"
import firebase from "firebase/app"
import { atTimeFields } from "../api/helpers"
import moment from "moment"
// import "moment/locale/fr"
class Activity extends FirebaseObject {
  constructor(data) {
    super(data)
    this.startDate = data.startDate?.toDate()
    this.endDate = data.endDate?.toDate()
  }

  getPeriodString() {
    let periodString = ""
    if (moment(this.startDate).isSame(this.endDate, "month")) {
      periodString = moment(this.startDate).format("D")
      periodString += "-" + moment(this.endDate).format("D MMM")
    } else {
      periodString = moment(this.startDate).format("D MMM")
      periodString += " - " + moment(this.endDate).format("D MMM")
    }
    return periodString
  }

  static getCollectionFromType({ activityType }) {
    switch (activityType) {
      case ACTIVITY_TYPES.EVENT:
        return "events"
      case ACTIVITY_TYPES.IDEAS_BOX:
        return "ideasBoxes"
      case ACTIVITY_TYPES.LOTTERY:
        return "lotteries"
      case ACTIVITY_TYPES.SURVEY:
        return "surveys"
      case ACTIVITY_TYPES.EXTERNAL:
        return "externalActivities"
    }
  }

  static getTypeLabel({ type }) {
    switch (type) {
      case ACTIVITY_TYPES.EVENT || "events":
        return "🎫 Événement"
      case ACTIVITY_TYPES.LOTTERY || "lotteries":
        return "🎡 Loterie"
      case ACTIVITY_TYPES.IDEAS_BOX || "ideaBoxes":
        return "💡 Boîte à idées"
      case ACTIVITY_TYPES.CONTEST:
        return "⭐️ Épreuve"
      case ACTIVITY_TYPES.TRAINING:
        return "💪 Entrainement"
      case ACTIVITY_TYPES.DEBRIEFING:
        return "🤔 Debriefing"
      case ACTIVITY_TYPES.SURVEY:
        return "📊 Sondage"
      case ACTIVITY_TYPES.EXTERNAL:
        return "📵 Activité externe"
      case ACTIVITY_TYPES.ICEBREAKER:
        return "👬 Ice breaker"

      default:
        return "🔨 Activité non référencée"
    }
  }

  static getCollectionLabel(collectionName) {
    switch (collectionName) {
      case "events":
        return "🎫 Événements"

      case "lotteries":
        return "🎡 Loteries"

      case "ideasBoxes":
        return "💡 Boîtes à idées"
      case "contests":
        return "🏆 Épreuves"
      case "trainings":
        return "💪 Entrainements"
      case "externalActivities":
        return "📵 Activités externes"
      default:
        return "🔨 Activités non référencées"
    }
  }

  static async create({ challengeId, activityType, activityId, data }) {
    const activityCollection = Activity.getCollectionFromType({ activityType })
    const ref = firebase.firestore().doc(`challenges/${challengeId}/${activityCollection}/${activityId}`)

    await ref.set({ ...data, challengeId, ...atTimeFields() })
  }
}

export default Activity
