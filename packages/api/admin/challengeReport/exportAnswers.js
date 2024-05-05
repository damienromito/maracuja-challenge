const { convertObjectsToCSVLines, buildCSVFile } = require('../../utils/dbExport')

exports = module.exports = async ({ gamesObjects, challengeId }) => {
  const csvLines = await convertObjectsToCSVLines({
    objectArray: gamesObjects,
    linePerArrayObject: 'answers',
    objectFields: [
      'id',
      'answer',
      'duration',
      'isCorrect',
      'themeId'
    ],
    fields: [
      'id',
      'questionSet.id',
      'questionSet.type',
      'player.id',
      'team.id',
      'createdAt'
    ]
  })

  return await buildCSVFile({ collection: 'answers', challengeId, csvLines })
}
