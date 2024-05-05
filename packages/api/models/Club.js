const admin = require('firebase-admin')
const FirebaseObject = require('./FirebaseObject')
const db = admin.firestore()

module.exports = class Club extends FirebaseObject  {
  static collectionPath () { return 'clubs' }
  collectionPath () { return 'clubs' }

  constructor (state) {
    super(state)
  }

  // static create = async ({id}, data) => {
  //   let ref = db.collection("clubs").doc(id)
  //   return ref.set(data)
  // }

  // static delete = async ({clubId}) => {
  //   let ref = db.collection("clubs").doc(clubId)
  //   return ref.delete()
  // }

  // static fetch = async ({clubId}) => {
  //   let teamsRef = db.collection("clubs").doc(clubId)
  //   const team = await FirebaseObject.fetchRef(teamsRef)
  //   return team
  // }

  static fetchByProperty = async ({ propertyKey, propertyValue, returnFirstElem = true}) => {
    return await FirebaseObject.fetchByProperty({
      collectionKey : 'clubs', 
      propertyKey , 
      propertyValue, 
      returnFirstElem})
  }
}

