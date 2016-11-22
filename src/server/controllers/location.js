const LocationModel = require('../models/location')
const Location = LocationModel()

const postCreateForm = (req, res, next) => {
  const data = req.body

  data.user_id = req.user.id
  const location = Location(data)
  location.save((err) => {
    if (err) return next(err)
    const farm_id = location.attributes.farm_id
    req.session.message = 'Your farm profile was created successfully!'
    return res.redirect(`/farm/${farm_id}`)
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

const showUser = (req, res, next) => {
  const farm_id = req.params.farm_id
  console.log(farm_id)
  const user = req.user
  Location.findFarm(farm_id, (err, location) => {
    if (err) return next(err)
    console.log(location)
    if (location) return res.render('user', { user, farm: location.toJSON() })
    return res.render('user', { user, farm: null })
  })
}

const showCreateForm = (req, res, next) => {
  const user = req.user
  const farm = Location().toJSON()
  return res.render('create', { user, farm })
}

const showRegister = (req, res, next) => {
  const user = req.user
  return res.render('register', { user })
}

const showSignIn = (req, res, next) => {
  const user = req.user
  return res.render('signin', { user })
}

const getFarm = (req, res, next) => {
  const user = req.user
  const farm_id = req.params.farm_id
  Location.findFarm(farm_id, (err, location) => {
    if (err) return next(err)
    if (!location) return res.render('farm', { user, message: 'No location found' })

    const data = {
      user,
      message: null,
      farm: location.toGeoJSON()
    }

    if (req.session.message) {
      data.message = req.session.message
    }

    return res.render('farm', data)

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
  if (req.query.type === 'address') return findWithinRadius(req, res, next)
}

const findWithinRadius = (req, res, next) => {
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  const radius = req.body.radius || 50
  Location.findWithinRadius(latitude, longitude, radius, (err, farms) => {
    if (err) return next(err)
    return res.render('search', { farms, query: req.query })
  })
}

const findByName = (req, res, next) => {
  const name = req.query.search_text
  Location.findByName(name, (err, farms) => {
    if (err) return next(err)
    return res.render('search', { farms, query: req.query })
  })
}

module.exports = {
  search,
  postCreateForm,
  destroy,
  get,
  getFarm,
  getRecent,
  findWithinRadius,
  findByName,
  showUser,
  showCreateForm,
  showSignIn,
  showRegister
}
