const admin = require("firebase-admin")
const FirebaseObject = require("./FirebaseObject")
const { NOTIFICATION_STATUS, NOTIFICATION_AUDIENCES, NOTIFICATION_TEMPLATE_TYPES } = require("../constants")
const { getPlayersByAudience, getPlayersToNotify } = require("../utils/players")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { getEmailNotification, sendEmailNotifications, fetchChallengeEmailVariables, buildEmail } = require("../utils/notifications/email")
const { getPushNotification, sendPushNotifications } = require("../utils/notifications/push")
const moment = require("moment")
const timestamp = admin.firestore.Timestamp
const fs = require("fs")
const Challenge = require("./Challenge")
const { nanoid } = require("nanoid")
const ChallengeSettings = require("./ChallengeSettings")
const Organisation = require("./Organisation")
const WhitelistMember = require("./WhitelistMember")
const { successResponse } = require("../utils/response")
const { emailBuilder } = require("../utils/emails/builder")

const SANDBOX_MODE = false
module.exports = class Notification extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/notifications`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/notifications`
  }

  constructor(state) {
    super(state, { collection: "games" })
    Object.assign(this, state)
  }

  async send() {
    let players = []

    const testUsers = [{ firstName: "Damien", email: "admin@maracuja.ac" }]
    let notificationData
    if (this.audience === NOTIFICATION_AUDIENCES.WHITELIST) {
      const members = await WhitelistMember.fetchAll(
        { challengeId: this.challengeId },
        {
          refHook: (ref) => ref.where("subscribed", "==", false),
        }
      )
      notificationData = await Notification.sendEmailToUsers(members, this.template) //TODO remove test
    } else {
      if (this.playerIds) {
        const newPlayers = await getPlayersToNotify({
          challengeId: this.challengeId,
          playerIds: this.playerIds,
        })
        if (newPlayers) {
          players = players.concat(newPlayers)
        }
      }

      if (this.audience !== NOTIFICATION_AUDIENCES.PLAYERS) {
        const newPlayers = await getPlayersByAudience(this.audience, this)
        players = players.concat(newPlayers)
      }

      if (this.template.type === NOTIFICATION_TEMPLATE_TYPES.EMAIL) {
        notificationData = await Notification.sendEmailToUsers(players, this.template) //TODO remove test
      } else {
        // if(this.template.type === NOTIFICATION_TEMPLATE_TYPES.NOTIFICATION){{
        notificationData = await Notification.sendNotificationToPlayers(players, this.template, SANDBOX_MODE)
      }
    }

    if (!SANDBOX_MODE) {
      await this.update({
        stats: notificationData.stats,
        status: NOTIFICATION_STATUS.SENT,
        sentAt: new Date(),
      })
    }

    return notificationData
  }

  static async send(documentParams = { challengeId, id }) {
    const notification = await Notification.fetch(documentParams)
    return notification.send()
  }

  static async createForAnimation(
    data = {
      audience,
      challengeId,
      phaseId,
      playerIds,
      questionSetId,
      questionSetPhaseId,
      questionSetType,
      scheduled,
      scheduledDate,
      teamIds,
      template,
      type,
    }
  ) {
    if (data.scheduledDate) {
      data.status = NOTIFICATION_STATUS.SCHEDULED
    } else {
      data.status = NOTIFICATION_STATUS.DRAFT
    }

    const id = `animation_${data.audience}_${moment(data.scheduledDate || null).format("YYYY-MM-DD_H-mm")}_${nanoid(4)}`
    const notification = await Notification.create({ challengeId: data.challengeId, id }, data, true)
    notification.id = id
    return notification
  }

  /**
   * @param {Object} obj - An object.
   * @param {array} obj.users - Users.
   * @return {object}
   */
  static async sendEmail({ users, sandboxMode = false, htmlContent, title, variables = {}, userPropertiesKeys, campaignId, fromEmail }) {

    variables.title = title
    const emailData = {
      variables,
      content: htmlContent,
      campaignId: campaignId || `[${variables.challengeCode}] ${title}`,
    }

    const pushCount = 0
    let undefinedCount = 0
    let emailCount = 0

    const emailNotifications = []

    const pushCountSucceed = 0
    let emailCountSucceed = 0
    const disabledTokensCount = 0
    const notAcceptNotifCount = 0

    users.forEach((user) => {
      if (!user.email) {
        undefinedCount++
        return false
      }
      emailData.email = user.email
      userPropertiesKeys?.forEach((key) => {
        const value = user[key]
        if (value) emailData.variables[key] = user[key]
      })
      const notif = buildEmail(emailData)
      emailNotifications.push(notif)
      emailCount++
    })

    if (emailCount) {
      emailCountSucceed = await sendEmailNotifications({
        emails: emailNotifications,
        sandboxMode,
        fromEmail,
      })
    }

    const stats = getNotificationStats({
      pushCount,
      pushCountSucceed,
      emailCount,
      emailCountSucceed,
      disabledTokensCount,
      undefinedCount,
      notAcceptNotifCount,
    })
    if (sandboxMode) {
      stats.sandboxMode = true
      stats.totalDelivery = 0
    }
    return { stats }
  }

  static async sendNotificationToPlayers(players, template, sandboxMode = false) {
    const pushData = {
      title: template.title,
      message: template.message,
      type: "push",
      analyticsLabel: template.type,
      redirect: template.redirect,
      challengeId: template.challengeId,
    }

    const content = fs.readFileSync("./data/emails/notification.html", "utf-8")

    const challengeEmailVariables = await fetchChallengeEmailVariables(template.challengeId)
    const emailData = {
      ...template,
      ...challengeEmailVariables,
      type: "email",
      content,
    }

    let pushCount = 0
    let undefinedCount = 0
    let emailCount = 0

    const emailNotifications = []
    const pushNotifications = []

    const addEmailNotification = (player) => {
      if (!player.email) {
        // info("Player : ", player.username , player.id, "UNDEFINED")
        undefinedCount++
        return false
      }
      // info("Player : ", player.username , player.id, "EMAIL")

      emailData.email = player.email
      const notif = getEmailNotification(emailData)
      emailNotifications.push(notif)
      emailCount++
      return true
    }

    const addPushNotification = (player) => {
      // info("Player : ", player.username , player.id, "PUSH")
      pushData.token = player.fcmToken
      const notif = getPushNotification(pushData)
      pushNotifications.push(notif)
      pushCount++
      return true
    }

    let pushCountSucceed = 0
    let emailCountSucceed = 0
    let disabledTokensCount = 0
    let notAcceptNotifCount = 0

    players.forEach((player) => {
      if (template.emailOnly) {
        // TODO Commenté si ligne d'au dessus decommentée
        addEmailNotification(player)
      } else if (!player.fcmToken) {
        if (!template.mailingListEnabled || player.notifications?.email?.news) {
          addEmailNotification(player)
        } else {
          notAcceptNotifCount++
        }
      } else {
        addPushNotification(player)
      }
    })

    // if(false){
    if (pushCount) {
      const response = await sendPushNotifications(pushNotifications, sandboxMode)
      pushCountSucceed = response.successCount

      if (response.disabledTokens) {
        info("Will disabled " + disabledTokensCount + " fcmToken")
        disabledTokensCount = response.disabledTokens.length
        pushCount -= disabledTokensCount
      }
    }

    if (emailCount) {
      emailCountSucceed = await sendEmailNotifications({
        emails: emailNotifications,
        sandboxMode,
      })
    }

    const stats = getNotificationStats({
      pushCount,
      pushCountSucceed,
      emailCount,
      emailCountSucceed,
      disabledTokensCount,
      undefinedCount,
      notAcceptNotifCount,
    })
    if (sandboxMode) {
      stats.sandboxMode = true
      stats.totalDelivery = 0
    }
    return { stats }
  }

  static async sendEmailToUsers(users, template) {
    const content = fs.readFileSync("./data/emails/notification.html", "utf-8")

    const variables = await fetchChallengeEmailVariables(template.challengeId, true)
    const challenge = variables.challenge
    const organisation = await Organisation.fetch({ id: challenge.organisationsIds[0] })
    const organisationName = organisation.name

    variables.contentTitle = template.title
    const userPropertiesKeys = ["firstName"]

    let htmlContent, title
    let notAddHeaderAndFooter
    let layoutList = []
    if (template.emailId === "subscriptionDME") {
      title = `${variables.challengeName} : ${template.title}`
      // title = `${organisationName} ${variables.challengeName} : ${template.title}`
      htmlContent = emailBuilder({ folder: "subscriptionDME", layoutList })
    }
    console.log("template.emailId :", template.emailId)
    if (template.emailId === "training-onboarding-day-1") {
      title = `Formation ${variables.challenge.trainingActions.name} : Inscription à la préparation `
      htmlContent = emailBuilder({ folder: "training/onboarding/day-1", layoutList, notAddHeaderAndFooter: true })
    }
    if (template.emailId === "training-onboarding-day-2") {
      title = `Formation ${variables.challenge.trainingActions.name} : Rejoins ton équipe !`
      htmlContent = emailBuilder({ folder: "training/onboarding/day-2", layoutList, notAddHeaderAndFooter: true })
    }
    if (template.emailId === "training-onboarding-day-3") {
      title = `Formation ${variables.challenge.trainingActions.name} : Seulement 3 min par jour !`
      htmlContent = emailBuilder({ folder: "training/onboarding/day-3", layoutList, notAddHeaderAndFooter: true })
    }
    if (template.emailId === "training-onboarding-day-4") {
      title = `Formation ${variables.challenge.trainingActions.name} : Une formation entre collègues`
      htmlContent = emailBuilder({ folder: "training/onboarding/day-4", layoutList, notAddHeaderAndFooter: true })
    }
    if (template.emailId === "training-onboarding-day-5") {
      title = `Formation ${variables.challenge.trainingActions.name} : Préparez-vous en jouant !`
      htmlContent = emailBuilder({ folder: "training/onboarding/day-5", layoutList, notAddHeaderAndFooter: true })
    }
    if (template.emailId === "training-onboarding-day-6") {
      title = `Dernier jour pour rejoindre la préparation à la formation ${variables.challenge.trainingActions.name}`
      htmlContent = emailBuilder({ folder: "training/onboarding/day-6", layoutList, notAddHeaderAndFooter: true })
    }

    if (template.emailId === "newPhase") {
      variables.introMessage = ""
      title = `${variables.challengeName} : ${variables.contentTitle}`
      // title = `${organisationName} ${variables.challengeName} : ${variables.contentTitle}`
      // const htmlContent = fs.readFileSync("./data/emails/subscription.html", "utf-8")
      const layoutList = ["header"]

      layoutList.push("challengeNewPhaseButton")
      layoutList.push("content")
      layoutList.push("footer")
      htmlContent = emailBuilder({ folder: "subscription", layoutList })

      variables.contentIntroduction = challenge.onboarding.subscriptionEmail.introduction
      variables.contentDescription = challenge.onboarding.subscriptionEmail.description
      variables.contentPlanning = challenge.onboarding.subscriptionEmail.planning
    }
    if (!htmlContent) {
      throw Error("emailId not recognized")
    }

    const stats = await Notification.sendEmail({ users: users, challengeId: template.challengeId, htmlContent, userPropertiesKeys, title, variables, notAddHeaderAndFooter })
    // if (!testMembers) {
    //   const promises = members.map(async (member) => {
    //     return member.update({ subscriptionNewPhase: true })
    //   })
    //   await Promise.all(promises)
    // }
    return stats
  }

  static async sendScheduledNotifications() {
    await ChallengeSettings.fetchAllCurrentRankings({
      hook: async (ranking) => {
        const notifications = await Notification.fetchAll(
          { challengeId: ranking.challenge.id },
          {
            refHook: (ref) => ref.where("status", "==", "scheduled").where("scheduledDate", "<=", timestamp.now()),
          }
        )
        if (!notifications) return
        const promises = notifications.map((notification) => notification.send())
        debug(promises.length, "notifications envoyée ✅")
        return Promise.all(promises)
      },
    })
  }
}

const getNotificationStats = ({ pushCount, pushCountSucceed, emailCount, emailCountSucceed, disabledTokensCount, undefinedCount, notAcceptNotifCount }) => {
  let pushDelivery = pushCountSucceed
  if (disabledTokensCount) {
    pushDelivery += " (" + disabledTokensCount + "disabled )"
  }
  const emailDelivery = emailCountSucceed
  const totalDelivery = pushCountSucceed + emailCountSucceed

  const response = {
    pushDelivery,
    emailDelivery,
    notAcceptNotifCount,
    totalDelivery,
    disabledTokensCount,
    undefinedCount,
  }

  return response
}
