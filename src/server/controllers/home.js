var LocationModel = require('../models/location')

function index (req, res, next) {
  LocationModel.findRecent(50, function (err, collection) {
    if (err) return next(err)
    var locations = null
    if (collection) {
      locations = collection.features.map(function (f) {
        return f.properties
      })
    }
    return res.render('index', {
      user: req.user,
      locations: locations
    })
  })
}

module.exports = {
  index: index
}
