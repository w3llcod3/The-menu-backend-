function routes({ responseFormatter, Account, cryptojs, jwt, validator }) {
  const router = require('express').Router()
  const {
    login
  } = require('./controller')({ responseFormatter, Account, cryptojs, jwt, validator })

  router.post('/api/auth/v1', login)

  return router
}

module.exports = routes