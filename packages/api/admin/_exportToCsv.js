/*********WARNING*************/
//NE PAS EXPOSER EN PRODUCTION//
/*********WARNING*************/

const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin');
const { USER_ROLES } = require('../constants');
const { exportToCsv } = require('../utils/dbExport');
const { authOnCall } = require('../utils/functions');



const runtime = {
  timeoutSeconds: 540, 
  memory: '2GB' 
} 

exports = module.exports = authOnCall({role : USER_ROLES.SUPER_ADMIN, runtime}, async (data, context) => {
  // const {challengeId, collection, role, where, limit, playerIds, linePerArrayObject, objectFields} = data
 
    return await exportToCsv(data) 
})

