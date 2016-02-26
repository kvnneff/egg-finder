var Failure = require('failure')
var passport = require('passport')
var LocalStrategy = require('passport-local')

function signInStrategy (UserModel) {
  return new LocalStrategy({
    usernameField: 'email'
  }, function (email, password, done) {
    UserModel.findByEmail(email, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(Failure('Invalid username or password.', {
          type: 'StatusError',
          status: 400
        }))
      }
      user.matchPassword(password, function (err, res) {
        if (err) return done(err)
        if (!res) {
          return done(Failure('Invalid username or password.', {
            type: 'StatusError',
            status: 400
          }))
        }
        return done(null, user)
      })
    })
  })
}

function setupPassport (UserModel) {
  passport.use(signInStrategy(UserModel))

  passport.serializeUser(function (user, done) {
    return done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    return done(null, user)
  })
}

function authenticate (req, res, next) {
  if (req.isAuthenticated()) return next()
  req.session.error = 'Please sign in!'
  res.redirect('/')
}

module.exports = {
  setup: setupPassport,
  initialize: passport.initialize,
  session: passport.session,
  authenticate: authenticate,
  localSignIn: passport.authenticate('local')
}
