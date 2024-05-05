
const admin = require('firebase-admin')
const assert = require('chai').assert // https://devhints.io/chai

// const { PLAYER_ROLES } = require('../constants')
const { ANTI_CHEAT, ACTIVITY_TYPES } = require('../constants')

const test = require('./helpers/configuration').getTester()
const maracujaFunctions = require('../index')
const { objectSubset } = require('../utils')
const participation = require('./data/contestParticipation.json')

const { Club, Player, Team, User, Challenge, Game } = require('../models')
const { sleep } = require('./helpers')

const fetchLastGame = () => Game.fetchFirst({ challengeId: participation.challengeId }, {
  refHook:
  ref => ref.where('questionSet.type', '==', ACTIVITY_TYPES.CONTEST)
    .where('player.id', '==', participation.player.id)
    .where('questionSet.id', '==', participation.questionSet.id)
})

describe('Contest Participation', () => {
  before(async () => {
    const game = await fetchLastGame()

    if (game) {
      await game.delete()
      console.log('Game found and deleted')
    }
    await sleep(2000) // wait for trigger
  })

  it('Send participation contest', async () => {
    const participateToContest = test.wrap(maracujaFunctions.apiGamesParticipate)
    const context = { auth: { uid: participation.player.id } }
    await participateToContest(participation, context)

    const game = await fetchLastGame()

    assert.exists(game)
  })

  it('Player score updated', async () => {
    const player = await Player.fetch({ challengeId: participation.challengeId, id: participation.player.id })

    const pathParticipationStats = player.scores[participation.phase.id][`${participation.questionSet.type}s`][participation.questionSet.id]._stats

    console.log('participation:', participation.correctCount)
    assert.equal(pathParticipationStats.score, participation.correctCount)

    console.log('participation.answerCount:', participation.answerCount)
    assert.equal(pathParticipationStats.errorCount, participation.answerCount - participation.correctCount)
  })

  after(async () => {

  })
})
