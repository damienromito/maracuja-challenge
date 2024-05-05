const clone = require("lodash.clonedeep")
const roles = require("../../constants/roles")

exports = module.exports = ({ players, phaseId, topPlayers }) => {
  // TO CREATE TYPE FOR WARMUP
  // BY PHASE
  const scores = {}
  if (!players) return scores
  const playersKeys = Object.keys(players)
  const metrics = ["count"]
  // const metrics = ['count', 'progression', 'score']
  // topPlayers?.referees && metrics.push('scoreReferee')

  // Pour chaque joueur
  playersKeys.forEach((playerId) => {
    const player = players[playerId]
    const playerRole = player.roles?.includes(roles.REFEREE) ? "referees" : "members"
    const playerPhaseScores = player.scores?.[phaseId]
    if (!playerPhaseScores) return

    // Score de la Phase
    addStats({
      source: playerPhaseScores,
      destination: scores,
      metrics: ["count", "score"],
      playerRole,
      forEachChildren: (activityType) => {
        const activityTypeMetrics = clone(metrics)
        if (["trainings", "icebreakers", "debriefings"].includes(activityType)) {
          activityTypeMetrics.push("progression")
        } else {
          activityTypeMetrics.push("score")
        }

        const playerActivityTypeScores = playerPhaseScores[activityType]

        // Score du Type d'activité (ex QuestionSets, Events, ...)
        addStats({
          source: playerActivityTypeScores,
          destination: scores[activityType],
          metrics: activityTypeMetrics,
          playerRole,
          forEachChildren: (activityId) => {
            // Score du Activités (ex workshop_event, entrainement1, ...)
            addStats({ source: playerActivityTypeScores[activityId], destination: scores[activityType][activityId], metrics: activityTypeMetrics, playerRole })
          },
        })
      },
    })
  })
  // Somme le score de tous les joueurs
  sumScoreObject({ scoreObject: scores, playerCount: playersKeys.length, topPlayers })

  // Exception lorsque le top 10 des joueurs est pris en compte
  if (topPlayers && scores._stats) {
    // On readditionne les resultats de chaque activités sinon toues les joueurs sont pris en compte (au lieu du top)
    scores._stats.score = 0
    Object.keys(scores).forEach((activityType) => {
      if (!["trainings", "icebreakers", "debriefings", "_stats"].includes(activityType)) {
        scores._stats.score += scores[activityType]._stats.score
      }
    })
  }

  // console.dir(scores, { depth: null })
  return scores
}

const addStats = ({ source, destination, metrics, forEachChildren, playerRole }) => {
  !destination._stats && (destination._stats = initStatsObject(metrics))
  setMetrics({ metrics: source?._stats, scoreToSet: destination._stats, playerRole })
  Object.keys(source).forEach((childId) => {
    if (childId !== "_stats" && forEachChildren) {
      if (!destination[childId]) destination[childId] = {}
      forEachChildren(childId)
    }
  })
}

const initStatsObject = (metrics) => {
  const statsObject = {}
  metrics.forEach((metric) => {
    statsObject[metric] = { members: [], referees: [] }
  })
  return statsObject
}

const setMetrics = ({ scoreToSet, metrics, playerRole }) => {
  if (!metrics) return
  Object.keys(metrics).forEach((metric) => {
    // On ajoute les metrics au tableau de score  (ex QuestionSets : _stats {score : [4], count : [1]})
    const metricValue = metrics?.[metric]
    if (metricValue && scoreToSet[metric]) {
      // if(metric === 'score'){
      //   console.log('ON AJOUTE LE SCORE DU BISU',metricValue )
      //   scoreToSet[metric].push(metricValue)
      // }
      scoreToSet[metric][playerRole].push(metricValue)
    }
  })
}

const sumScoreObject = ({ scoreObject, playerCount, topPlayers }) => {
  const sum = ({ scoreObject, scoreType, parentType }) => {
    // console.log(scoreType) => null / questionSets / events /...
    Object.keys(scoreObject).forEach((childId) => {
      // console.log(childId) => questionSets / quiz1 / quiz 2 / events / event1 / event 2 /...
      if (childId !== "_stats") {
        const currentParentType = ["trainings", "contests", "events", "ideasBoxes", "debriefings"].includes(childId) ? childId : `${scoreType}`
        // console.dir(scoreObject[childId], { depth: null })

        sum({ scoreObject: scoreObject[childId], scoreType: childId, parentType: currentParentType })
        return
      }

      const statsObject = scoreObject._stats
      Object.keys(statsObject).forEach((metric) => {
        // console.log(metric) => score / progression / count

        const sumPerRole = statsObject[metric]

        const calculeTopPlayers = parentType === "contests" && metric === "score"
        let sumResult = getScoreFromSumCategories({ sumPerRole, topPlayers: calculeTopPlayers ? topPlayers : null })

        if (metric === "progression") {
          sumResult = sumResult / playerCount
        }
        statsObject[metric] = sumResult
      })
    })
  }
  sum({ scoreObject })
}

const getScoreFromSumCategories = ({ sumPerRole, topPlayers }) => {
  // const regularSum = getScoreFromSum({sumArray : sumPerRole.regular  })
  const membersSum = getScoreFromSum({ sumArray: sumPerRole.members, topLimit: topPlayers?.members })
  const refereesSum = getScoreFromSum({ sumArray: sumPerRole.referees, topLimit: topPlayers?.referees })
  return membersSum + refereesSum
}

const getScoreFromSum = ({ sumArray, topLimit }) => {
  if (sumArray.length <= 0) return 0
  if (topLimit) {
    sumArray.sort((a, b) => b - a)
    sumArray = sumArray.slice(0, topLimit)
  }
  return sumArray.reduce((a, b) => a + b)
}
