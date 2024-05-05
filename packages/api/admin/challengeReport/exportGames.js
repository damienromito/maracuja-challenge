const { convertObjectsToCSVLines, buildCSVFile} = require('../../utils/dbExport');



exports = module.exports = async ({challengeId, gamesObjects}) => {
  const fields =  [
      "id",
      "deviceIdIdenticalCount",
      "deviceId",
      "duration",
      "player.id",
      "player.roles",
      "player.username",
      "score",
      "progression",
      "answerCount",
      "questionCount",
      "questionSet.id",
      "questionSet.type",
      "createdAt",
      "startedAt",
      "triedToCheat",
      "team.id",
      "team.name"
    ] 

  let csvLines = await convertObjectsToCSVLines({objectArray : gamesObjects, fields })
  return await buildCSVFile ({collection : 'games', challengeId, csvLines})
  
} 