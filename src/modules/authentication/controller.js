function controller({ responseFormatter, Account, cryptojs, jwt, validator }) {

  const db = require('./db')({ Account })

  const {
    createLoginToken,
  } = require('./business')({ cryptojs, db, jwt, validator })

  function handleExceptions(err) {
    let message, details, code

    switch (err.name) {
      case 'CastError':
        code = 400
        message = 'Bad or missing _id'
        break
      case 'dataValidationError':
        message = 'Data validation error(s).'
        code = 422
        details = err.details
        break
      case 'notFound':
        message = 'Not found'
        code = 400
        break
      case 'invalidAccount':
        message = 'Invalid account'
        code = 400
        break
      case 'ValidationError':
        console.log(err)
        message = 'Error in server validation'
        code = 500
        break
      case 'invalidArgs':
        console.log(err)
        message = 'Error in server args'
        code = 500
        break
      default:
        code = 500
        console.log(err)
        break
    }

    return { message, details, code }
  }

  return {
    /**
     * login
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    login: async function (req, res) {
      let successResult, successMessage, failureMessage = null, failureResult, status = 200

      try {
        successResult = await createLoginToken(req.body)
      } catch (err) {
        ({ message: failureMessage, details: failureResult, code: status } = handleExceptions(err))
      }

      return res.status(status).json(responseFormatter({ status, successMessage, successResult, failureMessage, failureResult }))
    },
  }
}

module.exports = controller
