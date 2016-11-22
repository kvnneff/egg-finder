const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const LocationModel = require('../models/location')()

const strategy = new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: '/callback'
}, (accessToken, refreshToken, extraParams, profile, done) => {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  return done(null, profile)
})

passport.use(strategy)

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser((user, done) => {
  LocationModel.find(user.id, (err, location) => {
    if (err) return done(err)
    return done(null, location)
  })
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

module.exports = strategy
