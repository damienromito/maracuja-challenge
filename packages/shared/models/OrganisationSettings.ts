
import FirebaseObject from './FirebaseObject'


interface OrganisationSettings {
  AIGenerator: boolean
}
class OrganisationSettings extends FirebaseObject {
  static collectionPath({ organisationId }) { return `organisations/${organisationId}/settings` }
  collectionPath() { return `organisations/${this.organisationId}/settings` }
}

export default OrganisationSettings
