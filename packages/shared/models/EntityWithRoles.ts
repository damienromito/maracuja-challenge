import FirebaseObject from './FirebaseObject'
class EntityWithRoles extends FirebaseObject {
  hasRole (role) {
    return this.hasRoles([role])
  }

  hasRoles (roles) {
    return roles.some(role => this.roles?.includes(role))
  }
}

export default EntityWithRoles
