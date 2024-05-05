const { objectsFromSnap } = require("./");
const admin = require('firebase-admin')

const db = admin.firestore()


const getTeams = async (challengeId) => {
  const teamsRef = db.collection("challenges").doc(challengeId).collection('teams')

  let teamsSnaps
  try {
    teamsSnaps = await teamsRef.get()
  }catch (err) {
    error('Error getting documents', err);
  }

  return objectsFromSnap(teamsSnaps)
}

const updateTeam = (challengeId, teamId, data) => {
  let teamRef = db.collection('challenges').doc(challengeId).collection('teams').doc(teamId)
  return teamRef.update(data)
}

module.exports = {
  getTeams,
  updateTeam
}