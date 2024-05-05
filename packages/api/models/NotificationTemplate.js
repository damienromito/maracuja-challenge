const { NOTIFICATION_TEMPLATE_TYPES } = require("../constants")
const Challenge = require("./Challenge")

module.exports = class NotificationTemplate {
  constructor(
    state = {
      title,
      message,
      challengeId,
      emailOnly: false,
      buttonText: "Ouvrir l'app",
      redirect: "/",
      type: NOTIFICATION_TEMPLATE_TYPES.NOTIFICATION,
      emailId,
    }
  ) {
    Object.assign(this, state)
  }
}
