const Geocoder = require('node-geocoder')
const geocoder = Geocoder('google', 'http')

const validateAddress = (addressString, cb) => {
  stringToGeo(addressString, function (err, geoLocation) {
    if (err) return cb(err)
    return cb(null, geoLocation)
  })
}

const geoMiddleware = (req, res, next) => {
  const query = req.query
  const body = req.body
  let string = null

  if (query && query.type) {
    if (query.type === 'name') {
      return next()
    }

    string = query.search_text
  }

  if (body) {
    string = `${body.street} ${body.city}, ${body.state} ${body.zipcode}`
  }

  stringToGeo(string, (err, res) => {
    if (err) return next(err)
    req.body.latitude = res.geometry.coordinates[1]
    req.body.longitude = res.geometry.coordinates[0]
    if (query) req.body.radius = req.query.radius
    return next()
  })
}

/**
 * Convert `addressString` to a geoJSON object
 * @param  {String}   addressString
 * @param  {Function} cb     Callback
 * @return {Object}
 */
const stringToGeo = (addressString, cb) => {
  if (!addressString || typeof addressString !== 'string') {
    return cb(new Error('Expected a string but got ', addressString))
  }

  geocoder.geocode(addressString, function (err, response) {
    if (err) return cb(err)
    if (!response.length) return cb(Error('Unable to locate that address.'))
    var geoLocation = response[0]
    var geoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          geoLocation.longitude,
          geoLocation.latitude
        ]
      },
      properties: {
        city: geoLocation.city,
        zipcode: geoLocation.zipcode,
        country: geoLocation.country,
        streetNumber: geoLocation.streetNumber,
        streetName: geoLocation.streetName
      }
    }
    return cb(null, geoJSON)
  })
}

module.exports = {
  validateAddress,
  stringToGeo,
  geoMiddleware
}
