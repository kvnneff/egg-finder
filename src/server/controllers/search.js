var LocationModel = require('../models/location')
var geo = require('../utils/geocoder')

function index (req, res, next) {
  var message = req.session.message || null
  if (message) req.session.message = null
  var query = req.query.search
  geo.stringToGeo(query || 'Williams, OR', function (err, geoLocation) {
    if (err) return next(err)
    var latitude = geoLocation.geometry.coordinates[1]
    var longitude = geoLocation.geometry.coordinates[0]
    LocationModel.findWithinRadius(latitude, longitude, 100, function (err, collection) {
      var locations = collection.features.map(function (f) {
        return f.properties
      })
      if (err) return next(err)
      return res.render('search', {
        message: message,
        user: req.user,
        locations: locations,
        collection: JSON.stringify(collection)
      })
    })
  })
}

module.exports = {
  index: index
}
