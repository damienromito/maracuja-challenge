
const assert = require('chai').assert // https://devhints.io/chai

const { ACTIVITY_TYPES } = require('../constants')

const test = require('./helpers/configuration').getTester()
const maracujaFunctions = require('../index')
const participation = require('./data/debriefingParticipation.json')

const { Game } = require('../models')
const { sleep } = require('./helpers')

console.log('participation:', participation)
const fetchLastGame = () => Game.fetchFirst({ challengeId: participation.challengeId }, {
  refHook:
  ref => ref.where('questionSet.type', '==', ACTIVITY_TYPES.DEBRIEFING)
    .where('player.id', '==', participation.player.id)
    .where('questionSet.id', '==', participation.questionSet.id)
})

describe('Debriefing Participation', () => {
  before(async () => {
    // const game = await fetchLastGame()
    // if(game){
    //   await game.delete()
    //   console.log('Game found and deleted')
    // }
    // await sleep(2000) //wait for trigger
  })

  it('Send participation debriefing', async () => {
    const participateToContest = test.wrap(maracujaFunctions.apiGamesParticipate)
    const context = { auth: { uid: participation.player.id } }
    await participateToContest(participation, context)

    const game = await fetchLastGame()
    assert.exists(game)
  })

  it('Player score updated', async () => {

    // const player = await Player.fetch({challengeId : participation.challengeId, id : participation.player.id })

    // const pathParticipationStats = player.scores[participation.phase.id][`${participation.questionSet.type}s`]._stats

    // assert.equal(pathParticipationStats.score, participation.correctCount)

    // assert.equal(pathParticipationStats.errorCount, participation.answerCount - participation.correctCount )

  })

  after(async () => {

  })
})
