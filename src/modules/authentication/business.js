function business({ db, validator, cryptojs, jwt }) {
  const {
    makeLogin,
  } = require('./entity')({ validator })

  const {
    findAccount,
  } = db

  const TOKEN_AGE_SECONDS = 3600 * 1
  const ENCRYPT_KEY = 'usa231hj3k3as928301dk2al'
  const JWT_TOKEN_SECRET = 'i32j1dsa7812da321klf2h32gf'

  return {
    /**
     * Create login token
     * @param {Object data 
     * @returns 
     */
    createLoginToken: async function (data) {
      const { email, password } = makeLogin(data)

      const account = await findAccount({ email })
      if (!account) throw { name: 'notFound' }

      const { name, role, password: accountPassword } = account

      if (password !== accountPassword) throw { name: 'invalidAccount' }

      const tokenPayload = JSON.stringify({ name, email, role })
      const encrypted = cryptojs.AES.encrypt(tokenPayload, ENCRYPT_KEY).toString()
      const token = jwt.sign({ data: encrypted }, JWT_TOKEN_SECRET, { expiresIn: TOKEN_AGE_SECONDS })

      const result = { name, email, role, token: { token, expiresIn: TOKEN_AGE_SECONDS } }

      return result
    },
  }
}

module.exports = business