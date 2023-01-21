require('dotenv/config')

/** ENV vars */
const {
  PORT,
  DB_CONNECTION,
  SERVER_TIMEOUT_S,
  NODE_ENV,
  MAX_REQUEST,
} = process.env

/** Dependencies */
const { 
  app,
  rateLimit,
  mongoose,
} = require('./src/app')

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: Number(MAX_REQUEST),
  standardHeaders: false,
  legacyHeaders: false,
})

app.use(limiter)
if (NODE_ENV !== undefined) app.set('trust proxy', 1)

/** Database */
mongoose.set('strictQuery', true)

mongoose
  .connect(DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to db')

    const server = app.listen(PORT, () => console.log('Server is up at', PORT))
    server.setTimeout(Number(SERVER_TIMEOUT_S) * 1000)
  })
  .catch((err) => {
    if (err.code === 'ETIMEOUT') console.log('DB connection timeout.')
    else if (typeof err === mongoose.Error.MongooseServerSelectionError) console.log('Could not connect to any servers in your MongoDB Atlas cluster ..')
    else console.log('Error (DB connection):', err)
  })

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Disconnected from db')
    process.exit(0)
  })
})