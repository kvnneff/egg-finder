const LocationModel = require('../models/location')
const Location = LocationModel()

const create = (req, res, next) => {
  const data = req.body
  data.user_id = req.user.sub
  const location = Location(data)
  location.save((err) => {
    if (err) return next(err)
    const result = {
      location: location.attributes
    }
    return res.send(result)
  })
}

const get = (req, res, next) => {
  const user_id = req.params.user_id
  Location.find(user_id, (err, location) => {
    if (err) return next(err)
    if (location) return res.send(location)
    return res.status(404).send({ message: 'No location found' })
  })
}

const destroy = (req, res, next) => {
  const location_id = req.params.user_id
  const user_id = req.user.user_id
  if (user_id !== location_id) {
    return next(new Error('You are not the owner of this resource'))
  }
  Location.find(location_id, (err, location) => {
    if (err) return next(err)
    location.remove((err) => {
      if (err) return next(err)
      return res.sendStatus(200)
    })
  })
}

const getRecent = (req, res, next) => {
  Location.findRecent((err, collection) => {
    if (err) return next(err)
    return res.send({ collection })
  })
}

const search = (req, res, next) => {
  if (req.query.type === 'name') return findByName(req, res, next)
  if (req.query.type === 'location') return findWithinRadius(req, res, next)
}

const findWithinRadius = (req, res, next) => {
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  const radius = req.body.radius

  Location.findWithinRadius(latitude, longitude, radius, (err, collection) => {
    if (err) return next(err)
    return res.send({ collection })
  })
}

const findByName = (req, res, next) => {
  const name = req.query.query
  Location.findByName(name, (err, collection) => {
    if (err) return next(err)
    return res.send({ collection })
  })
}

module.exports = {
  search,
  create,
  destroy,
  get,
  getRecent,
  findWithinRadius,
  findByName
}
