const express = require('express')
const LocationController = require('../controllers/location')
const geo = require('../utils/geocoder')

const routes = (middleware) => {
  const sanitize = middleware.sanitize
  const router = express.Router()

  router.post('/api/v1/location', middleware.authRequired, sanitize, geo.geoMiddleware, LocationController.create)
  router.get('/api/v1/location/recent', LocationController.getRecent)
  router.get('/api/v1/location/search', geo.geoMiddleware, LocationController.search)
  router.get('/api/v1/location/:user_id', LocationController.get)
  router.delete('/api/v1/location/:user_id', middleware.auth, LocationController.destroy)

  router.post('/api/v1/geocode', middleware.auth, (req, res, next) => {
    const body = req.body
    const addressString = body.address

    geo.validateAddress(addressString, (err, result) => {
      if (err) return next(err)
      return res.send({ result })
    })
  })

  return router
}

module.exports = routes
