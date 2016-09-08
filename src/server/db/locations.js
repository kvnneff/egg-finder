// var sortBy = require('sort-by')
let db = null

const init = (dbInstance) => {
  db = dbInstance
}

// function metersToMiles (meters) {
//   return meters * 0.000621371192
// }

function milesToMeters (miles) {
  return miles * 1609.344
}

/**
 * Save to the database and return the location id.
 * @param  {Object}   location
 * @param  {Function} cb
 * @return {Number}
 */
const save = (location, cb) => {
  const values = [
    location.user_id,
    location.name,
    location.email,
    location.description,
    location.street,
    location.city,
    location.state,
    location.zipcode,
    location.is_public,
    location.available,
    location.price,
    location.drive_up,
    location.free_range,
    location.organic,
    location.latitude,
    location.longitude
  ]
  db.upsertLocation(values, function (err, results) {
    if (err) return cb(err)
    return cb(null, results[0])
  })
}

/**
 * Remove a location from the database
 * @param  {[type]}   id [description]
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
function remove (user_id, cb) {
  db.locations.destroy({ user_id }, function (err, results) {
    if (err) return cb(err)
    return cb(null, results)
  })
}

/**
 * Find a single location with `id`
 * @param  {Number|String}   id
 * @param  {Function} cb
 * @return {Object}
 */
const find = (user_id, cb) => {
  db.locations.find({ user_id }, function (err, results) {
    if (err) return cb(err)
    return cb(null, results[0] ? results[0] : null)
  })
}

const findWithinRadius = (latitude, longitude, radius, cb) => {
  var values = [latitude, longitude, milesToMeters(radius)]
  db.findWithinRadius(values, function (err, results) {
    if (err) return cb(err)
    const rows = results.length ? results : []
    return cb(null, rows)
  })
}

const findRecent = (cb) => {
  db.locations.find({}, { limit: 20, order: 'created_at' }, (err, collection) => {
    if (err) return cb(err)
    return cb(null, collection)
  })
}

const findByName = (name, cb) => {
  db.findByName([name], (err, results) => {
    if (err) return cb(err)
    const rows = results.length ? results : []
    return cb(null, rows)
  })
}

module.exports = {
  findWithinRadius,
  findByName,
  findRecent,
  find,
  remove,
  save,
  init
}
