const { exportToCsv } = require("../../utils/dbExport")

exports = module.exports = async ({ challengeId, questionSetScoresPath }) => {
  const params = {
    challengeId,
    collection: "teams",
    fields: ["id", "name", "createdAt", "ffeClubNumber", "department.name", "region.name", "city", "zipCode", "lrrBassin.name", "tribe.name", "playerCount", "captainCount", "refereeCount", "gameCount", ...questionSetScoresPath],
  }

  return (await exportToCsv(params)).url
}
