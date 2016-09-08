const errorhandler = require('errorhandler')
const compression = require('compression')
const bodyParser = require('body-parser')
const Express = require('express')
const http = require('http')
const path = require('path')
const browserify = require('browserify-middleware')
const serveStatic = require('serve-static')
const Emitter = require('component-emitter')
const massive = require('massive')
const LocationDB = require('./db/locations')

const db = massive.connectSync({
  connectionString: process.env.DB_URL,
  scripts: './src/server/db/queries'
})

LocationDB.init(db)

const middleware = require('./middleware')
const routes = require('./routes')

const development = process.env.NODE_ENV === 'development'
const port = process.env.PORT || 8080

const app = Express()
const server = http.Server(app)
server.emitter = new Emitter()
server.db = db

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(compression())
app.use(serveStatic(__dirname + '/../public', { 'index': ['index.html'] }))
app.use(routes(middleware))
app.use('/js', browserify(path.join(__dirname, '..', 'client/index.js'), {
  transform: [
    'envify',
    'yo-yoify',
    'sheetify/transform',
    'babelify'
  ],
  cache: false
}))

app.use('*', serveStatic(__dirname + '/../public', { 'index': ['index.html'] }))

if (development) {
  app.use(Express.logger('dev'))
  app.use(errorhandler())
} else {
  app.use(middleware.error)
}

/**
 * Init server
 * @return {undefined}
 */
server.listen(port, (err) => {
  if (err) console.error(err)
  server.emitter.emit('ready')
  console.info('----\n==> running on port %s', port)
})

module.exports = server
