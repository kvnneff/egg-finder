// var sortBy = require('sort-by')
var db = require('./db')
var camel = require('camelcase')

// var UPSERT_LOCATION = 'INSERT INTO locations (uid, address1, address2, public, zipcode, state, city, available, price, latitude, longitude, geom) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, ST_SetSRID(ST_MakePoint($10, $11), 4326)) ON CONFLICT (uid) DO UPDATE SET address1=$2, address2=$3, public=$4, zipcode=$5, state=$6, city=$7, available=$8, price=$9, latitude=$10, longitude=$11, geom=ST_SetSRID(ST_MakePoint($10, $11), 4326) RETURNING id'
var REMOVE_USER = 'DELETE FROM locations WHERE id=$1'
var FIND_BY_ID = 'SELECT * FROM locations WHERE id=$1'
var FIND_RECENT = 'SELECT * FROM locations ORDER BY created_at LIMIT $1'
var FIND_BY_USER_ID = 'SELECT * FROM locations WHERE user_id=$1'
var REMOVE_ALL = 'DELETE FROM locations'
var UPDATE_LOCATION = 'UPDATE locations SET name=$2, address=$3, is_public=$4, zipcode=$5, state=$6, city=$7, available=$8, price=$9, latitude=$10, longitude=$11, geom=ST_SetSRID(ST_MakePoint($10, $11), 4326), description=$12, phone=$13, free_range=$14, organic=$15, drive_up=$16 WHERE id=$1 RETURNING id'
var INSERT_LOCATION = 'INSERT INTO locations (user_id, name, address, is_public, zipcode, state, city, available, price, latitude, longitude, geom, description, phone, free_range, organic, drive_up) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, ST_SetSRID(ST_MakePoint($10, $11), 4326), $12, $13, $14, $15, $16) RETURNING id'
var FIND_WITHIN_RADIUS = 'SELECT * FROM locations WHERE ST_DWithin(geography(geom), ST_SetSRID(ST_MakePoint($1, $2), 4326), $3) AND is_public=true'

// function metersToMiles (meters) {
//   return meters * 0.000621371192
// }

function milesToMeters (miles) {
  return miles * 1609.344
}

function fixCase (obj) {
  if (obj.constructor === Array) {
    var newArray = []
    obj.forEach(function (o) {
      newArray.push(fixObj(o))
    })
    return newArray
  }
  return fixObj(obj)

  function fixObj (o) {
    var newObj = {}
    Object.keys(o).forEach(function (key) {
      var newKey = camel(key)
      newObj[newKey] = o[key]
    })
    return newObj
  }
}

/**
 * Save to the database and return the user id.
 * @param  {Object}   location
 * @param  {Function} cb
 * @return {Number}
 */
// function save (location, cb) {
//   var query = UPSERT_LOCATION
//   var values = [
//     location.authID,
//     location.address1,
//     location.address2,
//     location.public,
//     location.zipcode,
//     location.state,
//     location.city,
//     location.available,
//     location.price,
//     location.latitude,
//     location.longitude
//   ]
//
//   db.query(query, values, function (err, results) {
//     if (err) return cb(err)
//     if (results.rows.length) {
//       results = results.rows[0].id
//     }
//     return cb(null, results)
//   })
// }

/**
 * We can't use upsert until Dokku supports Postgres 9.5 + PostGIS
 * Watch: https://github.com/appropriate/docker-postgis/issues/8
 */
function save (location, cb) {
  var query = FIND_BY_USER_ID
  var values = [location.user_id]
  db.query(query, values, function (err, results) {
    if (err) return cb(err)
    if (results.rows.length) {
      values = [
        results.rows[0].id,
        location.name,
        location.address,
        location.isPublic,
        location.zipcode,
        location.state,
        location.city,
        location.available,
        location.price,
        location.latitude,
        location.longitude,
        location.description,
        location.phone,
        location.freeRange,
        location.organic,
        location.driveUp
      ]
      query = UPDATE_LOCATION
      db.query(query, values, function (err, results) {
        if (err) return cb(err)
        return cb(null, results)
      })
    } else {
      values = [
        location.user_id,
        location.name,
        location.address,
        location.isPublic,
        location.zipcode,
        location.state,
        location.city,
        location.available,
        location.price,
        location.latitude,
        location.longitude,
        location.description,
        location.phone,
        location.freeRange,
        location.organic,
        location.driveUp
      ]
      query = INSERT_LOCATION
      db.query(query, values, function (err, results) {
        if (err) return cb(err)
        if (results.rows.length) {
          results = results.rows[0].id
        }
        return cb(null, results)
      })
    }
  })
}

/**
 * Remove a user from the database
 * @param  {[type]}   id [description]
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
function remove (id, cb) {
  var query = REMOVE_USER
  var values = [id]
  db.query(query, values, function (err, results) {
    if (err) return cb(err)
    return cb(null, results.rowCount)
  })
}

/**
 * Find a single user with `id`
 * @param  {Number|String}   id
 * @param  {Function} cb
 * @return {Object}
 */
function findById (id, cb) {
  var query = FIND_BY_ID
  var values = [id]
  db.query(query, values, function (err, results) {
    if (err) return cb(err)
    if (results.rows.length) {
      results = fixCase(results.rows[0])
    } else {
      results = null
    }
    return cb(null, results)
  })
}

/**
 * Find a single user with `id`
 * @param  {Number|String}   id
 * @param  {Function} cb
 * @return {Object}
 */
function findByUserId (uid, cb) {
  var query = FIND_BY_USER_ID
  var values = [uid]
  db.query(query, values, function (err, results) {
    if (err) return cb(err)
    if (results.rows.length) {
      results = fixCase(results.rows[0])
    } else {
      results = null
    }
    return cb(null, results)
  })
}

function findRecent (count, cb) {
  var query = FIND_RECENT
  var values = [count]
  db.query(query, values, function (err, results) {
    if (err) return cb(err)
    if (results.rows.length) {
      results = fixCase(results.rows)
    } else {
      results = null
    }
    return cb(null, results)
  })
}

// TODO: Return geoJSON
function findWithinRadius (latitude, longitude, radius, cb) {
  var query = FIND_WITHIN_RADIUS
  var values = [latitude, longitude, milesToMeters(radius)]
  db.query(query, values, function (err, results) {
    if (err) return cb(err)
    var rows = results.rows.length ? results.rows : []
    return cb(null, rows)
  })
}

/**
 * Remove all users from the database
 * @param  {Function} cb
 * @return {Number}      [description]
 */
function removeAll (cb) {
  var query = REMOVE_ALL
  db.query(query, [], function (err, results) {
    if (err) return cb(err)
    return cb(null, results.rowCount)
  })
}

module.exports = {
  save: save,
  remove: remove,
  removeAll: removeAll,
  findById: findById,
  findRecent: findRecent,
  findByUserId: findByUserId,
  findWithinRadius: findWithinRadius
}
