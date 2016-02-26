var cookieParser = require('cookie-parser')
var errorhandler = require('errorhandler')
var compression = require('compression')
var session = require('express-session')
var bodyParser = require('body-parser')
var passport = require('passport')
var Express = require('express')
var debug = require('debug')
var http = require('http')
var path = require('path')
var hbs = require('hbs')
var pg = require('pg')

var UserModel = require('./models/user')
var middleware = require('./middleware')
var routes = require('./routes')

var development = process.env.NODE_ENV === 'development'
var sessionSecret = process.env.SESSION_SECRET
var port = process.env.PORT || 8080

var app = Express()
var server = http.Server(app)

hbs.registerPartials(__dirname + '/views/partials')
middleware.passport.setup(UserModel)
app.set('views', __dirname + '/views')
app.set('view engine', 'html')
app.engine('html', hbs.__express)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(compression())
app.use(session({
  store: new (require('connect-pg-simple')(session))(),
  pg: pg,
  secret: sessionSecret,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(Express.static(path.join(__dirname, '..', 'public')))
app.use(routes(middleware))

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
  if (err) debug(err)
  console.info('----\n==> running on port %s', port)
})

module.exports = app
