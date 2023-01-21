/**
 * 
 * @param {Object} successResult 
 * @param {String} failureMessage 
 * @param {Object} failureResult 
 * @returns object for response
 */
function responseFormatter({ status = 0, successMessage = null, successResult = null, failureMessage = null, failureResult = [], ...args }) {
  if (Object.keys(args).length) throw { name: 'invalidArgs' }

  return {
    status,
    successMessage,
    successResult,
    failureMessage,
    failureResult,
  }
}

module.exports = responseFormatter