var UserModel = require('../models/user')
var LocationModel = require('../models/location')

function displayLocation (req, res, next) {
  var locationId = req.params.locationId
  LocationModel.findById(locationId, function (err, location) {
    if (err) return next(err)
    if (!location) res.redirect('/404')
    var message = req.session.message || null
    if (message) req.session.message = null
    res.render('location', {
      user: req.user,
      location: location,
      message: message,
      feature: JSON.stringify(location.toGeoJSON())
    })
  })
}

function contactUser (req, res, next) {
  var locationId = req.params.locationId
  var from = req.body.from
  var message = req.body.message
  LocationModel.findById(locationId, function (err, location) {
    if (err) return next(err)
    UserModel.findById(location.id, function (err, user) {
      if (err) return next(err)
      user.contact(from, message, function (err) {
        if (err) return next(err)
        req.session.message = {
          type: 'success',
          text: 'Your message was sent successfully!'
        }
        return res.redirect(req.url)
      })
    })
  })
}

module.exports = {
  displayLocation: displayLocation,
  contactUser: contactUser
}
