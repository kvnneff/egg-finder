var Joi = require('joi')
var db = require('../db/locations')
var geo = require('../utils/geocoder')

var LocationSchema = Joi.object().keys({
  id: Joi.number().empty(null),
  user_id: Joi.number().required(),
  name: Joi.string().required(),
  available: Joi.boolean().required(),
  price: Joi.number().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipcode: Joi.number().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  isPublic: Joi.boolean().required(),
  description: Joi.string().empty(''),
  phone: Joi.string().length(14).empty(null),
  freeRange: Joi.boolean().required(),
  organic: Joi.boolean().required(),
  driveUp: Joi.boolean().required()
})

function toAddressString (attributes) {
  return [
    attributes.address,
    attributes.city,
    attributes.state,
    attributes.zipcode
  ].join(',')
}

function Location (data) {
  var id = data.id || null
  var userId = data.userId || data.user_id || null
  var name = data.name
  // Hack to convert to boolean
  var available = data.available === true ? true : (data.available === 'true')
  var price = data.price
  var address = data.address
  var city = data.city
  var state = data.state
  var zipcode = data.zipcode
  var latitude = data.latitude
  var longitude = data.longitude
  // Hack to convert to boolean
  var isPublic = data.isPublic === true ? true : (data.isPublic === 'true')
  var description = data.description
  var phone = data.phone
  var freeRange = data.freeRange === true ? true : (data.freeRange === 'true')
  var organic = data.organic === true ? true : (data.organic === 'true')
  var driveUp = data.driveUp === true ? true : (data.driveUp === 'true')

  function save (cb) {
    if (!latitude || !longitude) {
      var addressString = toAddressString(toJSON())
      geo.validateAddress(addressString, (err, result) => {
        if (err) return cb(err)
        longitude = result.geometry.coordinates[0]
        latitude = result.geometry.coordinates[1]
        validate(function (err) {
          if (err) return cb(err)
          db.save(toJSON(), function (err, result) {
            if (err) return cb(err)
            id = result
            return cb(null, result)
          })
        })
      })
      return
    }
    validate(function (err) {
      if (err) return cb(err)
      db.save(toJSON(), function (err, result) {
        if (err) return cb(err)
        id = result
        return cb(null, result)
      })
    })
  }

  function validate (cb) {
    Joi.validate(toJSON(), LocationSchema, function (err, user) {
      if (err) return cb(err)
      return cb(null, user)
    })
  }

  function remove (cb) {
    db.remove(id, function (err, result) {
      if (err) return cb(err)
      return cb(null, result)
    })
  }

  function toJSON () {
    return {
      id: id,
      user_id: userId,
      name: name,
      available: available,
      price: price,
      address: address,
      city: city,
      state: state,
      zipcode: zipcode,
      latitude: latitude,
      longitude: longitude,
      isPublic: isPublic,
      description: description,
      phone: phone,
      freeRange: freeRange,
      organic: organic,
      driveUp: driveUp
    }
  }

  function toGeoJSON () {
    return {
      type: 'Feature',
      id: id,
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      properties: {
        name: name,
        id: id,
        owner: userId,
        available: available,
        price: price,
        address: address,
        city: city,
        state: state,
        zipcode: zipcode,
        isPublic: isPublic,
        description: description,
        phone: phone,
        freeRange: freeRange,
        organic: organic,
        driveUp: driveUp
      }
    }
  }

  return {
    save: save,
    remove: remove,
    toJSON: toJSON,
    toGeoJSON: toGeoJSON,
    id: id,
    name: name,
    available: available,
    price: price,
    address: address,
    city: city,
    state: state,
    zipcode: zipcode,
    latitude: latitude,
    longitude: longitude,
    isPublic: isPublic,
    description: description,
    userId: userId,
    phone: phone,
    freeRange: freeRange,
    organic: organic,
    driveUp: driveUp
  }
}

Location.findById = function findById (id, cb) {
  db.findById(id, function (err, result) {
    if (err) return cb(err)
    return cb(null, Location(result))
  })
}

Location.findByUserId = function findByUserId (id, cb) {
  db.findByUserId(id, function (err, result) {
    if (err) return cb(err)
    if (result) result = Location(result)
    return cb(null, result)
  })
}

Location.findAll = function findAll (cb) {
  db.findAll(function (err, result) {
    if (err) return cb(err)
    return cb(null, result)
  })
}

Location.findRecent = function findRecent (count, cb) {
  db.findRecent(count, function (err, results) {
    if (err) return cb(err)
    var locations = {
      type: 'FeatureCollection',
      features: []
    }
    if (results && results.length) {
      results.forEach(function (result) {
        var geoJSON = Location(result).toGeoJSON()
        var markerColor = geoJSON.properties.available ? '#56b881' : '#ff0033'
        geoJSON.properties['marker-color'] = markerColor
        geoJSON.properties.title = geoJSON.properties.name
        locations.features.push(geoJSON)
      })
    }
    return cb(null, locations)
  })
}

Location.findWithinRadius = function findWithinRadius (latitude, longitude, radius, cb) {
  db.findWithinRadius(latitude, longitude, radius, function (err, results) {
    if (err) return cb(err)
    var locations = {
      type: 'FeatureCollection',
      features: []
    }
    if (results.length) {
      results.forEach(function (result) {
        var geoJSON = Location(result).toGeoJSON()
        var markerColor = geoJSON.properties.available ? '#56b881' : '#ff0033'
        geoJSON.properties['marker-color'] = markerColor
        geoJSON.properties.title = geoJSON.properties.name
        locations.features.push(geoJSON)
      })
    }
    return cb(null, locations)
  })
}

module.exports = Location
