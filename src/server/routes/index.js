const express = require('express')
const LocationController = require('../controllers/location')
const geo = require('../utils/geocoder')

const routes = (middleware) => {
  const sanitize = middleware.sanitize
  const authRequired = middleware.authRequired
  const router = express.Router()

  router.get('/', (req, res, next) => {
    return res.render('index', {
      user: req.user,
      query: {
        type: 'address',
        organic: false,
        free_range: false,
        search_text: ''
      }
    })
  })

  router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      if (err) return next(err)
      return res.redirect('/')
    })
  })

  const ensureAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.redirect('/signin')
    }
    return next()
  }

  router.get('/register', LocationController.showRegister)
  router.get('/search', geo.geoMiddleware, LocationController.search)
  router.get('/farm/:farm_id', LocationController.getFarm)
  router.get('/profile/:farm_id', LocationController.showUser)
  router.get('/create', LocationController.showCreateForm)
  router.post('/create', ensureAuthenticated, sanitize, geo.geoMiddleware, LocationController.postCreateForm)
  router.get('/signin', LocationController.showSignIn)

//  router.post('/api/v1/location', middleware.authRequired, sanitize, geo.geoMiddleware, LocationController.create)
  router.get('/api/v1/location/recent', LocationController.getRecent)
  router.get('/api/v1/location/search', geo.geoMiddleware, LocationController.search)
  router.get('/api/v1/location/:user_id', LocationController.get)
  router.delete('/api/v1/location/:user_id', middleware.auth, LocationController.destroy)
  router.get('/api/v1/farm/:farm_id', LocationController.getFarm)
  router.get('/api/v1/geocode', middleware.auth, (req, res, next) => {
    const query = req.query
    const addressString = query.search_text
    geo.validateAddress(addressString, (err, result) => {
      if (err) return next(err)
      return res.send({ result })
    })
  })

  return router
}

module.exports = routes
