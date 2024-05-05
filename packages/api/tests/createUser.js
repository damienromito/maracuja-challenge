const admin = require('firebase-admin')
const assert = require('chai').assert
const test = require('./helpers/configuration').getTester()
const maracujaFunctions = require('../index')
const { User } = require('../models')

const playerId = '108F8FYFHUFH28dF'
const email = 'toto@maracuja.ac'

describe('User creation', () => {
  it('User creation should be successful', async () => {
    const createUser = test.wrap(maracujaFunctions.apiUsersCreate)
    const result = await createUser({
      email: email,
      password: 'azertu',
      userId: playerId,
      username: 'toto'
    })
    assert.isTrue(result.success)
  })

  it('User should be created', async () => {
    const u = await User.fetch({ id: playerId })
    assert.equal(u.email, email)
  })

  after(() => {
    admin.auth().deleteUser(playerId)
  })
})
