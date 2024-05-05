const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const { PLAYER_ROLES } = require('../../constants/')

const addContactInList = async ({ listId, player, transactionalOnly }) => {
  const mailjet = initMailjet()

  const params = {
    Action: 'addnoforce',
    Name: player.username, // username
    Email: player.email,
    Properties: {
      username: player.username,
      firstname: player.firstName,
      lastname: player.lastName,
      captain: player.roles?.includes(PLAYER_ROLES.CAPTAIN),
      referee: player.roles?.includes(PLAYER_ROLES.REFEREE),
      platform: player.platform,
      clubname: player.club.name,
      transactionalOnly: transactionalOnly
    }
  }

  try {
    const result = await mailjet
      .post('contactslist', { version: 'v3' })
      .id(listId)
      .action('managecontact')
      .request(params)
    return result.body.Data[0].ContactID
  } catch (error) {
    info('Error adding contact to mailjet:', error)
    return null
  }
}

const initMailjet = () => {
  const mailjetApiKey = MAILJET_API_KEY
  const mailjetSecretKey = MAILJET_SECRET_KEY
  const mailjet = require('node-mailjet').connect(mailjetApiKey, mailjetSecretKey)
  return mailjet
}

const createMailjetList = async ({ listName }) => {
  // CREATE MAILJET LIST
  const mailjet = initMailjet()
  // const listName = `[${organisationsIds[0]}] ${name}`
  const result = await mailjet.post('contactslist', { version: 'v3' }).request({ Name: listName })
  const mailjetListId = result.body.Data[0].ID
  // const mailjetListId = 138960
  return mailjetListId
}

module.exports = {
  initMailjet,
  addContactInList,
  createMailjetList
}
