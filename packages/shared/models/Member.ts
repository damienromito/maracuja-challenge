import { callApi } from '../helpers'
import EntityWithRoles from './EntityWithRoles'

class Member extends EntityWithRoles {
  constructor(props) {
    super(props)
    Object.assign(this, props)
  }

  static async getContact({ challengeId, memberId }) {
    return await callApi('apiMembersGetContact', { challengeId, memberId })
  }
}

export default Member
