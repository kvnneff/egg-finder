var Geocoder = require('node-geocoder')
var geocoder = Geocoder('google', 'http')

function validateAddress (addressString, cb) {
  stringToGeo(addressString, function (err, geoLocation) {
    if (err) return cb(err)
    return cb(null, geoLocation)
  })
}

/**
 * Convert `addressString` to a geoJSON object
 * @param  {String}   addressString
 * @param  {Function} cb     Callback
 * @return {Object}
 */
function stringToGeo (addressString, cb) {
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
  validateAddress: validateAddress,
  stringToGeo: stringToGeo
}
