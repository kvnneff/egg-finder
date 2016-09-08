const Joi = require('joi')
const defaultDB = require('../db/locations')

const LocationSchema = Joi.object().keys({
  user_id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  available: Joi.boolean().required(),
  price: Joi.number().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipcode: Joi.number().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  is_public: Joi.boolean().required(),
  description: Joi.string().empty(''),
  phone: Joi.string().length(14).empty(null),
  free_range: Joi.boolean().required(),
  organic: Joi.boolean().required(),
  drive_up: Joi.boolean().required()
})

// function toAddressString (attributes) {
//   return [
//     attributes.address,
//     attributes.city,
//     attributes.state,
//     attributes.zipcode
//   ].join(',')
// }

const defaultState = {
  user_id: null,
  name: null,
  email: null,
  description: null,
  street: null,
  is_public: true,
  zipcode: null,
  state: null,
  city: null,
  available: true,
  price: null,
  latitude: null,
  longitude: null,
  free_range: false,
  organic: false,
  drive_up: false,
  created_at: null,
  updated_at: null
}

const LocationModel = (db = defaultDB) => {
  const Location = (data) => {
    const attributes = Object.assign({}, defaultState, data)

    const save = (cb) => {
      validate(function (err) {
        if (err) return cb(err)
        db.save(toJSON(), function (err, result) {
          if (err) return cb(err)
          Object.assign(attributes, result)
          return cb(null)
        })
      })
    }

    const validate = (cb) => {
      Joi.validate(toJSON(), LocationSchema, function (err, user) {
        if (err) return cb(err)
        return cb(null, user)
      })
    }

    const remove = (cb) => {
      db.remove(attributes.user_id, function (err, result) {
        if (err) return cb(err)
        return cb(null, result)
      })
    }

    const toJSON = () => {
      const {
        user_id,
        name,
        email,
        description,
        street,
        is_public,
        zipcode,
        state,
        city,
        available,
        price,
        latitude,
        longitude,
        free_range,
        organic,
        drive_up
      } = attributes

      return {
        user_id,
        name,
        email,
        description,
        street,
        is_public,
        zipcode,
        state,
        city,
        available,
        price,
        latitude,
        longitude,
        free_range,
        organic,
        drive_up
      }
    }

    const toGeoJSON = () => {
      return {
        type: 'Feature',
        id: attributes.user_id,
        geometry: {
          type: 'Point',
          coordinates: [
            attributes.longitude,
            attributes.latitude
          ]
        },
        properties: attributes
      }
    }

    return {
      save,
      remove,
      toJSON,
      toGeoJSON,
      attributes
    }
  }

  Location.db = db

  Location.find = (user_id, cb) => {
    db.find(user_id, (err, result) => {
      if (err) return cb(err)
      if (result) return cb(null, Location(result))
      return cb(null)
    })
  }

  Location.findRecent = (cb) => {
    db.findRecent((err, collection) => {
      if (err) return cb(err)
      return cb(null, collection)
    })
  }

  Location.findAll = (cb) => {
    db.findAll((err, result) => {
      if (err) return cb(err)
      return cb(null, result)
    })
  }

  Location.findWithinRadius = (latitude, longitude, radius, cb) => {
    db.findWithinRadius(latitude, longitude, radius, (err, results) => {
      if (err) return cb(err)
      const locations = {
        type: 'FeatureCollection',
        features: []
      }

      if (results.length) {
        results.forEach(function (result) {
          const geoJSON = Location(result).toGeoJSON()
          const markerColor = geoJSON.properties.available ? '#56b881' : '#ff0033'
          geoJSON.properties['marker-color'] = markerColor
          geoJSON.properties.title = geoJSON.properties.name
          locations.features.push(geoJSON)
        })
      }
      return cb(null, locations)
    })
  }

  Location.findByName = (name, cb) => {
    db.findByName(name, (err, results) => {
      if (err) return cb(err)

      const locations = {
        type: 'FeatureCollection',
        features: []
      }

      results.forEach((result) => {
        const geoJSON = Location(result).toGeoJSON()
        const markerColor = geoJSON.properties.available ? '#56b881' : '#ff0033'
        geoJSON.properties['marker-color'] = markerColor
        geoJSON.properties.title = geoJSON.properties.name
        locations.features.push(geoJSON)
      })

      return cb(null, locations)
    })
  }

  return Location
}

module.exports = LocationModel
