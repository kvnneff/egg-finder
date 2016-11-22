const errorhandler = require('errorhandler')
const compression = require('compression')
const bodyParser = require('body-parser')
const Express = require('express')
const http = require('http')
const path = require('path')
const browserify = require('browserify-middleware')
const Emitter = require('component-emitter')
const massive = require('massive')
const postcss = require('postcss-middleware')
const cssnext = require('postcss-cssnext')
const serveStatic = require('serve-static')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const LocationDB = require('./db/locations')

const db = massive.connectSync({
  connectionString: process.env.DATABASE_URL,
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

app.set('views', './src/server/views')
app.set('view engine', 'pug')
app.use(cookieParser())
app.use(session({
  store: new (require('connect-pg-simple')(session))(),
  secret: 'Q4p-BUSSu6XiVw_2KkIEWYyU07WN-MDt9djovyD9GboUdlpdGbREee4gcamvECPq',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(compression())
// app.use(serveStatic(__dirname + '/../public', { 'index': ['index.html'] }))
app.use('/css', postcss({
  src: (req) => {
    return 'src/public/css/styles.css'
  },
  plugins: [
    cssnext
  ]
}))

const redirects = {
  failureRedirect: '/404',
  successRedirect: '/profile'
}

app.get('/callback', passport.authenticate('auth0'), (req, res) => {
  req.session.save(() => {
    const user = req.session.passport.user
    res.redirect(`${redirects.successRedirect}/${user.attributes.farm_id}`)
  })
})

const servejs = (src) => {
  return browserify(path.join(__dirname, '..', `js/pages/${src}.js`), {
    transform: [
      'envify',
      'yo-yoify',
      'babelify'
    ],
    cache: false
  })
}

app.get('/js/home.js', servejs('home'))
app.get('/js/search.js', servejs('search'))
app.get('/js/farm.js', servejs('farm'))
app.get('/js/register.js', servejs('register'))
app.get('/js/signin.js', servejs('signin'))
app.use(routes(middleware))

app.use('/img', serveStatic(__dirname + '/../public/img'))

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

process.on('SIGTERM', () => {
  console.log('CLOSING')
  server.close()
  process.exit()
})

module.exports = server
