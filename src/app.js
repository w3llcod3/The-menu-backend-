require('dotenv/config')

/** Dependencies */
const express = require('express')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const validator = require('joi')
const responseFormatter = require('./utils/responseFormatter')
const { queryParser } = require('express-query-parser')
const cryptojs = require('crypto-js')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const helmet = require('helmet')
const { verifyToken } = require('./middle-ware/token')({ responseFormatter, cryptojs, jwt })

/** Models */
const { Account } = require('./modules/authentication/model')({ mongoose })
const { MenuNode } = require('./modules/menu/model')({ mongoose })

/** App */
const app = express()
app.use(express.json())
app.use(queryParser({
  parseNull: true,
  parseUndefined: true,
  parseBoolean: true,
  parseNumber: true
}))

app.use(cors())
app.use(helmet())
app.use(require('./modules/authentication')({ responseFormatter, Account, cryptojs, jwt, validator }))
app.use(require('./modules/menu')({ verifyToken, responseFormatter, MenuNode, validator }))

module.exports = {
  app,
  rateLimit,
  mongoose,
}