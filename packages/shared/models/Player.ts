import { callApi, objectSubset } from "../helpers"
import { updateAnalyticsUserProperties } from "../helpers/analytics"
import EntityWithRoles from "./EntityWithRoles"
import Image from "./Image"

class Player extends EntityWithRoles {

  challengeId: string
  // static documentPath ({ challengeId, id }) { return `challenges/${challengeId}/players/${id}` }
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/players`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/players`
  }

  constructor(props) {
    super(props)
    Object.assign(this, props)
    if (props) {
      if (props.birthday) {
        if (props.birthday.toDate && typeof props.birthday.toDate === "function") {
          this.birthday = props.birthday.toDate()
        } else if (typeof props.birthday === "string") {
          this.birthday = new Date(props.birthday)
        }
      }

      if (props.avatar) {
        this.avatar = new Image(props.avatar)
      }

      if (props.createdAt?.toDate && typeof props.createdAt.toDate === "function") {
        this.createdAt = props.createdAt.toDate()
      }
      if (props.editedAt?.toDate && typeof props.editedAt.toDate === "function") {
        this.editedAt = props.editedAt.toDate()
      }
      this.questionSets = {}
      if (props.scores) {
        this.questionSets = {}
        Object.keys(props.scores).forEach((phaseId) => {
          const phaseActivities = props.scores?.[phaseId]

          // DEBRIEFING

          if (phaseActivities.debriefings) {
            Object.keys(phaseActivities.debriefings).forEach((activityId) => {
              if (activityId === "_stats") return
              if (phaseActivities?.contests?.[activityId]) {
                phaseActivities.contests[activityId]._stats.debriefingProgression =
                  phaseActivities?.debriefings?.[activityId]._stats.progression
              }
            })
          }

          const phaseQuestionSets = {
            ...phaseActivities?.contests,
            ...phaseActivities?.trainings,
          }
          if (!phaseQuestionSets) return
          Object.keys(phaseQuestionSets).forEach((activityId) => {
            if (activityId === "_stats") return

            const questionSet = phaseQuestionSets[activityId]
            this.questionSets[activityId] = questionSet
          })
        })
      }

    }
  }

  async updateAvatar({ imageUrl, removeBackground, test, oldAvatarReplaced }) {
    const params = {
      challengeId: this.challengeId,
      playerId: this.id,
      teamId: this.club.id,
      imageUrl,
      removeBackground,
      test,
      oldAvatarReplaced,
    }
    return await callApi("apiPlayersAvatarCreate", params)
  }

  static wakeUp(data) {
    return callApi("apiPlayersWakeUp", data)
  }

  subscribeToEmailChallengeTips({ challengeId, mailjetListId }) {
    const params = {
      challengeId,
      mailjetListId,
      player: objectSubset(this, ["id", "email", "username", "lastName", "firstName", "club", "platform", "roles"]),
    }

    return callApi("apiNotificationsSubscribeToChallengeTips", params).catch((err) => {
      alert(
        "Une erreur est survenue, ressayez ou contactez notre équipe technique à bonjour@maracuja.ac. Merci de nous transmettre le message : " +
        err.message
      )
      throw Error(err)
    })
  }

  becomeCaptain() {
    return callApi("apiTeamsUpdateCaptain", {
      challengeId: this.challengeId,
      teamId: this.club.id,
      playerId: this.id,
    })
  }

  removeCaptainRole() {
    return callApi("apiTeamsUpdateCaptain", {
      challengeId: this.challengeId,
      teamId: this.club.id,
      playerId: this.id,
      removeRole: true
    })
  }

  receivePushNotifications() {
    return !!this.fcmToken
  }

  generateCard() {
    const params = {
      challengeId: this.challengeId,
      playerId: this.id,
      teamId: this.club.id,
    }
    return callApi("apiGenerateImagePlayerCard", params).then((result) => {
      return result
    })
  }

  static async create(params) {
    if (params.birthday) {
      params.birthday = params.birthday.toISOString()
    }

    return callApi("apiPlayersSubscribeV2", params).then((result) => {
      updateAnalyticsUserProperties({ ...params, id: params.userId })
      return result
    })
  }
}

export default Player
