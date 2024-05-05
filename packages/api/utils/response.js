
const ERROR_CODES = require('../constants/errorCodes');


const errorResponse = (error = {code : "no-code", message : "no message"}) => {
  return {
    error: error || {
      code : ERROR_CODES.UNDEFINED,
      message : "Erreur undefined"
    },
    success : false
  }
}

const successResponse = (data = {}) => {
  return {
    ...data,
    success:true
  }
}


module.exports = {
  errorResponse,
  successResponse
}