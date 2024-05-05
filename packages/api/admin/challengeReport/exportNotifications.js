const { exportToCsv } = require("../../utils/dbExport")

exports = module.exports = async ({ challengeId }) => {
  const params = {
    challengeId,
    collection: "notifications",
    fields: ["notification.title", "notification.message", "template.title", "template.message", "players[0].clubId", "players[0].username", "players[0].id", "sender.username", "sender.teamId", "sender.id", "type", "audience", "stats.totalDelivery", "questionSetId", "teamIds", "sentAt", "createdAt"],
  }

  return (await exportToCsv(params)).url
}
