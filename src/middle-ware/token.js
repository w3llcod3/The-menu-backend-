function middleware({ responseFormatter, cryptojs, jwt }) {
  const ENCRYPT_KEY = 'usa231hj3k3as928301dk2al'
  const JWT_TOKEN_SECRET = 'i32j1dsa7812da321klf2h32gf'

  return {
    /**
     * Verify token
     * @param {Object []} roles 
     * @returns 
     */
    verifyToken: function (roles) {
      return function (req, res, next) {
        const authHeader = req.header('Authorization')

        if (!authHeader) return res.status(400).json(responseFormatter({ status: 400, failureMessage: 'missing auth token' }))

        const parts = authHeader.split(' ')
        if (parts.length !== 2) return res.status(422).json(responseFormatter({ status: 422, failureMessage: 'invalid token' }))

        try {
          const decoded = jwt.verify(parts[1], JWT_TOKEN_SECRET)

          const bytes = cryptojs.AES.decrypt(decoded.data, ENCRYPT_KEY)
          const decryptedData = JSON.parse(bytes.toString(cryptojs.enc.Utf8))

          req.account = decryptedData
          if (!roles.includes(decryptedData.role)) return res.status(403).json(responseFormatter({ status: 403, failureMessage: 'forbidden' }))

        } catch (error) {
          if (['TokenExpiredError'].includes(error.name))
            return res.status(400).json(responseFormatter({ status: 400, failureMessage: error.message }))

          else if (['JsonWebTokenError', 'NotBeforeError'].includes(error.name))
            return res.status(400).json(responseFormatter({ status: 400, failureMessage: error.message }))

          console.log('error verifyToken', error)
          return res.status(400).json(responseFormatter({ status: 400, failureMessage: 'error' }))
        }

        next()
      }
    }
  }
}

module.exports = middleware