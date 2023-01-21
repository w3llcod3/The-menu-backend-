function routes({ verifyToken, responseFormatter, MenuNode, validator }) {
  const router = require('express').Router()
  const {
    createNode,
    updateNode,
    deleteNode,
    getNodes,
  } = require('./controller')({ responseFormatter, MenuNode, validator })

  router.get('/api/menu/v1', verifyToken(['admin', 'user']), getNodes)
  router.post('/api/menu/v1', verifyToken(['admin']), createNode)
  router.patch('/api/menu/v1', verifyToken(['admin']), updateNode)
  router.delete('/api/menu/v1', verifyToken(['admin']), deleteNode)

  return router
}

module.exports = routes