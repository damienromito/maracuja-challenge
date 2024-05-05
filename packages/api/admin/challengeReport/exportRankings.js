const {  convertObjectsToCSVLines, buildCSVFile} = require('../../utils/dbExport');


exports = module.exports = async ({rankings, challengeId}) => {

  let csvLines = await convertObjectsToCSVLines({
    objectArray : rankings, 
    linePerArrayObject : 'teams', 
    objectFields : [
      "id",
      "name",
      "playerCount",
      "captainCount",
      "logo.120",
      "scores._stats.count",
      "scores._stats.engagement",
      "scores._stats.score"
    ], 
    fields : [
      'id',
      'phase.id', 
      'phase.name',
      "region.id",
      "department.id",
      "editedAt"
    ] 
  })
 
  return await buildCSVFile ({collection : 'ranking', challengeId, csvLines})

}