var LocationModel = require('../models/location')
var geo = require('../utils/geocoder')

function displayProfile (req, res, next) {
  var id = req.user.id
  LocationModel.findByUserId(id, function (err, result) {
    if (err) return next(err)
    return res.render('profile', { user: req.user, profile: result })
  })
}

function saveProfile (req, res, next) {
  var body = req.body
  var addressString = [body.address, body.city, body.state, body.zipcode].join(',')
  geo.validateAddress(addressString, function (err, result) {
    if (err) return next(err)
    req.body.longitude = result.geometry.coordinates[0]
    req.body.latitude = result.geometry.coordinates[1]
    req.body.userId = req.user.id
    var location = LocationModel(req.body)
    location.save(function (err, result) {
      if (err) return next(err)
      return res.redirect('/profile')
    })
  })
}

module.exports = {
  displayProfile: displayProfile,
  saveProfile: saveProfile
}
