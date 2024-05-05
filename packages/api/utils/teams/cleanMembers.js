
const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const db = admin.firestore()
const { Team } = require('../../models')

const fieldValue = admin.firestore.FieldValue

exports = module.exports = async ({ challengeId }) => { // TO CREATE TYPE FOR WARMUP
  // const team = await Team.fetch({challengeId, teamId:"equipe9edf2021_edf"})
  const teams = await Team.fetchAll({ challengeId })

  const promises = teams.map(team => {
    const players = team.players
    const members = team.members
    const newTeam = {}
    Object.keys(members).forEach(memberKey => {
      console.log('memberKey:', memberKey)
      if (players[memberKey]) {
        newTeam[`members.${memberKey}`] = fieldValue.delete()
      }
    })
    console.log('newTeam:', newTeam)
    return Team.update({ challengeId, id: team.id }, newTeam)
  })

  const result = await Promise.all(promises)
}
