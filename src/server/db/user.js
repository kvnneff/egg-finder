var Failure = require('failure')
var db = require('./db')

// var UPSERT_USER = 'INSERT INTO users (auth_id, nickname) VALUES ($1, $2) ON CONFLICT (auth_id) DO UPDATE SET nickname=$2 RETURNING id'
var REMOVE_USER = 'DELETE FROM users WHERE id=$1'
var FIND_BY_ID = 'SELECT id, email, password FROM users WHERE id=$1'
var FIND_BY_EMAIL = 'SELECT id, email, password FROM users WHERE email=$1'
var FIND_BY_RESET_TOKEN = 'SELECT id, email, password FROM users WHERE password_reset_token=$1 AND password_reset_expires >= NOW()'
var REMOVE_ALL = 'DELETE FROM users'
var UPDATE_USER = 'UPDATE users SET email=$2, password=$3 WHERE id=$1'
var VALID_EMAIL = 'UPDATE users SET email_verified=true WHERE id=$1'
var INSERT_USER = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, password'
var INSERT_PASSWORD_RESET = 'UPDATE users set password_reset_token=$2, password_reset_expires=NOW() + interval \'1 hour\' WHERE id=$1 RETURNING email'
var UPDATE_PASSWORD = 'UPDATE users set password=$2, password_reset_token=NULL, password_reset_expires=NULL WHERE id=$1'

/**
 * Save to the database and return the user id.
 * @param  {Object}   user
 * @param  {Function} cb
 * @return {Number}
 */
// function save (user, cb) {
//   var query = UPSERT_USER
//   var values = [user.authId, user.nickname]
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
function save (user, cb) {
  var query = FIND_BY_ID
  var values = [user.id]
  db.query(query, values, function (err, results) {
    if (err) return cb(Failure(err, { type: 'DatabaseError' }))
    if (results.rows.length) {
      query = UPDATE_USER
      values = [user.id, user.email, user.password]
      db.query(query, values, function (err, results) {
        if (err) return cb(err)
        return cb(null, results)
      })
    } else {
      query = INSERT_USER
      values = [user.email, user.password]
      db.query(query, values, function (err, results) {
        if (err) return cb(Failure(err, { type: 'DatabaseError' }))
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
    if (err) return cb(Failure(err, { type: 'DatabaseError' }))
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
    if (err) return cb(Failure(err, { type: 'DatabaseError' }))
    if (results.rows.length) {
      results = results.rows[0]
    } else {
      results = null
    }
    return cb(null, results)
  })
}

/**
 * Find a single user with `email`
 * @param  {String}   Email
 * @param  {Function} cb
 * @return {Object}
 */
function findByEmail (email, cb) {
  var query = FIND_BY_EMAIL
  var values = [email]
  db.query(query, values, function (err, results) {
    if (err) return cb(Failure(err, { type: 'DatabaseError' }))
    if (results.rows.length) {
      results = results.rows[0]
    } else {
      results = null
    }
    return cb(null, results)
  })
}

function updatePassword (id, password, cb) {
  var query = UPDATE_PASSWORD
  var values = [id, password]
  db.query(query, values, function (err, results) {
    if (err) return cb(Failure(err, { type: 'DatabaseError' }))
    return cb(null)
  })
}

function initPasswordReset (userId, resetToken, cb) {
  var query = INSERT_PASSWORD_RESET
  var values = [userId, resetToken]
  db.query(query, values, function (err, results) {
    if (err) return cb(Failure(err, { type: 'DatabaseError' }))
    if (results.rows.length) {
      results = results.rows[0]
    } else {
      results = null
    }
    return cb(null, results)
  })
}

function findByResetToken (token, cb) {
  var query = FIND_BY_RESET_TOKEN
  var values = [token]
  db.query(query, values, function (err, results) {
    if (err) return cb(Failure(err, { type: 'DatabaseError' }))
    if (results.rows.length) {
      results = results.rows[0]
    } else {
      results = null
    }
    return cb(null, results)
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
    if (err) return cb(Failure(err, { type: 'DatabaseError' }))
    return cb(null, results.rowCount)
  })
}

function validEmail (userId, cb) {
  var query = VALID_EMAIL
  db.query(query, [userId], function (err, results) {
    if (err) return cb(Failure(err, { type: 'DatabaseError' }))
    return cb(null)
  })
}

module.exports = {
  save: save,
  remove: remove,
  findById: findById,
  findByEmail: findByEmail,
  removeAll: removeAll,
  validEmail: validEmail,
  updatePassword: updatePassword,
  initPasswordReset: initPasswordReset,
  findByResetToken: findByResetToken
}
