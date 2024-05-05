
const { ACTIVITY_TYPES } = require('../../constants')
const { exportToCsv } = require('../../utils/dbExport')
const { calcPlayerEngagment } = require('../../utils/players')

exports = module.exports = async ({ challengeId, questionSetScoresPath, questionSets, rankings, phases, haveToCalcEngagment }) => {
  const params = {
    // playerIds : ["margot_wlPWlTuSjKZ-ZaVtfp", "lisemari_tGl9AYFitpUOV3FkB_"],
    // limit:10,
    challengeId,
    collection: 'players',
    fields: [
      'id',
      'email',
      'createdAt',
      'username',
      'firstName',
      'birthday',
      'club.name',
      'club.id',
      'platform',
      'roles',
      'gameCount',
      'trainingCount',
      'number',
      'contestCount',
      'gameCount',
      'optinComFFE',
      'optinDiscoverFFE',
      'fcmToken',
      'avatar.original',
      'refereeCount',
      'acceptNotification',
      'referer.id',
      'deviceIdIdenticalCount',
      'avatarUploadCount',
      'notifications.email.news',
      'deviceId',

      'possibleParticipationCount',
      'participationCount',
      'engagmentRate',

      'participationContestCount',
      'engagmentContestRate',
      'possibleContestCount',

      'participationDebriefingCount',
      'engagmentDebriefingRate',
      'possibleDebriefingCount',

      'participationTrainingCount',
      'possibleTrainingCount',
      'engagmentTrainingRate',
      ...questionSetScoresPath
    ]
  }

  const objectsHook = (players) => {
    if (!haveToCalcEngagment) return players
    // CALCULATE ENGAGMENT
    players = players.map(player => {
      const playerEngagment = calcPlayerEngagment(player, { phases, rankings, questionSets })
      return { ...player, ...playerEngagment }
    })
    return players
  }

  const result = await exportToCsv(params, { objectsHook })
  return result.url
}
