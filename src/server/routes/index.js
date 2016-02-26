var express = require('express')
var UserController = require('../controllers/user')
var HomeController = require('../controllers/home')
var LocationController = require('../controllers/location')
var ProfileController = require('../controllers/profile')
var SearchController = require('../controllers/search')

module.exports = function frontendRoutes (middleware) {
  var sanitize = middleware.sanitize
  var passport = middleware.passport
  var router = express.Router()

  router.get('/', HomeController.index)

  router.get('/search', SearchController.index)

  router.get('/profile', ProfileController.displayProfile)
  router.post('/profile', passport.authenticate, sanitize, ProfileController.saveProfile)

  router.get('/location/:locationId', LocationController.displayLocation)
  router.post('/location/:locationId', passport.authenticate, LocationController.contactUser)

  router.get('/login', UserController.displayLogin)
  router.post('/login', middleware.passport.localSignIn, UserController.signIn)
  router.get('/logout', UserController.logout)
  router.get('/signup', UserController.displaySignUp)
  router.post('/signup', UserController.register)
  router.get('/reset-password', UserController.displayPasswordReset)
  router.post('/reset-password', UserController.resetPassword)
  router.get('/new-password', UserController.displayNewPassword)
  router.get('/validate-email', UserController.displayValidateEmail)
  router.post('/new-password', UserController.handleNewPassword)
  router.get('/verify', UserController.verify)

  return router
}
