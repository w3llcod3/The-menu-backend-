function controller({ responseFormatter, MenuNode, validator }) {

  const db = require('./db')({ MenuNode })
  const {
    createNoe,
    updateNode,
    deleteNode,
    getNodes,
  } = require('./business')({ validator, db })

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
      case 'invalidParent':
        message = 'Invalid parent'
        code = 400
        break
      case 'notFound':
        message = 'Not found'
        code = 400
        break
      case 'deleteChildrenFirst':
        message = 'Delete children first'
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
     * Create node
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    createNode: async function (req, res) {
      let successResult, successMessage, failureMessage = null, failureResult, status = 201

      try {
        successResult = await createNoe(req.body)
        successMessage = 'Created'
      } catch (err) {
        ({ message: failureMessage, details: failureResult, code: status } = handleExceptions(err))
      }

      return res.status(status).json(responseFormatter({ status, successMessage, successResult, failureMessage, failureResult }))
    },

    /**
     * Update node
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    updateNode: async function (req, res) {
      let successResult, successMessage, failureMessage = null, failureResult, status = 200

      try {
        successResult = await updateNode({ ...req.body })
        successMessage = 'Updated'
      } catch (err) {
        ({ message: failureMessage, details: failureResult, code: status } = handleExceptions(err))
      }

      return res.status(status).json(responseFormatter({ status, successMessage, successResult, failureMessage, failureResult }))
    },

    /**
     * Delete node
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    deleteNode: async function (req, res) {
      let successResult, successMessage, failureMessage = null, failureResult, status = 200

      try {
        successResult = await deleteNode(req.query)
        successMessage = 'Deleted'
      } catch (err) {
        ({ message: failureMessage, details: failureResult, code: status } = handleExceptions(err))
      }

      return res.status(status).json(responseFormatter({ status, successMessage, successResult, failureMessage, failureResult }))
    },

    /**
     * Get nodes
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    getNodes: async function (req, res) {
      let successResult, failureMessage = null, failureResult, status = 200

      try {
        successResult = await getNodes(req.query)
      } catch (err) {
        ({ message: failureMessage, details: failureResult, code: status } = handleExceptions(err))
      }

      return res.status(status).json(responseFormatter({ status, successResult, failureMessage, failureResult }))
    },
  }
}

module.exports = controller
