var db = require('./db')

var FIND_BY_USER_ID = 'SELECT user_id, token, created_at FROM tokens WHERE user_id=$1'
var FIND_BY_TOKEN = 'SELECT user_id, token, created_at FROM tokens WHERE token=$1'
var REMOVE_BY_USER_ID = 'DELETE FROM tokens WHERE user_id=$1'
var INSERT = 'INSERT INTO tokens (user_id, token) VALUES ($1, $2)'
var REMOVE_ALL = 'DELETE FROM tokens'

function save (userId, token, cb) {
  var query = REMOVE_BY_USER_ID
  var values = [userId]
  db.query(query, values, function (err, results) {
    if (err) return cb(err)
    query = INSERT
    values = [userId, token]
    db.query(query, values, function (err, results) {
      if (err) return cb(err)
      return cb(null, results)
    })
  })
}

function remove (userId, cb) {
  var query = REMOVE_BY_USER_ID
  var values = [userId]
  db.query(query, values, function (err, results) {
    if (err) return cb(err)
    return cb(null, results.rowCount)
  })
}

function findByUserID (userId, cb) {
  var query = FIND_BY_USER_ID
  var values = [userId]
  db.query(query, values, function (err, results) {
    if (err) return cb(err)
    if (results.rows.length) {
      results = results.rows[0]
    } else {
      results = null
    }
    return cb(null, results)
  })
}

function findByToken (token, cb) {
  var query = FIND_BY_TOKEN
  var values = [token]
  db.query(query, values, function (err, results) {
    if (err) return cb(err)
    if (results.rows.length) {
      results = results.rows[0]
    } else {
      results = null
    }
    return cb(null, results)
  })
}

/**
 * Remove all tokens from the database
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
  findByUserID: findByUserID,
  findByToken: findByToken,
  removeAll: removeAll
}
